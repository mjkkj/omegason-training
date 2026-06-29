-- ============================================================
-- PHÂN QUYỀN (role management) — chạy trong Supabase SQL Editor
-- ============================================================
-- Hệ thống 3 cấp: owner > manager (Supervisor) > employee.
-- Trang "Phân quyền" cho phép OWNER nâng/hạ quyền Supervisor <-> Employee
-- bằng cách UPDATE cột profiles.role. Nếu bảng profiles đang bật
-- Row Level Security (RLS), cần các policy bên dưới để cho phép.

-- 1) Cho phép MỌI người đăng nhập ĐỌC danh sách hồ sơ
--    (cần cho màn hình Nhân viên / Phân quyền).
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read"
  on public.profiles for select
  to authenticated
  using (true);

-- 2) Hàm phụ kiểm tra cấp bậc, tránh đệ quy RLS khi đọc chính bảng profiles.
create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

create or replace function public.is_manager()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('owner', 'manager')
  );
$$;

-- 3) Chỉ OWNER được đổi cột role của người khác (nâng/hạ Supervisor <-> Employee).
--    Supervisor (manager) KHÔNG có quyền đổi role — chỉ Owner quản lý phân quyền.
--    check thêm chặn việc gán role 'owner' qua UI (chuyển giao Owner nằm ngoài phạm vi UI này).
drop policy if exists "managers update roles" on public.profiles;
drop policy if exists "owner update roles" on public.profiles;
create policy "owner update roles"
  on public.profiles for update
  to authenticated
  using (public.is_owner())
  with check (public.is_owner() and role in ('manager', 'employee'));

-- 4) Cho người dùng tự cập nhật thông tin hồ sơ của chính mình (không đổi role).
drop policy if exists "self update profile" on public.profiles;
create policy "self update profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- ============================================================
-- BOOTSTRAP: chỉ định OWNER ĐẦU TIÊN
-- ============================================================
-- Mọi tài khoản đăng ký mới mặc định là 'employee'. Phải có đúng 1
-- Owner (đặt thủ công, không qua UI) để vào được trang Phân quyền.
-- Thay email bên dưới rồi chạy:

-- update public.profiles set role = 'owner'
-- where id = (select id from auth.users where email = 'YOUR_EMAIL@example.com');

-- ============================================================
-- MIGRATION (nếu đang chạy hệ thống 2 cấp cũ manager/employee)
-- ============================================================
-- Không cần đổi dữ liệu: 'manager' tiếp tục là giá trị DB cho Supervisor.
-- Chỉ cần chạy bootstrap trên để chỉ định 1 Owner, các 'manager' hiện có
-- tự động trở thành Supervisor (không còn truy cập trang Phân quyền).

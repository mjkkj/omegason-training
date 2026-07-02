-- ============================================================
-- PHÂN QUYỀN (role management) — chạy trong Supabase SQL Editor
-- ============================================================
-- Trang "Phân quyền" cho phép quản lý nâng/hạ quyền tài khoản
-- bằng cách UPDATE cột profiles.role. Nếu bảng profiles đang bật
-- Row Level Security (RLS), cần policy bên dưới để cho phép.

-- 1) Cho phép MỌI người đăng nhập ĐỌC danh sách hồ sơ
--    (cần cho màn hình Nhân viên / Phân quyền).
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read"
  on public.profiles for select
  to authenticated
  using (true);

-- 2) Cho phép QUẢN LÝ cập nhật hồ sơ của bất kỳ ai (đổi role).
--    Dùng hàm phụ để tránh đệ quy RLS khi đọc chính bảng profiles.
create or replace function public.is_manager()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'manager'
  );
$$;

drop policy if exists "managers update roles" on public.profiles;
create policy "managers update roles"
  on public.profiles for update
  to authenticated
  using (public.is_manager())
  with check (public.is_manager());

-- 3) (tùy chọn) Cho người dùng tự cập nhật hồ sơ của chính mình.
drop policy if exists "self update profile" on public.profiles;
create policy "self update profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- 4) Cho phép QUẢN LÝ XOÁ hồ sơ của người khác (xoá tài khoản).
--    Dùng cho nút "Xoá tài khoản" ở màn hình Phân quyền.
drop policy if exists "managers delete profiles" on public.profiles;
create policy "managers delete profiles"
  on public.profiles for delete
  to authenticated
  using (public.is_manager());

-- 5) Cho phép QUẢN LÝ XOÁ bài nộp (dọn dữ liệu liên quan khi xoá tài khoản).
--    Nếu bảng submissions đã có khoá ngoại ON DELETE CASCADE tới profiles thì
--    policy này là tuỳ chọn; giữ lại để việc xoá luôn hoạt động.
drop policy if exists "managers delete submissions" on public.submissions;
create policy "managers delete submissions"
  on public.submissions for delete
  to authenticated
  using (public.is_manager());

-- LƯU Ý: Việc này chỉ xoá hồ sơ (profiles) + bài nộp. Bản ghi ĐĂNG NHẬP trong
-- auth.users KHÔNG bị xoá bằng anon key. Muốn xoá hẳn tài khoản đăng nhập, vào
-- Supabase Dashboard → Authentication → Users → xoá user (cần service_role).

-- ============================================================
-- BOOTSTRAP: chỉ định QUẢN LÝ ĐẦU TIÊN
-- ============================================================
-- Mọi tài khoản đăng ký mới mặc định là 'employee'. Phải có ít
-- nhất 1 quản lý đầu tiên (đặt thủ công) để vào được trang Phân quyền.
-- Thay email bên dưới rồi chạy:

-- update public.profiles set role = 'manager'
-- where id = (select id from auth.users where email = 'YOUR_EMAIL@example.com');

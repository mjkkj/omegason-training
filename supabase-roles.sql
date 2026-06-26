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

-- ============================================================
-- BOOTSTRAP: chỉ định QUẢN LÝ ĐẦU TIÊN
-- ============================================================
-- Mọi tài khoản đăng ký mới mặc định là 'employee'. Phải có ít
-- nhất 1 quản lý đầu tiên (đặt thủ công) để vào được trang Phân quyền.
-- Thay email bên dưới rồi chạy:

-- update public.profiles set role = 'manager'
-- where id = (select id from auth.users where email = 'YOUR_EMAIL@example.com');

-- ============================================================
-- RLS cho BÀI NỘP (submissions) — bắt buộc để cách ly dữ liệu
-- ============================================================
-- Nếu không bật RLS + policy, học viên này có thể đọc/sửa bài của
-- học viên khác (anon key là public). Bật RLS rồi tạo policy:
alter table public.submissions enable row level security;

-- Học viên toàn quyền trên BÀI CỦA CHÍNH MÌNH (xem / nộp / sửa / nộp lại).
drop policy if exists "own submissions" on public.submissions;
create policy "own submissions"
  on public.submissions for all
  to authenticated
  using (employee_id = auth.uid())
  with check (employee_id = auth.uid());

-- Quản lý ĐỌC mọi bài (hàng chờ chấm, hồ sơ, thống kê, matrix).
drop policy if exists "managers read submissions" on public.submissions;
create policy "managers read submissions"
  on public.submissions for select
  to authenticated
  using (public.is_manager());

-- Quản lý CHẤM bài (update status/feedback/graded_at) trên mọi bài.
drop policy if exists "managers grade submissions" on public.submissions;
create policy "managers grade submissions"
  on public.submissions for update
  to authenticated
  using (public.is_manager())
  with check (public.is_manager());

-- ============================================================
-- RLS cho TÀI NGUYÊN ĐÀO TẠO (task_resources / video gợi ý)
-- ============================================================
alter table public.task_resources enable row level security;

-- Mọi người đăng nhập ĐỌC được video gợi ý.
drop policy if exists "task_resources read" on public.task_resources;
create policy "task_resources read"
  on public.task_resources for select
  to authenticated
  using (true);

-- Chỉ QUẢN LÝ thêm/sửa video (trang "Nội dung đào tạo").
drop policy if exists "managers write task_resources" on public.task_resources;
create policy "managers write task_resources"
  on public.task_resources for all
  to authenticated
  using (public.is_manager())
  with check (public.is_manager());

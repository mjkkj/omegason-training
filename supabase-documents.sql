-- ============================================================
-- TÀI LIỆU (documents) — chạy trong Supabase SQL Editor
-- ============================================================
-- Bảng lưu tài liệu tham khảo do quản lý đăng, học viên xem/tải về.
-- File được lưu base64 trực tiếp trong cột file_data (giống cách
-- submissions.file_content đang lưu), giới hạn 30MB/tệp ở phía client.

create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text default '',
  file_name   text not null,
  file_data   text not null,
  file_size   bigint default 0,
  mime_type   text default '',
  uploaded_by uuid references public.profiles(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.documents enable row level security;

-- Bảo đảm hàm is_manager() tồn tại (thường được tạo trong supabase-roles.sql).
-- Khai báo lại ở đây để script này chạy độc lập, không lỗi nếu chạy trước roles.
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

-- 1) Mọi người đã đăng nhập (employee + manager) được ĐỌC danh sách tài liệu.
drop policy if exists "documents read" on public.documents;
create policy "documents read"
  on public.documents for select
  to authenticated
  using (true);

-- 2) Chỉ QUẢN LÝ được thêm/sửa/xoá tài liệu.
drop policy if exists "managers insert documents" on public.documents;
create policy "managers insert documents"
  on public.documents for insert
  to authenticated
  with check (public.is_manager());

drop policy if exists "managers update documents" on public.documents;
create policy "managers update documents"
  on public.documents for update
  to authenticated
  using (public.is_manager())
  with check (public.is_manager());

drop policy if exists "managers delete documents" on public.documents;
create policy "managers delete documents"
  on public.documents for delete
  to authenticated
  using (public.is_manager());

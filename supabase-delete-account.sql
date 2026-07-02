-- ============================================================
-- XOÁ TÀI KHOẢN hr@omegason.com — chạy trong Supabase SQL Editor
-- ============================================================
-- Script này xoá hồ sơ (profiles) + bài nộp (submissions) của tài khoản,
-- và xoá luôn bản ghi ĐĂNG NHẬP trong auth.users.
--
-- LƯU Ý QUAN TRỌNG:
--   • SQL Editor chạy với quyền cao (service_role) nên xoá được auth.users.
--     KHÔNG thể làm điều này từ ứng dụng bằng anon key.
--   • Thao tác này KHÔNG HOÀN TÁC ĐƯỢC. Hãy chắc chắn đúng email.
--   • Đổi email bên dưới nếu cần.

do $$
declare
  target_email text := 'hr@omegason.com';
  target_id    uuid;
begin
  select id into target_id from auth.users where email = target_email;

  if target_id is null then
    raise notice 'Không tìm thấy tài khoản có email %', target_email;
    return;
  end if;

  -- 1) Dọn bài nộp liên quan (nếu chưa có ON DELETE CASCADE).
  delete from public.submissions where employee_id = target_id;

  -- 2) Xoá hồ sơ.
  delete from public.profiles where id = target_id;

  -- 3) Xoá bản ghi đăng nhập.
  delete from auth.users where id = target_id;

  raise notice 'Đã xoá tài khoản % (id=%)', target_email, target_id;
end $$;

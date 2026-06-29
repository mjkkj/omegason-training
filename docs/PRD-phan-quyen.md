# PRD — Hệ thống Phân quyền (Permission System)

## 1. Bối cảnh

Hệ thống hiện tại chỉ có 2 cấp quyền: `manager` (Quản lý) và `employee`
(Nhân viên), với cơ chế nâng/hạ 2 chiều ngang hàng — bất kỳ Quản lý nào
cũng có thể nâng/hạ bất kỳ ai. Mô hình này thiếu một cấp "chủ sở hữu hệ
thống" để kiểm soát ai được trở thành Quản lý, dẫn tới rủi ro: một Quản lý
có thể tự ý nâng quyền cho người khác hoặc hạ quyền đồng cấp.

## 2. Mục tiêu

Tái cấu trúc phân quyền theo **3 cấp phân cấp dọc, một chiều**:

```
Owner  (1 người, cao nhất)
  └── Supervisor  (nhiều người, do Owner chỉ định)
        └── Employee  (nhiều người, mặc định khi đăng ký)
```

- Chỉ **Owner** có quyền nâng/hạ giữa Supervisor ⇄ Employee.
- **Supervisor** không có quyền đổi role của bất kỳ ai (kể cả Employee).
- **Employee** không có quyền quản trị nào ngoài dữ liệu của chính mình.
- Không ai (kể cả Owner) tự đổi quyền của chính mình qua UI.
- Việc tạo/chuyển giao Owner nằm **ngoài phạm vi UI** — chỉ thực hiện qua
  Supabase SQL Editor (xem `supabase-roles.sql`), nhằm tránh leo thang
  đặc quyền (privilege escalation) qua giao diện web.

## 3. Vai trò & Ma trận quyền

| Khu vực / Hành động                          | Owner | Supervisor | Employee |
|-----------------------------------------------|:----:|:----------:|:--------:|
| Xem Thống kê tổng (`/mgr/stats`)               | ✅   | ✅         | ❌       |
| Xem Bảng tiến độ toàn team (`/mgr/matrix`)     | ✅   | ✅         | ❌       |
| Chấm bài / Hàng chờ chấm (`/mgr/queue`)        | ✅   | ✅         | ❌       |
| Xem danh sách & hồ sơ Nhân viên (`/mgr/employees`) | ✅ | ✅       | ❌       |
| Quản trị Nội dung đào tạo (`/mgr/training`)    | ✅   | ✅         | ❌       |
| Tải lên / sửa / xoá Tài liệu (`/mgr/documents`)| ✅   | ✅         | ❌ (chỉ xem) |
| **Phân quyền** — nâng/hạ Supervisor ⇄ Employee | ✅   | ❌         | ❌       |
| Tạo/chuyển giao Owner mới                       | Chỉ qua SQL | ❌ | ❌  |
| Nộp bài / xem lộ trình cá nhân (`/emp/*`)      | ❌   | ❌         | ✅       |
| Xem tài liệu chia sẻ (read-only)               | ✅   | ✅         | ✅       |

Ghi chú:
- Owner và Supervisor dùng chung khu vực `/mgr/*` (cùng trải nghiệm vận
  hành), khác biệt duy nhất là Owner thấy thêm mục "Phân quyền".
- Employee chỉ truy cập khu vực `/emp/*`, không thấy dữ liệu của người khác.

## 4. Quy tắc nghiệp vụ

1. **Một Owner duy nhất theo thiết kế.** Hệ thống không chặn cứng nhiều
   Owner ở DB, nhưng UI và quy trình vận hành giả định chỉ 1 Owner — vai
   trò này được gán thủ công lúc khởi tạo hệ thống (bootstrap SQL), không
   qua giao diện.
2. **Owner không thể tự đổi quyền của mình** (giữ nguyên hành vi cũ, áp
   dụng cho mọi cấp).
3. **Supervisor không thấy/không gọi được API đổi role** — cả ở UI
   (route `/mgr/roles` chặn bằng Guard) và ở RLS (policy `owner update
   roles` chỉ cho phép khi `is_owner()` đúng).
4. **Không thể gán role `owner` qua UI.** Policy RLS giới hạn
   `with check (... and role in ('manager','employee'))` — mọi request
   update cố gán `role = 'owner'` sẽ bị DB từ chối, bất kể front-end có
   bị qua mặt hay không.
5. **Mặc định đăng ký mới luôn là Employee** — không đổi so với hiện tại.
6. **Migration không phá vỡ dữ liệu cũ:** giá trị DB của Supervisor vẫn
   là `'manager'` (không đổi tên cột/giá trị), tránh phải migrate dữ liệu
   hiện có. Chỉ cần bootstrap 1 tài khoản `role = 'owner'`.

## 5. Thay đổi kỹ thuật

- `src/roles.js` (mới): hằng số `ROLES`, nhãn hiển thị `ROLE_LABEL`, helper
  `homePathFor(role)`.
- `src/App.jsx`: `Guard` nhận `allow` là 1 role hoặc danh sách role;
  `/mgr/*` cho phép `[owner, manager]`, riêng `/mgr/roles` chỉ `owner`.
- `src/components/Shell.jsx`: mục "Phân quyền" trong sidebar chỉ hiện với
  Owner; nhãn vai trò hiển thị đúng "Owner" / "Supervisor".
- `src/pages/manager/Roles.jsx`: UI nhóm theo 3 cấp (Owner / Supervisor /
  Employee), chỉ cho phép thao tác nâng/hạ giữa Supervisor và Employee;
  dòng Owner không có hành động.
- `supabase-roles.sql`: thêm `is_owner()`, policy `owner update roles`
  (thay cho `managers update roles` cũ) giới hạn người thao tác là Owner
  và giá trị đích chỉ trong `{manager, employee}`.

## 6. Ngoài phạm vi (Out of scope)

- Chuyển giao Owner qua UI (đổi Owner hiện tại sang Owner khác).
- Nhiều Owner đồng thời với phân quyền chi tiết giữa các Owner.
- Audit log lịch sử đổi quyền (có thể là phần mở rộng sau).
- Phân quyền chi tiết hơn theo từng tính năng cho Supervisor (hiện tại
  Supervisor có full quyền vận hành như nhau).

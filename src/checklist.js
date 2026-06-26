import { TASK_CONTENT } from './data'

// ── Nội dung checklist thao tác cho từng module ────────────────────────────
// Quản lý tick từng mục khi chấm; điểm module = % mục đã tick.
export const CHECKLISTS = {
  '01': [
    'Shortlist ≥5 SP, mỗi SP có nguồn + lý do cầu + link',
    '≥3 SP soi Ad Library, đủ 4 dấu hiệu winner + screenshot',
    'Scorecard 6 tiêu chí cho cả shortlist',
    '2 SP top có supplier + giá vốn + breakeven ROAS (số cụ thể)',
    'Chốt 1–2 SP test kéo xuyên khóa',
  ],
  '02': [
    'Product page đủ 11 block CRO',
    'Bundle + upsell + freeship threshold live',
    'Pixel + CAPI báo Purchase (test bắn, có dedup)',
    'Payment + shipping + đủ trang policy',
    'Test order chạy hết checkout',
  ],
  '03': [
    'SP import, ảnh sạch, biến thể đúng',
    '3 số pricing ghi vào brief (vốn / bán / breakeven ROAS)',
    'Mô tả benefit-led (kèm bản AI thô vs bản sửa giọng brand)',
    'Test order OK',
  ],
  '04': [
    'Đúng số creative theo giai đoạn (3–4 test / 9 scale)',
    'Phân tầng TOP / MID / BOTTOM rõ',
    'Xuất 9:16 + 4:5, 15–30s',
    'Qua policy lingerie check',
    'Đặt tên đúng naming convention',
  ],
  '05': [
    'Chọn đúng cấu trúc (5A test / 5B scale)',
    'Purchase track đúng (test bắn)',
    'Ngân sách + lịch + breakeven ghi rõ',
    'Không đụng vào trong 3–4 ngày learning',
  ],
  '06': [
    'Dựng phễu CPM→CTR→CPC→ATC→IC→Purchase→CPA/ROAS, điền số thật',
    'Đọc số sau 48–72h (qua learning mới phán)',
    'Chỉ đúng nút thắt lớn nhất (Triệu chứng→Nguyên nhân→Hành động)',
    '1 insight rút ra từ breakdown',
  ],
  '07': [
    'Funnel Sessions→ATC→Checkout→Purchase + CVR từng bước + AOV',
    'Tính MER & giải thích chênh với ROAS Meta',
    '≥5 session recording + heatmap (Clarity)',
    '≥1 điểm CRO cần sửa, nối về product page',
  ],
  '08': [
    'Đọc số sau 48–72h, không đụng trong learning',
    '1 quyết định kill / scale CÓ SỐ (ngưỡng + chỉ số + lý do + bước tiếp)',
    'Lên lịch creative tuần kế (chống fatigue)',
    '≥3 đòn tối ưu song song (retargeting + Klaviyo flow + A/B CRO)',
  ],
  'F': [
    'Research: ngách có cầu thật + margin sống được',
    'Store / Listing: product page đạt CRO + tracking đúng',
    'Creative: ≥1 bộ đặt tên chuẩn, qua self-audit policy',
    'Ads: campaign test có cấu trúc + giả thuyết viết trước',
    'Đọc số: chỉ đúng nút thắt (Meta funnel + store funnel có MER)',
    'Quyết định: 1 call kill / scale có số + bước tiếp',
    'Project Log đầy đủ + bài trình bày 10 phút',
  ],
}

export function getChecklist(taskId) {
  return CHECKLISTS[taskId] || TASK_CONTENT[taskId]?.pass || []
}

// ── Lưu/đọc kết quả chấm trong cột `feedback` (JSON, không đổi schema) ──────
// Tương thích ngược: feedback text thường → coi là comment, checked rỗng.
export function parseReview(sub) {
  const raw = sub?.feedback
  if (!raw) return { checked: [], comment: '' }
  try {
    const o = JSON.parse(raw)
    if (o && o.__chk === 1) {
      return { checked: Array.isArray(o.checked) ? o.checked : [], comment: o.comment || '' }
    }
  } catch { /* không phải JSON → coi là comment thường */ }
  return { checked: [], comment: String(raw) }
}

export function buildReview(checked, comment) {
  return JSON.stringify({ __chk: 1, checked: [...checked].sort((a, b) => a - b), comment: comment || '' })
}

// ── Tính điểm % ────────────────────────────────────────────────────────────
// Điểm module: chỉ tính khi đã chấm; = số mục tick / tổng mục × 100.
export function moduleScore(sub, taskId) {
  if (!sub || sub.status !== 'graded') return 0
  const { checked } = parseReview(sub)
  // Tương thích ngược: bài chấm trước khi đổi sang checklist (feedback text,
  // không có mục tick) nhưng có điểm số cũ 0–10 → quy đổi sang %.
  if (checked.length === 0 && sub.grade != null) {
    return Math.round((sub.grade / 10) * 100)
  }
  const total = getChecklist(taskId).length
  if (!total) return 0
  return Math.round((checked.length / total) * 100)
}

// 3 phase CHỈ dùng cho thanh điểm (độc lập với WEEKS / 4 giai đoạn lộ trình).
export const SCORE_PHASES = [
  { key: 'P1', name: 'Nền tảng & store',           taskIds: ['01', '02'] },
  { key: 'P2', name: 'Sản phẩm · Creative · Ads',  taskIds: ['03', '04', '05'] },
  { key: 'P3', name: 'Đọc số · Tối ưu · Capstone', taskIds: ['06', '07', '08', 'F'] },
]

// Phase % = trung bình % các module trong phase (module chưa chấm = 0).
export function phaseScore(subByTaskId, taskIds) {
  if (!taskIds.length) return 0
  const sum = taskIds.reduce((s, id) => s + moduleScore(subByTaskId[id], id), 0)
  return Math.round(sum / taskIds.length)
}

// Tổng = trung bình 3 phase.
export function overallScore(subByTaskId) {
  const sum = SCORE_PHASES.reduce((s, p) => s + phaseScore(subByTaskId, p.taskIds), 0)
  return Math.round(sum / SCORE_PHASES.length)
}

// submissions[] (đã sort mới→cũ) → { taskId: sub mới nhất }.
export function indexByTask(subs) {
  const m = {}
  for (const s of subs) if (!m[s.task_id]) m[s.task_id] = s
  return m
}

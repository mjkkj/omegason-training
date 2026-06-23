// Training program data — static reference, never mutated at runtime.
// Chương trình "Full-Stack Marketer" @ Omegason — 8 module + Capstone.

// Các giai đoạn gom nhóm 8 module để hiển thị lộ trình / thống kê.
export const WEEKS = [
  { wk: 'Giai đoạn 1', short: 'GĐ 1', theme: 'Nghiên cứu ngách & sản phẩm', taskIds: ['01'] },
  { wk: 'Giai đoạn 2', short: 'GĐ 2', theme: 'Dựng & hoàn thiện store',      taskIds: ['02', '03'] },
  { wk: 'Giai đoạn 3', short: 'GĐ 3', theme: 'Creative & Set-up quảng cáo',  taskIds: ['04', '05'] },
  { wk: 'Giai đoạn 4', short: 'GĐ 4', theme: 'Đọc số & Tối ưu vòng lặp',     taskIds: ['06', '07', '08'] },
];

// Mỗi module = 1 task nộp bài. id '01'..'08' = Module 1..8, 'F' = Capstone (Module 9).
// week = giai đoạn (1..4), dùng để gom nhóm hiển thị.
export const TASKS = [
  { id: '01', name: 'Tìm ngách & nghiên cứu sản phẩm',        week: 1, daysFromStart:  6, file: 'Project Log + bảng scorecard + ảnh chụp Ad Library', hours: 5 },
  { id: '02', name: 'Dựng store Shopify',                     week: 2, daysFromStart: 12, file: 'Link store + ảnh chụp Events Manager + test order', hours: 6 },
  { id: '03', name: 'Đưa sản phẩm về store',                  week: 2, daysFromStart: 16, file: 'Link sản phẩm + sheet giá/biên + ảnh', hours: 4 },
  { id: '04', name: 'Creative — nội dung quảng cáo',          week: 3, daysFromStart: 22, file: 'Bộ creative (ảnh/video) + hook bank + bảng audit', hours: 6, key: true },
  { id: '05', name: 'Set-up chiến dịch Facebook Ads',         week: 3, daysFromStart: 27, file: 'Ảnh cấu trúc campaign + kế hoạch ngân sách', hours: 4 },
  { id: '06', name: 'Đọc chỉ số Facebook Ads',                week: 4, daysFromStart: 32, file: 'Bảng phễu chỉ số + phần chẩn đoán + ảnh', hours: 4 },
  { id: '07', name: 'Phân tích trên Shopify',                 week: 4, daysFromStart: 36, file: 'Funnel store + tính MER + ảnh heatmap', hours: 4 },
  { id: '08', name: 'Tối ưu quảng cáo (vòng lặp)',            week: 4, daysFromStart: 40, file: 'Memo kill/scale + lịch creative', hours: 5, key: true },
  { id: 'F',  name: 'Capstone — Dự án end-to-end',            week: 5, daysFromStart: 49, file: 'Project Log đầy đủ + slide/clip trình bày 10 phút', hours: 12, final: true },
];

// Nhãn module hiển thị: '01'..'08' -> "Module 1".."Module 8", 'F' -> "Capstone".
export function moduleLabel(task) {
  if (!task) return ''
  if (task.final) return 'Capstone'
  return `Module ${parseInt(task.id, 10)}`
}

// Calculate a task's absolute deadline from the employee's start_date (ISO date string 'YYYY-MM-DD')
export function calcDeadline(task, startDate) {
  if (!startDate) {
    const d = new Date(); d.setDate(d.getDate() + task.daysFromStart); d.setHours(18,0,0,0); return d.toISOString()
  }
  const [y, m, day] = startDate.split('-').map(Number)
  return new Date(y, m - 1, day + task.daysFromStart, 18, 0, 0).toISOString()
}

// Nội dung chi tiết từng module — lấy từ "Bài tập thực hành — Full-Stack Marketing Playbook".
// learn: cần nắm · exercises: bài thực hành (3 bài) · pass: tiêu chuẩn đạt · traps: bẫy thường gặp
// videos: tên video gợi ý (quản lý sẽ thêm link thật) · description: đầu ra cần nộp
export const TASK_CONTENT = {
  '01': {
    learn: ['Tự chọn ngách dựa trên tín hiệu cầu', 'Quét trend đa nguồn (Ad Library + trend + supplier)', 'Đọc dấu hiệu "winner" trong Ad Library', 'Product Scorecard 6 tiêu chí', 'Breakeven ROAS = 1 / gross margin', 'Đặt trần ad spend cho ngách'],
    note: 'Quy tắc xuyên suốt khóa — "một sản phẩm, kéo tới cùng": chọn 1 ngách + 1–2 sản phẩm ở Module này và KHÔNG đổi (trừ khi fail validate/margin có bằng chứng), kéo chính nó tới Capstone. Nộp kèm 1 Project Log ghi quyết định + số liệu của từng module.',
    exercises: [
      { code: 'Bài 1.1', title: 'Quét trend & dựng shortlist', desc: 'Tự chọn 1 hướng ngách mình tin (không bị giới hạn). Dùng tối thiểu 3 nguồn (Ad Library + 1 nguồn trend + 1 nguồn supplier) lập shortlist 5–10 sản phẩm. Mỗi SP ghi: nguồn phát hiện, lý do tin có cầu, link.' },
      { code: 'Bài 1.2', title: 'Đọc "winner" trong Ad Library', desc: 'Chọn 3 SP trong shortlist, vào Facebook Ad Library tìm advertiser đang chạy. Chứng minh winner bằng 4 dấu hiệu: ad chạy bao lâu, số biến thể creative, mức engagement, bao nhiêu advertiser cùng bán. Kèm screenshot.' },
      { code: 'Bài 1.3', title: 'Chấm Product Scorecard & chốt margin', desc: 'Chấm cả shortlist bằng 6 tiêu chí scorecard (1–5đ). Với 2 SP điểm cao nhất: tìm supplier thật + giá vốn, tính markup và breakeven ROAS = 1 / gross margin. Đặt trần ad spend hợp lý và kiểm tra SP có sống nổi không.' },
    ],
    pass: ['Shortlist ≥5 SP có lý do cầu rõ ràng (không phải "thấy hay")', '≥2 SP đạt ngưỡng scorecard tự đặt, có supplier + giá vốn thật', 'Tính được breakeven ROAS bằng số cụ thể, không ước lượng mồm', 'Chốt 1–2 SP test để kéo qua các module sau'],
    traps: ['Chọn SP vì "đẹp/cool" mà không có tín hiệu cầu hay margin', 'Chọn ngách tiện ích giá rẻ phải cạnh tranh giá → creative khó, biên mỏng', 'Tự cho điểm scorecard cao mà không có bằng chứng từng tiêu chí'],
    videos: ['Facebook Ad Library Product Research', 'How To Find Winning Products 2025', 'Product Scorecard & Margin Math for Ecommerce'],
    description: 'Project Log ghi rõ: shortlist 5–10 SP kèm nguồn/lý do/link · 3 SP phân tích Ad Library + screenshot · bảng scorecard 6 tiêu chí · supplier + giá vốn + breakeven ROAS của 2 SP top · chốt 1–2 SP test kéo xuyên khóa.',
  },
  '02': {
    learn: ['Product page theo template CRO', 'Các khối CRO bắt buộc (hero, trust, review, FAQ…)', 'Meta Pixel + Conversions API (server-side)', 'GA4 & 5 sự kiện chuẩn', 'Dedup browser/server', 'Payment, shipping, free-ship threshold, trang policy'],
    exercises: [
      { code: 'Bài 2.1', title: 'Dựng Product Page theo template CRO', desc: 'Dựng product page hoàn chỉnh cho SP test, đủ khối: hero media (ảnh+video), tiêu đề benefit, giá + ưu đãi, bullet lợi ích, size/spec guide, ATC sticky, trust badges, review/UGC, bundle/upsell, FAQ, mô tả dài. Nội dung thật, không placeholder.' },
      { code: 'Bài 2.2', title: 'Cài & nghiệm thu Pixel + CAPI', desc: 'Cài Meta Pixel kèm Conversions API (server-side) + GA4. Bắn đủ 5 sự kiện: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase. Chụp Events Manager chứng minh sự kiện về đúng và có dedup giữa browser & server.' },
      { code: 'Bài 2.3', title: 'Nghiệm thu vận hành', desc: 'Bật payment (test mode hoặc thật), set shipping + free-ship threshold, đủ trang policy (refund/shipping/privacy/ToS) + Contact. Đặt 1 test order chạy hết checkout.' },
    ],
    pass: ['Store live, thanh toán chạy', 'Pixel + CAPI báo đúng 5 sự kiện, có dedup', '1 product page đạt chuẩn template làm "khuôn" cho sản phẩm sau'],
    traps: ['Launch khi Pixel/CAPI lỗi hoặc thiếu sự kiện → sau đốt tiền ads mà mù số', 'Product page đẹp nhưng thiếu trust/review/size guide → CTR cao vẫn rớt CVR', 'Quên trang policy → Meta có thể từ chối hoặc hạn chế tài khoản'],
    videos: ['Shopify CRO Product Page Template', 'Meta Pixel + Conversions API Setup 2025', 'Shopify Checkout & Policy Pages Setup'],
    description: 'Link store live + screenshot Events Manager (5 sự kiện + dedup) + screenshot 1 test order hoàn tất. Báo cáo các khối CRO đã dựng trên product page khuôn.',
  },
  '03': {
    learn: ['Hoàn thiện listing đủ ảnh/biến thể/alt text', 'Mô tả benefit-led: hook → lợi ích → cách dùng → trust', 'Dùng AI nhưng sửa lại giọng brand', 'Bảng tính giá & biên (markup → gross margin → breakeven ROAS)', 'Test order end-to-end'],
    exercises: [
      { code: 'Bài 3.1', title: 'Hoàn thiện listing', desc: 'Publish SP test: đủ ảnh theo từng biến thể, ảnh nền sạch đồng nhất, alt text. Mô tả benefit-led theo cấu trúc hook → lợi ích → cách dùng → trust. Được dùng AI nhưng phải sửa lại giọng brand — nộp kèm bản AI thô để so sánh.' },
      { code: 'Bài 3.2', title: 'Bảng tính giá & biên', desc: 'Lập sheet: giá vốn → markup → giá bán → gross margin → breakeven ROAS. Kiểm tra SP có lời sau khi trừ ngưỡng ad spend đặt ở Module 1. Nếu không sống nổi → quay lại đổi giá/biến thể, ghi rõ quyết định.' },
      { code: 'Bài 3.3', title: 'Test order end-to-end', desc: 'Mua thử thật một lần, xác nhận luồng đặt → xác nhận → (mô phỏng) fulfill chạy trơn.' },
    ],
    pass: ['SP publish đủ ảnh/biến thể/giá/mô tả', 'Mô tả có giọng brand (không phải spec dump)', 'Test order chạy được', 'Bảng giá chứng minh có lời'],
    traps: ['Copy-paste mô tả của supplier (spec khô, đôi khi dính từ vi phạm policy)', 'Đặt giá theo cảm tính, không soi breakeven ROAS', 'Ảnh biến thể lệch nhau (lúc nền trắng lúc nền cảnh)'],
    videos: ['Benefit-Led Product Descriptions That Sell', 'Shopify Pricing & Margin Spreadsheet', 'AI Product Copy with Brand Voice'],
    description: 'Link sản phẩm đã publish + bản mô tả AI thô vs bản đã sửa giọng brand + sheet giá/biên (có breakeven ROAS) + xác nhận test order chạy hết luồng.',
  },
  '04': {
    learn: ['Hook bank theo 6 framework', 'Phân biệt người mua vs người dùng (chân dung khách)', '1 concept × nhiều biến thể (video + ảnh)', 'Xuất đúng tỷ lệ 9:16 & 4:5', 'Naming convention SP_Concept_Hook_Ratio_v1', 'Self-audit policy nền tảng'],
    note: 'Đây là module TRỌNG TÂM của khóa. Quy tắc "1 biến/lần" khi test variant — đổi nhiều biến cùng lúc sẽ không biết yếu tố nào thắng.',
    exercises: [
      { code: 'Bài 4.1', title: 'Hook bank', desc: 'Viết 10 hook cho SP test, phủ đủ 6 framework (Pattern interrupt, Problem-Agitate, "POV…", "3 lý do…", Testimonial, Unboxing). Mỗi hook ghi rõ nhắm vào ai (người mua hay người dùng).' },
      { code: 'Bài 4.2', title: 'Sản xuất 1 concept × nhiều biến thể', desc: 'Làm 1 concept với 4 hook variants (video) + 2–3 ảnh ad. Xuất đúng tỷ lệ (tối thiểu 9:16 và 4:5). Đặt tên theo naming convention SP_Concept_Hook_Ratio_v1 để sau phân tích biết cái nào thắng.' },
      { code: 'Bài 4.3', title: 'Tự audit policy', desc: 'Soi từng creative qua checklist policy nền tảng (ngách nhạy cảm: skin ratio, crop, góc máy, framing cảm xúc/quà tặng thay vì khêu gợi). Đánh dấu: An toàn / Cần sửa / Loại + giải thích vì sao.' },
    ],
    pass: ['≥1 bộ creative (3–5 video hook + 2–3 ảnh)', 'Đặt tên chuẩn, đúng tỷ lệ', 'Đã qua self-audit policy', 'Hook bank cho thấy hiểu chân dung khách của ngách mình'],
    traps: ['Đổi nhiều biến cùng lúc giữa variant → không biết cái nào thắng (quy tắc 1 biến/lần)', 'Đặt tên file lung tung → phân tích Module 6 thành mò kim đáy bể', 'Creative "giật gân" câu click → bị rejected, giảm reach, rủi ro khoá account'],
    videos: ['10 UGC Hook Frameworks for Ads', 'Facebook Ad Creative Naming Convention', 'Meta Ad Policy Self-Audit Checklist'],
    description: '1 bộ creative: 3–5 video hook + 2–3 ảnh, đặt tên chuẩn SP_Concept_Hook_Ratio_v1, đúng tỷ lệ. Hook bank 10 hook (ghi chân dung khách). Bảng self-audit policy (An toàn / Cần sửa / Loại + lý do).',
  },
  '05': {
    learn: ['Cấu trúc Campaign → Ad Set → Ad cho giai đoạn test', 'Vì sao ABO trước, chưa CBO/ASC', 'Campaign Sales, conversion = Purchase', 'Advantage+ placements, attribution 7-day click', 'Kế hoạch ngân sách & lịch + giả thuyết đo lường'],
    exercises: [
      { code: 'Bài 5.1', title: 'Vẽ cấu trúc campaign test', desc: 'Trên giấy/screenshot: thiết kế Campaign → Ad Set → Ad cho test (ABO, ngân sách nhỏ, audience broad/ít interest, mỗi ad set 1 nhóm creative). Giải thích vì sao chọn ABO chứ chưa CBO/ASC.' },
      { code: 'Bài 5.2', title: 'Launch campaign test thật', desc: 'Dựng 1 campaign Sales → conversion = Purchase, vị trí Advantage+, gắn creative ở Module 4. Verify Purchase tracking chạy đúng và attribution window 7-day click.' },
      { code: 'Bài 5.3', title: 'Kế hoạch ngân sách & lịch', desc: 'Ghi rõ ngân sách/ngày mỗi ad set, mốc chi tiêu trước khi đánh giá, lịch chạy. Tự đặt giả thuyết: "sau X chi tiêu, mình kỳ vọng Y".' },
    ],
    pass: ['1 campaign test live, tracking Purchase đúng', 'Cấu trúc + ngân sách + lịch rõ ràng', 'Có giả thuyết đo lường viết trước'],
    traps: ['Interest stacking dày đặc thay vì để creative làm "targeting"', 'Bắt đầu bằng CBO/ASC khi chưa có winner', 'Sai attribution window → đọc số lệch'],
    videos: ['Facebook Ads Campaign Structure for Testing (ABO)', 'How To Launch a Sales Campaign 2025', 'Attribution Settings & Purchase Tracking'],
    description: 'Screenshot cấu trúc campaign test + campaign live (conversion Purchase, Advantage+) + kế hoạch ngân sách/lịch + giả thuyết đo lường viết trước.',
  },
  '06': {
    learn: ['Dựng phễu CPM → CTR(link) → CPC → ATC → IC → Purchase → CPA/ROAS', 'Bảng Triệu chứng → Nguyên nhân → Hành động', 'Chẩn đoán nút thắt lớn nhất', 'Custom columns + breakdown (placement/age/ngày)', 'Đọc số khi còn learning phase'],
    exercises: [
      { code: 'Bài 6.1', title: 'Dựng phễu chỉ số', desc: 'Lấy bảng số từ campaign của chính mình (hoặc dataset mẫu người train cấp), dựng phễu: CPM → CTR(link) → CPC → ATC → IC → Purchase → CPA/ROAS. Điền số thật từng tầng.' },
      { code: 'Bài 6.2', title: 'Chẩn đoán nút thắt', desc: 'Áp bảng Triệu chứng → Nguyên nhân → Hành động để chỉ ra nút thắt lớn nhất trong phễu, đề xuất 1 hành động cụ thể (VD: CTR cao + CVR thấp → nghi store/offer → sửa product page).' },
      { code: 'Bài 6.3', title: 'Custom columns + breakdown', desc: 'Set bộ cột tuỳ chỉnh nên dùng; xem breakdown theo placement/age/ngày; chỉ ra 1 insight mà bảng mặc định giấu đi. Lưu ý đọc số khi còn learning phase.' },
    ],
    pass: ['Đọc được 1 bảng số thật, dựng đúng phễu', 'Chỉ tên đúng nút thắt lớn nhất', 'Đề xuất hành động hợp lý theo logic chẩn đoán'],
    traps: ['Phán quyết khi còn trong learning phase / data quá ít', 'Không tách theo creative → không biết cái nào kéo cái nào dìm', 'Nhìn ROAS tổng mà bỏ qua tầng phễu thực sự thủng'],
    videos: ['Facebook Ads Metrics Funnel Explained', 'Diagnosing Ad Account Bottlenecks', 'Custom Columns & Breakdowns in Ads Manager'],
    description: 'Bảng phễu chỉ số điền số thật từng tầng + phần chẩn đoán nút thắt lớn nhất (Triệu chứng → Nguyên nhân → Hành động) + 1 insight rút ra từ breakdown.',
  },
  '07': {
    learn: ['Funnel store Sessions → ATC → Checkout → Purchase, CVR từng bước, AOV', 'Blended ROAS / MER = doanh thu ÷ chi quảng cáo', 'Over-attribution của Meta', 'Microsoft Clarity: session recording + heatmap', 'Nối điểm rớt ngược về CRO (Module 2)'],
    exercises: [
      { code: 'Bài 7.1', title: 'Đọc funnel store', desc: 'Từ Shopify Analytics: dựng funnel Sessions → ATC → Checkout → Purchase, tính CVR từng bước, AOV. Chỉ ra bước rớt nặng nhất và giả thuyết vì sao.' },
      { code: 'Bài 7.2', title: 'Blended ROAS / MER', desc: 'Tính MER = tổng doanh thu ÷ tổng chi quảng cáo, so với ROAS Meta báo. Giải thích khoảng chênh (over-attribution) và vì sao không nên tin mỗi số Meta.' },
      { code: 'Bài 7.3', title: 'Soi hành vi page', desc: 'Cài Microsoft Clarity (free), xem ≥5 session recording + heatmap product page. Tìm 1 điểm rớt sửa được và nối ngược về Module 2 (CRO).' },
    ],
    pass: ['Đọc được funnel store, có AOV & CVR bằng số', 'Tính được MER và giải thích chênh với Meta', 'Tìm ra ≥1 điểm CRO cần sửa kèm bằng chứng (recording/heatmap)'],
    traps: ['Tin tuyệt đối ROAS Meta báo → quyết định scale sai', 'Bỏ qua AOV (đòn bẩy lợi nhuận) chỉ chăm CVR', 'Kết luận "store yếu" mà không có recording/heatmap chứng minh'],
    videos: ['Shopify Analytics Funnel & AOV', 'Blended ROAS / MER Explained', 'Microsoft Clarity Heatmaps for CRO'],
    description: 'Funnel store (CVR từng bước + AOV) + tính MER & giải thích chênh với Meta + ≥1 điểm CRO cần sửa kèm screenshot recording/heatmap.',
  },
  '08': {
    learn: ['Memo quyết định Kill / Scale dựa trên số', 'Đặt ngưỡng kill theo margin của ngách', 'Scale +20–50% / duplicate', 'Lịch chống creative fatigue', 'Tối ưu song song: retargeting + Klaviyo flow + A/B CRO'],
    exercises: [
      { code: 'Bài 8.1', title: 'Memo quyết định Kill / Scale', desc: 'Từ số liệu của chính mình (hoặc dataset cấp), viết 1 memo ngắn ra quyết định kill/scale cho 1 ad set: ngưỡng chi tiêu đã đạt, chỉ số chốt, lý do, bước tiếp theo (kill / giữ / scale +20–50% / duplicate). Tự đặt ngưỡng kill theo margin ngách, ghi rõ logic.' },
      { code: 'Bài 8.2', title: 'Lịch chống creative fatigue', desc: 'Lập lịch sản xuất creative hằng tuần để chống fatigue (CPM tăng, CTR giảm theo thời gian). Ghi rõ tuần này feed mấy concept mới, nối về Module 4.' },
      { code: 'Bài 8.3', title: 'Tối ưu song song', desc: 'Set tối thiểu: 1 retargeting audience (ATC/viewed) + 1 Klaviyo flow (abandoned cart) + 1 ý tưởng CRO/offer đang A/B test (1 biến). Giải thích mỗi cái vắt thêm doanh thu ở đâu trong funnel.' },
    ],
    pass: ['1 quyết định kill/scale dựa trên số (không cảm tính)', 'Có lịch creative chống fatigue', '≥3 đòn tối ưu song song đang chạy'],
    traps: ['Tắt sớm trong learning phase / scale quá nhanh làm reset learning', 'Chỉ động vào ads, bỏ quên store + email + retargeting', 'A/B test nhiều biến cùng lúc → kết quả vô nghĩa'],
    videos: ['Kill or Scale Decision Framework', 'Creative Testing Schedule to Beat Fatigue', 'Retargeting + Klaviyo Abandoned Cart Flow'],
    description: 'Memo kill/scale cho 1 ad set (ngưỡng, chỉ số, lý do, bước tiếp) + lịch creative hằng tuần + mô tả ≥3 đòn tối ưu song song (retargeting, Klaviyo flow, A/B CRO).',
  },
  'F': {
    learn: ['Tổng hợp 7 năng lực: research → store → listing → creative → campaign → đọc số → quyết định tối ưu', 'Hoàn thiện Project Log', 'Trình bày 10 phút'],
    note: 'Định nghĩa "đậu": người train tin bạn có thể tự cầm một sản phẩm mới từ ý tưởng đến quyết định scale/kill mà không cần cầm tay — kể cả trong một ngách chưa ai ở Omegason từng làm.',
    exercises: [
      { code: 'Bài cuối khóa', title: 'Dự án end-to-end', desc: 'Trình bày toàn bộ hành trình của một sản phẩm bạn tự chọn qua 7 năng lực: research ngách → store → listing → creative → campaign test → đọc số → 1 quyết định tối ưu. Nộp Project Log đầy đủ + một bài trình bày 10 phút.' },
    ],
    pass: ['Research: ngách có tín hiệu cầu thật + margin sống được', 'Store/Listing: product page đạt template CRO, tracking đúng', 'Creative: ≥1 bộ đặt tên chuẩn, qua self-audit policy', 'Ads: campaign test có cấu trúc + giả thuyết viết trước', 'Đọc số: chỉ đúng nút thắt qua Meta funnel lẫn store funnel (có MER)', 'Quyết định: 1 call kill/scale có lý do bằng số + bước tiếp theo'],
    traps: ['Trình bày output rời rạc, không kể được một hành trình liền mạch trên 1 sản phẩm', 'Thiếu Project Log nên không chứng minh được quá trình ra quyết định', 'Kết luận scale/kill không dựa trên số'],
    videos: ['Full-Funnel DTC Case Study Walkthrough', 'How To Present a Marketing Project', 'End-to-End Shopify Launch Recap'],
    description: 'Project Log đầy đủ (quyết định + số liệu của 8 module) + bài trình bày 10 phút, đi qua 7 năng lực từ research → quyết định scale/kill cho một sản phẩm tự chọn.',
  },
};

export const EMPLOYEES = [
  { id: 'emp-an',    name: 'Nguyễn An',  initials: 'An', email: 'an.nguyen@omegason.vn',    startDate: '2026-06-01', cells: 'ddr......' },
  { id: 'emp-chi',   name: 'Lê Chi',     initials: 'LC', email: 'le.chi@omegason.vn',        startDate: '2026-06-01', cells: 'ddddddddr' },
  { id: 'emp-giang', name: 'Hồ Giang',   initials: 'HG', email: 'ho.giang@omegason.vn',      startDate: '2026-06-01', cells: 'dddddd.l.' },
  { id: 'emp-em',    name: 'Vũ Em',      initials: 'VE', email: 'vu.em@omegason.vn',          startDate: '2026-06-01', cells: 'dddddr...' },
  { id: 'emp-binh',  name: 'Trần Bình',  initials: 'TB', email: 'tran.binh@omegason.vn',     startDate: '2026-06-01', cells: 'dddl.....' },
  { id: 'emp-dung',  name: 'Phạm Dũng',  initials: 'PD', email: 'pham.dung@omegason.vn',     startDate: '2026-06-01', cells: 'ddl......' },
];

export const MANAGER = {
  id: 'mgr-1', name: 'Trưởng nhóm', initials: 'QL', email: 'manager@omegason.vn', role: 'manager',
};

const TASK_IDS = ['01','02','03','04','05','06','07','08','F'];
const GRADES = { '01': 9.0, '02': 8.5, '03': 8.0, '04': 8.5, '05': 9.0, '06': 8.0, '07': 8.5, '08': 9.0, 'F': null };
const SUBMITTED_DATES = { '01': '2026-06-07', '02': '2026-06-13', '03': '2026-06-17', '04': '2026-06-23', '05': '2026-06-28', '06': '2026-07-03', '07': '2026-07-07', '08': '2026-07-11', 'F': null };

function makeDemoContent(empName, taskId) {
  const task = TASKS.find(t => t.id === taskId);
  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><title>Báo cáo ${taskId} - ${empName}</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1f1d1b;line-height:1.6}h1{border-bottom:2px solid #1f1d1b;padding-bottom:8px}h2{color:#6c6862;font-size:1rem;text-transform:uppercase;letter-spacing:.05em;margin-top:32px}table{width:100%;border-collapse:collapse;margin:12px 0}td,th{border:1px solid #d9d6d0;padding:8px 12px;text-align:left}th{background:#f5f4f1}p{color:#6c6862}</style>
</head>
<body>
<h1>${task?.name || ''}</h1>
<p><b>Người thực hiện:</b> ${empName} &nbsp;·&nbsp; <b>Ngày nộp:</b> ${SUBMITTED_DATES[taskId] || '—'}</p>
<h2>Tóm tắt thực hiện</h2>
<p>Đã hoàn thành toàn bộ yêu cầu của module. Ghi chú quyết định và số liệu bên dưới.</p>
<h2>Chi tiết công việc</h2>
<table><tr><th>Hạng mục</th><th>Kết quả</th><th>Ghi chú</th></tr>
<tr><td>Bài thực hành 1</td><td>✓ Hoàn thành</td><td>Đã áp dụng đúng quy trình</td></tr>
<tr><td>Bài thực hành 2</td><td>✓ Hoàn thành</td><td>Có số liệu kèm theo</td></tr>
<tr><td>Bài thực hành 3</td><td>✓ Hoàn thành</td><td>Cần cải thiện thêm</td></tr>
</table>
<h2>Bài học rút ra</h2>
<p>Qua module này đã hiểu cách áp dụng ${task?.name || ''} vào sản phẩm test của mình. Sẽ kéo tiếp qua các module sau.</p>
<h2>Tiêu chuẩn tự đánh giá</h2>
<p>✓ Đạt các tiêu chí pass &nbsp; ✓ Có số liệu chứng minh &nbsp; ✓ Tránh được các bẫy thường gặp &nbsp; ✓ Cập nhật Project Log</p>
</body></html>`;
}

export function generateInitialSubmissions() {
  const subs = [];
  EMPLOYEES.forEach(emp => {
    const cells = emp.cells.split('');
    cells.forEach((cell, idx) => {
      const taskId = TASK_IDS[idx];
      if (!taskId) return;
      if (cell === 'd') {
        subs.push({
          id: `seed-${emp.id}-${taskId}`,
          employeeId: emp.id,
          taskId,
          status: 'graded',
          fileName: TASKS.find(t=>t.id===taskId)?.file || `${taskId}-report.html`,
          fileContent: makeDemoContent(emp.name, taskId),
          fileSize: 2048 + Math.floor(Math.random() * 3000),
          note: '',
          submittedAt: SUBMITTED_DATES[taskId] ? `${SUBMITTED_DATES[taskId]}T12:00:00` : new Date().toISOString(),
          grade: GRADES[taskId],
          feedback: GRADES[taskId] >= 9 ? 'Báo cáo rất tốt, số liệu rõ ràng và quyết định có cơ sở.' : 'Báo cáo đạt yêu cầu. Cần bổ sung thêm phân tích số.',
          gradedAt: SUBMITTED_DATES[taskId] ? `${SUBMITTED_DATES[taskId]}T15:00:00` : new Date().toISOString(),
        });
      } else if (cell === 'r') {
        subs.push({
          id: `seed-${emp.id}-${taskId}`,
          employeeId: emp.id,
          taskId,
          status: 'pending',
          fileName: TASKS.find(t=>t.id===taskId)?.file || `${taskId}-report.html`,
          fileContent: makeDemoContent(emp.name, taskId),
          fileSize: 1800 + Math.floor(Math.random() * 2000),
          note: '',
          submittedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
          grade: null,
          feedback: null,
          gradedAt: null,
        });
      }
    });
  });
  return subs;
}

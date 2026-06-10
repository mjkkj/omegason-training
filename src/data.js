// Training program data — static reference, never mutated at runtime.

export const WEEKS = [
  { wk: 'Tuần 1', theme: 'Nền tảng AI + Tư duy KD online', taskIds: ['01', '02'] },
  { wk: 'Tuần 2', theme: 'Shopify cơ bản', taskIds: ['03', '04'] },
  { wk: 'Tuần 3', theme: 'Thiết kế + Quản lý dữ liệu', taskIds: ['05', '06'] },
  { wk: 'Tuần 4', theme: 'Kênh bán hàng + QA trước launch', taskIds: ['07', '08', '09', '10'] },
];

export const TASKS = [
  { id: '01', name: 'Dùng ChatGPT/AI cho công việc',    week: 1, daysFromStart:  4, file: '01-ai-learning-report.html',    hours: 2 },
  { id: '02', name: 'Tạo báo cáo HTML cơ bản',          week: 1, daysFromStart:  7, file: '02-html-report-template.html',  hours: 3 },
  { id: '03', name: 'Shopify store setup cơ bản',        week: 2, daysFromStart: 11, file: '03-shopify-basic-report.html',  hours: 3 },
  { id: '04', name: 'Đăng sản phẩm & viết mô tả',       week: 2, daysFromStart: 14, file: '04-product-upload-report.html', hours: 2 },
  { id: '05', name: 'Canva cho ảnh sản phẩm & banner',   week: 3, daysFromStart: 18, file: '05-canva-design-report.html',   hours: 3 },
  { id: '06', name: 'Google Sheet quản lý sản phẩm',    week: 3, daysFromStart: 21, file: '06-google-sheet-report.html',   hours: 2 },
  { id: '07', name: 'Meta/Facebook Pixel',               week: 4, daysFromStart: 22, file: '07-meta-pixel-report.html',    hours: 2 },
  { id: '08', name: 'Google Merchant Center',            week: 4, daysFromStart: 24, file: '08-google-merchant-report.html',hours: 2 },
  { id: '09', name: 'Pinterest Sales Channel',           week: 4, daysFromStart: 26, file: '09-pinterest-report.html',     hours: 2 },
  { id: '10', name: 'Store QA trước khi launch',         week: 4, daysFromStart: 28, file: '10-store-qa-report.html',      hours: 4, key: true },
  { id: 'F',  name: 'Mini-brand final project',          week: 5, daysFromStart: 35, file: 'final-mini-brand.html',        hours: 8, final: true },
];

// Calculate a task's absolute deadline from the employee's start_date (ISO date string 'YYYY-MM-DD')
export function calcDeadline(task, startDate) {
  if (!startDate) {
    const d = new Date(); d.setDate(d.getDate() + task.daysFromStart); d.setHours(18,0,0,0); return d.toISOString()
  }
  const [y, m, day] = startDate.split('-').map(Number)
  return new Date(y, m - 1, day + task.daysFromStart, 18, 0, 0).toISOString()
}

export const TASK_CONTENT = {
  '01': {
    learn: ['Cách hỏi ChatGPT rõ ràng', 'Tạo checklist', 'Viết mô tả sản phẩm', 'Tóm tắt video', 'Tạo báo cáo HTML', 'Kiểm tra lại output AI — không copy mù quáng'],
    videos: ['How To Use ChatGPT - Complete Beginner Guide', 'ChatGPT Tutorial 2025: Beginner to Pro', 'How To Use ChatGPT for Marketing'],
    description: 'ChatGPT là gì · 10 việc ChatGPT hỗ trợ trong setup store · 5 prompt mẫu viết mô tả sản phẩm · 5 prompt mẫu tạo checklist · 1 checklist "Setup một sản phẩm mới lên website".',
  },
  '02': {
    learn: ['Tạo trang báo cáo có tiêu đề', 'Mục lục & cấu trúc rõ ràng', 'Bảng & danh sách', 'Checklist', 'Hình ảnh minh họa', 'Link tham khảo', 'Kết luận'],
    note: 'Không cần học code sâu — có thể dùng ChatGPT để tạo toàn bộ HTML.',
    videos: ['HTML Crash Course For Absolute Beginners', 'Build a Beautiful Report with HTML & CSS', 'ChatGPT to Generate HTML Reports'],
    description: 'Mẫu báo cáo HTML đẹp, dễ đọc. Các section bắt buộc: Tổng quan · Video đã học · Kiến thức rút ra · Checklist áp dụng · Bài tập thực hành · Kết luận. CSS đơn giản: font dễ đọc, có bảng, card, button.',
  },
  '03': {
    learn: ['Shopify là gì', 'Cấu trúc store', 'Theme & settings', 'Product & collection', 'Page · menu · policy', 'Chỉnh homepage', 'Kiểm tra mobile'],
    videos: ['Shopify For Beginners - Complete Tutorial', 'How To Build a Shopify Store From Scratch', 'Shopify Theme Customization Guide'],
    description: 'Dựng store demo với 5 sản phẩm, 3 collection, homepage đơn giản, product page đầy đủ, menu chính. Tạo đủ các trang: About / Contact / Shipping / Return / FAQ.',
  },
  '04': {
    learn: ['Đặt tên sản phẩm dễ hiểu', 'Viết mô tả bằng AI', 'Chia mô tả: benefit / feature / size / material / care', 'Kiểm tra ảnh, variant, giá, SKU', 'Viết cho khách dễ mua'],
    videos: ['How To Write Product Descriptions That Sell', 'ChatGPT for Ecommerce Product Listings', 'Shopify Product Page Best Practices'],
    description: 'Checklist đăng sản phẩm chuẩn · Đăng thử 10 sản phẩm mẫu đầy đủ (title, description, benefit bullets, size/variant, price, image). Dùng ChatGPT để viết nhưng phải tự chỉnh lại cho tự nhiên — không copy nguyên xi.',
  },
  '05': {
    learn: ['Canva cơ bản', 'Chỉnh ảnh sản phẩm', 'Tạo banner website', 'Ảnh vuông / dọc / ngang', 'Giữ màu sắc & font đồng bộ với brand', 'Xuất ảnh đúng định dạng'],
    videos: ['Canva For Beginners - Full Tutorial', 'How To Edit Product Photos in Canva', 'Making Ecommerce Banners in Canva'],
    description: '3 banner website · 3 ảnh sản phẩm dạng promo · 1 bộ icon benefit. Xuất đúng kích thước: 1:1, 4:5, 9:16, desktop banner (1440×500). Viết lại quy trình tạo ảnh bằng Canva vào báo cáo.',
  },
  '06': {
    learn: ['Tạo bảng sản phẩm', 'Filter, sort', 'Checkbox & basic formula', 'Quản lý status công việc', 'File tracking tiến độ setup store'],
    videos: ['Google Sheets for Beginners - Full Tutorial', 'Track Inventory with Google Sheets', 'Checkboxes & Conditional Formatting'],
    description: 'File Sheet quản lý 20 sản phẩm với các cột: Product Name · Collection · Price · Status · Image Status · Description Status · Variant Status · Notes. Có checkbox hoàn thành. Có filter theo status. Có bảng checklist setup store riêng.',
  },
  '07': {
    learn: ['Meta Pixel là gì', 'Vì sao cần tracking', 'Kết nối Facebook/Instagram với Shopify', 'Kiểm tra trạng thái kết nối', 'Lỗi thường gặp & cách xử lý'],
    videos: ['How To Set Up Facebook Pixel on Shopify 2025', 'Meta Pixel Events Tutorial', 'Facebook Pixel Helper - Verify Installation'],
    description: 'Meta Pixel là gì · Vì sao store cần Pixel trước khi chạy quảng cáo · Checklist kết nối Meta với Shopify · Checklist kiểm tra 5 event cơ bản: PageView · ViewContent · AddToCart · InitiateCheckout · Purchase · Lỗi thường gặp & cách sửa.',
  },
  '08': {
    learn: ['Google Merchant Center là gì', 'Product feed là gì', 'Vì sao cần title/image/price/availability rõ ràng', 'Cách kết nối Shopify với GMC', 'Lỗi thường gặp khi sản phẩm bị disapproved'],
    videos: ['Google Merchant Center Tutorial For Beginners', 'Connect Shopify to Google Shopping', 'Fix Google Merchant Center Errors'],
    description: 'Google Merchant Center là gì · Cần chuẩn bị gì trước khi kết nối · Checklist product feed · 10 lỗi thường gặp khiến sản phẩm không được duyệt (thiếu ảnh, sai giá, thiếu chính sách, shipping/tax chưa rõ) · Cách kiểm tra từng mục.',
  },
  '09': {
    learn: ['Pinterest phù hợp với ngành nào', 'Tạo Business account', 'Product catalog trên Pinterest', 'Kết nối Pinterest với Shopify', 'Tối ưu profile, board, keyword'],
    videos: ['Pinterest for Ecommerce Beginners', 'How To Set Up Pinterest Shop on Shopify', 'Pinterest SEO - Board & Profile Optimization'],
    description: 'Pinterest dùng để làm gì trong eCommerce · Product catalog là gì · Checklist kết nối Pinterest với Shopify · Checklist tối ưu profile · Gợi ý 10 board phù hợp cho một brand thời trang nữ.',
  },
  '10': {
    learn: ['Homepage: offer có rõ không', 'Product page: đủ thông tin chưa', 'Ảnh, giá, variant: có lỗi không', 'Add to cart + Checkout: hoạt động không', 'Chính sách, menu, mobile: đạt chưa', 'Tracking: đã kết nối chưa'],
    note: 'Đây là kỹ năng quan trọng nhất để đánh giá nhân viên sau 1 tháng training.',
    videos: ['Shopify Store QA Before Launch', 'How To Test Shopify Checkout', 'Shopify Speed & Mobile Optimization'],
    prompt: 'Hãy tạo cho tôi checklist kiểm tra một Shopify store trước khi chạy quảng cáo. Chia thành các nhóm: Homepage, Product Page, Collection Page, Cart, Checkout, Mobile, Policy, Tracking, App, Trust, Speed. Viết theo dạng checklist dễ dùng cho nhân viên vận hành.',
    description: 'Checklist QA tối thiểu 80 dòng · Audit một store mẫu thực tế · Chụp màn hình các lỗi phát hiện được · Ghi mức độ lỗi: Critical / High / Medium / Low · Đề xuất cách sửa từng lỗi · Kết luận: Store đã sẵn sàng chạy ads chưa?',
  },
  'F': {
    learn: ['Tổng hợp kiến thức 4 tuần', 'Tự chọn brand + sản phẩm', 'Setup store hoàn chỉnh', 'Kênh bán hàng & tracking', 'Báo cáo tổng kết'],
    note: 'Tuần 5: tự làm một project hoàn chỉnh từ đầu đến cuối, không có hướng dẫn từng bước.',
    videos: ['Building a Shopify Store From Scratch 2025', 'How To Create a Brand Identity', 'Shopify Launch Checklist'],
    description: '① Store demo Shopify · ② 10–20 sản phẩm mẫu · ③ 3–5 collection · ④ Homepage hoàn chỉnh · ⑤ Product page có mô tả tốt · ⑥ Ảnh banner/promo bằng Canva · ⑦ Google Sheet quản lý sản phẩm · ⑧ Checklist QA trước launch · ⑨ Báo cáo HTML tổng kết: brand là gì, AI đã dùng vào đâu, lỗi gặp & cách xử lý, đề xuất nếu launch thật.',
  },
};

export const EMPLOYEES = [
  { id: 'emp-an',    name: 'Nguyễn An',  initials: 'An', email: 'an.nguyen@omegason.vn',    startDate: '2026-06-01', cells: 'ddr........' },
  { id: 'emp-chi',   name: 'Lê Chi',     initials: 'LC', email: 'le.chi@omegason.vn',        startDate: '2026-06-01', cells: 'dddddddddrd' },
  { id: 'emp-giang', name: 'Hồ Giang',   initials: 'HG', email: 'ho.giang@omegason.vn',      startDate: '2026-06-01', cells: 'dddddd.l...' },
  { id: 'emp-em',    name: 'Vũ Em',      initials: 'VE', email: 'vu.em@omegason.vn',          startDate: '2026-06-01', cells: 'dddddr.....' },
  { id: 'emp-binh',  name: 'Trần Bình',  initials: 'TB', email: 'tran.binh@omegason.vn',     startDate: '2026-06-01', cells: 'dddl.......' },
  { id: 'emp-dung',  name: 'Phạm Dũng',  initials: 'PD', email: 'pham.dung@omegason.vn',     startDate: '2026-06-01', cells: 'ddl........' },
];

export const MANAGER = {
  id: 'mgr-1', name: 'Trưởng nhóm', initials: 'QL', email: 'manager@omegason.vn', role: 'manager',
};

const TASK_IDS = ['01','02','03','04','05','06','07','08','09','10','F'];
const GRADES = { '01': 9.0, '02': 8.5, '03': 8.0, '04': 8.5, '05': 9.5, '06': 8.0, '07': 8.5, '08': 9.0, '09': 8.0, '10': null, 'F': null };
const SUBMITTED_DATES = { '01': '2026-06-03', '02': '2026-06-07', '03': '2026-06-11', '04': '2026-06-14', '05': '2026-06-18', '06': '2026-06-21', '07': '2026-06-22', '08': '2026-06-24', '09': '2026-06-26', '10': '2026-06-08', 'F': null };

function makeDemoContent(empName, taskId) {
  const task = TASKS.find(t => t.id === taskId);
  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><title>Báo cáo Task ${taskId} - ${empName}</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1f1d1b;line-height:1.6}h1{border-bottom:2px solid #1f1d1b;padding-bottom:8px}h2{color:#6c6862;font-size:1rem;text-transform:uppercase;letter-spacing:.05em;margin-top:32px}table{width:100%;border-collapse:collapse;margin:12px 0}td,th{border:1px solid #d9d6d0;padding:8px 12px;text-align:left}th{background:#f5f4f1}p{color:#6c6862}</style>
</head>
<body>
<h1>Báo cáo Task ${taskId}: ${task?.name || ''}</h1>
<p><b>Người thực hiện:</b> ${empName} &nbsp;·&nbsp; <b>Ngày nộp:</b> ${SUBMITTED_DATES[taskId] || '—'}</p>
<h2>Tóm tắt thực hiện</h2>
<p>Đã hoàn thành toàn bộ yêu cầu của task ${taskId}. Ghi chú quá trình và kết quả bên dưới.</p>
<h2>Chi tiết công việc</h2>
<table><tr><th>Hạng mục</th><th>Kết quả</th><th>Ghi chú</th></tr>
<tr><td>Yêu cầu 1</td><td>✓ Hoàn thành</td><td>Đã áp dụng đúng theo hướng dẫn</td></tr>
<tr><td>Yêu cầu 2</td><td>✓ Hoàn thành</td><td>Tham khảo thêm tài liệu ngoài</td></tr>
<tr><td>Yêu cầu 3</td><td>✓ Hoàn thành</td><td>Cần cải thiện thêm</td></tr>
</table>
<h2>Bài học rút ra</h2>
<p>Qua task này đã hiểu được cách áp dụng ${task?.name || ''} vào công việc thực tế tại Omegason. Sẽ tiếp tục áp dụng trong các task tiếp theo.</p>
<h2>Checklist tự đánh giá</h2>
<p>✓ Có tiêu đề & mục lục &nbsp; ✓ Có section đầy đủ &nbsp; ✓ Đã tự chỉnh lại nội dung &nbsp; ✓ Có checklist áp dụng &nbsp; ✓ Mở được trên trình duyệt</p>
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
          feedback: GRADES[taskId] >= 9 ? 'Báo cáo rất tốt, trình bày rõ ràng và đầy đủ thông tin.' : 'Báo cáo đạt yêu cầu. Cần bổ sung thêm phân tích.',
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

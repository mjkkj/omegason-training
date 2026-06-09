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
    learn: ['Prompt engineering cơ bản', 'ChatGPT cho email', 'Tóm tắt văn bản', 'Tạo nội dung marketing', 'Phân tích dữ liệu với AI'],
    description: 'Thực hành: dùng AI để viết ít nhất 5 ứng dụng thực tế trong công việc Omegason. Ghi lại từng ví dụ cụ thể.',
    videos: ['Giới thiệu ChatGPT cho người đi làm', 'Prompt engineering thực chiến'],
  },
  '02': {
    learn: ['Cấu trúc HTML cơ bản', 'CSS inline', 'Bảng & danh sách', 'Hình ảnh & link', 'Template báo cáo'],
    description: 'Tạo template báo cáo HTML với đầy đủ tiêu đề, mục lục, bảng số liệu, hình ảnh. Dùng lại cho các task tiếp theo.',
    videos: ['HTML cơ bản trong 30 phút', 'Tạo báo cáo đẹp với HTML & CSS'],
  },
  '03': {
    learn: ['Cấu trúc store', 'Theme & settings', 'Product & collection', 'Page · menu · policy', 'Chỉnh homepage', 'Kiểm tra mobile'],
    description: 'Dựng store demo: 5 sản phẩm, 3 collection, homepage, product page, menu, các trang About / Contact / Shipping / Return / FAQ.',
    videos: ['Shopify cho người mới', 'Cấu trúc 1 store bán hàng'],
  },
  '04': {
    learn: ['Viết mô tả sản phẩm', 'SEO title & meta', 'Upload & tối ưu hình', 'Pricing & variants', 'Collections & tags'],
    description: 'Đăng 5 sản phẩm thật với mô tả đầy đủ, hình ảnh chất lượng, tags và SEO title tối ưu.',
    videos: ['Viết mô tả sản phẩm bán chạy', 'SEO cơ bản trên Shopify'],
  },
  '05': {
    learn: ['Canva templates', 'Brand colors & fonts', 'Product mockup', 'Banner sizes chuẩn', 'Export định dạng'],
    description: 'Tạo bộ ảnh cho 5 sản phẩm (ảnh chính + lifestyle) + 3 banner cho homepage (desktop & mobile).',
    videos: ['Canva cơ bản cho ecommerce', 'Tạo product mockup đẹp'],
  },
  '06': {
    learn: ['Google Sheets cơ bản', 'Import/Export CSV', 'Filter & sort', 'VLOOKUP cơ bản', 'Dashboard đơn giản'],
    description: 'Tạo bảng quản lý sản phẩm với đầy đủ: SKU, tên, giá, tồn kho, nhà cung cấp, trạng thái.',
    videos: ['Google Sheets cho quản lý kho', 'VLOOKUP & tham chiếu dữ liệu'],
  },
  '07': {
    learn: ['Cài Meta Pixel', 'Standard events', 'Custom conversion', 'Test với Pixel Helper', 'Báo cáo Pixel'],
    description: 'Cài và xác nhận Meta Pixel hoạt động trên store. Báo cáo các events đã test (PageView, ViewContent, AddToCart).',
    videos: ['Cài Meta Pixel trên Shopify', 'Test Meta Pixel với Helper'],
  },
  '08': {
    learn: ['Google Merchant Center', 'Product feed setup', 'Shopping ads cơ bản', 'Xử lý disapprovals', 'Performance báo cáo'],
    description: 'Kết nối store với Google Merchant Center, upload product feed và xử lý mọi disapproval.',
    videos: ['Google Merchant Center cho người mới', 'Tối ưu product feed'],
  },
  '09': {
    learn: ['Pinterest business account', 'Product catalog', 'Rich pins setup', 'Pinterest ads cơ bản', 'Analytics'],
    description: 'Kết nối store với Pinterest, tạo catalog và pin 10 sản phẩm với rich pins.',
    videos: ['Pinterest cho ecommerce', 'Tạo catalog trên Pinterest'],
  },
  '10': {
    learn: ['Checklist trước launch', 'Mobile UX review', 'Checkout flow test', 'Page speed optimization', 'Legal pages'],
    description: 'Kiểm tra toàn bộ store theo checklist 30 điểm. Ghi nhận và sửa mọi vấn đề trước khi launch.',
    videos: ['Store QA checklist đầy đủ', 'Tối ưu tốc độ Shopify store'],
  },
  'F': {
    learn: ['Tổng hợp 4 tuần', 'Brand identity', 'Launch plan', 'Marketing calendar', 'Pitch deck'],
    description: 'Xây dựng mini-brand hoàn chỉnh từ đầu: sản phẩm, store, visual identity, kênh bán hàng, kế hoạch launch.',
    videos: ['Xây dựng brand từ zero', 'Launch plan thực chiến'],
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

// wf-employee.jsx — employee-facing screens, 2 layout directions each.
const { W, Skel, Ph, Card, H, T, Btn, Tag, Dot, Bar, Ring, Check,
  Avatar, Field, Divider, Note, Stat, Ico, Shell } = window;

// Shared training data.
const WEEKS = [
  { wk: 'Tuần 1', theme: 'Nền tảng AI + Tư duy KD online', tasks: [
    { id: '01', name: 'Dùng ChatGPT/AI cho công việc', file: '01-ai-learning-report.html' },
    { id: '02', name: 'Tạo báo cáo HTML cơ bản', file: '02-html-report-template.html' } ] },
  { wk: 'Tuần 2', theme: 'Shopify cơ bản', tasks: [
    { id: '03', name: 'Shopify store setup cơ bản', file: '03-shopify-basic-report.html' },
    { id: '04', name: 'Đăng sản phẩm & viết mô tả', file: '04-product-upload-report.html' } ] },
  { wk: 'Tuần 3', theme: 'Thiết kế + Quản lý dữ liệu', tasks: [
    { id: '05', name: 'Canva cho ảnh sản phẩm & banner', file: '05-canva-design-report.html' },
    { id: '06', name: 'Google Sheet quản lý sản phẩm', file: '06-google-sheet-report.html' } ] },
  { wk: 'Tuần 4', theme: 'Kênh bán hàng + QA trước launch', tasks: [
    { id: '07', name: 'Meta/Facebook Pixel', file: '07-meta-pixel-report.html' },
    { id: '08', name: 'Google Merchant Center', file: '08-google-merchant-report.html' },
    { id: '09', name: 'Pinterest Sales Channel', file: '09-pinterest-report.html' },
    { id: '10', name: 'Store QA trước khi launch', file: '10-store-qa-report.html', key: true } ] },
];
// status: done | active | todo | locked
const STAT = { '01': 'done', '02': 'done', '03': 'active', '04': 'todo',
  '05': 'locked', '06': 'locked', '07': 'locked', '08': 'locked', '09': 'locked', '10': 'locked' };
const statTone = { done: 'done', active: 'acc', todo: 'neutral', locked: 'neutral' };
const statTxt = { done: 'Đã nộp', active: 'Đang làm', todo: 'Chưa làm', locked: 'Khoá' };

// small task pill used in roadmap
function TaskPill({ t, st }) {
  const locked = st === 'locked';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
      border: `1px solid ${st === 'active' ? W.accLine : W.line2}`, borderRadius: 9,
      background: st === 'active' ? W.accSoft : st === 'locked' ? W.panel : '#fff', opacity: locked ? 0.7 : 1 }}>
      <span className="wf-mono" style={{ fontSize: 12, fontWeight: 700,
        color: st === 'active' ? W.acc : W.ink3 }}>{t.id}</span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: locked ? W.ink3 : W.ink,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
        <div className="wf-mono" style={{ fontSize: 9.5, color: W.ink4, marginTop: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.file}</div>
      </div>
      {t.key && <Tag tone="warn">KEY</Tag>}
      {st === 'done' ? <Dot tone="done" /> : st === 'active' ? <Dot tone="acc" />
        : st === 'locked' ? <Ico name="chev" s={13} c={W.ink4} /> : <Dot tone="empty" />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1 · ROADMAP
// ─────────────────────────────────────────────────────────────
function EmpRoadmapA() {
  const wkPct = [100, 50, 0, 0];
  return (
    <Shell role="emp" active={1} title="Lộ trình 4 tuần · 10 task" sub="Mỗi tuần một output thật — kết thúc bằng final project"
      actions={<><Tag tone="acc">Tiến độ 20%</Tag><Btn kind="ghost" size="sm" icon={<Ico name="cal" s={14} />}>Lịch nộp</Btn></>}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 14 }}>
        {/* overall progress strip */}
        <Card pad={14} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>Tổng tiến độ</div>
          <Bar pct={20} h={10} style={{ flex: 1 }} />
          <div className="wf-mono" style={{ fontSize: 12, color: W.ink2 }}>2 / 10 task · 1 final</div>
        </Card>
        {/* 4 week columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, flex: 1, minHeight: 0 }}>
          {WEEKS.map((w, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{w.wk}</div>
                  <div style={{ fontSize: 10.5, color: W.ink3, marginTop: 1, lineHeight: 1.3 }}>{w.theme}</div>
                </div>
                <span className="wf-mono" style={{ fontSize: 10, color: W.ink4 }}>{wkPct[i]}%</span>
              </div>
              <Bar pct={wkPct[i]} h={5} c={wkPct[i] === 100 ? W.done : W.acc} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
                {w.tasks.map((t) => <TaskPill key={t.id} t={t} st={STAT[t.id]} />)}
              </div>
            </div>
          ))}
        </div>
        <Note>Hướng A — timeline ngang theo tuần, nhìn cả 4 tuần một lần</Note>
      </div>
    </Shell>
  );
}

function EmpRoadmapB() {
  return (
    <Shell role="emp" active={1} title="Lộ trình của tôi" sub="Danh sách theo tuần · cuộn để xem toàn bộ chặng"
      actions={<Tag tone="acc">2 / 10 hoàn thành</Tag>}>
      <div style={{ display: 'flex', gap: 18, height: '100%' }}>
        {/* left spine list */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
          {WEEKS.slice(0, 3).map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 14 }}>
              {/* spine */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
                <div style={{ width: 24, height: 24, borderRadius: 24, flexShrink: 0,
                  background: i === 0 ? W.done : i === 1 ? W.acc : W.panel2,
                  color: i < 2 ? '#fff' : W.ink3, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
                <div style={{ flex: 1, width: 2, background: W.line2, marginTop: 4 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{w.wk}</div>
                  <div style={{ fontSize: 11.5, color: W.ink3 }}>{w.theme}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {w.tasks.map((t) => <TaskPill key={t.id} t={t} st={STAT[t.id]} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* right summary */}
        <div style={{ width: 250, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card pad={16} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Ring pct={20} label="20%" sub="hoàn thành" size={104} />
            <div style={{ fontSize: 12, color: W.ink2, textAlign: 'center', marginTop: 4 }}>Bạn đang ở <b>Tuần 2</b></div>
          </Card>
          <Card pad={14}>
            <T size={11} mono c={W.ink3} mb={10}>VIỆC TIẾP THEO</T>
            <TaskPill t={WEEKS[1].tasks[0]} st="active" />
            <Btn kind="solid" size="sm" full style={{ marginTop: 10 }} icon={<Ico name="chev" s={13} c="#fff" />}>Mở task 03</Btn>
          </Card>
          <Card pad={14} fill={W.warnSoft} line="transparent">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Ico name="flag" s={15} c={W.warn} />
              <div style={{ fontSize: 12.5, fontWeight: 700, color: W.warn }}>Task 10 · Store QA</div>
            </div>
            <T size={11} c={W.ink2} style={{ marginTop: 6 }}>Kỹ năng quan trọng nhất — đánh giá sau 1 tháng.</T>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

// ─────────────────────────────────────────────────────────────
// 2 · TASK DETAIL
// ─────────────────────────────────────────────────────────────
const LEARN = ['Cấu trúc store', 'Theme', 'Product', 'Collection', 'Page · menu · policy', 'Chỉnh homepage', 'Kiểm tra mobile'];

function EmpTaskA() {
  return (
    <Shell role="emp" active={1} title="Task 03 · Shopify store setup" sub="Tuần 2 · Shopify cơ bản"
      actions={<><Tag tone="late"><Ico name="clock" s={12} c={W.late} /> Còn 2 ngày</Tag><Btn kind="quiet" size="sm" icon={<Ico name="chev" s={13} />}>Task tiếp</Btn></>}>
      <div style={{ display: 'flex', gap: 18, height: '100%' }}>
        {/* main */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
          <Card pad={16}>
            <H size={15} mb={10}>Cần học</H>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {LEARN.map((l, i) => <Tag key={i} tone="line">{l}</Tag>)}
            </div>
          </Card>
          <Card pad={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Ico name="play" s={15} c={W.acc} /><H size={15}>Video gợi ý</H>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {['Shopify cho người mới', 'Cấu trúc 1 store bán hàng'].map((v, i) => (
                <div key={i} style={{ display: 'flex', gap: 10 }}>
                  <Ph label="thumb" w={92} h={56} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{v}</div>
                    <Skel lines={2} w={['90%', '60%']} style={{ marginTop: 7 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card pad={16} style={{ flex: 1 }}>
            <H size={15} mb={10}>Đầu ra cần nộp</H>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              border: `1px dashed ${W.line}`, borderRadius: 8, background: W.panel }}>
              <Ico name="doc" s={18} c={W.ink3} />
              <div className="wf-mono" style={{ fontSize: 12.5, fontWeight: 700 }}>03-shopify-basic-report.html</div>
            </div>
            <T size={12} mb={0} style={{ marginTop: 10 }}>Bài thực hành: dựng store demo 5 sản phẩm, 3 collection, homepage, product page, menu, các trang About / Contact / Shipping / Return / FAQ.</T>
          </Card>
        </div>
        {/* sidebar */}
        <div style={{ width: 252, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card pad={16}>
            <T size={11} mono c={W.ink3} mb={10}>TRẠNG THÁI</T>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Dot tone="acc" /><div style={{ fontSize: 14, fontWeight: 700 }}>Đang làm</div>
            </div>
            <Divider style={{ margin: '0 0 14px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
              <T size={12.5} c={W.ink2}>Hạn nộp</T><div style={{ fontSize: 12.5, fontWeight: 700, color: W.late }}>12/06 · 18:00</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <T size={12.5} c={W.ink2}>Tuần</T><div style={{ fontSize: 12.5, fontWeight: 600 }}>Tuần 2</div>
            </div>
          </Card>
          <Btn kind="solid" size="lg" full icon={<Ico name="up" s={15} c="#fff" />}>Nộp báo cáo</Btn>
          <Card pad={14} fill={W.panel} onLine={false}>
            <T size={11} mono c={W.ink3} mb={8}>GỢI Ý AI</T>
            <T size={11.5} c={W.ink2}>Dùng ChatGPT tạo khung HTML rồi tự chỉnh lại — không copy mù quáng.</T>
            <Btn kind="soft" size="sm" full style={{ marginTop: 10 }}>Mở prompt mẫu</Btn>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function EmpTaskB() {
  return (
    <Shell role="emp" active={1} title="Chi tiết task" sub="Tuần 2 · Shopify cơ bản" pad={0} body={W.paper}
      actions={<Btn kind="ghost" size="sm">Quay lại lộ trình</Btn>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* hero header */}
        <div style={{ padding: '22px 28px', borderBottom: `1px solid ${W.line2}`, background: W.panel,
          display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: W.ink, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800 }} className="wf-mono">03</div>
          <div style={{ flex: 1 }}>
            <H size={20} mb={5}>Shopify store setup cơ bản</H>
            <div style={{ display: 'flex', gap: 8 }}>
              <Tag tone="acc">Đang làm</Tag><Tag tone="line">Tuần 2</Tag><Tag tone="line">~3 giờ</Tag>
            </div>
          </div>
          <Card pad={14} fill={W.lateSoft} line="transparent" style={{ textAlign: 'center', minWidth: 130 }}>
            <T size={10.5} mono c={W.late} mb={4}>HẠN NỘP</T>
            <div style={{ fontSize: 22, fontWeight: 800, color: W.late, lineHeight: 1 }}>2 ngày</div>
            <T size={10.5} c={W.ink2} style={{ marginTop: 3 }}>12/06 · 18:00</T>
          </Card>
        </div>
        {/* scrolly body */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '20px 28px',
          display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <H size={14} mb={9} c={W.ink2}>CẦN HỌC</H>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {LEARN.map((l, i) => <Tag key={i} tone="line">{l}</Tag>)}
            </div>
          </div>
          <div>
            <H size={14} mb={9} c={W.ink2}>VIDEO GỢI Ý</H>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <Ph label="video" h={92} />
                  <div style={{ fontSize: 12, fontWeight: 600, marginTop: 7 }}>Video bài học {i + 1}</div>
                  <Skel lines={1} w={['70%']} style={{ marginTop: 5 }} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <H size={14} mb={9} c={W.ink2}>ĐẦU RA</H>
            <Card pad={14} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Ico name="doc" s={20} c={W.acc} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="wf-mono" style={{ fontSize: 13, fontWeight: 700 }}>03-shopify-basic-report.html</div>
                <T size={11.5} style={{ marginTop: 3 }}>Store demo: 5 SP · 3 collection · homepage · product page · menu · 5 trang policy</T>
              </div>
            </Card>
          </div>
        </div>
        {/* sticky submit bar */}
        <div style={{ flexShrink: 0, borderTop: `1px solid ${W.line2}`, background: W.paper,
          padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Note>Hướng B — 1 cột, header nổi bật + thanh nộp cố định dưới cùng</Note>
          <div style={{ flex: 1 }} />
          <Btn kind="ghost" size="md" icon={<Ico name="doc" s={14} />}>Xem prompt mẫu</Btn>
          <Btn kind="solid" size="md" icon={<Ico name="up" s={15} c="#fff" />}>Nộp báo cáo HTML</Btn>
        </div>
      </div>
    </Shell>
  );
}

// ─────────────────────────────────────────────────────────────
// 3 · SUBMIT (upload HTML)
// ─────────────────────────────────────────────────────────────
const SELFCHECK = ['Có tiêu đề & mục lục', 'Có section đầy đủ theo yêu cầu',
  'Đã tự chỉnh lại nội dung AI', 'Có checklist áp dụng', 'Mở được trên trình duyệt'];

function EmpSubmitA() {
  return (
    <Shell role="emp" active={3} title="Nộp báo cáo" sub="Task 03 · Shopify store setup" body={W.panel2}>
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card pad={0} r={14} style={{ width: 560, boxShadow: '0 10px 40px rgba(0,0,0,.10)' }}>
          <div style={{ padding: '18px 22px', borderBottom: `1px solid ${W.line2}`,
            display: 'flex', alignItems: 'center', gap: 10 }}>
            <Ico name="up" s={18} c={W.acc} />
            <H size={16}>Nộp file HTML cho Task 03</H>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 18, color: W.ink4 }}>×</span>
          </div>
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* dropzone */}
            <div style={{ border: `1.5px dashed ${W.accLine}`, borderRadius: 12, background: W.accSoft,
              padding: '26px 20px', textAlign: 'center' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#fff', margin: '0 auto 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${W.accLine}` }}>
                <Ico name="up" s={20} c={W.acc} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Kéo & thả file .html vào đây</div>
              <T size={12} style={{ marginTop: 4 }}>hoặc bấm để chọn từ máy · tối đa 5MB</T>
            </div>
            {/* chosen file */}
            <Card pad={12} fill={W.panel} onLine style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <Ico name="doc" s={18} c={W.done} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="wf-mono" style={{ fontSize: 12.5, fontWeight: 700 }}>03-shopify-basic-report.html</div>
                <T size={11} style={{ marginTop: 2 }}>248 KB · đã chọn</T>
              </div>
              <Tag tone="done">✓ Hợp lệ</Tag>
            </Card>
            <Field label="Ghi chú cho người chấm (tuỳ chọn)">
              <div style={{ height: 64, border: `1px solid ${W.line}`, borderRadius: 8, background: '#fff',
                padding: 10 }}><Skel lines={2} w={['80%', '50%']} /></div>
            </Field>
            <div>
              <T size={12} weight={600} c={W.ink2} mb={9}>Tự kiểm tra trước khi nộp</T>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                {SELFCHECK.map((c, i) => <Check key={i} on={i < 3} label={c} />)}
              </div>
            </div>
          </div>
          <div style={{ padding: '14px 22px', borderTop: `1px solid ${W.line2}`,
            display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn kind="ghost" size="md">Lưu nháp</Btn>
            <Btn kind="solid" size="md">Nộp báo cáo</Btn>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

function EmpSubmitB() {
  return (
    <Shell role="emp" active={3} title="Nộp báo cáo Task 03" sub="Đối chiếu yêu cầu · xem trước · nộp" body={W.panel}
      actions={<Tag tone="late"><Ico name="clock" s={12} c={W.late} /> Còn 2 ngày</Tag>}>
      <div style={{ display: 'flex', gap: 16, height: '100%' }}>
        {/* left: requirements recap */}
        <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card pad={16}>
            <T size={11} mono c={W.ink3} mb={10}>YÊU CẦU ĐẦU RA</T>
            <div className="wf-mono" style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>03-shopify-basic-report.html</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {SELFCHECK.map((c, i) => <Check key={i} on={i < 3} label={c} />)}
            </div>
          </Card>
          <Card pad={14} fill={W.accSoft} line="transparent">
            <T size={11} mono c={W.acc} mb={6}>NHẮC NHỞ</T>
            <T size={11.5} c={W.ink2}>Đã chỉnh lại nội dung AI cho tự nhiên chưa? Người chấm sẽ kiểm tra điểm này.</T>
          </Card>
        </div>
        {/* right: dropzone + preview */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ border: `1.5px dashed ${W.accLine}`, borderRadius: 12, background: W.accSoft,
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${W.accLine}` }}>
              <Ico name="up" s={18} c={W.acc} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>Kéo file .html vào đây hoặc bấm để chọn</div>
              <T size={11.5} style={{ marginTop: 2 }}>03-shopify-basic-report.html · 248 KB</T>
            </div>
            <Btn kind="soft" size="sm">Chọn file khác</Btn>
          </div>
          <Card pad={0} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '9px 14px', borderBottom: `1px solid ${W.line2}`, display: 'flex',
              alignItems: 'center', gap: 8, background: W.panel }}>
              <Dot tone="acc" /><T size={11.5} weight={600} c={W.ink}>Xem trước báo cáo</T>
              <div style={{ flex: 1 }} />
              <span className="wf-mono" style={{ fontSize: 10.5, color: W.ink3 }}>preview</span>
            </div>
            <div style={{ flex: 1, minHeight: 0, padding: 18, overflow: 'hidden' }}>
              <Skel lines={1} w={['45%']} h={13} />
              <Skel lines={3} w={['100%', '95%', '88%']} style={{ marginTop: 14 }} />
              <Ph label="bảng / hình minh hoạ" h={120} style={{ marginTop: 14 }} />
              <Skel lines={2} w={['92%', '64%']} style={{ marginTop: 14 }} />
            </div>
          </Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Note>Hướng B — đối chiếu yêu cầu &amp; xem trước ngay khi nộp</Note>
            <div style={{ flex: 1 }} />
            <Btn kind="ghost" size="md">Lưu nháp</Btn>
            <Btn kind="solid" size="md" icon={<Ico name="check" s={14} c="#fff" />}>Nộp báo cáo</Btn>
          </div>
        </div>
      </div>
    </Shell>
  );
}

// ─────────────────────────────────────────────────────────────
// 4 · MY PROGRESS
// ─────────────────────────────────────────────────────────────
function EmpProgressA() {
  const rows = [
    { id: '02', name: 'Tạo báo cáo HTML cơ bản', date: '05/06', grade: '8.5', st: 'done' },
    { id: '01', name: 'Dùng ChatGPT/AI cho công việc', date: '03/06', grade: '9.0', st: 'done' },
    { id: '03', name: 'Shopify store setup', date: '—', grade: '—', st: 'review' },
  ];
  return (
    <Shell role="emp" active={0} title="Tổng quan tiến độ" sub="Tuần 2 · NV mới"
      actions={<Btn kind="ghost" size="sm" icon={<Ico name="cal" s={14} />}>Xem lịch</Btn>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Stat n="2" label="Đã nộp" sub="trên 10 task" />
          <Stat n="1" label="Đang chờ chấm" tone={W.warn} />
          <Stat n="8.75" label="Điểm trung bình" tone={W.done} sub="thang 10" />
          <Stat n="2" label="Đúng hạn liên tiếp" tone={W.acc} />
        </div>
        <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
          <Card pad={18} style={{ width: 230, flexShrink: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <Ring pct={20} label="20%" sub="hoàn thành" size={128} stroke={12} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>2 / 10 task + 1 final</div>
              <T size={11.5} style={{ marginTop: 3 }}>Còn 8 task để hoàn tất khoá</T>
            </div>
          </Card>
          <Card pad={0} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '13px 16px', borderBottom: `1px solid ${W.line2}` }}>
              <H size={14}>Bài nộp gần đây</H>
            </div>
            <div style={{ display: 'flex', padding: '9px 16px', fontSize: 10.5, fontWeight: 700,
              color: W.ink3, letterSpacing: 0.3, background: W.panel }} className="wf-mono">
              <div style={{ width: 40 }}>#</div><div style={{ flex: 1 }}>TASK</div>
              <div style={{ width: 80 }}>NGÀY</div><div style={{ width: 70 }}>ĐIỂM</div><div style={{ width: 110 }}>TRẠNG THÁI</div>
            </div>
            {rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '13px 16px',
                borderTop: `1px solid ${W.line2}`, fontSize: 13 }}>
                <div className="wf-mono" style={{ width: 40, fontWeight: 700, color: W.ink3 }}>{r.id}</div>
                <div style={{ flex: 1, fontWeight: 600 }}>{r.name}</div>
                <div style={{ width: 80, color: W.ink2 }} className="wf-mono">{r.date}</div>
                <div style={{ width: 70, fontWeight: 700, color: r.grade === '—' ? W.ink4 : W.done }}>{r.grade}</div>
                <div style={{ width: 110 }}>
                  {r.st === 'done' ? <Tag tone="done">Đã chấm</Tag> : <Tag tone="warn">Chờ chấm</Tag>}
                </div>
              </div>
            ))}
          </Card>
        </div>
        <Note>Hướng A — dashboard với chỉ số, vòng tiến độ &amp; bảng bài nộp</Note>
      </div>
    </Shell>
  );
}

function EmpProgressB() {
  const miles = [
    { wk: 'Tuần 1', done: true, tasks: '2/2', badge: 'AI + HTML' },
    { wk: 'Tuần 2', done: false, tasks: '0/2', badge: 'Shopify', active: true },
    { wk: 'Tuần 3', done: false, tasks: '0/2', badge: 'Design + Data' },
    { wk: 'Tuần 4', done: false, tasks: '0/4', badge: 'Kênh bán + QA' },
    { wk: 'Final', done: false, tasks: '0/1', badge: 'Mini-brand', final: true },
  ];
  return (
    <Shell role="emp" active={0} title="Hành trình của tôi" sub="5 chặng · 11 đầu ra" body={W.panel}>
      <div style={{ display: 'flex', gap: 16, height: '100%' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card pad={18}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <H size={15}>Tiến độ theo chặng</H>
              <span className="wf-mono" style={{ fontSize: 12, color: W.ink2 }}>2 / 11 đầu ra</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[100, 0, 0, 0, 0].map((p, i) => (
                <div key={i} style={{ flex: miles[i].final ? 0.6 : 1 }}>
                  <Bar pct={p} h={9} c={p === 100 ? W.done : W.acc} />
                  <div style={{ fontSize: 10.5, color: i === 1 ? W.acc : W.ink3, fontWeight: i === 1 ? 700 : 500,
                    marginTop: 6, textAlign: 'center' }}>{miles[i].wk}</div>
                </div>
              ))}
            </div>
          </Card>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {miles.map((m, i) => (
              <Card key={i} pad={14} fill={m.active ? '#fff' : m.done ? W.doneSoft : '#fff'}
                line={m.active ? W.accLine : m.done ? 'transparent' : W.line}
                style={{ display: 'flex', alignItems: 'center', gap: 14,
                  boxShadow: m.active ? '0 2px 12px rgba(0,0,0,.05)' : 'none' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: m.done ? W.done : m.active ? W.acc : W.panel2,
                  color: m.done || m.active ? '#fff' : W.ink3, display: 'flex', alignItems: 'center',
                  justifyContent: 'center' }}>
                  {m.done ? <Ico name="check" s={17} c="#fff" /> : m.final ? <Ico name="star" s={16} c={m.active ? '#fff' : W.ink3} /> : <span style={{ fontWeight: 800, fontSize: 14 }}>{i + 1}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{m.wk}</div>
                    <Tag tone="line">{m.badge}</Tag>
                    {m.active && <Tag tone="acc">Đang ở đây</Tag>}
                  </div>
                  <T size={11.5} style={{ marginTop: 4 }}>{m.done ? 'Hoàn thành đúng hạn' : m.active ? 'Đang thực hiện — 2 task tuần này' : 'Sẽ mở khoá sau chặng trước'}</T>
                </div>
                <div className="wf-mono" style={{ fontSize: 13, fontWeight: 700,
                  color: m.done ? W.done : m.active ? W.acc : W.ink4 }}>{m.tasks}</div>
              </Card>
            ))}
          </div>
        </div>
        <div style={{ width: 230, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card pad={16} style={{ textAlign: 'center' }}>
            <Ring pct={20} label="20%" sub="khoá học" size={116} />
            <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 10 }}>Giữ nhịp tốt!</div>
            <T size={11} style={{ marginTop: 3 }}>2 lần nộp đúng hạn liên tiếp</T>
          </Card>
          <Card pad={14}>
            <T size={11} mono c={W.ink3} mb={10}>HUY HIỆU</T>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[['AI', true], ['HTML', true], ['Shopify', false], ['Canva', false], ['Sheet', false], ['QA', false]].map(([b, on], i) => (
                <div key={i} style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  border: `1px solid ${on ? W.accLine : W.line2}`, background: on ? W.accSoft : W.panel,
                  opacity: on ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9.5, fontWeight: 700, color: on ? W.acc : W.ink4, textAlign: 'center' }} className="wf-mono">{b}</div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

// ─────────────────────────────────────────────────────────────
// 5 · WEEKLY SCHEDULE
// ─────────────────────────────────────────────────────────────
function EmpScheduleA() {
  const dueDays = { 5: { t: '01', tone: 'done' }, 8: { t: '02', tone: 'done' },
    12: { t: '03', tone: 'late' }, 15: { t: '04', tone: 'acc' },
    19: { t: '05', tone: 'neutral' }, 22: { t: '06', tone: 'neutral' },
    26: { t: '07', tone: 'neutral' }, 29: { t: '10', tone: 'warn' } };
  const days = Array.from({ length: 35 }, (_, i) => i - 1); // offset start
  return (
    <Shell role="emp" active={2} title="Lịch nộp · Tháng 6" sub="Hạn nộp từng task trong tháng"
      actions={<div style={{ display: 'flex', gap: 6 }}><Btn kind="ghost" size="sm">‹</Btn><Btn kind="ghost" size="sm">Hôm nay</Btn><Btn kind="ghost" size="sm">›</Btn></div>}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {[['done', 'Đã nộp'], ['acc', 'Sắp tới'], ['late', 'Gần hết hạn'], ['warn', 'Task KEY'], ['neutral', 'Chưa mở']].map(([t, l], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Dot tone={t} /><span style={{ fontSize: 11.5, color: W.ink2 }}>{l}</span></div>
          ))}
        </div>
        <Card pad={0} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', background: W.panel }}>
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
              <div key={d} style={{ padding: '9px 0', textAlign: 'center', fontSize: 11, fontWeight: 700,
                color: W.ink3, borderBottom: `1px solid ${W.line2}` }} className="wf-mono">{d}</div>
            ))}
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gridTemplateRows: 'repeat(5,1fr)' }}>
            {days.map((d, i) => {
              const valid = d >= 1 && d <= 30;
              const due = dueDays[d];
              return (
                <div key={i} style={{ borderRight: `1px solid ${W.line2}`, borderBottom: `1px solid ${W.line2}`,
                  padding: 7, position: 'relative', background: d === 8 ? W.accSoft : '#fff' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: valid ? W.ink2 : W.ink4 }} className="wf-mono">{valid ? d : ''}</div>
                  {due && (
                    <div style={{ marginTop: 6, padding: '4px 6px', borderRadius: 6,
                      background: due.tone === 'done' ? W.doneSoft : due.tone === 'late' ? W.lateSoft
                        : due.tone === 'acc' ? W.accSoft : due.tone === 'warn' ? W.warnSoft : W.panel,
                      display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Dot tone={due.tone} size={7} />
                      <span style={{ fontSize: 10, fontWeight: 700,
                        color: due.tone === 'neutral' ? W.ink3 : W[due.tone] }} className="wf-mono">Task {due.t}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
        <Note>Hướng A — lịch tháng, đánh dấu hạn nộp từng task</Note>
      </div>
    </Shell>
  );
}

function EmpScheduleB() {
  const agenda = [
    { wk: 'Tuần này · Tuần 2', items: [
      { id: '03', name: 'Shopify store setup', due: 'Th 5, 12/06 · 18:00', st: 'late', left: 'Còn 2 ngày' },
      { id: '04', name: 'Đăng sản phẩm & mô tả', due: 'CN, 15/06 · 18:00', st: 'acc', left: 'Còn 5 ngày' } ] },
    { wk: 'Tuần sau · Tuần 3', items: [
      { id: '05', name: 'Canva cho ảnh & banner', due: 'Th 5, 19/06', st: 'todo', left: '' },
      { id: '06', name: 'Google Sheet quản lý SP', due: 'CN, 22/06', st: 'todo', left: '' } ] },
    { wk: 'Đã hoàn thành', items: [
      { id: '02', name: 'Tạo báo cáo HTML', due: 'Đã nộp 05/06', st: 'done', left: '8.5đ' },
      { id: '01', name: 'Dùng ChatGPT/AI', due: 'Đã nộp 03/06', st: 'done', left: '9.0đ' } ] },
  ];
  return (
    <Shell role="emp" active={2} title="Lịch nộp theo tuần" sub="Danh sách hạn nộp · gần nhất ở trên" body={W.panel}
      actions={<Btn kind="ghost" size="sm" icon={<Ico name="cal" s={14} />}>Dạng lịch</Btn>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflow: 'hidden' }}>
        {agenda.map((g, gi) => (
          <div key={gi}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
              <H size={13} c={W.ink2}>{g.wk}</H>
              <div style={{ flex: 1, height: 1, background: W.line2 }} />
              <span className="wf-mono" style={{ fontSize: 11, color: W.ink4 }}>{g.items.length} task</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {g.items.map((t) => (
                <Card key={t.id} pad={13} fill={t.st === 'done' ? W.doneSoft : '#fff'}
                  line={t.st === 'done' ? 'transparent' : t.st === 'late' ? W.accLine : W.line}
                  style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: W.panel,
                    border: `1px solid ${W.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color: W.ink2 }} className="wf-mono">{t.id}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                      <Ico name="clock" s={12} c={W.ink3} />
                      <T size={11.5} c={W.ink3}>{t.due}</T>
                    </div>
                  </div>
                  {t.st === 'done' ? <Tag tone="done">{t.left}</Tag>
                    : t.st === 'late' ? <Tag tone="late">{t.left}</Tag>
                    : t.st === 'acc' ? <Tag tone="acc">{t.left}</Tag>
                    : <Tag tone="neutral">Chưa mở</Tag>}
                  {t.st !== 'done' && t.st !== 'todo' && <Btn kind="soft" size="sm">Nộp</Btn>}
                </Card>
              ))}
            </div>
          </div>
        ))}
        <Note>Hướng B — danh sách agenda gom theo tuần, nộp nhanh ngay tại dòng</Note>
      </div>
    </Shell>
  );
}

Object.assign(window, {
  EmpRoadmapA, EmpRoadmapB, EmpTaskA, EmpTaskB, EmpSubmitA, EmpSubmitB,
  EmpProgressA, EmpProgressB, EmpScheduleA, EmpScheduleB,
});

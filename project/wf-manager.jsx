// wf-manager.jsx — manager-facing screens, 2 layout directions each.
const { W, Skel, Ph, Card, H, T, Btn, Tag, Dot, Bar, Ring, Check,
  Avatar, Field, Divider, Note, Stat, Ico, Shell } = window;

const TASK_COLS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'F'];
// d=done r=review(chờ chấm) l=late(trễ) .=chưa làm
const EMPLOYEES = [
  { name: 'Lê Chi', i: 'LC', cells: 'dddddddddrd', pct: 91, st: 'top' },
  { name: 'Nguyễn An', i: 'An', cells: 'ddr........', pct: 20, st: 'ok' },
  { name: 'Hồ Giang', i: 'HG', cells: 'dddddd.l...', pct: 55, st: 'ok' },
  { name: 'Vũ Em', i: 'VE', cells: 'dddddr.....', pct: 45, st: 'ok' },
  { name: 'Trần Bình', i: 'TB', cells: 'dddl.......', pct: 27, st: 'late' },
  { name: 'Phạm Dũng', i: 'PD', cells: 'ddl........', pct: 18, st: 'late' },
];
const cellMap = { d: 'done', r: 'review', l: 'late', '.': 'empty' };

function MxCell({ c, size = 26 }) {
  const t = cellMap[c];
  const styleByT = {
    done: { background: W.doneSoft, color: W.done, ch: '✓' },
    review: { background: W.warnSoft, color: W.warn, ch: '◷' },
    late: { background: W.lateSoft, color: W.late, ch: '!' },
    empty: { background: W.paper, color: W.ink4, ch: '' },
  };
  const s = styleByT[t];
  return (
    <div style={{ width: size, height: size, borderRadius: 6, background: s.background,
      border: t === 'empty' ? `1px solid ${W.line2}` : 'none', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: s.color }}>{s.ch}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6 · MATRIX (nhân viên × task)
// ─────────────────────────────────────────────────────────────
function MgrMatrixA() {
  return (
    <Shell role="mgr" active={1} title="Bảng tiến độ · Nhân viên × Task" sub="6 nhân viên · 10 task + final"
      actions={<><Btn kind="ghost" size="sm" icon={<Ico name="filter" s={13} />}>Lọc</Btn><Btn kind="ghost" size="sm" icon={<Ico name="search" s={13} />}>Tìm NV</Btn></>}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {[['done', 'Đã nộp'], ['review', 'Chờ chấm'], ['late', 'Trễ hạn'], ['empty', 'Chưa làm']].map(([t, l], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MxCell c={{ done: 'd', review: 'r', late: 'l', empty: '.' }[t]} size={16} />
              <span style={{ fontSize: 11.5, color: W.ink2 }}>{l}</span></div>
          ))}
        </div>
        <Card pad={0} style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* header row */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', background: W.panel,
            borderBottom: `1px solid ${W.line2}` }}>
            <div style={{ width: 168, fontSize: 11, fontWeight: 700, color: W.ink3 }} className="wf-mono">NHÂN VIÊN</div>
            <div style={{ flex: 1, display: 'flex', gap: 6 }}>
              {TASK_COLS.map((t) => (
                <div key={t} style={{ width: 26, textAlign: 'center', fontSize: 10.5, fontWeight: 700,
                  color: t === 'F' ? W.acc : t === '10' ? W.warn : W.ink3 }} className="wf-mono">{t}</div>
              ))}
            </div>
            <div style={{ width: 96, textAlign: 'right', fontSize: 11, fontWeight: 700, color: W.ink3 }} className="wf-mono">TIẾN ĐỘ</div>
          </div>
          {EMPLOYEES.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '9px 14px',
              borderTop: i ? `1px solid ${W.line2}` : 'none', background: e.st === 'late' ? W.lateSoft : '#fff' }}>
              <div style={{ width: 168, display: 'flex', alignItems: 'center', gap: 9 }}>
                <Avatar s={26} txt={e.i} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{e.name}</div>
                  {e.st === 'late' && <div style={{ fontSize: 9.5, color: W.late, fontWeight: 600 }}>Có task trễ</div>}
                  {e.st === 'top' && <div style={{ fontSize: 9.5, color: W.done, fontWeight: 600 }}>Dẫn đầu</div>}
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', gap: 6 }}>
                {e.cells.split('').map((c, j) => <MxCell key={j} c={c} />)}
              </div>
              <div style={{ width: 96, display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'flex-end' }}>
                <Bar pct={e.pct} h={6} style={{ width: 46 }} c={e.st === 'late' ? W.late : e.st === 'top' ? W.done : W.acc} />
                <span className="wf-mono" style={{ fontSize: 11, fontWeight: 700, width: 28, textAlign: 'right' }}>{e.pct}%</span>
              </div>
            </div>
          ))}
        </Card>
        <Note>Hướng A — bảng matrix cổ điển, ô trạng thái + cột tiến độ</Note>
      </div>
    </Shell>
  );
}

function MgrMatrixB() {
  const heat = (c) => ({ d: W.done, r: W.warn, l: W.late, '.': W.panel2 }[c]);
  return (
    <Shell role="mgr" active={1} title="Bản đồ nhiệt tiến độ" sub="Đậm = đã nộp · vàng = chờ chấm · đỏ = trễ" body={W.panel}
      actions={<Tag tone="acc">Trung bình 43%</Tag>}>
      <div style={{ display: 'flex', gap: 14, height: '100%' }}>
        <Card pad={0} style={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', padding: '12px 16px 10px 178px', gap: 6, borderBottom: `1px solid ${W.line2}` }}>
            {TASK_COLS.map((t) => (
              <div key={t} style={{ width: 30, textAlign: 'center', fontSize: 10.5, fontWeight: 700,
                color: t === 'F' ? W.acc : W.ink3 }} className="wf-mono">{t}</div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            {EMPLOYEES.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '0 16px',
                height: `calc((100% ) / 6)`, borderTop: i ? `1px solid ${W.line2}` : 'none' }}>
                <div style={{ width: 162, display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Avatar s={24} txt={e.i} /><div style={{ fontSize: 12.5, fontWeight: 600 }}>{e.name}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {e.cells.split('').map((c, j) => (
                    <div key={j} style={{ width: 30, height: 22, borderRadius: 5, background: heat(c),
                      border: c === '.' ? `1px solid ${W.line2}` : 'none', opacity: c === '.' ? 0.6 : 1 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
        {/* right summary rail */}
        <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card pad={15}>
            <T size={11} mono c={W.ink3} mb={12}>XẾP HẠNG TIẾN ĐỘ</T>
            {[...EMPLOYEES].sort((a, b) => b.pct - a.pct).map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                <span className="wf-mono" style={{ fontSize: 11, color: W.ink4, width: 12 }}>{i + 1}</span>
                <Avatar s={22} txt={e.i} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{e.name}</div>
                  <Bar pct={e.pct} h={4} style={{ marginTop: 3 }} c={e.st === 'late' ? W.late : e.st === 'top' ? W.done : W.acc} />
                </div>
                <span className="wf-mono" style={{ fontSize: 11, fontWeight: 700 }}>{e.pct}%</span>
              </div>
            ))}
          </Card>
          <Card pad={14} fill={W.lateSoft} line="transparent">
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Ico name="flag" s={14} c={W.late} />
              <T size={12} weight={700} c={W.late}>2 NV đang trễ</T>
            </div>
            <T size={11} c={W.ink2} style={{ marginTop: 6 }}>Trần Bình, Phạm Dũng — cần nhắc nhở.</T>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

// ─────────────────────────────────────────────────────────────
// 7 · OVERVIEW STATS
// ─────────────────────────────────────────────────────────────
function MgrStatsA() {
  const weekBars = [['T1', 100], ['T2', 60], ['T3', 30], ['T4', 15], ['Final', 8]];
  const late = [['Phạm Dũng', 'Task 03 · trễ 3 ngày'], ['Trần Bình', 'Task 04 · trễ 1 ngày']];
  return (
    <Shell role="mgr" active={0} title="Thống kê đào tạo" sub="Toàn đội · cập nhật hôm nay"
      actions={<Btn kind="ghost" size="sm" icon={<Ico name="cal" s={13} />}>Tháng 6</Btn>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Stat n="6" label="Nhân viên" sub="đang đào tạo" />
          <Stat n="43%" label="Hoàn thành TB" tone={W.acc} />
          <Stat n="2" label="Đang trễ hạn" tone={W.late} sub="cần nhắc" />
          <Stat n="5" label="Chờ chấm" tone={W.warn} />
          <Stat n="8.2" label="Điểm TB đội" tone={W.done} sub="thang 10" />
        </div>
        <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
          <Card pad={18} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <H size={14} mb={4}>Tỉ lệ hoàn thành theo tuần</H>
            <T size={11.5} mb={18}>% đầu ra đã nộp trên tổng yêu cầu</T>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 22, padding: '0 8px' }}>
              {weekBars.map(([l, p], i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ width: '100%', height: p + '%', background: i === 0 ? W.done : W.acc,
                      borderRadius: '6px 6px 0 0', position: 'relative' }}>
                      <span className="wf-mono" style={{ position: 'absolute', top: -18, left: 0, right: 0,
                        textAlign: 'center', fontSize: 11, fontWeight: 700, color: W.ink2 }}>{p}%</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: W.ink2 }}>{l}</span>
                </div>
              ))}
            </div>
          </Card>
          <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Card pad={16}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Ico name="flag" s={15} c={W.late} /><H size={14}>Đang trễ deadline</H>
              </div>
              {late.map(([n, d], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 0', borderTop: i ? `1px solid ${W.line2}` : 'none' }}>
                  <Avatar s={28} txt={n.split(' ').pop().slice(0, 2)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{n}</div>
                    <div style={{ fontSize: 10.5, color: W.late }}>{d}</div>
                  </div>
                  <Btn kind="soft" size="sm">Nhắc</Btn>
                </div>
              ))}
            </Card>
            <Card pad={16} style={{ flex: 1 }}>
              <H size={14} mb={12}>Dẫn đầu</H>
              {[...EMPLOYEES].sort((a, b) => b.pct - a.pct).slice(0, 3).map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 13 }}>
                  <div className="wf-mono" style={{ fontSize: 13, fontWeight: 800,
                    color: i === 0 ? W.done : W.ink3, width: 16 }}>{i + 1}</div>
                  <Avatar s={28} txt={e.i} />
                  <div style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>{e.name}</div>
                  <span className="wf-mono" style={{ fontSize: 12, fontWeight: 700, color: W.done }}>{e.pct}%</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
        <Note>Hướng A — KPI + biểu đồ cột theo tuần + danh sách trễ + bảng xếp hạng</Note>
      </div>
    </Shell>
  );
}

function MgrStatsB() {
  return (
    <Shell role="mgr" active={0} title="Tổng quan nhanh" sub="Một màn nhìn ra sức khoẻ đào tạo" body={W.panel}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Card pad={22} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 24 }}>
            <Ring pct={43} label="43%" sub="hoàn thành" size={130} stroke={13} />
            <div>
              <H size={30} weight={800} style={{ letterSpacing: -1 }}>43%</H>
              <T size={13} mb={10}>tiến độ trung bình toàn đội</T>
              <div style={{ display: 'flex', gap: 8 }}>
                <Tag tone="done">▲ 12% so với tuần trước</Tag>
              </div>
            </div>
          </Card>
          <Card pad={20} style={{ width: 260, flexShrink: 0 }}>
            <T size={11} mono c={W.ink3} mb={14}>PHÂN BỐ TRẠNG THÁI</T>
            {[['Đã nộp & chấm', 38, W.done], ['Chờ chấm', 18, W.warn], ['Đang làm', 26, W.acc], ['Trễ hạn', 18, W.late]].map(([l, p, c], i) => (
              <div key={i} style={{ marginBottom: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: W.ink2 }}>{l}</span>
                  <span className="wf-mono" style={{ fontSize: 11.5, fontWeight: 700 }}>{p}%</span>
                </div>
                <Bar pct={p} h={6} c={c} />
              </div>
            ))}
          </Card>
        </div>
        <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
          <Card pad={18} style={{ flex: 1, minWidth: 0 }}>
            <H size={14} mb={16}>Xu hướng nộp bài · 6 tuần</H>
            <div style={{ height: 'calc(100% - 36px)', display: 'flex', alignItems: 'flex-end', gap: 14 }}>
              {[20, 35, 30, 48, 55, 43].map((p, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ width: '100%', height: p + '%', background: W.accSoft,
                      borderTop: `3px solid ${W.acc}`, borderRadius: '4px 4px 0 0' }} /></div>
                  <span className="wf-mono" style={{ fontSize: 10, color: W.ink3 }}>W{i + 1}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card pad={18} style={{ width: 300, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Ico name="flag" s={15} c={W.late} /><H size={14}>Cần chú ý</H>
            </div>
            {[['Phạm Dũng', 'Trễ Task 03 · 3 ngày', 'late'], ['Trần Bình', 'Trễ Task 04 · 1 ngày', 'late'],
              ['5 bài', 'đang chờ bạn chấm', 'warn']].map(([n, d, t], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 0',
                borderTop: i ? `1px solid ${W.line2}` : 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: t === 'late' ? W.lateSoft : W.warnSoft, display: 'flex',
                  alignItems: 'center', justifyContent: 'center' }}>
                  <Ico name={t === 'late' ? 'clock' : 'inbox'} s={15} c={t === 'late' ? W.late : W.warn} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{n}</div>
                  <div style={{ fontSize: 10.5, color: W.ink3 }}>{d}</div>
                </div>
                <Ico name="chev" s={14} c={W.ink4} />
              </div>
            ))}
            <Note style={{ marginTop: 12 }}>Hướng B — số lớn + donut, gọn</Note>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

// ─────────────────────────────────────────────────────────────
// 8 · EMPLOYEE PROFILE
// ─────────────────────────────────────────────────────────────
const PROFILE_SUBS = [
  { id: '01', name: 'Dùng ChatGPT/AI cho công việc', date: '03/06', grade: '9.0', st: 'done' },
  { id: '02', name: 'Tạo báo cáo HTML cơ bản', date: '05/06', grade: '8.5', st: 'done' },
  { id: '03', name: 'Shopify store setup cơ bản', date: '—', grade: '—', st: 'review' },
  { id: '04', name: 'Đăng sản phẩm & viết mô tả', date: '—', grade: '—', st: 'todo' },
];
function GradePill({ st, grade }) {
  if (st === 'done') return <Tag tone="done">{grade} điểm</Tag>;
  if (st === 'review') return <Tag tone="warn">Chờ chấm</Tag>;
  return <Tag tone="neutral">Chưa nộp</Tag>;
}

function MgrProfileA() {
  return (
    <Shell role="mgr" active={3} title="Hồ sơ nhân viên" sub="Nguyễn An · NV mới" pad={0} body={W.paper}
      actions={<Btn kind="ghost" size="sm">‹ Danh sách</Btn>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* header */}
        <div style={{ padding: '22px 28px 0', borderBottom: `1px solid ${W.line2}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar s={56} txt="An" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <H size={20}>Nguyễn An</H><Tag tone="acc">Đang đào tạo</Tag>
              </div>
              <T size={12.5} style={{ marginTop: 4 }}>Bắt đầu 01/06 · Tuần 2/4 · an.nguyen@omegason.vn</T>
            </div>
            <div style={{ display: 'flex', gap: 22, textAlign: 'center' }}>
              {[['20%', 'Tiến độ'], ['8.75', 'Điểm TB'], ['2/2', 'Đúng hạn']].map(([n, l], i) => (
                <div key={i}><div style={{ fontSize: 20, fontWeight: 800, color: W.ink }}>{n}</div>
                  <div style={{ fontSize: 11, color: W.ink3, marginTop: 2 }}>{l}</div></div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 26, marginTop: 18 }}>
            {['Tổng quan', 'Bài nộp', 'Lịch sử'].map((t, i) => (
              <div key={i} style={{ paddingBottom: 12, fontSize: 13.5, fontWeight: i === 1 ? 700 : 500,
                color: i === 1 ? W.acc : W.ink3, borderBottom: i === 1 ? `2px solid ${W.acc}` : '2px solid transparent' }}>{t}</div>
            ))}
          </div>
        </div>
        {/* body: submissions timeline */}
        <div style={{ flex: 1, minHeight: 0, padding: '20px 28px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <H size={15}>Các bài đã nộp</H>
            <span className="wf-mono" style={{ fontSize: 11.5, color: W.ink3 }}>2 đã chấm · 1 chờ chấm</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PROFILE_SUBS.map((s, i) => (
              <Card key={i} pad={14} style={{ display: 'flex', alignItems: 'center', gap: 14,
                opacity: s.st === 'todo' ? 0.6 : 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: W.panel,
                  border: `1px solid ${W.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: W.ink2 }} className="wf-mono">{s.id}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{s.name}</div>
                  <div className="wf-mono" style={{ fontSize: 10.5, color: W.ink4, marginTop: 2 }}>{s.id}-report.html · {s.date !== '—' ? 'nộp ' + s.date : 'chưa nộp'}</div>
                </div>
                <GradePill st={s.st} grade={s.grade} />
                {s.st !== 'todo' && <Btn kind="ghost" size="sm">{s.st === 'review' ? 'Chấm bài' : 'Xem'}</Btn>}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function MgrProfileB() {
  return (
    <Shell role="mgr" active={3} title="Hồ sơ · Nguyễn An" sub="Hai cột · hồ sơ + bài nộp" body={W.panel}
      actions={<><Btn kind="ghost" size="sm">Nhắn tin</Btn><Btn kind="solid" size="sm">Chấm bài chờ</Btn></>}>
      <div style={{ display: 'flex', gap: 16, height: '100%' }}>
        {/* left profile */}
        <div style={{ width: 270, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card pad={18} style={{ textAlign: 'center' }}>
            <Avatar s={64} txt="An" style={{ margin: '0 auto 12px' }} />
            <H size={17}>Nguyễn An</H>
            <T size={12} style={{ marginTop: 3 }}>NV mới · Tuần 2/4</T>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10 }}>
              <Tag tone="acc">Đang đào tạo</Tag><Tag tone="done">Đúng hạn</Tag>
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <Ring pct={20} label="20%" sub="tiến độ" size={104} />
          </Card>
          <Card pad={16}>
            <T size={11} mono c={W.ink3} mb={12}>CHỈ SỐ</T>
            {[['Điểm trung bình', '8.75 / 10', W.done], ['Bài đã nộp', '2 / 10', W.ink], ['Đúng hạn', '2 / 2', W.done], ['Đang chờ chấm', '1', W.warn]].map(([l, v, c], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                borderTop: i ? `1px solid ${W.line2}` : 'none' }}>
                <T size={12.5} c={W.ink2}>{l}</T>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: c }}>{v}</div>
              </div>
            ))}
          </Card>
        </div>
        {/* right submissions */}
        <Card pad={0} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${W.line2}`, display: 'flex', alignItems: 'center' }}>
            <H size={15}>Bài nộp & đánh giá</H>
            <div style={{ flex: 1 }} />
            <Tag tone="line">Tất cả</Tag>
          </div>
          <div style={{ flex: 1, minHeight: 0, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
            {PROFILE_SUBS.map((s, i) => (
              <Card key={i} pad={14} fill={s.st === 'review' ? W.warnSoft : '#fff'}
                line={s.st === 'review' ? 'transparent' : W.line} style={{ opacity: s.st === 'todo' ? 0.55 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="wf-mono" style={{ fontSize: 12, fontWeight: 800, color: W.ink3 }}>{s.id}</span>
                  <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{s.name}</div>
                  <GradePill st={s.st} grade={s.grade} />
                </div>
                {s.st === 'done' && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${W.line2}`, display: 'flex', gap: 10 }}>
                    <Ico name="doc" s={14} c={W.ink3} />
                    <Skel lines={1} w={['72%']} h={6} style={{ flex: 1, marginTop: 2 }} />
                  </div>
                )}
                {s.st === 'review' && <Btn kind="solid" size="sm" full style={{ marginTop: 10 }}>Mở chấm bài này</Btn>}
              </Card>
            ))}
            <Note>Hướng B — hồ sơ trái, danh sách bài nộp + điểm bên phải</Note>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

// ─────────────────────────────────────────────────────────────
// 9 · REVIEW QUEUE
// ─────────────────────────────────────────────────────────────
const QUEUE = [
  { nm: 'Lê Chi', i: 'LC', task: '10', name: 'Store QA trước khi launch', when: '2 giờ trước', key: true, sel: false },
  { nm: 'Nguyễn An', i: 'An', task: '03', name: 'Shopify store setup', when: '5 giờ trước', sel: true },
  { nm: 'Vũ Em', i: 'VE', task: '06', name: 'Google Sheet quản lý SP', when: 'Hôm qua', sel: false },
  { nm: 'Hồ Giang', i: 'HG', task: '08', name: 'Google Merchant Center', when: 'Hôm qua', sel: false },
  { nm: 'Trần Bình', i: 'TB', task: '04', name: 'Đăng sản phẩm & mô tả', when: '2 ngày trước', late: true, sel: false },
];

function MgrQueueA() {
  return (
    <Shell role="mgr" active={2} title="Hàng chờ chấm bài" sub="5 báo cáo đang chờ duyệt"
      actions={<><Btn kind="ghost" size="sm" icon={<Ico name="filter" s={13} />}>Lọc theo task</Btn><Btn kind="ghost" size="sm">Mới nhất ▾</Btn></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Stat n="5" label="Chờ chấm" tone={W.warn} />
          <Stat n="1" label="Task KEY (QA)" tone={W.acc} />
          <Stat n="1" label="Nộp trễ" tone={W.late} />
          <Stat n="12" label="Đã chấm tuần này" tone={W.done} />
        </div>
        <Card pad={0} style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', padding: '10px 18px', background: W.panel, borderBottom: `1px solid ${W.line2}`,
            fontSize: 10.5, fontWeight: 700, color: W.ink3, letterSpacing: 0.3 }} className="wf-mono">
            <div style={{ width: 200 }}>NHÂN VIÊN</div><div style={{ flex: 1 }}>BÀI NỘP</div>
            <div style={{ width: 130 }}>THỜI GIAN</div><div style={{ width: 120 }} />
          </div>
          {QUEUE.map((q, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '13px 18px',
              borderTop: i ? `1px solid ${W.line2}` : 'none', background: q.late ? W.lateSoft : '#fff' }}>
              <div style={{ width: 200, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar s={32} txt={q.i} />
                <div><div style={{ fontSize: 13, fontWeight: 600 }}>{q.nm}</div>
                  <div style={{ fontSize: 10.5, color: W.ink3 }}>NV mới</div></div>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="wf-mono" style={{ fontSize: 12, fontWeight: 800, color: W.ink3 }}>{q.task}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}>
                    {q.name}{q.key && <Tag tone="warn">KEY</Tag>}{q.late && <Tag tone="late">Trễ</Tag>}</div>
                  <div className="wf-mono" style={{ fontSize: 10, color: W.ink4, marginTop: 2 }}>{q.task}-report.html</div>
                </div>
              </div>
              <div style={{ width: 130, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Ico name="clock" s={13} c={W.ink4} />
                <span style={{ fontSize: 11.5, color: W.ink2 }}>{q.when}</span></div>
              <div style={{ width: 120, display: 'flex', justifyContent: 'flex-end', gap: 7 }}>
                <Btn kind="ghost" size="sm">Xem</Btn><Btn kind="solid" size="sm">Chấm</Btn>
              </div>
            </div>
          ))}
        </Card>
        <Note>Hướng A — hộp thư các bài chờ chấm, mở từng bài để chấm</Note>
      </div>
    </Shell>
  );
}

function MgrQueueB() {
  return (
    <Shell role="mgr" active={2} title="Chấm bài" sub="Danh sách trái · xem & chấm bên phải" body={W.panel} pad={18}>
      <div style={{ display: 'flex', gap: 16, height: '100%' }}>
        {/* queue list */}
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 9, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
            <T size={11} mono c={W.ink3}>HÀNG CHỜ · 5</T><Tag tone="line">Mới nhất</Tag>
          </div>
          {QUEUE.map((q, i) => (
            <Card key={i} pad={12} fill={q.sel ? W.accSoft : '#fff'} line={q.sel ? W.accLine : W.line}
              style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'default',
                boxShadow: q.sel ? '0 2px 10px rgba(0,0,0,.05)' : 'none' }}>
              <Avatar s={30} txt={q.i} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.nm}</div>
                <div style={{ fontSize: 10.5, color: W.ink3 }}>Task {q.task} · {q.when}</div>
              </div>
              {q.key && <Dot tone="warn" />}{q.late && <Dot tone="late" />}
            </Card>
          ))}
        </div>
        {/* preview + grade */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', gap: 14 }}>
          {/* report preview */}
          <Card pad={0} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '11px 16px', borderBottom: `1px solid ${W.line2}`, background: W.panel,
              display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar s={26} txt="An" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Nguyễn An · Task 03</div>
                <div className="wf-mono" style={{ fontSize: 10, color: W.ink4 }}>03-shopify-basic-report.html</div>
              </div>
              <Btn kind="ghost" size="sm" icon={<Ico name="up" s={13} />}>Mở tab mới</Btn>
            </div>
            <div style={{ flex: 1, minHeight: 0, padding: 20, overflow: 'hidden' }}>
              <Skel lines={1} w={['50%']} h={15} />
              <Skel lines={1} w={['30%']} h={8} style={{ marginTop: 10 }} />
              <Ph label="ảnh chụp store demo" h={130} style={{ marginTop: 16 }} />
              <Skel lines={3} w={['100%', '94%', '80%']} style={{ marginTop: 16 }} />
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <Ph label="product page" h={80} style={{ flex: 1 }} />
                <Ph label="collection" h={80} style={{ flex: 1 }} />
              </div>
            </div>
          </Card>
          {/* grade panel */}
          <div style={{ width: 244, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Card pad={16}>
              <T size={11} mono c={W.ink3} mb={12}>CHẤM ĐIỂM</T>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                <input readOnly value="8.5" style={{ width: 64, fontSize: 24, fontWeight: 800, textAlign: 'center',
                  border: `1px solid ${W.line}`, borderRadius: 8, padding: '6px 0', color: W.ink, fontFamily: W.font }} />
                <span style={{ fontSize: 14, color: W.ink3 }}>/ 10</span>
              </div>
              <T size={11} weight={600} c={W.ink2} mb={8}>Tiêu chí</T>
              {['Đủ section yêu cầu', 'Nội dung tự chỉnh (không copy)', 'Trình bày dễ đọc'].map((c, i) => (
                <Check key={i} on={i < 2} label={c} style={{ marginBottom: 8 }} />
              ))}
            </Card>
            <Card pad={14}>
              <Field label="Nhận xét cho nhân viên">
                <div style={{ height: 72, border: `1px solid ${W.line}`, borderRadius: 8, padding: 10 }}>
                  <Skel lines={2} w={['85%', '55%']} /></div>
              </Field>
            </Card>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn kind="ghost" size="md" style={{ flex: 1 }}>Yêu cầu sửa</Btn>
              <Btn kind="solid" size="md" style={{ flex: 1 }}>Duyệt</Btn>
            </div>
            <Note>Hướng B — xem báo cáo &amp; chấm cùng lúc</Note>
          </div>
        </div>
      </div>
    </Shell>
  );
}

Object.assign(window, {
  MgrMatrixA, MgrMatrixB, MgrStatsA, MgrStatsB, MgrProfileA, MgrProfileB, MgrQueueA, MgrQueueB,
});

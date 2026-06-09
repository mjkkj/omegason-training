import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Bar, Ring, Stat, Ico, Avatar } from '../../design-system'
import { useStore } from '../../store'
import { TASKS } from '../../data'

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`
}

export default function Progress() {
  const { currentUser, submissions } = useStore()
  const empId = currentUser?.id
  const now = new Date()

  const mySubs = submissions.filter(s => s.employeeId === empId)
  const graded  = mySubs.filter(s => s.status === 'graded')
  const pending = mySubs.filter(s => s.status === 'pending')

  const total = TASKS.length
  const donePct = Math.round((graded.length / total) * 100)

  const avgGrade = graded.length
    ? Math.round((graded.reduce((s, x) => s + (x.grade || 0), 0) / graded.length) * 10) / 10
    : null

  // On-time submissions (submitted before deadline)
  const onTime = graded.filter(s => {
    const task = TASKS.find(t => t.id === s.taskId)
    return task && new Date(s.submittedAt) <= new Date(task.deadline)
  }).length

  // Recent submissions (most recent first)
  const recent = [...mySubs].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 8)

  // Week progress
  const weeks = [1,2,3,4].map(w => {
    const wTasks = TASKS.filter(t => t.week === w)
    const wDone  = wTasks.filter(t => graded.find(s => s.taskId === t.id)).length
    return { w, pct: Math.round((wDone / wTasks.length) * 100), done: wDone, total: wTasks.length }
  })

  return (
    <Shell role="emp" active={0} title="Tổng quan tiến độ" sub={`${currentUser?.name} · NV mới`}
      actions={
        <Link to="/emp/schedule">
          <Btn kind="ghost" size="sm" icon={<Ico name="cal" s={14}/>}>Xem lịch</Btn>
        </Link>
      }>

      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {/* KPI row */}
        <div style={{ display:'flex', gap:12 }}>
          <Stat n={graded.length} label="Đã nộp & chấm" sub={`trên ${total} task`} />
          <Stat n={pending.length} label="Đang chờ chấm" tone={pending.length ? W.warn : W.ink} />
          <Stat n={avgGrade ?? '—'} label="Điểm trung bình" tone={W.done} sub="thang 10" />
          <Stat n={onTime} label="Đúng hạn liên tiếp" tone={W.acc} />
        </div>

        <div style={{ display:'flex', gap:14 }}>
          {/* ring + week bars */}
          <div style={{ display:'flex', flexDirection:'column', gap:14, width:230, flexShrink:0 }}>
            <Card pad={18} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
              <Ring pct={donePct} label={`${donePct}%`} sub="hoàn thành" size={128} stroke={12}
                c={donePct === 100 ? W.done : W.acc} />
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:13, fontWeight:700 }}>{graded.length} / {total} task</div>
                <T size={11.5} style={{ marginTop:3 }}>Còn {total - graded.length} task để hoàn tất khoá</T>
              </div>
            </Card>

            <Card pad={16}>
              <T size={11} mono c={W.ink3} mb={12}>TIẾN ĐỘ THEO TUẦN</T>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {weeks.map(({ w, pct, done, total:wt }) => (
                  <div key={w}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:12, fontWeight:600 }}>Tuần {w}</span>
                      <span style={{ fontSize:11, color: W.ink3, fontFamily: W.mono }}>{done}/{wt}</span>
                    </div>
                    <Bar pct={pct} h={6} c={pct === 100 ? W.done : W.acc} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* submissions table */}
          <Card pad={0} style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>
            <div style={{ padding:'13px 16px', borderBottom:`1px solid ${W.line2}` }}>
              <H size={14}>Bài nộp gần đây</H>
            </div>
            <div style={{ display:'flex', padding:'9px 16px', fontSize:10.5, fontWeight:700,
              color: W.ink3, letterSpacing:0.3, background: W.panel, fontFamily: W.mono }}>
              <div style={{ width:40 }}>#</div>
              <div style={{ flex:1 }}>TASK</div>
              <div style={{ width:70 }}>NGÀY</div>
              <div style={{ width:70 }}>ĐIỂM</div>
              <div style={{ width:120 }}>TRẠNG THÁI</div>
            </div>
            {recent.length === 0 && (
              <div style={{ padding:'32px 16px', textAlign:'center', color: W.ink3, fontSize:13 }}>
                Chưa có bài nộp nào. <Link to="/emp/roadmap" style={{ color: W.acc }}>Xem lộ trình →</Link>
              </div>
            )}
            {recent.map((s, i) => {
              const task = TASKS.find(t => t.id === s.taskId)
              return (
                <div key={s.id} style={{ display:'flex', alignItems:'center', padding:'11px 16px',
                  borderTop:`1px solid ${W.line2}`, fontSize:13 }}>
                  <div style={{ width:40, fontWeight:700, color: W.ink3, fontFamily: W.mono }}>{s.taskId}</div>
                  <div style={{ flex:1, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                    paddingRight:8 }}>{task?.name}</div>
                  <div style={{ width:70, color: W.ink2, fontFamily: W.mono }}>{formatDate(s.submittedAt)}</div>
                  <div style={{ width:70, fontWeight:700,
                    color: s.grade != null ? W.done : W.ink4 }}>
                    {s.grade != null ? s.grade : '—'}
                  </div>
                  <div style={{ width:120 }}>
                    {s.status === 'graded'   && <Tag tone="done">Đã chấm</Tag>}
                    {s.status === 'pending'  && <Tag tone="warn">Chờ chấm</Tag>}
                    {s.status === 'revision' && <Tag tone="late">Cần sửa</Tag>}
                  </div>
                </div>
              )
            })}
          </Card>
        </div>
      </div>
    </Shell>
  )
}

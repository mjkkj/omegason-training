import { useParams, Link, useNavigate } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Bar, Ring, Ico, Avatar, Divider, Skel } from '../../design-system'
import { useStore } from '../../store'
import { TASKS, EMPLOYEES } from '../../data'

function GradePill({ st, grade }) {
  if (st === 'graded')   return <Tag tone="done">{grade} điểm</Tag>
  if (st === 'pending')  return <Tag tone="warn">Chờ chấm</Tag>
  if (st === 'revision') return <Tag tone="late">Cần sửa</Tag>
  return <Tag tone="neutral">Chưa nộp</Tag>
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`
}

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { submissions } = useStore()

  const emp = EMPLOYEES.find(e => e.id === id)
  if (!emp) return <div style={{ padding:32 }}>Không tìm thấy nhân viên.</div>

  const mySubs = submissions.filter(s => s.employeeId === id)
  const graded  = mySubs.filter(s => s.status === 'graded')
  const pending = mySubs.filter(s => s.status === 'pending')

  const pct = Math.round((graded.length / TASKS.length) * 100)
  const avgGrade = graded.length
    ? Math.round((graded.reduce((s, x) => s + (x.grade || 0), 0) / graded.length) * 10) / 10
    : null

  const onTime = graded.filter(s => {
    const task = TASKS.find(t => t.id === s.taskId)
    return task && new Date(s.submittedAt) <= new Date(task.deadline)
  }).length

  // Show all tasks with their submission status
  const taskRows = TASKS.map(task => {
    const sub = mySubs.find(s => s.taskId === task.id)
    return { task, sub, st: sub?.status || 'none' }
  })

  return (
    <Shell role="mgr" active={3} title="Hồ sơ nhân viên" sub={`${emp.name} · NV mới`}
      pad={0} body={W.paper}
      actions={
        <Btn kind="ghost" size="sm" onClick={() => navigate('/mgr/employees')}>← Danh sách</Btn>
      }>

      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        {/* header */}
        <div style={{ padding:'22px 28px 0', borderBottom:`1px solid ${W.line2}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <Avatar s={56} txt={emp.initials} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <H size={20}>{emp.name}</H>
                <Tag tone="acc">Đang đào tạo</Tag>
              </div>
              <T size={12.5}>Bắt đầu {formatDate(emp.startDate + 'T00:00:00')} · {emp.email}</T>
            </div>
            <div style={{ display:'flex', gap:24, textAlign:'center', flexShrink:0 }}>
              {[
                [`${pct}%`, 'Tiến độ'],
                [avgGrade ?? '—', 'Điểm TB'],
                [`${onTime}/${graded.length}`, 'Đúng hạn'],
                [pending.length, 'Chờ chấm'],
              ].map(([n, l], i) => (
                <div key={i}>
                  <div style={{ fontSize:20, fontWeight:800, color: W.ink, fontFamily: W.font }}>{n}</div>
                  <div style={{ fontSize:11, color: W.ink3, marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* tabs */}
          <div style={{ display:'flex', gap:26, marginTop:18 }}>
            {['Bài nộp & điểm'].map((t, i) => (
              <div key={i} style={{ paddingBottom:12, fontSize:13.5, fontWeight:700,
                color: W.acc, borderBottom:`2px solid ${W.acc}` }}>{t}</div>
            ))}
          </div>
        </div>

        {/* body */}
        <div style={{ flex:1, minHeight:0, overflowY:'auto', padding:'20px 28px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <H size={15}>Các bài đã nộp</H>
            <span style={{ fontSize:11.5, color: W.ink3, fontFamily: W.mono }}>
              {graded.length} đã chấm · {pending.length} chờ chấm
            </span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {taskRows.map(({ task, sub, st }, i) => (
              <Card key={task.id} pad={14} style={{ display:'flex', alignItems:'center', gap:14,
                opacity: st === 'none' ? 0.55 : 1 }}>
                <div style={{ width:36, height:36, borderRadius:9, flexShrink:0, background: W.panel,
                  border:`1px solid ${W.line2}`, display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:13, fontWeight:800, color: W.ink2, fontFamily: W.mono }}>{task.id}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                    {task.name}
                    {task.key && <Tag tone="warn" style={{ fontSize:10 }}>KEY</Tag>}
                    {task.final && <Tag tone="acc" style={{ fontSize:10 }}>FINAL</Tag>}
                  </div>
                  <div style={{ fontSize:10.5, color: W.ink4, marginTop:2, fontFamily: W.mono }}>
                    {sub ? `${sub.fileName} · ${sub.submittedAt ? 'nộp ' + formatDate(sub.submittedAt) : ''}` : 'chưa nộp'}
                  </div>
                </div>
                <GradePill st={st} grade={sub?.grade} />
                {sub?.status === 'pending' && (
                  <Link to={`/mgr/queue/${sub.id}`}>
                    <Btn kind="solid" size="sm">Chấm bài</Btn>
                  </Link>
                )}
                {sub?.status === 'graded' && (
                  <Btn kind="ghost" size="sm" onClick={() => {}}>Xem</Btn>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  )
}

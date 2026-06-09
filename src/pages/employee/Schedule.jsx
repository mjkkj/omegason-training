import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Dot, Ico } from '../../design-system'
import { useStore } from '../../store'
import { TASKS } from '../../data'

function daysLeftFromNow(deadline) {
  return Math.ceil((new Date(deadline) - new Date()) / 86400000)
}

function deadlineTone(deadline, sub) {
  if (sub?.status === 'graded') return 'done'
  if (sub?.status === 'pending') return 'warn'
  const d = daysLeftFromNow(deadline)
  if (d < 0) return 'late'
  if (d <= 2) return 'late'
  if (d <= 5) return 'acc'
  return 'neutral'
}

function daysLeftLabel(deadline, sub) {
  if (sub?.status === 'graded') return sub.grade != null ? `${sub.grade}đ` : 'Đã nộp'
  if (sub?.status === 'pending') return 'Chờ chấm'
  const d = daysLeftFromNow(deadline)
  if (d < 0) return `Trễ ${Math.abs(d)} ngày`
  if (d === 0) return 'Hôm nay'
  return `Còn ${d} ngày`
}

function formatDeadlineFull(dl) {
  const d = new Date(dl)
  const days = ['CN','T2','T3','T4','T5','T6','T7']
  const day = days[d.getDay()]
  return `${day}, ${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} · ${d.getHours()}:00`
}

function groupByWeek(tasks, submissions, empId) {
  const groups = []
  const now = new Date()

  // Current/upcoming weeks
  const upcoming = tasks.filter(t => !t.final && new Date(t.deadline) >= new Date(now.setHours(0,0,0,0)))
  const past      = tasks.filter(t => !t.final && new Date(t.deadline) < new Date())
  const finalTask = tasks.find(t => t.final)

  // Group upcoming by week
  const weekMap = {}
  upcoming.forEach(t => {
    const key = `Tuần ${t.week}`
    if (!weekMap[key]) weekMap[key] = []
    weekMap[key].push(t)
  })
  Object.entries(weekMap).forEach(([wk, ts]) => {
    groups.push({ label: wk, tasks: ts })
  })

  // Final
  if (finalTask && new Date(finalTask.deadline) >= new Date()) {
    groups.push({ label: 'Final project', tasks: [finalTask] })
  }

  // Completed
  const done = past.filter(t => submissions.find(s => s.employeeId === empId && s.taskId === t.id && s.status === 'graded'))
  if (done.length) groups.push({ label: 'Đã hoàn thành', tasks: done.reverse(), done: true })

  // Overdue
  const overdue = past.filter(t => {
    const sub = submissions.find(s => s.employeeId === empId && s.taskId === t.id)
    return !sub || sub.status === 'revision'
  })
  if (overdue.length) groups.push({ label: 'Trễ deadline', tasks: overdue, overdue: true })

  return groups
}

export default function Schedule() {
  const { currentUser, submissions } = useStore()
  const empId = currentUser?.id
  const now = new Date()
  const groups = groupByWeek(TASKS, submissions, empId)

  return (
    <Shell role="emp" active={2} title="Lịch nộp theo tuần" sub="Danh sách hạn nộp · gần nhất ở trên"
      body={W.panel}
      actions={
        <Link to="/emp/roadmap">
          <Btn kind="ghost" size="sm" icon={<Ico name="grid" s={14}/>}>Xem lộ trình</Btn>
        </Link>
      }>

      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        {/* legend */}
        <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
          {[['done','Đã nộp & chấm'],['warn','Chờ chấm'],['late','Trễ hạn'],['acc','Sắp hết hạn'],['neutral','Chưa đến hạn']].map(([t,l]) => (
            <div key={t} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <Dot tone={t} /><span style={{ fontSize:11.5, color: W.ink2 }}>{l}</span>
            </div>
          ))}
        </div>

        {groups.map((g, gi) => (
          <div key={gi}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <H size={13} c={g.done ? W.done : g.overdue ? W.late : W.ink2}>{g.label}</H>
              <div style={{ flex:1, height:1, background: W.line2 }} />
              <span style={{ fontSize:11, color: W.ink4, fontFamily: W.mono }}>{g.tasks.length} task</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {g.tasks.map(task => {
                const sub = submissions.find(s => s.employeeId === empId && s.taskId === task.id)
                const tone = deadlineTone(task.deadline, sub)
                const label = daysLeftLabel(task.deadline, sub)

                return (
                  <Card key={task.id} pad={13}
                    fill={sub?.status === 'graded' ? W.doneSoft : '#fff'}
                    line={sub?.status === 'graded' ? 'transparent' : tone === 'late' ? W.late + '55' : W.line}
                    style={{ display:'flex', alignItems:'center', gap:13 }}>
                    <div style={{ width:36, height:36, borderRadius:9, flexShrink:0, background: W.panel,
                      border:`1px solid ${W.line2}`, display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:12, fontWeight:800, color: W.ink2, fontFamily: W.mono }}>{task.id}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13.5, fontWeight:600, display:'flex', alignItems:'center', gap:7 }}>
                        {task.name}
                        {task.key && <Tag tone="warn" style={{ fontSize:10 }}>KEY</Tag>}
                        {task.final && <Tag tone="acc" style={{ fontSize:10 }}>FINAL</Tag>}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
                        <Ico name="clock" s={12} c={W.ink3} />
                        <T size={11.5} c={W.ink3}>{formatDeadlineFull(task.deadline)}</T>
                      </div>
                    </div>
                    <Tag tone={tone}>{label}</Tag>
                    {(tone === 'acc' || tone === 'late') && !sub && (
                      <Link to={`/emp/submit/${task.id}`}>
                        <Btn kind="soft" size="sm">Nộp</Btn>
                      </Link>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div style={{ textAlign:'center', padding:'48px 0', color: W.ink3 }}>
            Chưa có task nào trong lịch.
          </div>
        )}
      </div>
    </Shell>
  )
}

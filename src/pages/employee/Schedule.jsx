import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Dot, Ico, Skel } from '../../design-system'
import { useStore, fetchMySubmissions } from '../../store'
import { TASKS, WEEKS, calcDeadline } from '../../data'

function daysLeftLabel(deadline, sub) {
  if (sub?.status === 'graded')  return sub.grade != null ? `${sub.grade}đ` : 'Đã nộp'
  if (sub?.status === 'pending') return 'Chờ chấm'
  const d = Math.ceil((new Date(deadline) - new Date()) / 86400000)
  if (d < 0)  return `Trễ ${Math.abs(d)} ngày`
  if (d === 0) return 'Hôm nay'
  return `Còn ${d} ngày`
}

function deadlineTone(deadline, sub) {
  if (sub?.status === 'graded')  return 'done'
  if (sub?.status === 'pending') return 'warn'
  const d = Math.ceil((new Date(deadline) - new Date()) / 86400000)
  if (d < 0)  return 'late'
  if (d <= 2) return 'late'
  if (d <= 5) return 'acc'
  return 'neutral'
}

function fmtDeadline(dl) {
  const d = new Date(dl)
  const days = ['CN','T2','T3','T4','T5','T6','T7']
  return `${days[d.getDay()]}, ${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} · ${d.getHours()}:00`
}

export default function Schedule() {
  const { currentUser } = useStore()
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return
    fetchMySubmissions(currentUser.id).then(data => { setSubs(data); setLoading(false) })
  }, [currentUser?.id])

  const getSub = (tid) => subs.find(s => s.task_id === tid)
  const now    = new Date()
  const dl     = (t) => calcDeadline(t, currentUser?.start_date)

  const upcoming = TASKS.filter(t => new Date(dl(t)) >= now)
  const past     = TASKS.filter(t => new Date(dl(t)) < now)

  const groups = []
  const weekMap = {}
  upcoming.forEach(t => {
    const key = t.final ? 'Capstone' : (WEEKS[t.week - 1]?.wk || `Giai đoạn ${t.week}`)
    if (!weekMap[key]) weekMap[key] = []
    weekMap[key].push(t)
  })
  Object.entries(weekMap).forEach(([label, tasks]) => groups.push({ label, tasks }))

  const completed = past.filter(t => getSub(t.id)?.status === 'graded')
  const overdue   = past.filter(t => { const s = getSub(t.id); return !s || s.status === 'revision' })
  if (completed.length) groups.push({ label:'Đã hoàn thành', tasks: completed, done:true })
  if (overdue.length)   groups.push({ label:'Trễ deadline',  tasks: overdue,   overdue:true })

  return (
    <Shell role="emp" title="Lịch nộp theo module" sub="Hạn nộp từng module · gần nhất ở trên"
      actions={<Link to="/emp/roadmap"><Btn kind="ghost" size="sm" icon={<Ico name="grid" s={14}/>}>Lộ trình</Btn></Link>}>

      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          {[['done','Đã chấm'],['warn','Chờ chấm'],['late','Trễ hạn'],['acc','Sắp hết'],['neutral','Còn nhiều']].map(([t,l]) => (
            <div key={t} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <Dot tone={t} /><span style={{ fontSize:11.5, color: W.ink2 }}>{l}</span>
            </div>
          ))}
        </div>

        {loading && <Skel lines={8} gap={16} />}

        {!loading && groups.map((g, gi) => (
          <div key={gi}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <H size={13} c={g.done ? W.done : g.overdue ? W.late : W.ink2}>{g.label}</H>
              <div style={{ flex:1, height:1, background: W.line2 }} />
              <span style={{ fontSize:11, color: W.ink4, fontFamily: W.mono }}>{g.tasks.length} task</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {g.tasks.map(task => {
                const sub  = getSub(task.id)
                const tone = deadlineTone(dl(task), sub)
                const label = daysLeftLabel(dl(task), sub)
                return (
                  <Card key={task.id} pad={13}
                    fill={sub?.status === 'graded' ? W.doneSoft : '#fff'}
                    line={tone === 'late' ? W.late+'55' : W.line}
                    style={{ display:'flex', alignItems:'center', gap:13 }}>
                    <div style={{ width:36, height:36, borderRadius:9, flexShrink:0, background: W.panel,
                      border:`1px solid ${W.line2}`, display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:12, fontWeight:800, color: W.ink2, fontFamily: W.mono }}>{task.id}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13.5, fontWeight:600, display:'flex', alignItems:'center', gap:7 }}>
                        {task.name}
                        {task.key   && <Tag tone="warn" style={{ fontSize:10 }}>KEY</Tag>}
                        {task.final && <Tag tone="acc"  style={{ fontSize:10 }}>CAPSTONE</Tag>}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
                        <Ico name="clock" s={12} c={W.ink3} />
                        <T size={11.5} c={W.ink3}>{fmtDeadline(dl(task))}</T>
                      </div>
                    </div>
                    <Tag tone={tone}>{label}</Tag>
                    {(tone==='acc'||tone==='late') && !sub && (
                      <Link to={`/emp/submit/${task.id}`}><Btn kind="soft" size="sm">Nộp</Btn></Link>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  )
}

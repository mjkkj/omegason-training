import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Dot, Bar, Ico, Skel } from '../../design-system'
import { useStore, fetchMySubmissions } from '../../store'
import { TASKS, WEEKS, calcDeadline } from '../../data'

function taskStatus(sub, task, startDate) {
  if (!sub) return new Date() > new Date(calcDeadline(task, startDate)) ? 'late' : 'todo'
  if (sub.status === 'graded') return 'done'
  if (sub.status === 'pending') return 'review'
  return 'todo'
}

function TaskPill({ task, st, to }) {
  const isLate = st === 'late'
  return (
    <Link to={to} style={{ textDecoration:'none', display:'block' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
        border:`1px solid ${st === 'review' ? W.accLine : isLate ? W.late+'55' : W.line2}`,
        borderRadius:9, background: st === 'review' ? W.accSoft : isLate ? W.lateSoft : '#fff',
        cursor:'pointer', transition:'box-shadow .15s' }}>
        <span style={{ fontSize:12, fontWeight:700, fontFamily: W.mono, minWidth:22,
          color: st === 'review' ? W.acc : st === 'done' ? W.done : W.ink3 }}>{task.id}</span>
        <div style={{ minWidth:0, flex:1 }}>
          <div style={{ fontSize:12.5, fontWeight:600, color: st === 'todo' || st === 'late' ? W.ink3 : W.ink,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{task.name}</div>
          <div style={{ fontSize:9.5, color: W.ink4, marginTop:2, fontFamily: W.mono,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{task.file}</div>
        </div>
        {task.key   && <Tag tone="warn">KEY</Tag>}
        {task.final && <Tag tone="acc">FINAL</Tag>}
        {st === 'done'   && <Dot tone="done" />}
        {st === 'review' && <Dot tone="warn" />}
        {st === 'late'   && <Dot tone="late" />}
        {st === 'todo'   && <Dot tone="empty" />}
      </div>
    </Link>
  )
}

export default function Roadmap() {
  const { currentUser } = useStore()
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return
    fetchMySubmissions(currentUser.id).then(data => { setSubs(data); setLoading(false) })
  }, [currentUser?.id])

  const getSub = (tid) => subs.find(s => s.task_id === tid)
  const doneCount = TASKS.filter(t => getSub(t.id)?.status === 'graded').length
  const overallPct = Math.round((doneCount / TASKS.length) * 100)

  return (
    <Shell role="emp" title="Lộ trình 4 tuần · 10 task" sub="Mỗi tuần một output thật — kết thúc bằng final project"
      actions={
        <>
          <Tag tone="acc">Tiến độ {overallPct}%</Tag>
          <Link to="/emp/schedule"><Btn kind="ghost" size="sm" icon={<Ico name="cal" s={14}/>}>Lịch nộp</Btn></Link>
        </>
      }>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Card pad={14} style={{ display:'flex', alignItems:'center', gap:18 }}>
          <div style={{ fontSize:13, fontWeight:700, whiteSpace:'nowrap' }}>Tổng tiến độ</div>
          <Bar pct={overallPct} h={10} style={{ flex:1 }} />
          <div style={{ fontSize:12, color: W.ink2, fontFamily: W.mono, whiteSpace:'nowrap' }}>{doneCount} / {TASKS.length} task</div>
        </Card>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
            {[1,2,3,4].map(i => <Skel key={i} lines={4} style={{ height:200 }} />)}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
            {WEEKS.map((w, i) => {
              const wkDone = w.taskIds.filter(id => getSub(id)?.status === 'graded').length
              const wkPct  = Math.round((wkDone / w.taskIds.length) * 100)
              return (
                <div key={i} style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700 }}>{w.wk}</div>
                      <div style={{ fontSize:10.5, color: W.ink3, marginTop:1 }}>{w.theme}</div>
                    </div>
                    <span style={{ fontSize:10, color: W.ink4, fontFamily: W.mono }}>{wkPct}%</span>
                  </div>
                  <Bar pct={wkPct} h={5} c={wkPct === 100 ? W.done : W.acc} />
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {w.taskIds.map(tid => {
                      const task = TASKS.find(t => t.id === tid)
                      const st   = taskStatus(getSub(tid), task, currentUser?.start_date)
                      return <TaskPill key={tid} task={task} st={st} to={`/emp/task/${tid}`} />
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Final */}
        {(() => {
          const ft = TASKS.find(t => t.final)
          const st = taskStatus(getSub('F'), ft, currentUser?.start_date)
          return (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <H size={13} c={W.ink2}>Final Project</H>
                <div style={{ flex:1, height:1, background: W.line2 }} />
              </div>
              <TaskPill task={ft} st={st} to="/emp/task/F" />
            </div>
          )
        })()}
      </div>
    </Shell>
  )
}

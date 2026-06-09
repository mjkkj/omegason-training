import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Dot, Bar, Ico } from '../../design-system'
import { useStore } from '../../store'
import { TASKS, WEEKS } from '../../data'

function taskStatus(sub, task, now) {
  if (!sub) {
    const deadline = new Date(task.deadline)
    if (now > deadline) return 'late'
    return 'todo'
  }
  if (sub.status === 'graded') return 'done'
  if (sub.status === 'pending') return 'review'
  if (sub.status === 'revision') return 'todo'
  return 'todo'
}

function getWeekPct(weekTaskIds, submissions, empId, now) {
  const done = weekTaskIds.filter(id => {
    const t = TASKS.find(t => t.id === id)
    const sub = submissions.find(s => s.employeeId === empId && s.taskId === id)
    return taskStatus(sub, t, now) === 'done'
  }).length
  return Math.round((done / weekTaskIds.length) * 100)
}

const statTone = { done:'done', review:'warn', todo:'neutral', late:'late' }
const statTxt  = { done:'Đã nộp', review:'Chờ chấm', todo:'Chưa làm', late:'Trễ hạn' }

function TaskPill({ task, st, to }) {
  const locked = st === 'todo' || st === 'late'
  const isLate  = st === 'late'
  return (
    <Link to={to} style={{ textDecoration:'none', display:'block' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
        border:`1px solid ${st === 'review' ? W.accLine : isLate ? W.late + '55' : W.line2}`,
        borderRadius:9, background: st === 'review' ? W.accSoft : isLate ? W.lateSoft : '#fff',
        cursor:'pointer', transition:'box-shadow .15s' }}>
        <span style={{ fontSize:12, fontWeight:700, fontFamily: W.mono,
          color: st === 'review' ? W.acc : st === 'done' ? W.done : W.ink3, minWidth:22 }}>{task.id}</span>
        <div style={{ minWidth:0, flex:1 }}>
          <div style={{ fontSize:12.5, fontWeight:600, color: locked ? W.ink3 : W.ink,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{task.name}</div>
          <div style={{ fontSize:9.5, color: W.ink4, marginTop:2, fontFamily: W.mono,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{task.file}</div>
        </div>
        {task.key && <Tag tone="warn">KEY</Tag>}
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
  const { currentUser, submissions } = useStore()
  const empId = currentUser?.id
  const now = new Date()

  const allTasks = TASKS.filter(t => !t.final)
  const total = allTasks.length + 1
  const doneCount = TASKS.filter(t => {
    const sub = submissions.find(s => s.employeeId === empId && s.taskId === t.id)
    return taskStatus(sub, t, now) === 'done'
  }).length
  const overallPct = Math.round((doneCount / total) * 100)

  return (
    <Shell role="emp" active={1} title="Lộ trình 4 tuần · 10 task" sub="Mỗi tuần một output thật — kết thúc bằng final project"
      actions={
        <>
          <Tag tone="acc">Tiến độ {overallPct}%</Tag>
          <Link to="/emp/schedule"><Btn kind="ghost" size="sm" icon={<Ico name="cal" s={14}/>}>Lịch nộp</Btn></Link>
        </>
      }>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {/* overall bar */}
        <Card pad={14} style={{ display:'flex', alignItems:'center', gap:18 }}>
          <div style={{ fontSize:13, fontWeight:700, whiteSpace:'nowrap' }}>Tổng tiến độ</div>
          <Bar pct={overallPct} h={10} style={{ flex:1 }} />
          <div style={{ fontSize:12, color: W.ink2, fontFamily: W.mono, whiteSpace:'nowrap' }}>{doneCount} / {total} task</div>
        </Card>

        {/* 4 week columns */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          {WEEKS.map((w, i) => {
            const wkPct = getWeekPct(w.taskIds, submissions, empId, now)
            return (
              <div key={i} style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{w.wk}</div>
                    <div style={{ fontSize:10.5, color: W.ink3, marginTop:1, lineHeight:1.3 }}>{w.theme}</div>
                  </div>
                  <span style={{ fontSize:10, color: W.ink4, fontFamily: W.mono }}>{wkPct}%</span>
                </div>
                <Bar pct={wkPct} h={5} c={wkPct === 100 ? W.done : W.acc} />
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {w.taskIds.map(tid => {
                    const task = TASKS.find(t => t.id === tid)
                    const sub  = submissions.find(s => s.employeeId === empId && s.taskId === tid)
                    const st   = taskStatus(sub, task, now)
                    return <TaskPill key={tid} task={task} st={st} to={`/emp/task/${tid}`} />
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Final task */}
        {(() => {
          const finalTask = TASKS.find(t => t.final)
          const sub = submissions.find(s => s.employeeId === empId && s.taskId === 'F')
          const st  = taskStatus(sub, finalTask, now)
          return (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <H size={13} c={W.ink2}>Final Project</H>
                <div style={{ flex:1, height:1, background: W.line2 }} />
              </div>
              <TaskPill task={finalTask} st={st} to="/emp/task/F" />
            </div>
          )
        })()}
      </div>
    </Shell>
  )
}

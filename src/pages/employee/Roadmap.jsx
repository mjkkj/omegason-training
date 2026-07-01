import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Dot, Bar, Ico, Skel } from '../../design-system'
import { useStore, fetchMySubmissions } from '../../store'
import { TASKS, calcDeadline } from '../../data'
import { SCORE_PHASES, phaseScore, overallScore, indexByTask } from '../../checklist'
import { useT } from '../../i18n'

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
        {task.final && <Tag tone="acc">CAPSTONE</Tag>}
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
  const t = useT()
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return
    fetchMySubmissions(currentUser.id).then(data => { setSubs(data); setLoading(false) })
  }, [currentUser?.id])

  const getSub = (tid) => subs.find(s => s.task_id === tid)
  const subByTask = indexByTask(subs)
  const doneCount = TASKS.filter(t => getSub(t.id)?.status === 'graded').length
  const overallPct = overallScore(subByTask)

  return (
    <Shell role="emp" title={t('Lộ trình 3 phase · 8 module + Capstone')} sub={t('Một sản phẩm, kéo tới cùng — mỗi module một output thật')}
      actions={
        <>
          <Tag tone="acc">{t('Tiến độ')} {overallPct}%</Tag>
          <Link to="/emp/schedule"><Btn kind="ghost" size="sm" icon={<Ico name="cal" s={14}/>}>{t('Lịch nộp')}</Btn></Link>
        </>
      }>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Card pad={14} style={{ display:'flex', alignItems:'center', gap:18 }}>
          <div style={{ fontSize:13, fontWeight:700, whiteSpace:'nowrap' }}>{t('Tổng tiến độ')}</div>
          <Bar pct={overallPct} h={10} style={{ flex:1 }} />
          <div style={{ fontSize:12, color: W.ink2, fontFamily: W.mono, whiteSpace:'nowrap' }}>{doneCount} / {TASKS.length} {t('task')}</div>
        </Card>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            {[1,2,3].map(i => <Skel key={i} lines={4} style={{ height:200 }} />)}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, alignItems:'start' }}>
            {SCORE_PHASES.map((p, i) => {
              const phPct = phaseScore(subByTask, p.taskIds)
              return (
                <div key={p.key} style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700 }}>Phase {i+1}</div>
                      <div style={{ fontSize:10.5, color: W.ink3, marginTop:1 }}>{p.name}</div>
                    </div>
                    <span style={{ fontSize:10, color: W.ink4, fontFamily: W.mono }}>{phPct}%</span>
                  </div>
                  <Bar pct={phPct} h={5} c={phPct === 100 ? W.done : W.acc} />
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {p.taskIds.map(tid => {
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
      </div>
    </Shell>
  )
}

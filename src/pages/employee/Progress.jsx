import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Bar, Ring, Stat, Ico, Skel } from '../../design-system'
import { useStore, fetchMySubmissions } from '../../store'
import { TASKS, WEEKS, calcDeadline } from '../../data'

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`
}

export default function Progress() {
  const { currentUser } = useStore()
  const [subs, setSubs]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return
    fetchMySubmissions(currentUser.id).then(data => { setSubs(data); setLoading(false) })
  }, [currentUser?.id])

  const graded  = subs.filter(s => s.status === 'graded')
  const pending = subs.filter(s => s.status === 'pending')
  const total   = TASKS.length
  const donePct = Math.round((graded.length / total) * 100)
  const avgGrade = graded.length
    ? Math.round((graded.reduce((s,x) => s + (x.grade||0), 0) / graded.length) * 10) / 10
    : null
  const onTime  = graded.filter(s => {
    const task = TASKS.find(t => t.id === s.task_id)
    return task && new Date(s.submitted_at) <= new Date(calcDeadline(task, currentUser?.start_date))
  }).length

  const weeks = WEEKS.map((wk, i) => {
    const w  = i + 1
    const wt = TASKS.filter(t => t.week === w)
    const wd = wt.filter(t => graded.find(s => s.task_id === t.id)).length
    return { w, label: wk.wk, pct: wt.length ? Math.round((wd/wt.length)*100) : 0, done: wd, total: wt.length }
  })

  return (
    <Shell role="emp" title="Tổng quan tiến độ" sub={currentUser?.name}
      actions={<Link to="/emp/schedule"><Btn kind="ghost" size="sm" icon={<Ico name="cal" s={14}/>}>Xem lịch</Btn></Link>}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div style={{ display:'flex', gap:12 }}>
          <Stat n={graded.length}  label="Đã nộp & chấm"     sub={`trên ${total} task`} />
          <Stat n={pending.length} label="Đang chờ chấm"     tone={pending.length ? W.warn : W.ink} />
          <Stat n={avgGrade ?? '—'} label="Điểm trung bình"  tone={W.done} sub="thang 10" />
          <Stat n={onTime}          label="Đúng hạn"          tone={W.acc} />
        </div>

        <div style={{ display:'flex', gap:14 }}>
          <div style={{ width:230, flexShrink:0, display:'flex', flexDirection:'column', gap:14 }}>
            <Card pad={18} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
              <Ring pct={donePct} label={`${donePct}%`} sub="hoàn thành" size={128} stroke={12}
                c={donePct===100 ? W.done : W.acc} />
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:13, fontWeight:700 }}>{graded.length} / {total} task</div>
                <T size={11.5} style={{ marginTop:3 }}>Còn {total - graded.length} task</T>
              </div>
            </Card>
            <Card pad={16}>
              <T size={11} mono c={W.ink3} mb={12}>TIẾN ĐỘ THEO GIAI ĐOẠN</T>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {weeks.map(({w,label,pct,done,total:wt}) => (
                  <div key={w}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:12, fontWeight:600 }}>{label}</span>
                      <span style={{ fontSize:11, color: W.ink3, fontFamily: W.mono }}>{done}/{wt}</span>
                    </div>
                    <Bar pct={pct} h={6} c={pct===100 ? W.done : W.acc} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card pad={0} style={{ flex:1, minWidth:0, overflow:'hidden' }}>
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
            {loading && <div style={{ padding:20 }}><Skel lines={5} /></div>}
            {!loading && subs.length === 0 && (
              <div style={{ padding:'32px 16px', textAlign:'center', color: W.ink3, fontSize:13 }}>
                Chưa có bài nộp. <Link to="/emp/roadmap" style={{ color: W.acc }}>Xem lộ trình →</Link>
              </div>
            )}
            {subs.map(s => {
              const task = TASKS.find(t => t.id === s.task_id)
              return (
                <div key={s.id} style={{ display:'flex', alignItems:'center', padding:'11px 16px',
                  borderTop:`1px solid ${W.line2}`, fontSize:13 }}>
                  <div style={{ width:40, fontWeight:700, color: W.ink3, fontFamily: W.mono }}>{s.task_id}</div>
                  <div style={{ flex:1, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis',
                    whiteSpace:'nowrap', paddingRight:8 }}>{task?.name}</div>
                  <div style={{ width:70, color: W.ink2, fontFamily: W.mono }}>{formatDate(s.submitted_at)}</div>
                  <div style={{ width:70, fontWeight:700, color: s.grade!=null ? W.done : W.ink4 }}>
                    {s.grade ?? '—'}
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

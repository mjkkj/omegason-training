import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Ico, Skel } from '../../design-system'
import { useStore, fetchMySubmissions } from '../../store'
import { TASKS } from '../../data'
import { moduleScore } from '../../checklist'

function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`
}

export default function Submissions() {
  const { currentUser } = useStore()
  const [subs, setSubs]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return
    fetchMySubmissions(currentUser.id)
      .then(data => { setSubs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [currentUser?.id])

  return (
    <Shell role="emp" title="Bài nộp của tôi" sub="Tất cả bài đã nộp — bấm để xem hoặc nộp lại"
      actions={<Link to="/emp/roadmap"><Btn kind="ghost" size="sm" icon={<Ico name="grid" s={14}/>}>Lộ trình</Btn></Link>}>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {loading && <Skel lines={5} gap={12} h={56} />}

        {!loading && subs.length === 0 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:10, color: W.ink3, padding:'60px 0' }}>
            <Ico name="doc" s={32} c={W.ink4} />
            <T size={13}>Chưa có bài nộp nào. <Link to="/emp/roadmap" style={{ color: W.acc }}>Xem lộ trình →</Link></T>
          </div>
        )}

        {!loading && subs.map(s => {
          const task = TASKS.find(t => t.id === s.task_id)
          return (
            <Card key={s.id} pad={13} style={{ display:'flex', alignItems:'center', gap:13 }}>
              <div style={{ width:36, height:36, borderRadius:9, flexShrink:0, background: W.panel,
                border:`1px solid ${W.line2}`, display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:800, color: W.ink2, fontFamily: W.mono }}>{s.task_id}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13.5, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis',
                  whiteSpace:'nowrap' }}>{task?.name || s.task_id}</div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
                  <Ico name="clock" s={12} c={W.ink3} />
                  <T size={11.5} c={W.ink3}>Nộp ngày {fmtDate(s.submitted_at)}</T>
                </div>
              </div>
              {s.status === 'graded'
                ? <Tag tone="done">{moduleScore(s, s.task_id)}%</Tag>
                : <Tag tone="warn">Chờ chấm</Tag>}
              <Link to={`/emp/task/${s.task_id}`}><Btn kind="ghost" size="sm">Xem</Btn></Link>
              <Link to={`/emp/submit/${s.task_id}`}><Btn kind="soft" size="sm">Nộp lại</Btn></Link>
            </Card>
          )
        })}
      </div>
    </Shell>
  )
}

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Bar, Ico, Avatar, Skel } from '../../design-system'
import { fetchAllSubmissions, fetchAllProfiles } from '../../store'
import { TASKS, calcDeadline } from '../../data'
import { moduleScore, indexByTask, overallScore } from '../../checklist'
import PhaseBar from '../../components/PhaseBar'
import { supabase } from '../../supabase'
import { useT } from '../../i18n'

function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`
}

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const t = useT()
  const [emp, setEmp]       = useState(null)
  const [subs, setSubs]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*').eq('id', id).single(),
      fetchAllSubmissions(),
    ]).then(([{ data: profile }, allSubs]) => {
      setEmp(profile)
      setSubs(allSubs.filter(s => s.employee_id === id))
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <Shell role="mgr" title={t('Hồ sơ nhân viên')} body={W.paper} pad={24}>
      <Skel lines={6} gap={16} />
    </Shell>
  )
  if (!emp) return <div style={{ padding:32 }}>{t('Không tìm thấy nhân viên.')}</div>

  const graded  = subs.filter(s => s.status === 'graded')
  const pending = subs.filter(s => s.status === 'pending')
  const pct     = Math.round((graded.length / TASKS.length) * 100)
  const subByTask = indexByTask(subs)
  const score   = overallScore(subByTask)
  const onTime = graded.filter(s => {
    const task = TASKS.find(t => t.id === s.task_id)
    return task && new Date(s.submitted_at) <= new Date(calcDeadline(task, emp?.start_date))
  }).length

  const taskRows = TASKS.map(task => {
    const sub = subs.find(s => s.task_id === task.id)
    return { task, sub }
  })

  return (
    <Shell role="mgr" title={t('Hồ sơ nhân viên')} sub={`${emp.name}`}
      pad={0} body={W.paper}
      actions={<Btn kind="ghost" size="sm" onClick={() => navigate('/mgr/employees')}>{t('← Danh sách')}</Btn>}>

      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'22px 28px 0', borderBottom:`1px solid ${W.line2}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <Avatar s={56} txt={emp.initials} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <H size={20}>{emp.name}</H>
                <Tag tone="acc">{t('Đang đào tạo')}</Tag>
              </div>
              <T size={12.5}>{emp.email}</T>
            </div>
            <div style={{ display:'flex', gap:24, textAlign:'center' }}>
              {[[`${pct}%`,'Tiến độ'],[`${score}%`,'Checklist'],[`${onTime}/${graded.length}`,'Đúng hạn'],[pending.length,'Chờ chấm']].map(([n,l],i) => (
                <div key={i}>
                  <div style={{ fontSize:20, fontWeight:800, color: W.ink }}>{n}</div>
                  <div style={{ fontSize:11, color: W.ink3, marginTop:2 }}>{t(l)}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop:18 }}>
            <div style={{ paddingBottom:12, fontSize:13.5, fontWeight:700, color: W.acc, borderBottom:`2px solid ${W.acc}`, display:'inline-block' }}>
              {t('Bài nộp & kết quả')}
            </div>
          </div>
        </div>

        <div style={{ flex:1, minHeight:0, overflowY:'auto', padding:'20px 28px' }}>
          <div style={{ marginBottom:16 }}>
            <PhaseBar subByTaskId={subByTask} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
            <H size={15}>{t('Các bài đã nộp')}</H>
            <span style={{ fontSize:11.5, color: W.ink3, fontFamily: W.mono }}>
              {graded.length}{t(' đã chấm · ')}{pending.length}{t(' chờ chấm')}
            </span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {taskRows.map(({ task, sub }) => (
              <Card key={task.id} pad={14} style={{ display:'flex', alignItems:'center', gap:14,
                opacity: !sub ? 0.5 : 1 }}>
                <div style={{ width:36, height:36, borderRadius:9, flexShrink:0, background: W.panel,
                  border:`1px solid ${W.line2}`, display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:13, fontWeight:800, color: W.ink2, fontFamily: W.mono }}>{task.id}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                    {task.name}
                    {task.key   && <Tag tone="warn" style={{ fontSize:10 }}>KEY</Tag>}
                    {task.final && <Tag tone="acc"  style={{ fontSize:10 }}>CAPSTONE</Tag>}
                  </div>
                  <div style={{ fontSize:10.5, color: W.ink4, marginTop:2, fontFamily: W.mono }}>
                    {sub ? `${sub.file_name} · ${t('nộp')} ${fmtDate(sub.submitted_at)}` : t('chưa nộp')}
                  </div>
                </div>
                {sub?.status==='graded'   && <Tag tone="done">{moduleScore(sub, task.id)}%</Tag>}
                {sub?.status==='pending'  && <Tag tone="warn">{t('Chờ chấm')}</Tag>}
                {!sub && <Tag tone="neutral">{t('Chưa nộp')}</Tag>}
                {sub?.status==='pending' && (
                  <Link to={`/mgr/queue/${sub.id}`}><Btn kind="solid" size="sm">{t('Chấm bài')}</Btn></Link>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  )
}

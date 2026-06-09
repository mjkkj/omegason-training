import { useParams, Link, useNavigate } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Dot, Divider, Ico, Ph, Skel } from '../../design-system'
import { useStore } from '../../store'
import { TASKS, TASK_CONTENT } from '../../data'

function daysLeft(deadline) {
  const d = Math.ceil((new Date(deadline) - new Date()) / 86400000)
  if (d < 0) return { txt: `Trễ ${Math.abs(d)} ngày`, tone:'late' }
  if (d === 0) return { txt: 'Hôm nay', tone:'late' }
  if (d <= 2)  return { txt: `Còn ${d} ngày`, tone:'late' }
  return { txt: `Còn ${d} ngày`, tone:'acc' }
}

function formatDeadline(dl) {
  const d = new Date(dl)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} · ${d.getHours().toString().padStart(2,'0')}:00`
}

function statusInfo(sub, task) {
  if (!sub) {
    const now = new Date()
    if (now > new Date(task.deadline)) return { txt:'Trễ hạn', tone:'late' }
    return { txt:'Chưa làm', tone:'neutral' }
  }
  if (sub.status === 'graded') return { txt:'Đã chấm', tone:'done' }
  if (sub.status === 'pending') return { txt:'Chờ chấm', tone:'warn' }
  if (sub.status === 'revision') return { txt:'Cần sửa lại', tone:'late' }
  return { txt:'Chưa làm', tone:'neutral' }
}

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, submissions } = useStore()
  const task = TASKS.find(t => t.id === id)
  const content = TASK_CONTENT[id] || {}
  const sub = submissions.find(s => s.employeeId === currentUser?.id && s.taskId === id)

  if (!task) return <div style={{ padding:32 }}>Không tìm thấy task.</div>

  const dl = daysLeft(task.deadline)
  const st = statusInfo(sub, task)
  const taskWeek = task.final ? 'Final' : `Tuần ${task.week}`

  return (
    <Shell role="emp" active={1} title={`Task ${task.id} · ${task.name}`} sub={`${taskWeek} · ${task.final ? 'Final project' : `Tuần ${task.week}`}`}
      pad={0} body={W.paper}
      actions={<Btn kind="ghost" size="sm" onClick={() => navigate('/emp/roadmap')}>← Lộ trình</Btn>}>

      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        {/* hero header */}
        <div style={{ padding:'22px 28px', borderBottom:`1px solid ${W.line2}`, background: W.panel,
          display:'flex', alignItems:'center', gap:18 }}>
          <div style={{ width:56, height:56, borderRadius:12, background: W.ink, color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:800,
            fontFamily: W.mono }}>{id}</div>
          <div style={{ flex:1 }}>
            <H size={20} mb={6}>{task.name}</H>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <Tag tone={st.tone}>{st.txt}</Tag>
              <Tag tone="line">{taskWeek}</Tag>
              <Tag tone="line">~{task.hours} giờ</Tag>
            </div>
          </div>
          <Card pad={14} fill={dl.tone === 'late' ? W.lateSoft : W.accSoft} line="transparent"
            style={{ textAlign:'center', minWidth:130, flexShrink:0 }}>
            <T size={10.5} mono c={dl.tone === 'late' ? W.late : W.acc} mb={4}>HẠN NỘP</T>
            <div style={{ fontSize:22, fontWeight:800, color: dl.tone === 'late' ? W.late : W.ink, lineHeight:1 }}>{dl.txt}</div>
            <T size={10.5} c={W.ink2} style={{ marginTop:3 }}>{formatDeadline(task.deadline)}</T>
          </Card>
        </div>

        {/* body */}
        <div style={{ flex:1, minHeight:0, overflowY:'auto', padding:'20px 28px',
          display:'flex', flexDirection:'column', gap:20 }}>

          {/* need to learn */}
          <div>
            <H size={14} mb={10} c={W.ink2}>CẦN HỌC</H>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {(content.learn || []).map((l, i) => (
                <Tag key={i} tone="line">{l}</Tag>
              ))}
            </div>
          </div>

          {/* videos */}
          {content.videos && (
            <div>
              <H size={14} mb={10} c={W.ink2}>VIDEO GỢI Ý</H>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
                {content.videos.map((v, i) => (
                  <div key={i}>
                    <Ph label="video" h={100} />
                    <div style={{ fontSize:12.5, fontWeight:600, marginTop:7 }}>{v}</div>
                    <Skel lines={1} w={['70%']} style={{ marginTop:5 }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* required output */}
          <div>
            <H size={14} mb={10} c={W.ink2}>ĐẦU RA CẦN NỘP</H>
            <Card pad={14} style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Ico name="doc" s={20} c={W.acc} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13.5, fontWeight:700, fontFamily: W.mono }}>{task.file}</div>
                <T size={12} style={{ marginTop:4 }}>{content.description}</T>
              </div>
            </Card>
          </div>

          {/* previous submission */}
          {sub && (
            <div>
              <H size={14} mb={10} c={W.ink2}>BÀI ĐÃ NỘP</H>
              <Card pad={14} fill={sub.status === 'graded' ? W.doneSoft : sub.status === 'pending' ? W.accSoft : W.warnSoft}
                line="transparent">
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <Ico name="doc" s={18} c={sub.status === 'graded' ? W.done : W.acc} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, fontFamily: W.mono }}>{sub.fileName}</div>
                    <T size={11.5} style={{ marginTop:2 }}>
                      Nộp lúc {new Date(sub.submittedAt).toLocaleString('vi-VN')}
                      {sub.status === 'graded' && sub.grade != null && ` · ${sub.grade} điểm`}
                    </T>
                  </div>
                  {sub.status === 'graded' && sub.grade != null && (
                    <div style={{ fontSize:22, fontWeight:800, color: W.done }}>{sub.grade}</div>
                  )}
                </div>
                {sub.feedback && (
                  <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid rgba(0,0,0,.08)` }}>
                    <T size={11} mono c={W.ink3} mb={4}>NHẬN XÉT</T>
                    <T size={12.5}>{sub.feedback}</T>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>

        {/* sticky footer bar */}
        <div style={{ flexShrink:0, borderTop:`1px solid ${W.line2}`, background: W.paper,
          padding:'14px 28px', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ flex:1 }} />
          {sub?.status === 'graded'
            ? <Tag tone="done">Đã chấm · {sub.grade} điểm</Tag>
            : sub?.status === 'pending'
            ? <Tag tone="warn">Đang chờ chấm</Tag>
            : null}
          <Link to={`/emp/submit/${id}`}>
            <Btn kind="solid" size="md" icon={<Ico name="up" s={15} c="#fff"/>}>
              {sub ? 'Nộp lại báo cáo' : 'Nộp báo cáo HTML'}
            </Btn>
          </Link>
        </div>
      </div>
    </Shell>
  )
}

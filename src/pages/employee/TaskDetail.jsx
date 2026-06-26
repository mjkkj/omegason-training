import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Ico, Ph, Skel } from '../../design-system'
import { useStore, fetchMySubmissions, fetchTaskVideos } from '../../store'
import SubmissionView from '../../components/SubmissionView'
import { TASKS, TASK_CONTENT, calcDeadline, moduleLabel } from '../../data'
import { getChecklist, parseReview, moduleScore } from '../../checklist'

function getYtId(url) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

function daysLeft(deadline) {
  const d = Math.ceil((new Date(deadline) - new Date()) / 86400000)
  if (d < 0)  return { txt:`Trễ ${Math.abs(d)} ngày`, tone:'late' }
  if (d === 0) return { txt:'Hôm nay', tone:'late' }
  return { txt:`Còn ${d} ngày`, tone: d <= 2 ? 'late' : 'acc' }
}

function formatDeadline(dl) {
  const d = new Date(dl)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} · ${d.getHours()}:00`
}

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useStore()
  const [sub, setSub]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [taskVideos, setTaskVideos] = useState(null)

  const task    = TASKS.find(t => t.id === id)
  const content = TASK_CONTENT[id] || {}

  useEffect(() => {
    if (!currentUser || !task) return
    Promise.all([
      fetchMySubmissions(currentUser.id),
      fetchTaskVideos(id),
    ]).then(([subs, vids]) => {
      setSub(subs.find(s => s.task_id === id) || null)
      setTaskVideos(vids)
      setLoading(false)
    })
  }, [currentUser?.id, id])

  if (!task) return <div style={{ padding:32 }}>Không tìm thấy task.</div>

  const dl  = daysLeft(calcDeadline(task, currentUser?.start_date))
  const stTone = sub?.status === 'graded' ? 'done' : sub?.status === 'pending' ? 'warn' : sub?.status === 'revision' ? 'late' : dl.tone === 'late' ? 'late' : 'neutral'
  const stTxt  = sub?.status === 'graded' ? 'Đã chấm' : sub?.status === 'pending' ? 'Chờ chấm' : sub?.status === 'revision' ? 'Cần sửa lại' : dl.tone === 'late' ? 'Trễ hạn' : 'Chưa làm'

  // Video gợi ý: ưu tiên link quản lý thêm trên Supabase; nếu chưa có thì
  // dùng bộ video mặc định đã tuyển chọn sẵn trong TASK_CONTENT.
  const displayVideos = taskVideos === null
    ? null
    : (taskVideos.length > 0 ? taskVideos : (content.videos || []))

  // Checklist cần đạt; nếu bài đã chấm thì biết mục nào đã tick.
  const checklistItems = getChecklist(id)
  const reviewChecked  = sub?.status === 'graded' ? parseReview(sub).checked : null

  return (
    <Shell role="emp" title={`${moduleLabel(task)} · ${task.name}`}
      sub={task.final ? 'Capstone — dự án tổng kết' : 'Full-Stack Marketer'}
      pad={0} body={W.paper}
      actions={<Btn kind="ghost" size="sm" onClick={() => navigate('/emp/roadmap')}>← Lộ trình</Btn>}>

      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        {/* hero */}
        <div style={{ padding:'22px 28px', borderBottom:`1px solid ${W.line2}`, background: W.panel,
          display:'flex', alignItems:'center', gap:18 }}>
          <div style={{ width:56, height:56, borderRadius:12, background: W.ink, color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:800,
            fontFamily: W.mono, flexShrink:0 }}>{id}</div>
          <div style={{ flex:1 }}>
            <H size={20} mb={6}>{task.name}</H>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <Tag tone={stTone}>{stTxt}</Tag>
              <Tag tone="line">{moduleLabel(task)}</Tag>
              {task.key && <Tag tone="warn">Module trọng tâm</Tag>}
              <Tag tone="line">~{task.hours} giờ</Tag>
            </div>
          </div>
          <Card pad={14} fill={dl.tone === 'late' ? W.lateSoft : W.accSoft} line="transparent"
            style={{ textAlign:'center', minWidth:130, flexShrink:0 }}>
            <T size={10.5} mono c={dl.tone === 'late' ? W.late : W.acc} mb={4}>HẠN NỘP</T>
            <div style={{ fontSize:22, fontWeight:800, color: dl.tone === 'late' ? W.late : W.ink, lineHeight:1 }}>{dl.txt}</div>
            <T size={10.5} c={W.ink2} style={{ marginTop:3 }}>{formatDeadline(calcDeadline(task, currentUser?.start_date))}</T>
          </Card>
        </div>

        {/* body */}
        <div style={{ flex:1, minHeight:0, overflowY:'auto', padding:'20px 28px', display:'flex', flexDirection:'column', gap:20 }}>

          {/* CẦN NẮM */}
          <div>
            <H size={14} mb={10} c={W.ink2}>CẦN NẮM</H>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {(content.learn || []).map((l, i) => <Tag key={i} tone="line">{l}</Tag>)}
            </div>
          </div>

          {/* GHI CHÚ */}
          {content.note && (
            <Card pad={12} fill={W.warnSoft} line="transparent">
              <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                <Ico name="bell" s={15} c={W.warn} />
                <T size={13} c={W.ink} style={{ lineHeight:1.5 }}>{content.note}</T>
              </div>
            </Card>
          )}

          {/* BÀI THỰC HÀNH */}
          {content.exercises?.length > 0 && (
            <div>
              <H size={14} mb={10} c={W.ink2}>BÀI THỰC HÀNH</H>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {content.exercises.map((ex, i) => (
                  <Card key={i} pad={14} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:26, height:26, borderRadius:7, flexShrink:0, background: W.ink, color:'#fff',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:12, fontWeight:800, fontFamily: W.mono }}>{i+1}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                        <span style={{ fontSize:10.5, fontWeight:700, color: W.acc, fontFamily: W.mono }}>{ex.code}</span>
                        <span style={{ fontSize:13.5, fontWeight:700, color: W.ink }}>{ex.title}</span>
                      </div>
                      <T size={12.5} c={W.ink2} style={{ lineHeight:1.6 }}>{ex.desc}</T>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* VIDEO GỢI Ý */}
          {displayVideos !== null && displayVideos.length > 0 && (
            <div>
              <H size={14} mb={10} c={W.ink2}>VIDEO GỢI Ý</H>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12 }}>
                {displayVideos.map((v, i) => {
                  const ytId = getYtId(v.url)
                  return (
                    <a key={i} href={v.url} target="_blank" rel="noopener noreferrer"
                      style={{ textDecoration:'none', display:'block' }}>
                      <Card pad={0} style={{ overflow:'hidden', transition:'box-shadow .15s' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,.1)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
                        {ytId ? (
                          <div style={{ position:'relative' }}>
                            <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                              alt={v.title} style={{ width:'100%', height:110, objectFit:'cover', display:'block' }} />
                            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center',
                              justifyContent:'center', background:'rgba(0,0,0,.25)' }}>
                              <div style={{ width:40, height:40, borderRadius:40, background:'rgba(255,255,255,.92)',
                                display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <Ico name="play" s={18} c={W.acc} />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ height:80, background:W.accSoft, display:'flex',
                            alignItems:'center', justifyContent:'center' }}>
                            <Ico name="play" s={28} c={W.acc} />
                          </div>
                        )}
                        <div style={{ padding:'10px 12px' }}>
                          <div style={{ fontSize:12.5, fontWeight:600, color:W.ink, lineHeight:1.3 }}>{v.title}</div>
                        </div>
                      </Card>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* PROMPT MẪU — chỉ task có sẵn prompt */}
          {content.prompt && (
            <div>
              <H size={14} mb={10} c={W.ink2}>PROMPT MẪU — DÙNG NGAY VỚI CHATGPT</H>
              <Card pad={14} fill={W.panel} line={W.line2}>
                <T size={11} mono c={W.ink3} mb={8}>DÁN VÀO CHATGPT ĐỂ TẠO CHECKLIST</T>
                <div style={{ fontFamily: W.mono, fontSize:12.5, color:W.ink, lineHeight:1.7,
                  background:'#fff', borderRadius:6, padding:'12px 14px', border:`1px solid ${W.line2}`,
                  whiteSpace:'pre-wrap' }}>{content.prompt}</div>
              </Card>
            </div>
          )}

          {/* CHECKLIST CẦN ĐẠT */}
          {checklistItems.length > 0 && (
            <div>
              <H size={14} mb={10} c={W.ink2}>
                CHECKLIST CẦN ĐẠT
                {reviewChecked != null && (
                  <span style={{ fontSize:12, fontWeight:700, color:W.done, marginLeft:8, fontFamily:W.mono }}>
                    {moduleScore(sub, id)}% · {reviewChecked.length}/{checklistItems.length}
                  </span>
                )}
              </H>
              <Card pad={14} fill={W.doneSoft} line="transparent">
                <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                  {checklistItems.map((p, i) => {
                    const done = reviewChecked != null && reviewChecked.includes(i)
                    const missed = reviewChecked != null && !done
                    return (
                      <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:9 }}>
                        <Ico name={missed ? 'x' : 'check'} s={15} c={missed ? W.ink4 : W.done} />
                        <T size={12.5} c={missed ? W.ink3 : W.ink} style={{ lineHeight:1.5 }}>{p}</T>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* BẪY THƯỜNG GẶP */}
          {content.traps?.length > 0 && (
            <div>
              <H size={14} mb={10} c={W.ink2}>BẪY THƯỜNG GẶP</H>
              <Card pad={14} fill={W.lateSoft} line="transparent">
                <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                  {content.traps.map((t, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:9 }}>
                      <Ico name="flag" s={15} c={W.late} />
                      <T size={12.5} c={W.ink} style={{ lineHeight:1.5 }}>{t}</T>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ĐẦU RA CẦN NỘP */}
          <div>
            <H size={14} mb={10} c={W.ink2}>ĐẦU RA CẦN NỘP</H>
            <Card pad={16}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                <Ico name="doc" s={18} c={W.acc} />
                <div style={{ flex:1 }}>
                  <T size={10.5} mono c={W.ink3} mb={3}>ĐỊNH DẠNG GỢI Ý</T>
                  <div style={{ fontSize:13.5, fontWeight:700, color:W.ink }}>{task.file}</div>
                </div>
              </div>
              <T size={13} c={W.ink2} style={{ lineHeight:1.7 }}>{content.description}</T>
              <T size={11.5} c={W.ink4} style={{ marginTop:10, lineHeight:1.5 }}>
                Nộp linh hoạt theo định dạng phù hợp: văn bản viết trực tiếp, ảnh chụp, tệp đính kèm (PDF/video/.html…) hoặc link.
              </T>
            </Card>
          </div>

          {!loading && sub && (
            <div>
              <H size={14} mb={10} c={W.ink2}>BÀI ĐÃ NỘP</H>
              <Card pad={14}
                fill={sub.status === 'graded' ? W.doneSoft : sub.status === 'pending' ? W.accSoft : W.warnSoft}
                line="transparent">
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <Ico name="doc" s={18} c={sub.status === 'graded' ? W.done : W.acc} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, fontFamily: W.mono }}>{sub.file_name}</div>
                    <T size={11.5} style={{ marginTop:2 }}>
                      Nộp {new Date(sub.submitted_at).toLocaleString('vi-VN')}
                      {sub.status === 'graded' && ' · đã chấm'}
                    </T>
                  </div>
                  {sub.status === 'graded' && (
                    <div style={{ fontSize:22, fontWeight:800, color: W.done }}>{moduleScore(sub, id)}%</div>
                  )}
                </div>
                <div style={{ marginTop:12, border:`1px solid rgba(0,0,0,.08)`, borderRadius:8,
                  overflow:'hidden', height:340, background:'#fff' }}>
                  <SubmissionView sub={sub} pad={14} />
                </div>
                {parseReview(sub).comment && (
                  <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid rgba(0,0,0,.08)` }}>
                    <T size={11} mono c={W.ink3} mb={4}>NHẬN XÉT</T>
                    <T size={12.5}>{parseReview(sub).comment}</T>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>

        <div style={{ flexShrink:0, borderTop:`1px solid ${W.line2}`, background: W.paper,
          padding:'14px 28px', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ flex:1 }} />
          {sub?.status === 'pending' && <Tag tone="warn">Đang chờ chấm</Tag>}
          <Link to={`/emp/submit/${id}`}>
            <Btn kind="solid" size="md" icon={<Ico name="up" s={15} c="#fff"/>}>
              {sub ? 'Sửa / nộp lại' : 'Nộp báo cáo'}
            </Btn>
          </Link>
        </div>
      </div>
    </Shell>
  )
}

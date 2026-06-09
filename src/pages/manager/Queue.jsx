import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Stat, Check, Field, Ico, Avatar, Divider } from '../../design-system'
import { useStore } from '../../store'
import { TASKS, EMPLOYEES } from '../../data'

function timeAgo(iso) {
  const d = Math.floor((new Date() - new Date(iso)) / 60000)
  if (d < 60) return `${d} phút trước`
  const h = Math.floor(d / 60)
  if (h < 24) return `${h} giờ trước`
  const days = Math.floor(h / 24)
  if (days === 1) return 'Hôm qua'
  return `${days} ngày trước`
}

const CRITERIA = ['Đủ section yêu cầu', 'Nội dung tự chỉnh (không copy AI)', 'Trình bày dễ đọc, có ví dụ thực tế']

export default function Queue() {
  const { subId } = useParams()
  const navigate = useNavigate()
  const { submissions, gradeSubmission } = useStore()

  const queue = submissions
    .filter(s => s.status === 'pending')
    .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))

  // Selected submission (from URL param or first in queue)
  const selectedId = subId || (queue[0]?.id)
  const selected = queue.find(s => s.id === selectedId) || queue[0]

  const [grade, setGrade] = useState(selected?.grade?.toString() || '8.5')
  const [feedback, setFeedback] = useState('')
  const [criteria, setCriteria] = useState([true, true, false])
  const [saving, setSaving] = useState(false)

  const selectedEmp  = selected ? EMPLOYEES.find(e => e.id === selected.employeeId) : null
  const selectedTask = selected ? TASKS.find(t => t.id === selected.taskId) : null

  const handleGrade = (approved) => {
    if (!selected) return
    setSaving(true)
    gradeSubmission({
      submissionId: selected.id,
      grade: approved ? parseFloat(grade) || 8.5 : null,
      feedback,
      approved,
    })
    // Move to next in queue
    const remaining = queue.filter(s => s.id !== selected.id)
    setTimeout(() => {
      setSaving(false)
      if (remaining.length > 0) {
        navigate(`/mgr/queue/${remaining[0].id}`)
        setFeedback('')
        setCriteria([true, true, false])
        setGrade('8.5')
      } else {
        navigate('/mgr/queue')
      }
    }, 400)
  }

  return (
    <Shell role="mgr" active={2} title="Hàng chờ chấm bài" sub={`${queue.length} báo cáo đang chờ duyệt`}
      body={W.panel} pad={18}
      actions={
        <Btn kind="ghost" size="sm" icon={<Ico name="filter" s={13}/>}>Lọc theo task</Btn>
      }>

      {queue.length === 0 ? (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60%',
          flexDirection:'column', gap:12 }}>
          <div style={{ width:60, height:60, borderRadius:18, background: W.doneSoft,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Ico name="check" s={28} c={W.done} sw={2} />
          </div>
          <H size={18}>Hàng chờ trống!</H>
          <T size={13.5}>Tất cả báo cáo đã được chấm.</T>
          <Link to="/mgr/stats"><Btn kind="soft" size="md">Xem thống kê</Btn></Link>
        </div>
      ) : (
        <div style={{ display:'flex', gap:16, height:'100%' }}>
          {/* left: queue list */}
          <div style={{ width:280, flexShrink:0, display:'flex', flexDirection:'column', gap:8, overflowY:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:2 }}>
              <T size={11} mono c={W.ink3}>HÀNG CHỜ · {queue.length}</T>
              <Tag tone="line">Mới nhất</Tag>
            </div>
            {queue.map(q => {
              const emp  = EMPLOYEES.find(e => e.id === q.employeeId)
              const task = TASKS.find(t => t.id === q.taskId)
              const sel  = q.id === selected?.id
              return (
                <Link key={q.id} to={`/mgr/queue/${q.id}`} style={{ textDecoration:'none' }}>
                  <Card pad={12} fill={sel ? W.accSoft : '#fff'} line={sel ? W.accLine : W.line}
                    style={{ display:'flex', alignItems:'center', gap:11, cursor:'pointer',
                      boxShadow: sel ? '0 2px 10px rgba(0,0,0,.05)' : 'none', transition:'all .12s' }}>
                    <Avatar s={30} txt={emp?.initials || '?'} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden',
                        textOverflow:'ellipsis', color: W.ink }}>{emp?.name}</div>
                      <div style={{ fontSize:10.5, color: W.ink3 }}>Task {q.taskId} · {timeAgo(q.submittedAt)}</div>
                    </div>
                    {task?.key && <div style={{ width:7, height:7, borderRadius:7, background: W.warn, flexShrink:0 }} />}
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* right: preview + grade */}
          {selected ? (
            <div style={{ flex:1, minWidth:0, display:'flex', gap:14 }}>
              {/* report preview */}
              <Card pad={0} style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ padding:'11px 16px', borderBottom:`1px solid ${W.line2}`, background: W.panel,
                  display:'flex', alignItems:'center', gap:10 }}>
                  <Avatar s={26} txt={selectedEmp?.initials || '?'} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700 }}>{selectedEmp?.name} · Task {selected.taskId}</div>
                    <div style={{ fontSize:10, color: W.ink4, fontFamily: W.mono }}>{selected.fileName}</div>
                  </div>
                  <T size={11.5} c={W.ink3}>{timeAgo(selected.submittedAt)}</T>
                </div>
                <div style={{ flex:1, minHeight:0 }}>
                  {selected.fileContent ? (
                    <iframe
                      srcDoc={selected.fileContent}
                      sandbox="allow-same-origin"
                      style={{ width:'100%', height:'100%', border:'none', display:'block' }}
                      title="Báo cáo"
                    />
                  ) : (
                    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:12 }}>
                      <div style={{ fontSize:13.5, fontWeight:700, fontFamily: W.mono }}>
                        {selectedTask?.name}
                      </div>
                      {selected.note && (
                        <Card pad={12} fill={W.accSoft} line="transparent">
                          <T size={11} mono c={W.acc} mb={4}>GHI CHÚ TỪ NHÂN VIÊN</T>
                          <T size={12.5}>{selected.note}</T>
                        </Card>
                      )}
                      <T size={13} c={W.ink3}>
                        File HTML đã nộp: <span style={{ fontFamily: W.mono }}>{selected.fileName}</span>
                      </T>
                    </div>
                  )}
                </div>
              </Card>

              {/* grade panel */}
              <div style={{ width:244, flexShrink:0, display:'flex', flexDirection:'column', gap:12 }}>
                <Card pad={16}>
                  <T size={11} mono c={W.ink3} mb={12}>CHẤM ĐIỂM</T>
                  <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:14 }}>
                    <input
                      type="number" min="0" max="10" step="0.5"
                      value={grade} onChange={e => setGrade(e.target.value)}
                      style={{ width:64, fontSize:24, fontWeight:800, textAlign:'center',
                        border:`1px solid ${W.line}`, borderRadius:8, padding:'6px 0',
                        color: W.ink, fontFamily: W.font, outline:'none' }}
                    />
                    <span style={{ fontSize:14, color: W.ink3 }}>/ 10</span>
                  </div>
                  <T size={11} weight={600} c={W.ink2} mb={8}>Tiêu chí đánh giá</T>
                  {CRITERIA.map((c, i) => (
                    <Check key={i} on={criteria[i]} label={c}
                      style={{ marginBottom:8, cursor:'pointer' }}
                      onClick={() => setCriteria(cr => cr.map((v,j) => j===i ? !v : v))} />
                  ))}
                </Card>

                <Card pad={14}>
                  <Field label="Nhận xét cho nhân viên">
                    <textarea
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      placeholder="Nhận xét cụ thể để nhân viên cải thiện..."
                      rows={4}
                      style={{ width:'100%', border:`1px solid ${W.line}`, borderRadius:8, padding:'10px 12px',
                        fontSize:12.5, color: W.ink, fontFamily: W.font, resize:'vertical',
                        outline:'none', boxSizing:'border-box', lineHeight:1.5 }}
                    />
                  </Field>
                </Card>

                {selected.note && (
                  <Card pad={12} fill={W.accSoft} line="transparent">
                    <T size={10} mono c={W.acc} mb={4}>GHI CHÚ TỪ NV</T>
                    <T size={11.5}>{selected.note}</T>
                  </Card>
                )}

                <div style={{ display:'flex', gap:8 }}>
                  <Btn kind="ghost" size="md" style={{ flex:1 }} disabled={saving}
                    onClick={() => handleGrade(false)}>
                    Yêu cầu sửa
                  </Btn>
                  <Btn kind="solid" size="md" style={{ flex:1 }} disabled={saving}
                    onClick={() => handleGrade(true)}>
                    {saving ? 'Đang lưu...' : 'Duyệt'}
                  </Btn>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <T size={14} c={W.ink3}>Chọn một bài để chấm</T>
            </div>
          )}
        </div>
      )}
    </Shell>
  )
}

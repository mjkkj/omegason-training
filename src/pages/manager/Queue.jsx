import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Check, Field, Ico, Avatar } from '../../design-system'
import { fetchAllSubmissions, gradeSubmission } from '../../store'
import SubmissionView from '../../components/SubmissionView'
import { TASKS, moduleLabel } from '../../data'

function timeAgo(iso) {
  const d = Math.floor((new Date() - new Date(iso)) / 60000)
  if (d < 60) return `${d} phút trước`
  const h = Math.floor(d / 60)
  if (h < 24) return `${h} giờ trước`
  return `${Math.floor(h/24)} ngày trước`
}

const CRITERIA = ['Đủ section yêu cầu', 'Nội dung tự chỉnh (không copy AI)', 'Trình bày dễ đọc, có ví dụ']

export default function Queue() {
  const { subId } = useParams()
  const navigate  = useNavigate()
  const [allSubs, setAllSubs]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [grade, setGrade]       = useState('8.5')
  const [feedback, setFeedback] = useState('')
  const [criteria, setCriteria] = useState([true, true, false])
  const [saving, setSaving]     = useState(false)

  const loadData = () => fetchAllSubmissions().then(data => { setAllSubs(data); setLoading(false) })
  useEffect(() => { loadData() }, [])

  // queue = pending subs with their employee profile embedded
  const queue = allSubs
    .filter(s => s.status === 'pending')
    .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at))

  const selected = queue.find(s => s.id === subId) || queue[0]

  const handleGrade = async (approved) => {
    if (!selected) return
    setSaving(true)
    try {
      await gradeSubmission({
        submissionId: selected.id,
        grade: approved ? parseFloat(grade) || 8.5 : null,
        feedback,
        approved,
      })
      await loadData()
      setFeedback(''); setGrade('8.5'); setCriteria([true,true,false])
      // Advance to next
      const remaining = queue.filter(s => s.id !== selected.id)
      if (remaining.length > 0) navigate(`/mgr/queue/${remaining[0].id}`)
      else navigate('/mgr/queue')
    } finally {
      setSaving(false)
    }
  }

  const emp  = selected?.profiles
  const task = selected ? TASKS.find(t => t.id === selected.task_id) : null

  return (
    <Shell role="mgr" title="Hàng chờ chấm bài" sub={`${queue.length} báo cáo đang chờ`}
      body={W.panel} pad={18}>

      {!loading && queue.length === 0 ? (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60%', gap:12 }}>
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
          {/* left: list */}
          <div style={{ width:272, flexShrink:0, display:'flex', flexDirection:'column', gap:8, overflowY:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:2 }}>
              <T size={11} mono c={W.ink3}>HÀNG CHỜ · {queue.length}</T>
            </div>
            {queue.map(q => {
              const e = q.profiles
              const sel = q.id === selected?.id
              return (
                <Link key={q.id} to={`/mgr/queue/${q.id}`} style={{ textDecoration:'none' }}>
                  <Card pad={12} fill={sel?W.accSoft:'#fff'} line={sel?W.accLine:W.line}
                    style={{ display:'flex', alignItems:'center', gap:11, cursor:'pointer' }}>
                    <Avatar s={30} txt={e?.initials || '?'} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis',
                        whiteSpace:'nowrap' }}>{e?.name || 'Nhân viên'}</div>
                      <div style={{ fontSize:10.5, color: W.ink3 }}>
                        {moduleLabel(TASKS.find(t => t.id === q.task_id))} · {timeAgo(q.submitted_at)}
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* right: preview + grade */}
          {selected && (
            <div style={{ flex:1, minWidth:0, display:'flex', gap:14 }}>
              <Card pad={0} style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ padding:'11px 16px', borderBottom:`1px solid ${W.line2}`,
                  background: W.panel, display:'flex', alignItems:'center', gap:10 }}>
                  <Avatar s={26} txt={emp?.initials || '?'} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700 }}>{emp?.name} · {moduleLabel(task)}</div>
                    <div style={{ fontSize:10, color: W.ink4, fontFamily: W.mono }}>{selected.file_name}</div>
                  </div>
                  <T size={11.5} c={W.ink3}>{timeAgo(selected.submitted_at)}</T>
                </div>
                <div style={{ flex:1, minHeight:0 }}>
                  <SubmissionView sub={selected} pad={20} />
                </div>
              </Card>

              {/* grade panel */}
              <div style={{ width:244, flexShrink:0, display:'flex', flexDirection:'column', gap:12 }}>
                <Card pad={16}>
                  <T size={11} mono c={W.ink3} mb={12}>CHẤM ĐIỂM</T>
                  <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:14 }}>
                    <input type="number" min="0" max="10" step="0.5"
                      value={grade} onChange={e => setGrade(e.target.value)}
                      style={{ width:64, fontSize:24, fontWeight:800, textAlign:'center',
                        border:`1px solid ${W.line}`, borderRadius:8, padding:'6px 0',
                        color: W.ink, fontFamily: W.font, outline:'none' }} />
                    <span style={{ fontSize:14, color: W.ink3 }}>/ 10</span>
                  </div>
                  <T size={11} weight={600} c={W.ink2} mb={8}>Tiêu chí</T>
                  {CRITERIA.map((c,i) => (
                    <Check key={i} on={criteria[i]} label={c} style={{ marginBottom:8, cursor:'pointer' }}
                      onClick={() => setCriteria(cr => cr.map((v,j) => j===i?!v:v))} />
                  ))}
                </Card>

                <Card pad={14}>
                  <Field label="Nhận xét">
                    <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
                      placeholder="Nhận xét giúp nhân viên cải thiện..." rows={4}
                      style={{ width:'100%', border:`1px solid ${W.line}`, borderRadius:8, padding:'10px 12px',
                        fontSize:12.5, color: W.ink, fontFamily: W.font, resize:'vertical',
                        outline:'none', boxSizing:'border-box', lineHeight:1.5 }} />
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
                    onClick={() => handleGrade(false)}>Yêu cầu sửa</Btn>
                  <Btn kind="solid" size="md" style={{ flex:1 }} disabled={saving}
                    onClick={() => handleGrade(true)}>{saving?'Đang lưu…':'Duyệt'}</Btn>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Shell>
  )
}

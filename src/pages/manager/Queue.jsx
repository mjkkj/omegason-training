import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Check, Field, Ico, Avatar } from '../../design-system'
import { fetchAllSubmissions, saveReview } from '../../store'
import SubmissionView from '../../components/SubmissionView'
import { TASKS, moduleLabel } from '../../data'
import { getChecklist, parseReview, buildReview } from '../../checklist'

function timeAgo(iso) {
  const d = Math.floor((new Date() - new Date(iso)) / 60000)
  if (d < 60) return `${d} phút trước`
  const h = Math.floor(d / 60)
  if (h < 24) return `${h} giờ trước`
  return `${Math.floor(h/24)} ngày trước`
}

export default function Queue() {
  const { subId } = useParams()
  const navigate  = useNavigate()
  const [allSubs, setAllSubs]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [checked, setChecked]   = useState([])     // index các mục đã tick
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving]     = useState(false)

  const loadData = () => fetchAllSubmissions().then(data => { setAllSubs(data); setLoading(false) })
  useEffect(() => { loadData() }, [])

  // queue = bài chờ chấm, kèm hồ sơ nhân viên
  const queue = allSubs
    .filter(s => s.status === 'pending')
    .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at))

  const selected = queue.find(s => s.id === subId) || queue[0]

  // Nạp lại checklist + nhận xét mỗi khi đổi bài.
  useEffect(() => {
    if (!selected) { setChecked([]); setFeedback(''); return }
    const r = parseReview(selected)
    setChecked(r.checked)
    setFeedback(r.comment)
  }, [selected?.id])

  const emp   = selected?.profiles
  const task  = selected ? TASKS.find(t => t.id === selected.task_id) : null
  const items = selected ? getChecklist(selected.task_id) : []
  const pct   = items.length ? Math.round((checked.length / items.length) * 100) : 0
  const toggle = (i) => setChecked(c => c.includes(i) ? c.filter(x => x !== i) : [...c, i])

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      await saveReview({ submissionId: selected.id, feedback: buildReview(checked, feedback) })
      await loadData()
      // Sang bài chờ kế tiếp
      const remaining = queue.filter(s => s.id !== selected.id)
      navigate(remaining.length ? `/mgr/queue/${remaining[0].id}` : '/mgr/queue')
    } finally {
      setSaving(false)
    }
  }

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

          {/* right: preview + checklist */}
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

              {/* checklist panel */}
              <div style={{ width:300, flexShrink:0, display:'flex', flexDirection:'column', gap:12 }}>
                <Card pad={16}>
                  <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:12 }}>
                    <T size={11} mono c={W.ink3}>CHECKLIST · {checked.length}/{items.length}</T>
                    <span style={{ fontSize:22, fontWeight:800, color: pct===100?W.done:W.acc, fontFamily: W.font }}>{pct}%</span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {items.map((label, i) => (
                      <Check key={i} on={checked.includes(i)} label={label}
                        style={{ cursor:'pointer', alignItems:'flex-start' }}
                        onClick={() => toggle(i)} />
                    ))}
                    {items.length === 0 && <T size={12.5} c={W.ink3}>Module này chưa có checklist.</T>}
                  </div>
                </Card>

                <Card pad={14}>
                  <Field label="Nhận xét cho nhân viên">
                    <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
                      placeholder="Góp ý giúp nhân viên cải thiện các mục còn thiếu…" rows={4}
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

                <Btn kind="solid" size="md" full disabled={saving} onClick={handleSave}>
                  {saving ? 'Đang lưu…' : 'Lưu kết quả chấm'}
                </Btn>
              </div>
            </div>
          )}
        </div>
      )}
    </Shell>
  )
}

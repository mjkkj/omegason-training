import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Check, Field, Ico } from '../../design-system'
import { useStore, fetchMySubmissions, upsertSubmission } from '../../store'
import { TASKS, moduleLabel } from '../../data'
import { getChecklist } from '../../checklist'
import {
  readFileEntry, buildSubmission, parseSubmission, isImage, isHtml,
  formatSize, MAX_FILE_BYTES, MAX_TOTAL_BYTES,
} from '../../submission'
import { useT } from '../../i18n'

export default function Submit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useStore()
  const t = useT()
  const task = TASKS.find(t => t.id === id)

  const [existingSub, setExistingSub] = useState(null)
  const [text, setText]     = useState('')
  const [files, setFiles]   = useState([])
  const [links, setLinks]   = useState([])
  const [selfChecked, setSelfChecked] = useState([])
  const [note, setNote]     = useState('')
  const [dragging, setDragging] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)
  const inputRef = useRef()

  useEffect(() => {
    if (!currentUser || !id) return
    fetchMySubmissions(currentUser.id).then(data => {
      const sub = data.find(s => s.task_id === id)
      if (sub) {
        setExistingSub(sub)
        setNote(sub.note || '')
        const c = parseSubmission(sub)
        setText(c.text || '')
        setFiles(c.files || [])
        setLinks(c.links?.length ? c.links : [])
        setSelfChecked(c.selfChecked || [])
      }
    })
  }, [currentUser?.id, id])

  if (!task) return <div style={{ padding:32 }}>Không tìm thấy task.</div>

  const totalBytes = files.reduce((s, f) => s + (f.size || 0), 0)
  const checklist  = getChecklist(id)
  const toggleCheck = (i) => setSelfChecked(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i])

  const addFiles = async (list) => {
    const arr = Array.from(list || [])
    if (!arr.length) return
    setError(null)
    let running = totalBytes
    const accepted = []
    for (const f of arr) {
      if (f.size > MAX_FILE_BYTES) { setError(`"${f.name}" ${t('quá lớn (tối đa')} ${formatSize(MAX_FILE_BYTES)}${t('/tệp)')}`); continue }
      if (running + f.size > MAX_TOTAL_BYTES) { setError(`${t('Tổng dung lượng vượt')} ${formatSize(MAX_TOTAL_BYTES)}`); continue }
      try { accepted.push(await readFileEntry(f)); running += f.size } catch (e) { setError(e.message) }
    }
    if (accepted.length) setFiles(prev => [...prev, ...accepted])
  }

  const removeFile = (i) => setFiles(prev => prev.filter((_, j) => j !== i))
  const addLink    = () => setLinks(prev => [...prev, { url:'', label:'' }])
  const setLink    = (i, key, val) => setLinks(prev => prev.map((l, j) => j === i ? { ...l, [key]: val } : l))
  const removeLink = (i) => setLinks(prev => prev.filter((_, j) => j !== i))

  const handleSubmit = async () => {
    const built = buildSubmission({ text, links, files, selfChecked })
    if (built.isEmpty) { setError(t('Hãy nhập nội dung, đính kèm tệp hoặc dán ít nhất một liên kết.')); return }
    setSaving(true)
    try {
      await upsertSubmission({
        employeeId: currentUser.id,
        taskId: id,
        fileName: built.fileName,
        fileContent: built.fileContent,
        fileSize: built.fileSize,
        note,
      })
      setSubmitted(true)
      setTimeout(() => navigate(`/emp/task/${id}`), 1300)
    } catch (err) {
      setError(err.message); setSaving(false)
    }
  }

  if (submitted) return (
    <Shell role="emp" title={t('Nộp báo cáo')} sub={moduleLabel(task)} body={W.panel2}>
      <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:64, height:64, borderRadius:20, background: W.doneSoft,
            margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Ico name="check" s={28} c={W.done} sw={2.5} />
          </div>
          <H size={20} mb={8}>{t('Đã nộp thành công!')}</H>
          <T size={13.5}>{t('Đang chuyển về trang module...')}</T>
        </div>
      </div>
    </Shell>
  )

  const validLinks = links.filter(l => l.url.trim()).length

  return (
    <Shell role="emp" title={existingSub ? t('Chỉnh sửa & nộp lại') : t('Nộp báo cáo')}
      sub={`${moduleLabel(task)} · ${task.name}`} body={W.panel2}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:8 }}>
        <Card pad={0} r={14} style={{ width:'100%', maxWidth:620, boxShadow:'0 10px 40px rgba(0,0,0,.10)' }}>

          <div style={{ padding:'18px 22px', borderBottom:`1px solid ${W.line2}`,
            display:'flex', alignItems:'center', gap:10 }}>
            <Ico name="up" s={18} c={W.acc} />
            <H size={16}>{existingSub ? t('Chỉnh sửa bài nộp') : t('Bài nộp')} · {moduleLabel(task)}</H>
            <div style={{ flex:1 }} />
            <Link to={`/emp/task/${id}`}>
              <span style={{ fontSize:20, color: W.ink4, cursor:'pointer' }}>×</span>
            </Link>
          </div>

          {/* deliverable hint */}
          <div style={{ padding:'12px 22px', background:W.accSoft, borderBottom:`1px solid ${W.line2}`,
            display:'flex', alignItems:'flex-start', gap:9 }}>
            <Ico name="doc" s={14} c={W.acc} />
            <T size={12} c={W.ink2} style={{ lineHeight:1.5 }}>
              <b>{t('Đầu ra:')}</b> {task.file}. {t('Nộp theo định dạng phù hợp — văn bản, ảnh chụp, tệp, hoặc link (Drive/Sheet/Figma…).')}
            </T>
          </div>

          <div style={{ padding:22, display:'flex', flexDirection:'column', gap:20 }}>

            {/* CHECKLIST TỰ RÀ */}
            {checklist.length > 0 && (
              <div>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:8 }}>
                  <T size={12} weight={600} c={W.ink2}>{t('Checklist cần đạt')} <span style={{ color:W.ink4, fontWeight:400 }}>{t('· tự rà trước khi nộp')}</span></T>
                  <span style={{ fontSize:12, fontWeight:700, fontFamily:W.mono,
                    color: selfChecked.length===checklist.length ? W.done : W.acc }}>
                    {selfChecked.length}/{checklist.length}
                  </span>
                </div>
                <Card pad={14} fill={W.panel} line={W.line2}>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {checklist.map((item, i) => (
                      <Check key={i} on={selfChecked.includes(i)} label={item}
                        style={{ cursor:'pointer', alignItems:'flex-start' }}
                        onClick={() => toggleCheck(i)} />
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* TEXT */}
            <Field label={t('Nội dung báo cáo')}>
              <textarea value={text} onChange={e => setText(e.target.value)} rows={6}
                placeholder={t('Viết báo cáo / phân tích / quyết định ở đây. Có thể dán bảng số, ghi chú quyết định…')}
                style={{ width:'100%', border:`1px solid ${W.line}`, borderRadius:8, background:'#fff',
                  padding:'11px 13px', fontSize:13, color: W.ink, fontFamily: W.font,
                  resize:'vertical', outline:'none', boxSizing:'border-box', lineHeight:1.6 }} />
            </Field>

            {/* FILES */}
            <div>
              <T size={12} weight={600} c={W.ink2} mb={8}>{t('Tệp đính kèm')} <span style={{ color:W.ink4, fontWeight:400 }}>· ảnh, PDF, video, .html… (≤ {formatSize(MAX_FILE_BYTES)}/tệp)</span></T>
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
                style={{ border:`1.5px dashed ${dragging ? W.acc : W.accLine}`, borderRadius:12,
                  background: W.accSoft, padding:'20px', textAlign:'center', cursor:'pointer' }}>
                <Ico name="up" s={22} c={W.acc} />
                <div style={{ fontSize:13.5, fontWeight:700, marginTop:6 }}>{t('Kéo & thả hoặc bấm để chọn tệp')}</div>
                <T size={11.5} style={{ marginTop:3 }}>{t('Chọn nhiều tệp · tổng tối đa')} {formatSize(MAX_TOTAL_BYTES)}</T>
              </div>
              <input ref={inputRef} type="file" multiple style={{ display:'none' }}
                onChange={e => { addFiles(e.target.files); e.target.value = '' }} />

              {files.length > 0 && (
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:10 }}>
                  {files.map((f, i) => (
                    <Card key={i} pad={10} fill={W.panel} style={{ display:'flex', alignItems:'center', gap:11 }}>
                      {isImage(f) && f.data
                        ? <img src={f.data} alt="" style={{ width:38, height:38, borderRadius:6, objectFit:'cover', flexShrink:0 }} />
                        : <div style={{ width:38, height:38, borderRadius:6, background:'#fff', flexShrink:0,
                            border:`1px solid ${W.line2}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Ico name={isImage(f) ? 'image' : isHtml(f) ? 'doc' : 'doc'} s={16} c={W.ink3} />
                          </div>}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12.5, fontWeight:600, fontFamily:W.mono, overflow:'hidden',
                          textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</div>
                        <T size={11} style={{ marginTop:2 }}>{formatSize(f.size)}</T>
                      </div>
                      <div role="button" onClick={() => removeFile(i)}
                        style={{ cursor:'pointer', padding:4, display:'flex' }}>
                        <Ico name="x" s={14} c={W.late} />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* LINKS */}
            <div>
              <div style={{ display:'flex', alignItems:'center', marginBottom:8 }}>
                <T size={12} weight={600} c={W.ink2} style={{ flex:1 }}>{t('Liên kết')} <span style={{ color:W.ink4, fontWeight:400 }}>· Google Drive/Sheet, Figma, Loom…</span></T>
                <Btn kind="ghost" size="sm" icon={<Ico name="plus" s={12} c={W.acc}/>} onClick={addLink}>{t('Thêm link')}</Btn>
              </div>
              {links.length > 0 && (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {links.map((l, i) => (
                    <div key={i} style={{ display:'flex', gap:8 }}>
                      <input value={l.url} onChange={e => setLink(i, 'url', e.target.value)}
                        placeholder="https://…"
                        style={{ flex:2, border:`1px solid ${W.line}`, borderRadius:8, padding:'9px 12px',
                          fontSize:13, fontFamily:W.font, outline:'none', color:W.ink, background:'#fff' }} />
                      <input value={l.label} onChange={e => setLink(i, 'label', e.target.value)}
                        placeholder={t('Nhãn (tuỳ chọn)')}
                        style={{ flex:1, border:`1px solid ${W.line}`, borderRadius:8, padding:'9px 12px',
                          fontSize:13, fontFamily:W.font, outline:'none', color:W.ink, background:'#fff' }} />
                      <div role="button" onClick={() => removeLink(i)}
                        style={{ cursor:'pointer', padding:'0 6px', display:'flex', alignItems:'center' }}>
                        <Ico name="x" s={14} c={W.late} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div style={{ background: W.lateSoft, border:`1px solid ${W.late}`, borderRadius:8,
                padding:'10px 14px', fontSize:13, color: W.late }}>{error}</div>
            )}

            <Field label={t('Ghi chú cho người chấm (tuỳ chọn)')}>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                placeholder={t('Ví dụ: phần X mình chưa chắc, nhờ anh/chị xem thêm…')}
                style={{ width:'100%', border:`1px solid ${W.line}`, borderRadius:8, background:'#fff',
                  padding:'10px 12px', fontSize:13, color: W.ink, fontFamily: W.font,
                  resize:'vertical', outline:'none', boxSizing:'border-box', lineHeight:1.5 }} />
            </Field>
          </div>

          <div style={{ padding:'14px 22px', borderTop:`1px solid ${W.line2}`,
            display:'flex', alignItems:'center', gap:10 }}>
            <T size={11.5} c={W.ink3} style={{ flex:1 }}>
              {[text.trim() && t('báo cáo'), files.length && `${files.length} ${t('tệp')}`, validLinks && `${validLinks} ${t('link')}`]
                .filter(Boolean).join(' · ') || t('chưa có nội dung')}
            </T>
            <Link to={`/emp/task/${id}`}><Btn kind="ghost" size="md">{t('Huỷ')}</Btn></Link>
            <Btn kind="solid" size="md" disabled={saving} onClick={handleSubmit}>
              {saving ? t('Đang lưu…') : existingSub ? t('Cập nhật bài nộp') : t('Nộp báo cáo')}
            </Btn>
          </div>
        </Card>
      </div>
    </Shell>
  )
}

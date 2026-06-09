import { useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Check, Field, Ico, Divider } from '../../design-system'
import { useStore } from '../../store'
import { TASKS } from '../../data'

const SELFCHECK = [
  'Có tiêu đề & mục lục',
  'Có section đầy đủ theo yêu cầu',
  'Đã tự chỉnh lại nội dung AI',
  'Có checklist áp dụng',
  'Mở được trên trình duyệt',
]

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

export default function Submit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, submitReport, submissions } = useStore()
  const task = TASKS.find(t => t.id === id)
  const existingSub = submissions.find(s => s.employeeId === currentUser?.id && s.taskId === id)

  const [file, setFile] = useState(null)
  const [fileContent, setFileContent] = useState(null)
  const [note, setNote] = useState('')
  const [checks, setChecks] = useState([false, false, false, false, false])
  const [dragging, setDragging] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  if (!task) return <div style={{ padding:32 }}>Không tìm thấy task.</div>

  const handleFile = (f) => {
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { setError('File quá lớn (tối đa 5MB)'); return }
    if (!f.name.endsWith('.html') && !f.name.endsWith('.htm')) {
      setError('Chỉ chấp nhận file .html'); return
    }
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setFileContent(e.target.result)
    reader.readAsText(f, 'UTF-8')
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const toggleCheck = (i) => setChecks(c => c.map((v, j) => j === i ? !v : v))

  const handleSubmit = () => {
    if (!file && !existingSub) { setError('Vui lòng chọn file HTML để nộp'); return }
    submitReport({
      employeeId: currentUser.id,
      taskId: id,
      fileName: file?.name || existingSub?.fileName,
      fileContent: fileContent || existingSub?.fileContent,
      fileSize: file?.size || existingSub?.fileSize,
      note,
    })
    setSubmitted(true)
    setTimeout(() => navigate(`/emp/task/${id}`), 1500)
  }

  if (submitted) {
    return (
      <Shell role="emp" active={3} title="Nộp báo cáo" sub={`Task ${id} · ${task.name}`} body={W.panel2}>
        <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:20, background: W.doneSoft, margin:'0 auto 16px',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Ico name="check" s={28} c={W.done} sw={2.5} />
            </div>
            <H size={20} mb={8}>Đã nộp thành công!</H>
            <T size={13.5}>Đang chuyển về trang task...</T>
          </div>
        </div>
      </Shell>
    )
  }

  const fileToShow = file || (existingSub ? { name: existingSub.fileName, size: existingSub.fileSize } : null)

  return (
    <Shell role="emp" active={3} title="Nộp báo cáo" sub={`Task ${id} · ${task.name}`} body={W.panel2}>
      <div style={{ minHeight:'100%', display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:8 }}>
        <Card pad={0} r={14} style={{ width:'100%', maxWidth:580, boxShadow:'0 10px 40px rgba(0,0,0,.10)' }}>
          {/* header */}
          <div style={{ padding:'18px 22px', borderBottom:`1px solid ${W.line2}`,
            display:'flex', alignItems:'center', gap:10 }}>
            <Ico name="up" s={18} c={W.acc} />
            <H size={16}>Nộp file HTML cho Task {id}</H>
            <div style={{ flex:1 }} />
            <Link to={`/emp/task/${id}`}>
              <span style={{ fontSize:20, color: W.ink4, cursor:'pointer', lineHeight:1 }}>×</span>
            </Link>
          </div>

          <div style={{ padding:22, display:'flex', flexDirection:'column', gap:18 }}>
            {/* dropzone */}
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              style={{ border:`1.5px dashed ${dragging ? W.acc : W.accLine}`, borderRadius:12,
                background: dragging ? W.accSoft : W.accSoft, padding:'26px 20px', textAlign:'center',
                cursor:'pointer', transition:'all .15s' }}>
              <div style={{ width:42, height:42, borderRadius:12, background:'#fff', margin:'0 auto 12px',
                display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${W.accLine}` }}>
                <Ico name="up" s={20} c={W.acc} />
              </div>
              <div style={{ fontSize:14, fontWeight:700 }}>Kéo & thả file .html vào đây</div>
              <T size={12} style={{ marginTop:4 }}>hoặc bấm để chọn từ máy · tối đa 5MB</T>
            </div>
            <input ref={inputRef} type="file" accept=".html,.htm" style={{ display:'none' }}
              onChange={e => handleFile(e.target.files[0])} />

            {error && (
              <div style={{ background: W.lateSoft, border:`1px solid ${W.late}`, borderRadius:8,
                padding:'10px 14px', fontSize:13, color: W.late }}>{error}</div>
            )}

            {/* chosen file */}
            {fileToShow && (
              <Card pad={12} fill={W.panel} style={{ display:'flex', alignItems:'center', gap:11 }}>
                <Ico name="doc" s={18} c={file ? W.done : W.ink3} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:700, fontFamily: W.mono, overflow:'hidden',
                    textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{fileToShow.name}</div>
                  <T size={11} style={{ marginTop:2 }}>{formatSize(fileToShow.size)} · {file ? 'vừa chọn' : 'đã nộp trước đó'}</T>
                </div>
                {file && <Tag tone="done">✓ Hợp lệ</Tag>}
                {!file && existingSub && <Tag tone="warn">Nộp lại?</Tag>}
              </Card>
            )}

            {/* preview */}
            {(fileContent || existingSub?.fileContent) && (
              <Card pad={0} style={{ overflow:'hidden' }}>
                <div style={{ padding:'8px 14px', borderBottom:`1px solid ${W.line2}`, display:'flex',
                  alignItems:'center', gap:8, background: W.panel }}>
                  <Ico name="eye" s={13} c={W.ink3} />
                  <T size={11.5} weight={600}>Xem trước báo cáo</T>
                </div>
                <iframe
                  srcDoc={fileContent || existingSub?.fileContent}
                  sandbox="allow-same-origin"
                  style={{ width:'100%', height:240, border:'none', display:'block' }}
                  title="Preview"
                />
              </Card>
            )}

            {/* note */}
            <Field label="Ghi chú cho người chấm (tuỳ chọn)">
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Có một số phần chưa chắc, nhờ anh/chị xem thêm..."
                style={{ width:'100%', border:`1px solid ${W.line}`, borderRadius:8, background:'#fff',
                  padding:'10px 12px', fontSize:13, color: W.ink, fontFamily: W.font,
                  resize:'vertical', outline:'none', boxSizing:'border-box', lineHeight:1.5 }}
              />
            </Field>

            {/* self check */}
            <div>
              <T size={12} weight={600} c={W.ink2} mb={10}>Tự kiểm tra trước khi nộp</T>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 16px' }}>
                {SELFCHECK.map((c, i) => (
                  <Check key={i} on={checks[i]} label={c}
                    style={{ cursor:'pointer' }}
                    onClick={() => toggleCheck(i)} />
                ))}
              </div>
            </div>
          </div>

          {/* footer */}
          <div style={{ padding:'14px 22px', borderTop:`1px solid ${W.line2}`,
            display:'flex', gap:10, justifyContent:'flex-end' }}>
            <Link to={`/emp/task/${id}`}>
              <Btn kind="ghost" size="md">Huỷ</Btn>
            </Link>
            <Btn kind="solid" size="md" onClick={handleSubmit}>Nộp báo cáo</Btn>
          </div>
        </Card>
      </div>
    </Shell>
  )
}

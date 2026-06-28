import { useState, useEffect, useRef } from 'react'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Ico, Skel } from '../../design-system'
import { useStore, fetchDocuments, uploadDocument, updateDocument, deleteDocument } from '../../store'
import { readFileEntry, formatSize, isImage } from '../../submission'

const MAX_DOC_BYTES = 30 * 1024 * 1024 // 30MB

function fmtDate(d) {
  const dt = new Date(d)
  return `${dt.getDate().toString().padStart(2,'0')}/${(dt.getMonth()+1).toString().padStart(2,'0')}/${dt.getFullYear()}`
}

export default function Documents() {
  const { currentUser } = useStore()
  const [docs, setDocs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle]     = useState('')
  const [desc, setDesc]       = useState('')
  const [file, setFile]       = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [error, setError]     = useState(null)
  const [saving, setSaving]   = useState(false)
  const inputRef = useRef()

  const load = () => fetchDocuments()
    .then(data => { setDocs(data); setLoading(false) })
    .catch(e => { setError(e.message); setLoading(false) })
  useEffect(() => { load() }, [])

  const resetForm = () => { setTitle(''); setDesc(''); setFile(null); setEditingId(null); setError(null) }

  const handlePick = async (list) => {
    const f = list?.[0]
    if (!f) return
    if (f.size > MAX_DOC_BYTES) { setError(`Tệp quá lớn (tối đa ${formatSize(MAX_DOC_BYTES)})`); return }
    setError(null)
    const entry = await readFileEntry(f)
    setFile(entry)
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''))
  }

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Vui lòng nhập tên tài liệu'); return }
    if (!editingId && !file) { setError('Vui lòng chọn tệp để tải lên'); return }
    setSaving(true)
    setError(null)
    try {
      if (editingId) {
        await updateDocument(editingId, { title: title.trim(), description: desc })
      } else {
        await uploadDocument({
          title: title.trim(), description: desc,
          fileName: file.name, fileData: file.data || file.html, fileSize: file.size,
          mimeType: file.type, uploadedBy: currentUser.id,
        })
      }
      resetForm()
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (doc) => {
    setEditingId(doc.id); setTitle(doc.title); setDesc(doc.description || ''); setFile(null); setError(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Xoá tài liệu này?')) return
    await deleteDocument(id)
    load()
  }

  return (
    <Shell role="mgr" title="Tài liệu" sub="Đăng tài liệu tham khảo cho học viên">
      <div style={{ display:'flex', gap:16 }}>
        <Card pad={16} style={{ width:320, flexShrink:0, display:'flex', flexDirection:'column', gap:10 }}>
          <T size={11} mono c={W.ink3}>{editingId ? 'SỬA TÀI LIỆU' : 'ĐĂNG TÀI LIỆU MỚI'}</T>
          <input placeholder="Tên tài liệu" value={title} onChange={e => setTitle(e.target.value)}
            style={{ border:`1px solid ${W.line}`, borderRadius:8, padding:'9px 12px', fontSize:13,
              fontFamily: W.font, outline:'none', color: W.ink, background:'#fff' }} />
          <textarea placeholder="Mô tả (tuỳ chọn)" value={desc} onChange={e => setDesc(e.target.value)} rows={3}
            style={{ border:`1px solid ${W.line}`, borderRadius:8, padding:'9px 12px', fontSize:13,
              fontFamily: W.font, outline:'none', color: W.ink, background:'#fff', resize:'vertical' }} />

          {!editingId && (
            <div onClick={() => inputRef.current?.click()}
              style={{ border:`1.5px dashed ${W.accLine}`, borderRadius:10, background: W.accSoft,
                padding:'14px', textAlign:'center', cursor:'pointer' }}>
              <Ico name="up" s={18} c={W.acc} />
              <div style={{ fontSize:12.5, fontWeight:600, marginTop:4 }}>
                {file ? file.name : 'Chọn tệp tài liệu'}
              </div>
              <T size={10.5} style={{ marginTop:2 }}>Tối đa {formatSize(MAX_DOC_BYTES)}/tệp</T>
            </div>
          )}
          <input ref={inputRef} type="file" style={{ display:'none' }}
            onChange={e => { handlePick(e.target.files); e.target.value = '' }} />

          {error && <T size={12} c={W.late}>{error}</T>}

          <div style={{ display:'flex', gap:8 }}>
            <Btn kind="solid" size="sm" full disabled={saving} onClick={handleSubmit}>
              {saving ? 'Đang lưu…' : editingId ? 'Lưu thay đổi' : 'Đăng tài liệu'}
            </Btn>
            {editingId && <Btn kind="ghost" size="sm" onClick={resetForm}>Hủy</Btn>}
          </div>
        </Card>

        <div style={{ flex:1, minWidth:0 }}>
          {loading && <Skel lines={5} gap={12} h={56} />}
          {!loading && docs.length === 0 && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              gap:10, color: W.ink3, padding:'60px 0' }}>
              <Ico name="folder" s={32} c={W.ink4} />
              <T size={13}>Chưa có tài liệu nào. Đăng tài liệu đầu tiên ở bên trái.</T>
            </div>
          )}
          {!loading && docs.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {docs.map(doc => (
                <Card key={doc.id} pad={13} style={{ display:'flex', alignItems:'center', gap:13 }}>
                  <div style={{ width:38, height:38, borderRadius:9, flexShrink:0, background: W.panel,
                    border:`1px solid ${W.line2}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Ico name={isImage({ name: doc.file_name, type: doc.mime_type }) ? 'image' : 'doc'} s={16} c={W.ink3} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:600 }}>{doc.title}</div>
                    {doc.description && <T size={12} c={W.ink3} style={{ marginTop:2 }}>{doc.description}</T>}
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4 }}>
                      <T size={11} c={W.ink4} mono>{doc.file_name} · {formatSize(doc.file_size)}</T>
                      <T size={11} c={W.ink4}>· {fmtDate(doc.created_at)}</T>
                    </div>
                  </div>
                  <div role="button" onClick={() => handleEdit(doc)} style={{ cursor:'pointer', padding:6, display:'flex' }}>
                    <Ico name="edit" s={15} c={W.ink3} />
                  </div>
                  <div role="button" onClick={() => handleDelete(doc.id)} style={{ cursor:'pointer', padding:6, display:'flex' }}>
                    <Ico name="trash" s={15} c={W.late} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Shell>
  )
}

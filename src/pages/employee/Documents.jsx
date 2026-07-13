import { useState, useEffect } from 'react'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Ico, Skel } from '../../design-system'
import { fetchDocuments, fetchDocumentFile } from '../../store'
import { formatSize, isImage } from '../../submission'

function fmtDate(d) {
  const dt = new Date(d)
  return `${dt.getDate().toString().padStart(2,'0')}/${(dt.getMonth()+1).toString().padStart(2,'0')}/${dt.getFullYear()}`
}

function download(doc) {
  const data = doc.file_data || ''
  // Images / PDFs / etc. are stored as a data: URL. But .html/.htm uploads are
  // stored as raw markup (so they can be previewed in an iframe), which is NOT a
  // valid URL — using it as href downloads the SPA shell instead of the file.
  // Wrap raw content in a Blob so the real bytes (and the real name) are saved.
  const isUrl = /^(data:|blob:)/.test(data)
  const href = isUrl ? data : URL.createObjectURL(new Blob([data], { type: doc.mime_type || 'text/html' }))

  const a = document.createElement('a')
  a.href = href
  a.download = doc.file_name
  a.click()

  if (!isUrl) setTimeout(() => URL.revokeObjectURL(href), 0)
}

export default function Documents() {
  const [docs, setDocs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [q, setQ]             = useState('')
  const [downloadingId, setDownloadingId] = useState(null)
  const [downloadError, setDownloadError] = useState(null)

  useEffect(() => {
    fetchDocuments()
      .then(data => { setDocs(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const handleDownload = async (doc) => {
    setDownloadingId(doc.id)
    setDownloadError(null)
    try {
      const file = await fetchDocumentFile(doc.id)
      download({ ...doc, file_data: file.file_data })
    } catch (e) {
      setDownloadError(e.message)
    } finally {
      setDownloadingId(null)
    }
  }

  const filtered = docs.filter(d =>
    !q.trim() || d.title.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <Shell role="emp" title="Tài liệu" sub="Tài liệu tham khảo do quản lý chia sẻ — tải về xem bất cứ lúc nào">
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <input
          placeholder="Tìm tài liệu theo tên..."
          value={q} onChange={e => setQ(e.target.value)}
          style={{ width:320, border:`1px solid ${W.line}`, borderRadius:8, padding:'9px 12px',
            fontSize:13, fontFamily: W.font, outline:'none', color: W.ink, background:'#fff' }}
        />

        {loading && <Skel lines={5} gap={12} h={56} />}

        {!loading && error && (
          <Card pad={16} fill={W.lateSoft} line="transparent">
            <T size={13} c={W.late}>Không tải được tài liệu. Có thể bảng "documents" chưa được tạo trong Supabase (chạy supabase-documents.sql).</T>
          </Card>
        )}

        {downloadError && (
          <Card pad={16} fill={W.lateSoft} line="transparent">
            <T size={13} c={W.late}>Không tải được tệp: {downloadError}</T>
          </Card>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:10, color: W.ink3, padding:'60px 0' }}>
            <Ico name="folder" s={32} c={W.ink4} />
            <T size={13}>{docs.length === 0 ? 'Chưa có tài liệu nào được đăng.' : 'Không tìm thấy tài liệu phù hợp.'}</T>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {filtered.map(doc => (
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
                <Btn kind="soft" size="sm" icon={<Ico name="download" s={13}/>} disabled={downloadingId === doc.id}
                  onClick={() => handleDownload(doc)}>{downloadingId === doc.id ? 'Đang tải…' : 'Tải về'}</Btn>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Shell>
  )
}

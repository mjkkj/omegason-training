import { useState, useEffect } from 'react'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Ico, Skel } from '../../design-system'
import { fetchDocuments } from '../../store'
import { formatSize, isImage } from '../../submission'
import { useT } from '../../i18n'

function fmtDate(d) {
  const dt = new Date(d)
  return `${dt.getDate().toString().padStart(2,'0')}/${(dt.getMonth()+1).toString().padStart(2,'0')}/${dt.getFullYear()}`
}

function download(doc) {
  const a = document.createElement('a')
  a.href = doc.file_data
  a.download = doc.file_name
  a.click()
}

export default function Documents() {
  const t = useT()
  const [docs, setDocs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [q, setQ]             = useState('')

  useEffect(() => {
    fetchDocuments()
      .then(data => { setDocs(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const filtered = docs.filter(d =>
    !q.trim() || d.title.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <Shell role="emp" title={t('Tài liệu')} sub={t('Tài liệu tham khảo do quản lý chia sẻ — tải về xem bất cứ lúc nào')}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <input
          placeholder={t('Tìm tài liệu theo tên...')}
          value={q} onChange={e => setQ(e.target.value)}
          style={{ width:320, border:`1px solid ${W.line}`, borderRadius:8, padding:'9px 12px',
            fontSize:13, fontFamily: W.font, outline:'none', color: W.ink, background:'#fff' }}
        />

        {loading && <Skel lines={5} gap={12} h={56} />}

        {!loading && error && (
          <Card pad={16} fill={W.lateSoft} line="transparent">
            <T size={13} c={W.late}>{t('Không tải được tài liệu. Có thể bảng "documents" chưa được tạo trong Supabase (chạy supabase-documents.sql).')}</T>
          </Card>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:10, color: W.ink3, padding:'60px 0' }}>
            <Ico name="folder" s={32} c={W.ink4} />
            <T size={13}>{docs.length === 0 ? t('Chưa có tài liệu nào được đăng.') : t('Không tìm thấy tài liệu phù hợp.')}</T>
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
                <Btn kind="soft" size="sm" icon={<Ico name="download" s={13}/>} onClick={() => download(doc)}>{t('Tải về')}</Btn>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Shell>
  )
}

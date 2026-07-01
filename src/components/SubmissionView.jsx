import { W, Card, T, Ico } from '../design-system'
import { parseSubmission, isImage, isHtml, formatSize } from '../submission'
import { useT } from '../i18n'

// Renders a submission's content (text / images / files / links), handling
// the new structured format plus legacy HTML and plain-text submissions.
// `pad` controls outer padding; the component scrolls within its parent.
export default function SubmissionView({ sub, pad = 18 }) {
  const t = useT()
  const c = parseSubmission(sub)

  if (c.kind === 'empty') {
    return (
      <div style={{ padding: pad, color: W.ink3, fontSize: 13 }}>
        {t('Bài nộp này không có nội dung đính kèm')}{sub?.note ? t(' (xem ghi chú).') : '.'}
      </div>
    )
  }

  // Legacy full-page HTML report → keep the iframe experience.
  if (c.kind === 'html') {
    return <iframe srcDoc={c.html} sandbox="allow-same-origin"
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} />
  }

  return (
    <div style={{ padding: pad, overflowY: 'auto', height: '100%', display: 'flex',
      flexDirection: 'column', gap: 16, boxSizing: 'border-box' }}>

      {/* TEXT */}
      {c.text && (
        <div>
          <T size={11} mono c={W.ink3} mb={8}>{t('NỘI DUNG BÁO CÁO')}</T>
          <Card pad={14}>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: 13.5, lineHeight: 1.65, color: W.ink }}>{c.text}</div>
          </Card>
        </div>
      )}

      {/* FILES */}
      {c.files?.length > 0 && (
        <div>
          <T size={11} mono c={W.ink3} mb={8}>{t('TỆP ĐÍNH KÈM · ')}{c.files.length}</T>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {c.files.map((f, i) => (
              <FileBlock key={i} file={f} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* LINKS */}
      {c.links?.length > 0 && (
        <div>
          <T size={11} mono c={W.ink3} mb={8}>{t('LIÊN KẾT · ')}{c.links.length}</T>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {c.links.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}>
                <Card pad={11} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Ico name="link" s={15} c={W.acc} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    {l.label && <div style={{ fontSize: 13, fontWeight: 600, color: W.ink }}>{l.label}</div>}
                    <div style={{ fontSize: 11.5, color: W.acc, fontFamily: W.mono,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.url}</div>
                  </div>
                  <Ico name="chev" s={13} c={W.ink4} />
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FileBlock({ file, t }) {
  if (isImage(file) && file.data) {
    return (
      <Card pad={0} style={{ overflow: 'hidden' }}>
        <img src={file.data} alt={file.name}
          style={{ width: '100%', maxHeight: 420, objectFit: 'contain', display: 'block', background: W.panel }} />
        <div style={{ padding: '8px 12px', borderTop: `1px solid ${W.line2}`, display: 'flex',
          alignItems: 'center', gap: 8 }}>
          <Ico name="image" s={13} c={W.ink3} />
          <span style={{ fontSize: 12, fontWeight: 600, fontFamily: W.mono, flex: 1, overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
          <span style={{ fontSize: 11, color: W.ink3, fontFamily: W.mono }}>{formatSize(file.size)}</span>
        </div>
      </Card>
    )
  }

  if (isHtml(file) && file.html != null) {
    return (
      <Card pad={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '8px 12px', borderBottom: `1px solid ${W.line2}`, background: W.panel,
          display: 'flex', alignItems: 'center', gap: 8 }}>
          <Ico name="doc" s={13} c={W.acc} />
          <span style={{ fontSize: 12, fontWeight: 600, fontFamily: W.mono, flex: 1, overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
          <span style={{ fontSize: 11, color: W.ink3, fontFamily: W.mono }}>{formatSize(file.size)}</span>
        </div>
        <iframe srcDoc={file.html} sandbox="allow-same-origin"
          style={{ width: '100%', height: 300, border: 'none', display: 'block' }} />
      </Card>
    )
  }

  // Generic file → download chip.
  return (
    <Card pad={12} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <Ico name="doc" s={18} c={W.ink3} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, fontFamily: W.mono, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
        <T size={11} style={{ marginTop: 2 }}>{formatSize(file.size)}</T>
      </div>
      {file.data && (
        <a href={file.data} download={file.name}
          style={{ fontSize: 12, fontWeight: 600, color: W.acc, textDecoration: 'none' }}>{t('Tải về')}</a>
      )}
    </Card>
  )
}

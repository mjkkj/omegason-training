// Submission content helpers.
//
// A submission's `file_content` column stores one of:
//   - structured JSON  { __sub: 1, text, links[], files[] }  (new format)
//   - raw HTML string  (legacy reports / seed data)          → rendered in iframe
//   - plain text                                              → rendered as text
//
// Each file entry: { name, type, size, data?, html? }
//   data = base64 data URL (images, pdf, zip, …)
//   html = raw markup (for .html/.htm uploads, so we can preview in an iframe)

export const MAX_FILE_BYTES  = 4 * 1024 * 1024   // 4MB per file (raw)
export const MAX_TOTAL_BYTES = 12 * 1024 * 1024  // 12MB total (raw)

export function isImage(file) {
  return (file?.type || '').startsWith('image/') || !!file?.data?.startsWith?.('data:image/')
}

export function isHtml(file) {
  return file?.html != null || /\.(html?|htm)$/i.test(file?.name || '')
}

// Read a File object into a submission file entry (resolves async).
export function readFileEntry(f) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Không đọc được tệp'))
    const base = { name: f.name, type: f.type || '', size: f.size }
    if (/\.(html?|htm)$/i.test(f.name) || f.type === 'text/html') {
      reader.onload = (e) => resolve({ ...base, html: e.target.result })
      reader.readAsText(f, 'UTF-8')
    } else {
      reader.onload = (e) => resolve({ ...base, data: e.target.result })
      reader.readAsDataURL(f)
    }
  })
}

// Build the payload to store from composer state.
export function buildSubmission({ text, links, files }) {
  const cleanLinks = (links || []).filter(l => l.url?.trim()).map(l => ({ url: l.url.trim(), label: (l.label || '').trim() }))
  const payload = { __sub: 1, text: (text || '').trim(), links: cleanLinks, files: files || [] }
  const fileContent = JSON.stringify(payload)

  const parts = []
  if (payload.text)        parts.push('báo cáo')
  if (payload.files.length) parts.push(`${payload.files.length} tệp`)
  if (cleanLinks.length)    parts.push(`${cleanLinks.length} link`)
  const fileName = parts.length ? parts.join(' · ') : 'báo cáo'

  const fileSize = (payload.files.reduce((s, f) => s + (f.size || 0), 0)) || fileContent.length
  const isEmpty  = !payload.text && !payload.files.length && !cleanLinks.length
  return { fileName, fileContent, fileSize, isEmpty }
}

// Parse a stored submission back into a normalized shape for rendering / editing.
export function parseSubmission(sub) {
  const content = sub?.file_content
  if (!content) return { kind: 'empty', text: '', links: [], files: [] }
  try {
    const o = JSON.parse(content)
    if (o && o.__sub === 1) {
      return { kind: 'structured', text: o.text || '', links: o.links || [], files: o.files || [] }
    }
  } catch { /* not JSON — fall through */ }
  const trimmed = content.trimStart()
  if (trimmed.startsWith('<')) return { kind: 'html', html: content, text: '', links: [], files: [] }
  return { kind: 'text', text: content, links: [], files: [] }
}

export function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

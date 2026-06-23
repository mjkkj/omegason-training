import { useState, useEffect } from 'react'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Ico, Skel } from '../../design-system'
import { fetchTaskResources, saveTaskVideos } from '../../store'
import { TASKS, WEEKS } from '../../data'

export default function Training() {
  const [resources, setResources] = useState({})
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState('01')
  const [videos, setVideos]       = useState([])
  const [newUrl, setNewUrl]       = useState('')
  const [newTitle, setNewTitle]   = useState('')
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)

  useEffect(() => {
    fetchTaskResources().then(data => { setResources(data); setLoading(false) })
  }, [])

  useEffect(() => {
    setVideos(resources[selected] || [])
    setSaved(false)
  }, [selected, resources])

  const handleAdd = () => {
    if (!newUrl.trim()) return
    setVideos(v => [...v, { url: newUrl.trim(), title: newTitle.trim() || newUrl.trim() }])
    setNewUrl(''); setNewTitle(''); setSaved(false)
  }

  const handleRemove = (i) => { setVideos(v => v.filter((_, j) => j !== i)); setSaved(false) }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveTaskVideos(selected, videos)
      setResources(r => ({ ...r, [selected]: videos }))
      setSaved(true)
    } finally { setSaving(false) }
  }

  const task = TASKS.find(t => t.id === selected)
  const allWeeks = [...WEEKS, { wk: 'Capstone', taskIds: ['F'] }]

  return (
    <Shell role="mgr" title="Nội dung đào tạo" sub="Thêm video gợi ý cho từng task — nhân viên sẽ thấy ngay">
      <div style={{ display:'flex', gap:16, height:'100%' }}>

        {/* Left: task list */}
        <div style={{ width:240, flexShrink:0, overflowY:'auto', display:'flex', flexDirection:'column', gap:14 }}>
          {allWeeks.map(week => (
            <div key={week.wk}>
              <div style={{ fontSize:10, fontWeight:700, color:W.ink3, fontFamily:W.mono,
                letterSpacing:0.5, padding:'0 4px 6px' }}>{week.wk.toUpperCase()}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                {TASKS.filter(t => week.taskIds.includes(t.id)).map(t => {
                  const cnt     = (resources[t.id] || []).length
                  const isActive = t.id === selected
                  return (
                    <div key={t.id} onClick={() => setSelected(t.id)}
                      style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px',
                        borderRadius:8, cursor:'pointer',
                        background: isActive ? W.accSoft : 'transparent',
                        border:`1px solid ${isActive ? W.accLine : 'transparent'}` }}>
                      <div style={{ width:24, height:24, borderRadius:6, flexShrink:0,
                        background: isActive ? W.acc : W.panel, border:`1px solid ${isActive ? W.acc : W.line2}`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:10, fontWeight:800, color: isActive ? '#fff' : W.ink2, fontFamily:W.mono }}>
                        {t.id}
                      </div>
                      <span style={{ fontSize:12.5, flex:1, color: isActive ? W.acc : W.ink,
                        fontWeight: isActive ? 600 : 400, overflow:'hidden',
                        textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.name}</span>
                      {cnt > 0 && (
                        <span style={{ fontSize:10, background:W.done, color:'#fff',
                          borderRadius:10, padding:'1px 6px', fontFamily:W.mono, flexShrink:0 }}>{cnt}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right: edit panel */}
        <Card pad={20} style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:16 }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:W.ink, color:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:15, fontWeight:800, fontFamily:W.mono, flexShrink:0 }}>{selected}</div>
            <div style={{ flex:1 }}>
              <H size={15}>{task?.name}</H>
              <T size={12} c={W.ink3}>{videos.length} video đã thêm</T>
            </div>
            <Btn kind={saved ? 'soft' : 'solid'} size="sm" disabled={saving} onClick={handleSave}>
              {saving ? 'Đang lưu…' : saved ? '✓ Đã lưu' : 'Lưu thay đổi'}
            </Btn>
          </div>

          {/* Add new */}
          <Card pad={14} fill={W.panel} line={W.line2}>
            <T size={11} mono c={W.ink3} mb={10}>THÊM VIDEO MỚI</T>
            <div style={{ display:'flex', gap:8 }}>
              <input
                placeholder="Dán URL YouTube hoặc link video..."
                value={newUrl} onChange={e => setNewUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                style={{ flex:2, border:`1px solid ${W.line}`, borderRadius:8, padding:'9px 12px',
                  fontSize:13, fontFamily:W.font, outline:'none', color:W.ink, background:'#fff' }}
              />
              <input
                placeholder="Tiêu đề (tuỳ chọn)"
                value={newTitle} onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                style={{ flex:1, border:`1px solid ${W.line}`, borderRadius:8, padding:'9px 12px',
                  fontSize:13, fontFamily:W.font, outline:'none', color:W.ink, background:'#fff' }}
              />
              <Btn kind="solid" size="sm" icon={<Ico name="plus" s={13} c="#fff"/>} onClick={handleAdd}>Thêm</Btn>
            </div>
          </Card>

          {/* Video list */}
          {loading ? <Skel lines={3} gap={12} h={48} /> : videos.length === 0 ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', gap:10, color:W.ink3 }}>
              <Ico name="play" s={32} c={W.ink4} />
              <T size={13}>Chưa có video nào. Thêm URL bên trên rồi bấm Lưu.</T>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8, flex:1, overflowY:'auto' }}>
              {videos.map((v, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12,
                  padding:'12px 14px', borderRadius:8, border:`1px solid ${W.line2}`, background:'#fff' }}>
                  <Ico name="play" s={16} c={W.acc} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:600, overflow:'hidden',
                      textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.title}</div>
                    <div style={{ fontSize:11, color:W.ink3, fontFamily:W.mono, marginTop:2,
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.url}</div>
                  </div>
                  <div role="button" onClick={() => handleRemove(i)}
                    style={{ cursor:'pointer', padding:4, borderRadius:6,
                      display:'flex', alignItems:'center', color:W.ink3 }}>
                    <Ico name="x" s={14} c={W.late} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Shell>
  )
}

import { useState, useEffect } from 'react'
import Shell from '../../components/Shell'
import { W, Card, T, Btn, Tag, Stat, Ico, Avatar, Skel } from '../../design-system'
import { fetchAllUsers, updateUserRole, useStore } from '../../store'
import { ROLES, ROLE_LABEL } from '../../roles'

const TIER_TAG = {
  [ROLES.OWNER]:      { tone: 'late',   label: ROLE_LABEL[ROLES.OWNER] },
  [ROLES.SUPERVISOR]: { tone: 'acc',    label: ROLE_LABEL[ROLES.SUPERVISOR] },
  [ROLES.EMPLOYEE]:   { tone: 'done',   label: ROLE_LABEL[ROLES.EMPLOYEE] },
}

export default function Roles() {
  const { currentUser } = useStore()
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ]             = useState('')
  const [busyId, setBusyId]   = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [err, setErr]         = useState('')

  const load = () => fetchAllUsers().then(d => { setUsers(d); setLoading(false) })
  useEffect(() => { load() }, [])

  const changeRole = async (user, role) => {
    setErr('')
    setBusyId(user.id)
    try {
      await updateUserRole(user.id, role)
      await load()
      setConfirmId(null)
    } catch (e) {
      if (e.message === 'RLS_BLOCKED') {
        setErr('Cập nhật bị Supabase RLS chặn (0 dòng thay đổi). Hãy mở Supabase → SQL Editor và chạy file "supabase-roles.sql" trong repo để thêm policy cho phép Owner đổi quyền, rồi thử lại.')
      } else {
        setErr(`Không đổi được quyền: ${e.message || e}`)
      }
    } finally {
      setBusyId(null)
    }
  }

  const owners      = users.filter(u => u.role === ROLES.OWNER)
  const supervisors  = users.filter(u => u.role === ROLES.SUPERVISOR)
  const employees    = users.filter(u => u.role === ROLES.EMPLOYEE)

  const term = q.trim().toLowerCase()
  const matches = (u) => !term || (u.name || '').toLowerCase().includes(term) || (u.email || '').toLowerCase().includes(term)

  const renderRow = (u, i) => {
    const isSelf = u.id === currentUser?.id
    const busy   = busyId === u.id
    const asking = confirmId === u.id
    const tag    = TIER_TAG[u.role] || TIER_TAG[ROLES.EMPLOYEE]

    // Owner chỉ quản lý Supervisor <-> Employee. Owner không thể tự đổi quyền
    // và không có thao tác tạo/đổi Owner khác qua UI (xem PRD: chuyển giao Owner nằm ngoài phạm vi).
    const canToggle = !isSelf && u.role !== ROLES.OWNER

    return (
      <div key={u.id} style={{ display:'flex', alignItems:'center', padding:'13px 16px',
        borderTop: i ? `1px solid ${W.line2}` : 'none', background:'#fff' }}>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
          <Avatar s={36} txt={u.initials || '?'} />
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:13.5, fontWeight:600, display:'flex', alignItems:'center', gap:7 }}>
              {u.name || 'Người dùng'}
              {isSelf && <Tag tone="line">Bạn</Tag>}
            </div>
            <div style={{ fontSize:11.5, color: W.ink3, overflow:'hidden',
              textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email || '—'}</div>
          </div>
        </div>

        <div style={{ width:120 }}>
          <Tag tone={tag.tone}>{tag.label}</Tag>
        </div>

        <div style={{ width:230, display:'flex', justifyContent:'flex-end', gap:8 }}>
          {!canToggle ? (
            <T size={11.5} c={W.ink4}>{isSelf ? 'Không thể tự đổi quyền' : 'Owner do hệ thống quản lý'}</T>
          ) : asking ? (
            <>
              <Btn kind="ghost" size="sm" disabled={busy}
                onClick={() => setConfirmId(null)}>Hủy</Btn>
              <Btn kind={u.role === ROLES.SUPERVISOR ? 'danger' : 'solid'} size="sm" disabled={busy}
                onClick={() => changeRole(u, u.role === ROLES.SUPERVISOR ? ROLES.EMPLOYEE : ROLES.SUPERVISOR)}>
                {busy ? 'Đang lưu…' : u.role === ROLES.SUPERVISOR ? 'Xác nhận hạ quyền' : 'Xác nhận nâng quyền'}
              </Btn>
            </>
          ) : u.role === ROLES.SUPERVISOR ? (
            <Btn kind="ghost" size="sm" icon={<Ico name="user" s={14} c={W.ink2} />}
              onClick={() => { setErr(''); setConfirmId(u.id) }}>Hạ về nhân viên</Btn>
          ) : (
            <Btn kind="soft" size="sm" icon={<Ico name="shield" s={14} c={W.acc} />}
              onClick={() => { setErr(''); setConfirmId(u.id) }}>Nâng lên Supervisor</Btn>
          )}
        </div>
      </div>
    )
  }

  const renderGroup = (label, list, hint) => {
    const rows = list.filter(matches)
    if (term && rows.length === 0) return null
    return (
      <Card pad={0}>
        <div style={{ display:'flex', alignItems:'baseline', gap:8, padding:'10px 16px', background: W.panel,
          borderBottom:`1px solid ${W.line2}` }}>
          <div style={{ fontSize:10.5, fontWeight:700, color: W.ink3, letterSpacing:0.3, fontFamily: W.mono }}>
            {label.toUpperCase()} ({list.length})
          </div>
          <div style={{ flex:1 }} />
          <div style={{ fontSize:11, color: W.ink4 }}>{hint}</div>
        </div>
        {rows.length === 0 ? (
          <div style={{ padding:'20px 16px', textAlign:'center', color: W.ink3, fontSize:12.5 }}>Không có tài khoản.</div>
        ) : rows.map(renderRow)}
      </Card>
    )
  }

  return (
    <Shell role="mgr" title="Phân quyền" sub="Owner quản lý cấp Supervisor; Supervisor quản lý nội dung và Employee.">
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div style={{ display:'flex', gap:12 }}>
          <Stat n={users.length}       label="Tổng tài khoản" />
          <Stat n={owners.length}      label="Owner"      tone={W.late} />
          <Stat n={supervisors.length} label="Supervisor" tone={W.acc} />
          <Stat n={employees.length}   label="Nhân viên"  tone={W.done} />
        </div>

        {err && (
          <Card pad={12} fill={W.lateSoft} line="transparent">
            <T size={12.5} c={W.late}>{err}</T>
          </Card>
        )}

        <Card pad={12} style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Ico name="search" s={15} c={W.ink3} />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Tìm theo tên hoặc email…"
            style={{ flex:1, border:'none', outline:'none', fontSize:13, color: W.ink,
              fontFamily: W.font, background:'transparent' }} />
        </Card>

        {loading ? <Skel lines={6} gap={14} /> : (
          <>
            {renderGroup('Owner', owners, 'Toàn quyền hệ thống — không đổi qua UI')}
            {renderGroup('Supervisor', supervisors, 'Quản trị nội dung, chấm bài, xem báo cáo')}
            {renderGroup('Nhân viên', employees, 'Chỉ thấy & nộp bài của chính mình')}
          </>
        )}

        <T size={11.5} c={W.ink3}>
          Owner là cấp cao nhất, toàn quyền hệ thống kể cả quản lý Supervisor. Supervisor được Owner cấp quyền quản trị
          nội dung đào tạo, chấm bài và xem báo cáo, nhưng không thể đổi quyền tài khoản. Nhân viên chỉ truy cập dữ liệu
          của chính mình. Hãy cân nhắc kỹ khi nâng/hạ quyền Supervisor.
        </T>
      </div>
    </Shell>
  )
}

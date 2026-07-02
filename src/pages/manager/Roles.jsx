import { useState, useEffect } from 'react'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Stat, Ico, Avatar, Skel } from '../../design-system'
import { fetchAllUsers, updateUserRole, deleteUserAccount, useStore } from '../../store'

export default function Roles() {
  const { currentUser } = useStore()
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ]             = useState('')
  const [busyId, setBusyId]   = useState(null)   // id đang xử lý
  const [confirmId, setConfirmId] = useState(null) // id đang chờ xác nhận đổi quyền
  const [delId, setDelId]     = useState(null)   // id đang chờ xác nhận xoá
  const [err, setErr]         = useState('')

  const load = () => fetchAllUsers().then(d => { setUsers(d); setLoading(false) })
  useEffect(() => { load() }, [])

  const changeRole = async (user, role) => {
    setErr('')
    setBusyId(user.id)
    try {
      await updateUserRole(user.id, role)
      // Reload từ DB để chắc chắn thay đổi đã ghi (không cập nhật "lạc quan").
      await load()
      setConfirmId(null)
    } catch (e) {
      if (e.message === 'RLS_BLOCKED') {
        setErr('Cập nhật bị Supabase RLS chặn (0 dòng thay đổi). Hãy mở Supabase → SQL Editor và chạy file "supabase-roles.sql" trong repo để thêm policy cho phép quản lý đổi quyền, rồi thử lại.')
      } else {
        setErr(`Không đổi được quyền: ${e.message || e}`)
      }
    } finally {
      setBusyId(null)
    }
  }

  const removeUser = async (user) => {
    setErr('')
    setBusyId(user.id)
    try {
      await deleteUserAccount(user.id)
      await load()
      setDelId(null)
    } catch (e) {
      if (e.message === 'RLS_BLOCKED') {
        setErr('Xoá bị Supabase RLS chặn (0 dòng thay đổi). Hãy mở Supabase → SQL Editor và chạy file "supabase-roles.sql" trong repo để thêm policy cho phép quản lý xoá tài khoản, rồi thử lại.')
      } else {
        setErr(`Không xoá được tài khoản: ${e.message || e}`)
      }
    } finally {
      setBusyId(null)
    }
  }

  const managers = users.filter(u => u.role === 'manager')
  const employees = users.filter(u => u.role !== 'manager')

  const term = q.trim().toLowerCase()
  const rows = users.filter(u =>
    !term || (u.name || '').toLowerCase().includes(term) || (u.email || '').toLowerCase().includes(term)
  )

  return (
    <Shell role="mgr" title="Phân quyền" sub="Nâng/hạ quyền hoặc xoá tài khoản đã đăng ký">
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ display:'flex', gap:12 }}>
          <Stat n={users.length}      label="Tổng tài khoản" />
          <Stat n={managers.length}   label="Quản lý"   tone={W.acc} />
          <Stat n={employees.length}  label="Nhân viên" tone={W.done} />
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
          <Card pad={0}>
            <div style={{ display:'flex', alignItems:'center', padding:'10px 16px', background: W.panel,
              borderBottom:`1px solid ${W.line2}`, fontSize:10.5, fontWeight:700, color: W.ink3,
              letterSpacing:0.3, fontFamily: W.mono }}>
              <div style={{ flex:1 }}>TÀI KHOẢN</div>
              <div style={{ width:120 }}>QUYỀN HIỆN TẠI</div>
              <div style={{ width:300, textAlign:'right' }}>THAO TÁC</div>
            </div>

            {rows.length === 0 && (
              <div style={{ padding:'40px 16px', textAlign:'center', color: W.ink3 }}>
                Không tìm thấy tài khoản nào.
              </div>
            )}

            {rows.map((u, i) => {
              const isSelf  = u.id === currentUser?.id
              const isMgr   = u.role === 'manager'
              const busy    = busyId === u.id
              const asking  = confirmId === u.id
              const asDel   = delId === u.id
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
                    {isMgr ? <Tag tone="acc">Quản lý</Tag> : <Tag tone="done">Nhân viên</Tag>}
                  </div>

                  <div style={{ width:300, display:'flex', justifyContent:'flex-end', gap:8 }}>
                    {isSelf ? (
                      <T size={11.5} c={W.ink4}>Không thể tự đổi quyền / xoá</T>
                    ) : asDel ? (
                      <>
                        <Btn kind="ghost" size="sm" disabled={busy}
                          onClick={() => setDelId(null)}>Hủy</Btn>
                        <Btn kind="danger" size="sm" disabled={busy}
                          icon={<Ico name="trash" s={14} c={W.late} />}
                          onClick={() => removeUser(u)}>
                          {busy ? 'Đang xoá…' : 'Xác nhận xoá tài khoản'}
                        </Btn>
                      </>
                    ) : asking ? (
                      <>
                        <Btn kind="ghost" size="sm" disabled={busy}
                          onClick={() => setConfirmId(null)}>Hủy</Btn>
                        <Btn kind={isMgr ? 'danger' : 'solid'} size="sm" disabled={busy}
                          onClick={() => changeRole(u, isMgr ? 'employee' : 'manager')}>
                          {busy ? 'Đang lưu…' : isMgr ? 'Xác nhận hạ quyền' : 'Xác nhận nâng quyền'}
                        </Btn>
                      </>
                    ) : (
                      <>
                        {isMgr ? (
                          <Btn kind="ghost" size="sm" icon={<Ico name="user" s={14} c={W.ink2} />}
                            onClick={() => { setErr(''); setDelId(null); setConfirmId(u.id) }}>Hạ về nhân viên</Btn>
                        ) : (
                          <Btn kind="soft" size="sm" icon={<Ico name="shield" s={14} c={W.acc} />}
                            onClick={() => { setErr(''); setDelId(null); setConfirmId(u.id) }}>Nâng lên quản lý</Btn>
                        )}
                        <Btn kind="danger" size="sm" icon={<Ico name="trash" s={14} c={W.late} />}
                          onClick={() => { setErr(''); setConfirmId(null); setDelId(u.id) }}>Xoá</Btn>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </Card>
        )}

        <T size={11.5} c={W.ink3}>
          Quản lý có toàn quyền chấm bài, xem tiến độ và quản trị nội dung đào tạo. Hãy cân nhắc khi nâng quyền.
          Xoá tài khoản sẽ xoá hồ sơ và bài nộp liên quan (không hoàn tác được); bản ghi đăng nhập cần xoá thêm ở Supabase → Authentication.
        </T>
      </div>
    </Shell>
  )
}

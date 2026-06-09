import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { W, Card, H, T, Btn, Avatar, Ico } from '../design-system'
import { useStore } from '../store'
import { EMPLOYEES, MANAGER } from '../data'

export default function Login() {
  const navigate = useNavigate()
  const login = useStore(s => s.login)
  const [selectedRole, setSelectedRole] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  const handleLogin = () => {
    if (!selectedUser) return
    login({ ...selectedUser, role: selectedRole === 'manager' ? 'manager' : 'employee' })
    navigate(selectedRole === 'manager' ? '/mgr/stats' : '/emp/roadmap')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#f0eee9', display:'flex', alignItems:'center',
      justifyContent:'center', fontFamily: W.font, padding:24 }}>

      {/* bg grid */}
      <div style={{ position:'fixed', inset:0, backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0H0v60' fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1'/%3E%3C/svg%3E")`, backgroundSize:'60px 60px', pointerEvents:'none' }} />

      <div style={{ position:'relative', width:'100%', maxWidth:480 }}>
        {/* logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:48, height:48, borderRadius:14, background: W.ink, color:'#fff',
            display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:800, marginBottom:12 }}>O</div>
          <H size={24} weight={700} style={{ textAlign:'center', marginBottom:4 }}>Omegason Training</H>
          <T size={13.5} style={{ textAlign:'center' }}>Hệ thống quản lý đào tạo nhân viên</T>
        </div>

        <Card pad={0} r={14} style={{ boxShadow:'0 8px 40px rgba(0,0,0,.12)' }}>
          {/* step 1: role */}
          <div style={{ padding:'24px 24px 20px' }}>
            <T size={11} mono c={W.ink3} mb={14} style={{ letterSpacing:0.5 }}>ĐĂNG NHẬP VỚI VAI TRÒ</T>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { id:'employee', icon:'user', label:'Nhân viên', sub:'Xem lộ trình & nộp bài' },
                { id:'manager',  icon:'chart', label:'Quản lý',   sub:'Theo dõi & chấm bài' },
              ].map(r => {
                const sel = selectedRole === r.id
                return (
                  <div key={r.id} role="button" onClick={() => { setSelectedRole(r.id); setSelectedUser(null) }}
                    style={{ padding:'16px 14px', borderRadius:10, cursor:'pointer', transition:'all .15s',
                      border:`1.5px solid ${sel ? W.acc : W.line}`,
                      background: sel ? W.accSoft : W.paper }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <Ico name={r.icon} s={16} c={sel ? W.acc : W.ink3} />
                      <div style={{ fontSize:14, fontWeight:700, color: sel ? W.acc : W.ink }}>{r.label}</div>
                    </div>
                    <T size={11.5} c={sel ? W.acc : W.ink3}>{r.sub}</T>
                  </div>
                )
              })}
            </div>
          </div>

          {/* step 2: user */}
          {selectedRole && (
            <div style={{ padding:'0 24px 20px', borderTop:`1px solid ${W.line2}`, paddingTop:20 }}>
              <T size={11} mono c={W.ink3} mb={14} style={{ letterSpacing:0.5 }}>
                {selectedRole === 'manager' ? 'TÀI KHOẢN QUẢN LÝ' : 'CHỌN NHÂN VIÊN'}
              </T>

              {selectedRole === 'manager' ? (
                <div role="button" onClick={() => setSelectedUser(MANAGER)}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:10,
                    cursor:'pointer', border:`1.5px solid ${selectedUser?.id === MANAGER.id ? W.acc : W.line}`,
                    background: selectedUser?.id === MANAGER.id ? W.accSoft : W.paper }}>
                  <Avatar s={40} txt="QL" />
                  <div>
                    <div style={{ fontSize:14, fontWeight:600 }}>{MANAGER.name}</div>
                    <T size={12} c={W.ink3}>{MANAGER.email}</T>
                  </div>
                  {selectedUser?.id === MANAGER.id && (
                    <div style={{ marginLeft:'auto' }}><Ico name="check" s={16} c={W.acc} /></div>
                  )}
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {EMPLOYEES.map(emp => (
                    <div key={emp.id} role="button" onClick={() => setSelectedUser(emp)}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:10,
                        cursor:'pointer', transition:'all .15s',
                        border:`1.5px solid ${selectedUser?.id === emp.id ? W.acc : W.line}`,
                        background: selectedUser?.id === emp.id ? W.accSoft : W.paper }}>
                      <Avatar s={36} txt={emp.initials} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13.5, fontWeight:600 }}>{emp.name}</div>
                        <T size={11.5} c={W.ink3}>{emp.email}</T>
                      </div>
                      {selectedUser?.id === emp.id && <Ico name="check" s={15} c={W.acc} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* login button */}
          <div style={{ padding:'16px 24px', borderTop:`1px solid ${W.line2}` }}>
            <Btn kind="solid" size="lg" full disabled={!selectedUser} onClick={handleLogin}>
              Vào hệ thống
            </Btn>
          </div>
        </Card>

        <T size={11} c={W.ink4} style={{ textAlign:'center', marginTop:16 }}>
          Dữ liệu lưu trên máy · phiên bản demo
        </T>
      </div>
    </div>
  )
}

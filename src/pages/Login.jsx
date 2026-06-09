import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { W, Card, H, T, Btn, Ico } from '../design-system'
import { useStore } from '../store'

export default function Login() {
  const navigate = useNavigate()
  const { login, signup, currentUser } = useStore()

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [done, setDone]         = useState(false) // signup confirmation

  // Already logged in → redirect
  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'manager' ? '/mgr/stats' : '/emp/roadmap', { replace: true })
    }
  }, [currentUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        // currentUser is set inside login(); useEffect will redirect
        return
      } else {
        if (!name.trim()) throw new Error('Vui lòng nhập họ tên')
        await signup(email, password, name.trim())
        setDone(true)
      }
    } catch (err) {
      const msg = err.message || 'Có lỗi xảy ra'
      if (msg.includes('Invalid login')) setError('Email hoặc mật khẩu không đúng')
      else if (msg.includes('already registered')) setError('Email này đã được đăng ký')
      else if (msg.includes('Password should')) setError('Mật khẩu phải ít nhất 6 ký tự')
      else setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div style={{ minHeight:'100vh', background:'#f0eee9', display:'flex', alignItems:'center',
      justifyContent:'center', fontFamily: W.font, padding:24 }}>
      <Card pad={32} r={14} style={{ maxWidth:400, width:'100%', textAlign:'center',
        boxShadow:'0 8px 40px rgba(0,0,0,.12)' }}>
        <div style={{ width:56, height:56, borderRadius:16, background: W.doneSoft,
          margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Ico name="check" s={28} c={W.done} sw={2.5} />
        </div>
        <H size={20} mb={10}>Đăng ký thành công!</H>
        <T size={13.5} mb={20}>
          Kiểm tra hộp thư <b>{email}</b> để xác nhận tài khoản, sau đó quay lại đăng nhập.
        </T>
        <Btn kind="solid" size="md" full onClick={() => { setMode('login'); setDone(false) }}>
          Đăng nhập
        </Btn>
      </Card>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#f0eee9', display:'flex', alignItems:'center',
      justifyContent:'center', fontFamily: W.font, padding:24 }}>
      <div style={{ position:'fixed', inset:0, backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0H0v60' fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1'/%3E%3C/svg%3E")`, backgroundSize:'60px 60px', pointerEvents:'none' }} />

      <div style={{ position:'relative', width:'100%', maxWidth:420 }}>
        {/* logo */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:48, height:48, borderRadius:14, background: W.ink, color:'#fff',
            display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:800, marginBottom:12 }}>O</div>
          <H size={22} weight={700} style={{ textAlign:'center', marginBottom:4 }}>Omegason Training</H>
          <T size={13} style={{ textAlign:'center' }}>
            {mode === 'login' ? 'Đăng nhập để tiếp tục' : 'Tạo tài khoản nhân viên mới'}
          </T>
        </div>

        <Card pad={0} r={14} style={{ boxShadow:'0 8px 40px rgba(0,0,0,.12)' }}>
          {/* tabs */}
          <div style={{ display:'flex', borderBottom:`1px solid ${W.line2}` }}>
            {[['login','Đăng nhập'],['signup','Đăng ký']].map(([m, label]) => (
              <div key={m} role="button" onClick={() => { setMode(m); setError(null) }}
                style={{ flex:1, padding:'14px 0', textAlign:'center', cursor:'pointer',
                  fontSize:13.5, fontWeight: mode === m ? 700 : 500,
                  color: mode === m ? W.acc : W.ink2,
                  borderBottom: mode === m ? `2px solid ${W.acc}` : '2px solid transparent',
                  transition:'all .15s' }}>
                {label}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
            {mode === 'signup' && (
              <div>
                <div style={{ fontSize:12, fontWeight:600, color: W.ink2, marginBottom:6 }}>Họ và tên</div>
                <input
                  type="text" required placeholder="Nguyễn Văn An"
                  value={name} onChange={e => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <div style={{ fontSize:12, fontWeight:600, color: W.ink2, marginBottom:6 }}>Email</div>
              <input
                type="email" required placeholder="ten@omegason.vn"
                value={email} onChange={e => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <div style={{ fontSize:12, fontWeight:600, color: W.ink2, marginBottom:6 }}>Mật khẩu</div>
              <input
                type="password" required placeholder={mode === 'signup' ? 'Ít nhất 6 ký tự' : '••••••••'}
                value={password} onChange={e => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            {error && (
              <div style={{ background: W.lateSoft, border:`1px solid ${W.late}55`, borderRadius:8,
                padding:'10px 14px', fontSize:13, color: W.late }}>
                {error}
              </div>
            )}

            <Btn kind="solid" size="lg" full disabled={loading} style={{ marginTop:4 }}
              onClick={handleSubmit}>
              {loading ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </Btn>
          </form>
        </Card>

        {mode === 'login' && (
          <T size={11.5} c={W.ink3} style={{ textAlign:'center', marginTop:14 }}>
            Chưa có tài khoản? Bấm <b style={{ cursor:'pointer', color: W.acc }}
              onClick={() => { setMode('signup'); setError(null) }}>Đăng ký</b> hoặc liên hệ quản lý.
          </T>
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  width:'100%', border:`1px solid ${W.line}`, borderRadius:8, background:'#fff',
  padding:'10px 13px', fontSize:13.5, color: W.ink, fontFamily: W.font,
  outline:'none', boxSizing:'border-box', transition:'border-color .15s',
}

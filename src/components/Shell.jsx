import { Link, useLocation, useNavigate } from 'react-router-dom'
import { W, Avatar, Ico } from '../design-system'
import { useStore } from '../store'

const EMP_NAV = [
  { ic:'home',  label:'Tổng quan',       path:'/emp/progress' },
  { ic:'grid',  label:'Lộ trình',        path:'/emp/roadmap' },
  { ic:'cal',   label:'Lịch nộp',        path:'/emp/schedule' },
  { ic:'doc',   label:'Bài nộp của tôi', path:'/emp/submit' },
];
const MGR_NAV = [
  { ic:'chart',  label:'Thống kê',       path:'/mgr/stats' },
  { ic:'grid',   label:'Bảng tiến độ',   path:'/mgr/matrix' },
  { ic:'inbox',  label:'Hàng chờ chấm',  path:'/mgr/queue' },
  { ic:'user',   label:'Nhân viên',      path:'/mgr/employees' },
  { ic:'play',   label:'Nội dung đào tạo', path:'/mgr/training' },
];

function getActiveIdx(nav, pathname) {
  // Match by prefix of first 3 path segments
  for (let i = nav.length - 1; i >= 0; i--) {
    const base = '/' + nav[i].path.split('/').slice(1, 3).join('/');
    if (pathname.startsWith(base)) return i;
  }
  return 0;
}

export default function Shell({ role = 'emp', title, sub, actions, children, pad = 26, body = W.panel }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useStore();
  const nav = role === 'emp' ? EMP_NAV : MGR_NAV;
  const active = getActiveIdx(nav, location.pathname);
  const pendingCount = 0;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const roleTxt = role === 'emp' ? 'Nhân viên' : 'Quản lý';

  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', background: W.paper, overflow:'hidden',
      fontFamily: W.font }}>
      {/* sidebar */}
      <div style={{ width:198, flexShrink:0, borderRight:`1px solid ${W.line2}`,
        background: W.paper, display:'flex', flexDirection:'column', padding:'18px 14px' }}>

        {/* logo */}
        <div style={{ display:'flex', alignItems:'center', gap:9, padding:'0 6px 16px' }}>
          <div style={{ width:26, height:26, borderRadius:7, background: W.ink, color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800 }}>O</div>
          <div>
            <div style={{ fontSize:13.5, fontWeight:700, lineHeight:1, fontFamily: W.font }}>Omegason</div>
            <div style={{ fontSize:9.5, color: W.ink3, marginTop:2, fontFamily: W.mono, letterSpacing:0.5 }}>TRAINING</div>
          </div>
        </div>

        <div style={{ height:1, background: W.line2, margin:'0 4px 12px' }} />

        <div style={{ fontSize:10, fontWeight:700, color: W.ink4, letterSpacing:0.5,
          padding:'0 8px 8px', fontFamily: W.mono }}>{roleTxt.toUpperCase()}</div>

        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {nav.map((n, i) => {
            const isActive = active === i;
            const badge = role === 'mgr' && n.ic === 'inbox' && pendingCount > 0 ? pendingCount : null;
            return (
              <Link key={i} to={n.path} style={{ textDecoration:'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px',
                  borderRadius:8, fontSize:13.5, fontWeight: isActive ? 600 : 500,
                  color: isActive ? W.acc : W.ink2,
                  background: isActive ? W.accSoft : 'transparent',
                  transition:'background .15s, color .15s' }}>
                  <Ico name={n.ic} s={16} c={isActive ? W.acc : W.ink3} />
                  <span style={{ flex:1 }}>{n.label}</span>
                  {badge && (
                    <span style={{ background: W.warn, color:'#fff', fontSize:10, fontWeight:700,
                      borderRadius:10, padding:'1px 6px', fontFamily: W.mono }}>{badge}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* user footer */}
        <div style={{ marginTop:'auto', borderTop:`1px solid ${W.line2}`, paddingTop:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 8px' }}>
            <Avatar s={30} txt={currentUser?.initials || (role === 'emp' ? 'NV' : 'QL')} />
            <div style={{ minWidth:0, flex:1 }}>
              <div style={{ fontSize:12.5, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden',
                textOverflow:'ellipsis', fontFamily: W.font }}>
                {currentUser?.name || (role === 'emp' ? 'Nhân viên' : 'Quản lý')}
              </div>
              <div style={{ fontSize:10.5, color: W.ink3, fontFamily: W.font }}>
                {role === 'emp' ? 'NV mới · Tuần 2' : 'Quản lý đào tạo'}
              </div>
            </div>
            <div role="button" onClick={handleLogout} title="Đăng xuất"
              style={{ cursor:'pointer', color: W.ink3, display:'flex', padding:4, borderRadius:6,
                transition:'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = W.panel2}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Ico name="logout" s={15} c={W.ink3} />
            </div>
          </div>
        </div>
      </div>

      {/* main area */}
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', background: body }}>
        {/* topbar */}
        <div style={{ height:60, flexShrink:0, borderBottom:`1px solid ${W.line2}`, background: W.paper,
          display:'flex', alignItems:'center', padding:'0 24px', gap:16 }}>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:16, fontWeight:700, color: W.ink, letterSpacing:-0.2, lineHeight:1.2, fontFamily: W.font }}>{title}</div>
            {sub && <div style={{ fontSize:11.5, color: W.ink3, marginTop:1, fontFamily: W.font }}>{sub}</div>}
          </div>
          <div style={{ flex:1 }} />
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>{actions}</div>
        </div>

        {/* content */}
        <div style={{ flex:1, minHeight:0, overflowY:'auto', padding: pad }}>
          {children}
        </div>
      </div>
    </div>
  );
}

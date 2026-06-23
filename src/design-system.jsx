// Design tokens and primitives — ported from wf-kit.jsx wireframe.
export const W = {
  font: '"Space Grotesk", system-ui, sans-serif',
  mono: '"Space Mono", ui-monospace, monospace',
  ink:   '#1f1d1b',
  ink2:  '#6c6862',
  ink3:  '#9c978f',
  ink4:  '#bdb8b0',
  paper: '#ffffff',
  panel: '#f5f4f1',
  panel2:'#eceae6',
  line:  '#d9d6d0',
  line2: '#e8e6e1',
  acc:    'oklch(0.52 0.11 254)',
  accSoft:'oklch(0.95 0.03 254)',
  accLine:'oklch(0.82 0.06 254)',
  done:   'oklch(0.58 0.10 156)',
  doneSoft:'oklch(0.95 0.035 156)',
  late:   'oklch(0.57 0.16 27)',
  lateSoft:'oklch(0.95 0.045 27)',
  warn:   'oklch(0.70 0.11 70)',
  warnSoft:'oklch(0.95 0.05 78)',
};

export function Skel({ lines = 3, w = ['100%','92%','70%'], h = 7, gap = 9, c = W.line2, style }) {
  const arr = Array.from({ length: lines }, (_, i) => Array.isArray(w) ? w[i % w.length] : w);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap, ...style }}>
      {arr.map((ww, i) => (
        <div key={i} style={{ width: ww, height: h, borderRadius: h, background: c }} />
      ))}
    </div>
  );
}

export function Ph({ label = 'image', w = '100%', h = 120, r = 4, style, dark }) {
  const stripe = dark
    ? 'repeating-linear-gradient(135deg,#e7e4df 0 10px,#efedea 10px 20px)'
    : 'repeating-linear-gradient(135deg,#efedea 0 11px,#f6f5f2 11px 22px)';
  return (
    <div style={{ width: w, height: h, borderRadius: r, background: stripe,
      border: `1px solid ${W.line2}`, display:'flex', alignItems:'center', justifyContent:'center', ...style }}>
      <span style={{ fontSize:11, color: W.ink3, letterSpacing:0.2, fontFamily: W.mono,
        background:'rgba(255,255,255,.65)', padding:'2px 7px', borderRadius:3 }}>{label}</span>
    </div>
  );
}

export function Card({ children, pad = 16, r = 8, fill = W.paper, line = W.line, style, onLine = true }) {
  return (
    <div style={{ background: fill, border: onLine ? `1px solid ${line}` : 'none',
      borderRadius: r, padding: pad, ...style }}>{children}</div>
  );
}

export function H({ children, size = 18, weight = 600, c = W.ink, mb = 0, style }) {
  return <div style={{ fontSize: size, fontWeight: weight, color: c, letterSpacing: -0.2,
    marginBottom: mb, lineHeight: 1.2, ...style }}>{children}</div>;
}

export function T({ children, size = 13, weight = 400, c = W.ink2, mb = 0, mono, style }) {
  return <div style={{ fontSize: size, fontWeight: weight, color: c, marginBottom: mb,
    lineHeight: 1.45, fontFamily: mono ? W.mono : W.font, ...style }}>{children}</div>;
}

export function Btn({ children, kind = 'solid', size = 'md', icon, full, style, onClick, disabled }) {
  const pads = { sm:'6px 11px', md:'9px 15px', lg:'12px 20px' };
  const fs   = { sm:12, md:13, lg:15 };
  const base = { display:'inline-flex', alignItems:'center', justifyContent:'center',
    gap:7, padding: pads[size], fontSize: fs[size], fontWeight:600, borderRadius:7,
    fontFamily: W.font, cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace:'nowrap',
    width: full ? '100%' : 'auto', transition:'opacity .15s', opacity: disabled ? 0.5 : 1 };
  const kinds = {
    solid:  { background: W.acc, color:'#fff', border:'1px solid transparent' },
    soft:   { background: W.accSoft, color: W.acc, border:`1px solid ${W.accLine}` },
    ghost:  { background:'transparent', color: W.ink, border:`1px solid ${W.line}` },
    dark:   { background: W.ink, color:'#fff', border:'1px solid transparent' },
    quiet:  { background:'transparent', color: W.ink2, border:'1px solid transparent' },
    danger: { background: W.lateSoft, color: W.late, border:`1px solid ${W.late}` },
  };
  return (
    <div role="button" style={{ ...base, ...kinds[kind], ...style }} onClick={disabled ? undefined : onClick}>
      {icon}{children}
    </div>
  );
}

export function Tag({ children, tone = 'neutral', style }) {
  const tones = {
    neutral:{ bg: W.panel, fg: W.ink2, bd: W.line },
    acc:    { bg: W.accSoft, fg: W.acc, bd: W.accLine },
    done:   { bg: W.doneSoft, fg: W.done, bd:'transparent' },
    late:   { bg: W.lateSoft, fg: W.late, bd:'transparent' },
    warn:   { bg: W.warnSoft, fg: W.warn, bd:'transparent' },
    line:   { bg:'transparent', fg: W.ink2, bd: W.line },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11.5, fontWeight:600,
      color: t.fg, background: t.bg, border:`1px solid ${t.bd}`, padding:'3px 9px', borderRadius:20,
      letterSpacing:0.1, whiteSpace:'nowrap', fontFamily: W.font, ...style }}>{children}</span>
  );
}

export function Dot({ tone = 'neutral', size = 9 }) {
  const map = { neutral: W.ink4, acc: W.acc, done: W.done, late: W.late, warn: W.warn, empty:'transparent' };
  return <span style={{ width: size, height: size, borderRadius: size,
    background: map[tone], border: tone === 'empty' ? `1.5px solid ${W.line}` : 'none',
    display:'inline-block', flexShrink:0 }} />;
}

export function Bar({ pct = 50, h = 8, c = W.acc, track = W.panel2, style }) {
  return (
    <div style={{ width:'100%', height: h, borderRadius: h, background: track, overflow:'hidden', ...style }}>
      <div style={{ width: Math.min(100, Math.max(0, pct)) + '%', height:'100%', background: c, borderRadius: h,
        transition:'width .4s ease' }} />
    </div>
  );
}

export function Ring({ pct = 60, size = 86, stroke = 9, c = W.acc, track = W.panel2, label, sub }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  return (
    <div style={{ position:'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C*(1-Math.min(100,Math.max(0,pct))/100)}
          transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontSize: size*0.26, fontWeight:700, color: W.ink, lineHeight:1, fontFamily: W.font }}>{label}</div>
        {sub && <div style={{ fontSize:10, color: W.ink3, fontFamily: W.font }}>{sub}</div>}
      </div>
    </div>
  );
}

export function Check({ on, label, sub, style, onClick }) {
  return (
    <div onClick={onClick} style={{ display:'flex', alignItems: sub ? 'flex-start' : 'center', gap:10, ...style }}>
      <div style={{ width:18, height:18, borderRadius:5, flexShrink:0, marginTop: sub ? 1 : 0,
        border:`1.5px solid ${on ? W.acc : W.line}`, background: on ? W.acc : '#fff',
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        {on && <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5.8l2.2 2.2L9 2.5"/></svg>}
      </div>
      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:13, color: on ? W.ink2 : W.ink, fontWeight:500, fontFamily: W.font,
          textDecoration: on ? 'line-through' : 'none', textDecorationColor: W.ink4 }}>{label}</div>
        {sub && <div style={{ fontSize:11.5, color: W.ink3, marginTop:2, fontFamily: W.font }}>{sub}</div>}
      </div>
    </div>
  );
}

export function Avatar({ s = 36, txt = 'NV', tone, style }) {
  return <div style={{ width: s, height: s, borderRadius: s, flexShrink:0,
    background: tone || W.panel2, border:`1px solid ${W.line}`, color: W.ink2,
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize: s*0.36, fontWeight:700, fontFamily: W.font, ...style }}>{txt}</div>;
}

export function Field({ label, children, h = 38, style, ph }) {
  return (
    <div style={style}>
      {label && <div style={{ fontSize:12, fontWeight:600, color: W.ink2, marginBottom:6, fontFamily: W.font }}>{label}</div>}
      {children || (
        <div style={{ height: h, border:`1px solid ${W.line}`, borderRadius:7, background:'#fff',
          display:'flex', alignItems:'center', padding:'0 12px', fontSize:13, color: W.ink3, fontFamily: W.font }}>{ph}</div>
      )}
    </div>
  );
}

export function Divider({ style, vertical }) {
  return vertical
    ? <div style={{ width:1, alignSelf:'stretch', background: W.line2, ...style }} />
    : <div style={{ height:1, width:'100%', background: W.line2, ...style }} />;
}

export function Note({ children, style }) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:6, ...style }}>
      <span style={{ width:14, height:14, borderRadius:14, background: W.warn, color:'#fff',
        fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>i</span>
      <span style={{ fontSize:11, color: W.ink2, fontFamily: W.mono }}>{children}</span>
    </div>
  );
}

export function Stat({ n, label, tone, sub, style }) {
  return (
    <Card pad={15} style={{ flex:1, minWidth:0, ...style }}>
      <div style={{ fontSize:27, fontWeight:700, color: tone || W.ink, lineHeight:1, letterSpacing:-0.5, fontFamily: W.font }}>{n}</div>
      <div style={{ fontSize:12, color: W.ink2, marginTop:7, fontWeight:500, fontFamily: W.font }}>{label}</div>
      {sub && <div style={{ fontSize:11, color: W.ink3, marginTop:3, fontFamily: W.font }}>{sub}</div>}
    </Card>
  );
}

export function Ico({ name, s = 16, c = 'currentColor', sw = 1.6 }) {
  const p = { width:s, height:s, viewBox:'0 0 16 16', fill:'none',
    stroke:c, strokeWidth:sw, strokeLinecap:'round', strokeLinejoin:'round' };
  const paths = {
    home:   <path d="M2.5 7L8 2.5 13.5 7M4 6.5V13h8V6.5"/>,
    grid:   <><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/></>,
    list:   <><path d="M5 4h8M5 8h8M5 12h8"/><circle cx="2.5" cy="4" r=".6" fill={c}/><circle cx="2.5" cy="8" r=".6" fill={c}/><circle cx="2.5" cy="12" r=".6" fill={c}/></>,
    cal:    <><rect x="2.5" y="3" width="11" height="10.5" rx="1.5"/><path d="M2.5 6h11M5.5 2v2.5M10.5 2v2.5"/></>,
    doc:    <><path d="M4 2.5h5L12 5.5V13.5H4z"/><path d="M9 2.5V6h3"/></>,
    up:     <><path d="M8 11V3.5M5 6l3-2.5L11 6"/><path d="M3 12.5h10"/></>,
    chart:  <><path d="M2.5 13.5V2.5M2.5 13.5h11"/><rect x="4.5" y="8" width="2" height="3.5"/><rect x="8" y="5.5" width="2" height="6"/><rect x="11.5" y="9.5" width="2" height="2"/></>,
    user:   <><circle cx="8" cy="5.5" r="2.6"/><path d="M3.5 13c.7-2.4 2.4-3.5 4.5-3.5s3.8 1.1 4.5 3.5"/></>,
    inbox:  <><path d="M2.5 8.5L4 3.5h8l1.5 5M2.5 8.5v4h11v-4M2.5 8.5h3l1 1.5h3l1-1.5h3"/></>,
    play:   <><circle cx="8" cy="8" r="6"/><path d="M6.5 5.5l4 2.5-4 2.5z" fill={c}/></>,
    clock:  <><circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.3"/></>,
    bell:   <><path d="M5 7a3 3 0 016 0c0 3 1.2 4 1.2 4H3.8S5 10 5 7z"/><path d="M6.8 13a1.4 1.4 0 002.4 0"/></>,
    search: <><circle cx="7" cy="7" r="4"/><path d="M10 10l3 3"/></>,
    filter: <path d="M2.5 3.5h11l-4.2 5v4l-2.6 1.3v-5.3z"/>,
    chev:   <path d="M6 4l4 4-4 4"/>,
    chevL:  <path d="M10 4L6 8l4 4"/>,
    check:  <path d="M3 8.5l3 3 7-7"/>,
    plus:   <path d="M8 3v10M3 8h10"/>,
    star:   <path d="M8 2.5l1.6 3.4 3.7.4-2.8 2.5.8 3.6L8 10.9 4.7 12.9l.8-3.6L2.7 6.7l3.7-.4z"/>,
    flag:   <><path d="M4 2.5v11"/><path d="M4 3h7l-1.5 2.5L11 8H4z"/></>,
    logout: <><path d="M6 3H3.5A1 1 0 002.5 4v8a1 1 0 001 1H6M10 11l3-3-3-3M13 8H7"/></>,
    edit:   <><path d="M11.5 2.5a1.41 1.41 0 012 2L5 13 2 14l1-3z"/></>,
    eye:    <><path d="M1.5 8s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5S1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></>,
    trash:  <><path d="M3 4h10M5 4V2.5h6V4M4.5 4l.5 9h6l.5-9"/></>,
    x:      <path d="M4 4l8 8M12 4l-8 8"/>,
    link:   <><path d="M6.5 9.5a2.5 2.5 0 003.5 0l2-2a2.5 2.5 0 00-3.5-3.5l-1 1"/><path d="M9.5 6.5a2.5 2.5 0 00-3.5 0l-2 2a2.5 2.5 0 003.5 3.5l1-1"/></>,
    image:  <><rect x="2.5" y="3" width="11" height="10" rx="1.5"/><circle cx="6" cy="6.5" r="1.1"/><path d="M3 11.5l3-2.5 2.5 2 2-1.5 2.5 2.5"/></>,
    text:   <><path d="M3.5 4h9M3.5 7h9M3.5 10h6"/></>,
  };
  return <svg {...p}>{paths[name] || paths.doc}</svg>;
}

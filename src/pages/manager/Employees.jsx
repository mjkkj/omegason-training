import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Bar, Stat, Ico, Avatar } from '../../design-system'
import { useStore } from '../../store'
import { TASKS, EMPLOYEES } from '../../data'

export default function Employees() {
  const { submissions } = useStore()
  const now = new Date()

  const rows = EMPLOYEES.map(emp => {
    const mySubs = submissions.filter(s => s.employeeId === emp.id)
    const graded  = mySubs.filter(s => s.status === 'graded')
    const pending = mySubs.filter(s => s.status === 'pending')
    const pct = Math.round((graded.length / TASKS.length) * 100)
    const hasLate = TASKS.some(t => {
      const sub = mySubs.find(s => s.taskId === t.id)
      return !sub && now > new Date(t.deadline)
    })
    const avgGrade = graded.length
      ? Math.round((graded.reduce((s, x) => s + (x.grade || 0), 0) / graded.length) * 10) / 10
      : null
    return { ...emp, pct, hasLate, pending: pending.length, graded: graded.length, avgGrade }
  }).sort((a, b) => b.pct - a.pct)

  return (
    <Shell role="mgr" active={3} title="Danh sách nhân viên" sub={`${EMPLOYEES.length} người đang đào tạo`}>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {/* summary stats */}
        <div style={{ display:'flex', gap:12 }}>
          <Stat n={EMPLOYEES.length} label="Đang đào tạo" />
          <Stat n={rows.filter(r => r.hasLate).length} label="Có task trễ" tone={W.late} />
          <Stat n={rows.filter(r => r.pending > 0).length} label="Có bài chờ chấm" tone={W.warn} />
          <Stat n={`${Math.round(rows.reduce((s,r) => s + r.pct, 0) / rows.length)}%`} label="TB tiến độ" tone={W.acc} />
        </div>

        <Card pad={0}>
          {/* table header */}
          <div style={{ display:'flex', alignItems:'center', padding:'10px 16px', background: W.panel,
            borderBottom:`1px solid ${W.line2}`, fontSize:10.5, fontWeight:700, color: W.ink3,
            letterSpacing:0.3, fontFamily: W.mono }}>
            <div style={{ flex:1 }}>NHÂN VIÊN</div>
            <div style={{ width:140 }}>TIẾN ĐỘ</div>
            <div style={{ width:80 }}>ĐIỂM TB</div>
            <div style={{ width:100 }}>TRẠNG THÁI</div>
            <div style={{ width:100 }} />
          </div>

          {rows.map((emp, i) => (
            <div key={emp.id} style={{ display:'flex', alignItems:'center', padding:'13px 16px',
              borderTop: i ? `1px solid ${W.line2}` : 'none',
              background: emp.hasLate ? W.lateSoft : '#fff', transition:'background .12s' }}
              onMouseEnter={e => { if (!emp.hasLate) e.currentTarget.style.background = W.panel }}
              onMouseLeave={e => { e.currentTarget.style.background = emp.hasLate ? W.lateSoft : '#fff' }}>

              <div style={{ flex:1, display:'flex', alignItems:'center', gap:12 }}>
                <Avatar s={36} txt={emp.initials} />
                <div>
                  <div style={{ fontSize:13.5, fontWeight:600 }}>{emp.name}</div>
                  <div style={{ fontSize:11.5, color: W.ink3 }}>{emp.email}</div>
                </div>
              </div>

              <div style={{ width:140 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Bar pct={emp.pct} h={7} style={{ flex:1 }}
                    c={emp.hasLate ? W.late : emp.pct >= 80 ? W.done : W.acc} />
                  <span style={{ fontSize:12, fontWeight:700, fontFamily: W.mono, width:35 }}>{emp.pct}%</span>
                </div>
                <div style={{ fontSize:10.5, color: W.ink3, marginTop:3 }}>
                  {emp.graded}/{TASKS.length} task
                </div>
              </div>

              <div style={{ width:80, fontSize:14, fontWeight:700,
                color: emp.avgGrade ? W.done : W.ink4, fontFamily: W.mono }}>
                {emp.avgGrade ?? '—'}
              </div>

              <div style={{ width:100 }}>
                {emp.hasLate ? <Tag tone="late">Trễ hạn</Tag>
                  : emp.pending > 0 ? <Tag tone="warn">{emp.pending} chờ chấm</Tag>
                  : <Tag tone="done">Đúng tiến độ</Tag>}
              </div>

              <div style={{ width:100, display:'flex', justifyContent:'flex-end', gap:6 }}>
                <Link to={`/mgr/employee/${emp.id}`}>
                  <Btn kind="ghost" size="sm">Hồ sơ</Btn>
                </Link>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </Shell>
  )
}

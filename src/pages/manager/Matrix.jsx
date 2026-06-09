import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Bar, Ico, Avatar } from '../../design-system'
import { useStore } from '../../store'
import { TASKS, EMPLOYEES } from '../../data'

const TASK_COLS = [...TASKS.map(t => t.id)]

function cellStatus(empId, taskId, submissions) {
  const sub = submissions.find(s => s.employeeId === empId && s.taskId === taskId)
  if (!sub) {
    const task = TASKS.find(t => t.id === taskId)
    if (task && new Date() > new Date(task.deadline)) return 'late-miss'
    return 'empty'
  }
  if (sub.status === 'graded') return 'done'
  if (sub.status === 'pending') return 'review'
  if (sub.status === 'revision') return 'revision'
  return 'empty'
}

function MxCell({ status, size = 26 }) {
  const map = {
    done:      { bg: W.doneSoft, fg: W.done, ch:'✓' },
    review:    { bg: W.warnSoft, fg: W.warn, ch:'◷' },
    revision:  { bg: W.lateSoft, fg: W.late, ch:'↩' },
    'late-miss':{ bg: W.lateSoft, fg: W.late, ch:'!' },
    empty:     { bg: W.paper, fg: W.ink4, ch:'' },
  }
  const s = map[status] || map.empty
  return (
    <div style={{ width: size, height: size, borderRadius:6, background: s.bg,
      border: status === 'empty' ? `1px solid ${W.line2}` : 'none',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:11, fontWeight:700, color: s.fg }}>{s.ch}</div>
  )
}

export default function Matrix() {
  const { submissions } = useStore()
  const now = new Date()

  const rows = EMPLOYEES.map(emp => {
    const cells = TASK_COLS.map(tid => cellStatus(emp.id, tid, submissions))
    const doneCount = cells.filter(c => c === 'done').length
    const pct = Math.round((doneCount / TASK_COLS.length) * 100)
    const hasLate = cells.some(c => c === 'late-miss')
    const isTop   = pct >= 80
    return { ...emp, cells, pct, hasLate, isTop }
  }).sort((a, b) => b.pct - a.pct)

  const pending = submissions.filter(s => s.status === 'pending').length

  return (
    <Shell role="mgr" active={1} title="Bảng tiến độ · Nhân viên × Task" sub={`${EMPLOYEES.length} nhân viên · ${TASKS.length - 1} task + final`}
      body={W.paper}
      actions={
        <>
          <Link to="/mgr/queue">
            {pending > 0 && <Tag tone="warn">{pending} bài chờ chấm</Tag>}
          </Link>
          <Btn kind="ghost" size="sm" icon={<Ico name="filter" s={13}/>}>Lọc</Btn>
        </>
      }>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {/* legend */}
        <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
          {[
            ['done','Đã chấm'],['review','Chờ chấm'],['revision','Cần sửa'],['late-miss','Trễ hạn'],['empty','Chưa làm'],
          ].map(([t, l]) => (
            <div key={t} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <MxCell status={t} size={16} />
              <span style={{ fontSize:11.5, color: W.ink2 }}>{l}</span>
            </div>
          ))}
        </div>

        {/* matrix table */}
        <Card pad={0} style={{ overflow:'auto' }}>
          {/* header */}
          <div style={{ display:'flex', alignItems:'center', padding:'10px 14px', background: W.panel,
            borderBottom:`1px solid ${W.line2}`, position:'sticky', top:0, zIndex:1 }}>
            <div style={{ width:168, fontSize:11, fontWeight:700, color: W.ink3, fontFamily: W.mono }}>NHÂN VIÊN</div>
            <div style={{ flex:1, display:'flex', gap:4, minWidth:0 }}>
              {TASK_COLS.map(t => (
                <div key={t} style={{ width:26, textAlign:'center', fontSize:10.5, fontWeight:700,
                  color: t === 'F' ? W.acc : t === '10' ? W.warn : W.ink3, fontFamily: W.mono, flexShrink:0 }}>{t}</div>
              ))}
            </div>
            <div style={{ width:100, textAlign:'right', fontSize:11, fontWeight:700, color: W.ink3, fontFamily: W.mono }}>TIẾN ĐỘ</div>
          </div>

          {rows.map((emp, i) => (
            <Link key={emp.id} to={`/mgr/employee/${emp.id}`} style={{ textDecoration:'none', display:'block' }}>
              <div style={{ display:'flex', alignItems:'center', padding:'9px 14px',
                borderTop: i ? `1px solid ${W.line2}` : 'none',
                background: emp.hasLate ? W.lateSoft : '#fff',
                transition:'background .12s', cursor:'pointer' }}
                onMouseEnter={e => { if (!emp.hasLate) e.currentTarget.style.background = W.panel }}
                onMouseLeave={e => { e.currentTarget.style.background = emp.hasLate ? W.lateSoft : '#fff' }}>

                <div style={{ width:168, display:'flex', alignItems:'center', gap:9 }}>
                  <Avatar s={26} txt={emp.initials} />
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden',
                      textOverflow:'ellipsis', color: W.ink }}>{emp.name}</div>
                    {emp.hasLate && <div style={{ fontSize:9.5, color: W.late, fontWeight:600 }}>Có task trễ</div>}
                    {emp.isTop  && <div style={{ fontSize:9.5, color: W.done, fontWeight:600 }}>Dẫn đầu</div>}
                  </div>
                </div>

                <div style={{ flex:1, display:'flex', gap:4 }}>
                  {emp.cells.map((c, j) => <MxCell key={j} status={c} />)}
                </div>

                <div style={{ width:100, display:'flex', alignItems:'center', gap:7, justifyContent:'flex-end' }}>
                  <Bar pct={emp.pct} h={6} style={{ width:50 }}
                    c={emp.hasLate ? W.late : emp.isTop ? W.done : W.acc} />
                  <span style={{ fontSize:11, fontWeight:700, width:32, textAlign:'right',
                    fontFamily: W.mono }}>{emp.pct}%</span>
                </div>
              </div>
            </Link>
          ))}
        </Card>
      </div>
    </Shell>
  )
}

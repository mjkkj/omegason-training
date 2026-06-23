import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Bar, Ico, Avatar, Skel } from '../../design-system'
import { fetchAllSubmissions, fetchAllProfiles } from '../../store'
import { TASKS, calcDeadline } from '../../data'

const TASK_IDS = TASKS.map(t => t.id)

function cellStatus(empId, taskId, subs, startDate) {
  const sub = subs.find(s => s.employee_id === empId && s.task_id === taskId)
  if (!sub) {
    const task = TASKS.find(t => t.id === taskId)
    return task && new Date() > new Date(calcDeadline(task, startDate)) ? 'late-miss' : 'empty'
  }
  return sub.status === 'graded' ? 'done' : sub.status === 'pending' ? 'review' : sub.status === 'revision' ? 'revision' : 'empty'
}

function MxCell({ status }) {
  const map = {
    done:      { bg: W.doneSoft, fg: W.done, ch:'✓' },
    review:    { bg: W.warnSoft, fg: W.warn, ch:'◷' },
    revision:  { bg: W.lateSoft, fg: W.late, ch:'↩' },
    'late-miss':{ bg: W.lateSoft, fg: W.late, ch:'!' },
    empty:     { bg: W.paper,    fg: W.ink4,  ch:'' },
  }
  const s = map[status] || map.empty
  return (
    <div style={{ width:26, height:26, borderRadius:6, background: s.bg, flexShrink:0,
      border: status==='empty'?`1px solid ${W.line2}`:'none',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:11, fontWeight:700, color: s.fg }}>{s.ch}</div>
  )
}

export default function Matrix() {
  const [employees, setEmployees] = useState([])
  const [subs, setSubs]           = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([fetchAllProfiles(), fetchAllSubmissions()]).then(([emps, s]) => {
      setEmployees(emps); setSubs(s); setLoading(false)
    })
  }, [])

  const rows = employees.map(emp => {
    const cells   = TASK_IDS.map(tid => cellStatus(emp.id, tid, subs, emp.start_date))
    const done    = cells.filter(c=>c==='done').length
    const pct     = Math.round((done/TASK_IDS.length)*100)
    const hasLate = cells.some(c=>c==='late-miss')
    return { ...emp, cells, pct, hasLate }
  }).sort((a,b) => b.pct - a.pct)

  const pending = subs.filter(s=>s.status==='pending').length

  return (
    <Shell role="mgr" title="Bảng tiến độ" sub={`${employees.length} nhân viên × ${TASKS.length} task`}
      body={W.paper}
      actions={<>{pending>0&&<Link to="/mgr/queue"><Tag tone="warn">{pending} chờ chấm</Tag></Link>}</>}>

      {loading ? <Skel lines={8} gap={14} /> : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {[['done','Đã chấm'],['review','Chờ chấm'],['revision','Cần sửa'],['late-miss','Trễ hạn'],['empty','Chưa làm']].map(([t,l]) => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <MxCell status={t} /><span style={{ fontSize:11.5, color: W.ink2 }}>{l}</span>
              </div>
            ))}
          </div>

          <Card pad={0} style={{ overflow:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', padding:'10px 14px',
              background: W.panel, borderBottom:`1px solid ${W.line2}`, position:'sticky', top:0, zIndex:1 }}>
              <div style={{ width:168, fontSize:11, fontWeight:700, color: W.ink3, fontFamily: W.mono }}>NHÂN VIÊN</div>
              <div style={{ flex:1, display:'flex', gap:4 }}>
                {TASK_IDS.map(t => (
                  <div key={t} style={{ width:26, textAlign:'center', fontSize:10.5, fontWeight:700, flexShrink:0,
                    color: t==='F'?W.acc:(t==='04'||t==='08')?W.warn:W.ink3, fontFamily: W.mono }}>{t}</div>
                ))}
              </div>
              <div style={{ width:100, textAlign:'right', fontSize:11, fontWeight:700, color: W.ink3, fontFamily: W.mono }}>TIẾN ĐỘ</div>
            </div>

            {rows.length === 0 && (
              <div style={{ padding:'32px 16px', textAlign:'center', color: W.ink3 }}>
                Chưa có nhân viên nào. Nhắn nhân viên đăng ký tại app.
              </div>
            )}

            {rows.map((emp, i) => (
              <Link key={emp.id} to={`/mgr/employee/${emp.id}`} style={{ textDecoration:'none', display:'block' }}>
                <div style={{ display:'flex', alignItems:'center', padding:'9px 14px',
                  borderTop:i?`1px solid ${W.line2}`:'none',
                  background: emp.hasLate ? W.lateSoft : '#fff', transition:'background .12s', cursor:'pointer' }}
                  onMouseEnter={e=>{ if(!emp.hasLate) e.currentTarget.style.background=W.panel }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=emp.hasLate?W.lateSoft:'#fff' }}>
                  <div style={{ width:168, display:'flex', alignItems:'center', gap:9 }}>
                    <Avatar s={26} txt={emp.initials} />
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden',
                        textOverflow:'ellipsis', color: W.ink }}>{emp.name}</div>
                      {emp.hasLate && <div style={{ fontSize:9.5, color: W.late, fontWeight:600 }}>Có task trễ</div>}
                    </div>
                  </div>
                  <div style={{ flex:1, display:'flex', gap:4 }}>
                    {emp.cells.map((c,j) => <MxCell key={j} status={c} />)}
                  </div>
                  <div style={{ width:100, display:'flex', alignItems:'center', gap:7, justifyContent:'flex-end' }}>
                    <Bar pct={emp.pct} h={6} style={{ width:50 }} c={emp.hasLate?W.late:emp.pct>=80?W.done:W.acc} />
                    <span style={{ fontSize:11, fontWeight:700, width:32, textAlign:'right', fontFamily: W.mono }}>{emp.pct}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </Card>
        </div>
      )}
    </Shell>
  )
}

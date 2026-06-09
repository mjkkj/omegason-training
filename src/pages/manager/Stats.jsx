import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Bar, Stat, Ico, Avatar, Skel } from '../../design-system'
import { fetchAllSubmissions, fetchAllProfiles } from '../../store'
import { TASKS, WEEKS } from '../../data'

export default function Stats() {
  const [employees, setEmployees] = useState([])
  const [subs, setSubs]           = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([fetchAllProfiles(), fetchAllSubmissions()]).then(([emps, s]) => {
      setEmployees(emps); setSubs(s); setLoading(false)
    })
  }, [])

  const empData = employees.map(emp => {
    const ms = subs.filter(s => s.employee_id === emp.id)
    const graded = ms.filter(s => s.status === 'graded')
    const pct = Math.round((graded.length / TASKS.length) * 100)
    const hasLate = TASKS.some(t => { const sub = ms.find(s=>s.task_id===t.id); return !sub && new Date()>new Date(t.deadline) })
    return { ...emp, pct, hasLate, pending: ms.filter(s=>s.status==='pending').length }
  })

  const avgPct      = empData.length ? Math.round(empData.reduce((s,e)=>s+e.pct,0)/empData.length) : 0
  const lateCount   = empData.filter(e=>e.hasLate).length
  const pendingTotal = subs.filter(s=>s.status==='pending').length
  const allGrades   = subs.filter(s=>s.status==='graded'&&s.grade!=null).map(s=>s.grade)
  const avgGrade    = allGrades.length ? Math.round((allGrades.reduce((a,b)=>a+b,0)/allGrades.length)*10)/10 : null

  const weekBars = WEEKS.map(w => {
    const possible = employees.length * w.taskIds.length
    const done = subs.filter(s=>w.taskIds.includes(s.task_id)&&s.status==='graded').length
    return { label: w.wk, pct: possible ? Math.round((done/possible)*100) : 0 }
  })
  weekBars.push({ label:'Final', pct: employees.length
    ? Math.round((subs.filter(s=>s.task_id==='F'&&s.status==='graded').length/employees.length)*100) : 0 })

  const lateEmps = empData.filter(e=>e.hasLate)
  const topEmps  = [...empData].sort((a,b)=>b.pct-a.pct)

  return (
    <Shell role="mgr" title="Thống kê đào tạo" sub="Toàn đội · dữ liệu thực"
      actions={pendingTotal>0 && (
        <Link to="/mgr/queue">
          <Btn kind="soft" size="sm" icon={<Ico name="inbox" s={14} c={W.warn}/>}>{pendingTotal} bài chờ</Btn>
        </Link>
      )}>

      {loading ? <Skel lines={6} gap={18} /> : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'flex', gap:12 }}>
            <Stat n={employees.length}  label="Nhân viên"        sub="đang đào tạo" />
            <Stat n={`${avgPct}%`}      label="Hoàn thành TB"    tone={W.acc} />
            <Stat n={lateCount}         label="Đang trễ hạn"     tone={lateCount?W.late:W.ink} sub={lateCount?'cần nhắc':'tốt!'} />
            <Stat n={pendingTotal}      label="Chờ chấm"         tone={pendingTotal?W.warn:W.ink} />
            <Stat n={avgGrade ?? '—'}   label="Điểm TB đội"      tone={W.done} sub="thang 10" />
          </div>

          <div style={{ display:'flex', gap:14 }}>
            <Card pad={18} style={{ flex:1 }}>
              <H size={14} mb={4}>Tỉ lệ hoàn thành theo tuần</H>
              <T size={11.5} mb={16} c={W.ink3}>% task đã chấm / tổng yêu cầu cả đội</T>
              <div style={{ display:'flex', alignItems:'flex-end', gap:16, height:160 }}>
                {weekBars.map(({label,pct},i) => (
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:8, height:'100%' }}>
                    <div style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end' }}>
                      <div style={{ width:'100%', height:(pct||2)+'%', minHeight:4,
                        background: i===0?W.done:W.acc, borderRadius:'6px 6px 0 0', position:'relative' }}>
                        <span style={{ position:'absolute', top:-20, left:0, right:0, textAlign:'center',
                          fontSize:11, fontWeight:700, color: W.ink2, fontFamily: W.mono }}>{pct}%</span>
                      </div>
                    </div>
                    <span style={{ fontSize:11.5, fontWeight:600, color: W.ink2 }}>{label}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ width:280, display:'flex', flexDirection:'column', gap:12 }}>
              <Card pad={16}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <Ico name="flag" s={15} c={W.late} />
                  <H size={14}>Đang trễ deadline</H>
                </div>
                {lateEmps.length===0
                  ? <T size={13} c={W.done}>Không ai đang trễ 🎉</T>
                  : lateEmps.map((emp,i) => {
                    const lateCnt = TASKS.filter(t=>{const s=subs.find(s=>s.employee_id===emp.id&&s.task_id===t.id);return !s&&new Date()>new Date(t.deadline)}).length
                    return (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0',
                        borderTop:i?`1px solid ${W.line2}`:'none' }}>
                        <Avatar s={28} txt={emp.initials} />
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12.5, fontWeight:600 }}>{emp.name}</div>
                          <div style={{ fontSize:10.5, color: W.late }}>{lateCnt} task trễ</div>
                        </div>
                        <Link to={`/mgr/employee/${emp.id}`}><Btn kind="ghost" size="sm">Xem</Btn></Link>
                      </div>
                    )
                  })
                }
              </Card>
              <Card pad={16} style={{ flex:1 }}>
                <H size={14} mb={12}>Dẫn đầu</H>
                {topEmps.slice(0,4).map((emp,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:i<3?12:0 }}>
                    <div style={{ fontSize:13, fontWeight:800, width:16, textAlign:'center',
                      color:i===0?W.done:W.ink3, fontFamily: W.mono }}>{i+1}</div>
                    <Avatar s={28} txt={emp.initials} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{emp.name}</div>
                      <Bar pct={emp.pct} h={4} style={{ marginTop:4 }} c={emp.hasLate?W.late:i===0?W.done:W.acc} />
                    </div>
                    <span style={{ fontSize:12, fontWeight:700, fontFamily: W.mono, color:emp.hasLate?W.late:W.done }}>{emp.pct}%</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      )}
    </Shell>
  )
}

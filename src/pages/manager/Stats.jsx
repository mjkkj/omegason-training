import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Bar, Stat, Ico, Avatar } from '../../design-system'
import { useStore } from '../../store'
import { TASKS, EMPLOYEES, WEEKS } from '../../data'

function calcPct(empId, submissions) {
  const total = TASKS.length
  const done  = submissions.filter(s => s.employeeId === empId && s.status === 'graded').length
  return Math.round((done / total) * 100)
}

function isLate(empId, submissions) {
  const now = new Date()
  return TASKS.some(task => {
    const sub = submissions.find(s => s.employeeId === empId && s.taskId === task.id)
    return !sub && now > new Date(task.deadline)
  })
}

export default function Stats() {
  const { submissions } = useStore()
  const now = new Date()

  const employeesWithData = EMPLOYEES.map(emp => ({
    ...emp,
    pct: calcPct(emp.id, submissions),
    late: isLate(emp.id, submissions),
    graded: submissions.filter(s => s.employeeId === emp.id && s.status === 'graded'),
    pending: submissions.filter(s => s.employeeId === emp.id && s.status === 'pending'),
  }))

  const avgPct = Math.round(employeesWithData.reduce((s, e) => s + e.pct, 0) / EMPLOYEES.length)
  const lateCount = employeesWithData.filter(e => e.late).length
  const pendingTotal = submissions.filter(s => s.status === 'pending').length

  const allGrades = submissions.filter(s => s.status === 'graded' && s.grade != null).map(s => s.grade)
  const avgGrade = allGrades.length
    ? Math.round((allGrades.reduce((a, b) => a + b, 0) / allGrades.length) * 10) / 10
    : null

  // Week completion rates
  const weekBars = WEEKS.map(w => {
    const wTasks = TASKS.filter(t => w.taskIds.includes(t.id))
    const possibleSubs = EMPLOYEES.length * wTasks.length
    const doneSubs = submissions.filter(s =>
      w.taskIds.includes(s.taskId) && s.status === 'graded'
    ).length
    return { label: w.wk, pct: Math.round((doneSubs / possibleSubs) * 100) }
  })
  // Add final
  const finalDone = submissions.filter(s => s.taskId === 'F' && s.status === 'graded').length
  weekBars.push({ label: 'Final', pct: Math.round((finalDone / EMPLOYEES.length) * 100) })

  const lateEmployees = employeesWithData.filter(e => e.late)
  const topEmployees = [...employeesWithData].sort((a, b) => b.pct - a.pct)

  return (
    <Shell role="mgr" active={0} title="Thống kê đào tạo" sub="Toàn đội · cập nhật thực tế"
      actions={
        <Link to="/mgr/queue">
          {pendingTotal > 0 && <Btn kind="soft" size="sm" icon={<Ico name="inbox" s={14} c={W.warn}/>}>
            {pendingTotal} bài chờ chấm
          </Btn>}
        </Link>
      }>

      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {/* KPI */}
        <div style={{ display:'flex', gap:12 }}>
          <Stat n={EMPLOYEES.length} label="Nhân viên" sub="đang đào tạo" />
          <Stat n={`${avgPct}%`} label="Hoàn thành TB" tone={W.acc} />
          <Stat n={lateCount} label="Đang trễ hạn" tone={lateCount ? W.late : W.ink} sub={lateCount ? 'cần nhắc' : 'tốt!'} />
          <Stat n={pendingTotal} label="Chờ chấm" tone={pendingTotal ? W.warn : W.ink} />
          <Stat n={avgGrade ?? '—'} label="Điểm TB đội" tone={W.done} sub="thang 10" />
        </div>

        <div style={{ display:'flex', gap:14 }}>
          {/* bar chart */}
          <Card pad={18} style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
            <H size={14} mb={4}>Tỉ lệ hoàn thành theo tuần</H>
            <T size={11.5} mb={16} c={W.ink3}>% đầu ra đã nộp trên tổng yêu cầu của cả đội</T>
            <div style={{ flex:1, display:'flex', alignItems:'flex-end', gap:16, minHeight:160 }}>
              {weekBars.map(({ label, pct }, i) => (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:8, height:'100%' }}>
                  <div style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end' }}>
                    <div style={{ width:'100%', height: (pct || 2) + '%', minHeight:4,
                      background: i === 0 ? W.done : W.acc, borderRadius:'6px 6px 0 0', position:'relative' }}>
                      <span style={{ position:'absolute', top:-20, left:0, right:0, textAlign:'center',
                        fontSize:11, fontWeight:700, color: W.ink2, fontFamily: W.mono }}>{pct}%</span>
                    </div>
                  </div>
                  <span style={{ fontSize:11.5, fontWeight:600, color: W.ink2 }}>{label}</span>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ width:280, flexShrink:0, display:'flex', flexDirection:'column', gap:12 }}>
            {/* late list */}
            <Card pad={16} style={{ flex: lateEmployees.length ? 0 : undefined }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <Ico name="flag" s={15} c={W.late} />
                <H size={14}>Đang trễ deadline</H>
              </div>
              {lateEmployees.length === 0 ? (
                <T size={13} c={W.done}>Không ai đang trễ 🎉</T>
              ) : (
                lateEmployees.map((emp, i) => {
                  const lateTasks = TASKS.filter(t => {
                    const sub = submissions.find(s => s.employeeId === emp.id && s.taskId === t.id)
                    return !sub && new Date() > new Date(t.deadline)
                  })
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0',
                      borderTop: i ? `1px solid ${W.line2}` : 'none' }}>
                      <Avatar s={28} txt={emp.initials} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12.5, fontWeight:600 }}>{emp.name}</div>
                        <div style={{ fontSize:10.5, color: W.late }}>{lateTasks.length} task trễ deadline</div>
                      </div>
                      <Link to={`/mgr/employee/${emp.id}`}>
                        <Btn kind="ghost" size="sm">Xem</Btn>
                      </Link>
                    </div>
                  )
                })
              )}
            </Card>

            {/* top performers */}
            <Card pad={16} style={{ flex:1 }}>
              <H size={14} mb={12}>Dẫn đầu</H>
              {topEmployees.slice(0, 4).map((emp, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom: i < 3 ? 12 : 0 }}>
                  <div style={{ fontSize:13, fontWeight:800, fontFamily: W.mono,
                    color: i === 0 ? W.done : W.ink3, width:16, textAlign:'center' }}>{i + 1}</div>
                  <Avatar s={28} txt={emp.initials} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{emp.name}</div>
                    <Bar pct={emp.pct} h={4} style={{ marginTop:4 }} c={emp.late ? W.late : i === 0 ? W.done : W.acc} />
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, fontFamily: W.mono,
                    color: emp.late ? W.late : W.done }}>{emp.pct}%</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  )
}

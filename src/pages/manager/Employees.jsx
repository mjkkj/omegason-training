import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Shell from '../../components/Shell'
import { W, Card, H, T, Btn, Tag, Bar, Stat, Ico, Avatar, Skel } from '../../design-system'
import { fetchAllSubmissions, fetchAllProfiles } from '../../store'
import { TASKS, calcDeadline } from '../../data'
import { overallScore, indexByTask } from '../../checklist'
import { useT } from '../../i18n'

export default function Employees() {
  const t = useT()
  const [employees, setEmployees] = useState([])
  const [subs, setSubs]           = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([fetchAllProfiles(), fetchAllSubmissions()]).then(([emps, s]) => {
      setEmployees(emps); setSubs(s); setLoading(false)
    })
  }, [])

  const now = new Date()
  const rows = employees.map(emp => {
    const ms      = subs.filter(s => s.employee_id === emp.id)
    const graded  = ms.filter(s => s.status === 'graded')
    const pending = ms.filter(s => s.status === 'pending')
    const pct     = Math.round((graded.length / TASKS.length) * 100)
    const hasLate = TASKS.some(t => { const sub=ms.find(s=>s.task_id===t.id); return !sub&&now>new Date(calcDeadline(t, emp.start_date)) })
    const score   = overallScore(indexByTask(ms))
    return { ...emp, pct, hasLate, pending: pending.length, graded: graded.length, score }
  }).sort((a,b)=>b.pct-a.pct)

  const avgPct = rows.length ? Math.round(rows.reduce((s,r)=>s+r.pct,0)/rows.length) : 0

  return (
    <Shell role="mgr" title={t('Danh sách nhân viên')} sub={`${employees.length}${t(' người đang đào tạo')}`}>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ display:'flex', gap:12 }}>
          <Stat n={employees.length}                   label={t('Đang đào tạo')} />
          <Stat n={rows.filter(r=>r.hasLate).length}   label={t('Có task trễ')}     tone={W.late} />
          <Stat n={rows.filter(r=>r.pending>0).length} label={t('Có bài chờ chấm')} tone={W.warn} />
          <Stat n={`${avgPct}%`}                       label={t('TB tiến độ')}       tone={W.acc} />
        </div>

        {loading ? <Skel lines={6} gap={14} /> : (
          <Card pad={0}>
            <div style={{ display:'flex', alignItems:'center', padding:'10px 16px', background: W.panel,
              borderBottom:`1px solid ${W.line2}`, fontSize:10.5, fontWeight:700, color: W.ink3,
              letterSpacing:0.3, fontFamily: W.mono }}>
              <div style={{ flex:1 }}>{t('NHÂN VIÊN')}</div>
              <div style={{ width:150 }}>{t('TIẾN ĐỘ')}</div>
              <div style={{ width:80 }}>{t('ĐIỂM %')}</div>
              <div style={{ width:130 }}>{t('TRẠNG THÁI')}</div>
              <div style={{ width:80 }} />
            </div>

            {rows.length === 0 && (
              <div style={{ padding:'40px 16px', textAlign:'center', color: W.ink3 }}>
                {t('Chưa có nhân viên. Nhân viên tự đăng ký tài khoản tại app rồi sẽ xuất hiện ở đây.')}
              </div>
            )}

            {rows.map((emp,i) => (
              <div key={emp.id} style={{ display:'flex', alignItems:'center', padding:'13px 16px',
                borderTop:i?`1px solid ${W.line2}`:'none',
                background: emp.hasLate ? W.lateSoft : '#fff' }}
                onMouseEnter={e=>{ if(!emp.hasLate) e.currentTarget.style.background=W.panel }}
                onMouseLeave={e=>{ e.currentTarget.style.background=emp.hasLate?W.lateSoft:'#fff' }}>
                <div style={{ flex:1, display:'flex', alignItems:'center', gap:12 }}>
                  <Avatar s={36} txt={emp.initials} />
                  <div>
                    <div style={{ fontSize:13.5, fontWeight:600 }}>{emp.name}</div>
                    <div style={{ fontSize:11.5, color: W.ink3 }}>{emp.email}</div>
                  </div>
                </div>
                <div style={{ width:150 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <Bar pct={emp.pct} h={7} style={{ flex:1 }}
                      c={emp.hasLate?W.late:emp.pct>=80?W.done:W.acc} />
                    <span style={{ fontSize:12, fontWeight:700, fontFamily: W.mono, width:35 }}>{emp.pct}%</span>
                  </div>
                  <div style={{ fontSize:10.5, color: W.ink3, marginTop:3 }}>{emp.graded}/{TASKS.length} {t('task')}</div>
                </div>
                <div style={{ width:80, fontSize:14, fontWeight:700, color: emp.score?W.done:W.ink4, fontFamily: W.mono }}>
                  {emp.score}%
                </div>
                <div style={{ width:130 }}>
                  {emp.hasLate   ? <Tag tone="late">{t('Trễ hạn')}</Tag>
                    : emp.pending>0 ? <Tag tone="warn">{emp.pending} {t('chờ chấm')}</Tag>
                    : <Tag tone="done">{t('Đúng tiến độ')}</Tag>}
                </div>
                <div style={{ width:80, display:'flex', justifyContent:'flex-end' }}>
                  <Link to={`/mgr/employee/${emp.id}`}><Btn kind="ghost" size="sm">{t('Hồ sơ')}</Btn></Link>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </Shell>
  )
}

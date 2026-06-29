import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store'
import { W } from './design-system'
import { ROLES, homePathFor } from './roles'

import Login from './pages/Login'
import Roadmap from './pages/employee/Roadmap'
import TaskDetail from './pages/employee/TaskDetail'
import Submit from './pages/employee/Submit'
import Submissions from './pages/employee/Submissions'
import Progress from './pages/employee/Progress'
import Schedule from './pages/employee/Schedule'
import EmpDocuments from './pages/employee/Documents'
import Stats from './pages/manager/Stats'
import Matrix from './pages/manager/Matrix'
import Queue from './pages/manager/Queue'
import Profile from './pages/manager/Profile'
import Employees from './pages/manager/Employees'
import Training from './pages/manager/Training'
import MgrDocuments from './pages/manager/Documents'
import Roles from './pages/manager/Roles'

// `allow` is either a single role string or an array of allowed roles.
function Guard({ allow, children }) {
  const { currentUser, initialized } = useStore()
  const allowed = Array.isArray(allow) ? allow : [allow]

  if (!initialized) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily: W.font, color: W.ink3, fontSize:14 }}>
      Đang tải…
    </div>
  )
  if (!currentUser) return <Navigate to="/" replace />
  if (!allowed.includes(currentUser.role)) {
    return <Navigate to={homePathFor(currentUser.role)} replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/emp" element={<Navigate to="/emp/roadmap" replace />} />
        <Route path="/emp/progress"   element={<Guard allow={ROLES.EMPLOYEE}><Progress /></Guard>} />
        <Route path="/emp/roadmap"    element={<Guard allow={ROLES.EMPLOYEE}><Roadmap /></Guard>} />
        <Route path="/emp/task/:id"   element={<Guard allow={ROLES.EMPLOYEE}><TaskDetail /></Guard>} />
        <Route path="/emp/submit"     element={<Guard allow={ROLES.EMPLOYEE}><Submissions /></Guard>} />
        <Route path="/emp/submit/:id" element={<Guard allow={ROLES.EMPLOYEE}><Submit /></Guard>} />
        <Route path="/emp/schedule"   element={<Guard allow={ROLES.EMPLOYEE}><Schedule /></Guard>} />
        <Route path="/emp/documents" element={<Guard allow={ROLES.EMPLOYEE}><EmpDocuments /></Guard>} />

        {/* Owner và Supervisor cùng dùng khu vực /mgr; trang Phân quyền chỉ Owner truy cập được. */}
        <Route path="/mgr" element={<Navigate to="/mgr/stats" replace />} />
        <Route path="/mgr/stats"        element={<Guard allow={[ROLES.OWNER, ROLES.SUPERVISOR]}><Stats /></Guard>} />
        <Route path="/mgr/matrix"       element={<Guard allow={[ROLES.OWNER, ROLES.SUPERVISOR]}><Matrix /></Guard>} />
        <Route path="/mgr/queue"        element={<Guard allow={[ROLES.OWNER, ROLES.SUPERVISOR]}><Queue /></Guard>} />
        <Route path="/mgr/queue/:subId" element={<Guard allow={[ROLES.OWNER, ROLES.SUPERVISOR]}><Queue /></Guard>} />
        <Route path="/mgr/employees"    element={<Guard allow={[ROLES.OWNER, ROLES.SUPERVISOR]}><Employees /></Guard>} />
        <Route path="/mgr/employee/:id" element={<Guard allow={[ROLES.OWNER, ROLES.SUPERVISOR]}><Profile /></Guard>} />
        <Route path="/mgr/training"     element={<Guard allow={[ROLES.OWNER, ROLES.SUPERVISOR]}><Training /></Guard>} />
        <Route path="/mgr/documents"    element={<Guard allow={[ROLES.OWNER, ROLES.SUPERVISOR]}><MgrDocuments /></Guard>} />
        <Route path="/mgr/roles"        element={<Guard allow={ROLES.OWNER}><Roles /></Guard>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

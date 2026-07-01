import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store'
import { W } from './design-system'
import { useT } from './i18n'

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

function Guard({ role, children }) {
  const { currentUser, initialized } = useStore()
  const t = useT()

  if (!initialized) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily: W.font, color: W.ink3, fontSize:14 }}>
      {t('Đang tải…')}
    </div>
  )
  if (!currentUser) return <Navigate to="/" replace />
  if (currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'manager' ? '/mgr/stats' : '/emp/roadmap'} replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/emp" element={<Navigate to="/emp/roadmap" replace />} />
        <Route path="/emp/progress"   element={<Guard role="employee"><Progress /></Guard>} />
        <Route path="/emp/roadmap"    element={<Guard role="employee"><Roadmap /></Guard>} />
        <Route path="/emp/task/:id"   element={<Guard role="employee"><TaskDetail /></Guard>} />
        <Route path="/emp/submit"     element={<Guard role="employee"><Submissions /></Guard>} />
        <Route path="/emp/submit/:id" element={<Guard role="employee"><Submit /></Guard>} />
        <Route path="/emp/schedule"   element={<Guard role="employee"><Schedule /></Guard>} />
        <Route path="/emp/documents" element={<Guard role="employee"><EmpDocuments /></Guard>} />

        <Route path="/mgr" element={<Navigate to="/mgr/stats" replace />} />
        <Route path="/mgr/stats"        element={<Guard role="manager"><Stats /></Guard>} />
        <Route path="/mgr/matrix"       element={<Guard role="manager"><Matrix /></Guard>} />
        <Route path="/mgr/queue"        element={<Guard role="manager"><Queue /></Guard>} />
        <Route path="/mgr/queue/:subId" element={<Guard role="manager"><Queue /></Guard>} />
        <Route path="/mgr/employees"    element={<Guard role="manager"><Employees /></Guard>} />
        <Route path="/mgr/employee/:id" element={<Guard role="manager"><Profile /></Guard>} />
        <Route path="/mgr/training"     element={<Guard role="manager"><Training /></Guard>} />
        <Route path="/mgr/documents"    element={<Guard role="manager"><MgrDocuments /></Guard>} />
        <Route path="/mgr/roles"        element={<Guard role="manager"><Roles /></Guard>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

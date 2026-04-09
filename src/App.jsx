import { Routes, Route } from 'react-router-dom'
import SocShell from './layouts/SocShell'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Alerts from './pages/Alerts'
import Phishing from './pages/Phishing'
import Vulnerabilities from './pages/Vulnerabilities'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import AdminPanel from './pages/AdminPanel'
import Profile from './pages/Profile'
import Blocked from './pages/Blocked'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SocShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="alerts" element={<ProtectedRoute permission="alerts"><Alerts /></ProtectedRoute>} />
        <Route path="blocked" element={<ProtectedRoute permission="blocked"><Blocked /></ProtectedRoute>} />
        <Route path="phishing" element={<ProtectedRoute permission="phishing"><Phishing /></ProtectedRoute>} />
        <Route path="vulnerabilities" element={<ProtectedRoute permission="vulnerabilities"><Vulnerabilities /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute permission="reports"><Reports /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute permission="settings"><Settings /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute permission="admin"><AdminPanel /></ProtectedRoute>} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

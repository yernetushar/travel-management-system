import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/authStore'

// Auth pages
import LandingPage from './pages/LandingPage'
import TouristLogin from './pages/auth/TouristLogin'
import TouristSignup from './pages/auth/TouristSignup'
import ManagerLogin from './pages/auth/ManagerLogin'
import ManagerSignup from './pages/auth/ManagerSignup'
import OAuthCallback from './pages/auth/OAuthCallback'

// Tourist pages
import TouristHome from './pages/tourist/TouristHome'
import SitesPage from './pages/tourist/SitesPage'
import SiteDetail from './pages/tourist/SiteDetail'
import TouristBookings from './pages/tourist/TouristBookings'
import TouristProfile from './pages/tourist/TouristProfile'
import TouristChat from './pages/tourist/TouristChat'

// Manager pages
import ManagerDashboard from './pages/manager/ManagerDashboard'
import ManageSites from './pages/manager/ManageSites'
import SiteForm from './pages/manager/SiteForm'
import ManagerBookings from './pages/manager/ManagerBookings'
import ManagerChat from './pages/manager/ManagerChat'
import ManagerAnalytics from './pages/manager/ManagerAnalytics'
import ManagerProfile from './pages/manager/ManagerProfile'

// Protected route wrapper
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (!token) return <Navigate to="/login" replace />
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'TOURISM_MANAGER' ? '/manager' : '/home'} replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1a1410',
          color: '#fefcf8',
          borderRadius: '12px',
          fontFamily: 'DM Sans, sans-serif'
        }
      }} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<TouristLogin />} />
        <Route path="/signup" element={<TouristSignup />} />
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route path="/manager/signup" element={<ManagerSignup />} />
        <Route path="/oauth-success" element={<OAuthCallback />} />

        {/* Tourist Routes */}
        <Route path="/home" element={
          <ProtectedRoute role="TOURIST">
            <TouristHome />
          </ProtectedRoute>
        } />
        <Route path="/sites/:locationId" element={
          <ProtectedRoute role="TOURIST">
            <SitesPage />
          </ProtectedRoute>
        } />
        <Route path="/site/:siteId" element={
          <ProtectedRoute role="TOURIST">
            <SiteDetail />
          </ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute role="TOURIST">
            <TouristBookings />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute role="TOURIST">
            <TouristProfile />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute role="TOURIST">
            <TouristChat />
          </ProtectedRoute>
        } />

        <Route path="/oauth-success" element={<OAuthCallback />} />

        {/* Manager Routes */}
        <Route path="/manager" element={
          <ProtectedRoute role="TOURISM_MANAGER">
            <ManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/manager/sites" element={
          <ProtectedRoute role="TOURISM_MANAGER">
            <ManageSites />
          </ProtectedRoute>
        } />
        <Route path="/manager/sites/new" element={
          <ProtectedRoute role="TOURISM_MANAGER">
            <SiteForm />
          </ProtectedRoute>
        } />
        <Route path="/manager/sites/edit/:siteId" element={
          <ProtectedRoute role="TOURISM_MANAGER">
            <SiteForm />
          </ProtectedRoute>
        } />
        <Route path="/manager/bookings" element={
          <ProtectedRoute role="TOURISM_MANAGER">
            <ManagerBookings />
          </ProtectedRoute>
        } />
        <Route path="/manager/chat" element={
          <ProtectedRoute role="TOURISM_MANAGER">
            <ManagerChat />
          </ProtectedRoute>
        } />
        <Route path="/manager/analytics" element={
          <ProtectedRoute role="TOURISM_MANAGER">
            <ManagerAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/manager/profile" element={
          <ProtectedRoute role="TOURISM_MANAGER">
            <ManagerProfile />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
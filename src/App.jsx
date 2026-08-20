import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Hospitals from './pages/Hospitals/Hospitals'
import HospitalDetail from './pages/HospitalDetail/HospitalDetail'
import Doctors from './pages/Doctors/Doctors'
import DoctorDetail from './pages/DoctorDetail/DoctorDetail'
import BloodBanks from './pages/BloodBanks/BloodBanks'
import BloodBankDetail from './pages/BloodBankDetail/BloodBankDetail'
import SystemAdminDashboard from './pages/SystemAdminDashboard/SystemAdminDashboard'
import HospitalAdminDashboard from './pages/HospitalAdminDashboard/HospitalAdminDashboard'
import { Navigate } from 'react-router-dom'
import './App.css'

const ProtectedRoute = ({ children, allowedRole }) => {
  const authStr = localStorage.getItem('auth');
  if (!authStr) {
    return <Navigate to="/login" />;
  }
  try {
    const auth = JSON.parse(authStr);
    if (allowedRole && auth.role !== allowedRole) {
      return <Navigate to="/login" />;
    }
    return children;
  } catch (e) {
    return <Navigate to="/login" />;
  }
};

const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname.startsWith('/system-admin') ||
    location.pathname.startsWith('/hospital-admin');

  return (
    <div className="app">
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? "dashboard-main-wrapper" : "main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/doctor/:id" element={<DoctorDetail />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/hospitals/:id" element={<HospitalDetail />} />
          <Route path="/bloodbanks" element={<BloodBanks />} />
          <Route path="/blood-banks/:id" element={<BloodBankDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Dashboard Routes */}
          <Route path="/system-admin/*" element={<SystemAdminDashboard />} />
          {/* <Route path="/system-admin/*" element={<ProtectedRoute allowedRole="SUPER_ADMIN"><SystemAdminDashboard /></ProtectedRoute>} /> */}
          <Route path="/hospital-admin/*" element={<ProtectedRoute allowedRole="HOSPITAL_ADMIN"><HospitalAdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      {!hideNavbar && <Footer />}
    </div>
  )
}


const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default AppWrapper

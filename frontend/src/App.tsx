import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/shared/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { HospitalsPage } from './pages/public/HospitalsPage';
import { DoctorsPage } from './pages/public/DoctorsPage';
import { TelehealthPage } from './pages/public/TelehealthPage';
import { SafetyPage } from './pages/public/SafetyPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// User Dashboard
import { UserDashboard } from './pages/user/UserDashboard';
import { InjuryAssessmentPage } from './pages/user/InjuryAssessmentPage';
import { UserAppointmentsPage } from './pages/user/UserAppointmentsPage';
import { UserProfilePage } from './pages/user/UserProfilePage';

// Doctor Dashboard
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';

// Admin Dashboard
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/telehealth" element={<TelehealthPage />} />
        <Route path="/safety" element={<SafetyPage />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* User Dashboard Routes */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'doctor', 'admin']} />}>
          <Route path="/dashboard/user" element={<UserDashboard />} />
          <Route path="/dashboard/user/assessment" element={<InjuryAssessmentPage />} />
          <Route path="/dashboard/user/appointments" element={<UserAppointmentsPage />} />
          <Route path="/dashboard/user/telehealth" element={<TelehealthPage />} />
          <Route path="/dashboard/user/profile" element={<UserProfilePage />} />
        </Route>

        {/* Doctor Dashboard Routes */}
        <Route element={<ProtectedRoute allowedRoles={['doctor', 'admin']} />}>
          <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
          <Route path="/dashboard/doctor/appointments" element={<DoctorDashboard />} />
          <Route path="/dashboard/doctor/availability" element={<DoctorDashboard />} />
          <Route path="/dashboard/doctor/profile" element={<UserProfilePage />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/users" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/doctors" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/hospitals" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/appointments" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/logs" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;

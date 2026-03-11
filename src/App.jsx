import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './pages/auth/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CreateJob from './pages/employer/CreateJob';
import WorkerList from './pages/employer/WorkerList';
import WorkerDetail from './pages/employer/WorkerDetail';
import JobList from './pages/worker/JobList';
import JobDetail from './pages/worker/JobDetail';
import FeaturedServices from './pages/FeaturedServices';
import Handbook from './pages/Handbook';
import UserProfile from './pages/profile/UserProfile';
import AccountSettings from './pages/profile/AccountSettings';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerCandidates from './pages/employer/EmployerCandidates';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerSchedule from './pages/worker/WorkerSchedule';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminServiceManagement from './pages/admin/AdminServiceManagement';

const NotFound = () => (
  <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
    <h2>404 - Không tìm thấy trang</h2>
    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Trang bạn yêu cầu không tồn tại.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tim-viec" element={<JobList />} />
          <Route path="/viec-lam/:id" element={<JobDetail />} />
          <Route path="/tim-giup-viec" element={<WorkerList />} />
          <Route path="/ung-vien/:id" element={<WorkerDetail />} />
          <Route path="/dang-tin" element={<CreateJob />} />
          <Route path="/dich-vu-noi-bat" element={<FeaturedServices />} />
          <Route path="/cam-nang" element={<Handbook />} />
          
          {/* Nested Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/ho-so" replace />} />
            <Route path="ho-so" element={<UserProfile />} />
            <Route path="cai-dat" element={<AccountSettings />} />
            
            {/* Employer Routes */}
            <Route path="quan-ly-tin" element={<EmployerDashboard />} />
            <Route path="ung-vien" element={<EmployerCandidates />} />
            
            {/* Worker Routes */}
            <Route path="viec-da-ung-tuyen" element={<WorkerDashboard />} />
            <Route path="lich-lam-viec" element={<WorkerSchedule />} />
            
            {/* Admin Routes */}
            <Route path="tong-quan" element={<AdminDashboard />} />
            <Route path="quan-ly-user" element={<AdminUserManagement />} />
            <Route path="quan-ly-dich-vu" element={<AdminServiceManagement />} />
          </Route>
        </Route>

        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/dang-ky" element={<Register />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { User, Briefcase, FileText, Settings, LogOut, ChevronRight } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const employerLinks = [
    { to: '/dashboard/quan-ly-tin', icon: <Briefcase size={20} />, label: 'Việc đã đăng' },
    { to: '/dashboard/ung-vien', icon: <FileText size={20} />, label: 'Hồ sơ ứng viên' },
  ];

  const workerLinks = [
    { to: '/dashboard/viec-da-ung-tuyen', icon: <Briefcase size={20} />, label: 'Việc đã ứng tuyển' },
    { to: '/dashboard/lich-lam-viec', icon: <FileText size={20} />, label: 'Lịch làm việc' },
  ];

  const adminLinks = [
    { to: '/dashboard/tong-quan', icon: <Briefcase size={20} />, label: 'Tổng quan hệ thống' },
    { to: '/dashboard/quan-ly-user', icon: <User size={20} />, label: 'Quản lý Người dùng' },
    { to: '/dashboard/quan-ly-dich-vu', icon: <FileText size={20} />, label: 'Quản lý Gói / Khóa học' },
  ];

  let roleLinks = workerLinks;
  if (user?.role === 'employer') roleLinks = employerLinks;
  else if (user?.role === 'admin') roleLinks = adminLinks;

  const roleDisplay = {
    employer: 'Chủ thuê',
    worker: 'Người lao động',
    admin: 'Quản Trị Viên (Admin)',
  };

  const displayName = user?.fullName || user?.name || 'Khách';

  return (
    <div className="dashboard-container container">
      <aside className="dashboard-sidebar">
        <div className="profile-summary">
          <div className="avatar-circle">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={displayName} className="sidebar-avatar-image" />
            ) : (
              displayName.charAt(0) || 'U'
            )}
          </div>
          <div>
            <h3 className="profile-name">{displayName}</h3>
            <span className={`profile-role ${user?.role === 'admin' ? 'admin' : ''}`}>
              {roleDisplay[user?.role] || 'Khách'}
            </span>
            {user?.isGuest && (
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', marginTop: '0.25rem', fontWeight: 600 }}>
                Tài khoản khách
              </div>
            )}
          </div>
        </div>

        <nav className="dashboard-nav">
          <div className="nav-group-title">Tài Khoản</div>
          <NavLink
            to="/dashboard/ho-so"
            className={({ isActive }) => `dash-nav-item ${isActive ? 'active' : ''}`}
          >
            <User size={20} /> Thông tin cá nhân <ChevronRight size={16} className="ml-auto" />
          </NavLink>

          <div className="nav-group-title mt-4">Quản lý</div>
          {roleLinks.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.to}
              className={({ isActive }) => `dash-nav-item ${isActive ? 'active' : ''}`}
            >
              {link.icon} {link.label} <ChevronRight size={16} className="ml-auto" />
            </NavLink>
          ))}

          <div className="nav-group-title mt-4">Cài đặt</div>
          <NavLink
            to="/dashboard/cai-dat"
            className={({ isActive }) => `dash-nav-item ${isActive ? 'active' : ''}`}
          >
            <Settings size={20} /> Thiết lập tài khoản <ChevronRight size={16} className="ml-auto" />
          </NavLink>

          <button className="dash-nav-item text-danger mt-2" onClick={handleLogout}>
            <LogOut size={20} /> Đăng xuất
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

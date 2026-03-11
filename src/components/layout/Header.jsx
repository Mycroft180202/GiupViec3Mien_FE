import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { Menu, UserCircle, Bell, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-content">
        <div className="flex-center">
          {/* Mobile Menu Icon */}
          <button className="mobile-menu-btn" aria-label="Open menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={24} />
          </button>
          
          <Link to="/" className="logo">
            <span className="logo-text">Giúp Việc 3 Miền</span>
          </Link>
        </div>

          <nav className={`main-nav desktop-nav ${isMenuOpen ? 'open' : ''}`} style={{ display: 'flex', gap: '1.5rem' }}>
            {user?.role !== 'worker' && (
              <Link to="/tim-giup-viec" onClick={() => setIsMenuOpen(false)} className="nav-link">Tìm người giúp việc</Link>
            )}
            <Link to="/tim-viec" onClick={() => setIsMenuOpen(false)} className="nav-link">Tìm việc làm</Link>
            <Link to="/dich-vu-noi-bat" onClick={() => setIsMenuOpen(false)} className="nav-link">Dịch vụ nổi bật</Link>
            <Link to="/cam-nang" onClick={() => setIsMenuOpen(false)} className="nav-link">Cẩm nang</Link>
          </nav>

        <div className="header-actions">
          <button className="icon-btn" aria-label="Notifications">
             <Bell size={20} />
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <div className="user-menu">
                  <UserCircle size={28} className="user-icon" />
                  <span className="user-name" style={{ color: 'var(--text-main)', fontWeight: 600 }}>{user?.name}</span>
                </div>
              </Link>
              <button onClick={handleLogout} className="icon-btn" aria-label="Logout" title="Đăng xuất">
                <LogOut size={20} />
              </button>
              {user?.role === 'employer' && (
                <Link to="/dang-tin" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" className="post-job-btn">Đăng tin ngay</Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/dang-nhap" style={{ textDecoration: 'none' }}>
                <div className="user-menu">
                  <UserCircle size={28} className="user-icon" />
                  <span className="user-name" style={{ color: 'var(--text-main)' }}>Đăng nhập</span>
                </div>
              </Link>
              <Link to="/dang-ky" style={{ textDecoration: 'none' }}>
                <Button variant="outline" className="post-job-btn">Đăng ký</Button>
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Auth.css';

const AuthLayout = () => {
  return (
    <div className="auth-container">
      <div className="auth-image-panel">
        <div className="auth-brand">
          <Link to="/" className="auth-back-link">
            <ArrowLeft size={20} /> Quay lại trang chủ
          </Link>
          <div className="auth-slogan-wrapper">
            <h1 className="auth-slogan">Giúp Việc 3 Miền</h1>
            <p>Nơi kết nối sự tin tưởng và an tâm cho mái ấm của bạn.</p>
          </div>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <Outlet />
        </div>
        <div className="auth-form-footer">
          <p>&copy; 2026 Giúp Việc 3 Miền. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

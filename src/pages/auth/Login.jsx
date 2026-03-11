import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess } from '../../redux/slices/authSlice';
import { Mail, Lock } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Set demo account as default
  const [formData, setFormData] = useState({ 
    email: 'chuthue@demo.com', 
    password: 'password123' 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(loginStart());

    // Mock login logic -> will be connected to Real API later
    setTimeout(() => {
      setIsLoading(false);
      
      let role = 'employer';
      let name = 'Trần Văn Demo';
      
      if (formData.email.includes('admin')) {
        role = 'admin';
        name = 'Quản Trị Viên';
      } else if (formData.email.includes('nguoilam')) {
        role = 'worker';
        name = 'Nguyễn Thị Hoa';
      }

      const fakeUser = {
        id: 'u123',
        name,
        email: formData.email,
        role,
        phone: '0901234567'
      };
      
      dispatch(loginSuccess({ user: fakeUser, token: 'fake-jwt-token-123' }));
      navigate(role === 'admin' ? '/dashboard/tong-quan' : '/');
    }, 1000);
  };

  return (
    <>
      <h2 className="auth-title">Chào mừng trở lại</h2>
      <p className="auth-subtitle">Đăng nhập để vào hệ thống quản lý công việc của bạn.</p>

      <div style={{ padding: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <strong>Chủ Thuê:</strong><br/>
          chuthue@demo.com<br/>
          password123
        </div>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <strong>Người Làm:</strong><br/>
          nguoilam@demo.com<br/>
          password123
        </div>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <strong>Admin:</strong><br/>
          admin@demo.com<br/>
          password123
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <Input 
          id="email" 
          label="Địa chỉ Email" 
          type="email" 
          placeholder="chuthue@demo.com"
          icon={<Mail size={20} />}
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <Input 
          id="password" 
          label="Mật khẩu" 
          type="password" 
          placeholder="password123"
          icon={<Lock size={20} />}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="auth-links">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" /> Ghi nhớ đăng nhập
          </label>
          <Link to="/quen-mat-khau" style={{ fontWeight: 500 }}>Quên mật khẩu?</Link>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" style={{ fontWeight: 600 }}>Đăng ký ngay</Link>
        </p>
      </div>
    </>
  );
};

export default Login;

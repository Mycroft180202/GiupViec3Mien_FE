import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import { Phone, Lock } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Set demo account as default
  const [formData, setFormData] = useState({ 
    phone: '0901234567', 
    password: 'password123' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    dispatch(loginStart());

    try {
      const response = await axios.post('https://localhost:7004/api/Auth/login', formData);
      const data = response.data;
      
      // Map API response (Numeric Enum) to Frontend format (Strings)
      // Backend: 0 = Admin, 1 = Employer, 2 = Worker
      const roleMap = {
        0: 'admin',
        1: 'employer',
        2: 'worker',
        'Admin': 'admin',
        'Employer': 'employer',
        'Worker': 'worker'
      };
      
      const role = roleMap[data.role] || 'employer';

      const user = {
        name: data.fullName,
        phone: data.phone,
        role: role,
        hasPremiumAccess: data.hasPremiumAccess,
        premiumExpiry: data.premiumExpiry
      };

      dispatch(loginSuccess({ user, token: data.token }));
      
      // Redirect based on role
      if (role === 'admin') {
        navigate('/dashboard/tong-quan');
      } else {
        navigate('/');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
      setErrorMsg(message);
      dispatch(loginFailure(message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-title">Chào mừng trở lại</h2>
      <p className="auth-subtitle">Đăng nhập để vào hệ thống quản lý công việc của bạn.</p>

      {errorMsg && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #fecaca' }}>
          {errorMsg}
        </div>
      )}

      <div style={{ padding: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <strong>Chủ Thuê:</strong><br/>
          0901234567<br/>
          password123
        </div>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <strong>Người Làm:</strong><br/>
          0987654321<br/>
          password123
        </div>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <strong>Admin:</strong><br/>
          0123456789<br/>
          password123
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <Input 
          id="phone" 
          label="Số điện thoại" 
          type="text" 
          placeholder="0901234567"
          icon={<Phone size={20} />}
          value={formData.phone}
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

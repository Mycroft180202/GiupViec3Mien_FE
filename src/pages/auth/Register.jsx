import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register = () => {
  const navigate = useNavigate();
  // Role toggling for the form inputs
  const [role, setRole] = useState('employer'); // employer | worker
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    fullName: '', phone: '', email: '', password: '', confirmPassword: '' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock registration logic -> will be connected to Redux
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <>
      <h2 className="auth-title">Đăng ký tài khoản</h2>
      <p className="auth-subtitle">Chọn loại tài khoản phù hợp với nhu cầu của bạn.</p>

      {/* Role Selector Tabs */}
      <div className="auth-tabs">
        <div 
          className={`auth-tab ${role === 'employer' ? 'active' : ''}`}
          onClick={() => setRole('employer')}
        >
          Tôi muốn Tìm Người
        </div>
        <div 
          className={`auth-tab ${role === 'worker' ? 'active' : ''}`}
          onClick={() => setRole('worker')}
        >
          Tôi muốn Đi Làm
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <Input 
          id="fullName" 
          label="Họ và tên" 
          placeholder="Vd: Nguyễn Văn A"
          icon={<User size={20} />}
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        
        <Input 
          id="phone" 
          label="Số điện thoại" 
          type="tel" 
          placeholder="0912345678"
          icon={<Phone size={20} />}
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <Input 
          id="password" 
          label="Mật khẩu" 
          type="password" 
          placeholder="••••••••"
          icon={<Lock size={20} />}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng Ký Tài Khoản'}
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>
          Đã có tài khoản?{' '}
          <Link to="/dang-nhap" style={{ fontWeight: 600 }}>Đăng nhập</Link>
        </p>
      </div>
    </>
  );
};

export default Register;

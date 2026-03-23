import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, Phone } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register = () => {
  const navigate = useNavigate();
  // Role toggling for the form inputs
  const [role, setRole] = useState('employer'); // employer | worker
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    fullName: '', phone: '', email: '', password: '', confirmPassword: '', gender: 0, dateOfBirth: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock registration logic -> will be connected to Redux
    const payload = {
      ...formData,
      role: role === 'employer' ? 1 : 2, // 1: Employer, 2: Worker depending on enum mapping in backend
      gender: parseInt(formData.gender),
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null
    };
    
    console.log("Submitting Register Payload:", payload);
    setTimeout(() => {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-title">Đăng ký tài khoản</h2>
      <p className="auth-subtitle">Chọn loại tài khoản phù hợp với nhu cầu của bạn.</p>

      {errorMsg && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #fecaca' }}>
          {errorMsg}
        </div>
      )}

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
          id="email" 
          label="Email (Tùy chọn)" 
          type="email" 
          placeholder="email@example.com"
          icon={<Mail size={20} />}
          value={formData.email}
          onChange={handleChange}
        />

        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Giới tính</label>
          <select 
            id="gender" 
            value={formData.gender} 
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-light)'
            }}
          >
            <option value={0}>Không tiết lộ (Any)</option>
            <option value={1}>Nam</option>
            <option value={2}>Nữ</option>
          </select>
        </div>

        <Input 
          id="dateOfBirth" 
          label="Ngày sinh" 
          type="date"
          value={formData.dateOfBirth}
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

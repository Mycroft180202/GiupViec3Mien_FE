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
    fullName: '', phone: '', password: '', confirmPassword: '' 
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Field mapping and Role mapping (Employer=1, Worker=2)
    const payload = {
      fullName: formData.fullName,
      phone: formData.phone,
      password: formData.password,
      role: role === 'employer' ? 1 : 2
    };

    try {
      await axios.post('https://localhost:7004/api/Auth/register', payload);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/dang-nhap');
    } catch (err) {
      const message = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại dữ liệu.';
      setErrorMsg(message);
    } finally {
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

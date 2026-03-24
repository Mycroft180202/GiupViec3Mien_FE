import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Phone, Lock } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import { buildUserFromAuthResponse } from '../../utils/auth';
import { getApiErrorMessage } from '../../utils/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Số điện thoại là bắt buộc.';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Mật khẩu là bắt buộc.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    dispatch(loginStart());

    try {
      const response = await axios.post('https://localhost:7004/api/Auth/login', formData);
      const data = response.data;
      const user = buildUserFromAuthResponse(data);

      dispatch(loginSuccess({ user, token: data.token }));
      toast.success(`Đăng nhập thành công! Chào mừng ${user.name}`);

      if (user.role === 'admin') {
        navigate('/dashboard/tong-quan');
      } else {
        navigate('/');
      }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
      toast.error(message);
      dispatch(loginFailure(message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-title">Chào mừng trở lại</h2>
      <p className="auth-subtitle">Đăng nhập để vào hệ thống quản lý công việc của bạn.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <Input
          id="phone"
          label="Số điện thoại"
          type="text"
          placeholder="0901234567"
          icon={<Phone size={20} />}
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
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
          error={errors.password}
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

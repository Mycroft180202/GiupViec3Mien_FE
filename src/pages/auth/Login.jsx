import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Phone, Lock } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import { buildUserFromAuthResponse } from '../../utils/auth';
import { getApiErrorMessage } from '../../utils/api';
import { DEMO_ACCOUNTS, DEMO_MODE } from '../../mock/demoConfig';
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

  const handleDemoLogin = async (account) => {
    setFormData({
      phone: account.phone,
      password: account.password,
    });
    setErrors({});
    setIsLoading(true);
    dispatch(loginStart());

    try {
      const response = await axios.post('https://localhost:7004/api/Auth/login', {
        phone: account.phone,
        password: account.password,
      });
      const data = response.data;
      const user = buildUserFromAuthResponse(data);

      dispatch(loginSuccess({ user, token: data.token }));
      toast.success(`Đã vào chế độ demo: ${account.label}`);

      if (user.role === 'admin') {
        navigate('/dashboard/tong-quan');
      } else if (user.role === 'employer') {
        navigate('/dashboard/quan-ly-tin');
      } else {
        navigate('/dashboard/viec-da-ung-tuyen');
      }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể đăng nhập demo.');
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

      {DEMO_MODE && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(47, 128, 237, 0.06)',
            border: '1px solid rgba(47, 128, 237, 0.16)',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Tài khoản demo</div>
          <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Mật khẩu chung cho tất cả tài khoản demo là <strong>`demo123`</strong>. Bạn có thể bấm đăng nhập nhanh ở dưới.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.key}
                type="button"
                onClick={() => handleDemoLogin(account)}
                style={{
                  textAlign: 'left',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{account.label}</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {account.phone} • {account.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

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

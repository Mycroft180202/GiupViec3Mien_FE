import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { getApiErrorMessage } from '../../utils/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('employer');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 0,
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    provinceCode: '',
    provinceName: '',
    otpCode: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    axios.get('https://provinces.open-api.vn/api/v2/?depth=1')
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error('Could not load provinces', err));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
    setErrorMsg('');
  };

  const handleProvinceChange = (e) => {
    const code = parseInt(e.target.value, 10);
    const name = provinces.find((p) => p.code === code)?.name || '';
    setFormData((prev) => ({ ...prev, provinceCode: code, provinceName: name }));
    setErrors((prev) => ({ ...prev, provinceCode: '' }));
  };

  const validateBeforeOtp = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) nextErrors.fullName = 'Họ và tên là bắt buộc.';
    if (!formData.phone.trim()) nextErrors.phone = 'Số điện thoại là bắt buộc.';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = 'Email không đúng định dạng.';
    if (!formData.dobDay || !formData.dobMonth || !formData.dobYear) nextErrors.dob = 'Vui lòng chọn đầy đủ ngày sinh.';
    if (!formData.provinceCode) nextErrors.provinceCode = 'Vui lòng chọn tỉnh / thành phố.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateBeforeRegister = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) nextErrors.fullName = 'Họ và tên là bắt buộc.';
    if (!formData.phone.trim()) nextErrors.phone = 'Số điện thoại là bắt buộc.';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = 'Email không đúng định dạng.';
    if (!formData.password) nextErrors.password = 'Mật khẩu là bắt buộc.';
    else if (formData.password.length < 6) nextErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    if (formData.confirmPassword !== formData.password) nextErrors.confirmPassword = 'Xác nhận mật khẩu không khớp.';
    if (!formData.otpCode.trim()) nextErrors.otpCode = 'Mã OTP là bắt buộc.';
    if (!formData.dobDay || !formData.dobMonth || !formData.dobYear) nextErrors.dob = 'Vui lòng chọn đầy đủ ngày sinh.';
    if (!formData.provinceCode) nextErrors.provinceCode = 'Vui lòng chọn tỉnh / thành phố.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    if (!otpSent) {
      if (!validateBeforeOtp()) {
        setIsLoading(false);
        return;
      }

      try {
        await axios.post('https://localhost:7004/api/Auth/send-otp', { phone: formData.phone });
        setOtpSent(true);
        toast.success('Mã OTP đã được gửi về Số điện thoại/Zalo của bạn.');
      } catch (err) {
        const message = getApiErrorMessage(err, 'Lỗi mạng. Không thể gửi mã OTP.');
        toast.error(message);
        setErrorMsg(message);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!validateBeforeRegister()) {
      setIsLoading(false);
      return;
    }

    const payload = {
      ...formData,
      role: role === 'employer' ? 1 : 2,
      gender: formData.gender !== undefined ? parseInt(formData.gender, 10) : 0,
      dateOfBirth: formData.dobYear && formData.dobMonth && formData.dobDay
        ? new Date(formData.dobYear, formData.dobMonth - 1, formData.dobDay).toISOString()
        : null,
      provinceCode: formData.provinceCode ? parseInt(formData.provinceCode, 10) : null,
      provinceName: formData.provinceName || null,
    };

    try {
      await axios.post('https://localhost:7004/api/Auth/register', payload);
      toast.success('Đăng ký thành công! Hãy đăng nhập để tiếp tục.');
      navigate('/dang-nhap');
    } catch (error) {
      const message = getApiErrorMessage(error, 'Đăng ký thất bại. Kiểm tra API Backend.');
      console.error('Lỗi đăng ký:', error.response?.data || error);
      toast.error(message);
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

      <div className="auth-tabs">
        <div className={`auth-tab ${role === 'employer' ? 'active' : ''}`} onClick={() => setRole('employer')}>
          Tôi muốn Tìm Người
        </div>
        <div className={`auth-tab ${role === 'worker' ? 'active' : ''}`} onClick={() => setRole('worker')}>
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
          error={errors.fullName}
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
          error={errors.phone}
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
          error={errors.email}
        />

        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Giới tính</label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-light)' }}
          >
            <option value={0}>Không tiết lộ (Any)</option>
            <option value={1}>Nam</option>
            <option value={2}>Nữ</option>
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ngày sinh</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select id="dobDay" value={formData.dobDay} onChange={handleChange} required style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: errors.dob ? '1px solid var(--status-error)' : '1px solid var(--border)', backgroundColor: 'var(--bg-light)' }}>
              <option value="">Ngày</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select id="dobMonth" value={formData.dobMonth} onChange={handleChange} required style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: errors.dob ? '1px solid var(--status-error)' : '1px solid var(--border)', backgroundColor: 'var(--bg-light)' }}>
              <option value="">Tháng</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>Tháng {m}</option>)}
            </select>
            <select id="dobYear" value={formData.dobYear} onChange={handleChange} required style={{ flex: 1.5, padding: '0.75rem', borderRadius: '8px', border: errors.dob ? '1px solid var(--status-error)' : '1px solid var(--border)', backgroundColor: 'var(--bg-light)' }}>
              <option value="">Năm sinh</option>
              {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 15 - i).map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {errors.dob && <span className="input-error-msg">{errors.dob}</span>}
        </div>

        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tỉnh / Thành phố hiện sống</label>
          <select
            id="provinceCode"
            value={formData.provinceCode}
            onChange={handleProvinceChange}
            required
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: errors.provinceCode ? '1px solid var(--status-error)' : '1px solid var(--border)', backgroundColor: 'var(--bg-light)' }}
          >
            <option value="">-- Chọn Tỉnh / Thành phố --</option>
            {provinces.map((prov) => (
              <option key={prov.code} value={prov.code}>{prov.name}</option>
            ))}
          </select>
          {errors.provinceCode && <span className="input-error-msg">{errors.provinceCode}</span>}
        </div>

        <Input
          id="password"
          label="Mật khẩu"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={20} />}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        {otpSent && (
          <>
            <Input
              id="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={20} />}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <Input
              id="otpCode"
              label="Mã OTP Xác Nhận"
              type="text"
              placeholder="Nhập 6 số OTP từ tin nhắn"
              icon={<Lock size={20} />}
              value={formData.otpCode}
              onChange={handleChange}
              error={errors.otpCode}
              required
              maxLength={6}
            />
          </>
        )}

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : (otpSent ? 'Đăng Ký Tài Khoản' : 'Nhận Mã OTP')}
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

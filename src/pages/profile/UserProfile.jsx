import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Mail, Save, Loader2, AlertCircle, ShieldCheck, BadgeCheck, MessageSquare } from 'lucide-react';
import { updateUser } from '../../redux/slices/authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', bio: '', experienceYears: 0, hourlyRate: 0, gender: '0',
    dobDay: '', dobMonth: '', dobYear: '',
    provinceCode: '', districtCode: '', wardCode: '', detailedAddress: '',
  });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [phoneVerification, setPhoneVerification] = useState({
    verified: false,
    verifiedAt: null,
    channel: null,
    otpCode: '',
    otpSent: false,
  });

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://localhost:7004/api/User/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      let addressMeta = {};
      if (data.additionalInfo) {
        try {
          addressMeta = JSON.parse(data.additionalInfo);
        } catch (e) {
          addressMeta = {};
        }
      }

      setAvatarUrl(data.avatarUrl || '');
      setPhoneVerification((prev) => ({
        ...prev,
        verified: Boolean(data.phoneVerified),
        verifiedAt: data.phoneVerifiedAt || null,
        channel: data.phoneVerificationChannel || null,
      }));

      setFormData({
        name: data.fullName || '',
        phone: data.phone || '',
        email: data.email || '',
        bio: data.workerProfile?.bio || '',
        experienceYears: data.workerProfile?.experienceYears || 0,
        hourlyRate: data.workerProfile?.hourlyRate || 0,
        gender: data.gender !== undefined ? data.gender.toString() : '0',
        dobDay: data.dateOfBirth ? new Date(data.dateOfBirth).getDate() : '',
        dobMonth: data.dateOfBirth ? new Date(data.dateOfBirth).getMonth() + 1 : '',
        dobYear: data.dateOfBirth ? new Date(data.dateOfBirth).getFullYear() : '',
        provinceCode: addressMeta.provinceCode || '',
        districtCode: addressMeta.districtCode || '',
        wardCode: addressMeta.wardCode || '',
        detailedAddress: addressMeta.detailedAddress || '',
      });

      dispatch(updateUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
        phoneVerified: data.phoneVerified,
        phoneVerifiedAt: data.phoneVerifiedAt,
        phoneVerificationChannel: data.phoneVerificationChannel,
      }));
    } catch (err) {
      setErrorMsg('Không thể tải thông tin cá nhân.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
    axios.get('https://provinces.open-api.vn/api/v2/?depth=1').then((res) => setProvinces(res.data)).catch(console.error);
  }, [token]);

  useEffect(() => {
    if (!formData.provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }
    axios.get(`https://provinces.open-api.vn/api/p/${formData.provinceCode}?depth=2`).then((res) => setDistricts(res.data.districts)).catch(console.error);
  }, [formData.provinceCode]);

  useEffect(() => {
    if (!formData.districtCode) {
      setWards([]);
      return;
    }
    axios.get(`https://provinces.open-api.vn/api/d/${formData.districtCode}?depth=2`).then((res) => setWards(res.data.wards)).catch(console.error);
  }, [formData.districtCode]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.id]: value });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    const loadingToast = toast.loading('Đang tải ảnh lên hệ thống...');
    try {
      const res = await axios.post('https://localhost:7004/api/User/uploadfile', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setAvatarUrl(res.data.imgurl);
      dispatch(updateUser({ avatarUrl: res.data.imgurl }));
      toast.success('Thay đổi ảnh đại diện thành công!', { id: loadingToast });
    } catch (err) {
      toast.error('Không thể tải ảnh. Vui lòng kiểm tra lại kích thước.', { id: loadingToast });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSendPhoneOtp = async () => {
    setIsSendingOtp(true);
    try {
      const response = await axios.post('https://localhost:7004/api/User/phone-verification/send', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhoneVerification((prev) => ({ ...prev, otpSent: true }));
      toast.success(response.data.message || 'Mã OTP đã được gửi qua Zalo OA.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể gửi mã OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneVerification.otpCode.trim()) {
      toast.error('Vui lòng nhập mã OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await axios.post('https://localhost:7004/api/User/phone-verification/verify', {
        otpCode: phoneVerification.otpCode.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPhoneVerification((prev) => ({
        ...prev,
        verified: true,
        channel: response.data.channel || 'ZaloOA',
        verifiedAt: new Date().toISOString(),
        otpCode: '',
        otpSent: false,
      }));
      dispatch(updateUser({
        phoneVerified: true,
        phoneVerifiedAt: new Date().toISOString(),
        phoneVerificationChannel: response.data.channel || 'ZaloOA',
      }));
      toast.success(response.data.message || 'Xác minh số điện thoại thành công.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xác minh OTP thất bại.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    try {
      const locationMeta = JSON.stringify({
        provinceCode: formData.provinceCode ? Number(formData.provinceCode) : null,
        provinceName: provinces.find((p) => p.code == formData.provinceCode)?.name || '',
        districtCode: formData.districtCode ? Number(formData.districtCode) : null,
        districtName: districts.find((d) => d.code == formData.districtCode)?.name || '',
        wardCode: formData.wardCode ? Number(formData.wardCode) : null,
        wardName: wards.find((w) => w.code == formData.wardCode)?.name || '',
        detailedAddress: formData.detailedAddress,
      });

      const payload = {
        fullName: formData.name,
        email: formData.email,
        bio: formData.bio,
        experienceYears: Number(formData.experienceYears),
        hourlyRate: Number(formData.hourlyRate),
        gender: Number(formData.gender),
        dateOfBirth: formData.dobYear && formData.dobMonth && formData.dobDay
          ? new Date(formData.dobYear, formData.dobMonth - 1, formData.dobDay).toISOString()
          : null,
        latitude: 0,
        longitude: 0,
        avatarUrl,
        additionalInfo: locationMeta,
      };

      await axios.post('https://localhost:7004/api/User/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(updateUser({
        fullName: formData.name,
        email: formData.email,
        avatarUrl,
      }));
      toast.success('Đã cập nhật thông tin thành công!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể lưu thay đổi.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="state-center" style={{ padding: '6rem 0' }}>
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="mt-2">Đang tải thông tin cá nhân...</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="dashboard-title">Thông Tin Cá Nhân</h2>
      <p className="dashboard-subtitle">Quản lý hồ sơ và thông tin liên hệ của bạn.</p>

      {errorMsg && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      <div style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '3px solid #fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            {avatarUrl ? <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={40} color="#94a3b8" />}
          </div>
          <div>
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              Thay đổi ảnh đại diện
            </Button>
            <input ref={fileInputRef} id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>JPG, PNG hoặc GIF. Tối đa 5MB.</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <Input
              id="name"
              label="Họ và Tên"
              icon={<User size={18} />}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              id="email"
              label="Địa chỉ Email"
              type="email"
              icon={<Mail size={18} />}
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
            <Input
              id="phone"
              label="Số điện thoại"
              icon={<Phone size={18} />}
              value={formData.phone}
              disabled
            />
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ngày sinh</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select id="dobDay" value={formData.dobDay} onChange={handleChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-light)' }}>
                  <option value="">Ngày</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select id="dobMonth" value={formData.dobMonth} onChange={handleChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-light)' }}>
                  <option value="">Tháng</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>Tháng {m}</option>)}
                </select>
                <select id="dobYear" value={formData.dobYear} onChange={handleChange} style={{ flex: 1.5, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-light)' }}>
                  <option value="">Năm</option>
                  {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 15 - i).map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: phoneVerification.verified ? 'rgba(39, 174, 96, 0.05)' : 'rgba(47, 128, 237, 0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {phoneVerification.verified ? <BadgeCheck size={18} color="#27AE60" /> : <ShieldCheck size={18} color="#2F80ED" />}
                  Xác minh số điện thoại qua Zalo OA
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    backgroundColor: phoneVerification.verified ? 'rgba(39, 174, 96, 0.12)' : 'rgba(242, 153, 74, 0.14)',
                    color: phoneVerification.verified ? 'var(--status-success)' : '#B45309',
                  }}>
                    {phoneVerification.verified ? 'Đã xác thực' : 'Chưa xác thực'}
                  </span>
                </div>
                <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  {phoneVerification.verified
                    ? `Đã xác minh${phoneVerification.verifiedAt ? ` lúc ${new Date(phoneVerification.verifiedAt).toLocaleString('vi-VN')}` : ''}${phoneVerification.channel ? ` qua ${phoneVerification.channel}` : ''}.`
                    : 'Xác minh để dùng OTP và gửi thông báo sau này qua Zalo OA.'}
                </p>
              </div>
              {!phoneVerification.verified && (
                <Button type="button" variant="outline" onClick={handleSendPhoneOtp} disabled={isSendingOtp} icon={<MessageSquare size={16} />}>
                  {isSendingOtp ? 'Đang gửi mã...' : 'Gửi mã OTP'}
                </Button>
              )}
            </div>

            {!phoneVerification.verified && phoneVerification.otpSent && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 240px' }}>
                  <Input
                    id="phoneOtpCode"
                    label="Nhập mã OTP"
                    placeholder="6 số OTP từ Zalo OA/SMS"
                    value={phoneVerification.otpCode}
                    onChange={(e) => setPhoneVerification((prev) => ({ ...prev, otpCode: e.target.value }))}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button type="button" variant="primary" onClick={handleVerifyPhoneOtp} disabled={isVerifyingOtp}>
                    {isVerifyingOtp ? 'Đang xác minh...' : 'Xác minh số điện thoại'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Giới tính</label>
            <select
              id="gender"
              className="input-field"
              style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="0">Nam</option>
              <option value="1">Nữ</option>
              <option value="2">Khác</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tỉnh / Thành phố</label>
              <select id="provinceCode" value={formData.provinceCode} onChange={handleChange} style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                <option value="">Chọn Tỉnh/Thành</option>
                {provinces.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Quận / Huyện</label>
              <select id="districtCode" value={formData.districtCode} onChange={handleChange} style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phường / Xã</label>
              <select id="wardCode" value={formData.wardCode} onChange={handleChange} style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                <option value="">Chọn Phường/Xã</option>
                {wards.map((w) => <option key={w.code} value={w.code}>{w.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <Input
              id="detailedAddress"
              label="Địa chỉ chi tiết (Số nhà, tên đường...)"
              icon={<MapPin size={18} />}
              value={formData.detailedAddress}
              onChange={handleChange}
            />
          </div>

          {user?.role === 'worker' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <Input
                  id="experienceYears"
                  label="Số năm kinh nghiệm"
                  type="number"
                  value={formData.experienceYears}
                  onChange={handleChange}
                />
                <Input
                  id="hourlyRate"
                  label="Giá thuê mong muốn (đ/giờ)"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Giới thiệu bản thân
                </label>
                <textarea
                  id="bio"
                  className="input-field"
                  style={{ width: '100%', minHeight: '120px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'vertical', fontFamily: 'inherit' }}
                  placeholder="Giới thiệu nhanh về kinh nghiệm làm việc của bạn để chủ nhà hiểu hơn..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button type="button" variant="outline" onClick={() => fetchProfile()}>Hủy bỏ</Button>
            <Button type="submit" variant="primary" icon={<Save size={18} />} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;

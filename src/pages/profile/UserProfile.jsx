import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  AlertCircle,
  BadgeCheck,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react';
import { updateUser } from '../../redux/slices/authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7004';

const SERVICE_OPTIONS = [
  { value: 'Housekeeping', label: 'Giúp việc nhà' },
  { value: 'Babysitting', label: 'Trông trẻ' },
  { value: 'ElderCare', label: 'Chăm sóc người già' },
  { value: 'Cooking', label: 'Nấu ăn' },
  { value: 'GeneralHelper', label: 'Tạp vụ' },
  { value: 'Other', label: 'Khác' },
];

const parseJsonArray = (value) => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const UserProfile = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const isWorker = String(user?.role || '').toLowerCase() === 'worker';
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    bio: '',
    desiredJobTitle: '',
    seekingDescription: '',
    experienceYears: 0,
    hourlyRate: 0,
    gender: '0',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    provinceCode: '',
    districtCode: '',
    wardCode: '',
    detailedAddress: '',
    preferredLocationsText: '',
    skillsText: '',
    isProfilePublic: false,
  });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
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

  const years = useMemo(
    () => Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 15 - i),
    []
  );

  const parseCsvText = (value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/User/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      const profile = data.workerProfile || {};
      let addressMeta = {};

      if (data.additionalInfo) {
        try {
          addressMeta = JSON.parse(data.additionalInfo);
        } catch {
          addressMeta = {};
        }
      }

      const preferredLocations = parseJsonArray(profile.preferredLocations);
      const skills = parseJsonArray(profile.skills);
      const desiredServices = parseJsonArray(profile.desiredServiceCategories);

      setAvatarUrl(data.avatarUrl || '');
      setSelectedServices(Array.isArray(desiredServices) ? desiredServices : []);
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
        bio: profile.bio || '',
        desiredJobTitle: profile.desiredJobTitle || '',
        seekingDescription: profile.seekingDescription || '',
        experienceYears: profile.experienceYears || 0,
        hourlyRate: profile.hourlyRate || 0,
        gender: data.gender !== undefined ? String(data.gender) : '0',
        dobDay: data.dateOfBirth ? String(new Date(data.dateOfBirth).getDate()) : '',
        dobMonth: data.dateOfBirth ? String(new Date(data.dateOfBirth).getMonth() + 1) : '',
        dobYear: data.dateOfBirth ? String(new Date(data.dateOfBirth).getFullYear()) : '',
        provinceCode: addressMeta.provinceCode ? String(addressMeta.provinceCode) : '',
        districtCode: addressMeta.districtCode ? String(addressMeta.districtCode) : '',
        wardCode: addressMeta.wardCode ? String(addressMeta.wardCode) : '',
        detailedAddress: addressMeta.detailedAddress || '',
        preferredLocationsText: Array.isArray(preferredLocations) ? preferredLocations.join(', ') : '',
        skillsText: Array.isArray(skills) ? skills.join(', ') : '',
        isProfilePublic: Boolean(profile.isProfilePublic),
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
    } catch {
      setErrorMsg('Không thể tải thông tin cá nhân.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }

    axios
      .get('https://provinces.open-api.vn/api/v2/?depth=1')
      .then((res) => setProvinces(res.data))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!formData.provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }

    axios
      .get(`https://provinces.open-api.vn/api/p/${formData.provinceCode}?depth=2`)
      .then((res) => setDistricts(res.data.districts || []))
      .catch(() => {});
  }, [formData.provinceCode]);

  useEffect(() => {
    if (!formData.districtCode) {
      setWards([]);
      return;
    }

    axios
      .get(`https://provinces.open-api.vn/api/d/${formData.districtCode}?depth=2`)
      .then((res) => setWards(res.data.wards || []))
      .catch(() => {});
  }, [formData.districtCode]);

  const handleChange = (event) => {
    const { id, type, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const toggleService = (serviceValue) => {
    setSelectedServices((prev) =>
      prev.includes(serviceValue)
        ? prev.filter((item) => item !== serviceValue)
        : [...prev, serviceValue]
    );
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const data = new FormData();
    data.append('file', file);

    const loadingToast = toast.loading('Đang tải ảnh lên...');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/User/uploadfile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setAvatarUrl(response.data.imgurl);
      dispatch(updateUser({ avatarUrl: response.data.imgurl }));
      toast.success('Đã cập nhật ảnh đại diện.', { id: loadingToast });
    } catch {
      toast.error('Không thể tải ảnh đại diện.', { id: loadingToast });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSendPhoneOtp = async () => {
    setIsSendingOtp(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/User/phone-verification/send`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPhoneVerification((prev) => ({ ...prev, otpSent: true }));
      toast.success(response.data.message || 'Mã OTP đã được gửi.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể gửi mã OTP.');
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
      const response = await axios.post(
        `${API_BASE_URL}/api/User/phone-verification/verify`,
        { otpCode: phoneVerification.otpCode.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const verifiedAt = new Date().toISOString();
      setPhoneVerification((prev) => ({
        ...prev,
        verified: true,
        verifiedAt,
        channel: response.data.channel || 'ZaloOA',
        otpCode: '',
        otpSent: false,
      }));
      dispatch(updateUser({
        phoneVerified: true,
        phoneVerifiedAt: verifiedAt,
        phoneVerificationChannel: response.data.channel || 'ZaloOA',
      }));
      toast.success(response.data.message || 'Xác minh số điện thoại thành công.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xác minh OTP thất bại.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMsg('');

    try {
      const provinceName = provinces.find((item) => String(item.code) === formData.provinceCode)?.name || '';
      const districtName = districts.find((item) => String(item.code) === formData.districtCode)?.name || '';
      const wardName = wards.find((item) => String(item.code) === formData.wardCode)?.name || '';

      const payload = {
        fullName: formData.name,
        email: formData.email || null,
        gender: Number(formData.gender),
        dateOfBirth:
          formData.dobYear && formData.dobMonth && formData.dobDay
            ? new Date(Number(formData.dobYear), Number(formData.dobMonth) - 1, Number(formData.dobDay)).toISOString()
            : null,
        latitude: 0,
        longitude: 0,
        avatarUrl,
        bio: formData.bio,
        desiredJobTitle: formData.desiredJobTitle,
        seekingDescription: formData.seekingDescription,
        experienceYears: Number(formData.experienceYears),
        hourlyRate: Number(formData.hourlyRate),
        isProfilePublic: formData.isProfilePublic,
        preferredLocations: parseCsvText(formData.preferredLocationsText),
        desiredServiceCategories: selectedServices,
        skills: parseCsvText(formData.skillsText),
        additionalInfo: JSON.stringify({
          provinceCode: formData.provinceCode ? Number(formData.provinceCode) : null,
          provinceName,
          districtCode: formData.districtCode ? Number(formData.districtCode) : null,
          districtName,
          wardCode: formData.wardCode ? Number(formData.wardCode) : null,
          wardName,
          detailedAddress: formData.detailedAddress,
        }),
      };

      await axios.post(`${API_BASE_URL}/api/User/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(updateUser({
        fullName: formData.name,
        email: formData.email,
        avatarUrl,
      }));
      toast.success(isWorker ? 'Đã cập nhật hồ sơ người tìm việc.' : 'Đã cập nhật thông tin cá nhân.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể lưu thay đổi.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="state-center" style={{ padding: '6rem 0' }}>
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="mt-2">Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="dashboard-title">Thông Tin Cá Nhân</h2>
      <p className="dashboard-subtitle">
        Quản lý hồ sơ, thông tin liên hệ và trạng thái công khai của bạn.
      </p>

      {errorMsg && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      <div style={{ maxWidth: '860px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: '3px solid #fff',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={40} color="#94a3b8" />
            )}
          </div>
          <div>
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              Chọn ảnh đại diện mới
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarUpload}
            />
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              JPG, PNG hoặc GIF. Tối đa 5MB.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <Input id="name" label="Họ và tên" icon={<User size={18} />} value={formData.name} onChange={handleChange} required />
            <Input id="email" label="Địa chỉ email" type="email" icon={<Mail size={18} />} value={formData.email} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1rem' }}>
            <Input id="phone" label="Số điện thoại" icon={<Phone size={18} />} value={formData.phone} disabled />
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ngày sinh</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select id="dobDay" value={formData.dobDay} onChange={handleChange} className="input-field">
                  <option value="">Ngày</option>
                  {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <select id="dobMonth" value={formData.dobMonth} onChange={handleChange} className="input-field">
                  <option value="">Tháng</option>
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </select>
                <select id="dobYear" value={formData.dobYear} onChange={handleChange} className="input-field">
                  <option value="">Năm</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              background: phoneVerification.verified ? 'rgba(39, 174, 96, 0.05)' : 'rgba(47, 128, 237, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {phoneVerification.verified ? <BadgeCheck size={18} color="#27AE60" /> : <ShieldCheck size={18} color="#2F80ED" />}
                  Xác minh số điện thoại
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      backgroundColor: phoneVerification.verified ? 'rgba(39, 174, 96, 0.12)' : 'rgba(242, 153, 74, 0.14)',
                      color: phoneVerification.verified ? 'var(--status-success)' : '#B45309',
                    }}
                  >
                    {phoneVerification.verified ? 'Đã xác thực' : 'Chưa xác thực'}
                  </span>
                </div>
                <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  {phoneVerification.verified
                    ? `Đã xác minh${phoneVerification.verifiedAt ? ` lúc ${new Date(phoneVerification.verifiedAt).toLocaleString('vi-VN')}` : ''}${phoneVerification.channel ? ` qua ${phoneVerification.channel}` : ''}.`
                    : 'Gửi OTP để xác minh số điện thoại cho các thông báo sau này.'}
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
                    label="Nhập mã OTP"
                    placeholder="6 số OTP"
                    value={phoneVerification.otpCode}
                    onChange={(event) =>
                      setPhoneVerification((prev) => ({ ...prev, otpCode: event.target.value }))
                    }
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button type="button" variant="primary" onClick={handleVerifyPhoneOtp} disabled={isVerifyingOtp}>
                    {isVerifyingOtp ? 'Đang xác minh...' : 'Xác minh'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Giới tính</label>
            <select id="gender" className="input-field" value={formData.gender} onChange={handleChange}>
              <option value="0">Nam</option>
              <option value="1">Nữ</option>
              <option value="2">Khác</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tỉnh / Thành phố</label>
              <select id="provinceCode" value={formData.provinceCode} onChange={handleChange} className="input-field">
                <option value="">Chọn tỉnh / thành</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Quận / Huyện</label>
              <select id="districtCode" value={formData.districtCode} onChange={handleChange} className="input-field">
                <option value="">Chọn quận / huyện</option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phường / Xã</label>
              <select id="wardCode" value={formData.wardCode} onChange={handleChange} className="input-field">
                <option value="">Chọn phường / xã</option>
                {wards.map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <Input
              id="detailedAddress"
              label="Địa chỉ chi tiết"
              icon={<MapPin size={18} />}
              value={formData.detailedAddress}
              onChange={handleChange}
            />
          </div>

          {isWorker && (
            <div style={{ marginBottom: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ margin: 0 }}>Hồ sơ tìm việc</h3>
                  <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-muted)' }}>
                    Lưu nháp hoặc công khai để chủ nhà thấy bạn đang tìm công việc gì.
                  </p>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <input
                    id="isProfilePublic"
                    type="checkbox"
                    checked={formData.isProfilePublic}
                    onChange={handleChange}
                  />
                  {formData.isProfilePublic ? 'Đang công khai' : 'Đang lưu nháp'}
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <Input
                  id="desiredJobTitle"
                  label="Bạn đang tìm việc gì?"
                  placeholder="Ví dụ: Giúp việc theo giờ, chăm bé..."
                  value={formData.desiredJobTitle}
                  onChange={handleChange}
                />
                <Input
                  id="hourlyRate"
                  label="Mức giá mong muốn (đ/giờ)"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                />
                <Input
                  id="experienceYears"
                  label="Số năm kinh nghiệm"
                  type="number"
                  value={formData.experienceYears}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Mô tả ngắn khi đi tìm việc</label>
                <textarea
                  id="seekingDescription"
                  className="input-field"
                  style={{ width: '100%', minHeight: '96px', padding: '0.75rem', resize: 'vertical' }}
                  placeholder="Mô tả rõ bạn muốn làm theo ca nào, khu vực nào, điểm mạnh của bạn..."
                  value={formData.seekingDescription}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Giới thiệu bản thân</label>
                <textarea
                  id="bio"
                  className="input-field"
                  style={{ width: '100%', minHeight: '120px', padding: '0.75rem', resize: 'vertical' }}
                  placeholder="Giới thiệu kinh nghiệm làm việc, tính cách và điểm mạnh của bạn..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Khu vực muốn làm</label>
                <Input
                  id="preferredLocationsText"
                  placeholder="Ví dụ: Quận 7, Bình Thạnh, Thủ Đức"
                  value={formData.preferredLocationsText}
                  onChange={handleChange}
                />
                <p style={{ margin: '0.4rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Nhập nhiều khu vực, cách nhau bằng dấu phẩy.
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Kỹ năng nổi bật</label>
                <Input
                  id="skillsText"
                  placeholder="Ví dụ: Nấu ăn, chăm bé, dọn dẹp kỹ"
                  value={formData.skillsText}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>Loại dịch vụ mong muốn</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {SERVICE_OPTIONS.map((service) => {
                    const active = selectedServices.includes(service.value);
                    return (
                      <button
                        key={service.value}
                        type="button"
                        onClick={() => toggleService(service.value)}
                        style={{
                          border: active ? '1px solid #2F80ED' : '1px solid var(--border-color)',
                          background: active ? 'rgba(47, 128, 237, 0.1)' : 'white',
                          color: active ? '#2F80ED' : 'var(--text-main)',
                          borderRadius: '999px',
                          padding: '0.55rem 0.9rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {service.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button type="button" variant="outline" onClick={fetchProfile}>
              Huỷ bỏ
            </Button>
            <Button type="submit" variant="primary" icon={<Save size={18} />} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;

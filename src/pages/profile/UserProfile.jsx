import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { User, Phone, MapPin, Mail, Save, Loader2, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const UserProfile = () => {
  const { token, user } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: 'Chưa cập nhật',
    bio: '',
    experienceYears: 0,
    hourlyRate: 0,
    gender: '0',
    dateOfBirth: '',
    latitude: 1,
    longitude: 1
  });


  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://localhost:7004/api/User/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data;
      const genderMapRecv = { "Any": "0", "Male": "1", "Female": "2" };
      setFormData({
        name: data.fullName || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.additionalInfo || 'Chưa cập nhật',
        bio: data.workerProfile?.bio || '',
        experienceYears: data.workerProfile?.experienceYears || 0,
        hourlyRate: data.workerProfile?.hourlyRate || 0,
        gender: genderMapRecv[data.gender] || '0',
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        latitude: data.latitude || 1,
        longitude: data.longitude || 1
      });


    } catch (err) {
      setErrorMsg('Không thể tải thông tin cá nhân.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.id]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    try {
      const payload = {
        fullName: formData.name,
        email: formData.email,
        bio: formData.bio,
        experienceYears: Number(formData.experienceYears),
        hourlyRate: Number(formData.hourlyRate),
        gender: Number(formData.gender),
        dateOfBirth: formData.dateOfBirth || null,
        latitude: Number(formData.latitude) || 1,
        longitude: Number(formData.longitude) || 1,
        additionalInfo: formData.address
      };


      
      await axios.post('https://localhost:7004/api/User/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Đã cập nhật thông tin thành công!');
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể lưu thay đổi.');
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <Input 
              id="phone" 
              label="Số điện thoại" 
              icon={<Phone size={18} />} 
              value={formData.phone}
              disabled
            />
            <Input 
              id="dateOfBirth" 
              label="Ngày sinh" 
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
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

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
             <Input 
                id="address" 
                label="Địa chỉ hiện tại" 
                icon={<MapPin size={18} />} 
                value={formData.address}
                onChange={handleChange}
              />
              <Input 
                id="latitude" 
                label="Vĩ độ" 
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={handleChange}
              />
              <Input 
                id="longitude" 
                label="Kinh độ" 
                type="number"
                step="0.000001"
                value={formData.longitude}
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
                ></textarea>
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

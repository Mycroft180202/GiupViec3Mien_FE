import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Phone, MapPin, Mail, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const UserProfile = () => {
  const { user } = useSelector(state => state.auth);
  
  // Local state for editing form
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: 'Chưa cập nhật',
    bio: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Mock save logic
    setTimeout(() => {
      setIsSaving(false);
      alert('Đã cập nhật thông tin thành công!');
    }, 800);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="dashboard-title">Thông Tin Cá Nhân</h2>
      <p className="dashboard-subtitle">Quản lý hồ sơ và thông tin liên hệ của bạn.</p>

      <div style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSave}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
             <Input 
                id="name" 
                label="Họ và Tên" 
                icon={<User size={18} />} 
                value={formData.name}
                onChange={handleChange}
                required
              />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <Input 
              id="phone" 
              label="Số điện thoại" 
              icon={<Phone size={18} />} 
              value={formData.phone}
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
              disabled // Assuming email cannot be changed easily
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
             <Input 
                id="address" 
                label="Địa chỉ hiện tại" 
                icon={<MapPin size={18} />} 
                value={formData.address}
                onChange={handleChange}
              />
          </div>

          {user?.role === 'worker' && (
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Giới thiệu bản thân (Kinh nghiệm)
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
          )}

          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
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

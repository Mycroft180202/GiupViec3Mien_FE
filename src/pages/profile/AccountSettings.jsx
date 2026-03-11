import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Lock, Bell, Shield, Key } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';

const AccountSettings = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useSelector(state => state.auth);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }
    alert('Đổi mật khẩu thành công!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="animate-fade-in">
      <h2 className="dashboard-title">Cài Đặt Tài Khoản</h2>
      <p className="dashboard-subtitle">Quản lý bảo mật, thông báo và các tùy chọn cá nhân.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
        
        {/* Security Section */}
        <Card>
          <CardBody>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <Lock size={20} className="text-primary" />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Đổi Mật Khẩu</h3>
            </div>
            
            <form onSubmit={handlePasswordChange} style={{ maxWidth: '400px' }}>
              <div style={{ marginBottom: '1rem' }}>
                <Input 
                  id="currentPassword" 
                  label="Mật khẩu hiện tại" 
                  type="password" 
                  icon={<Key size={18} />}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <Input 
                  id="newPassword" 
                  label="Mật khẩu mới" 
                  type="password" 
                  icon={<Shield size={18} />}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <Input 
                  id="confirmPassword" 
                  label="Xác nhận mật khẩu mới" 
                  type="password" 
                  icon={<Shield size={18} />}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="primary">Cập nhật mật khẩu</Button>
            </form>
          </CardBody>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardBody>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <Bell size={20} className="text-primary" />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Tùy Chọn Thông Báo</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <span>Nhận email khi có người ứng tuyển / Lời mời làm việc</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <span>Nhận thông báo đẩy (Push notification) trên trình duyệt</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" />
                <span>Nhận tin nhắn SMS (Chỉ áp dụng cho thuê bao Viettel/Mobi)</span>
              </label>
            </div>
          </CardBody>
        </Card>

      </div>
    </div>
  );
};

export default AccountSettings;

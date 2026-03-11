import React from 'react';
import { User, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const MOCK_CANDIDATES = [
  { id: 1, name: 'Nguyễn Thị Hoa', age: 45, experience: '5 năm', jobTitle: 'Cần người phụ việc nhà theo giờ', status: 'Chờ duyệt', avatar: 'H' },
  { id: 2, name: 'Trần Văn Bình', age: 32, experience: '3 năm', jobTitle: 'Đón bé đi học về các buổi chiều', status: 'Đã nhận', avatar: 'B' },
  { id: 3, name: 'Lê Thị Cúc', age: 50, experience: '10 năm', jobTitle: 'Cần người phụ việc nhà theo giờ', status: 'Từ chối', avatar: 'C' },
];

const EmployerCandidates = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="dashboard-title">Hồ Sơ Ứng Viên</h2>
      <p className="dashboard-subtitle">Quản lý và xét duyệt những người lao động đã ứng tuyển vào thông báo của bạn.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {MOCK_CANDIDATES.map(candidate => (
          <Card key={candidate.id} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardBody style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {candidate.avatar}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{candidate.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{candidate.age} tuổi • {candidate.experience} kinh nghiệm</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  <strong>Ứng tuyển:</strong> {candidate.jobTitle}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                   <span style={{ 
                     display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem',
                     backgroundColor: candidate.status === 'Chờ duyệt' ? 'rgba(242, 153, 74, 0.1)' : candidate.status === 'Đã nhận' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(235, 87, 87, 0.1)',
                     color: candidate.status === 'Chờ duyệt' ? '#D97706' : candidate.status === 'Đã nhận' ? 'var(--status-success)' : 'var(--status-error)'
                   }}>
                     {candidate.status === 'Chờ duyệt' && 'Chờ Xét Duyệt'}
                     {candidate.status === 'Đã nhận' && 'Đã Nhận Làm'}
                     {candidate.status === 'Từ chối' && 'Đã Từ Chối'}
                   </span>
                </div>
              </div>

              {candidate.status === 'Chờ duyệt' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
                  <Button variant="outline" style={{ color: 'var(--status-error)', borderColor: 'var(--status-error)' }} icon={<XCircle size={16}/>}>Từ chối</Button>
                  <Button variant="primary" style={{ backgroundColor: 'var(--status-success)', borderColor: 'var(--status-success)' }} icon={<CheckCircle size={16}/>}>Nhận</Button>
                </div>
              )}
              {candidate.status === 'Đã nhận' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
                  <Button variant="outline" icon={<Phone size={16}/>}>Gọi</Button>
                  <Button variant="outline" icon={<Mail size={16}/>}>Nhắn tin</Button>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployerCandidates;

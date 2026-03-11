import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Eye, Trash2 } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Mock active jobs for demonstration
const MOCK_MY_JOBS = [
  { id: 1, title: 'Cần người phụ việc nhà theo giờ', type: 'Giúp việc theo giờ', appliedCount: 3, status: 'Đang Tới' },
  { id: 2, title: 'Đón bé đi học về các buổi chiều', type: 'Chăm sóc trẻ em', appliedCount: 0, status: 'Đang Tuyển' },
];

const EmployerDashboard = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="dashboard-title">Quản Lý Tin Đăng</h2>
          <p className="dashboard-subtitle" style={{ marginBottom: 0 }}>Theo dõi trạng thái và ứng viên cho các công việc bạn đã đăng.</p>
        </div>
        <Link to="/dang-tin" style={{ textDecoration: 'none' }}>
           <Button variant="primary" icon={<Briefcase size={18} />}>Đăng Tin Mới</Button>
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {MOCK_MY_JOBS.map(job => (
          <Card key={job.id}>
            <CardBody style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
               <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>Loại: {job.type}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{job.appliedCount} người ứng tuyển</span>
                  </div>
               </div>
               
               <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '100px', 
                    fontSize: '0.85rem', 
                    fontWeight: 600,
                    backgroundColor: job.status === 'Đang Tuyển' ? 'rgba(47, 128, 237, 0.1)' : 'rgba(242, 153, 74, 0.1)',
                    color: job.status === 'Đang Tuyển' ? 'var(--primary-color)' : '#D97706'
                  }}>
                    {job.status}
                  </span>
                  <Link to={`/viec-lam/${job.id}`}>
                    <Button variant="outline" size="sm" icon={<Eye size={16} />}>Xem</Button>
                  </Link>
                  <Button variant="ghost" size="sm" style={{ color: 'var(--status-error)' }}><Trash2 size={18} /></Button>
               </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployerDashboard;

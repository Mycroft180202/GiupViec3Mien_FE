import React from 'react';
import { Link } from 'react-router-dom';
import { History, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const MOCK_APPLIED_JOBS = [
  { id: 3, title: 'Chăm người già ốm tại bệnh viện', employer: 'Chú Hùng', appliedAt: 'Hôm qua', status: 'Đã Nhận', price: '400,000đ/ngày' },
  { id: 1, title: 'Cần người phụ việc nhà theo giờ', employer: 'Chị Lan', appliedAt: '2 giờ trước', status: 'Chờ Duyệt', price: '60,000đ/giờ' },
  { id: 5, title: 'Dọn dẹp văn phòng sáng sớm', employer: 'Công ty ABC', appliedAt: 'Tuần trước', status: 'Từ Chối', price: '50,000đ/giờ' },
];

const getStatusBadge = (status) => {
  switch(status) {
    case 'Đã Nhận': return { icon: <CheckCircle2 size={16}/>, color: 'var(--status-success)', bg: 'rgba(39, 174, 96, 0.1)' };
    case 'Chờ Duyệt': return { icon: <Clock size={16}/>, color: '#D97706', bg: 'rgba(242, 153, 74, 0.1)' };
    case 'Từ Chối': return { icon: <XCircle size={16}/>, color: 'var(--status-error)', bg: 'rgba(235, 87, 87, 0.1)' };
    default: return { icon: <Clock size={16}/>, color: 'var(--text-muted)', bg: 'var(--bg-main)' };
  }
};

const WorkerDashboard = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="dashboard-title">Việc Đã Ứng Tuyển</h2>
      <p className="dashboard-subtitle">Theo dõi trạng thái các công việc bạn đã gửi yêu cầu.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {MOCK_APPLIED_JOBS.map(job => {
          const badge = getStatusBadge(job.status);
          return (
            <Card key={job.id}>
              <CardBody style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
                <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>{job.title}</h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <span>Chủ nhà: <strong>{job.employer}</strong></span>
                      <span>•</span>
                      <span>Ngày ứng tuyển: {job.appliedAt}</span>
                    </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-color)' }}>{job.price}</div>
                    <span style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.25rem',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      backgroundColor: badge.bg,
                      color: badge.color
                    }}>
                      {badge.icon} {job.status}
                    </span>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WorkerDashboard;

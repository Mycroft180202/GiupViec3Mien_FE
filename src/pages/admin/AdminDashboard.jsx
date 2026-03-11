import React from 'react';
import { Users, Briefcase, DollarSign, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';

const STATS = [
  { title: 'Tổng Người Dùng', value: '1,245', change: '+12%', icon: <Users size={24}/>, color: 'var(--primary-color)' },
  { title: 'Việc Làm Đang Tuyển', value: '384', change: '+5%', icon: <Briefcase size={24}/>, color: '#D97706' },
  { title: 'Giao Dịch (VNĐ)', value: '45.2M', change: '+24%', icon: <DollarSign size={24}/>, color: 'var(--status-success)' },
  { title: 'Cần Duyệt Gấp', value: '12', change: '-2', icon: <AlertCircle size={24}/>, color: 'var(--status-error)' },
];

const RECENT_ACTIVITIES = [
  { id: 1, action: 'Người dùng mới đăng ký', target: 'Trần Thị B', time: '5 phút trước', type: 'user' },
  { id: 2, action: 'Tin tuyển dụng mới cần duyệt', target: 'Tìm người dọn dẹp theo giờ', time: '12 phút trước', type: 'job' },
  { id: 3, action: 'Báo cáo vi phạm', target: 'Tài khoản "User123"', time: '1 giờ trước', type: 'alert' },
  { id: 4, action: 'Thanh toán phí dịch vụ', target: 'Đơn hàng #8921', time: '2 giờ trước', type: 'payment' },
];

const AdminDashboard = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="dashboard-title">Tổng Quan Hệ Thống</h2>
      <p className="dashboard-subtitle">Theo dõi các chỉ số quan trọng và hoạt động gần đây của nền tảng.</p>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {STATS.map((stat, idx) => (
          <Card key={idx} style={{ borderLeft: `4px solid ${stat.color}` }}>
            <CardBody style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.title}</p>
                  <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)' }}>{stat.value}</h3>
                </div>
                <div style={{
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                  padding: '0.75rem',
                  borderRadius: '12px'
                }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '1rem', fontSize: '0.85rem' }}>
                 <TrendingUp size={14} color={stat.change.startsWith('+') ? 'var(--status-success)' : 'var(--status-error)'} />
                 <span style={{ color: stat.change.startsWith('+') ? 'var(--status-success)' : 'var(--status-error)', fontWeight: 600 }}>
                   {stat.change}
                 </span>
                 <span style={{ color: 'var(--text-muted)' }}>so với tuần trước</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Two Column Layout for Charts/Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <Card>
          <CardBody>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <Activity size={20} className="text-primary"/>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Hoạt động gần đây</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {RECENT_ACTIVITIES.map(activity => (
                <div key={activity.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: 500, color: 'var(--text-main)' }}>{activity.action}</p>
                    <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 600 }}>{activity.target}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activity.time}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

    </div>
  );
};

export default AdminDashboard;

import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';

const MOCK_SCHEDULE = [
  { id: 1, date: 'Hôm nay, 12/03', time: '14:00 - 18:00', title: 'Dọn dẹp nhà chung cư', location: 'Quận Cầu Giấy, Hà Nội', employer: 'Chị Mai', status: 'Sắp tới' },
  { id: 2, date: 'Ngày mai, 13/03', time: '08:00 - 12:00', title: 'Chăm sóc người già', location: 'Quận Đống Đa, Hà Nội', employer: 'Chú Hùng', status: 'Lên lịch' },
  { id: 3, date: 'Thứ 6, 15/03', time: '17:00 - 20:00', title: 'Đón bé và nấu ăn tối', location: 'Quận Nam Từ Liêm, Hà Nội', employer: 'Chị Lan', status: 'Lên lịch' },
];

const WorkerSchedule = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="dashboard-title">Lịch Làm Việc</h2>
      <p className="dashboard-subtitle">Theo dõi các ca làm việc sắp tới của bạn.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
        {MOCK_SCHEDULE.map(item => (
          <Card key={item.id} style={{ borderLeft: item.status === 'Sắp tới' ? '4px solid var(--primary-color)' : '4px solid transparent' }}>
            <CardBody style={{ padding: '1.25rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              
              <div style={{ 
                minWidth: '120px', 
                textAlign: 'center', 
                padding: '1rem', 
                backgroundColor: item.status === 'Sắp tới' ? 'rgba(47, 128, 237, 0.1)' : 'var(--bg-main)', 
                borderRadius: '8px',
                color: item.status === 'Sắp tới' ? 'var(--primary-color)' : 'var(--text-main)'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.date.split(', ')[1]}</div>
                <div style={{ fontSize: '0.85rem' }}>{item.date.split(', ')[0]}</div>
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.title}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16}/> {item.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16}/> {item.employer}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1' }}><MapPin size={16}/> {item.location}</span>
                </div>
              </div>

            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Quick inline icon just for this component since it's missing from import above
const User = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

export default WorkerSchedule;

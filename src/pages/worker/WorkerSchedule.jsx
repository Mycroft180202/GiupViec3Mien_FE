import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Calendar, Clock, MapPin, User, Loader2, AlertCircle, CalendarRange } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const MOCK_SCHEDULE = [
  { id: 1, date: 'Hôm nay, 12/03', time: '14:00 - 18:00', title: 'Dọn dẹp nhà chung cư', location: 'Quận Cầu Giấy, Hà Nội', employer: 'Chị Mai', status: 'Sắp tới' },
  { id: 2, date: 'Ngày mai, 13/03', time: '08:00 - 12:00', title: 'Chăm sóc người già', location: 'Quận Đống Đa, Hà Nội', employer: 'Chú Hùng', status: 'Lên lịch' },
  { id: 3, date: 'Thứ 6, 15/03', time: '17:00 - 20:00', title: 'Đón bé và nấu ăn tối', location: 'Quận Nam Từ Liêm, Hà Nội', employer: 'Chị Lan', status: 'Lên lịch' },
];

const WorkerSchedule = () => {
  const { token } = useSelector(state => state.auth);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSchedule = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get('https://localhost:7004/api/Worker/jobschedule', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedule(response.data);
    } catch {
      setErrorMsg('Không thể tải lịch làm việc.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchSchedule();
  }, [token]);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    
    const prefix = isToday ? 'Hôm nay' : 'Ngày';
    return `${prefix}, ${day}/${month}`;
  };

  if (isLoading) return (
    <div className="state-center" style={{ padding: '6rem 0' }}>
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="mt-2">Đang tải lịch làm việc...</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="dashboard-title">Lịch Làm Việc</h2>
      <p className="dashboard-subtitle">Theo dõi các ca làm việc sắp tới của bạn.</p>

      {errorMsg && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {schedule.length === 0 ? (
        <div className="state-center" style={{ padding: '4rem 0', backgroundColor: '#fff', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
          <CalendarRange size={64} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Bạn hiện không có ca làm việc nào được lên lịch.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
          {schedule.map(item => (
            <Card key={item.id} style={{ borderLeft: '4px solid var(--primary-color)' }}>
              <CardBody style={{ padding: '1.25rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                
                <div style={{ 
                  minWidth: '120px', 
                  textAlign: 'center', 
                  padding: '1rem', 
                  backgroundColor: 'rgba(47, 128, 237, 0.1)', 
                  borderRadius: '8px',
                  color: 'var(--primary-color)'
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                    {formatDate(item.createdAt).split(', ')[1]}
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    {formatDate(item.createdAt).split(', ')[0]}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.title}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <Clock size={16}/> {item.workingTimeDescription || 'Chưa rõ giờ'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <User size={16}/> {item.employerName || 'Chủ thuê'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1', marginTop: '0.25rem' }}>
                        <MapPin size={16} style={{color: 'var(--primary-color)'}}/> {item.location}
                    </span>
                  </div>
                </div>

              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};


export default WorkerSchedule;

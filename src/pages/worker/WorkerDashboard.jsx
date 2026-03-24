import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { AlertCircle, CheckCircle2, Clock, FileSearch, Loader2, XCircle } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7004';

const getStatusBadge = status => {
  switch (status) {
    case 1:
    case 'Accepted':
      return {
        label: 'Đã nhận',
        icon: <CheckCircle2 size={16} />,
        color: 'var(--status-success)',
        bg: 'rgba(39, 174, 96, 0.1)',
      };
    case 2:
    case 'Rejected':
      return {
        label: 'Bị từ chối',
        icon: <XCircle size={16} />,
        color: '#dc2626',
        bg: 'rgba(220, 38, 38, 0.1)',
      };
    default:
      return {
        label: 'Chờ duyệt',
        icon: <Clock size={16} />,
        color: '#D97706',
        bg: 'rgba(242, 153, 74, 0.1)',
      };
  }
};

const formatTimeDiff = dateString => {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} ngày trước`;
  if (hours > 0) return `${hours} giờ trước`;
  if (mins > 0) return `${mins} phút trước`;
  return 'Vừa xong';
};

const WorkerDashboard = () => {
  const { token } = useSelector(state => state.auth);
  const [apps, setApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchApplications = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get(`${apiBaseUrl}/api/Job/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApps(response.data);
    } catch (err) {
      setErrorMsg('Không thể tải danh sách ứng tuyển. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchApplications();
  }, [token]);

  if (isLoading) {
    return (
      <div className="state-center" style={{ padding: '6rem 0' }}>
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="mt-2">Đang tải danh sách công việc...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="state-center" style={{ padding: '6rem 0' }}>
        <AlertCircle size={48} style={{ color: '#dc2626' }} />
        <p className="mt-2">{errorMsg}</p>
        <Button variant="outline" className="mt-4" onClick={fetchApplications}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="dashboard-title">Việc Đã Ứng Tuyển</h2>
      <p className="dashboard-subtitle">Theo dõi trạng thái các công việc bạn đã gửi yêu cầu.</p>

      {apps.length === 0 ? (
        <div className="state-center" style={{ padding: '4rem 0', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
          <FileSearch size={64} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Bạn chưa ứng tuyển công việc nào.</p>
          <Link to="/tim-viec" className="mt-4">
            <Button variant="primary">Tìm việc ngay</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {apps.map(app => {
            const badge = getStatusBadge(app.status ?? (app.isAccepted ? 'Accepted' : 'Pending'));
            return (
              <Card key={app.id}>
                <CardBody style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
                  <div style={{ flex: 1 }}>
                    <Link to={`/viec-lam/${app.jobId}`} style={{ textDecoration: 'none' }}>
                      <h3 className="hover-text-primary" style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                        {app.jobTitle}
                      </h3>
                    </Link>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span>Lương gốc: {Number(app.jobPrice).toLocaleString()}đ</span>
                      <span>•</span>
                      <span>Ngày ứng tuyển: {formatTimeDiff(app.appliedAt)}</span>
                      {app.availableStartDate && (
                        <>
                          <span>•</span>
                          <span>Bắt đầu được từ: {String(app.availableStartDate).slice(0, 10)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', marginLeft: '1rem' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                      {Number(app.bidPrice).toLocaleString()}đ
                    </div>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {badge.icon} {badge.label}
                    </span>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;

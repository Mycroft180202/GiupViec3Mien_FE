import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Briefcase, Eye, Trash2, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const EmployerDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchJobs = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get('https://localhost:7004/api/Job/my-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data);
    } catch (err) {
      setErrorMsg('Không thể tải danh sách tin đăng. Vui lòng thử lại sau.');
      console.error('Fetch Jobs Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchJobs();
  }, [token]);

  const getCategoryLabel = (cat) => {
    const labels = {
      0: 'Giúp việc nhà',
      1: 'Trông trẻ',
      2: 'Chăm sóc người già',
      3: 'Nấu ăn',
      4: 'Tạp vụ',
      Housekeeping: 'Giúp việc nhà',
      Babysitting: 'Trông trẻ',
      ElderCare: 'Chăm sóc người già',
    };
    return labels[cat] || 'Khác';
  };

  const getStatusLabel = (status) => {
    const labels = {
      0: 'Đang tuyển',
      1: 'Đang thực hiện',
      2: 'Hoàn thành',
      3: 'Đã hủy',
      Open: 'Đang tuyển',
      InProgress: 'Đang thực hiện',
      Assigned: 'Đang thực hiện',
      Completed: 'Hoàn thành',
      Cancelled: 'Đã hủy',
    };
    return labels[status] || 'Đang xử lý';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tin đăng này?')) return;
    try {
      await axios.delete(`https://localhost:7004/api/Job/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      alert('Không thể xóa tin. Vui lòng thử lại.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 className="dashboard-title">Việc Đã Đăng</h2>
          <p className="dashboard-subtitle" style={{ marginBottom: 0 }}>
            Theo dõi tin đăng, hồ sơ ứng tuyển và danh sách ứng viên matching cho từng công việc.
          </p>
        </div>
        <Link to="/dang-tin" style={{ textDecoration: 'none' }}>
          <Button variant="primary" icon={<Briefcase size={18} />}>Đăng Tin Mới</Button>
        </Link>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Loader2 className="animate-spin" size={32} style={{ color: 'var(--primary-color)', margin: '0 auto 1rem' }} />
          <p>Đang tải danh sách việc đã đăng...</p>
        </div>
      ) : errorMsg ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '12px', color: '#dc2626' }}>
          <AlertCircle size={40} style={{ marginBottom: '1rem' }} />
          <p>{errorMsg}</p>
          <Button variant="outline" size="sm" onClick={fetchJobs} style={{ marginTop: '1rem' }}>Thử lại</Button>
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
          <Briefcase size={48} style={{ color: '#cbd5e1', marginBottom: '1.5rem', display: 'block', margin: '0 auto 1.5rem' }} />
          <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Bạn chưa đăng tin nào</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Hãy đăng tin đầu tiên để tìm kiếm người làm phù hợp nhất.</p>
          <Link to="/dang-tin">
            <Button variant="primary">Đăng Tin Ngay</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardBody style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span>Loại: {getCategoryLabel(job.serviceCategory)}</span>
                    <span>{job.applicantCount} người ứng tuyển</span>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Sparkles size={14} /> Có matching theo job
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '100px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    backgroundColor: job.status === 0 || job.status === 'Open' ? 'rgba(47, 128, 237, 0.1)' : 'rgba(242, 153, 74, 0.1)',
                    color: job.status === 0 || job.status === 'Open' ? 'var(--primary-color)' : '#D97706',
                  }}>
                    {getStatusLabel(job.status)}
                  </span>
                  <Link to={`/ung-tuyen-viec-lam/${job.id}`}>
                    <Button variant="outline" size="sm" icon={<Eye size={16} />}>Xem ứng viên</Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(job.id)}
                    style={{ color: 'var(--status-error)' }}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { MapPin, Clock, Briefcase, Star, User, Calendar, DollarSign, ShieldCheck, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector(state => state.auth);
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchJobDetails = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // Endpoint: GET /api/Job/{id}
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(`https://localhost:7004/api/Job/${id}`, config);
      setJob(response.data);
    } catch (err) {
      console.error('Fetch Job Error:', err);
      setErrorMsg('Không thể tải thông tin công việc. Tin đăng này có thể không tồn tại hoặc đã bị gỡ.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const getCategoryLabel = (cat) => {
    const labels = {
      0: 'Giúp việc nhà',
      1: 'Trông trẻ',
      2: 'Chăm sóc người già',
      3: 'Nấu ăn',
      4: 'Tạp vụ',
      'Housekeeping': 'Giúp việc nhà',
      'Babysitting': 'Trông trẻ'
    };
    return labels[cat] || 'Công việc chung';
  };

  const getTimingLabel = (timing) => {
    const labels = { 0: '/ tháng', 1: '/ giờ', 2: '/ buổi', 'FullTime': '/ tháng', 'PartTime': '/ giờ' };
    return labels[timing] || '/ lượt';
  };

  const getStatusLabel = (status) => {
    const labels = { 0: 'Đang Tuyển', 1: 'Đã Nhận Việc', 2: 'Hoàn Thành', 3: 'Đã Hủy', 'Open': 'Đang Tuyển' };
    return labels[status] || 'Hết Hạn';
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để ứng tuyển!');
      navigate('/dang-nhap');
      return;
    }
    if (user?.role === 'employer') {
      alert('Tài khoản Chủ thuê không thể ứng tuyển việc làm. Vui lòng đăng ký tài khoản Người tìm việc.');
      return;
    }
    navigate(`/viec-lam/${id}/apply`);
  };

  if (isLoading) return (
    <div className="state-center container" style={{ padding: '8rem 0' }}>
      <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
      <p>Đang tải thông tin chi tiết công việc...</p>
    </div>
  );

  if (errorMsg || !job) return (
    <div className="state-center container" style={{ padding: '8rem 0' }}>
      <AlertCircle size={64} style={{ color: '#dc2626', marginBottom: '1.5rem' }} />
      <h3>Lỗi tải trang</h3>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto 2rem' }}>{errorMsg}</p>
      <Link to="/tim-viec">
        <Button variant="outline"><ArrowLeft size={18} /> Quay lại tìm việc</Button>
      </Link>
    </div>
  );

  return (
    <div className="job-detail-page container">
      <Link to="/tim-viec" className="back-link">
        <ArrowLeft size={18} /> Quay lại danh sách
      </Link>

      <div className="job-detail-layout">
        {/* Main Content Area */}
        <div className="job-main-content">
          <Card className="job-header-card">
            <CardBody>
              <div className="job-title-wrapper">
                <h1 className="job-title">{job.title}</h1>
                <span className="job-status-badge">{getStatusLabel(job.status)}</span>
              </div>
              
              <div className="job-meta-row">
                <span className="meta-badge"><Briefcase size={16}/> {getCategoryLabel(job.serviceCategory)}</span>
                <span className="meta-badge alert"><Clock size={16}/> {job.workingTimeDescription || 'Lịch linh hoạt'}</span>
              </div>

              <div className="job-price-highlight">
                <div className="price-box">
                  <DollarSign size={24} className="text-primary" />
                  <div>
                    <span className="price-amount">{Number(job.price).toLocaleString()}đ</span>
                    <span className="price-unit">{getTimingLabel(job.timingType)}</span>
                  </div>
                </div>
                
                <Button variant="primary" size="lg" className="apply-btn-desktop" onClick={handleApply}>
                  Ứng Tuyển Ngay
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="job-info-card mt-4">
            <CardBody>
              <h3 className="section-title">Mô tả công việc</h3>
              <div className="job-description-text">
                {job.description.split('\n').map((line, idx) => (
                  line.trim() === '' ? <br key={idx} /> : <p key={idx}>{line}</p>
                ))}
              </div>

              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <>
                  <h3 className="section-title mt-4">Kỹ năng yêu cầu</h3>
                  <div className="skills-badge-list mt-2" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {job.requiredSkills.map((skill, idx) => (
                      <span key={idx} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#f1f5f9', borderRadius: '100px', fontSize: '0.85rem' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar Cards */}
        <div className="job-sidebar">
          {/* Employer Info */}
          <Card className="employer-card">
            <CardHeader>
              <h3 className="sidebar-title">Thông tin người đăng</h3>
            </CardHeader>
            <CardBody>
              <div className="employer-profile">
                <div className="employer-avatar">
                  {job.employerAvatarUrl ? <img src={job.employerAvatarUrl} alt="" /> : <User size={32} />}
                </div>
                <div className="employer-details">
                  <h4 className="employer-name">{job.employerName}</h4>
                  <div className="employer-rating">
                    <Star size={16} fill="var(--status-warning)" className="text-warning"/> 
                    <span>4.9 (Đánh giá tốt)</span>
                  </div>
                </div>
              </div>
              
              <div className="verification-badge mt-2">
                <ShieldCheck size={16} /> Đã xác thực tài khoản
              </div>
              <p className="employer-join-date mt-2">Đăng ký từ: {new Date(job.createdAt).getFullYear()}</p>
            </CardBody>
          </Card>

          {/* Job Meta Info */}
          <Card className="job-meta-card mt-4">
             <CardHeader>
              <h3 className="sidebar-title">Tổng quan thời gian</h3>
            </CardHeader>
            <CardBody>
              <div className="meta-list">
                <div className="meta-list-item">
                  <MapPin className="text-primary" size={20} />
                  <div>
                    <strong>Địa điểm:</strong>
                    <p>{job.location}</p>
                  </div>
                </div>
                <div className="meta-list-item">
                  <Calendar className="text-primary" size={20} />
                  <div>
                    <strong>Lịch làm việc:</strong>
                    <p>{job.workingTimeDescription || 'Theo thỏa thuận'}</p>
                  </div>
                </div>
                <div className="meta-list-item">
                  <Clock className="text-primary" size={20} />
                  <div>
                    <strong>Hình thức:</strong>
                    <p>{job.timingType === 0 ? 'Toàn thời gian (Ở lại)' : 'Làm theo giờ'}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="mobile-apply-bar">
        <div className="mobile-price">
           {Number(job.price).toLocaleString()}đ {getTimingLabel(job.timingType)}
        </div>
        <Button variant="primary" size="lg" onClick={handleApply}>Ứng Tuyển Ngay</Button>
      </div>
    </div>
  );
};

export default JobDetail;

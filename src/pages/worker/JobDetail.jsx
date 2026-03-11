import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, Clock, Briefcase, Star, User, Calendar, DollarSign, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyComplete, setApplyComplete] = useState(false);

  // Mock data for a single job
  const jobData = {
    id: id,
    title: 'Cần người phụ việc nhà theo giờ (Khu vực trung tâm)',
    type: 'Giúp việc theo giờ',
    price: 60000,
    timeUnit: '/ giờ',
    postedAt: '2 giờ trước',
    status: 'Đang tuyển',
    employer: {
      name: 'Chị Mai',
      rating: 4.8,
      verified: true,
      joinDate: 'Tháng 2, 2025'
    },
    location: {
      address: 'Số 15, Ngách 20, Đường Lê Lợi',
      district: 'Quận 1',
      city: 'Hồ Chí Minh'
    },
    schedule: {
      startDate: '15/05/2026',
      time: '08:00 - 11:00',
      days: 'Thứ 2, Thứ 4, Thứ 6'
    },
    description: `Tôi cần tìm một cô giúp việc cẩn thận, sạch sẽ phụ giúp dọn dẹp nhà cửa 3 buổi/tuần.
    
Công việc chính bao gồm:
- Quét dọn, lau chùi 3 phòng ngủ, 1 phòng khách
- Dọn rửa khu vực bếp sau khi nấu ăn
- Giặt phơi quần áo (có máy giặt)
- Không yêu cầu nấu ăn.
    
Nhà chung cư 80m2, dụng cụ vệ sinh đã có sẵn đầy đủ. Ưu tiên người làm việc lâu dài, đúng giờ.`,
    requirements: [
      'Nữ, độ tuổi từ 30 - 50 tuổi',
      'Đã có kinh nghiệm dọn dẹp nhà cửa tối thiểu 1 năm',
      'Trung thực, cẩn thận, lý lịch rõ ràng',
      'Đã tiêm đủ vaccine hoặc có giấy khám sức khỏe (nếu có)'
    ]
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để ứng tuyển!');
      return;
    }
    if (user?.role === 'employer') {
      alert('Tài khoản Chủ thuê không thể ứng tuyển việc làm. Vui lòng đăng ký tài khoản Người tìm việc.');
      return;
    }
    setIsApplyModalOpen(true);
  };

  const submitApplication = () => {
    // Submit logic
    setTimeout(() => {
      setApplyComplete(true);
    }, 800);
  };

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
                <h1 className="job-title">{jobData.title}</h1>
                <span className="job-status-badge">{jobData.status}</span>
              </div>
              
              <div className="job-meta-row">
                <span className="meta-badge"><Briefcase size={16}/> {jobData.type}</span>
                <span className="meta-badge alert"><Clock size={16}/> Cần gấp: {jobData.schedule.startDate}</span>
              </div>

              <div className="job-price-highlight">
                <div className="price-box">
                  <DollarSign size={24} className="text-primary" />
                  <div>
                    <span className="price-amount">{jobData.price.toLocaleString()}đ</span>
                    <span className="price-unit">{jobData.timeUnit}</span>
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
                {jobData.description.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              <h3 className="section-title mt-4">Yêu cầu công việc</h3>
              <ul className="job-requirements-list">
                {jobData.requirements.map((req, idx) => (
                  <li key={idx}><CheckCircle2 size={16} className="text-success" /> {req}</li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar Cards */}
        <div className="job-sidebar">
          {/* Employer Info */}
          <Card className="employer-card">
            <CardHeader>
              <h3 className="sidebar-title">Thông tin chủ nhà</h3>
            </CardHeader>
            <CardBody>
              <div className="employer-profile">
                <div className="employer-avatar">
                  <User size={32} />
                </div>
                <div className="employer-details">
                  <h4 className="employer-name">{jobData.employer.name}</h4>
                  <div className="employer-rating">
                    <Star size={16} fill="var(--status-warning)" className="text-warning"/> 
                    <span>{jobData.employer.rating} (12 đánh giá)</span>
                  </div>
                </div>
              </div>
              
              {jobData.employer.verified && (
                <div className="verification-badge mt-2">
                  <ShieldCheck size={16} /> Đã xác thực CCCD & Số điện thoại
                </div>
              )}
              <p className="employer-join-date mt-2">Tham gia: {jobData.employer.joinDate}</p>
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
                    <p>{jobData.location.district}, {jobData.location.city}</p>
                  </div>
                </div>
                <div className="meta-list-item">
                  <Calendar className="text-primary" size={20} />
                  <div>
                    <strong>Lịch làm việc:</strong>
                    <p>{jobData.schedule.days}</p>
                  </div>
                </div>
                <div className="meta-list-item">
                  <Clock className="text-primary" size={20} />
                  <div>
                    <strong>Khung giờ:</strong>
                    <p>{jobData.schedule.time}</p>
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
           {jobData.price.toLocaleString()}đ {jobData.timeUnit}
        </div>
        <Button variant="primary" size="lg" onClick={handleApply}>Ứng Tuyển Ngay</Button>
      </div>

      {/* Quick Apply Modal */}
      {isApplyModalOpen && (
        <div className="modal-overlay">
          <div className="apply-modal animate-fade-in">
            {!applyComplete ? (
              <>
                <div className="modal-header">
                  <h3>Xác nhận ứng tuyển</h3>
                  <button className="close-btn" onClick={() => setIsApplyModalOpen(false)}>&times;</button>
                </div>
                <div className="modal-body">
                  <p>Bạn sắp gửi yêu cầu ứng tuyển tới chủ nhà <strong>{jobData.employer.name}</strong> cho công việc:</p>
                  <div className="modal-job-summary mt-2 mb-4">
                    <strong>{jobData.title}</strong>
                    <div>{jobData.schedule.days} | {jobData.schedule.time}</div>
                  </div>
                  <p className="text-muted" style={{fontSize: '0.9rem'}}>*Thông tin hồ sơ và số điện thoại của bạn sẽ được gửi tới chủ nhà duyệt.</p>
                </div>
                <div className="modal-footer">
                  <Button variant="ghost" onClick={() => setIsApplyModalOpen(false)}>Hủy</Button>
                  <Button variant="primary" onClick={submitApplication}>Gửi Ứng Tuyển</Button>
                </div>
              </>
            ) : (
              <div className="modal-success state-center">
                <CheckCircle2 size={64} className="text-success mb-2" />
                <h3>Ứng tuyển thành công!</h3>
                <p className="text-muted mt-2">Chủ nhà đã nhận được hồ sơ của bạn và sẽ liên hệ sớm nếu phù hợp.</p>
                <Button variant="primary" className="mt-4" fullWidth onClick={() => setIsApplyModalOpen(false)}>
                  Đóng & Tiếp tục tìm việc
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default JobDetail;

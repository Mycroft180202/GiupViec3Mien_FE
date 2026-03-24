import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';
import { getApiErrorMessage } from '../../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7004';

const formatPrice = (value) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value || 0);

const getInitials = (fullName) =>
  fullName
    ?.split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((item) => item[0])
    .join('')
    .toUpperCase() || 'UV';

const WorkerDetail = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [worker, setWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchWorker = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await axios.get(`${API_BASE_URL}/api/User/workers/public/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setWorker(response.data);
      } catch (apiError) {
        setError(getApiErrorMessage(apiError, 'Không thể tải hồ sơ ứng viên.'));
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchWorker();
    }
  }, [id, token]);

  const locationText = useMemo(() => {
    if (!worker) {
      return '';
    }

    return worker.preferredLocations?.length
      ? worker.preferredLocations.join(', ')
      : 'Ứng viên đang cập nhật khu vực làm việc';
  }, [worker]);

  const handleContactAction = (type) => {
    if (!worker) {
      return;
    }

    if (type === 'phone' && worker.phone && !worker.phone.includes('*')) {
      window.open(`tel:${worker.phone}`, '_self');
      return;
    }

    if (type === 'email' && worker.email && !worker.email.includes('*')) {
      window.open(`mailto:${worker.email}`, '_self');
      return;
    }

    toast('Thông tin liên hệ này chỉ mở khi hồ sơ công khai đủ quyền xem.');
  };

  if (isLoading) {
    return (
      <div className="worker-detail-page bg-light" style={{ minHeight: '100vh', padding: '4rem 1rem', textAlign: 'center' }}>
        Đang tải hồ sơ ứng viên...
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="worker-detail-page bg-light" style={{ minHeight: '100vh', padding: '4rem 1rem', textAlign: 'center' }}>
        <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error || 'Không tìm thấy hồ sơ ứng viên.'}</p>
        <Link to="/tim-giup-viec" style={{ textDecoration: 'none' }}>
          <Button variant="primary">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="worker-detail-page bg-light" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      <div style={{ backgroundColor: 'var(--primary-dark)', padding: '2rem 0', color: 'white', marginBottom: '2rem' }}>
        <div className="container">
          <Link
            to="/tim-giup-viec"
            style={{
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <ArrowLeft size={16} color="white" /> Trở về danh sách
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: 'white',
                color: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                overflow: 'hidden',
              }}
            >
              {worker.avatarUrl ? (
                <img src={worker.avatarUrl} alt={worker.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitials(worker.fullName)
              )}
            </div>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', flexWrap: 'wrap' }}>
                {worker.fullName}
                {worker.verified && <ShieldCheck size={28} color="var(--status-success)" title="Đã xác thực" />}
              </h1>
              <div style={{ marginBottom: '0.5rem', color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>
                {worker.desiredJobTitle || 'Đang cập nhật mục tiêu công việc'}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', color: 'rgba(255,255,255,0.9)', fontSize: '1rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={16} color="rgba(255,255,255,0.9)" /> {locationText}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={16} fill="#F59E0B" color="#F59E0B" /> {worker.experienceYears} năm kinh nghiệm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card>
            <CardBody>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                Thông Tin Chung
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Độ tuổi</div>
                  <div style={{ fontWeight: 600 }}>{worker.age ? `${worker.age} tuổi` : 'Đang cập nhật'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Kinh nghiệm</div>
                  <div style={{ fontWeight: 600 }}>{worker.experienceYears} năm</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Mức giá mong muốn</div>
                  <div style={{ fontWeight: 600 }}>{formatPrice(worker.hourlyRate)}/giờ</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Trạng thái hồ sơ</div>
                  <div style={{ fontWeight: 600, color: worker.isProfilePublic ? 'var(--status-success)' : 'var(--text-muted)' }}>
                    {worker.isProfilePublic ? 'Đang công khai' : 'Đang lưu nháp'}
                  </div>
                </div>
              </div>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Dịch vụ đang tìm</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {(worker.desiredServiceCategories || []).map((item) => (
                  <span
                    key={item}
                    style={{
                      backgroundColor: 'rgba(47, 128, 237, 0.08)',
                      color: 'var(--primary-color)',
                      padding: '0.4rem 1rem',
                      borderRadius: '100px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Kỹ năng nổi bật</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {(worker.skills || []).map((skill) => (
                  <span key={skill} style={{ backgroundColor: 'rgba(39, 174, 96, 0.1)', color: 'var(--status-success)', padding: '0.4rem 1rem', borderRadius: '100px', fontWeight: 600, fontSize: '0.9rem' }}>
                    <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                    {skill}
                  </span>
                ))}
              </div>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Giới thiệu bản thân</h3>
              <p style={{ lineHeight: 1.7, color: 'var(--text-main)', marginBottom: '1rem' }}>
                {worker.bio || 'Ứng viên đang cập nhật phần giới thiệu bản thân.'}
              </p>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Mô tả mục tiêu tìm việc</h3>
              <p style={{ lineHeight: 1.7, color: 'var(--text-main)', marginBottom: 0 }}>
                {worker.seekingDescription || 'Ứng viên chưa cập nhật mô tả mục tiêu tìm việc.'}
              </p>
            </CardBody>
          </Card>
        </div>

        <div style={{ position: 'sticky', top: 'calc(var(--header-height) + 2rem)' }}>
          <Card className="shadow-lg" style={{ border: '2px solid var(--primary-color)' }}>
            <CardBody style={{ textAlign: 'center', padding: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>Mời ứng viên làm việc</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                Bạn có thể xem hồ sơ công khai rồi trao đổi thêm qua chat hoặc thông tin liên hệ nếu tài khoản đủ quyền.
              </p>

              <Button variant="primary" size="lg" style={{ width: '100%', marginBottom: '1rem' }} onClick={() => setShowContactModal(true)}>
                Xem thông tin liên hệ
              </Button>
              <Button variant="outline" size="lg" style={{ width: '100%' }} icon={<MessageSquare size={18} />}>
                Nhắn tin trao đổi
              </Button>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} color="var(--status-success)" /> Hồ sơ công khai
                </div>
                <div>Cập nhật gần nhất: {new Date(worker.updatedAt).toLocaleDateString('vi-VN')}</div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ marginTop: 0 }}>Thông tin liên hệ</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Thông tin sẽ hiển thị theo quyền truy cập hiện tại của tài khoản bạn.
            </p>

            <div style={{ display: 'grid', gap: '0.75rem', margin: '1.5rem 0' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
                <Phone size={18} />
                <span>{worker.phone || 'Chưa có số điện thoại'}</span>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
                <Mail size={18} />
                <span>{worker.email || 'Chưa có email'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button variant="outline" style={{ flex: 1 }} icon={<Phone size={18} />} onClick={() => handleContactAction('phone')}>
                Gọi điện
              </Button>
              <Button variant="primary" style={{ flex: 1 }} icon={<Mail size={18} />} onClick={() => handleContactAction('email')}>
                Gửi email
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDetail;

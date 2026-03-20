import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { User, CheckCircle2, XCircle, Mail, Phone, ArrowLeft, Loader2, AlertCircle, FileText, Star, ShieldCheck } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector(state => state.auth);
  
  const [apps, setApps] = useState([]);
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // 1. Fetch Job info (to get title etc)
      const jobRes = await axios.get(`https://localhost:7004/api/Job/${jobId}`);
      setJob(jobRes.data);

      // 2. Fetch Applicants
      const appsRes = await axios.get(`https://localhost:7004/api/Job/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApps(appsRes.data);
    } catch (err) {
      console.error('Fetch Applicants Error:', err);
      setErrorMsg('Không thể tải danh sách ứng viên. Hãy đảm bảo bạn có quyền xem danh sách này.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [jobId, token]);

  const handleAccept = async (appId) => {
    if (!window.confirm('Xác nhận nhận người này làm việc? Việc nhận một người sẽ tự động đóng tin đăng tuyển này.')) return;
    
    setIsProcessing(true);
    try {
      // POST /api/Job/applications/{id}/accept
      await axios.post(`https://localhost:7004/api/Job/applications/${appId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh list or mark as accepted locally
      alert('Đã chấp nhận ứng viên thành công!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Chấp nhận thất bại. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return (
    <div className="state-center container" style={{ padding: '8rem 0' }}>
      <Loader2 className="animate-spin text-primary" size={48} style={{ marginBottom: '1rem' }} />
      <p>Đang tải danh sách hồ sơ ứng tuyển...</p>
    </div>
  );

  if (errorMsg) return (
    <div className="state-center container" style={{ padding: '8rem 0' }}>
      <AlertCircle size={64} style={{ color: '#dc2626', marginBottom: '1.5rem' }} />
      <h3>Lỗi truy cập</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{errorMsg}</p>
      <Link to="/dashboard/quan-ly-tin">
        <Button variant="outline"><ArrowLeft size={18} /> Quay lại quản lý tin</Button>
      </Link>
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <Link to="/dashboard/quan-ly-tin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        <ArrowLeft size={18} /> Quay lại danh sách tin đăng
      </Link>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Danh Sách Ứng Viên</h1>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <FileText size={18} /> Công việc: <strong style={{color: 'var(--text-main)'}}>{job?.title}</strong>
        </p>
      </div>

      {apps.length === 0 ? (
        <Card style={{ padding: '4rem', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
          <CardBody>
            <User size={64} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
            <h3>Chưa có ai ứng tuyển</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Hãy chia sẻ tin đăng của bạn lên các cộng đồng để tìm người nhanh hơn.</p>
          </CardBody>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {apps.map(app => (
            <Card key={app.id} style={{ border: app.isAccepted ? '2px solid var(--status-success)' : '1px solid #e2e8f0' }}>
              <CardBody style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {app.applicantName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{app.applicantName}</h3>
                      <div className="flex-center" style={{ gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-warning)' }}>
                        <Star size={14} fill="currentColor" /> <span>4.9 (Tốt)</span>
                      </div>
                    </div>
                  </div>
                  
                  {app.isAccepted && (
                    <span style={{ backgroundColor: 'rgba(39, 174, 96, 0.1)', color: 'var(--status-success)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                      Đã Nhận Việc
                    </span>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Lời giới thiệu / Tin nhắn:</div>
                  <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--text-main)', margin: 0 }}>
                    "{app.message || 'Không có tin nhắn giới thiệu.'}"
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Giá đề xuất:</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '1.1rem' }}>
                    {app.bidPrice.toLocaleString()}đ
                  </div>
                </div>

                {app.cvUrl && (
                  <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontSize: '0.9rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
                    <FileText size={16} /> Xem hồ sơ đính kèm (CV)
                  </a>
                )}

                {!app.isAccepted ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <Button variant="outline" fullWidth style={{ color: '#dc2626', borderColor: '#feb2b2' }}>
                      <XCircle size={18} /> Từ chối
                    </Button>
                    <Button 
                      variant="primary" 
                      fullWidth 
                      onClick={() => handleAccept(app.id)}
                      disabled={isProcessing}
                      style={{ backgroundColor: 'var(--status-success)', borderColor: 'var(--status-success)' }}
                    >
                      {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle2 size={18} /> Nhận Ngay</>}
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {user?.hasPremiumAccess ? (
                      <>
                        <Button variant="outline" className="w-full" icon={<Phone size={18} />} onClick={() => window.location.href = `tel:${app.applicantPhone}`}>
                          Gọi Điện
                        </Button>
                        <Button variant="primary" className="w-full" icon={<Mail size={18} />} onClick={() => window.location.href = `mailto:${app.applicantEmail}`}>
                          Gửi Email
                        </Button>
                      </>
                    ) : (
                      <div style={{ gridColumn: 'span 2' }}>
                        <Button variant="outline" fullWidth style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)', backgroundColor: 'rgba(47, 128, 237, 0.05)' }} onClick={() => navigate('/dich-vu-noi-bat')}>
                          Mua Gói Để Xem Liên Hệ
                        </Button>
                        <p style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '0.5rem', textAlign: 'center' }}>
                          *SĐT và Email đang bị ẩn. Vui lòng nâng cấp gói Pro.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {app.isAccepted && (
                   <div className="flex-center mt-3" style={{ gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <ShieldCheck size={16} className="text-primary" /> Bạn đã có thể liên hệ trực tiếp với người làm.
                   </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Mail, Phone, Loader2, AlertCircle, SearchX, Star, ShieldCheck, Eye } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const EmployerCandidates = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchCandidates = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get('https://localhost:7004/api/Job/my-applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(response.data);
    } catch (err) {
      console.error('Fetch Applicants Error:', err);
      setErrorMsg('Không thể tải danh sách ứng viên. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCandidates();
  }, [token]);

  const handleAccept = async (appId) => {
    if (!window.confirm('Xác nhận nhận người này làm việc?')) return;
    setIsProcessing(true);
    try {
      await axios.post(`https://localhost:7004/api/Job/applications/${appId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Đã chấp nhận ứng viên thành công!');
      fetchCandidates();
    } catch (err) {
      alert(err.response?.data?.message || 'Thao tác thất bại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="state-center" style={{ padding: '6rem 0' }}>
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="mt-2">Đang tải hồ sơ ứng viên...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="state-center" style={{ padding: '6rem 0' }}>
        <AlertCircle size={48} style={{ color: '#dc2626' }} />
        <p className="mt-2">{errorMsg}</p>
        <Button variant="outline" className="mt-4" onClick={fetchCandidates}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="dashboard-title">Hồ Sơ Ứng Viên</h2>
      <p className="dashboard-subtitle">Danh sách ứng viên đã ứng tuyển vào các tin của bạn. Muốn xem matching theo từng job, hãy mở chi tiết của từng tin.</p>

      {candidates.length === 0 ? (
        <div className="state-center" style={{ padding: '4rem 0', backgroundColor: '#fff', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
          <SearchX size={64} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Hiện chưa có ứng viên nào ứng tuyển vào các tin của bạn.</p>
          <Link to="/dashboard/quan-ly-tin" style={{ marginTop: '1rem', display: 'inline-block' }}>
            <Button variant="outline">Xem các tin đã đăng</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {candidates.map((candidate) => (
            <Card key={candidate.id} style={{ height: '100%', border: candidate.isAccepted ? '2px solid var(--status-success)' : '1px solid #e2e8f0' }}>
              <CardBody style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {candidate.applicantName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{candidate.applicantName}</h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Star size={14} fill="#f59e0b" style={{ color: '#f59e0b' }} /> 4.9 • 12 nhận xét
                      </div>
                    </div>
                  </div>
                  {candidate.isAccepted && (
                    <span style={{ backgroundColor: 'rgba(39, 174, 96, 0.1)', color: 'var(--status-success)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                      Đã nhận
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.65rem' }}>
                    <strong>Tin tuyển:</strong>{' '}
                    <Link to={`/ung-tuyen-viec-lam/${candidate.jobId}`} style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                      {candidate.jobTitle}
                    </Link>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    "{candidate.message || 'Không có giới thiệu.'}"
                  </div>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Giá đề nghị:</span>
                    <strong style={{ color: 'var(--primary-color)' }}>{Number(candidate.bidPrice).toLocaleString()}đ</strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Link to={`/ung-tuyen-viec-lam/${candidate.jobId}`} style={{ textDecoration: 'none' }}>
                    <Button variant="outline" size="sm" fullWidth icon={<Eye size={16} />}>Mở chi tiết</Button>
                  </Link>
                  {!candidate.isAccepted ? (
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      disabled={isProcessing}
                      onClick={() => handleAccept(candidate.id)}
                      style={{ backgroundColor: 'var(--status-success)', borderColor: 'var(--status-success)' }}
                    >
                      {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <><CheckCircle size={16} /> Nhận</>}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" fullWidth disabled>
                      Đã chốt ứng viên
                    </Button>
                  )}
                </div>

                {!candidate.isAccepted ? (
                  <Button variant="outline" size="sm" style={{ color: 'var(--status-error)', borderColor: 'var(--status-error)' }}>
                    <XCircle size={16} /> Từ chối
                  </Button>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: 'auto' }}>
                    {user?.hasPremiumAccess ? (
                      <>
                        <Button variant="outline" size="sm" icon={<Phone size={16} />} onClick={() => window.location.href = `tel:${candidate.applicantPhone}`}>Gọi</Button>
                        <Button variant="primary" size="sm" icon={<Mail size={16} />} onClick={() => window.location.href = `mailto:${candidate.applicantEmail}`}>Nhắn tin</Button>
                      </>
                    ) : (
                      <div style={{ gridColumn: 'span 2' }}>
                        <Button variant="outline" fullWidth size="sm" style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)', background: 'rgba(47, 128, 237, 0.05)' }} onClick={() => navigate('/dich-vu-noi-bat')}>
                          Nâng Cấp Để Liên Hệ
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {candidate.isAccepted && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
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

export default EmployerCandidates;

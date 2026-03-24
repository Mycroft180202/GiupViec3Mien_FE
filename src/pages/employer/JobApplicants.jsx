import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  XCircle,
} from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getApiErrorMessage } from '../../utils/api';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7004';

const matchBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  padding: '0.3rem 0.7rem',
  borderRadius: '999px',
  fontSize: '0.8rem',
  fontWeight: 600,
  background: 'rgba(47, 128, 237, 0.08)',
  color: 'var(--primary-color)',
};

const getApplicationStatus = app => {
  if (typeof app.status === 'number') return app.status;
  return app.isAccepted ? 1 : 0;
};

const getStatusMeta = app => {
  const status = getApplicationStatus(app);
  if (status === 1) {
    return {
      label: 'Đã nhận việc',
      color: 'var(--status-success)',
      background: 'rgba(39, 174, 96, 0.1)',
      border: '2px solid var(--status-success)',
    };
  }

  if (status === 2) {
    return {
      label: 'Bị từ chối',
      color: '#dc2626',
      background: 'rgba(220, 38, 38, 0.1)',
      border: '1px solid #fecaca',
    };
  }

  return {
    label: 'Chờ duyệt',
    color: '#d97706',
    background: 'rgba(242, 153, 74, 0.12)',
    border: '1px solid #e2e8f0',
  };
};

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector(state => state.auth);

  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatchLoading, setIsMatchLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openingCvId, setOpeningCvId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [matchError, setMatchError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const formatMoney = value => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

  const fetchData = async () => {
    setIsLoading(true);
    setIsMatchLoading(true);
    setErrorMsg('');
    setMatchError('');

    try {
      const [jobRes, appsRes] = await Promise.all([
        axios.get(`${apiBaseUrl}/api/Job/${jobId}`),
        axios.get(`${apiBaseUrl}/api/Job/${jobId}/applicants`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setJob(jobRes.data);
      setApps(appsRes.data);
    } catch (err) {
      setErrorMsg(getApiErrorMessage(err, 'Không thể tải danh sách ứng viên cho tin đăng này.'));
    } finally {
      setIsLoading(false);
    }

    try {
      const matchingRes = await axios.get(`${apiBaseUrl}/api/Matching/jobs/${jobId}/workers?limit=6`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(matchingRes.data);
    } catch (err) {
      setMatchError(getApiErrorMessage(err, 'Chưa thể tải gợi ý ứng viên phù hợp.'));
    } finally {
      setIsMatchLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [jobId, token]);

  const runAccept = async applicationId => {
    setIsProcessing(true);
    try {
      await axios.post(
        `${apiBaseUrl}/api/Job/applications/${applicationId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Đã nhận ứng viên thành công.');
      await fetchData();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Nhận ứng viên thất bại.'));
    } finally {
      setIsProcessing(false);
      setConfirmAction(null);
    }
  };

  const runReject = async applicationId => {
    setIsProcessing(true);
    try {
      await axios.post(
        `${apiBaseUrl}/api/Job/applications/${applicationId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Đã từ chối ứng viên thành công.');
      await fetchData();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Từ chối ứng viên thất bại.'));
    } finally {
      setIsProcessing(false);
      setConfirmAction(null);
    }
  };

  const askAccept = applicationId => {
    setConfirmAction({
      type: 'accept',
      title: 'Xác nhận nhận ứng viên',
      description: 'Khi nhận ứng viên này, tin đăng sẽ chuyển sang trạng thái đang thực hiện và các hồ sơ chờ khác sẽ bị từ chối.',
      confirmText: 'Nhận ngay',
      confirmVariant: 'primary',
      onConfirm: () => runAccept(applicationId),
    });
  };

  const askReject = applicationId => {
    setConfirmAction({
      type: 'reject',
      title: 'Xác nhận từ chối ứng viên',
      description: 'Ứng viên này sẽ được chuyển sang trạng thái bị từ chối và vẫn còn trong lịch sử tuyển dụng.',
      confirmText: 'Từ chối',
      confirmVariant: 'outline',
      onConfirm: () => runReject(applicationId),
    });
  };

  const handleOpenCv = async applicationId => {
    setOpeningCvId(applicationId);
    try {
      const response = await axios.get(`${apiBaseUrl}/api/Job/applications/${applicationId}/cv`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const cvUrl = response.data?.url;
      if (!cvUrl) {
        throw new Error('Không tìm thấy đường dẫn CV hợp lệ.');
      }

      window.open(cvUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Không mở được hồ sơ đính kèm.'));
    } finally {
      setOpeningCvId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="state-center container" style={{ padding: '8rem 0' }}>
        <Loader2 className="animate-spin text-primary" size={48} style={{ marginBottom: '1rem' }} />
        <p>Đang tải danh sách ứng viên...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="state-center container" style={{ padding: '8rem 0' }}>
        <AlertCircle size={64} style={{ color: '#dc2626', marginBottom: '1.5rem' }} />
        <h3>Lỗi truy cập</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{errorMsg}</p>
        <Link to="/dashboard/quan-ly-tin">
          <Button variant="outline">
            <ArrowLeft size={18} /> Quay lại quản lý tin
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <Link
          to="/dashboard/quan-ly-tin"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-muted)', marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={18} /> Quay lại danh sách tin đăng
        </Link>

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Danh sách ứng viên</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <FileText size={18} /> Công việc: <strong style={{ color: 'var(--text-main)' }}>{job?.title}</strong>
          </p>
          {user?.isGuest && (
            <p style={{ marginTop: '0.75rem', color: 'var(--primary-color)', fontWeight: 600 }}>
              Bạn đang dùng tài khoản khách. Tin đăng vẫn được lưu và có thể quản lý bình thường trong dashboard.
            </p>
          )}
        </div>

        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Sparkles size={20} color="var(--primary-color)" />
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Ứng viên phù hợp từ hệ thống matching</h2>
          </div>

          {isMatchLoading ? (
            <div className="state-center" style={{ padding: '2rem 0' }}>
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : matchError ? (
            <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#fff5f5', color: '#dc2626' }}>{matchError}</div>
          ) : matches.length === 0 ? (
            <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#f8fafc', color: 'var(--text-muted)' }}>
              Chưa có gợi ý phù hợp từ hệ thống cho tin đăng này.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {matches.map(match => (
                <Card key={match.workerId}>
                  <CardBody style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            backgroundColor: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary-color)',
                            fontWeight: 700,
                          }}
                        >
                          {match.avatarUrl ? (
                            <img src={match.avatarUrl} alt={match.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            match.fullName?.charAt(0) || 'U'
                          )}
                        </div>
                        <div>
                          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem' }}>{match.fullName}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <Star size={14} fill="currentColor" /> {match.averageRating || 0} • {match.reviewCount || 0} đánh giá
                          </div>
                        </div>
                      </div>
                      <span style={matchBadgeStyle}>{match.matchScore}% match</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <span style={matchBadgeStyle}><MapPin size={14} /> {match.distanceKm || 0} km</span>
                      <span style={matchBadgeStyle}><User size={14} /> {match.experienceYears || 0} năm KN</span>
                    </div>

                    <div style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      <strong>Mức giá mong muốn:</strong> {formatMoney(match.hourlyRate)} / giờ
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {match.matchedSkills?.length
                        ? `Kỹ năng phù hợp: ${match.matchedSkills.join(', ')}`
                        : 'Chưa có kỹ năng trùng rõ ràng, hệ thống đang ưu tiên theo vị trí và độ phù hợp tổng thể.'}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <FileText size={20} color="var(--primary-color)" />
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Ứng viên đã ứng tuyển</h2>
          </div>

          {apps.length === 0 ? (
            <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#f8fafc', color: 'var(--text-muted)' }}>
              Chưa có ứng viên nào ứng tuyển vào tin này.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {apps.map(app => {
                const statusMeta = getStatusMeta(app);
                const isAccepted = getApplicationStatus(app) === 1;
                const isRejected = getApplicationStatus(app) === 2;

                return (
                  <Card key={app.id} style={{ border: statusMeta.border }}>
                    <CardBody style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <div
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: '50%',
                              backgroundColor: '#f1f5f9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--primary-color)',
                              fontWeight: 'bold',
                              fontSize: '1.2rem',
                              overflow: 'hidden',
                            }}
                          >
                            {app.applicantAvatarUrl ? (
                              <img
                                src={app.applicantAvatarUrl}
                                alt={app.applicantName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              app.applicantName?.charAt(0) || 'U'
                            )}
                          </div>
                          <div>
                            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{app.applicantName}</h3>
                            <div className="flex-center" style={{ gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-warning)' }}>
                              <Star size={14} fill="currentColor" /> <span>4.9 (Tốt)</span>
                            </div>
                          </div>
                        </div>

                        <span
                          style={{
                            backgroundColor: statusMeta.background,
                            color: statusMeta.color,
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {statusMeta.label}
                        </span>
                      </div>

                      <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Lời giới thiệu / Tin nhắn</div>
                        <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--text-main)', margin: 0 }}>
                          "{app.message || 'Không có tin nhắn giới thiệu.'}"
                        </p>
                      </div>

                      <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Giá đề xuất:</span>
                          <strong style={{ color: 'var(--primary-color)', fontSize: '1.1rem' }}>{formatMoney(app.bidPrice)}</strong>
                        </div>
                        {app.availableStartDate && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Có thể bắt đầu từ:</span>
                            <strong>{String(app.availableStartDate).slice(0, 10)}</strong>
                          </div>
                        )}
                      </div>

                      {app.cvUrl === '[Processing...]' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                          <Loader2 size={16} className="animate-spin" /> CV đang được xử lý...
                        </div>
                      )}

                      {app.cvUrl && app.cvUrl !== '[Processing...]' && (
                        <button
                          type="button"
                          onClick={() => handleOpenCv(app.id)}
                          disabled={openingCvId === app.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--primary-color)',
                            fontSize: '0.9rem',
                            marginBottom: '1rem',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: openingCvId === app.id ? 'wait' : 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          {openingCvId === app.id ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                          {openingCvId === app.id ? 'Đang mở CV...' : 'Xem hồ sơ đính kèm (CV)'}
                        </button>
                      )}

                      {!isAccepted && !isRejected && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <Button
                            variant="outline"
                            fullWidth
                            onClick={() => askReject(app.id)}
                            disabled={isProcessing}
                            style={{ color: '#dc2626', borderColor: '#feb2b2' }}
                          >
                            <XCircle size={18} /> Từ chối
                          </Button>
                          <Button
                            variant="primary"
                            fullWidth
                            onClick={() => askAccept(app.id)}
                            disabled={isProcessing}
                            style={{ backgroundColor: 'var(--status-success)', borderColor: 'var(--status-success)' }}
                          >
                            {isProcessing && confirmAction?.type === 'accept' ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : (
                              <>
                                <CheckCircle2 size={18} /> Nhận ngay
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {isAccepted && (
                        <>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {user?.hasPremiumAccess ? (
                              <>
                                <Button variant="outline" className="w-full" icon={<Phone size={18} />} onClick={() => (window.location.href = `tel:${app.applicantPhone}`)}>
                                  Gọi điện
                                </Button>
                                <Button variant="primary" className="w-full" icon={<Mail size={18} />} onClick={() => (window.location.href = `mailto:${app.applicantEmail}`)}>
                                  Gửi email
                                </Button>
                              </>
                            ) : (
                              <div style={{ gridColumn: 'span 2' }}>
                                <Button
                                  variant="outline"
                                  fullWidth
                                  style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)', backgroundColor: 'rgba(47, 128, 237, 0.05)' }}
                                  onClick={() => navigate('/dich-vu-noi-bat')}
                                >
                                  Mua gói để xem liên hệ
                                </Button>
                                <p style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '0.5rem', textAlign: 'center' }}>
                                  *SĐT và Email đang bị ẩn. Vui lòng nâng cấp gói Pro.
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex-center mt-3" style={{ gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <ShieldCheck size={16} className="text-primary" /> Bạn đã có thể liên hệ trực tiếp với người làm.
                          </div>
                        </>
                      )}

                      {isRejected && (
                        <div style={{ marginTop: '0.5rem', color: '#dc2626', fontSize: '0.9rem' }}>
                          Hồ sơ này đã bị từ chối và được giữ lại trong lịch sử tuyển dụng.
                        </div>
                      )}
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {confirmAction && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1000,
          }}
          onClick={() => !isProcessing && setConfirmAction(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#fff',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
            }}
            onClick={event => event.stopPropagation()}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: confirmAction.type === 'reject' ? 'rgba(220, 38, 38, 0.12)' : 'rgba(39, 174, 96, 0.12)',
                color: confirmAction.type === 'reject' ? '#dc2626' : 'var(--status-success)',
                marginBottom: '1rem',
              }}
            >
              {confirmAction.type === 'reject' ? <XCircle size={24} /> : <CheckCircle2 size={24} />}
            </div>

            <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem' }}>{confirmAction.title}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>{confirmAction.description}</p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button variant="ghost" onClick={() => setConfirmAction(null)} disabled={isProcessing}>
                Hủy
              </Button>
              <Button
                variant={confirmAction.confirmVariant}
                onClick={confirmAction.onConfirm}
                disabled={isProcessing}
                style={confirmAction.type === 'reject' ? { color: '#dc2626', borderColor: '#feb2b2' } : undefined}
              >
                {isProcessing ? <Loader2 className="animate-spin" size={18} /> : confirmAction.confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobApplicants;

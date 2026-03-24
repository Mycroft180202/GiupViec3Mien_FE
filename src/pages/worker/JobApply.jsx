import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  FileText,
  Loader2,
  Send,
  Upload,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';
import { getApiErrorMessage } from '../../utils/api';

const JobApply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector(state => state.auth);

  const [job, setJob] = useState(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorHeader, setErrorHeader] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    message: '',
    bidPrice: 0,
    cv: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập bằng tài khoản người tìm việc để ứng tuyển.');
      navigate('/dang-nhap');
      return;
    }

    if (user?.role === 'employer') {
      alert('Tài khoản chủ thuê không thể ứng tuyển. Vui lòng dùng tài khoản người tìm việc.');
      navigate('/');
      return;
    }

    const fetchJob = async () => {
      try {
        const response = await axios.get(`https://localhost:7004/api/Job/${id}`);
        setJob(response.data);
        setFormData(prev => ({ ...prev, bidPrice: response.data.price || 0 }));
      } catch (err) {
        alert('Không tìm thấy thông tin công việc.');
        navigate('/tim-viec');
      } finally {
        setIsLoadingJob(false);
      }
    };

    fetchJob();
  }, [id, isAuthenticated, navigate, user]);

  const handleChange = event => {
    const { id: fieldId, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [fieldId]: fieldId === 'bidPrice' ? Number(value) : value,
    }));
    setFieldErrors(prev => ({ ...prev, [fieldId]: '' }));
  };

  const handleFileChange = event => {
    const file = event.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, cv: file }));
    setFieldErrors(prev => ({ ...prev, cv: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.message.trim()) {
      nextErrors.message = 'Vui lòng nhập lời giới thiệu gửi tới chủ nhà.';
    }

    if (!formData.bidPrice || Number(formData.bidPrice) <= 0) {
      nextErrors.bidPrice = 'Mức lương mong muốn phải lớn hơn 0.';
    }

    if (formData.cv) {
      const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
      const fileName = formData.cv.name.toLowerCase();
      const hasValidExtension = allowedExtensions.some(extension => fileName.endsWith(extension));
      if (!hasValidExtension) {
        nextErrors.cv = 'Chỉ hỗ trợ file PDF, DOC, DOCX hoặc TXT.';
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setErrorHeader('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('Message', formData.message.trim());
    submitData.append('BidPrice', String(formData.bidPrice));
    if (formData.cv) {
      submitData.append('Cv', formData.cv);
    }

    try {
      await axios.post(`https://localhost:7004/api/Job/${id}/apply`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(true);
    } catch (err) {
      setErrorHeader(getApiErrorMessage(err, 'Gửi ứng tuyển thất bại. Vui lòng thử lại sau.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingJob) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10rem 0' }}>
        <Loader2 className="animate-spin text-primary" size={48} style={{ marginBottom: '1rem' }} />
        <p>Đang tải thông tin công việc...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
        <CheckCircle2 size={80} className="text-success" style={{ margin: '0 auto 1.5rem', display: 'block' }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ứng tuyển thành công!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '560px', marginInline: 'auto' }}>
          Hồ sơ của bạn đã được gửi tới <strong>{job?.employerName}</strong>. Hãy chú ý điện thoại và email vì chủ nhà có thể liên hệ nếu hồ sơ phù hợp.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/tim-viec">
            <Button variant="outline">Tìm việc khác</Button>
          </Link>
          <Link to="/dashboard/viec-da-ung-tuyen">
            <Button variant="primary">Xem tin đã ứng tuyển</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <Link
        to={`/viec-lam/${id}`}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-muted)', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={18} /> Quay lại trang chi tiết
      </Link>

      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Gửi hồ sơ ứng tuyển</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Điền thông tin giới thiệu và mức lương mong muốn để chủ nhà dễ dàng cân nhắc hồ sơ của bạn.
      </p>

      <Card style={{ marginBottom: '2rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <CardBody style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} className="text-primary" /> Công việc đang ứng tuyển
          </h3>
          <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>{job?.title}</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Chủ nhà: {job?.employerName} | Lương đề xuất: {Number(job?.price || 0).toLocaleString()}đ
          </p>
        </CardBody>
      </Card>

      {errorHeader && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid #fecaca',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          <AlertCircle size={20} />
          {errorHeader}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Mức lương mong muốn (VNĐ)</label>
          <div style={{ position: 'relative' }}>
            <Input
              id="bidPrice"
              type="number"
              value={formData.bidPrice}
              onChange={handleChange}
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Ví dụ: 65000"
              required
              error={fieldErrors.bidPrice}
            />
            <DollarSign size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Hệ thống mặc định điền mức giá chủ nhà đề xuất. Bạn có thể điều chỉnh nếu cần.
          </p>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Lời giới thiệu gửi tới chủ nhà</label>
          <textarea
            id="message"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: fieldErrors.message ? '1px solid #dc2626' : '1px solid #e2e8f0', minHeight: '150px', outline: 'none' }}
            placeholder="Ví dụ: Chào chị, em đã có 2 năm kinh nghiệm giúp việc tại chung cư, làm việc cẩn thận, sạch sẽ..."
            value={formData.message}
            onChange={handleChange}
            required
          />
          {fieldErrors.message && (
            <p style={{ marginTop: '0.5rem', color: '#dc2626', fontSize: '0.85rem' }}>{fieldErrors.message}</p>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Hồ sơ đính kèm / CV (tùy chọn)</label>
          <div style={{ border: `2px dashed ${fieldErrors.cv ? '#dc2626' : '#cbd5e1'}`, padding: '2rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              style={{ position: 'absolute', opacity: 0, top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
              onChange={handleFileChange}
            />
            {formData.cv ? (
              <div>
                <CheckCircle2 size={32} className="text-success" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontWeight: 600 }}>{formData.cv.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bấm hoặc kéo thả để chọn file khác</p>
              </div>
            ) : (
              <div>
                <Upload size={32} style={{ color: '#cbd5e1', margin: '0 auto 0.5rem' }} />
                <p>Kéo thả file vào đây hoặc bấm để chọn tệp</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hỗ trợ PDF, DOC, DOCX, TXT</p>
              </div>
            )}
          </div>
          {fieldErrors.cv && (
            <p style={{ marginTop: '0.5rem', color: '#dc2626', fontSize: '0.85rem' }}>{fieldErrors.cv}</p>
          )}
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          type="submit"
          disabled={isSubmitting}
          icon={isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        >
          {isSubmitting ? 'Đang gửi hồ sơ...' : 'Xác nhận ứng tuyển'}
        </Button>
      </form>
    </div>
  );
};

export default JobApply;

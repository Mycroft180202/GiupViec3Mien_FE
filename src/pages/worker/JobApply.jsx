import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ArrowLeft, User, FileText, DollarSign, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';

const JobApply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector(state => state.auth);
  
  const [job, setJob] = useState(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorHeader, setErrorHeader] = useState('');

  const [formData, setFormData] = useState({
    message: '',
    bidPrice: 0,
    cv: null
  });

  useEffect(() => {
    // 1. Check Auth
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập với tài khoản Người tìm việc để ứng tuyển!');
      navigate('/dang-nhap');
      return;
    }
    if (user?.role === 'employer') {
      alert('Tài khoản Chủ thuê không thể ứng tuyển. Vui lòng đăng ký tài khoản Người tìm việc.');
      navigate('/');
      return;
    }

    // 2. Fetch Job Details for context
    const fetchJob = async () => {
      try {
        const response = await axios.get(`https://localhost:7004/api/Job/${id}`);
        setJob(response.data);
        setFormData(prev => ({ ...prev, bidPrice: response.data.price }));
      } catch (err) {
        alert('Không tìm thấy thông tin công việc.');
        navigate('/tim-viec');
      } finally {
        setIsLoadingJob(false);
      }
    };
    fetchJob();
  }, [id, isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorHeader('');

    const submitData = new FormData();
    submitData.append('Message', formData.message);
    submitData.append('BidPrice', formData.bidPrice);
    if (formData.cv) {
      submitData.append('Cv', formData.cv);
    }

    try {
      await axios.post(`https://localhost:7004/api/Job/${id}/apply`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess(true);
    } catch (err) {
      setErrorHeader(err.response?.data?.message || 'Gửi ứng tuyển thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingJob) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10rem 0' }}>
      <Loader2 className="animate-spin text-primary" size={48} style={{ marginBottom: '1rem' }} />
      <p>Đang tải thông tin công việc...</p>
    </div>
  );

  if (success) return (
    <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
      <CheckCircle2 size={80} className="text-success" style={{ margin: '0 auto 1.5rem', display: 'block' }} />
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ứng tuyển thành công!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
        Yêu cầu của bạn đã được gửi tới <strong>{job?.employerName}</strong>. Hãy chú ý điện thoại, chủ nhà sẽ liên hệ với bạn nếu hồ sơ phù hợp.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/tim-viec"><Button variant="outline">Tìm việc khác</Button></Link>
        <Link to="/dashboard/viec-da-ung-tuyen"><Button variant="primary">Xem tin đã ứng tuyển</Button></Link>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <Link to={`/viec-lam/${id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        <ArrowLeft size={18} /> Quay lại trang chi tiết
      </Link>

      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Gửi Hồ Sơ Ứng Tuyển</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Điền thông tin giới thiệu và mức lương mong muốn để chủ nhà dễ dàng chọn bạn.</p>

      <Card style={{ marginBottom: '2rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <CardBody style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} className="text-primary" /> Công việc đang ứng tuyển:
          </h3>
          <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>{job?.title}</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Chủ nhà: {job?.employerName} | Lương đề xuất: {Number(job?.price).toLocaleString()}đ</p>
        </CardBody>
      </Card>

      {errorHeader && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #fecaca', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <AlertCircle size={20} />
          {errorHeader}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Mức lương mong muốn (VNĐ)</label>
          <div style={{ position: 'relative' }}>
            <Input 
              type="number" 
              value={formData.bidPrice} 
              onChange={e => setFormData({ ...formData, bidPrice: e.target.value })}
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Vd: 65000"
              required
            />
            <DollarSign size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Hệ thống mặc định điền mức giá chủ nhà đề xuất. Bạn có thể thay đổi nếu muốn.</p>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Lời giới thiệu / Tin nhắn tới chủ nhà</label>
          <textarea 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '150px', outline: 'none' }}
            placeholder="Chào Chị, em đã có 2 năm kinh nghiệm giúp việc tại chung cư, làm việc cẩn thận, sạch sẽ..."
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            required
          ></textarea>
        </div>

        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Ảnh hồ sơ / CV / Giấy tờ (Tùy chọn)</label>
          <div style={{ border: '2px dashed #cbd5e1', padding: '2rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
            <input 
              type="file" 
              style={{ position: 'absolute', opacity: 0, top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
              onChange={e => setFormData({ ...formData, cv: e.target.files[0] })}
            />
            {formData.cv ? (
              <div>
                <CheckCircle2 size={32} className="text-success" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontWeight: 600 }}>{formData.cv.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click hoặc kéo thả để chọn file khác</p>
              </div>
            ) : (
              <div>
                <User size={32} style={{ color: '#cbd5e1', margin: '0 auto 0.5rem' }} />
                <p>Kéo thả file vào đây hoặc click để chọn tệp</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hỗ trợ PDF, JPG, PNG (Tối đa 5MB)</p>
              </div>
            )}
          </div>
        </div>

        <Button 
          variant="primary" 
          size="lg" 
          fullWidth 
          type="submit" 
          disabled={isSubmitting}
          icon={isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        >
          {isSubmitting ? 'Đang gửi hồ sơ...' : 'Xác Nhận Ứng Tuyển'}
        </Button>
      </form>
    </div>
  );
};

export default JobApply;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Briefcase, MapPin, CreditCard, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';
import './CreateJob.css';

const STEPS = [
  { id: 1, title: 'Thông tin Dịch vụ', icon: Briefcase },
  { id: 2, title: 'Địa điểm & Thời gian', icon: MapPin },
  { id: 3, title: 'Giá & Hoàn thành', icon: CreditCard },
];

const JOB_TYPES = [
  { id: 'hourly', label: 'Giúp việc theo giờ', icon: '🧹' },
  { id: 'stay', label: 'Giúp việc ở lại', icon: '🏠' },
  { id: 'elder', label: 'Chăm sóc người già', icon: '👵' },
  { id: 'baby', label: 'Chăm sóc trẻ em', icon: '👶' },
];

const CreateJob = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    jobType: '',
    title: '',
    description: '',
    address: '',
    district: '',
    city: 'Hà Nội',
    date: '',
    time: '',
    price: '',
    isNegotiable: false
  });

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Auth Guard Effect
  useEffect(() => {
    if (!isAuthenticated) {
      alert('Bạn cần đăng nhập để đăng tin tìm người!');
      navigate('/dang-nhap');
    } else if (user?.role !== 'employer') {
      alert('Chỉ tài khoản Chủ nhà mới có quyền đăng tin tuyển dụng.');
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = () => {
    // Submit logic include user info
    const finalData = {
       ...formData,
       employerId: user?.id,
       employerName: user?.name,
       contactPhone: user?.phone
    };
    console.log('Publishing Job:', finalData);
    alert('Đăng tin thành công! Tin của bạn đang được duyệt.');
    navigate('/');
  };

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content animate-fade-in">
            <h3 className="section-subtitle">Loại công việc bạn cần?</h3>
            <div className="job-types-grid">
              {JOB_TYPES.map(type => (
                <div 
                  key={type.id}
                  className={`job-type-card ${formData.jobType === type.id ? 'active' : ''}`}
                  onClick={() => updateForm('jobType', type.id)}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span className="type-label">{type.label}</span>
                </div>
              ))}
            </div>

            <div className="form-group mt-4">
              <Input 
                id="title"
                label="Tiêu đề công việc" 
                placeholder="Vd: Cần người dọn dẹp nhà 3 lầu cuối tuần"
                value={formData.title}
                onChange={(e) => updateForm('title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="input-label">Mô tả chi tiết yêu cầu</label>
              <textarea 
                className="input-field textarea-field" 
                rows="4"
                placeholder="Mô tả các công việc cần làm, độ tuổi yêu cầu, v.v..."
                value={formData.description}
                onChange={(e) => updateForm('description', e.target.value)}
              ></textarea>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content animate-fade-in">
            <h3 className="section-subtitle">Địa điểm làm việc</h3>
            <div className="form-row">
              <Input 
                id="city" label="Tỉnh / Thành phố" 
                value={formData.city} readOnly
              />
              <Input 
                id="district" label="Quận / Huyện" 
                placeholder="Vd: Cầu Giấy"
                value={formData.district}
                onChange={(e) => updateForm('district', e.target.value)}
              />
            </div>
            <Input 
              id="address" label="Địa chỉ cụ thể (Số nhà, Ngõ/Hẻm)" 
              placeholder="Vd: Số 12, Ngõ 34..."
              value={formData.address}
              onChange={(e) => updateForm('address', e.target.value)}
            />

            <h3 className="section-subtitle mt-4">Thời gian làm việc</h3>
            <div className="form-row">
              <Input 
                id="date" label="Ngày bắt đầu" type="date"
                value={formData.date}
                onChange={(e) => updateForm('date', e.target.value)}
              />
              <Input 
                id="time" label="Giờ bắt đầu" type="time"
                value={formData.time}
                onChange={(e) => updateForm('time', e.target.value)}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content animate-fade-in">
            <h3 className="section-subtitle">Mức lương / Chi phí</h3>
            <div className="price-input-wrapper">
              <Input 
                id="price" 
                label="Mức lương đề xuất (VNĐ)" 
                type="number" 
                placeholder="Vd: 60000"
                value={formData.price}
                onChange={(e) => updateForm('price', e.target.value)}
              />
              <div className="price-suffix">/ giờ</div>
            </div>
            
            <label className="checkbox-label mt-2">
              <input 
                type="checkbox" 
                checked={formData.isNegotiable}
                onChange={(e) => updateForm('isNegotiable', e.target.checked)}
              />
              <span className="checkbox-text">Có thể thỏa thuận lại sau khi phỏng vấn</span>
            </label>

            <Card className="summary-card mt-4">
              <CardBody>
                <div className="summary-header">
                  <CheckCircle2 size={24} className="text-success" />
                  <h4>Xác nhận thông tin</h4>
                </div>
                <ul className="summary-list">
                  <li><strong>Loại việc:</strong> {JOB_TYPES.find(t => t.id === formData.jobType)?.label || 'Chưa chọn'}</li>
                  <li><strong>Tiêu đề:</strong> {formData.title || 'Chưa có thông tin'}</li>
                  <li><strong>Địa điểm:</strong> {formData.district}, {formData.city}</li>
                  <li><strong>Mức giá:</strong> <span className="text-primary">{formData.price ? `${Number(formData.price).toLocaleString()}đ` : 'Thỏa thuận'}</span></li>
                </ul>
              </CardBody>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="create-job-page container">
      <div className="page-header text-center">
        <h2>Đăng Tin Tìm Người</h2>
        <p className="subtitle">Tiếp cận hàng ngàn người lao động uy tín chỉ trong 3 bước.</p>
      </div>

      <div className="form-container">
        {/* Progress Bar */}
        <div className="stepper-wrapper">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            
            return (
              <div key={step.id} className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                <div className="step-circle">
                  {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                </div>
                <div className="step-title">{step.title}</div>
                {index < STEPS.length - 1 && <div className="step-line"></div>}
              </div>
            );
          })}
        </div>

        {/* Form Body */}
        <Card className="form-card">
          <CardBody>
            {renderStep()}

            {/* Form Actions */}
            <div className="form-actions mt-4">
              <Button 
                variant="ghost" 
                icon={<ArrowLeft size={18} />}
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                Quay Lại
              </Button>
              
              {currentStep < 3 ? (
                <Button 
                  variant="primary" 
                  onClick={handleNext}
                  className="push-right"
                >
                  Tiếp Tục <ArrowRight size={18} />
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleSubmit}
                  className="push-right pulse-btn"
                >
                  Xác Nhận & Đăng Tin
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CreateJob;

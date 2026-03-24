import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Briefcase, MapPin, CreditCard, CheckCircle2, ArrowRight, ArrowLeft, User, Phone } from 'lucide-react';
import { loginFailure, loginStart, loginSuccess } from '../../redux/slices/authSlice';
import { buildUserFromAuthResponse } from '../../utils/auth';
import { getApiErrorMessage } from '../../utils/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';
import './CreateJob.css';

const PROVINCES_API = 'https://provinces.open-api.vn/api/v2/?depth=1';

const STEPS = [
  { id: 1, title: 'Thông tin Dịch vụ', icon: Briefcase },
  { id: 2, title: 'Địa điểm & Thời gian', icon: MapPin },
  { id: 3, title: 'Giá & Hoàn thành', icon: CreditCard },
];

const JOB_TYPES = [
  { id: 'hourly', label: 'Giúp việc theo giờ', icon: '🧹', serviceCategory: 0, timingType: 1, skills: ['Dọn dẹp'] },
  { id: 'stay', label: 'Giúp việc ở lại', icon: '🏠', serviceCategory: 4, timingType: 0, skills: ['Giúp việc nhà'] },
  { id: 'elder', label: 'Chăm sóc người già', icon: '👵', serviceCategory: 2, timingType: 0, skills: ['Chăm sóc người già'] },
  { id: 'baby', label: 'Chăm sóc trẻ em', icon: '👶', serviceCategory: 1, timingType: 1, skills: ['Trông trẻ'] },
];

const initialGuestData = {
  fullName: '',
  phone: '',
};

const initialFormData = {
  jobType: '',
  title: '',
  description: '',
  address: '',
  districtCode: '',
  districtName: '',
  provinceCode: '',
  provinceName: '',
  date: '',
  time: '',
  price: '',
  isNegotiable: false,
};

const selectStyles = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--bg-light)',
};

const CreateJob = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector(state => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [guestData, setGuestData] = useState(initialGuestData);
  const [formData, setFormData] = useState(initialFormData);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    axios.get(PROVINCES_API)
      .then((res) => setProvinces(res.data))
      .catch((err) => {
        console.error('Could not load provinces', err);
        setErrorMsg('Không thể tải danh sách tỉnh/thành. Vui lòng thử lại sau.');
      });
  }, []);

  useEffect(() => {
    if (!formData.provinceCode) {
      setDistricts([]);
      setFormData((prev) => ({ ...prev, districtCode: '', districtName: '' }));
      return;
    }

    axios.get(`https://provinces.open-api.vn/api/p/${formData.provinceCode}?depth=2`)
      .then((res) => setDistricts(res.data.districts || []))
      .catch((err) => {
        console.error('Could not load districts', err);
        setDistricts([]);
      });
  }, [formData.provinceCode]);

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'employer') {
      toast.error('Chỉ tài khoản Chủ nhà mới có quyền đăng tin tuyển dụng.');
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateGuestForm = (field, value) => {
    setGuestData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleProvinceChange = (e) => {
    const code = e.target.value;
    const province = provinces.find((item) => String(item.code) === String(code));

    setFormData((prev) => ({
      ...prev,
      provinceCode: code,
      provinceName: province?.name || '',
      districtCode: '',
      districtName: '',
    }));
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;
    const district = districts.find((item) => String(item.code) === String(code));

    setFormData((prev) => ({
      ...prev,
      districtCode: code,
      districtName: district?.name || '',
    }));
  };

  const validateCurrentStep = () => {
    const nextErrors = {};

    if (currentStep === 1) {
      if (!formData.jobType) nextErrors.jobType = 'Vui lòng chọn loại công việc.';
      if (!formData.title.trim()) nextErrors.title = 'Tiêu đề công việc là bắt buộc.';
      else if (formData.title.trim().length < 5) nextErrors.title = 'Tiêu đề công việc cần ít nhất 5 ký tự.';
      if (!formData.description.trim()) nextErrors.description = 'Mô tả công việc là bắt buộc.';
      else if (formData.description.trim().length < 10) nextErrors.description = 'Mô tả công việc cần ít nhất 10 ký tự.';
    }

    if (currentStep === 2) {
      if (!formData.provinceCode) nextErrors.provinceCode = 'Vui lòng chọn tỉnh / thành phố.';
      if (!formData.districtCode) nextErrors.districtCode = 'Vui lòng chọn quận / huyện.';
      if (!formData.address.trim()) nextErrors.address = 'Địa chỉ cụ thể là bắt buộc.';
      if (!formData.date) nextErrors.date = 'Ngày bắt đầu là bắt buộc.';
      if (!formData.time) nextErrors.time = 'Giờ bắt đầu là bắt buộc.';
    }

    setErrors(nextErrors);
    const valid = Object.keys(nextErrors).length === 0;
    if (!valid) {
      setErrorMsg('Vui lòng kiểm tra lại các trường bắt buộc.');
    } else {
      setErrorMsg('');
    }
    return valid;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const createGuestSessionIfNeeded = async () => {
    if (isAuthenticated && token) return token;

    if (!guestData.fullName.trim() || !guestData.phone.trim()) {
      setErrors((prev) => ({
        ...prev,
        guestFullName: !guestData.fullName.trim() ? 'Họ và tên là bắt buộc.' : '',
        guestPhone: !guestData.phone.trim() ? 'Số điện thoại là bắt buộc.' : '',
      }));
      throw new Error('Vui lòng nhập họ tên và số điện thoại để tạo tài khoản khách.');
    }

    dispatch(loginStart());

    try {
      const response = await axios.post('https://localhost:7004/api/Auth/guest-checkout', {
        fullName: guestData.fullName.trim(),
        phone: guestData.phone.trim(),
      });

      const authData = response.data;
      const guestUser = buildUserFromAuthResponse(authData);
      dispatch(loginSuccess({ user: guestUser, token: authData.token }));
      toast.success('Đã tạo tài khoản khách để tiếp tục đăng tin.');
      return authData.token;
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể tạo tài khoản khách.');
      dispatch(loginFailure(message));
      throw new Error(message);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    if (!formData.price || Number(formData.price) <= 0) {
      setErrors((prev) => ({ ...prev, price: 'Mức giá phải lớn hơn 0.' }));
      setErrorMsg('Vui lòng nhập mức giá lớn hơn 0.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const selectedJobType = JOB_TYPES.find((type) => type.id === formData.jobType);
      if (!selectedJobType) {
        throw new Error('Vui lòng chọn loại công việc.');
      }

      const activeToken = await createGuestSessionIfNeeded();

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: `${formData.address.trim()}, ${formData.districtName}, ${formData.provinceName}`,
        price: parseFloat(formData.price),
        latitude: 0,
        longitude: 0,
        requiredSkills: selectedJobType.skills,
        serviceCategory: selectedJobType.serviceCategory,
        postType: 0,
        timingType: selectedJobType.timingType,
        workingTimeDescription: `Bắt đầu: ${formData.date} lúc ${formData.time}${formData.isNegotiable ? ' | Có thể thương lượng thêm' : ''}`,
        preferredGender: 0,
        targetAgeRange: '20-55',
      };

      const response = await axios.post('https://localhost:7004/api/Job', payload, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });

      toast.success('Đăng tin thành công! Hệ thống đang gợi ý ứng viên phù hợp.');
      navigate(`/ung-tuyen-viec-lam/${response.data.id}`);
    } catch (err) {
      const message = getApiErrorMessage(err, 'Đăng tin thất bại. Vui lòng kiểm tra lại thông tin.');
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content animate-fade-in">
            <h3 className="section-subtitle">Loại công việc bạn cần?</h3>
            <div className="job-types-grid">
              {JOB_TYPES.map((type) => (
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
            {errors.jobType && <div className="input-error-msg" style={{ marginBottom: '1rem' }}>{errors.jobType}</div>}

            <div className="form-group mt-4">
              <Input
                id="title"
                label="Tiêu đề công việc"
                placeholder="Vd: Cần người dọn dẹp nhà cuối tuần"
                value={formData.title}
                onChange={(e) => updateForm('title', e.target.value)}
                error={errors.title}
              />
            </div>
            <div className="form-group">
              <label className="input-label">Mô tả chi tiết yêu cầu</label>
              <textarea
                className="input-field textarea-field"
                style={{ borderColor: errors.description ? 'var(--status-error)' : undefined }}
                rows="4"
                placeholder="Mô tả các công việc cần làm, yêu cầu kinh nghiệm, lưu ý đặc biệt..."
                value={formData.description}
                onChange={(e) => updateForm('description', e.target.value)}
              />
              {errors.description && <span className="input-error-msg">{errors.description}</span>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content animate-fade-in">
            <h3 className="section-subtitle">Địa điểm làm việc</h3>
            <div className="form-row">
              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tỉnh / Thành phố</label>
                <select
                  id="provinceCode"
                  value={formData.provinceCode}
                  onChange={handleProvinceChange}
                  style={{ ...selectStyles, borderColor: errors.provinceCode ? 'var(--status-error)' : selectStyles.border }}
                >
                  <option value="">-- Chọn tỉnh / thành phố --</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>{province.name}</option>
                  ))}
                </select>
                {errors.provinceCode && <span className="input-error-msg">{errors.provinceCode}</span>}
              </div>

              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Quận / Huyện</label>
                <select
                  id="districtCode"
                  value={formData.districtCode}
                  onChange={handleDistrictChange}
                  style={{ ...selectStyles, borderColor: errors.districtCode ? 'var(--status-error)' : selectStyles.border }}
                  disabled={!formData.provinceCode}
                >
                  <option value="">-- Chọn quận / huyện --</option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.code}>{district.name}</option>
                  ))}
                </select>
                {errors.districtCode && <span className="input-error-msg">{errors.districtCode}</span>}
              </div>
            </div>

            <Input
              id="address"
              label="Địa chỉ cụ thể"
              placeholder="Vd: Số 12, ngõ 34..."
              value={formData.address}
              onChange={(e) => updateForm('address', e.target.value)}
              error={errors.address}
            />

            <h3 className="section-subtitle mt-4">Thời gian làm việc</h3>
            <div className="form-row">
              <Input
                id="date"
                label="Ngày bắt đầu"
                type="date"
                value={formData.date}
                onChange={(e) => updateForm('date', e.target.value)}
                error={errors.date}
              />
              <Input
                id="time"
                label="Giờ bắt đầu"
                type="time"
                value={formData.time}
                onChange={(e) => updateForm('time', e.target.value)}
                error={errors.time}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content animate-fade-in">
            {!isAuthenticated && (
              <Card style={{ marginBottom: '1.5rem', border: '1px solid rgba(47, 128, 237, 0.2)', background: 'rgba(47, 128, 237, 0.03)' }}>
                <CardBody>
                  <h3 className="section-subtitle" style={{ marginTop: 0 }}>Tạo tài khoản khách để đăng tin</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Hệ thống sẽ tạo Shadow Account để bạn đăng tin ngay và quản lý tin sau đó.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <Input
                      id="guestFullName"
                      label="Họ và tên"
                      placeholder="Nguyễn Văn A"
                      icon={<User size={18} />}
                      value={guestData.fullName}
                      onChange={(e) => updateGuestForm('fullName', e.target.value)}
                      error={errors.guestFullName}
                    />
                    <Input
                      id="guestPhone"
                      label="Số điện thoại"
                      placeholder="0912345678"
                      icon={<Phone size={18} />}
                      value={guestData.phone}
                      onChange={(e) => updateGuestForm('phone', e.target.value)}
                      error={errors.guestPhone}
                    />
                  </div>
                </CardBody>
              </Card>
            )}

            <h3 className="section-subtitle">Mức lương / Chi phí</h3>
            <div className="price-input-wrapper">
              <Input
                id="price"
                label="Mức lương đề xuất (VNĐ)"
                type="number"
                placeholder="Vd: 60000"
                value={formData.price}
                onChange={(e) => updateForm('price', e.target.value)}
                error={errors.price}
              />
              <div className="price-suffix">/ giờ</div>
            </div>

            <label className="checkbox-label mt-2">
              <input
                type="checkbox"
                checked={formData.isNegotiable}
                onChange={(e) => updateForm('isNegotiable', e.target.checked)}
              />
              <span className="checkbox-text">Có thể thỏa thuận lại sau khi trao đổi</span>
            </label>

            <Card className="summary-card mt-4">
              <CardBody>
                <div className="summary-header">
                  <CheckCircle2 size={24} className="text-success" />
                  <h4>Xác nhận thông tin</h4>
                </div>
                <ul className="summary-list">
                  <li><strong>Loại việc:</strong> {JOB_TYPES.find((item) => item.id === formData.jobType)?.label || 'Chưa chọn'}</li>
                  <li><strong>Tiêu đề:</strong> {formData.title || 'Chưa có thông tin'}</li>
                  <li><strong>Địa điểm:</strong> {formData.address && formData.districtName ? `${formData.address}, ${formData.districtName}, ${formData.provinceName}` : 'Chưa đủ thông tin'}</li>
                  <li><strong>Mức giá:</strong> <span className="text-primary">{formData.price ? `${Number(formData.price).toLocaleString()}đ` : 'Chưa nhập'}</span></li>
                  {!isAuthenticated && <li><strong>Tài khoản khách:</strong> {guestData.fullName || 'Chưa nhập'} - {guestData.phone || 'Chưa nhập'}</li>}
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

        {errorMsg && (
          <div className="container mt-2">
            <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', border: '1px solid #fecaca' }}>
              {errorMsg}
            </div>
          </div>
        )}
      </div>

      <div className="form-container">
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
                {index < STEPS.length - 1 && <div className="step-line" />}
              </div>
            );
          })}
        </div>

        <Card className="form-card">
          <CardBody>
            {renderStep()}

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
                <Button variant="primary" onClick={handleNext} className="push-right">
                  Tiếp Tục <ArrowRight size={18} />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="push-right pulse-btn"
                >
                  {isLoading ? 'Đang xử lý...' : 'Xác Nhận & Đăng Tin'}
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

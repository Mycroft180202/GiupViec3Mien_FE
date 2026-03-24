import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { loginFailure, loginStart, loginSuccess } from '../../redux/slices/authSlice';
import { buildUserFromAuthResponse } from '../../utils/auth';
import { getApiErrorMessage } from '../../utils/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';
import './CreateJob.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7004';
const PROVINCES_API = 'https://provinces.open-api.vn/api/v2/?depth=1';
const today = new Date().toISOString().split('T')[0];

const STEPS = [
  { id: 1, title: 'Thông tin dịch vụ', icon: Briefcase },
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
  provinceCode: '',
  provinceName: '',
  wardCode: '',
  wardName: '',
  wardDistrictName: '',
  date: '',
  startTime: '',
  endTime: '',
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
  const [provinceDetails, setProvinceDetails] = useState({});
  const [loadingWards, setLoadingWards] = useState(false);

  const wards = useMemo(() => {
    if (!formData.provinceCode || !provinceDetails[formData.provinceCode]) {
      return [];
    }

    const districts = provinceDetails[formData.provinceCode]?.districts || [];
    return districts.flatMap(district =>
      (district.wards || []).map(ward => ({
        ...ward,
        districtName: district.name,
      }))
    );
  }, [formData.provinceCode, provinceDetails]);

  useEffect(() => {
    axios
      .get(PROVINCES_API)
      .then(res => setProvinces(res.data))
      .catch(err => {
        console.error('Could not load provinces', err);
        setErrorMsg('Không thể tải danh sách tỉnh/thành. Vui lòng thử lại sau.');
      });
  }, []);

  useEffect(() => {
    if (!formData.provinceCode) {
      setFormData(prev => ({ ...prev, wardCode: '', wardName: '', wardDistrictName: '' }));
      return;
    }

    if (provinceDetails[formData.provinceCode]) {
      return;
    }

    setLoadingWards(true);
    axios
      .get(`https://provinces.open-api.vn/api/p/${formData.provinceCode}?depth=3`)
      .then(res => {
        setProvinceDetails(prev => ({ ...prev, [formData.provinceCode]: res.data }));
      })
      .catch(err => {
        console.error('Could not load wards', err);
        toast.error('Không thể tải danh sách phường/xã của tỉnh này.');
      })
      .finally(() => setLoadingWards(false));
  }, [formData.provinceCode, provinceDetails]);

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'employer') {
      toast.error('Chỉ tài khoản chủ nhà mới có quyền đăng tin tuyển dụng.');
      navigate('/');
    }
  }, [isAuthenticated, navigate, user]);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const updateGuestForm = (field, value) => {
    setGuestData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleProvinceChange = event => {
    const code = event.target.value;
    const province = provinces.find(item => String(item.code) === String(code));

    setFormData(prev => ({
      ...prev,
      provinceCode: code,
      provinceName: province?.name || '',
      wardCode: '',
      wardName: '',
      wardDistrictName: '',
    }));
    setErrors(prev => ({ ...prev, provinceCode: '', wardCode: '' }));
  };

  const handleWardChange = event => {
    const code = event.target.value;
    const ward = wards.find(item => String(item.code) === String(code));

    setFormData(prev => ({
      ...prev,
      wardCode: code,
      wardName: ward?.name || '',
      wardDistrictName: ward?.districtName || '',
    }));
    setErrors(prev => ({ ...prev, wardCode: '' }));
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
      if (!formData.wardCode) nextErrors.wardCode = 'Vui lòng chọn phường / xã.';
      if (!formData.address.trim()) nextErrors.address = 'Địa chỉ cụ thể là bắt buộc.';
      if (!formData.date) nextErrors.date = 'Vui lòng chọn ngày làm việc.';
      else if (formData.date < today) nextErrors.date = 'Ngày làm việc không được ở quá khứ.';
      if (!formData.startTime) nextErrors.startTime = 'Vui lòng chọn giờ bắt đầu.';
      if (!formData.endTime) nextErrors.endTime = 'Vui lòng chọn giờ kết thúc.';
      if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
        nextErrors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu.';
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setErrorMsg('Vui lòng kiểm tra lại các trường bắt buộc.');
      return false;
    }

    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const createGuestSessionIfNeeded = async () => {
    if (isAuthenticated && token) return token;

    const guestErrors = {};
    if (!guestData.fullName.trim()) guestErrors.guestFullName = 'Họ và tên là bắt buộc.';
    if (!guestData.phone.trim()) guestErrors.guestPhone = 'Số điện thoại là bắt buộc.';

    if (Object.keys(guestErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...guestErrors }));
      throw new Error('Vui lòng nhập họ tên và số điện thoại để tạo tài khoản khách.');
    }

    dispatch(loginStart());

    try {
      const response = await axios.post(`${apiBaseUrl}/api/Auth/guest-checkout`, {
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
      setErrors(prev => ({ ...prev, price: 'Mức giá phải lớn hơn 0.' }));
      setErrorMsg('Vui lòng nhập mức giá lớn hơn 0.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const selectedJobType = JOB_TYPES.find(type => type.id === formData.jobType);
      if (!selectedJobType) {
        throw new Error('Vui lòng chọn loại công việc.');
      }

      const activeToken = await createGuestSessionIfNeeded();
      const locationParts = [
        formData.address.trim(),
        formData.wardName,
        formData.wardDistrictName,
        formData.provinceName,
      ].filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: locationParts.join(', '),
        price: parseFloat(formData.price),
        latitude: 0,
        longitude: 0,
        requiredSkills: selectedJobType.skills,
        serviceCategory: selectedJobType.serviceCategory,
        postType: 0,
        timingType: selectedJobType.timingType,
        workDate: formData.date,
        workStartTime: formData.startTime,
        workEndTime: formData.endTime,
        workingTimeDescription: `${formData.date} | ${formData.startTime} - ${formData.endTime}${formData.isNegotiable ? ' | Có thể thương lượng thêm' : ''}`,
        preferredGender: 0,
        targetAgeRange: '20-55',
      };

      const response = await axios.post(`${apiBaseUrl}/api/Job`, payload, {
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
            {errors.jobType && <div className="input-error-msg" style={{ marginBottom: '1rem' }}>{errors.jobType}</div>}

            <div className="form-group mt-4">
              <Input
                label="Tiêu đề công việc"
                placeholder="Ví dụ: Cần người dọn dẹp nhà cuối tuần"
                value={formData.title}
                onChange={event => updateForm('title', event.target.value)}
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
                onChange={event => updateForm('description', event.target.value)}
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
                  value={formData.provinceCode}
                  onChange={handleProvinceChange}
                  style={{ ...selectStyles, borderColor: errors.provinceCode ? 'var(--status-error)' : selectStyles.border }}
                >
                  <option value="">-- Chọn tỉnh / thành phố --</option>
                  {provinces.map(province => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.provinceCode && <span className="input-error-msg">{errors.provinceCode}</span>}
              </div>

              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phường / Xã</label>
                <select
                  value={formData.wardCode}
                  onChange={handleWardChange}
                  style={{ ...selectStyles, borderColor: errors.wardCode ? 'var(--status-error)' : selectStyles.border }}
                  disabled={!formData.provinceCode || loadingWards}
                >
                  <option value="">
                    {loadingWards ? '-- Đang tải phường / xã --' : '-- Chọn phường / xã --'}
                  </option>
                  {wards.map(ward => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name} {ward.districtName ? `- ${ward.districtName}` : ''}
                    </option>
                  ))}
                </select>
                {errors.wardCode && <span className="input-error-msg">{errors.wardCode}</span>}
              </div>
            </div>

            <Input
              label="Địa chỉ cụ thể"
              placeholder="Ví dụ: Số 12, đường Nguyễn Trãi..."
              value={formData.address}
              onChange={event => updateForm('address', event.target.value)}
              error={errors.address}
            />

            <h3 className="section-subtitle mt-4">Thời gian làm việc</h3>
            <div className="form-row">
              <Input
                label="Ngày làm việc"
                type="date"
                min={today}
                value={formData.date}
                onChange={event => updateForm('date', event.target.value)}
                error={errors.date}
              />
              <Input
                label="Giờ bắt đầu"
                type="time"
                value={formData.startTime}
                onChange={event => updateForm('startTime', event.target.value)}
                error={errors.startTime}
              />
              <Input
                label="Giờ kết thúc"
                type="time"
                value={formData.endTime}
                onChange={event => updateForm('endTime', event.target.value)}
                error={errors.endTime}
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
                      label="Họ và tên"
                      placeholder="Nguyễn Văn A"
                      icon={<User size={18} />}
                      value={guestData.fullName}
                      onChange={event => updateGuestForm('fullName', event.target.value)}
                      error={errors.guestFullName}
                    />
                    <Input
                      label="Số điện thoại"
                      placeholder="0912345678"
                      icon={<Phone size={18} />}
                      value={guestData.phone}
                      onChange={event => updateGuestForm('phone', event.target.value)}
                      error={errors.guestPhone}
                    />
                  </div>
                </CardBody>
              </Card>
            )}

            <h3 className="section-subtitle">Mức lương / Chi phí</h3>
            <div className="price-input-wrapper">
              <Input
                label="Mức lương đề xuất (VNĐ)"
                type="number"
                placeholder="Ví dụ: 60000"
                value={formData.price}
                onChange={event => updateForm('price', event.target.value)}
                error={errors.price}
              />
              <div className="price-suffix">/ giờ</div>
            </div>

            <label className="checkbox-label mt-2">
              <input
                type="checkbox"
                checked={formData.isNegotiable}
                onChange={event => updateForm('isNegotiable', event.target.checked)}
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
                  <li><strong>Loại việc:</strong> {JOB_TYPES.find(item => item.id === formData.jobType)?.label || 'Chưa chọn'}</li>
                  <li><strong>Tiêu đề:</strong> {formData.title || 'Chưa có thông tin'}</li>
                  <li>
                    <strong>Địa điểm:</strong>{' '}
                    {[formData.address, formData.wardName, formData.wardDistrictName, formData.provinceName].filter(Boolean).join(', ') || 'Chưa đủ thông tin'}
                  </li>
                  <li><strong>Lịch làm:</strong> {formData.date && formData.startTime && formData.endTime ? `${formData.date} | ${formData.startTime} - ${formData.endTime}` : 'Chưa đủ thông tin'}</li>
                  <li><strong>Mức giá:</strong> <span className="text-primary">{formData.price ? `${Number(formData.price).toLocaleString()}đ` : 'Chưa nhập'}</span></li>
                  {!isAuthenticated && (
                    <li>
                      <strong>Tài khoản khách:</strong> {guestData.fullName || 'Chưa nhập'} - {guestData.phone || 'Chưa nhập'}
                    </li>
                  )}
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
              <Button variant="ghost" icon={<ArrowLeft size={18} />} onClick={handlePrev} disabled={currentStep === 1}>
                Quay lại
              </Button>

              {currentStep < 3 ? (
                <Button variant="primary" onClick={handleNext} className="push-right">
                  Tiếp tục <ArrowRight size={18} />
                </Button>
              ) : (
                <Button variant="primary" size="lg" onClick={handleSubmit} disabled={isLoading} className="push-right pulse-btn">
                  {isLoading ? 'Đang xử lý...' : 'Xác nhận & Đăng tin'}
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

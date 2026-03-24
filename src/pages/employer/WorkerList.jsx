import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, MapPin, Search, ShieldCheck, Star } from 'lucide-react';
import axios from 'axios';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';
import { getApiErrorMessage } from '../../utils/api';
import './WorkerList.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7004';

const SERVICE_OPTIONS = [
  { value: '', label: 'Tất cả dịch vụ' },
  { value: 'Housekeeping', label: 'Giúp việc nhà' },
  { value: 'Babysitting', label: 'Trông trẻ' },
  { value: 'ElderCare', label: 'Chăm sóc người già' },
  { value: 'Cooking', label: 'Nấu ăn' },
  { value: 'GeneralHelper', label: 'Tạp vụ' },
  { value: 'Other', label: 'Khác' },
];

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

const WorkerList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [workers, setWorkers] = useState([]);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [serviceCategory, setServiceCategory] = useState(searchParams.get('serviceCategory') || '');

  const fetchWorkers = async (nextFilters = {}) => {
    setIsLoading(true);
    setError('');

    const filters = {
      keyword,
      location,
      serviceCategory,
      ...nextFilters,
    };

    try {
      const response = await axios.get(`${API_BASE_URL}/api/User/workers/public`, {
        params: {
          keyword: filters.keyword || undefined,
          location: filters.location || undefined,
          serviceCategory: filters.serviceCategory || undefined,
        },
      });

      setWorkers(response.data || []);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Không thể tải danh sách ứng viên.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const nextFilters = { keyword, location, serviceCategory };
    setSearchParams(
      Object.fromEntries(
        Object.entries(nextFilters).filter(([, value]) => value)
      )
    );
    fetchWorkers(nextFilters);
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    setKeyword('');
    setLocation('');
    setServiceCategory('');
    setSearchParams({});
    fetchWorkers({ keyword: '', location: '', serviceCategory: '' });
    setIsFilterOpen(false);
  };

  const resultsLabel = useMemo(() => `${workers.length} hồ sơ công khai`, [workers.length]);

  return (
    <div className="worker-list-page animate-fade-in">
      <div className="search-header-bg">
        <div className="container">
          <h1 style={{ color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>
            Tìm Người Giúp Việc Phù Hợp
          </h1>
          <form
            className="worker-search-bar"
            onSubmit={handleSearch}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr auto',
              gap: '0.5rem',
              backgroundColor: 'white',
              padding: '0.5rem',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <Input
              placeholder="Tên, kỹ năng, công việc đang tìm..."
              icon={<Search size={20} />}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent' }}
            />
            <Input
              placeholder="Khu vực muốn làm..."
              icon={<MapPin size={20} />}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', borderLeft: '1px solid var(--border-color)', borderRadius: 0 }}
            />
            <select
              className="input-field"
              value={serviceCategory}
              onChange={(event) => setServiceCategory(event.target.value)}
              style={{ border: 'none', borderLeft: '1px solid var(--border-color)', borderRadius: 0 }}
            >
              {SERVICE_OPTIONS.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button variant="primary" type="submit" style={{ height: '100%', borderRadius: 'var(--radius-md)' }}>
              Tìm ứng viên
            </Button>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div className="worker-layout">
          <div className="mobile-filter-bar">
            <span>
              Tìm thấy <strong>{resultsLabel}</strong>
            </span>
            <Button variant="outline" size="sm" icon={<Filter size={16} />} onClick={() => setIsFilterOpen(true)}>
              Lọc
            </Button>
          </div>

          <aside className={`worker-filter-sidebar ${isFilterOpen ? 'open' : ''}`}>
            <div className="filter-header-mobile">
              <h3>Bộ lọc</h3>
              <button className="close-filter-btn" onClick={() => setIsFilterOpen(false)}>
                &times;
              </button>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Từ khoá</h4>
              <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tên, kỹ năng..." />
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Khu vực muốn làm</h4>
              <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Ví dụ: Thủ Đức, Quận 7..." />
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Loại công việc</h4>
              <select className="input-field" value={serviceCategory} onChange={(event) => setServiceCategory(event.target.value)}>
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-actions-mobile">
              <Button variant="outline" style={{ flex: 1 }} onClick={handleReset}>
                Xoá lọc
              </Button>
              <Button variant="primary" style={{ flex: 1 }} onClick={handleSearch}>
                Áp dụng
              </Button>
            </div>
          </aside>

          <div className="worker-list-content">
            <div className="desktop-results-count">
              <span>
                Tìm thấy <strong>{resultsLabel}</strong>
              </span>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Xoá bộ lọc
              </Button>
            </div>

            {error && (
              <div className="worker-empty-state" style={{ color: '#dc2626' }}>
                {error}
              </div>
            )}

            {!error && isLoading && (
              <div className="worker-empty-state">Đang tải hồ sơ người tìm việc...</div>
            )}

            {!error && !isLoading && workers.length === 0 && (
              <div className="worker-empty-state">
                Chưa có hồ sơ công khai nào phù hợp với bộ lọc hiện tại.
              </div>
            )}

            <div className="worker-cards-grid">
              {workers.map((worker) => (
                <Card key={worker.id} className="worker-card">
                  <CardBody>
                    <div className="worker-card-header">
                      <div className="worker-avatar-large">
                        {worker.avatarUrl ? (
                          <img src={worker.avatarUrl} alt={worker.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          getInitials(worker.fullName)
                        )}
                      </div>
                      <div className="worker-info-main">
                        <Link to={`/ung-vien/${worker.id}`} className="worker-name-link">
                          <h3 className="worker-name">
                            {worker.fullName}
                            {worker.verified && <ShieldCheck size={18} className="verified-badge" title="Đã xác thực" />}
                          </h3>
                        </Link>
                        <div className="worker-meta">
                          <span>{worker.desiredJobTitle || 'Đang cập nhật mục tiêu công việc'}</span>
                          {worker.locationSummary && (
                            <>
                              {' '}
                              • <span>{worker.locationSummary}</span>
                            </>
                          )}
                        </div>
                        <div className="worker-rating">
                          <Star size={14} fill="#F59E0B" color="#F59E0B" />
                          <span>{worker.experienceYears} năm kinh nghiệm</span>
                          <span className="worker-jobs-done">• {formatPrice(worker.hourlyRate)}/giờ</span>
                        </div>
                      </div>
                    </div>

                    <div className="worker-skills">
                      {(worker.skills || []).slice(0, 5).map((skill) => (
                        <span key={skill} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="worker-highlight">
                      {worker.seekingDescription || 'Ứng viên đang mở hồ sơ công khai để tìm việc phù hợp.'}
                    </div>

                    <div className="worker-card-footer">
                      <div className="worker-location">
                        <MapPin size={16} /> {worker.locationSummary || 'Đang cập nhật khu vực làm việc'}
                      </div>
                      <Link to={`/ung-vien/${worker.id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="primary" size="sm">
                          Xem hồ sơ
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isFilterOpen && <div className="mobile-overlay" onClick={() => setIsFilterOpen(false)} />}
    </div>
  );
};

export default WorkerList;

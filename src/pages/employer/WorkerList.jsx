import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Filter, Briefcase, Loader2, AlertCircle, DollarSign, Clock, User } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';
import './WorkerList.css';

const WorkerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [totalWorkers, setTotalWorkers] = useState(0);

  const [location, setLocation] = useState('Toàn quốc');
  const [category, setCategory] = useState(null);
  const [salaryFilter, setSalaryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchWorkers = async (keyword = searchTerm, loc = location, cat = category, salary = salaryFilter) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const params = new URLSearchParams();
      // PostType=Seeking (1) for finding workers advertising themselves
      params.append('PostType', '1'); 
      
      if (keyword) params.append('Keyword', keyword);
      if (cat !== null) params.append('Category', cat);
      if (loc && loc !== 'Toàn quốc') params.append('Location', loc);

      // Salary Filter Mapping
      if (salary === 'range1') {
        params.append('MinRate', '50000');
        params.append('MaxRate', '100000');
      } else if (salary === 'range2') {
        params.append('MinRate', '100001');
      } else if (salary === 'monthly') {
        params.append('Timing', '0'); // Monthly
      }



      // Connecting to our new ES-backed search endpoint
      // Use the new WorkerSearch dedicated endpoint
      const response = await axios.get(`http://localhost:5275/api/WorkerSearch/search?${params.toString()}`);
      setWorkers(response.data.results);
      setTotalWorkers(response.data.total);

    } catch (err) {
      console.error('Fetch Workers Error:', err);
      setErrorMsg('Không thể tải danh sách người giúp việc. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const getCategoryLabel = (cat) => {
    const labels = {
      0: 'Giúp việc nhà',
      1: 'Trông trẻ',
      2: 'Chăm sóc người già',
      3: 'Nấu ăn',
      4: 'Tạp vụ',
      'housekeeping': 'Giúp việc nhà',
      'babysitting': 'Trông trẻ',
      'eldercare': 'Chăm sóc người già',
      'cooking': 'Nấu ăn'
    };
    return labels[cat?.toString()?.toLowerCase()] || labels[cat] || 'Khác';
  };

  const getTimingLabel = (timing) => {
    if (timing === 0 || timing === 'fulltime') return '/ tháng';
    if (timing === 1 || timing === 'parttime') return '/ giờ';
    return '/ lượt';
  };

  return (
    <div className="worker-list-page container">
      {/* Search Header */}
      <div className="worker-search-header">
        <h1 className="page-title">Tìm Người Giúp Việc</h1>
        <p className="page-subtitle">Tìm kiếm nhân sự phù hợp cho gia đình bạn thông qua hệ thống Elasticsearch</p>
        <div className="search-bar-wrapper">
          <Input 
            placeholder="Tìm theo kỹ năng, tên hoặc mô tả (Vd: Nấu ăn ngon, chăm chỉ...)" 
            icon={<Search size={20} />} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="main-search-input"
          />
          <Button variant="primary" className="search-submit-btn" onClick={() => fetchWorkers()}>Tìm Kiếm</Button>
          <Button 
            variant="outline" 
            className="mobile-filter-btn"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <Filter size={20} /> Lọc
          </Button>
        </div>
      </div>

      <div className="worker-list-layout">
        <aside className={`worker-filters-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
          <div className="filter-header-mobile">
            <h3>Bộ lọc tìm kiếm</h3>
            <button onClick={() => setIsMobileFilterOpen(false)}>&times;</button>
          </div>

          <div className="filter-section">
            <h4 className="filter-title"><Briefcase size={18} /> Chuyên môn</h4>
            <div className="filter-options">
              <label className="checkbox-label">
                <input type="radio" name="cat" checked={category === null} onChange={() => setCategory(null)} /> Tất cả
              </label>
              {[
                { id: 0, label: 'Giúp việc nhà' },
                { id: 1, label: 'Trông trẻ' },
                { id: 2, label: 'Chăm sóc người già' },
                { id: 3, label: 'Nấu ăn' }
              ].map(c => (
                <label key={c.id} className="checkbox-label">
                  <input type="radio" name="cat" checked={category === c.id} onChange={() => setCategory(c.id)} /> {c.label}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4 className="filter-title"><MapPin size={18} /> Khu vực</h4>
            <select className="filter-select" value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="Toàn quốc">Toàn quốc</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
            </select>
          </div>

          <div className="filter-section">
            <h4 className="filter-title"><DollarSign size={18} /> Mức lương mong muốn</h4>
            <div className="filter-options">
              <label className="radio-label">
                <input type="radio" name="salary" checked={salaryFilter === 'all'} onChange={() => setSalaryFilter('all')} /> Tất cả
              </label>
              <label className="radio-label">
                <input type="radio" name="salary" checked={salaryFilter === 'range1'} onChange={() => setSalaryFilter('range1')} /> 50k - 100k / giờ
              </label>
              <label className="radio-label">
                <input type="radio" name="salary" checked={salaryFilter === 'range2'} onChange={() => setSalaryFilter('range2')} /> Trên 100k / giờ
              </label>
              <label className="radio-label">
                <input type="radio" name="salary" checked={salaryFilter === 'monthly'} onChange={() => setSalaryFilter('monthly')} /> Theo tháng
              </label>
            </div>
          </div>

          <Button variant="primary" fullWidth className="apply-filter-btn" onClick={() => {
            fetchWorkers();
            setIsMobileFilterOpen(false);
          }}>
            Lọc kết quả
          </Button>
        </aside>

        <main className="worker-results-main">
          <div className="results-header">
            <p className="results-count">Tìm thấy <strong>{totalWorkers}</strong> người giúp việc</p>
          </div>


          <div className="workers-grid">
            {isLoading ? (
              <div className="loading-state">
                <Loader2 className="animate-spin" size={40} />
                <p>Đang tải danh sách người giúp việc...</p>
              </div>
            ) : errorMsg ? (
              <div className="error-state">
                <AlertCircle size={40} />
                <p>{errorMsg}</p>
                <Button variant="outline" onClick={() => fetchWorkers()}>Thử lại</Button>
              </div>
            ) : workers.length === 0 ? (
              <div className="empty-state">
                <User size={48} />
                <h3>Chưa tìm thấy người phù hợp</h3>
                <p>Thử mở rộng bộ lọc hoặc tìm kiếm theo kỹ năng khác nhé!</p>
              </div>
            ) : (
              workers.map((worker) => (
                <Card key={worker.id} hoverable className="worker-card">
                  <CardBody className="worker-card-body">
                    <div className="worker-header">
                      <div className="worker-avatar-wrapper">
                             {worker.avatarUrl ? (
                               <img src={worker.avatarUrl} alt={worker.fullName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                             ) : (
                               <div className="worker-avatar-placeholder">{worker.fullName?.charAt(0) || 'W'}</div>
                             )}
                      </div>
                      <div className="worker-title-info">
                        <Link to={`/ung-vien/${worker.id}`} className="worker-link">

                          <h3 className="worker-name">{worker.fullName}</h3>
                        </Link>
                        <p className="worker-headline">{worker.bio}</p>

                      </div>
                    </div>
                    <div className="worker-meta">
                       <span><strong>{worker.fullName}</strong></span> • 
                       <span> {worker.experienceYears} năm kinh nghiệm</span>
                    </div>

                    <div className="worker-meta-grid">
                      <div className="meta-item"><Briefcase size={14}/> {getCategoryLabel(worker.serviceCategory)}</div>
                      <div className="meta-item"><MapPin size={14}/> {worker.location}</div>
                    </div>

                    <div className="worker-footer">
                      <div className="worker-price">
                        <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{Number(worker.hourlyRate).toLocaleString()}đ</span>
                        <span className="price-unit">{getTimingLabel(worker.timingType)}</span>
                      </div>
                      <Link to={`/ung-vien/${worker.id}`}>

                        <Button variant="primary" size="sm">Liên hệ</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerList;

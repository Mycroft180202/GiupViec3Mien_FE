import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Filter, Briefcase, Loader2, AlertCircle, DollarSign, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';
import './JobList.css';

const JobList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [location, setLocation] = useState('Toàn quốc');
  const [category, setCategory] = useState(null);
  const [salaryFilter, setSalaryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchJobs = async (keyword = searchTerm, loc = location, cat = category, salary = salaryFilter) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const params = new URLSearchParams();
      // Ensure PostType=Hiring (0) for finding jobs, or omit if you want both
      // For tim-viec, usually only hiring jobs. The backend might default this.
      params.append('PostType', '0'); 
      
      if (keyword) params.append('Keyword', keyword);
      if (cat !== null) params.append('Category', cat);
      if (loc && loc !== 'Toàn quốc') params.append('Location', loc);

      // Salary Filter Mapping
      if (salary === 'range1') {
        params.append('MinPrice', '50000');
        params.append('MaxPrice', '100000');
        params.append('Timing', '1'); // PartTime
      } else if (salary === 'range2') {
        params.append('MinPrice', '100001');
        params.append('Timing', '1'); // PartTime
      } else if (salary === 'monthly') {
        params.append('Timing', '0'); // FullTime
      }

      const response = await axios.get(`https://localhost:7004/api/Job/search?${params.toString()}`);
      setJobs(response.data);
    } catch (err) {
      console.error('Fetch Jobs Error:', err);
      setErrorMsg('Không thể tải danh sách công việc. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
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

  const formatPostedAt = (dateString) => {
    if (!dateString) return 'Vừa xong';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    return `${Math.floor(diffInHours / 24)} ngày trước`;
  };

  return (
    <div className="job-list-page container">
      {/* Search Header */}
      <div className="job-search-header">
        <h1 className="page-title">Tìm Việc Làm</h1>
        <div className="search-bar-wrapper">
          <Input 
            placeholder="Tìm theo từ khóa (Vd: Dọn nhà, nấu ăn...)" 
            icon={<Search size={20} />} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="main-search-input"
          />
          <Button variant="primary" className="search-submit-btn" onClick={() => fetchJobs()}>Tìm Kiếm</Button>
          <Button 
            variant="outline" 
            className="mobile-filter-btn"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <Filter size={20} /> Lọc
          </Button>
        </div>
      </div>

      <div className="job-list-layout">
        {/* Filters Sidebar */}
        <aside className={`job-filters-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
          <div className="filter-header-mobile">
            <h3>Bộ lọc tìm kiếm</h3>
            <button onClick={() => setIsMobileFilterOpen(false)}>&times;</button>
          </div>

          <div className="filter-section">
            <h4 className="filter-title"><Briefcase size={18} /> Loại Công Việc</h4>
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
              <option value="Cần Thơ">Cần Thơ</option>
              <option value="Hải Phòng">Hải Phòng</option>
            </select>
          </div>

          <div className="filter-section">
            <h4 className="filter-title"><DollarSign size={18} /> Mức lương</h4>
            <div className="filter-options">
              <label className="radio-label">
                <input type="radio" name="salary" checked={salaryFilter === 'all'} onChange={() => setSalaryFilter('all')} /> Tất cả mức lương
              </label>
              <label className="radio-label">
                <input type="radio" name="salary" checked={salaryFilter === 'range1'} onChange={() => setSalaryFilter('range1')} /> Từ 50k - 100k / giờ
              </label>
              <label className="radio-label">
                <input type="radio" name="salary" checked={salaryFilter === 'range2'} onChange={() => setSalaryFilter('range2')} /> Trên 100k / giờ
              </label>
              <label className="radio-label">
                <input type="radio" name="salary" checked={salaryFilter === 'monthly'} onChange={() => setSalaryFilter('monthly')} /> Cố định theo tháng
              </label>
            </div>
          </div>

          <Button variant="primary" fullWidth className="apply-filter-btn" onClick={() => {
            fetchJobs();
            setIsMobileFilterOpen(false);
          }}>
            Áp dụng bộ lọc
          </Button>
        </aside>

        {/* Results List */}
        <main className="job-results-main">
          <div className="results-header">
            <p className="results-count">Tìm thấy <strong>{jobs.length}</strong> công việc</p>
          </div>

          <div className="jobs-vertical-list">
            {isLoading ? (
              <div className="loading-state">
                <Loader2 className="animate-spin" size={40} />
                <p>Đang tìm kiếm công việc tốt nhất...</p>
              </div>
            ) : errorMsg ? (
              <div className="error-state">
                <AlertCircle size={40} />
                <p>{errorMsg}</p>
                <Button variant="outline" onClick={() => fetchJobs()}>Thử lại</Button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <Briefcase size={48} />
                <h3>Không tìm thấy công việc nào</h3>
                <p>Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm nhé!</p>
              </div>
            ) : (
              jobs.map((job) => (
                <Card key={job.id} hoverable className="job-list-card">
                  <CardBody className="job-list-card-body">
                    <div className="job-list-info">
                      <Link to={`/viec-lam/${job.id}`} className="job-link">
                        <h3 className="job-list-title">{job.title}</h3>
                      </Link>
                      <div className="job-list-meta">
                        <span className="meta-item"><Briefcase size={16}/> {getCategoryLabel(job.serviceCategory)}</span>
                        <span className="meta-item"><MapPin size={16}/> {job.location}</span>
                        <span className="meta-item"><Clock size={16}/> {formatPostedAt(job.createdAt)}</span>
                      </div>
                    </div>

                    <div className="job-list-action-area">
                      <div className="job-list-price">
                        {Number(job.price).toLocaleString()}đ <span className="price-unit">{getTimingLabel(job.timingType)}</span>
                      </div>
                      <div className="action-buttons">
                        <Link to={`/viec-lam/${job.id}`}>
                          <Button variant="outline" size="sm">Chi tiết</Button>
                        </Link>
                        <Link to={`/viec-lam/${job.id}/apply`}>
                          <Button variant="primary" size="sm">Ứng tuyển</Button>
                        </Link>
                      </div>
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

export default JobList;

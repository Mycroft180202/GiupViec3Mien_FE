import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Filter, Star, Clock, Briefcase, Loader2, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';
import './JobList.css';

// Mock Data
const MOCK_JOBS = [
  { id: 1, title: 'Cần người phụ việc nhà theo giờ', location: 'Quận 1, Hồ Chí Minh', type: 'Giúp việc theo giờ', price: 60000, timeUnit: '/ giờ', postedAt: '2 giờ trước', urgent: true },
  { id: 2, title: 'Giúp việc nhà và nấu ăn tối (Bao ăn ở)', location: 'Cầu Giấy, Hà Nội', type: 'Giúp việc ở lại', price: 8000000, timeUnit: '/ tháng', postedAt: '5 giờ trước', urgent: false },
  { id: 3, title: 'Chăm người già ốm tại bệnh viện rẫy', location: 'Quận 5, Hồ Chí Minh', type: 'Chăm sóc người già', price: 400000, timeUnit: '/ ngày', postedAt: '1 ngày trước', urgent: true },
  { id: 4, title: 'Đón bé đi học về các buổi chiều thứ 2-4-6', location: 'Thanh Xuân, Hà Nội', type: 'Chăm sóc trẻ em', price: 70000, timeUnit: '/ giờ', postedAt: '2 ngày trước', urgent: false },
  { id: 5, title: 'Dọn dẹp văn phòng sáng sớm', location: 'Hải Châu, Đà Nẵng', type: 'Giúp việc theo giờ', price: 50000, timeUnit: '/ giờ', postedAt: '3 ngày trước', urgent: false },
];

const JobList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [location, setLocation] = useState('Toàn quốc');
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchJobs = async (keyword = '', loc = '', cat = null) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('Keyword', keyword);
      if (cat !== null) params.append('Category', cat);

      
      const locationToSearch = loc || location;
      if (locationToSearch && locationToSearch !== 'Toàn quốc') {
        params.append('Location', locationToSearch);
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
      'Housekeeping': 'Giúp việc nhà',
      'Babysitting': 'Trông trẻ',
      'ElderCare': 'Chăm sóc người già'
    };
    return labels[cat] || 'Khác';
  };

  const getTimingLabel = (timing) => {
    const labels = {
      0: '/ tháng', // FullTime (thường cho ở lại hoặc fulltime)
      1: '/ giờ',   // PartTime
      2: '/ buổi',  // Scheduled
      'FullTime': '/ tháng',
      'PartTime': '/ giờ'
    };
    return labels[timing] || '/ lượt';
  };

  const formatPostedAt = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    return `${Math.floor(diffInHours / 24)} ngày trước`;
  };

  return (
    <div className="job-list-page container">
      {/* Top Search Bar */}
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
          <Button variant="primary" className="search-submit-btn" onClick={() => fetchJobs(searchTerm)}>Tìm Kiếm</Button>

          
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
        {/* Sidebar Filters */}
        <aside className={`job-filters-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
          <div className="filter-header-mobile">
            <h3>Bộ lọc tìm kiếm</h3>
            <button onClick={() => setIsMobileFilterOpen(false)}>&times;</button>
          </div>

          <div className="filter-section">
            <h4 className="filter-title">Loại Công Việc</h4>
            <div className="filter-options">
              <label className="checkbox-label"><input type="radio" name="cat" defaultChecked onChange={() => setCategory(null)} /> Tất cả</label>
              <label className="checkbox-label"><input type="radio" name="cat" onChange={() => setCategory(0)} /> Giúp việc nhà</label>
              <label className="checkbox-label"><input type="radio" name="cat" onChange={() => setCategory(1)} /> Trông trẻ</label>
              <label className="checkbox-label"><input type="radio" name="cat" onChange={() => setCategory(2)} /> Chăm sóc người già</label>
              <label className="checkbox-label"><input type="radio" name="cat" onChange={() => setCategory(3)} /> Nấu ăn</label>
            </div>
          </div>


          <div className="filter-section">
            <h4 className="filter-title">Khu vực</h4>
            <select 
              className="filter-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="Toàn quốc">Toàn quốc</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
            </select>
          </div>


          <div className="filter-section">
            <h4 className="filter-title">Mức lương</h4>
            <div className="filter-options">
              <label className="radio-label"><input type="radio" name="salary" /> Tất cả mức lương</label>
              <label className="radio-label"><input type="radio" name="salary" /> Từ 50k - 100k / giờ</label>
              <label className="radio-label"><input type="radio" name="salary" /> Trên 100k / giờ</label>
              <label className="radio-label"><input type="radio" name="salary" /> Cố định theo tháng</label>
            </div>
          </div>

          <Button 
            variant="primary" 
            fullWidth 
            className="apply-filter-btn"
            onClick={() => fetchJobs(searchTerm, location, category)}
          >
            Áp dụng bộ lọc
          </Button>


        </aside>

        {/* Main Job List */}
        <main className="job-results-main">
          <div className="results-header">
            <p className="results-count">Tìm thấy <strong>{jobs.length}</strong> công việc phù hợp</p>
            <div className="sort-wrapper">
              <span>Sắp xếp:</span>
              <select className="filter-select sort-select">
                <option>Mới nhất</option>
                <option>Lương cao nhất</option>
                <option>Gần tôi nhất</option>
              </select>
            </div>
          </div>

          <div className="jobs-vertical-list">
            {isLoading ? (
               <div style={{ textAlign: 'center', padding: '4rem 0', gridColumn: '1/-1' }}>
                 <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary-color)', margin: '0 auto 1.5rem' }} />
                 <p style={{ color: 'var(--text-muted)' }}>Đang tìm kiếm công việc tốt nhất cho bạn...</p>
               </div>
            ) : errorMsg ? (
               <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '12px', color: '#dc2626', gridColumn: '1/-1' }}>
                 <AlertCircle size={40} style={{ marginBottom: '1rem' }} />
                 <p>{errorMsg}</p>
                 <Button variant="outline" size="sm" onClick={fetchJobs} style={{ marginTop: '1rem' }}>Thử lại</Button>
               </div>
            ) : jobs.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '12px', border: '2px dashed #e2e8f0', gridColumn: '1/-1' }}>
                 <Briefcase size={48} style={{ color: '#cbd5e1', marginBottom: '1.5rem', display: 'block', margin: '0 auto 1.5rem' }} />
                 <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Không tìm thấy công việc nào</h3>
                 <p style={{ color: 'var(--text-muted)' }}>Có vẻ như hiện tại chưa có tin đăng nào phù hợp. Bạn hãy quay lại sau nhé!</p>
               </div>
            ) : (
              jobs.map((job) => (
                <Card key={job.id} hoverable className="job-list-card">
                  <CardBody className="job-list-card-body">
                    <div className="job-list-info">
                      {(job.price > 100000 && job.timingType === 1) && <span className="badge-urgent">Lương cao</span>}
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
                      <Link to={`/viec-lam/${job.id}`} className="w-full">
                        <Button variant="outline" fullWidth>Xem Chi Tiết</Button>
                      </Link>
                      <Link to={`/viec-lam/${job.id}/apply`} className="w-full">
                        <Button variant="primary" fullWidth>Ứng Tuyển</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
          
          <div className="pagination">
            <Button variant="ghost" disabled>&laquo; Trước</Button>
            <Button variant="primary" className="page-btn">1</Button>
            <Button variant="ghost" className="page-btn">2</Button>
            <Button variant="ghost" className="page-btn">3</Button>
            <Button variant="ghost">Sau &raquo;</Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobList;

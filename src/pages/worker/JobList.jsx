import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, Star, Clock, Briefcase } from 'lucide-react';
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
          <Button variant="primary" className="search-submit-btn">Tìm Kiếm</Button>
          
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
              <label className="checkbox-label"><input type="checkbox" /> Tất cả</label>
              <label className="checkbox-label"><input type="checkbox" /> Giúp việc theo giờ</label>
              <label className="checkbox-label"><input type="checkbox" /> Giúp việc ở lại</label>
              <label className="checkbox-label"><input type="checkbox" /> Chăm sóc người già</label>
              <label className="checkbox-label"><input type="checkbox" /> Chăm sóc trẻ em</label>
            </div>
          </div>

          <div className="filter-section">
            <h4 className="filter-title">Khu vực</h4>
            <select className="filter-select">
              <option>Toàn quốc</option>
              <option>Hà Nội</option>
              <option>Hồ Chí Minh</option>
              <option>Đà Nẵng</option>
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

          <Button variant="primary" fullWidth className="apply-filter-btn">Áp dụng bộ lọc</Button>
        </aside>

        {/* Main Job List */}
        <main className="job-results-main">
          <div className="results-header">
            <p className="results-count">Tìm thấy <strong>{MOCK_JOBS.length}</strong> công việc phù hợp</p>
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
            {MOCK_JOBS.map((job) => (
              <Card key={job.id} hoverable className="job-list-card">
                <CardBody className="job-list-card-body">
                  <div className="job-list-info">
                    {job.urgent && <span className="badge-urgent">Tuyển gấp</span>}
                    <Link to={`/viec-lam/${job.id}`} className="job-link">
                      <h3 className="job-list-title">{job.title}</h3>
                    </Link>
                    
                    <div className="job-list-meta">
                      <span className="meta-item"><Briefcase size={16}/> {job.type}</span>
                      <span className="meta-item"><MapPin size={16}/> {job.location}</span>
                      <span className="meta-item"><Clock size={16}/> {job.postedAt}</span>
                    </div>
                  </div>

                  <div className="job-list-action-area">
                    <div className="job-list-price">
                      {job.price.toLocaleString()}đ <span className="price-unit">{job.timeUnit}</span>
                    </div>
                    <Link to={`/viec-lam/${job.id}`} className="w-full">
                      <Button variant="outline" fullWidth>Xem Chi Tiết</Button>
                    </Link>
                    <Button variant="primary" fullWidth>Ứng Tuyển</Button>
                  </div>
                </CardBody>
              </Card>
            ))}
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

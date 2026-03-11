import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, Star, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';
import './WorkerList.css';

const MOCK_WORKERS = [
  { id: 101, name: 'Nguyễn Thị Hoa', age: 45, experience: '5 năm', rating: 4.8, jobsDone: 120, location: 'Cầu Giấy, Hà Nội', avatar: 'H', verified: true, skills: ['Nấu ăn', 'Dọn dẹp', 'Đi chợ'], highlight: 'Rất cẩn thận, sạch sẽ' },
  { id: 102, name: 'Lê Hoàng Anh', age: 32, experience: '3 năm', rating: 4.5, jobsDone: 45, location: 'Đống Đa, Hà Nội', avatar: 'A', verified: true, skills: ['Chăm sóc người già', 'Lái xe'], highlight: 'Khỏe mạnh, nhiệt tình' },
  { id: 103, name: 'Trần Cẩm Ly', age: 28, experience: '2 năm', rating: 4.9, jobsDone: 30, location: 'Quận 1, TP. HCM', avatar: 'L', verified: false, skills: ['Trông trẻ', 'Dạy kèm bé học'], highlight: 'Từng là giáo viên mầm non' },
  { id: 104, name: 'Phạm Văn Long', age: 50, experience: '15 năm', rating: 5.0, jobsDone: 300, location: 'Tân Bình, TP. HCM', avatar: 'P', verified: true, skills: ['Bảo vệ', 'Sửa điện nước', 'Chăm vườn'], highlight: 'Nhanh nhẹn, tháo vát' },
];

const WorkerList = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="worker-list-page animate-fade-in">
      
      {/* Search Header */}
      <div className="search-header-bg">
        <div className="container">
          <h1 style={{ color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>Tìm Người Giúp Việc Trực Tiếp</h1>
          <div className="worker-search-bar" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', backgroundColor: 'white', padding: '0.5rem', borderRadius: 'var(--radius-lg)' }}>
             <Input 
                id="search-name" 
                placeholder="Tên, kỹ năng, công việc..." 
                icon={<Search size={20} />} 
                style={{ border: 'none', backgroundColor: 'transparent' }} 
              />
             <div style={{ position: 'relative' }}>
                <Input 
                  id="search-location" 
                  placeholder="Chọn khu vực..." 
                  icon={<MapPin size={20} />} 
                  style={{ border: 'none', backgroundColor: 'transparent', borderLeft: '1px solid var(--border-color)', borderRadius: 0 }} 
                />
             </div>
             <Button variant="primary" style={{ height: '100%', borderRadius: 'var(--radius-md)' }}>Tìm Ứng Viên</Button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div className="worker-layout">
          
          {/* Mobile Filter Toggle */}
          <div className="mobile-filter-bar">
            <span>Tìm thấy <strong>{MOCK_WORKERS.length}</strong> ứng viên phù hợp</span>
            <Button variant="outline" size="sm" icon={<Filter size={16} />} onClick={() => setIsFilterOpen(true)}>
              Lọc & Sắp xếp
            </Button>
          </div>

          {/* Filter Sidebar */}
          <aside className={`worker-filter-sidebar ${isFilterOpen ? 'open' : ''}`}>
            <div className="filter-header-mobile">
              <h3>BỘ LỌC TÌM KIẾM</h3>
              <button className="close-filter-btn" onClick={() => setIsFilterOpen(false)}>&times;</button>
            </div>
            
            <div className="filter-section">
              <h4 className="filter-title">Kỹ Năng Nổi Bật</h4>
              <label className="checkbox-label"><input type="checkbox" /> Nấu ăn ngon (Home cook)</label>
              <label className="checkbox-label"><input type="checkbox" /> Trẻ sơ sinh & Trẻ nhỏ</label>
              <label className="checkbox-label"><input type="checkbox" /> Chăm sóc người ốm</label>
              <label className="checkbox-label"><input type="checkbox" /> Có bằng lái ô tô</label>
              <label className="checkbox-label"><input type="checkbox" /> Giao tiếp ngoại ngữ</label>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Độ Tuổi</h4>
              <label className="radio-label"><input type="radio" name="age" defaultChecked /> Tất cả độ tuổi</label>
              <label className="radio-label"><input type="radio" name="age" /> Từ 18 - 30 tuổi</label>
              <label className="radio-label"><input type="radio" name="age" /> Từ 30 - 45 tuổi</label>
              <label className="radio-label"><input type="radio" name="age" /> Trên 45 tuổi</label>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Cấp Độ Tin Cậy</h4>
              <label className="checkbox-label"><input type="checkbox" defaultChecked /> Đã xác thực CCCD</label>
              <label className="checkbox-label"><input type="checkbox" /> Có điểm đánh giá &gt; 4.0</label>
            </div>

            <div className="filter-actions-mobile">
               <Button variant="outline" style={{ flex: 1 }} onClick={() => setIsFilterOpen(false)}>Xóa Lọc</Button>
               <Button variant="primary" style={{ flex: 1 }} onClick={() => setIsFilterOpen(false)}>Áp Dụng</Button>
            </div>
          </aside>

          {/* Worker List View */}
          <div className="worker-list-content">
            <div className="desktop-results-count">
               <span>Tìm thấy <strong>{MOCK_WORKERS.length}</strong> ứng viên phù hợp nhất</span>
               <select className="input-field" style={{ width: 'auto', padding: '0.25rem 0.5rem' }}>
                 <option>Đánh giá cao nhất</option>
                 <option>Kinh nghiệm lâu nhất</option>
                 <option>Gần tôi nhất</option>
               </select>
            </div>

            <div className="worker-cards-grid">
              {MOCK_WORKERS.map(worker => (
                <Card key={worker.id} className="worker-card">
                   <CardBody>
                      <div className="worker-card-header">
                        <div className="worker-avatar-large">
                           {worker.avatar}
                        </div>
                        <div className="worker-info-main">
                          <Link to={`/ung-vien/${worker.id}`} className="worker-name-link">
                            <h3 className="worker-name">
                              {worker.name} 
                              {worker.verified && <ShieldCheck size={18} className="verified-badge" title="Đã xác thực" />}
                            </h3>
                          </Link>
                          <div className="worker-meta">
                            <span>{worker.age} tuổi</span> • 
                            <span>{worker.experience} kinh nghiệm</span>
                          </div>
                          <div className="worker-rating">
                            <Star size={14} fill="#F59E0B" color="#F59E0B" /> {worker.rating} 
                            <span className="worker-jobs-done">({worker.jobsDone} việc hoàn thành)</span>
                          </div>
                        </div>
                      </div>

                      <div className="worker-skills">
                        {worker.skills.map((skill, idx) => (
                           <span key={idx} className="skill-tag">{skill}</span>
                        ))}
                      </div>

                      <div className="worker-highlight">
                         "{worker.highlight}"
                      </div>

                      <div className="worker-card-footer">
                        <div className="worker-location"><MapPin size={16}/> {worker.location}</div>
                        <Link to={`/ung-vien/${worker.id}`} style={{ textDecoration: 'none' }}>
                           <Button variant="primary" size="sm">Xem Hồ Sơ</Button>
                        </Link>
                      </div>
                   </CardBody>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isFilterOpen && <div className="mobile-overlay" onClick={() => setIsFilterOpen(false)}></div>}
    </div>
  );
};

export default WorkerList;

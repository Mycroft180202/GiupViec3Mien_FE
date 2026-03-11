import React from 'react';
import { Search, MapPin, Briefcase, Star, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardBody } from '../components/ui/Card';
import NewsBulletin from '../components/ui/NewsBulletin';
import './Home.css';

const Home = () => {
  // Mock data for categories
  const categories = [
    { id: 1, name: 'Dọn dẹp nhà cửa', icon: '🧹', count: 1250 },
    { id: 2, name: 'Giúp việc ở lại', icon: '🏠', count: 840 },
    { id: 3, name: 'Chăm sóc người già', icon: '👵', count: 560 },
    { id: 4, name: 'Chăm sóc trẻ em', icon: '👶', count: 920 },
  ];

  // Mock data for featured jobs
  const featuredJobs = [
    {
      id: 1,
      title: 'Cần người phụ việc nhà theo giờ',
      location: 'Quận 1, TP. Hồ Chí Minh',
      price: '60,000đ / giờ',
      time: 'Đăng 2 giờ trước',
      ratingRequired: 4.5
    },
    {
      id: 2,
      title: 'Giúp việc nhà và nấu ăn tối',
      location: 'Cầu Giấy, Hà Nội',
      price: '8,000,000đ / tháng',
      time: 'Đăng 5 giờ trước',
      ratingRequired: 4.0
    },
    {
      id: 3,
      title: 'Chăm người già ốm tại viện',
      location: 'Hải Châu, Đà Nẵng',
      price: '400,000đ / ngày',
      time: 'Đăng 1 ngày trước',
      ratingRequired: 4.8
    }
  ];

  return (
    <div className="home-page">
      <NewsBulletin />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title">Tìm Khách Hàng & Người Giúp Việc Nhanh Chóng, Uy Tín</h1>
          <p className="hero-description">
            Kết nối trực tiếp hàng ngàn công việc và người lao động trên khắp 3 miền với sự đảm bảo và an toàn cao nhất.
          </p>
          
          <div className="search-box">
            <div className="search-inputs">
              <Input 
                placeholder="Ví dụ: Giúp việc theo giờ..." 
                icon={<Search size={20} />} 
                className="search-input"
              />
              <div className="search-divider"></div>
              <Input 
                placeholder="Tỉnh / Thành phố" 
                icon={<MapPin size={20} />} 
                className="search-input"
              />
            </div>
            <Button variant="primary" size="lg" className="search-btn">Tìm Kiếm</Button>
          </div>
          
          <div className="popular-keywords">
            <span>Tìm kiếm phổ biến:</span>
            <span className="keyword-tag">Giúp việc tết</span>
            <span className="keyword-tag">Tạp vụ văn phòng</span>
            <span className="keyword-tag">Chăm sóc bệnh nhân</span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section container">
        <h2 className="section-title">Dịch Vụ Nổi Bật</h2>
        <div className="categories-container">
          <div className="categories-grid">
            {categories.map((cat) => (
              <Card key={cat.id} hoverable className="category-card">
                <CardBody className="category-card-body">
                  <div className="category-icon">{cat.icon}</div>
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-count">{cat.count} công việc</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Việc Làm Mới Nhất</h2>
            <Button variant="ghost">Xem tất cả viêc làm &rarr;</Button>
          </div>
          
          <div className="jobs-grid">
            {featuredJobs.map((job) => (
              <Card key={job.id} hoverable className="job-card">
                <CardBody>
                  <div className="job-header">
                    <h3 className="job-title">{job.title}</h3>
                    <span className="job-price">{job.price}</span>
                  </div>
                  <div className="job-details">
                    <div className="job-detail-item">
                      <MapPin size={16} /> <span>{job.location}</span>
                    </div>
                    <div className="job-detail-item">
                      <Star size={16} className="text-warning" /> <span>Yêu cầu đánh giá {job.ratingRequired}+</span>
                    </div>
                    <div className="job-detail-item">
                      <Clock size={16} /> <span>{job.time}</span>
                    </div>
                  </div>
                  <div className="job-actions">
                    <Button variant="outline" fullWidth>Xem Chi Tiết</Button>
                    <Button variant="primary" fullWidth>Nhận Việc Ngay</Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="trust-section container">
        <div className="trust-banner">
          <div className="trust-content">
            <h2>Đảm bảo An Toàn & Uy Tín</h2>
            <p>Hệ thống đánh giá trung thực, xác thực danh tính 100% người dùng. Giao dịch qua Ví thanh toán an toàn, bảo vệ quyền lợi của cả người thuê và người làm.</p>
            <Button variant="secondary" size="lg" className="mt-4">Tìm Hiểu Quy Trình Bảo Vệ</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

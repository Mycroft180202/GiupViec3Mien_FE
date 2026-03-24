import React from 'react';
import { Search, MapPin, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardBody } from '../components/ui/Card';
import NewsBulletin from '../components/ui/NewsBulletin';
import VietnamJobsMap from '../components/home/VietnamJobsMap';
import './Home.css';

const categories = [
  { id: 1, name: 'Dọn dẹp nhà cửa', icon: '🧹', count: 1250 },
  { id: 2, name: 'Giúp việc ở lại', icon: '🏠', count: 840 },
  { id: 3, name: 'Chăm sóc người già', icon: '👵', count: 560 },
  { id: 4, name: 'Chăm sóc trẻ em', icon: '👶', count: 920 },
];

const featuredJobs = [
  {
    id: 1,
    title: 'Cần người phụ việc nhà theo giờ',
    location: 'Quận 1, TP. Hồ Chí Minh',
    price: '60.000đ / giờ',
    time: 'Đăng 2 giờ trước',
    ratingRequired: 4.5,
  },
  {
    id: 2,
    title: 'Giúp việc nhà và nấu ăn tối',
    location: 'Cầu Giấy, Hà Nội',
    price: '8.000.000đ / tháng',
    time: 'Đăng 5 giờ trước',
    ratingRequired: 4.0,
  },
  {
    id: 3,
    title: 'Chăm người già ốm tại viện',
    location: 'Hải Châu, Đà Nẵng',
    price: '400.000đ / ngày',
    time: 'Đăng 1 ngày trước',
    ratingRequired: 4.8,
  },
];

const Home = () => {
  return (
    <div className="home-page">
      <NewsBulletin />

      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title">Tìm khách hàng và người giúp việc nhanh chóng, uy tín</h1>
          <p className="hero-description">
            Kết nối trực tiếp hàng ngàn công việc và người lao động trên khắp 3 miền với quy trình
            xác thực, đánh giá minh bạch và hỗ trợ an toàn cho cả hai bên.
          </p>

          <div className="search-box">
            <div className="search-inputs">
              <Input
                placeholder="Ví dụ: Giúp việc theo giờ, chăm bé..."
                icon={<Search size={20} />}
                className="search-input"
              />
              <div className="search-divider" />
              <Input
                placeholder="Tỉnh / Thành phố"
                icon={<MapPin size={20} />}
                className="search-input"
              />
            </div>
            <Link to="/tim-viec" className="search-link">
              <Button variant="primary" size="lg" className="search-btn">
                Tìm kiếm
              </Button>
            </Link>
          </div>

          <div className="popular-keywords">
            <span>Tìm kiếm phổ biến:</span>
            <span className="keyword-tag">Giúp việc Tết</span>
            <span className="keyword-tag">Tạp vụ văn phòng</span>
            <span className="keyword-tag">Chăm sóc bệnh nhân</span>
          </div>
        </div>
      </section>

      <section className="categories-section container">
        <h2 className="section-title">Dịch vụ nổi bật</h2>
        <div className="categories-container">
          <div className="categories-grid">
            {categories.map((category) => (
              <Card key={category.id} hoverable className="category-card">
                <CardBody className="category-card-body">
                  <div className="category-icon">{category.icon}</div>
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-count">{category.count.toLocaleString('vi-VN')} công việc</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <VietnamJobsMap />

      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Việc làm mới nhất</h2>
            <Link to="/tim-viec" className="section-link-button">
              <Button variant="ghost">Xem tất cả việc làm →</Button>
            </Link>
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
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="job-detail-item">
                      <Star size={16} className="text-warning" />
                      <span>Yêu cầu đánh giá từ {job.ratingRequired} sao</span>
                    </div>
                    <div className="job-detail-item">
                      <Clock size={16} />
                      <span>{job.time}</span>
                    </div>
                  </div>
                  <div className="job-actions">
                    <Link to="/tim-viec" className="job-action-link">
                      <Button variant="outline" fullWidth>
                        Xem chi tiết
                      </Button>
                    </Link>
                    <Link to="/tim-viec" className="job-action-link">
                      <Button variant="primary" fullWidth>
                        Nhận việc ngay
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-section container">
        <div className="trust-banner">
          <div className="trust-content">
            <h2>Đảm bảo an toàn và uy tín</h2>
            <p>
              Hệ thống đánh giá trung thực, xác thực danh tính người dùng và hỗ trợ xử lý minh bạch
              giúp bảo vệ quyền lợi của cả người thuê lẫn người lao động trong từng giao dịch.
            </p>
            <Button variant="secondary" size="lg" className="mt-4">
              Tìm hiểu quy trình bảo vệ
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

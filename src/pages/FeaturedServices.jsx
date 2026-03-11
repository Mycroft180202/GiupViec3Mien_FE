import React from 'react';
import Card, { CardBody } from '../components/ui/Card';
import { Star, Shield, Clock } from 'lucide-react';

const FeaturedServices = () => {
  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Dịch Vụ Nổi Bật</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Các gói dịch vụ được khách hàng tin dùng nhất trên hệ thống Giúp Việc 3 Miền.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <Card hoverable style={{ borderTop: '4px solid var(--primary-color)' }}>
          <CardBody style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Star size={32} />
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Gói Premium Nhanh Chóng</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Cam kết cung cấp ứng viên phù hợp trong vòng 24h. Phù hợp cho khách hàng cần gấp người dọn dẹp hoặc chăm bệnh.</p>
            <div style={{ fontWeight: 600, fontSize: '1.5rem', color: 'var(--primary-dark)' }}>299.000đ</div>
          </CardBody>
        </Card>

        <Card hoverable style={{ borderTop: '4px solid var(--status-success)' }}>
          <CardBody style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(39, 174, 96, 0.1)', 
              color: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Shield size={32} />
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Gói An Tâm Tuyệt Đối</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Bảo hành ứng viên lên tới 30 ngày. Miễn phí đổi ứng viên 3 lần nếu không hài lòng. Xác minh nhân thân mức độ cao nhất.</p>
            <div style={{ fontWeight: 600, fontSize: '1.5rem', color: 'var(--primary-dark)' }}>499.000đ</div>
          </CardBody>
        </Card>

        <Card hoverable style={{ borderTop: '4px solid var(--accent-color)' }}>
          <CardBody style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(242, 153, 74, 0.1)', 
              color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Clock size={32} />
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Gói Linh Hoạt Theo Giờ</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Mua trước số giờ làm việc với giá ưu đãi. Phù hợp cho dịch vụ tạp vụ văn phòng, hoặc dọn nhà định kỳ hàng tuần.</p>
            <div style={{ fontWeight: 600, fontSize: '1.5rem', color: 'var(--primary-dark)' }}>Từ 45.000đ/h</div>
          </CardBody>
        </Card>

      </div>
    </div>
  );
};

export default FeaturedServices;

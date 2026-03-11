import React from 'react';
import Card, { CardBody } from '../components/ui/Card';
import { BookOpen } from 'lucide-react';

const Handbook = () => {
  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ 
          width: 80, height: 80, borderRadius: '50%', backgroundColor: 'var(--primary-light)', 
          color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <BookOpen size={40} />
        </div>
        <h1 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Cẩm Nang Giúp Việc</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Tuyển tập các bài viết, luật lao động, mẹo gia đình và kiến thức chuyên ngành dành cho cả Chủ Nhà và Người Lao Động.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <Card hoverable>
          <CardBody>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '0.5rem' }}>DÀNH CHO CHỦ NHÀ</div>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', lineHeight: 1.4 }}>Những Lưu Ý Quan Trọng Khi Phỏng Vấn Người Giúp Việc</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>
              Bài viết sẽ hướng dẫn bạn các câu hỏi then chốt để khai thác thông tin trung thực, cũng như các thỏa thuận cần làm rõ ngay từ buổi gặp mặt đầu tiên...
            </p>
            <a href="#" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Đọc tiếp &rarr;</a>
          </CardBody>
        </Card>

        <Card hoverable>
          <CardBody>
            <div style={{ fontSize: '0.85rem', color: 'var(--status-success)', fontWeight: 600, marginBottom: '0.5rem' }}>DÀNH CHO NGƯỜI LAO ĐỘNG</div>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', lineHeight: 1.4 }}>Cách Sắp Xếp Công Việc Tránh Quá Tải Khi Dọn Dẹp</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>
              Một lịch trình lau dọn thông minh không chỉ giúp bạn nhàn hạ, đỡ đau lưng mà còn giữ được kết quả sạch sẽ cho ngôi nhà dài lâu...
            </p>
            <a href="#" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Đọc tiếp &rarr;</a>
          </CardBody>
        </Card>

        <Card hoverable>
          <CardBody>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 600, marginBottom: '0.5rem' }}>KIẾN THỨC NGHỀ</div>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', lineHeight: 1.4 }}>Quy Tắc An Toàn PCCC Cơ Bản Dành Cho Giúp Việc</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>
              Tuyệt đối không sử dụng thiết bị điện khi tay ướt, cách xử lý khi rò rỉ bình gas hoặc khói bếp. Trang bị kiến thức an toàn để bảo vệ bạn và gia đình chủ.
            </p>
            <a href="#" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Đọc tiếp &rarr;</a>
          </CardBody>
        </Card>

      </div>
    </div>
  );
};

export default Handbook;

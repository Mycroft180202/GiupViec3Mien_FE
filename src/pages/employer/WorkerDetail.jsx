import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, CheckCircle2, Phone, MessageSquare, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';

const MOCK_WORKER_DETAIL = {
  id: 101, 
  name: 'Nguyễn Thị Hoa', 
  age: 45, 
  experience: '5 năm', 
  rating: 4.8, 
  jobsDone: 120, 
  location: 'Cầu Giấy, Hà Nội', 
  avatar: 'H', 
  verified: true, 
  skills: ['Nấu ăn', 'Dọn dẹp', 'Đi chợ', 'Sơ cứu cơ bản'], 
  about: 'Tôi là Hoa, quê ở Nam Định. Tôi đã có 5 năm làm giúp việc gia đình tại Hà Nội, chủ yếu là dọn dẹp nhà chung cư và nấu ăn cho các gia đình có trẻ nhỏ. Tôi biết nấu đa dạng các món ăn Bắc và Nam theo khẩu vị an toàn, ít dầu mỡ.',
  hometown: 'Nam Định',
  reviews: [
    { id: 1, author: 'Chị Mai (Cầu Giấy)', text: 'Cô Hoa làm rất cẩn thận, sạch sẽ. Các góc khuất trong bếp đều được dọn kĩ. Rất hài lòng.', rating: 5, date: '10/03/2026' },
    { id: 2, author: 'Anh Dũng (Thanh Xuân)', text: 'Nấu ăn ngon vừa miệng, đến đúng giờ. Điểm trừ nhỏ là hơi ít nói.', rating: 4, date: '15/02/2026' }
  ]
};

const WorkerDetail = () => {
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams();
  const worker = MOCK_WORKER_DETAIL;
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="worker-detail-page bg-light" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      
      {/* Header Banner */}
      <div style={{ backgroundColor: 'var(--primary-dark)', padding: '2rem 0', color: 'white', marginBottom: '2rem' }}>
        <div className="container">
           <Link to="/tim-giup-viec" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
             <ArrowLeft size={16} color="white"/> Trở về danh sách
           </Link>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: 'white', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold' }}>
                {worker.avatar}
              </div>
              <div>
                <h1 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
                  {worker.name}
                  {worker.verified && <ShieldCheck size={28} color="var(--status-success)" title="Đã xác thực" />}
                </h1>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={16} color="rgba(255,255,255,0.9)"/> {worker.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Star size={16} fill="#F59E0B" color="#F59E0B" /> {worker.rating} ({worker.jobsDone} việc)</span>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Main Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <Card>
             <CardBody>
                <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Thông Tin Chung</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Độ tuổi</div>
                    <div style={{ fontWeight: 600 }}>{worker.age} tuổi</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Kinh nghiệm</div>
                    <div style={{ fontWeight: 600 }}>{worker.experience}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Quê quán</div>
                    <div style={{ fontWeight: 600 }}>{worker.hometown}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Huấn luyện</div>
                    <div style={{ fontWeight: 600, color: 'var(--status-success)' }}>Đã qua đào tạo</div>
                  </div>
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Kỹ Năng Nổi Bật</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {worker.skills.map(skill => (
                    <span key={skill} style={{ backgroundColor: 'rgba(39, 174, 96, 0.1)', color: 'var(--status-success)', padding: '0.4rem 1rem', borderRadius: '100px', fontWeight: 600, fontSize: '0.9rem' }}>
                      <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }}/>
                      {skill}
                    </span>
                  ))}
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Giới thiệu bản thân</h3>
                <p style={{ lineHeight: 1.6, color: 'var(--text-main)' }}>{worker.about}</p>
             </CardBody>
           </Card>

           <Card>
             <CardBody>
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Đánh giá từ khách hàng ({worker.reviews.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {worker.reviews.map(review => (
                    <div key={review.id} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong style={{ color: 'var(--text-main)' }}>{review.author}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{review.date}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem' }}>
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} size={14} fill={i < review.rating ? "#F59E0B" : "transparent"} color={i < review.rating ? "#F59E0B" : "var(--border-color)"} />
                        ))}
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontStyle: 'italic' }}>"{review.text}"</p>
                    </div>
                  ))}
                </div>
             </CardBody>
           </Card>
        </div>

        {/* Sidebar Sticky Column */}
        <div style={{ position: 'sticky', top: 'calc(var(--header-height) + 2rem)' }}>
           <Card className="shadow-lg" style={{ border: '2px solid var(--primary-color)' }}>
              <CardBody style={{ textAlign: 'center', padding: '2rem' }}>
                <h3 style={{ margin: '0 0 1.5rem 0' }}>Mời Làm Việc</h3>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Bạn có tin tuyển dụng nào phù hợp? Xin hãy gửi lời mời hoặc liên hệ trực tiếp với người lao động để trao đổi.
                </p>
                
                <Button variant="primary" size="lg" style={{ width: '100%', marginBottom: '1rem' }} onClick={() => setShowContactModal(true)}>
                  Liên Hệ Ngay
                </Button>
                <Button variant="outline" size="lg" style={{ width: '100%' }}>
                  Gửi Lời Mời
                </Button>

                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={16} color="var(--status-success)" /> Cam kết danh tính thực
                  </div>
                  <div>Hỗ trợ đổi người trong 7 ngày đầu</div>
                </div>
              </CardBody>
           </Card>
        </div>

      </div>

      {/* Contact Modal Layer */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
           <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ marginTop: 0 }}>Thông tin liên hệ</h2>
              <p style={{ color: 'var(--text-muted)' }}>Bạn đang xem thông tin liên hệ của <strong>{worker.name}</strong></p>
              
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', margin: '1.5rem 0', fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--primary-color)' }}>
                <Phone size={24}/> 090 123 4567
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                 <Button variant="outline" style={{ flex: 1 }} icon={<MessageSquare size={18}/>}>Nhắn Tin</Button>
                 <Button variant="primary" style={{ flex: 1 }} onClick={() => setShowContactModal(false)}>Đóng</Button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default WorkerDetail;

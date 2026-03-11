import React from 'react';
import { Megaphone, ArrowRight } from 'lucide-react';
import './NewsBulletin.css';

const MOCK_NEWS = [
  { id: 1, title: '🔥 Mới: Trợ cấp 200k cho khách hàng lần đầu đặt giúp việc nhà!', label: 'Khuyến mãi' },
  { id: 2, title: 'Hướng dẫn an toàn mùa dịch bệnh cho người lao động', label: 'Tin tức' },
  { id: 3, title: 'Tuyển gấp 50 cô giữ trẻ khu vực Quận 1, lương 15tr/tháng', label: 'Tuyển dụng' },
  { id: 4, title: 'Ra mắt tính năng: Đánh giá sao & xác thực danh tính', label: 'Hệ thống' }
];

const NewsBulletin = () => {
  return (
    <div className="bulletin-wrapper">
      <div className="container bulletin-container">
        
        <div className="bulletin-header">
          <div className="bulletin-icon-box">
             <Megaphone size={20} className="shake-animation"/>
          </div>
          <h3 className="bulletin-title">Bản tin nhanh</h3>
        </div>

        <div className="bulletin-ticker">
           <div className="ticker-track">
              {/* Duplicate the items to create an infinite scrolling effect */}
              {[...MOCK_NEWS, ...MOCK_NEWS].map((news, index) => (
                <div key={`${news.id}-${index}`} className="ticker-item">
                   <span className="ticker-label">{news.label}</span>
                   <span className="ticker-text">{news.title}</span>
                </div>
              ))}
           </div>
        </div>

        <a href="#" className="bulletin-view-all">
          Xem tất cả <ArrowRight size={16} />
        </a>

      </div>
    </div>
  );
};

export default NewsBulletin;

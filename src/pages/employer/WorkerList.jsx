import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Filter, Star, ShieldCheck, Loader2, AlertCircle, Briefcase } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody } from '../../components/ui/Card';
import './WorkerList.css';

const WorkerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch from Elasticsearch in Backend
  const fetchWorkerAds = async (keyword = '', location = '') => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // PostType=1 means "Seeking" (Workers looking for jobs)
      // This is exactly what an employer wants to find.
      const params = new URLSearchParams();
      params.append('PostType', '1'); 
      if (keyword) params.append('Keyword', keyword);
      if (location) params.append('Location', location);

      const response = await axios.get(`https://localhost:7004/api/Job/search?${params.toString()}`);
      setWorkers(response.data);
    } catch (err) {
      console.error('Fetch Worker Ads Error:', err);
      setErrorMsg('Không thể tải danh sách ứng viên. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerAds();
  }, []);

  const handleSearch = () => {
    fetchWorkerAds(searchTerm, locationTerm);
  };

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
    return labels[cat] || cat || 'Khác';
  };

  return (
    <div className="worker-list-page animate-fade-in">
      
      {/* Search Header */}
      <div className="search-header-bg">
        <div className="container">
          <h1 style={{ color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>Tìm Người Giúp Việc Trực Tiếp</h1>
          <div className="worker-search-bar" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', backgroundColor: 'white', padding: '0.5rem', borderRadius: 'var(--radius-lg)' }}>
             <Input 
                id="search-name" 
                placeholder="Tìm theo kỹ năng, công việc..." 
                icon={<Search size={20} />} 
                style={{ border: 'none', backgroundColor: 'transparent' }} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
             <div style={{ position: 'relative' }}>
                <Input 
                  id="search-location" 
                  placeholder="Khu vực..." 
                  icon={<MapPin size={20} />} 
                  style={{ border: 'none', backgroundColor: 'transparent', borderLeft: '1px solid var(--border-color)', borderRadius: 0 }} 
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                />
             </div>
             <Button variant="primary" style={{ height: '100%', borderRadius: 'var(--radius-md)' }} onClick={handleSearch}>Tìm Ứng Viên</Button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div className="worker-layout">
          
          {/* Mobile Filter Toggle */}
          <div className="mobile-filter-bar">
            <span>Tìm thấy <strong>{workers.length}</strong> ứng viên phù hợp</span>
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
              <h4 className="filter-title">Dịch Vụ</h4>
              <label className="checkbox-label"><input type="checkbox" /> Giúp việc nhà</label>
              <label className="checkbox-label"><input type="checkbox" /> Trông trẻ</label>
              <label className="checkbox-label"><input type="checkbox" /> Chăm sóc người ốm</label>
            </div>

            <Button variant="primary" style={{ width: '100%' }} onClick={() => setIsFilterOpen(false)}>Áp Dụng</Button>
          </aside>

          {/* Worker List View */}
          <div className="worker-list-content">
            <div className="desktop-results-count">
               <span>Tìm thấy <strong>{workers.length}</strong> ứng viên thực tế nhất</span>
               <select className="input-field" style={{ width: 'auto', padding: '0.25rem 0.5rem' }}>
                 <option>Liên quan nhất (Elasticsearch)</option>
                 <option>Mới nhất</option>
                 <option>Gần tôi nhất</option>
               </select>
            </div>

            {isLoading ? (
               <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                 <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary-color)', margin: '0 auto 1.5rem' }} />
                 <p style={{ color: 'var(--text-muted)' }}>Đang tìm kiếm ứng viên trên toàn hệ thống...</p>
               </div>
            ) : errorMsg ? (
               <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '12px', color: '#dc2626' }}>
                 <AlertCircle size={40} style={{ marginBottom: '1rem' }} />
                 <p>{errorMsg}</p>
                 <Button variant="outline" size="sm" onClick={() => fetchWorkerAds()} style={{ marginTop: '1rem' }}>Thử lại</Button>
               </div>
            ) : workers.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
                 <Briefcase size={48} style={{ color: '#cbd5e1', marginBottom: '1.5rem', display: 'block', margin: '0 auto 1.5rem' }} />
                 <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Không tìm thấy ứng viên nào</h3>
                 <p style={{ color: 'var(--text-muted)' }}>Hãy thử thay đổi từ khóa hoặc khu vực tìm kiếm nhé!</p>
               </div>
            ) : (
              <div className="worker-cards-grid">
                {workers.map(worker => (
                  <Card key={worker.id} className="worker-card">
                     <CardBody>
                        <div className="worker-card-header">
                          <div className="worker-avatar-large">
                             {worker.employerAvatarUrl ? (
                               <img src={worker.employerAvatarUrl} alt={worker.employerName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                             ) : (
                               worker.employerName?.charAt(0) || 'W'
                             )}
                          </div>
                          <div className="worker-info-main">
                            <Link to={`/viec-lam/${worker.id}`} className="worker-name-link">
                              <h3 className="worker-name">
                                {worker.title} 
                              </h3>
                            </Link>
                            <div className="worker-meta">
                              <span><strong>{worker.employerName}</strong></span> • 
                              <span>{getCategoryLabel(worker.serviceCategory)}</span>
                            </div>
                            <div className="worker-rating">
                              <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{Number(worker.price).toLocaleString()}đ</span>
                              <span className="worker-jobs-done"> (Lương kỳ vọng)</span>
                            </div>
                          </div>
                        </div>

                        <div className="worker-skills">
                          {(worker.requiredSkills || []).map((skill, idx) => (
                             <span key={idx} className="skill-tag">{skill}</span>
                          ))}
                        </div>

                        <div className="worker-highlight">
                           {worker.description?.length > 100 ? worker.description.substring(0, 100) + '...' : worker.description}
                        </div>

                        <div className="worker-card-footer">
                          <div className="worker-location"><MapPin size={16}/> {worker.location}</div>
                          <Link to={`/viec-lam/${worker.id}`} style={{ textDecoration: 'none' }}>
                             <Button variant="primary" size="sm">Xem Chi Tiết</Button>
                          </Link>
                        </div>
                     </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isFilterOpen && <div className="mobile-overlay" onClick={() => setIsFilterOpen(false)}></div>}
    </div>
  );
};

export default WorkerList;

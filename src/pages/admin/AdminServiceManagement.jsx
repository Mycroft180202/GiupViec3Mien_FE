import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const MOCK_SERVICES = [
  { id: 'S01', name: 'Khóa học Việc nhà cơ bản', type: 'Đào tạo', price: '500,000đ', duration: '3 ngày', status: 'Đang mở' },
  { id: 'S02', name: 'Kỹ năng Chăm sóc người bệnh', type: 'Đào tạo chuyên sâu', price: '1,200,000đ', duration: '1 tuần', status: 'Đang mở' },
  { id: 'S03', name: 'Lái xe đưa đón trẻ em', type: 'Bổ trợ', price: '800,000đ', duration: '2 ngày', status: 'Sắp ra mắt' },
  { id: 'S04', name: 'Gói Xác Thực Danh Tính Pro', type: 'Dịch vụ nền tảng', price: '100,000đ/năm', duration: '1 năm', status: 'Đang mở' },
];

const AdminServiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="dashboard-title">Quản Lý Gói Dịch Vụ & Khóa Học</h2>
          <p className="dashboard-subtitle" style={{ marginBottom: 0 }}>Tạo, sửa đổi các tùy chọn nâng cấp cho người lao động lấy thẻ kỹ năng.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
           <Input 
             placeholder="Tìm khóa học, dịch vụ..." 
             icon={<Search size={18}/>}
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             style={{ width: '250px', marginBottom: 0 }}
           />
           <Button variant="outline" icon={<Filter size={18} />}>Lọc</Button>
           <Button variant="primary" icon={<Plus size={18} />}>Thêm Mới</Button>
        </div>
      </div>

      <Card>
        <CardBody style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Mã DV</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Tên Dịch Vụ / Khóa Học</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Phân Loại</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Đơn Giá</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Trạng thái</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SERVICES.map((srv) => (
                <tr key={srv.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>#{srv.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <Package size={16} color="var(--primary-color)" /> {srv.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Thời lượng: {srv.duration}</div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    {srv.type}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--status-success)' }}>
                    {srv.price}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem',
                      backgroundColor: srv.status === 'Đang mở' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(242, 153, 74, 0.1)',
                      color: srv.status === 'Đang mở' ? 'var(--status-success)' : '#D97706'
                    }}>
                      {srv.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                       <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Edit size={18}/></button>
                       <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-error)' }}><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminServiceManagement;

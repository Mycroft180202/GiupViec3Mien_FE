import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Shield, User } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const MOCK_USERS = [
  { id: 'u101', name: 'Nguyễn Văn A', email: 'vana@gmail.com', role: 'worker', status: 'active', registeredAt: '12/03/2026' },
  { id: 'u102', name: 'Công ty TNHH Clean', email: 'contact@clean.vn', role: 'employer', status: 'active', registeredAt: '10/03/2026' },
  { id: 'u103', name: 'Trần Thị B', email: 'btran@yahoo.com', role: 'worker', status: 'banned', registeredAt: '05/03/2026' },
  { id: 'u104', name: 'Lê Hoàng C', email: 'hoangc123@gmail.com', role: 'employer', status: 'pending', registeredAt: '15/03/2026' },
];

const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="dashboard-title">Quản Lý Người Dùng</h2>
          <p className="dashboard-subtitle" style={{ marginBottom: 0 }}>Quản lý tài khoản Chủ nhà và Người lao động trên hệ thống.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <Input 
             placeholder="Tìm kiếm email, ID..." 
             icon={<Search size={18}/>}
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             style={{ width: '250px' }}
           />
           <Button variant="outline" icon={<Filter size={18} />}>Lọc</Button>
        </div>
      </div>

      <Card>
        <CardBody style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>ID</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Người dùng</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Phân quyền</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Trạng thái</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Ngày ĐK</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>#{user.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                      padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem',
                      backgroundColor: user.role === 'employer' ? 'rgba(47, 128, 237, 0.1)' : 'var(--bg-main)',
                      color: user.role === 'employer' ? 'var(--primary-color)' : 'var(--text-main)'
                    }}>
                       {user.role === 'employer' ? <Shield size={14}/> : <User size={14}/>}
                       {user.role === 'employer' ? 'Chủ Nhà' : 'Người Làm'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem',
                      backgroundColor: user.status === 'active' ? 'rgba(39, 174, 96, 0.1)' : user.status === 'banned' ? 'rgba(235, 87, 87, 0.1)' : 'rgba(242, 153, 74, 0.1)',
                      color: user.status === 'active' ? 'var(--status-success)' : user.status === 'banned' ? 'var(--status-error)' : '#D97706'
                    }}>
                      {user.status === 'active' ? 'Đang hoạt động' : user.status === 'banned' ? 'Đã khóa' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {user.registeredAt}
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

export default AdminUserManagement;

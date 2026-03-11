import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, backgroundColor: 'var(--bg-main)' }}>
        <Outlet />
      </main>
      <footer style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        backgroundColor: 'var(--bg-card)', 
        borderTop: '1px solid var(--border-color)', 
        marginTop: 'auto',
        color: 'var(--text-muted)',
        fontSize: 'var(--font-size-small)'
      }}>
        <div className="container">
          <p>&copy; 2026 Giúp Việc 3 Miền. Đã đăng ký bản quyền.</p>
          <p style={{ marginTop: '0.5rem' }}>Nền tảng giúp việc nhanh chóng, uy tín và an toàn.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

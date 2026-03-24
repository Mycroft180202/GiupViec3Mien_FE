import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Bell, LogOut, Menu, UserCircle } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import Button from '../ui/Button';
import './Header.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7004';

const formatNotificationTime = (isoDate) => {
  if (!isoDate) return '';

  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} giờ trước`;
  return `${Math.floor(diffMinutes / 1440)} ngày trước`;
};

const Header = () => {
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const notificationPanelRef = useRef(null);

  const displayName = user?.fullName || user?.name || 'Tài khoản';
  const hasNotifications = useMemo(() => notifications.length > 0, [notifications]);

  const loadNotifications = async () => {
    if (!token) return;

    setIsLoadingNotifications(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/api/Notification?limit=12`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(response.data?.items || []);
      setUnreadCount(response.data?.unreadCount || 0);
    } catch (error) {
      console.error('Load notifications error:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setNotifications([]);
      setUnreadCount(0);
      return undefined;
    }

    loadNotifications();

    const connection = new HubConnectionBuilder()
      .withUrl(`${apiBaseUrl}/notificationHub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on('NotificationReceived', (notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 12));
      setUnreadCount((prev) => prev + 1);
      toast(notification.title || 'Bạn có thông báo mới.');
    });

    connection.start().catch((error) => {
      console.error('SignalR notification connection error:', error);
    });

    return () => {
      connection.stop().catch(() => {});
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleBellClick = async () => {
    const nextOpen = !isNotificationOpen;
    setIsNotificationOpen(nextOpen);

    if (nextOpen && unreadCount > 0) {
      try {
        await axios.post(
          `${apiBaseUrl}/api/Notification/read-all`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnreadCount(0);
        setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      } catch (error) {
        console.error('Mark all notifications as read error:', error);
      }
    }
  };

  const handleNotificationClick = async (notification) => {
    setIsNotificationOpen(false);

    if (!notification.isRead) {
      try {
        await axios.post(
          `${apiBaseUrl}/api/Notification/${notification.id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Mark notification as read error:', error);
      }
    }

    setNotifications((prev) =>
      prev.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item))
    );

    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <header className="header">
      <div className="container header-content">
        <div className="flex-center">
          <button className="mobile-menu-btn" aria-label="Mở menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={24} />
          </button>

          <Link to="/" className="logo">
            <span className="logo-text">Giúp Việc 3 Miền</span>
          </Link>
        </div>

        <nav className={`main-nav desktop-nav ${isMenuOpen ? 'open' : ''}`} style={{ display: 'flex', gap: '1.5rem' }}>
          {user?.role !== 'worker' && (
            <Link to="/tim-giup-viec" onClick={() => setIsMenuOpen(false)} className="nav-link">
              Tìm người giúp việc
            </Link>
          )}
          <Link to="/tim-viec" onClick={() => setIsMenuOpen(false)} className="nav-link">
            Tìm việc làm
          </Link>
          <Link to="/dich-vu-noi-bat" onClick={() => setIsMenuOpen(false)} className="nav-link">
            Dịch vụ nổi bật
          </Link>
          <Link to="/cam-nang" onClick={() => setIsMenuOpen(false)} className="nav-link">
            Cẩm nang
          </Link>
        </nav>

        <div className="header-actions">
          {isAuthenticated && (
            <div className="notification-wrapper" ref={notificationPanelRef}>
              <button className="icon-btn notification-btn" aria-label="Thông báo" onClick={handleBellClick}>
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="notification-panel">
                  <div className="notification-panel-header">
                    <h4>Thông báo</h4>
                  </div>

                  {isLoadingNotifications ? (
                    <div className="notification-empty">Đang tải thông báo...</div>
                  ) : !hasNotifications ? (
                    <div className="notification-empty">Chưa có thông báo nào.</div>
                  ) : (
                    <div className="notification-list">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="notification-item-title">{notification.title}</div>
                          <div className="notification-item-message">{notification.message}</div>
                          <div className="notification-item-time">{formatNotificationTime(notification.createdAt)}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <div className="user-menu">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={displayName} className="header-avatar" />
                  ) : (
                    <UserCircle size={28} className="user-icon" />
                  )}
                  <span className="user-name" style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                    {displayName}
                  </span>
                </div>
              </Link>
              <button onClick={handleLogout} className="icon-btn" aria-label="Đăng xuất" title="Đăng xuất">
                <LogOut size={20} />
              </button>
              {user?.role === 'employer' && (
                <Link to="/dang-tin" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" className="post-job-btn">
                    Đăng tin ngay
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/dang-nhap" style={{ textDecoration: 'none' }}>
                <div className="user-menu">
                  <UserCircle size={28} className="user-icon" />
                  <span className="user-name" style={{ color: 'var(--text-main)' }}>
                    Đăng nhập
                  </span>
                </div>
              </Link>
              <Link to="/dang-ky" style={{ textDecoration: 'none' }}>
                <Button variant="outline" className="post-job-btn">
                  Đăng ký
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

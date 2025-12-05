import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const AdminSidebar = () => {
  const location = useLocation();
  const { handleLogout } = useAuth(); // Ambil fungsi logout dari context
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/absensi', icon: '📋', label: 'Absensi' },
    { path: '/gaji', icon: '💰', label: 'Gaji & Tunjangan' },
    { path: '/profile', icon: '👤', label: 'Profil' },
  ];

  const onLogoutClick = async () => {
    await handleLogout();
    // Arahkan ke halaman login setelah logout
    navigate('/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
       <h2>🕐 AbsensiKu</h2>
        <p>Sistem Absensi Digital</p>
      </div>

      <div className="admin-sidebar-menu">
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            className={`admin-menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="admin-menu-icon">{item.icon}</span>
            <span className="admin-menu-label">{item.label}</span>
          </Link>
        ))}
      </div>

      <button onClick={onLogoutClick} className="admin-menu-item logout-button">
        <span className="admin-menu-icon">🚪</span>
        <span className="admin-menu-label">Logout</span>
      </button>

      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <div className="admin-user-avatar">Em</div>
          <div className="admin-user-details">
            <p className="admin-user-name">Employee</p>
            <p className="admin-user-role">Employee</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

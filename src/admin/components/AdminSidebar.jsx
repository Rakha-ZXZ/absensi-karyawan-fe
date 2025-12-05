import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminSidebar.css';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const AdminSidebar = () => {
  const location = useLocation();
  const { handleLogout } = useAuth(); // Ambil fungsi logout dari context
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/absensi', icon: '📋', label: 'Kelola Absensi' },
    { path: '/admin/rekap-absensi', icon: '📑', label: 'Rekap Absensi' },
    { path: '/admin/karyawan', icon: '👥', label: 'Kelola Karyawan' },
    { path: '/admin/pengaturan', icon: '⚙️', label: 'Pengaturan' },
  ];

  const onLogoutClick = async () => {
    await handleLogout();
    // Arahkan ke halaman login setelah logout
    navigate('/admin/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>⚙️ Admin Panel</h2>
        <p>Sistem Manajemen Absensi</p>
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
          <div className="admin-user-avatar">AD</div>
          <div className="admin-user-details">
            <p className="admin-user-name">Admin</p>
            <p className="admin-user-role">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

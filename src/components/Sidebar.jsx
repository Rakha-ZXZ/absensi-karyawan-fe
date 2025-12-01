import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/absensi', icon: '📋', label: 'Absensi' },
    { path: '/gaji', icon: '💰', label: 'Gaji & Tunjangan' },
    { path: '/profile', icon: '👤', label: 'Profil' },
  ];
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🕐 AbsensiKu</h2>
        <p>Sistem Absensi Digital</p>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link 
            to={item.path} 
            key={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">AB</div>
          <div className="user-details">
            <p className="user-name">Andi Budiman</p>
            <p className="user-role">Karyawan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
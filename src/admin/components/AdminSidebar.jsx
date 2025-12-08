import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminSidebar.css';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const isLocalDevelopment = import.meta.env.DEV;
const API_BASE_URL = isLocalDevelopment ? '/' : import.meta.env.VITE_API_URL;

const AdminSidebar = () => {
  const location = useLocation();
  const { handleLogout } = useAuth(); // Ambil fungsi logout dari context
  const navigate = useNavigate();
  const [adminProfile, setAdminProfile] = useState({ nama: 'Admin', role: 'admin' });
  const [isLoading, setIsLoading] = useState(true);

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/absensi', icon: '📋', label: 'Kelola Absensi' },
    { path: '/admin/rekap-absensi', icon: '📑', label: 'Rekap Absensi' },
    { path: '/admin/karyawan', icon: '👥', label: 'Kelola Karyawan' },
    { path: '/admin/penggajian', icon: '💰', label: 'Penggajian' },
    { path: '/admin/pengaturan', icon: '⚙️', label: 'Pengaturan' },
  ];

  useEffect(() => {
    const fetchAdminProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}api/admin/profile`, {
          // Browser akan otomatis mengirim cookie
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Gagal memuat profil admin.');
        }
        const data = await response.json();
        setAdminProfile(data);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        // Biarkan state default jika gagal
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const onLogoutClick = async () => {
    await handleLogout();
    // Arahkan ke halaman login setelah logout
    navigate('/admin/login');
  };

  // Fungsi untuk membuat inisial avatar dari nama
  const getAvatarInitials = (name) => {
    if (!name) return 'AD'; // Default
    const words = name.split(' ');
    if (words.length > 1) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    // Jika hanya satu kata, ambil 2 huruf pertama
    return name.substring(0, 2).toUpperCase();
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

      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <div className="admin-user-avatar">{getAvatarInitials(adminProfile.nama)}</div>
          <div className="admin-user-details">
            <p className="admin-user-name">{isLoading ? 'Memuat...' : adminProfile.nama}</p>
            <p className="admin-user-role">{adminProfile.role === 'admin' ? 'Administrator' : adminProfile.role}</p>
          </div>
        </div>
        <button onClick={onLogoutClick} className="admin-menu-item logout-button">
          <span className="admin-menu-icon">🚪</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

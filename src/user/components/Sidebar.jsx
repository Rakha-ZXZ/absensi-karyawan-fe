import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { useEffect,useState } from 'react';
const AdminSidebar = () => {
  const location = useLocation();
  const { handleLogout } = useAuth(); // Ambil fungsi logout dari context
  const navigate = useNavigate();
   const [profileData, setProfileData] = useState(null);

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

    useEffect(() => {
      const fetchProfileData = async () => {
        try {         
          // Menggunakan fetch API untuk mengambil data profil
          const response = await fetch('/api/employee/profile', {
            // 'credentials: include' penting untuk mengirim cookie otentikasi ke backend
            credentials: 'include',
          });
  
          const data = await response.json();
  
          if (!response.ok) {
            // Jika status response bukan 2xx, lemparkan error dengan pesan dari server
            throw new Error(data.message || 'Gagal mengambil data profil.');
          }
  
          setProfileData(data);
          
        } catch (err) {
          // Tangkap error dari network atau dari 'throw new Error' di atas          
          console.error("Fetch profile error:", err);
        } 
      };
  
      fetchProfileData();
    }, []);

    const getInitials = (name) => (name || '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

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
        {profileData && (
          <div className="admin-user-info">
            <div className="admin-user-avatar">{getInitials(profileData.nama)}</div>
            <div className="admin-user-details">
              <p className="admin-user-name">{profileData.nama}</p>
              <p className="admin-user-role">{profileData.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;

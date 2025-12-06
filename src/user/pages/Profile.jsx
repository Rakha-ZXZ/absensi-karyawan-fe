import React, { useState, useEffect } from 'react';
import './Profile.css';
import './Absensi.css'; // Impor untuk gaya status yang konsisten
// import { api } from '../../lib/api'; // Tidak lagi digunakan, kita akan pakai fetch
import ChangePasswordModal from '../components/ChangePasswordModal';

const Profile = () => {
 
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
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
        setError(null);
      } catch (err) {
        // Tangkap error dari network atau dari 'throw new Error' di atas
        setError(err.message);
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali saat komponen dimuat

  if (loading) {
    return <div className="profile-page"><h1 className="page-title">Memuat Profil...</h1></div>;
  }

  if (error) {
    return <div className="profile-page"><h1 className="page-title" style={{ color: 'red' }}>Error: {error}</h1></div>;
  }

  if (!profileData) {
    return <div className="profile-page"><h1 className="page-title">Data profil tidak ditemukan.</h1></div>;
  }

  const getInitials = (name) => (name || '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="profile-page">
      <h1 className="page-title">Profil Karyawan</h1>

      {/* Header Profil */}
      <div className="profile-header-card glass-card">
        <div className="profile-identity">
          <div className="profile-avatar-large">
            <div className="avatar-initials">{getInitials(profileData.nama)}</div>
            <div className="avatar-status-indicator active"></div>
          </div>
          <div className="profile-identity-info">
            <h2>{profileData.nama}</h2>
            <p className="profile-meta">{profileData.jabatan} • {profileData.departemen}</p>
            <div className="profile-status">
              <span className={`status-badge status-${profileData.status.toLowerCase().replace(' ', '-')}`}>
                {profileData.status}
              </span>
              <span className="nip-badge">ID: {profileData.employerId || 'N/A'}</span>
              <span className="join-date"> {/* Menggunakan createdAt atau tanggalBergabung dari model */}
                Bergabung: {new Date(profileData.tanggalMasuk || profileData.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Informasi */}
      <div className="profile-content-grid">
        {/* Kolom Kiri: Informasi Pribadi */}
        <div className="profile-column">
          <div className="profile-section glass-card">
            <div className="section-header">
              <h3 className="section-title">📋 Informasi Pribadi</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Nama Lengkap</span>
                <span className="info-value">{profileData.nama}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Jabatan</span>
                <span className="info-value">{profileData.jabatan}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Departemen</span>
                <span className="info-value">{profileData.departemen}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">ID</span>
                <span className="info-value">{profileData.employerId || 'N/A'}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Status Karyawan</span>
                <div className="status-select-container">
                    <span className={`status-badge status-${profileData.status.toLowerCase().replace(' ', '-')}`}>
                      {profileData.status}
                    </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Informasi Kontak & Aktivitas */}
        <div className="profile-column">
          <div className="profile-section glass-card">
            <div className="section-header">
              <h3 className="section-title">📞 Informasi Kontak</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Email</span>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <span className="info-value">{profileData.email}</span>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-label">Telepon</span>
                <div className="contact-item">
                  <span className="contact-icon">📱</span> {/* Backend menggunakan nomorTelepon */}
                  <span className="info-value">{profileData.nomorTelepon || 'N/A'}</span>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-label">Alamat</span>
                <div className="contact-item">
                  <span className="contact-icon">🏠</span>
                  <span className="info-value">{profileData.alamat || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Keamanan Akun */}
          <div className="profile-section glass-card">
            <div className="section-header">
              <h3 className="section-title">🔒 Keamanan Akun</h3>
            </div>
            <div className="security-info">
              <div className="security-item">
                <span className="security-icon">🔐</span>
                <div className="security-details">
                  <div className="security-title">Password</div>
                  <div className="security-desc">Terakhir diubah 30 hari yang lalu</div>
                </div>
                <button className="btn-security" onClick={() => setChangePasswordModalOpen(true)}>
                  <span className="btn-icon">✏️</span>
                  Ubah
                </button>
              </div>
              
              <div className="security-item">
                <span className="security-icon">📱</span>
                <div className="security-details">
                  <div className="security-title">Sesi Aktif</div>
                  <div className="security-desc">1 perangkat terkoneksi</div>
                </div>
                <button className="btn-security">
                  <span className="btn-icon">👁️</span>
                  Lihat
                </button>
              </div>
            </div>
            
            <div className="security-note">
              <span className="note-icon">⚠️</span>
              <span className="note-text">Untuk keamanan, jangan bagikan informasi login Anda kepada siapapun</span>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={isChangePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
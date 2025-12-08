import React, { useState, useEffect } from 'react';
import './Pengaturan.css';

const isLocalDevelopment = import.meta.env.DEV;
const API_BASE_URL = isLocalDevelopment ? '/' : import.meta.env.VITE_API_URL;

const Pengaturan = () => {
  // State untuk menyimpan nilai dari form, diisi dengan data awal
  const [generalSettings, setGeneralSettings] = useState({
    namaPerusahaan: 'PT. Teknologi Nusantara',
    alamat: 'Jl. Inovasi Raya No. 42, Jakarta',
    jamMasuk: '08:00',
    jamPulang: '17:00',
  });

  // State untuk form ganti password
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State untuk pesan status dan loading form password
  const [passwordStatus, setPasswordStatus] = useState({ message: '', isError: false });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // State untuk profil admin
  const [adminProfile, setAdminProfile] = useState({ nama: '' });
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // Mengambil data profil admin saat komponen dimuat
  useEffect(() => {
    const fetchAdminProfile = async () => {
      setIsProfileLoading(true);
      setProfileError(null);
      try {
        const response = await fetch(`${API_BASE_URL}api/admin/profile`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Gagal mengambil profil admin.');
        }
        const data = await response.json();
        setAdminProfile(data);
      } catch (err) {
        setProfileError(err.message);
      } finally {
        setIsProfileLoading(false);
      }
    };
    fetchAdminProfile();
  }, []);

  // Handler untuk input form password
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Handler untuk submit form ganti password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ message: '', isError: false });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ message: 'Password baru dan konfirmasi password tidak cocok.', isError: true });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordStatus({ message: 'Password baru minimal harus 6 karakter.', isError: true });
      return;
    }

    setIsPasswordLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengubah password.');
      }

      setPasswordStatus({ message: 'Password berhasil diubah!', isError: false });
      // Reset form setelah berhasil
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordStatus({ message: error.message, isError: true });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="pengaturan-container">
      <div className="page-header">
        <h1>Pengaturan Sistem</h1>
        <p>Kelola pengaturan umum untuk aplikasi absensi Anda.</p>
      </div>

      <div className="settings-card">
        <h2 className="card-title">Informasi & Jam Kerja</h2>
        <div className="form-group">
          <label>Nama Perusahaan</label>
          <div className="user-info-display">{generalSettings.namaPerusahaan}</div>
        </div>
        <div className="form-group">
          <label>Alamat Perusahaan</label>
          <div className="user-info-display">{generalSettings.alamat}</div>
        </div>
        <div className="form-group">
          <label>Jam Masuk Kantor</label>
          <div className="user-info-display">{generalSettings.jamMasuk}</div>
        </div>
        <div className="form-group">
          <label>Jam Pulang Kantor</label>
          <div className="user-info-display">{generalSettings.jamPulang}</div>
        </div>
      </div>

      <div className="settings-card">
        <h2 className="card-title">Keamanan Akun</h2>
        <div className="form-group">
          <label>Nama Pengguna (Saat ini login)</label>
          <div className="user-info-display">
            {isProfileLoading ? 'Memuat...' : profileError ? 'Gagal memuat' : adminProfile.nama}
          </div>
        </div>
        <form onSubmit={handlePasswordSubmit}>
          {passwordStatus.message && (
            <div className={`status-message ${passwordStatus.isError ? 'error' : 'success'}`}>
              {passwordStatus.message}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="currentPassword">Password Saat Ini</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              className="form-input"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Password Baru</label>
            <input type="password" id="newPassword" name="newPassword" className="form-input" value={passwordData.newPassword} onChange={handlePasswordChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
            <input type="password" id="confirmPassword" name="confirmPassword" className="form-input" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
          </div>
          <div className="submit-area">
            <button type="submit" className="save-btn" disabled={isPasswordLoading}>
              {isPasswordLoading ? 'Menyimpan...' : 'Ubah Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pengaturan;
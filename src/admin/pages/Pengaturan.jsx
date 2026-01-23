import React, { useState, useEffect } from 'react';
import './Pengaturan.css';

const isLocalDevelopment = import.meta.env.DEV;
const API_BASE_URL = isLocalDevelopment ? '/' : import.meta.env.VITE_API_URL;

const Pengaturan = () => {
  // State untuk settings
  const [settings, setSettings] = useState({
    namaPerusahaan: '',
    alamatPerusahaan: '',
    jamMasuk: '',
    jamPulang: '',
    officeLatitude: '',
    officeLongitude: '',
    maxAttendanceRadius: '',
  });

  // State untuk form ganti password
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State untuk pesan status
  const [passwordStatus, setPasswordStatus] = useState({ message: '', isError: false });
  const [settingsStatus, setSettingsStatus] = useState({ message: '', isError: false });
  
  // State untuk loading
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const [isFetchingSettings, setIsFetchingSettings] = useState(true);

  // State untuk profil admin
  const [adminProfile, setAdminProfile] = useState({ nama: '' });
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // Mengambil data profil admin
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

  // Mengambil data settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsFetchingSettings(true);
      try {
        const response = await fetch(`${API_BASE_URL}api/settings`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Gagal mengambil pengaturan.');
        }
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setSettingsStatus({ message: err.message, isError: true });
      } finally {
        setIsFetchingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  // Handler untuk input settings
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  // Handler untuk submit settings
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsStatus({ message: '', isError: false });
    setIsSettingsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal memperbarui pengaturan.');
      }

      setSettingsStatus({ message: 'Pengaturan berhasil diperbarui!', isError: false });
      setSettings(data.data);
    } catch (error) {
      setSettingsStatus({ message: error.message, isError: true });
    } finally {
      setIsSettingsLoading(false);
    }
  };

  // Handler untuk menggunakan lokasi saat ini
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSettingsStatus({ message: 'Geolocation tidak didukung oleh browser Anda.', isError: true });
      return;
    }

    setSettingsStatus({ message: 'Mengambil lokasi Anda...', isError: false });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSettings(prev => ({
          ...prev,
          officeLatitude: position.coords.latitude,
          officeLongitude: position.coords.longitude,
        }));
        setSettingsStatus({ message: 'Lokasi berhasil diambil!', isError: false });
        setTimeout(() => setSettingsStatus({ message: '', isError: false }), 3000);
      },
      (error) => {
        setSettingsStatus({ message: `Gagal mendapatkan lokasi: ${error.message}`, isError: true });
      }
    );
  };

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

      {/* Pengaturan Umum */}
      <div className="settings-card">
        <h2 className="card-title">Informasi Perusahaan & Jam Kerja</h2>
        {isFetchingSettings ? (
          <p>Memuat pengaturan...</p>
        ) : (
          <form onSubmit={handleSettingsSubmit}>
            {settingsStatus.message && (
              <div className={`status-message ${settingsStatus.isError ? 'error' : 'success'}`}>
                {settingsStatus.message}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="namaPerusahaan">Nama Perusahaan</label>
              <input
                type="text"
                id="namaPerusahaan"
                name="namaPerusahaan"
                className="form-input"
                value={settings.namaPerusahaan}
                onChange={handleSettingsChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="alamatPerusahaan">Alamat Perusahaan</label>
              <input
                type="text"
                id="alamatPerusahaan"
                name="alamatPerusahaan"
                className="form-input"
                value={settings.alamatPerusahaan}
                onChange={handleSettingsChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="jamMasuk">Jam Masuk Kantor</label>
                <input
                  type="time"
                  id="jamMasuk"
                  name="jamMasuk"
                  className="form-input"
                  value={settings.jamMasuk}
                  onChange={handleSettingsChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="jamPulang">Jam Pulang Kantor</label>
                <input
                  type="time"
                  id="jamPulang"
                  name="jamPulang"
                  className="form-input"
                  value={settings.jamPulang}
                  onChange={handleSettingsChange}
                />
              </div>
            </div>

            <h3 className="section-subtitle">📍 Lokasi Kantor untuk Absensi</h3>
            <p className="section-description">
              Tentukan koordinat lokasi kantor dan radius maksimal untuk absensi karyawan.
            </p>

            <div className="location-actions">
              <button
                type="button"
                className="btn-use-location"
                onClick={handleUseCurrentLocation}
              >
                📍 Gunakan Lokasi Saat Ini
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="officeLatitude">Latitude Kantor</label>
                <input
                  type="number"
                  id="officeLatitude"
                  name="officeLatitude"
                  className="form-input"
                  value={settings.officeLatitude}
                  onChange={handleSettingsChange}
                  step="any"
                  required
                  placeholder="-6.200000"
                />
                <small className="form-hint">Contoh: -6.200000 (Jakarta)</small>
              </div>

              <div className="form-group">
                <label htmlFor="officeLongitude">Longitude Kantor</label>
                <input
                  type="number"
                  id="officeLongitude"
                  name="officeLongitude"
                  className="form-input"
                  value={settings.officeLongitude}
                  onChange={handleSettingsChange}
                  step="any"
                  required
                  placeholder="106.816666"
                />
                <small className="form-hint">Contoh: 106.816666 (Jakarta)</small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="maxAttendanceRadius">Radius Maksimal Absensi (meter)</label>
              <input
                type="number"
                id="maxAttendanceRadius"
                name="maxAttendanceRadius"
                className="form-input"
                value={settings.maxAttendanceRadius}
                onChange={handleSettingsChange}
                min="10"
                max="5000"
                required
                placeholder="100"
              />
              <small className="form-hint">
                Karyawan hanya bisa absen dalam radius ini dari lokasi kantor (10-5000 meter)
              </small>
            </div>

            <div className="submit-area">
              <button type="submit" className="save-btn" disabled={isSettingsLoading}>
                {isSettingsLoading ? 'Menyimpan...' : '💾 Simpan Pengaturan'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Keamanan Akun */}
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
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="form-input"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="submit-area">
            <button type="submit" className="save-btn" disabled={isPasswordLoading}>
              {isPasswordLoading ? 'Menyimpan...' : '🔒 Ubah Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pengaturan;

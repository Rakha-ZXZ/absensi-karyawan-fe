import React, { useState } from 'react';
import './Pengaturan.css';

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

  // Handler untuk memperbarui state saat input berubah
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  // Handler saat form disubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Di sini Anda bisa menambahkan logika untuk mengirim data ke server
    console.log('Pengaturan disimpan:', generalSettings);
    alert('Pengaturan berhasil disimpan!');
  };

  // Handler untuk input form password
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Handler untuk submit form ganti password
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password baru minimal harus 6 karakter.');
      return;
    }
    // Logika untuk validasi password lama dan mengirim ke server
    console.log('Password admin sedang diubah...');
    alert('Password berhasil diubah!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
  };

  return (
    <div className="pengaturan-container">
      <div className="page-header">
        <h1>Pengaturan Sistem</h1>
        <p>Kelola pengaturan umum untuk aplikasi absensi Anda.</p>
      </div>

      <div className="settings-card">
        <h2 className="card-title">Informasi & Jam Kerja</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="namaPerusahaan">Nama Perusahaan</label>
            <input
              type="text"
              id="namaPerusahaan"
              name="namaPerusahaan"
              className="form-input"
              value={generalSettings.namaPerusahaan}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="alamat">Alamat Perusahaan</label>
            <input
              type="text"
              id="alamat"
              name="alamat"
              className="form-input"
              value={generalSettings.alamat}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="jamMasuk">Jam Masuk Kantor</label>
            <input type="time" id="jamMasuk" name="jamMasuk" className="form-input" value={generalSettings.jamMasuk} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="jamPulang">Jam Pulang Kantor</label>
            <input type="time" id="jamPulang" name="jamPulang" className="form-input" value={generalSettings.jamPulang} onChange={handleChange} />
          </div>
          <div className="submit-area">
            <button type="submit" className="save-btn">Simpan Perubahan</button>
          </div>
        </form>
      </div>

      <div className="settings-card">
        <h2 className="card-title">Keamanan Akun</h2>
        <div className="form-group">
          <label>Nama Pengguna (Saat ini login)</label>
          <div className="user-info-display">Admin</div>
        </div>
        <form onSubmit={handlePasswordSubmit}>
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
            <button type="submit" className="save-btn">Ubah Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pengaturan;
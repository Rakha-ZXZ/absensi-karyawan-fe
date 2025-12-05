import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    nama: 'Andi Budiman',
    nip: 'EMP00123',
    jabatan: 'Software Developer',
    departemen: 'Teknologi Informasi',
    tanggalBergabung: '2022-03-15',
    email: 'andi.budiman@company.com',
    telepon: '+62 812-3456-7890',
    alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
    status: 'Aktif'
  });

  const [leaveData, setLeaveData] = useState({
    sisaCutiTahunan: 12,
    cutiTerpakai: 3,
    cutiSakit: 2,
    cutiMelahirkan: 0,
    izin: 1
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
    alert('Perubahan berhasil disimpan!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="profile-page">
      <h1 className="page-title">Profil Karyawan</h1>

      {/* Header Profil */}
      <div className="profile-header-card glass-card">
        <div className="profile-identity">
          <div className="profile-avatar-large">
            <div className="avatar-initials">AB</div>
            <div className="avatar-status-indicator active"></div>
          </div>
          <div className="profile-identity-info">
            <h2>{profileData.nama}</h2>
            <p className="profile-meta">{profileData.jabatan} • {profileData.departemen}</p>
            <div className="profile-status">
              <span className={`status-badge ${profileData.status.toLowerCase()}`}>
                {profileData.status}
              </span>
              <span className="nip-badge">NIP: {profileData.nip}</span>
              <span className="join-date">
                Bergabung: {new Date(profileData.tanggalBergabung).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
          <button 
            className="btn-edit-profile"
            onClick={handleEdit}
          >
            <span className="btn-icon">✏️</span>
            Edit Profil
          </button>
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
                {isEditing ? (
                  <input
                    type="text"
                    name="nama"
                    value={editData.nama}
                    onChange={handleInputChange}
                    className="info-input"
                  />
                ) : (
                  <span className="info-value">{profileData.nama}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="info-label">Jabatan</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="jabatan"
                    value={editData.jabatan}
                    onChange={handleInputChange}
                    className="info-input"
                  />
                ) : (
                  <span className="info-value">{profileData.jabatan}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="info-label">Departemen</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="departemen"
                    value={editData.departemen}
                    onChange={handleInputChange}
                    className="info-input"
                  />
                ) : (
                  <span className="info-value">{profileData.departemen}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="info-label">NIP</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="nip"
                    value={editData.nip}
                    onChange={handleInputChange}
                    className="info-input"
                  />
                ) : (
                  <span className="info-value">{profileData.nip}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="info-label">Status Karyawan</span>
                <div className="status-select-container">
                  {isEditing ? (
                    <select
                      name="status"
                      value={editData.status}
                      onChange={handleInputChange}
                      className="info-select"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Non-Aktif">Non-Aktif</option>
                      <option value="Cuti">Cuti</option>
                    </select>
                  ) : (
                    <span className={`status-badge ${profileData.status.toLowerCase()}`}>
                      {profileData.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Cuti */}
          <div className="profile-section glass-card">
            <div className="section-header">
              <h3 className="section-title">🏖️ Informasi Cuti & Izin</h3>
            </div>
            <div className="leave-stats-grid">
              <div className="leave-stat-card">
                <div className="leave-stat-header">
                  <div className="leave-stat-icon">📅</div>
                  <div className="leave-stat-trend up">+2</div>
                </div>
                <div className="leave-stat-value">{leaveData.sisaCutiTahunan}</div>
                <div className="leave-stat-label">Sisa Cuti</div>
                <div className="leave-stat-sub">Tersedia</div>
              </div>
              
              <div className="leave-stat-card">
                <div className="leave-stat-header">
                  <div className="leave-stat-icon">✅</div>
                </div>
                <div className="leave-stat-value">{leaveData.cutiTerpakai}</div>
                <div className="leave-stat-label">Cuti Terpakai</div>
                <div className="leave-stat-sub">Tahun ini</div>
              </div>
              
              <div className="leave-stat-card">
                <div className="leave-stat-header">
                  <div className="leave-stat-icon">🤒</div>
                </div>
                <div className="leave-stat-value">{leaveData.cutiSakit}</div>
                <div className="leave-stat-label">Cuti Sakit</div>
                <div className="leave-stat-sub">Tahun ini</div>
              </div>
              
              <div className="leave-stat-card">
                <div className="leave-stat-header">
                  <div className="leave-stat-icon">📝</div>
                </div>
                <div className="leave-stat-value">{leaveData.izin}</div>
                <div className="leave-stat-label">Izin</div>
                <div className="leave-stat-sub">Tahun ini</div>
              </div>
            </div>
            
            <div className="leave-summary">
              <div className="leave-total">
                <span className="total-label">Total Hak Cuti Tahunan:</span>
                <span className="total-value">{leaveData.sisaCutiTahunan + leaveData.cutiTerpakai} hari</span>
              </div>
              <div className="leave-progress">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${(leaveData.cutiTerpakai / (leaveData.sisaCutiTahunan + leaveData.cutiTerpakai)) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="progress-labels">
                <span>0 hari</span>
                <span>{leaveData.cutiTerpakai} hari terpakai</span>
                <span>{leaveData.sisaCutiTahunan + leaveData.cutiTerpakai} hari</span>
              </div>
            </div>
            
            <div className="leave-actions">
              <button className="btn-leave-action primary">
                <span className="btn-icon">📋</span>
                Ajukan Cuti
              </button>
              <button className="btn-leave-action secondary">
                <span className="btn-icon">📄</span>
                Riwayat Cuti
              </button>
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
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className="info-input"
                  />
                ) : (
                  <div className="contact-item">
                    <span className="contact-icon">✉️</span>
                    <span className="info-value">{profileData.email}</span>
                  </div>
                )}
              </div>
              
              <div className="info-item">
                <span className="info-label">Telepon</span>
                {isEditing ? (
                  <input
                    type="tel"
                    name="telepon"
                    value={editData.telepon}
                    onChange={handleInputChange}
                    className="info-input"
                  />
                ) : (
                  <div className="contact-item">
                    <span className="contact-icon">📱</span>
                    <span className="info-value">{profileData.telepon}</span>
                  </div>
                )}
              </div>
              
              <div className="info-item">
                <span className="info-label">Alamat</span>
                {isEditing ? (
                  <textarea
                    name="alamat"
                    value={editData.alamat}
                    onChange={handleInputChange}
                    className="info-textarea"
                    rows="3"
                  />
                ) : (
                  <div className="contact-item">
                    <span className="contact-icon">🏠</span>
                    <span className="info-value">{profileData.alamat}</span>
                  </div>
                )}
              </div>
              
              {/* Informasi Penggajian (Tanpa Detail Bank) */}
              <div className="info-item">
                <span className="info-label">Informasi Penggajian</span>
                <div className="payment-info">
                  <div className="payment-item">
                    <span className="payment-label">Tanggal Transfer:</span>
                    <span className="payment-value">Setiap tanggal 28</span>
                  </div>
                  <div className="payment-item">
                    <span className="payment-label">Metode:</span>
                    <span className="payment-value">Transfer Bank</span>
                  </div>
                  <div className="payment-note">
                    <span className="note-icon">ℹ️</span>
                    <span className="note-text">Detail informasi bank tersedia di sistem payroll internal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Riwayat Aktivitas */}
          <div className="profile-section glass-card">
            <div className="section-header">
              <h3 className="section-title">📊 Aktivitas Terbaru</h3>
            </div>
            <div className="activity-timeline">
              <div className="timeline-item">
                <div className="timeline-marker success">
                  <span>📝</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">Perbarui Informasi Kontak</div>
                  <div className="timeline-desc">Email dan nomor telepon diperbarui</div>
                  <div className="timeline-time">1 jam yang lalu</div>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker info">
                  <span>🏖️</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">Pengajuan Cuti Disetujui</div>
                  <div className="timeline-desc">Cuti tahunan 3 hari pada 15-17 Oktober</div>
                  <div className="timeline-time">2 hari yang lalu</div>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker warning">
                  <span>⏰</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">Absensi Terlambat</div>
                  <div className="timeline-desc">Check-in pukul 08:45 pada 28 September</div>
                  <div className="timeline-time">3 hari yang lalu</div>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker primary">
                  <span>💰</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">Gaji Diterima</div>
                  <div className="timeline-desc">Pembayaran gaji bulan September</div>
                  <div className="timeline-time">5 hari yang lalu</div>
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
                <button className="btn-security">
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

      {/* Action Buttons untuk Edit Mode */}
      {isEditing && (
        <div className="edit-mode-actions glass-card">
          <div className="edit-actions-content">
            <h4>Simpan Perubahan?</h4>
            <p>Pastikan data yang dimasukkan sudah benar sebelum menyimpan.</p>
            <div className="edit-buttons">
              <button className="btn-save" onClick={handleSave}>
                <span className="btn-icon">💾</span>
                Simpan Perubahan
              </button>
              <button className="btn-cancel" onClick={handleCancel}>
                <span className="btn-icon">❌</span>
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
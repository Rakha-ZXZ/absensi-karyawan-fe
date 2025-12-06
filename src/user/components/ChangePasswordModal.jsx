import React, { useState } from 'react';
import './ChangePasswordModal.css'; // Style khusus untuk modal ini
import '../pages/Absensi.css'; // Menggunakan style dasar modal dari Absensi.css

const isLocalDevelopment = import.meta.env.DEV;
const API_BASE_URL = isLocalDevelopment ? '' : import.meta.env.VITE_API_URL;

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    // Reset state saat modal ditutup
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError('');
    setSuccess('');
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Semua field wajib diisi.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/employee/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // 'credentials: include' penting untuk mengirim cookie otentikasi
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika respons tidak berhasil, lemparkan error dengan pesan dari server
        throw new Error(data.message || 'Gagal mengubah kata sandi.');
      }

      // Jika berhasil, tampilkan pesan sukses
      setSuccess(data.message);

      // Tutup modal setelah 2 detik
      setTimeout(handleClose, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content password-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Ubah Kata Sandi</h3>
        <p className="modal-text">Untuk keamanan akun Anda, jangan bagikan kata sandi Anda kepada orang lain.</p>
        
        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Kata Sandi Saat Ini</label>
            <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Kata Sandi Baru</label>
            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Konfirmasi Kata Sandi Baru</label>
            <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
          </div>

          {error && <div className="form-message error">{error}</div>}
          {success && <div className="form-message success">{success}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={loading}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
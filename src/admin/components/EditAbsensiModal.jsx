import React, { useState, useEffect } from 'react';
import './EditAbsensiModal.css'; // Gunakan CSS dari EditEmployeeModal untuk konsistensi

const EditAbsensiModal = ({ show, onClose, onSave, attendanceData }) => {
  const [formData, setFormData] = useState({
    tanggal: '',
    jamMasuk: '',
    jamPulang: '',
    status: 'Hadir',
  });
  const [error, setError] = useState('');

  // Fungsi untuk format tanggal ke YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fungsi untuk format waktu ke HH:mm
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (attendanceData) {
      setFormData({
        tanggal: formatDate(attendanceData.tanggal),
        jamMasuk: formatTime(attendanceData.jamMasuk),
        jamPulang: formatTime(attendanceData.jamPulang),
        status: attendanceData.status,
      });
    }
  }, [attendanceData]);

  if (!show) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.tanggal || !formData.jamMasuk || !formData.status) {
      setError('Tanggal, Jam Masuk, dan Status wajib diisi.');
      return;
    }

    // Gabungkan tanggal dan waktu sebelum mengirim
    const updatedData = {
      tanggal: new Date(formData.tanggal).toISOString(),
      jamMasuk: new Date(`${formData.tanggal}T${formData.jamMasuk}`).toISOString(),
      jamPulang: formData.jamPulang ? new Date(`${formData.tanggal}T${formData.jamPulang}`).toISOString() : '',
      status: formData.status,
    };

    onSave(attendanceData._id, updatedData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Absensi: {attendanceData?.employeeId?.nama || ''}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="tanggal">Tanggal</label>
            <input type="date" id="tanggal" name="tanggal" value={formData.tanggal} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="jamMasuk">Jam Masuk</label>
            <input type="time" id="jamMasuk" name="jamMasuk" value={formData.jamMasuk} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="jamPulang">Jam Pulang</label>
            <input type="time" id="jamPulang" name="jamPulang" value={formData.jamPulang} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} required>
              <option value="Hadir">Hadir</option>
              <option value="Terlambat">Terlambat</option>
              <option value="Cuti">Cuti</option>
              <option value="Sakit">Sakit</option>
              <option value="Izin">Izin</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Batal</button>
            <button type="submit" className="save-btn">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAbsensiModal;
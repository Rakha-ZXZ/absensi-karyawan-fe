import React, { useState, useEffect } from 'react';
import './EditEmployeeModal.css'; // Kita akan menggunakan CSS yang sama dengan AddEmployeeModal

const jabatanEnum = [
  "Software Developer", "Project Manager", "UI/UX Designer",
  "QA Engineer", "HR Staff", "Marketing Specialist",
];
const departemenEnum = [
  "Teknologi Informasi", "Human Resources", "Marketing",
  "Finance", "Operations",
];

const EditEmployeeModal = ({ show, onClose, onSave, employeeData }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    jabatan: '',
    departemen: '',
    nomorTelepon: '',
    alamat: '',
    status: 'Aktif',
    gajiPokok: 0,
    tunjanganJabatan: 0,
    tunjanganTransport: 0,
    tunjanganMakan: 0,
  });
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  // useEffect untuk mengisi form dengan data karyawan saat modal dibuka
  useEffect(() => {
    if (employeeData) {
      setFormData({
        nama: employeeData.nama || '',
        email: employeeData.email || '',
        jabatan: employeeData.jabatan || '',
        departemen: employeeData.departemen || '',
        nomorTelepon: employeeData.nomorTelepon || '',
        alamat: employeeData.alamat || '',
        status: employeeData.status || 'Aktif',
        gajiPokok: employeeData.gajiPokok || 0,
        tunjanganJabatan: employeeData.tunjanganJabatan || 0,
        tunjanganTransport: employeeData.tunjanganTransport || 0,
        tunjanganMakan: employeeData.tunjanganMakan || 0,
      });
      setPassword(''); // Selalu kosongkan field password saat modal dibuka
    }
  }, [employeeData]);

  if (!show) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.jabatan) {
      setError('Nama dan Jabatan wajib diisi.');
      return;
    }
    setError('');
    
    const updateData = { ...formData };
    if (password) {
      updateData.password = password;
    }

    onSave(employeeData._id, updateData); // Kirim ID dan data yang diperbarui
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Data Karyawan</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <p className="error-message">{error}</p>}
          
          <div className="form-grid">
            {/* Kolom Kiri */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="nama">Nama Lengkap</label>
                <input type="text" id="nama" name="nama" value={formData.nama} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password Baru (Opsional)</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Isi untuk mengubah password" />
              </div>
              <div className="form-group">
                <label htmlFor="nomorTelepon">Nomor Telepon</label>
                <input type="tel" id="nomorTelepon" name="nomorTelepon" value={formData.nomorTelepon} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="alamat">Alamat</label>
                <textarea id="alamat" name="alamat" value={formData.alamat} onChange={handleChange}></textarea>
              </div>
            </div>
            {/* Kolom Kanan */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="jabatan">Jabatan</label>
                <select id="jabatan" name="jabatan" value={formData.jabatan} onChange={handleChange} required>
                  <option value="">Pilih Jabatan</option>
                  {jabatanEnum.map(jabatan => (
                    <option key={jabatan} value={jabatan}>{jabatan}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="departemen">Departemen</label>
                <select id="departemen" name="departemen" value={formData.departemen} onChange={handleChange}>
                  <option value="">Pilih Departemen</option>
                  {departemenEnum.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status Karyawan</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange}>
                  <option value="Aktif">Aktif</option>              
                  <option value="Cuti">Cuti</option>
                </select>
              </div>
            </div>
            {/* Kolom Gaji */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="gajiPokok">Gaji Pokok</label>
                <input type="number" id="gajiPokok" name="gajiPokok" value={formData.gajiPokok} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label htmlFor="tunjanganJabatan">Tunjangan Jabatan</label>
                <input type="number" id="tunjanganJabatan" name="tunjanganJabatan" value={formData.tunjanganJabatan} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label htmlFor="tunjanganTransport">Tunjangan Transport</label>
                <input type="number" id="tunjanganTransport" name="tunjanganTransport" value={formData.tunjanganTransport} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label htmlFor="tunjanganMakan">Tunjangan Makan</label>
                <input type="number" id="tunjanganMakan" name="tunjanganMakan" value={formData.tunjanganMakan} onChange={handleChange} min="0" />
              </div>
            </div>
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

export default EditEmployeeModal;
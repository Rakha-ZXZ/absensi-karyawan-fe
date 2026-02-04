import React, { useState, useEffect } from 'react';
import './AddEmployeeModal.css';

// Ambil enum dari model untuk konsistensi, Anda bisa juga fetch ini dari API jika dinamis
const jabatanEnum = [
  "Software Developer", "Project Manager", "UI/UX Designer",
  "QA Engineer", "HR Staff", "Marketing Specialist",
];
const departemenEnum = [
  "Teknologi Informasi", "Human Resources", "Marketing",
  "Finance", "Operations",
];
const statusEnum = ["Aktif", "Cuti"];

const AddEmployeeModal = ({ show, onClose, onSave }) => {
  const initialState = {
    nama: '',
    email: '',
    password: '',
    jabatan: '',
    departemen: '',
    nomorTelepon: '',
    alamat: '',
    status: 'Aktif', // Default value
    gajiPokok: 0,
    tunjanganJabatan: 0,
    tunjanganTransport: 0,
    tunjanganMakan: 0,
  };

  const [employeeData, setEmployeeData] = useState(initialState);
  const [error, setError] = useState('');
  const currencyFields = new Set([
    'gajiPokok',
    'tunjanganJabatan',
    'tunjanganTransport',
    'tunjanganMakan',
  ]);

  const formatNumberInput = (value) => {
    if (value === null || value === undefined) return '';
    const digits = String(value).replace(/\D/g, '');
    if (!digits) return '';
    return new Intl.NumberFormat('id-ID').format(Number(digits));
  };

  // Reset form setiap kali modal ditutup
  useEffect(() => {
    if (!show) {
      setEmployeeData(initialState);
      setError('');
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (currencyFields.has(name)) {
      const digitsOnly = value.replace(/\D/g, '');
      setEmployeeData(prev => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setEmployeeData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi field yang wajib diisi
    if (!employeeData.nama || !employeeData.password) {
      setError('Nama dan Password wajib diisi.');
      return;
    }
    if (employeeData.password.length < 6) {
      setError('Password minimal harus 6 karakter.');
      return;
    }
    setError('');
    const payload = {
      ...employeeData,
      gajiPokok: Number(employeeData.gajiPokok) || 0,
      tunjanganJabatan: Number(employeeData.tunjanganJabatan) || 0,
      tunjanganTransport: Number(employeeData.tunjanganTransport) || 0,
      tunjanganMakan: Number(employeeData.tunjanganMakan) || 0,
    };
    onSave(payload);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Tambah Karyawan Baru</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          {error && <p className="error-message">{error}</p>}
          <div className="form-grid">
            {/* Kolom Kiri */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="nama">Nama Lengkap <span className="required">*</span></label>
                <input type="text" id="nama" name="nama" value={employeeData.nama} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={employeeData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password <span className="required">*</span></label>
                <input type="password" id="password" name="password" value={employeeData.password} onChange={handleChange} required minLength="6" />
              </div>
              <div className="form-group">
                <label htmlFor="nomorTelepon">Nomor Telepon</label>
                <input type="tel" id="nomorTelepon" name="nomorTelepon" value={employeeData.nomorTelepon} onChange={handleChange} />
              </div>
            </div>
            {/* Kolom Kanan */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="jabatan">Jabatan</label>
                <select id="jabatan" name="jabatan" value={employeeData.jabatan} onChange={handleChange}>
                  <option value="">Pilih Jabatan</option>
                  {jabatanEnum.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="departemen">Departemen</label>
                <select id="departemen" name="departemen" value={employeeData.departemen} onChange={handleChange}>
                  <option value="">Pilih Departemen</option>
                  {departemenEnum.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={employeeData.status} onChange={handleChange}>
                  {statusEnum.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="alamat">Alamat</label>
                <textarea id="alamat" name="alamat" value={employeeData.alamat} onChange={handleChange} rows="3"></textarea>
              </div>
            </div>
            {/* Kolom Gaji */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="gajiPokok">Gaji Pokok</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="gajiPokok"
                  name="gajiPokok"
                  value={formatNumberInput(employeeData.gajiPokok)}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tunjanganJabatan">Tunjangan Jabatan</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="tunjanganJabatan"
                  name="tunjanganJabatan"
                  value={formatNumberInput(employeeData.tunjanganJabatan)}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tunjanganTransport">Tunjangan Transport</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="tunjanganTransport"
                  name="tunjanganTransport"
                  value={formatNumberInput(employeeData.tunjanganTransport)}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tunjanganMakan">Tunjangan Makan</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="tunjanganMakan"
                  name="tunjanganMakan"
                  value={formatNumberInput(employeeData.tunjanganMakan)}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">Batal</button>
            <button type="submit" className="btn-save">Simpan Karyawan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;

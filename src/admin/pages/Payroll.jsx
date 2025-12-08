import React, { useState, useEffect } from 'react';
import './Payroll.css'; // Anda bisa membuat file CSS ini untuk styling
import EditPayrollModal from '../components/EditPayrollModal'; // Import modal edit

const isLocalDevelopment = import.meta.env.DEV;
const API_BASE_URL = isLocalDevelopment ? '/' : import.meta.env.VITE_API_URL;

const Payroll = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' }); // type: 'success' atau 'error'

  // State untuk daftar payroll
  const [payrolls, setPayrolls] = useState([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  // State untuk modal edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);

  const months = [
    { value: 1, name: 'Januari' }, { value: 2, name: 'Februari' },
    { value: 3, name: 'Maret' }, { value: 4, name: 'April' },
    { value: 5, name: 'Mei' }, { value: 6, name: 'Juni' },
    { value: 7, name: 'Juli' }, { value: 8, name: 'Agustus' },
    { value: 9, name: 'September' }, { value: 10, name: 'Oktober' },
    { value: 11, name: 'November' }, { value: 12, name: 'Desember' },
  ];

  // Membuat array tahun, misal dari 2 tahun lalu hingga tahun sekarang
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  // Fungsi untuk mengambil data payroll
  const fetchPayrolls = async () => {
    setIsListLoading(true);
    setListError(null);
    try {
      const response = await fetch(`${API_BASE_URL}api/payroll?month=${selectedMonth}&year=${selectedYear}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil data gaji.');
      }
      const data = await response.json();
      setPayrolls(data);
    } catch (error) {
      setListError(error.message);
    } finally {
      setIsListLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, [selectedMonth, selectedYear]); // Ambil data setiap kali filter berubah

  const handleGeneratePayroll = async (e) => {
    e.preventDefault();
    
    if (!window.confirm(`Anda akan membuat/memperbarui data gaji untuk ${months.find(m => m.value === selectedMonth).name} ${selectedYear}. Lanjutkan?`)) {
      return;
    }

    setIsLoading(true);
    setStatusMessage({ text: '', type: '' });

    try {
      const response = await fetch(`${API_BASE_URL}api/payroll/generate?month=${selectedMonth}&year=${selectedYear}`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server.');
      }

      setStatusMessage({ 
        text: `${data.message} | Dibuat: ${data.slipGajiDibuat}, Diperbarui: ${data.slipGajiDiperbarui}.`, 
        type: 'success' 
      });
      fetchPayrolls(); 
    } catch (error) {
      setStatusMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePayroll = async (payrollId) => {
    if (!window.confirm('Anda yakin ingin menghapus data gaji ini? Tindakan ini tidak dapat dibatalkan.')) return;

    try {
      const response = await fetch(`${API_BASE_URL}api/payroll/${payrollId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal menghapus data gaji.');
      }

      // Hapus dari state lokal
      setPayrolls(prev => prev.filter(p => p._id !== payrollId));
      setStatusMessage({ text: 'Data gaji berhasil dihapus.', type: 'success' });

    } catch (error) {
      setStatusMessage({ text: error.message, type: 'error' });
    } finally {
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 3000);
    }
  };

  // Fungsi untuk membuka modal edit
  const handleEditClick = (payroll) => {
    setEditingPayroll(payroll);
    setIsEditModalOpen(true);
  };

  // Fungsi untuk menyimpan perubahan dari modal edit
  const handleSavePayroll = async (payrollId, updatedData) => {
    // Pisahkan data untuk dua API yang berbeda
    const detailsPayload = { potonganLain: updatedData.potonganLain };
    const statusPayload = { status: updatedData.statusPembayaran };

    try {
      // 1. Update detail potongan
      const detailsResponse = await fetch(`${API_BASE_URL}api/payroll/${payrollId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(detailsPayload),
      });
      if (!detailsResponse.ok) throw new Error('Gagal memperbarui detail potongan.');

      // 2. Update status pembayaran
      const statusResponse = await fetch(`${API_BASE_URL}api/payroll/${payrollId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(statusPayload),
      });
      if (!statusResponse.ok) throw new Error('Gagal memperbarui status pembayaran.');
      
      const { data: finalUpdatedPayroll } = await statusResponse.json();

      // Perbarui state dengan data final dari server
      setPayrolls(prev => prev.map(p => (p._id === payrollId ? finalUpdatedPayroll : p)));
      setStatusMessage({ text: 'Data gaji berhasil diperbarui.', type: 'success' });
      setIsEditModalOpen(false);
    } catch (error) {
      setStatusMessage({ text: error.message, type: 'error' });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="payroll-container">
      <EditPayrollModal
        show={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSavePayroll}
        payrollData={editingPayroll}
      />

      <div className="page-header">
        <h1>Generate Gaji Bulanan</h1>
        <p>Pilih periode bulan dan tahun untuk memulai proses perhitungan gaji otomatis untuk semua karyawan aktif.</p>
      </div>

      <div className="card">
        <h2 className="card-title">Pilih Periode Penggajian</h2>
        <form onSubmit={handleGeneratePayroll} className="payroll-form">
          <div className="form-controls">
            <div className="form-group">
              <label htmlFor="month-select">Bulan</label>
              <select 
                id="month-select" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="form-input"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="year-select">Tahun</label>
              <select 
                id="year-select" 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="form-input"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary generate-btn" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Generate Gaji'}
          </button>
        </form>
        {statusMessage.text && (
          <div className={`status-message ${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">Daftar Gaji Periode {months.find(m => m.value === selectedMonth).name} {selectedYear}</h2>
        <div className="table-container">
          <table className="payroll-table">
            <thead>
              <tr>
                <th>ID Karyawan</th>
                <th>Nama Karyawan</th>
                <th>Gaji Bersih</th>
                <th>Status Pembayaran</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isListLoading ? (
                <tr><td colSpan="5" className="no-data">Memuat data gaji...</td></tr>
              ) : listError ? (
                <tr><td colSpan="5" className="no-data error">{listError}</td></tr>
              ) : payrolls.length > 0 ? (
                payrolls.map(payroll => (
                  <tr key={payroll._id}>
                    <td>{payroll.employeeId?.employeeId || 'N/A'}</td>
                    <td>{payroll.employeeId?.nama || 'Karyawan Dihapus'}</td>
                    <td>{formatCurrency(payroll.gajiBersih)}</td>
                    <td>
                      <span className={`status-badge status-${payroll.statusPembayaran.toLowerCase().replace(' ', '-')}`}>
                        {payroll.statusPembayaran}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button className="action-btn edit-btn" onClick={() => handleEditClick(payroll)}>Edit</button>
                      <button className="action-btn delete-btn" onClick={() => handleDeletePayroll(payroll._id)}>Hapus</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    Tidak ada data gaji untuk periode ini. Silakan generate terlebih dahulu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
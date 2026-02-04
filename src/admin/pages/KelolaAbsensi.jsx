import React, { useState, useEffect } from 'react';
import './KelolaAbsensi.css';
import EditAbsensiModal from '../components/EditAbsensiModal';

const isLocalDevelopment = import.meta.env.DEV;
const API_BASE_URL = isLocalDevelopment ? '/' : import.meta.env.VITE_API_URL;

const KelolaAbsensi = () => {
  // State untuk data dari API
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // State untuk modal edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // State untuk preview foto
  const [isPhotoPreviewOpen, setIsPhotoPreviewOpen] = useState(false);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState('');

  // State untuk filter
  const [filter, setFilter] = useState({
    search: '',
    tanggal: '',
    bulan: '',
  });

  // Fungsi untuk mengambil data dari API
  useEffect(() => {
    const fetchAllAttendance = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const response = await fetch(`${API_BASE_URL}api/attendance/all`, {
          credentials: 'include', // Menginstruksikan browser untuk mengirim cookie
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengambil data absensi.');
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (err) {
        setApiError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllAttendance();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk membuka modal edit
  const handleEditClick = (attendanceItem) => {
    setEditingAttendance(attendanceItem);
    setIsEditModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingAttendance(null);
  };

  // Fungsi untuk membuka preview foto
  const handleOpenPhotoPreview = (photoUrl) => {
    setPreviewPhotoUrl(photoUrl);
    setIsPhotoPreviewOpen(true);
  };

  // Fungsi untuk menutup preview foto
  const handleClosePhotoPreview = () => {
    setIsPhotoPreviewOpen(false);
    setPreviewPhotoUrl('');
  };

  // Fungsi untuk menyimpan perubahan dari modal
  const handleUpdateAttendance = async (attendanceId, updatedData) => {
    setStatusMessage('Memperbarui data...');
    try {
      const response = await fetch(`${API_BASE_URL}api/attendance/${attendanceId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui data.');
      }

      const { data: newAttendanceData } = await response.json();
      // Perbarui state attendanceData dengan data yang baru
      setAttendanceData(prev => prev.map(item => (item._id === attendanceId ? newAttendanceData : item)));
      setStatusMessage('Data berhasil diperbarui!');
      handleCloseModal();
    } catch (err) {
      setStatusMessage(`Gagal: ${err.message}`);
    } finally {
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  // Fungsi untuk menghapus data absensi
  const handleDeleteAttendance = async (attendanceId) => {
    // Tampilkan dialog konfirmasi sebelum menghapus
    if (!window.confirm('Apakah Anda yakin ingin menghapus data absensi ini? Tindakan ini tidak dapat dibatalkan.')) {
      return; // Batalkan jika pengguna menekan 'Cancel'
    }

    setStatusMessage('Menghapus data...');
    try {
      const response = await fetch(`${API_BASE_URL}api/attendance/${attendanceId}`, {
        method: 'DELETE',
        credentials: 'include',
        // Header Authorization tidak diperlukan lagi
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus data.');
      }

      // Hapus item dari state untuk memperbarui UI secara langsung
      setAttendanceData(prev => prev.filter(item => item._id !== attendanceId));
      setStatusMessage('Data absensi berhasil dihapus!');
    } catch (err) {
      setStatusMessage(`Gagal: ${err.message}`);
    } finally {
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  // Logika untuk memfilter data berdasarkan input
  const filteredData = attendanceData.filter(item => {
    const searchTerm = filter.search.toLowerCase();
    // API mengembalikan objek employeeId yang sudah di-populate
    const employeeName = (item.employeeId?.nama || '').toLowerCase();
    const employeeId = (item.employeeId?.employeeId || '').toLowerCase();
    
    // Konversi tanggal item ke format YYYY-MM-DD dengan aman (menghindari masalah timezone)
    const itemDateObj = new Date(item.tanggal);
    const year = itemDateObj.getFullYear();
    const month = String(itemDateObj.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
    const day = String(itemDateObj.getDate()).padStart(2, '0');
    const itemDate = `${year}-${month}-${day}`;
    const itemMonth = `${year}-${month}`;

    return (
      (searchTerm === '' || 
       employeeName.includes(searchTerm) || 
       employeeId.includes(searchTerm)) &&
      // Jika filter tanggal kosong, tampilkan semua. Jika tidak, bandingkan.
      (filter.tanggal === '' || itemDate === filter.tanggal) &&
      // Jika filter bulan kosong, tampilkan semua. Jika tidak, bandingkan.
      (filter.bulan === '' || itemMonth === filter.bulan)
    );
  });

  const formattedFilterMonth = filter.bulan
    ? new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(`${filter.bulan}-01`))
    : '';

  return (
    <div className="kelola-absensi-container">
      <div className="page-header">
        <h1>Kelola Absensi Karyawan</h1>
        <p>Lihat, cari, dan kelola data absensi.</p>
      </div>

      {statusMessage && (
        <div className={`status-message ${statusMessage.startsWith('Gagal') ? 'error' : ''}`}>
          {statusMessage}
        </div>
      )}

      <div className="filter-bar">
        <input
          type="text"
          name="search"
          placeholder="Cari nama atau ID karyawan..."
          value={filter.search}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <div className="filter-field">
          <label className="filter-label" htmlFor="filter-bulan">Filter Bulan</label>
          <input
            id="filter-bulan"
            type="month"
            name="bulan"
            value={filter.bulan}
            onChange={handleFilterChange}
            className="filter-input"
          />
          {formattedFilterMonth && (
            <span className="filter-helper">Menampilkan: {formattedFilterMonth}</span>
          )}
        </div>
        <input
          type="date"
          name="tanggal"
          value={filter.tanggal}
          onChange={handleFilterChange}
          className="filter-input"
        />
      </div>

      <div className="table-container">
        <table className="absensi-table">
          <thead>
            <tr>
              <th>ID Karyawan</th>
              <th>Nama Karyawan</th>
              <th>Tanggal</th>
              <th>Jam Masuk</th>
              <th>Jam Keluar</th>
              <th>Status</th>
              <th>Foto</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="8" className="no-data">Memuat data absensi...</td></tr>
            ) : apiError ? (
              <tr><td colSpan="8" className="no-data error">{apiError}</td></tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item._id}>
                  <td>{item.employeeId?.employeeId || 'N/A'}</td>
                  <td>{item.employeeId?.nama || 'Karyawan Dihapus'}</td>
                  <td>
                    {new Date(item.tanggal).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </td>
                  <td>
                    {new Date(item.jamMasuk).toLocaleTimeString('id-ID', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td>
                    {item.jamPulang ? new Date(item.jamPulang).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                  <td><span className={`status-badge status-${item.status.toLowerCase()}`}>{item.status}</span></td>
                  <td>
                    {item.fotoAbsensi ? (
                      <img 
                        src={`http://localhost:5000${item.fotoAbsensi}`} 
                        alt="Foto Absensi" 
                        className="foto-thumbnail"
                        onClick={() => handleOpenPhotoPreview(`http://localhost:5000${item.fotoAbsensi}`)}
                        style={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <span className="no-photo">Tidak ada foto</span>
                    )}
                  </td>
                  <td>
                    <button className="action-btn edit-btn" title="Edit" onClick={() => handleEditClick(item)}>✏️</button>
                    <button className="action-btn delete-btn" title="Hapus" onClick={() => handleDeleteAttendance(item._id)}>🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">Tidak ada data absensi yang cocok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EditAbsensiModal
        show={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleUpdateAttendance}
        attendanceData={editingAttendance}
      />

      {isPhotoPreviewOpen && (
        <div className="photo-preview-overlay" onClick={handleClosePhotoPreview}>
          <div className="photo-preview-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="photo-preview-close" type="button" onClick={handleClosePhotoPreview}>
              Tutup
            </button>
            <img src={previewPhotoUrl} alt="Preview Foto Absensi" className="photo-preview-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaAbsensi;

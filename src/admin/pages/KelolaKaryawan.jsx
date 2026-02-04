import React, { useState, useEffect } from 'react';
import './KelolaKaryawan.css';
import AddEmployeeModal from '../components/AddEmployeeModal'; // Import modal
import EditEmployeeModal from '../components/EditEmployeeModal'; // Import modal edit
const isLocalDevelopment = import.meta.env.DEV;
const API_BASE_URL = isLocalDevelopment ? '/' : import.meta.env.VITE_API_URL;

const KelolaKaryawan = () => {
  // State untuk data dari API
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  // State untuk mengontrol visibilitas modal
  const [showAddModal, setShowAddModal] = useState(false);
  // State untuk menangani pesan status (opsional: notifikasi)
  const [statusMessage, setStatusMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // State untuk menyimpan data karyawan yang akan diedit
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Fungsi untuk mengambil data dari API
  const fetchEmployees = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/get-employees`, {
        credentials: 'include',
      }); 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil data karyawan.');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setApiError(err.message);
      setEmployees([]); // Kosongkan data jika terjadi error
    } finally {
      setIsLoading(false);
    }
  };

  // Panggil fetchEmployees saat komponen pertama kali di-render
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Logika untuk memfilter karyawan berdasarkan input pencarian
  const filteredEmployees = employees.filter(employee => {
    const term = searchTerm.toLowerCase();
    const employeeId = employee.employeeId ? employee.employeeId.toLowerCase() : '';
    return (
      employee.nama.toLowerCase().includes(term) ||
      employee.jabatan.toLowerCase().includes(term) ||
      employeeId.includes(term)
    );
  }).filter(employee => {
    if (!filterMonth) return true;
    if (!employee.tanggalMasuk) return false;
    const joinDate = new Date(employee.tanggalMasuk);
    const year = joinDate.getFullYear();
    const month = String(joinDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}` === filterMonth;
  });

  const formattedFilterMonth = filterMonth
    ? new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(`${filterMonth}-01`))
    : 'Semua bulan';

  // Fungsi untuk menangani penyimpanan data karyawan baru
  const handleSaveEmployee = async (newEmployeeData) => {
    setStatusMessage('Menyimpan data karyawan...');
    try {
      // Gunakan endpoint POST yang konsisten
      const response = await fetch(`${API_BASE_URL}api/admin/add-employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployeeData),
        credentials: 'include',
      });

      if (!response.ok) {
        // Tangani kesalahan respons HTTP (misalnya status 400, 500)
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan data karyawan di server.');
      }

      const { data: savedEmployee } = await response.json();
      console.log('Karyawan baru berhasil disimpan:', savedEmployee);
      setStatusMessage('Karyawan berhasil ditambahkan!');
      
      // Tambahkan karyawan baru ke state lokal untuk update UI instan
      setEmployees(prevEmployees => [savedEmployee, ...prevEmployees]);
      
      setShowAddModal(false); // Tutup modal setelah menyimpan

    } catch (error) {
      console.error('Error saat menyimpan karyawan:', error.message);
      setStatusMessage(`Gagal: ${error.message}`);
      // Opsional: Biarkan modal tetap terbuka untuk mengizinkan input ulang
    } finally {
      // Hapus pesan status setelah beberapa saat (opsional)
      setTimeout(() => setStatusMessage(''), 5000); 
    }
  };

  // Fungsi untuk membuka modal edit dan mengatur data
  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  // Fungsi untuk menangani pembaruan data karyawan
  const handleUpdateEmployee = async (employeeId, updatedData) => {
    setStatusMessage('Memperbarui data karyawan...');    
    try {
      // Pastikan field numerik dikirim sebagai angka, bukan string
      const payload = {
        ...updatedData,
        gajiPokok: Number(updatedData.gajiPokok) || 0,
        tunjanganJabatan: Number(updatedData.tunjanganJabatan) || 0,
        tunjanganTransport: Number(updatedData.tunjanganTransport) || 0,
        tunjanganMakan: Number(updatedData.tunjanganMakan) || 0,
      };

      // Hapus field password dari payload jika kosong
      if (!payload.password) {
        delete payload.password;
      }

      const response = await fetch(`${API_BASE_URL}api/admin/update-employee/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui data di server.');
      }

      const { data: updatedEmployee } = await response.json();
      setStatusMessage('Data karyawan berhasil diperbarui!');

      // Perbarui state employees dengan data yang baru
      setEmployees(prev => 
        prev.map(emp => (emp._id === employeeId ? updatedEmployee : emp))
      );

      setIsEditModalOpen(false); // Tutup modal
      setEditingEmployee(null); // Reset state

    } catch (error) {
      console.error('Error saat memperbarui karyawan:', error.message);
      setStatusMessage(`Gagal: ${error.message}`);
    } finally {
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  // Fungsi untuk menangani penghapusan data karyawan
  const handleDelete = async (employeeId) => {
    // Tampilkan dialog konfirmasi
    if (!window.confirm('Apakah Anda yakin ingin menghapus data karyawan ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    setStatusMessage('Menghapus data karyawan...');
    try {
      // Ganti dengan endpoint DELETE yang sesuai
      const response = await fetch(`${API_BASE_URL}api/admin/delete-employee/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus data dari server.');
      }

      // Hapus karyawan dari state lokal untuk memperbarui UI secara instan
      setEmployees(prevEmployees => prevEmployees.filter(emp => emp._id !== employeeId));
      setStatusMessage('Karyawan berhasil dihapus.');
    } catch (error) {
      console.error('Error saat menghapus karyawan:', error.message);
      setStatusMessage(`Gagal menghapus: ${error.message}`);
    } finally {
      // Hapus pesan status setelah beberapa saat
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  return (
    <div className="kelola-karyawan-container">
      <div className="page-header">
        <h1>Kelola Karyawan</h1>
        <p>Tambah, edit, dan hapus data karyawan dari sistem.</p>
      </div>

      <div className="action-bar">
        <div className="filter-field">
          <label className="filter-label" htmlFor="search-karyawan">Cari</label>
          <input
            id="search-karyawan"
            type="text"
            placeholder="Nama, jabatan, atau ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        <div className="filter-field">
          <label className="filter-label" htmlFor="filter-join-month">Filter Bulan Bergabung</label>
          <input
            id="filter-join-month"
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="search-input"
          />
          <span className="filter-helper">Menampilkan: {formattedFilterMonth}</span>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          + Tambah Karyawan
        </button>
      </div>

      {statusMessage && <div className="status-message">{statusMessage}</div>}

      {/* Render komponen modal */}
      <AddEmployeeModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveEmployee}
      />

      {/* Render komponen modal edit */}
      <EditEmployeeModal
        show={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateEmployee}
        employeeData={editingEmployee}
      />

      <div className="table-container">
        <table className="karyawan-table">
          <thead>
            <tr>
              <th>ID Karyawan</th>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>Tanggal Bergabung</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" className="no-data">Memuat data...</td></tr>
            ) : apiError ? (
              <tr><td colSpan="6" className="no-data error">{apiError}</td></tr>
            ) : filteredEmployees.length > 0 ? (
              filteredEmployees.map(employee => (
                <tr key={employee._id}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.nama}</td>
                  <td>{employee.jabatan}</td>
                  <td>
                    {new Date(employee.tanggalMasuk).toLocaleDateString('id-ID', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </td>
                  <td>
                    <span className={`status-badge status-${employee.status.toLowerCase().replace(/ /g, '-')}`}>{employee.status}</span>
                  </td>
                  <td>
                    <button className="action-btn edit-btn" onClick={() => handleEditClick(employee)}>✏️ Edit</button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(employee._id)}>🗑️ Hapus</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">Tidak ada data karyawan yang cocok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KelolaKaryawan;

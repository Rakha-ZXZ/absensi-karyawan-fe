import React, { useState, useEffect } from 'react';
import './KelolaKaryawan.css';
import AddEmployeeModal from '../components/AddEmployeeModal'; // Import modal
import EditEmployeeModal from '../components/EditEmployeeModal'; // Import modal edit

const KelolaKaryawan = () => {
  // State untuk data dari API
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
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
      // Ganti dengan endpoint yang benar jika berbeda
      const response = await fetch('/api/admin/get-employees'); 
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
    const employeeId = employee.employerId ? employee.employerId.toLowerCase() : '';
    return (
      employee.nama.toLowerCase().includes(term) ||
      employee.jabatan.toLowerCase().includes(term) ||
      employeeId.includes(term)
    );
  });

  // Fungsi untuk menangani penyimpanan data karyawan baru
  const handleSaveEmployee = async (newEmployeeData) => {
    setStatusMessage('Menyimpan data karyawan...');
    try {
      // Gunakan endpoint POST yang konsisten
      const response = await fetch('/api/admin/add-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Tambahkan header otorisasi jika diperlukan (misalnya: 'Authorization': `Bearer ${token}`)
        },
        body: JSON.stringify(newEmployeeData),
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
    const token = localStorage.getItem('token');
    try {
      // Asumsi endpoint update adalah /api/admin/update-employee/:id
      const response = await fetch(`/api/admin/update-employee/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
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
      const response = await fetch(`/api/admin/delete-employee/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        },
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
        <input
          type="text"
          placeholder="Cari berdasarkan nama, jabatan, atau ID..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
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
                  <td>{employee.employerId}</td>
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
import React, { useState, useMemo } from 'react';
import './KelolaAbsensi.css';

const KelolaAbsensi = ({ attendanceData = [], employeeData = [] }) => {
  // Membuat map untuk pencarian nama karyawan yang efisien
  const employeeMap = useMemo(() => 
    employeeData.reduce((map, employee) => {
      map[employee.id] = employee.nama;
      return map;
    }, {}), 
  [employeeData]);

  // State untuk filter
  const [filter, setFilter] = useState({
    search: '',
    tanggal: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  // Logika untuk memfilter data berdasarkan input
  const filteredData = attendanceData.filter(item => {
    const searchTerm = filter.search.toLowerCase();
    const employeeName = (employeeMap[item.employeeId] || '').toLowerCase();
    const formattedId = `emp-${String(item.employeeId).padStart(3, '0')}`.toLowerCase();

    return (
      (searchTerm === '' || 
       employeeName.includes(searchTerm) || 
       formattedId.includes(searchTerm)) &&
      (filter.tanggal === '' || item.tanggal === filter.tanggal)
    );
  });

  return (
    <div className="kelola-absensi-container">
      <div className="page-header">
        <h1>Kelola Absensi Karyawan</h1>
        <p>Lihat, cari, dan kelola data absensi.</p>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          name="search"
          placeholder="Cari nama atau ID karyawan..."
          value={filter.search}
          onChange={handleFilterChange}
          className="filter-input"
        />
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
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id}>
                <td>{`EMP-${String(item.employeeId).padStart(3, '0')}`}</td>
                <td>{employeeMap[item.employeeId] || 'Nama Tidak Ditemukan'}</td>
                <td>{item.tanggal}</td>
                <td>{item.jamMasuk}</td>
                <td>{item.jamKeluar}</td>
                <td><span className={`status-badge status-${item.status.toLowerCase()}`}>{item.status}</span></td>
                <td>
                  <button className="action-btn edit-btn">✏️</button>
                  <button className="action-btn delete-btn">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KelolaAbsensi;
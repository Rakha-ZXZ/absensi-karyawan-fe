import React, { useState, useMemo } from 'react';
import './RekapAbsensi.css';

const RekapAbsensi = ({ allAttendanceData, employeeData }) => {
  // Jika tidak ada data dari props, gunakan array kosong agar tidak error
  const attendanceData = allAttendanceData || [];
  const employees = employeeData || [];

  const [filter, setFilter] = useState({
    // Atur default ke bulan dan tahun saat ini
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const rekapData = useMemo(() => {
    const filtered = attendanceData.filter(item => {
      const itemDate = new Date(item.tanggal);
      return itemDate.getMonth() + 1 === filter.month && itemDate.getFullYear() === filter.year;
    });

    const summary = filtered.reduce((acc, curr) => {
      // Gunakan employeeId sebagai kunci unik
      const employeeId = curr.employeeId;
      if (!acc[employeeId]) {
        // Cari detail karyawan berdasarkan ID
        const employee = employees.find(e => e.id === employeeId);
        acc[employeeId] = { 
          id: employeeId, // Tambahkan ID karyawan ke objek rekap
          nama: employee ? employee.nama : `ID: ${employeeId}`, // Tampilkan nama, atau ID jika tidak ditemukan
          jabatan: employee ? employee.jabatan : 'N/A',
          Hadir: 0, Izin: 0, Sakit: 0, Terlambat: 0, Total: 0 
        };
      }
      if (acc[employeeId][curr.status] !== undefined) {
        acc[employeeId][curr.status]++;
      }
      acc[employeeId].Total++;
      return acc;
    }, {});

    return Object.values(summary);
  }, [attendanceData, filter]);

  const years = [...new Set(attendanceData.map(item => new Date(item.tanggal).getFullYear()))];

  return (
    <div className="rekap-absensi-container">
      <div className="page-header">
        <h1>Rekap Absensi Karyawan</h1>
        <p>Ringkasan absensi karyawan berdasarkan periode.</p>
      </div>

      <div className="filter-bar">
        <select name="month" value={filter.month} onChange={handleFilterChange} className="filter-input">
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('id-ID', { month: 'long' })}</option>
          ))}
        </select>
        <select name="year" value={filter.year} onChange={handleFilterChange} className="filter-input">
          {years.sort().map(year => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table className="rekap-table">
          <thead>
            <tr>
              <th>ID Karyawan</th>
              <th>Nama Karyawan</th>
              <th>Jabatan</th>
              <th>Hadir</th>
              <th>Izin</th>
              <th>Sakit</th>
              <th>Terlambat</th>
              <th>Total Hari</th>
            </tr>
          </thead>
          <tbody>
            {rekapData.length > 0 ? (
              rekapData.map((item, index) => (
                <tr key={item.id}>
                  <td>{`EMP-${String(item.id).padStart(3, '0')}`}</td>
                  <td>{item.nama}</td>
                  <td>{item.jabatan}</td>
                  <td>{item.Hadir}</td>
                  <td>{item.Izin}</td>
                  <td>{item.Sakit}</td>
                  <td>{item.Terlambat}</td>
                  <td>{item.Total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">Tidak ada data untuk periode yang dipilih.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RekapAbsensi;
import React, { useState, useMemo, useEffect } from 'react';
import './RekapAbsensi.css';

const isLocalDevelopment = import.meta.env.DEV;
const API_BASE_URL = isLocalDevelopment ? '/' : import.meta.env.VITE_API_URL;

const RekapAbsensi = () => {
  // State untuk data dari API
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  
  const [filter, setFilter] = useState({
    // Atur default ke bulan dan tahun saat ini
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  // Efek untuk mengambil data dari API setiap kali filter berubah
  useEffect(() => {
    const fetchAttendanceByMonth = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${API_BASE_URL}api/attendance/by-month?month=${filter.month}&year=${filter.year}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengambil data rekap.');
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (err) {
        setApiError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceByMonth();
  }, [filter]);

  const rekapData = useMemo(() => {
    const summary = attendanceData.reduce((acc, curr) => {
      const employeeInfo = curr.employeeId; // Data karyawan sudah di-populate
      if (!employeeInfo) return acc; // Lewati jika data karyawan tidak ada

      if (!acc[employeeInfo._id]) {
        acc[employeeInfo._id] = { 
          id: employeeInfo._id,
          employeeId: employeeInfo.employeeId,
          nama: employeeInfo.nama,
          jabatan: employeeInfo.jabatan || 'N/A',
          Hadir: 0, Cuti: 0, Terlambat: 0, Total: 0 
        };
      }
      if (acc[employeeInfo._id][curr.status] !== undefined) {
        acc[employeeInfo._id][curr.status]++;
      }
      acc[employeeInfo._id].Total++;
      return acc;
    }, {});

    return Object.values(summary);
  }, [attendanceData]);

  // Buat daftar tahun secara dinamis, misal 5 tahun terakhir
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

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
              <th>Terlambat</th>
              <th>Cuti</th>
              <th>Total Hari</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="7" className="no-data">Memuat data...</td></tr>
            ) : apiError ? (
              <tr><td colSpan="7" className="no-data error">{apiError}</td></tr>
            ) : rekapData.length > 0 ? (
              rekapData.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.employeeId || 'N/A'}</td>
                  <td>{item.nama}</td>
                  <td>{item.jabatan}</td>
                  <td>{item.Hadir}</td>
                  <td>{item.Terlambat}</td>
                  <td>{item.Cuti}</td>
                  <td>{item.Total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">Tidak ada data untuk periode yang dipilih.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RekapAbsensi;
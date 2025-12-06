import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const isLocalDevelopment = import.meta.env.DEV;
const API_BASE_URL = isLocalDevelopment ? '/' : import.meta.env.VITE_API_URL;

const Dashboard = ({ payrollData }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    Hadir: 0,
    Terlambat: 0,
    Cuti: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}api/attendance/my-history`, {
          credentials: 'include', // Mengirim cookie untuk otentikasi
        });
        if (!response.ok) {
          throw new Error('Gagal mengambil riwayat absensi.');
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching attendance data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();

    const fetchAttendanceStats = async () => {
      setIsStatsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}api/attendance/monthly-recap`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Gagal mengambil rekap absensi.');
        }
        const data = await response.json();
        // Gabungkan data dari API dengan nilai default
        setAttendanceStats(prevStats => ({
          ...prevStats,
          ...data,
        }));
      } catch (err) {
        // Tidak menampilkan error di sini agar tidak mengganggu UI utama
        console.error("Error fetching attendance stats:", err);
      } finally {
        setIsStatsLoading(false);
      }
    };

    fetchAttendanceStats();
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat komponen dimuat

  // Hitung total hari kerja dari statistik yang sudah diambil
  const totalHariKerja = Object.values(attendanceStats).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div className="grid">
        <div className="stat-card">
          <div className="stat-label">Total Hari Kerja</div>
          <div className="stat-value">{isStatsLoading ? '...' : totalHariKerja}</div>
          <p>Bulan Ini</p>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tepat Waktu</div>
          <div className="stat-value">{isStatsLoading ? '...' : attendanceStats.Hadir}</div>
          <p>Hari</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Terlambat</div>
          <div className="stat-value">{isStatsLoading ? '...' : attendanceStats.Terlambat}</div>
          <p>Hari</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Cuti</div>
          <div className="stat-value">{isStatsLoading ? '...' : attendanceStats.Cuti}</div>
          <p>Hari</p>
        </div>
      </div>
      
      <div className="card">
        <h2 className="card-title">Aktivitas Terbaru</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Jam Masuk</th>
              <th>Jam Pulang</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Memuat aktivitas...</td></tr>
            ) : error ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'red' }}>{error}</td></tr>
            ) : attendanceData.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Belum ada aktivitas.</td></tr>
            ) : (
              attendanceData.slice(0, 5).map((attendance) => (
                <tr key={attendance._id}>
                  <td>{new Date(attendance.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  <td>{new Date(attendance.jamMasuk).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{attendance.jamPulang ? new Date(attendance.jamPulang).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td>
                    <span className={`status-${attendance.status.toLowerCase()}`}>
                      {attendance.status}
                    </span>
                  </td>
                  <td>
                    <Link to="/absensi" className="btn btn-secondary" style={{padding: '5px 10px', fontSize: '0.85rem'}}>
                      Detail
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <Link to="/absensi" className="btn btn-primary">Lihat Semua Absensi</Link>
        </div>
      </div>
      
      <div className="card">
        <h2 className="card-title">Informasi Gaji Bulan Ini</h2>
        <div className="payroll-item">
          <span>Gaji Pokok:</span>
          <span>Rp {payrollData.gajiPokok.toLocaleString('id-ID')}</span>
        </div>
        <div className="payroll-item">
          <span>Tunjangan Jabatan:</span>
          <span>Rp {payrollData.tunjanganJabatan.toLocaleString('id-ID')}</span>
        </div>
        <div className="payroll-item">
          <span>Tunjangan Transport:</span>
          <span>Rp {payrollData.tunjanganTransport.toLocaleString('id-ID')}</span>
        </div>
        <div className="payroll-item">
          <span>Tunjangan Makan:</span>
          <span>Rp {payrollData.tunjanganMakan.toLocaleString('id-ID')}</span>
        </div>
        <div className="payroll-total">
          <span>Total Gaji:</span>
          <span>Rp {payrollData.totalGaji.toLocaleString('id-ID')}</span>
        </div>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <Link to="/gaji" className="btn btn-primary">Detail Lengkap Gaji</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
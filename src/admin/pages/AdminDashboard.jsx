import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const isLocalDevelopment = import.meta.env.DEV;
const API_BASE_URL = isLocalDevelopment ? '/' : import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  // State khusus untuk aktivitas absensi terbaru
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [isRecentLoading, setIsRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState(null);

  // State untuk jumlah karyawan
  const [employeeCount, setEmployeeCount] = useState(0);
  const [isCountLoading, setIsCountLoading] = useState(true);
  const [countError, setCountError] = useState(null);

  // State untuk jumlah absensi hari ini
  const [todaysAttendanceCount, setTodaysAttendanceCount] = useState(0);
  const [isTodaysCountLoading, setIsTodaysCountLoading] = useState(true);
  const [todaysCountError, setTodaysCountError] = useState(null);

  // State untuk rekapitulasi bulanan
  const [monthlySummary, setMonthlySummary] = useState({ Hadir: 0, Terlambat: 0, Cuti: 0 });
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);


  // Mengambil data aktivitas terbaru saat komponen dimuat
  useEffect(() => {
    const fetchRecentActivity = async () => {
      setIsRecentLoading(true);
      setRecentError(null);
      try {
        const response = await fetch(`${API_BASE_URL}api/attendance/today-activity`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Gagal memuat aktivitas absensi hari ini.');
        }
        const data = await response.json();
        setRecentAttendance(data);
      } catch (err) {
        setRecentError(err.message);
      } finally {
        setIsRecentLoading(false);
      }
    };
    fetchRecentActivity();
  }, []);

  // Mengambil data jumlah karyawan
  useEffect(() => {
    const fetchEmployeeCount = async () => {
      setIsCountLoading(true);
      setCountError(null);
      try {
        const response = await fetch(`${API_BASE_URL}api/employee/count`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Gagal mengambil jumlah karyawan.');
        }
        const data = await response.json();
        setEmployeeCount(data.count);
      } catch (err) {
        setCountError(err.message);
      } finally {
        setIsCountLoading(false);
      }
    };
    fetchEmployeeCount();
  }, []);

  // Mengambil data jumlah absensi hari ini
  useEffect(() => {
    const fetchTodaysAttendanceCount = async () => {
      setIsTodaysCountLoading(true);
      setTodaysCountError(null);
      try {
        const response = await fetch(`${API_BASE_URL}api/attendance/today-count`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Gagal mengambil jumlah absensi hari ini.');
        }
        const data = await response.json();
        setTodaysAttendanceCount(data.count);
      } catch (err) {
        setTodaysCountError(err.message);
      } finally {
        setIsTodaysCountLoading(false);
      }
    };
    fetchTodaysAttendanceCount();
  }, []);

  // Mengambil data rekapitulasi bulanan
  useEffect(() => {
    const fetchMonthlySummary = async () => {
      setIsSummaryLoading(true);
      setSummaryError(null);
      try {
        const response = await fetch(`${API_BASE_URL}api/attendance/monthly-summary`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Gagal mengambil rekap bulanan.');
        }
        const data = await response.json();
        setMonthlySummary(data);
      } catch (err) {
        setSummaryError(err.message);
      } finally {
        setIsSummaryLoading(false);
      }
    };
    fetchMonthlySummary();
  }, []);

  // Hapus kalkulasi lama, karena sudah digantikan oleh API
  // const totalTerlambat = allAttendanceData.filter(a => a.status === 'Terlambat').length;
  // const totalCuti = allAttendanceData.filter(a => a.status === 'Cuti').length;
  
  // Kalkulasi untuk Ringkasan Absensi
  const totalMonthlyAttendance = monthlySummary.Hadir + monthlySummary.Terlambat + monthlySummary.Cuti;
  const onTimePercentage = 
    (monthlySummary.Hadir + monthlySummary.Terlambat) > 0 
      ? Math.round((monthlySummary.Hadir / (monthlySummary.Hadir + monthlySummary.Terlambat)) * 100) 
      : 0;


  return (
    <div>
      <h1 className="page-title">Dashboard Admin</h1>

      <div className="grid">
        <div className="stat-card">
          <div className="stat-label">Total Karyawan</div>
          <div className="stat-value">
            {isCountLoading ? '...' : countError ? '!' : employeeCount}
          </div>
          <p>Orang</p>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Absensi Hari Ini</div>
          <div className="stat-value">
            {isTodaysCountLoading ? '...' : todaysCountError ? '!' : todaysAttendanceCount}
          </div>
          <p>Orang</p>
        </div>

        <div className="stat-card">
          <div className="stat-label">Tepat Waktu (Bulan Ini)</div>
          <div className="stat-value">
            {isSummaryLoading ? '...' : summaryError ? '!' : monthlySummary.Hadir}
          </div>
          <p>Kali</p>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Terlambat (Bulan Ini)</div>
          <div className="stat-value">
            {isSummaryLoading ? '...' : summaryError ? '!' : monthlySummary.Terlambat}
          </div>
          <p>Kali</p>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Cuti (Bulan Ini)</div>
          <div className="stat-value">
            {isSummaryLoading ? '...' : summaryError ? '!' : monthlySummary.Cuti}
          </div>
          <p>Hari</p>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Aktivitas Absensi Hari Ini</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nama Karyawan</th>
              <th>Tanggal</th>
              <th>Jam Masuk</th>
              <th>Jam Pulang</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isRecentLoading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Memuat aktivitas hari ini...</td></tr>
            ) : recentError ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', color: 'red' }}>{recentError}</td></tr>
            ) : recentAttendance.length > 0 ? (
              recentAttendance.slice(0, 7).map((att) => (
                <tr key={att._id}>
                  <td>{att.employeeId?.nama || 'N/A'}</td>
                  <td>{new Date(att.tanggal).toLocaleDateString('id-ID')}</td>
                  <td>{new Date(att.jamMasuk).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{att.jamPulang ? new Date(att.jamPulang).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td>
                    <span className={`status-badge status-${att.status.toLowerCase()}`}>
                      {att.status}
                    </span>
                  </td>
                  <td>
                    <Link to="/admin/absensi" className="btn btn-secondary" style={{padding: '5px 10px', fontSize: '0.85rem'}}>
                      Kelola
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Belum ada aktivitas absensi hari ini.</td></tr>
            )}
          </tbody>
        </table>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <Link to="/admin/absensi" className="btn btn-primary">Lihat Semua Absensi</Link>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Ringkasan Absensi (Bulan Ini)</h2>
        <div className="payroll-item">
          <span>Total Absensi Tercatat:</span>
          <span>{isSummaryLoading ? '...' : summaryError ? '!' : totalMonthlyAttendance}</span>
        </div>
        <div className="payroll-item">
          <span>Persentase Tepat Waktu:</span>
          <span>
            {isSummaryLoading ? '...' : summaryError ? '!' : `${onTimePercentage}%`}
          </span>
        </div>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <Link to="/admin/rekap-absensi" className="btn btn-primary">Lihat Rekap Bulanan</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = ({ allAttendanceData, employeeData }) => {
  // Hitung statistik admin
  const totalEmployees = employeeData.length;
  const totalHadirToday = allAttendanceData.filter(a => a.status === 'Hadir' && a.tanggal === new Date().toISOString().split('T')[0]).length;
  const totalTerlambat = allAttendanceData.filter(a => a.status === 'Terlambat').length;
  const totalCuti = allAttendanceData.filter(a => a.status === 'Cuti').length;

  return (
    <div>
      <h1 className="page-title">Dashboard Admin</h1>

      <div className="grid">
        <div className="stat-card">
          <div className="stat-label">Total Karyawan</div>
          <div className="stat-value">{totalEmployees}</div>
          <p>Orang</p>
        </div>

        <div className="stat-card">
          <div className="stat-label">Hadir Hari Ini</div>
          <div className="stat-value">{totalHadirToday}</div>
          <p>Orang</p>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Terlambat (Bulan Ini)</div>
          <div className="stat-value">{totalTerlambat}</div>
          <p>Kali</p>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Cuti (Bulan Ini)</div>
          <div className="stat-value">{totalCuti}</div>
          <p>Hari</p>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Aktivitas Absensi Terbaru</h2>
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
            {allAttendanceData.slice(0, 10).map((attendance) => (
              <tr key={attendance.id}>
                <td>{attendance.nama}</td>
                <td>{attendance.tanggal}</td>
                <td>{attendance.jamMasuk}</td>
                <td>{attendance.jamPulang || '-'}</td>
                <td>
                  <span className={`status-${attendance.status.toLowerCase()}`}>
                    {attendance.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" style={{padding: '5px 10px', fontSize: '0.85rem'}}>
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <Link to="/admin/absensi" className="btn btn-primary">Lihat Semua Absensi</Link>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Ringkasan Karyawan</h2>
        <div className="payroll-item">
          <span>Total Karyawan Aktif:</span>
          <span>{employeeData.filter(e => e.status === 'Aktif').length}</span>
        </div>
        <div className="payroll-item">
          <span>Karyawan Tidak Aktif:</span>
          <span>{employeeData.filter(e => e.status !== 'Aktif').length}</span>
        </div>
        <div className="payroll-item">
          <span>Rata-rata Kehadiran:</span>
          <span>{Math.round((allAttendanceData.filter(a => a.status === 'Hadir').length / allAttendanceData.length) * 100)}%</span>
        </div>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <Link to="/admin/karyawan" className="btn btn-primary">Kelola Karyawan</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

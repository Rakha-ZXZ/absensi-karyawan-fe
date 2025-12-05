import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ attendanceData, payrollData }) => {
  // Hitung statistik
  const totalHadir = attendanceData.filter(a => a.status === 'Hadir').length;
  const totalTerlambat = attendanceData.filter(a => a.status === 'Terlambat').length;
  const totalCuti = attendanceData.filter(a => a.status === 'Cuti').length;
  
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      <div className="grid">
        <div className="stat-card">
          <div className="stat-label">Total Hadir (Bulan Ini)</div>
          <div className="stat-value">{totalHadir}</div>
          <p>Hari</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Terlambat</div>
          <div className="stat-value">{totalTerlambat}</div>
          <p>Hari</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Cuti</div>
          <div className="stat-value">{totalCuti}</div>
          <p>Hari</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Estimasi Gaji Bulan Ini</div>
          <div className="stat-value">Rp {payrollData.totalGaji.toLocaleString('id-ID')}</div>
          <p>Setelah potongan</p>
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
            {attendanceData.slice(0, 5).map((attendance) => (
              <tr key={attendance.id}>
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
import React, { useState } from 'react';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceList from '../components/AttendanceList';

const Absensi = ({ attendanceData, addAttendance }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleAttendanceSubmit = (attendance) => {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5);
    const currentDate = now.toISOString().split('T')[0];
    
    let status = 'Hadir';
    let jamPulang = null;
    
    if (attendance.type === 'masuk') {
      const isLate = currentTime > '08:00';
      status = isLate ? 'Terlambat' : 'Hadir';
      setSuccessMessage('Absensi masuk berhasil dicatat! Selamat bekerja.');
    } else if (attendance.type === 'pulang') {
      jamPulang = currentTime;
      status = 'Hadir';
      setSuccessMessage('Absensi pulang berhasil dicatat! Hati-hati di jalan.');
    } else if (attendance.type === 'cuti') {
      status = 'Cuti';
      setSuccessMessage('Pengajuan cuti berhasil dikirim!');
    }
    
    const newAttendance = {
      id: attendanceData.length + 1,
      tanggal: currentDate,
      jamMasuk: attendance.type === 'masuk' ? currentTime : (attendance.type === 'cuti' ? null : '08:00'),
      jamPulang: jamPulang,
      status: status,
      keterangan: attendance.keterangan
    };
    
    addAttendance(newAttendance);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const handleCheckout = (id) => {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5);
    
    // Di implementasi nyata, ini akan mengupdate data absensi di state
    setSuccessMessage(`Check-out berhasil dicatat pada jam ${currentTime}`);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  return (
    <div>
      <h1 className="page-title">Absensi Harian</h1>
      
      {showSuccess && (
        <div className="alert alert-success">
          ✅ {successMessage}
        </div>
      )}
      
      <div className="card">
        <h2 className="card-title">Catat Kehadiran Hari Ini</h2>
        <AttendanceForm onSubmit={handleAttendanceSubmit} />
      </div>
      
      <div className="card">
        <h2 className="card-title">Riwayat Absensi</h2>
        <div className="attendance-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Hari Kerja:</span>
              <span className="stat-value">{attendanceData.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Hadir:</span>
              <span className="stat-value">{attendanceData.filter(a => a.status === 'Hadir').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Terlambat:</span>
              <span className="stat-value">{attendanceData.filter(a => a.status === 'Terlambat').length}</span>
            </div>
          </div>
        </div>
        <AttendanceList 
          attendanceData={attendanceData} 
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
};

export default Absensi;
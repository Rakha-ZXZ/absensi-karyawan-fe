import React from 'react';
import './AttendanceList.css'
const AttendanceList = ({ attendanceData, isLoading }) => {
  // Fungsi untuk menampilkan status dengan badge yang sesuai
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Hadir':
        return <span className="status-hadir">{status}</span>;
      case 'Terlambat':
        return <span className="status-terlambat">{status}</span>;
      case 'Cuti':
        return <span className="status-cuti">{status}</span>;
      default:
        return <span className="status-hadir">{status}</span>;
    }
  };

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Fungsi untuk memformat waktu
  const formatTime = (dateString) => {
    if (!dateString) return <span className="text-muted">-</span>;
    return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="attendance-list">
      {isLoading ? (
        <div className="no-data">
          <p>Memuat riwayat absensi...</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Jam Masuk</th>
              <th>Jam Pulang</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map((attendance) => (
                <tr key={attendance._id}>
                  <td>{formatDate(attendance.tanggal)}</td>
                  <td>
                    <span className="time-value">{formatTime(attendance.jamMasuk)}</span>
                  </td>
                  <td>
                    <span className="time-value">{formatTime(attendance.jamPulang)}</span>
                  </td>
                  <td>{getStatusBadge(attendance.status)}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="no-data-row">Belum ada riwayat absensi.</td></tr>
            )}
          </tbody>
        </table>
      )}

      <style jsx>{`
        .attendance-list {
          margin-top: 20px;
        }
        
        .no-data {
          text-align: center;
          padding: 40px;
          color: #6b7280;
          background: rgba(249, 250, 251, 0.7);
          border-radius: 12px;
          border: 1px solid rgba(209, 213, 219, 0.5);
        }
        
        .text-muted {
          color: #9ca3af;
        }
        
        .time-value {
          font-weight: 600;
          color: #374151;
        }
        
        .btn-sm {
          padding: 5px 10px;
          font-size: 0.85rem;
        }

        .no-data-row {
          text-align: center;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default AttendanceList;
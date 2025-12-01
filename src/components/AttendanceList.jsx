import React from 'react';

const AttendanceList = ({ attendanceData, onCheckout }) => {
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

  return (
    <div className="attendance-list">
      {attendanceData.length === 0 ? (
        <div className="no-data">
          <p>Belum ada data absensi</p>
        </div>
      ) : (
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
            {attendanceData.map((attendance) => (
              <tr key={attendance.id}>
                <td>{formatDate(attendance.tanggal)}</td>
                <td>
                  <span className="time-value">{attendance.jamMasuk}</span>
                </td>
                <td>
                  {attendance.jamPulang ? (
                    <span className="time-value">{attendance.jamPulang}</span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>{getStatusBadge(attendance.status)}</td>
                <td>
                  {!attendance.jamPulang && attendance.jamMasuk && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onCheckout(attendance.id)}
                      style={{ padding: '5px 10px', fontSize: '0.85rem' }}
                    >
                      Check-out
                    </button>
                  )}
                  {attendance.jamPulang && (
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                      Selesai
                    </span>
                  )}
                </td>
              </tr>
            ))}
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
      `}</style>
    </div>
  );
};

export default AttendanceList;
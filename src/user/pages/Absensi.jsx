import React, { useState, useEffect } from 'react';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceList from '../components/AttendanceList';
import './Absensi.css';

const isLocalDevelopment = import.meta.env.DEV;
const API_BASE_URL = isLocalDevelopment ? '/' : import.meta.env.VITE_API_URL;

const Absensi = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/attendance/status`);
        if (!response.ok) {
          // Tidak melempar error jika 401/403, biarkan UI menampilkan form login
          if (response.status === 401 || response.status === 403) return;
          throw new Error('Gagal memeriksa status absensi.');
        }
        const result = await response.json();
        if (result.hasCheckedIn) {
          setTodayAttendance(result);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkStatus();
  }, []);
  
  // useEffect untuk mengambil riwayat absensi
  useEffect(() => {
    const fetchHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}api/attendance/my-history`);
        if (!response.ok) {
          throw new Error('Gagal memuat riwayat absensi.');
        }
        const data = await response.json();
        setAttendanceHistory(data);
      } catch (err) {
        // Menampilkan error di tempat lain agar tidak menimpa error absensi
        console.error(err.message);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [todayAttendance]); // Muat ulang riwayat saat ada check-in/check-out baru

  const filteredHistory = attendanceHistory.filter((item) => {
    if (!filterMonth) return true;
    const itemDateObj = new Date(item.tanggal);
    const year = itemDateObj.getFullYear();
    const month = String(itemDateObj.getMonth() + 1).padStart(2, '0');
    const itemMonth = `${year}-${month}`;
    return itemMonth === filterMonth;
  });

  const formattedFilterMonth = filterMonth
    ? new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(`${filterMonth}-01`))
    : 'Semua bulan';

  const handleAttendanceSubmit = async (attendance) => {
    setError('');
    setShowSuccess(false);
    setIsLoading(true);

    // --- Integrasi API untuk Absen Masuk ---
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser Anda.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Gunakan FormData untuk mengirim foto
          const formData = new FormData();
          formData.append('latitude', latitude);
          formData.append('longitude', longitude);
          if (attendance.photo) {
            formData.append('fotoAbsensi', attendance.photo);
          }

          const response = await fetch(`${API_BASE_URL}api/attendance/check-in`, {
            method: 'POST',
            body: formData, // Kirim FormData, bukan JSON
          });

          // Cek apakah response adalah JSON
          const contentType = response.headers.get('content-type');
          let result;
          
          if (contentType && contentType.includes('application/json')) {
            try {
              result = await response.json();
            } catch (parseError) {
              // Error saat parsing JSON
              throw new Error('Gagal memproses respons dari server. Pastikan backend berjalan dengan benar.');
            }
          } else {
            // Jika bukan JSON, kemungkinan HTML error page
            throw new Error('Server mengembalikan respons yang tidak valid. Pastikan backend berjalan dengan benar.');
          }

          if (!response.ok) {
            // Tampilkan pesan error dari server
            throw new Error(result.message || 'Gagal melakukan absensi.');
          }

          // Perbarui state absensi hari ini untuk memicu re-fetch riwayat
          setTodayAttendance(result.data); // Update status untuk menyembunyikan form
          setSuccessMessage(result.message);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);

        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      },
      (geoError) => {
        setError(`Gagal mendapatkan lokasi: ${geoError.message}. Pastikan Anda mengizinkan akses lokasi.`);
        setIsLoading(false);
      }
    );
  };
  
  const handleInitiateCheckout = () => {
    setShowConfirmModal(true); // Hanya tampilkan modal konfirmasi
  };

  const handleConfirmCheckout = async () => {
    setShowConfirmModal(false); // Sembunyikan modal setelah dikonfirmasi

    setError('');
    setShowSuccess(false);
    setIsLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser Anda.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`${API_BASE_URL}api/attendance/check-out`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude }),
          });

          // Cek apakah response adalah JSON
          const contentType = response.headers.get('content-type');
          let result;
          
          if (contentType && contentType.includes('application/json')) {
            try {
              result = await response.json();
            } catch (parseError) {
              // Error saat parsing JSON
              throw new Error('Gagal memproses respons dari server. Pastikan backend berjalan dengan benar.');
            }
          } else {
            // Jika bukan JSON, kemungkinan HTML error page
            throw new Error('Server mengembalikan respons yang tidak valid. Pastikan backend berjalan dengan benar.');
          }

          if (!response.ok) {
            // Tampilkan pesan error dari server
            throw new Error(result.message || 'Gagal melakukan check-out.');
          }

          setTodayAttendance(result.data); // Perbarui state dengan data lengkap dari server
          setSuccessMessage(result.message);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);

        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      },
      (geoError) => {
        setError(`Gagal mendapatkan lokasi: ${geoError.message}. Pastikan Anda mengizinkan akses lokasi.`);
        setIsLoading(false);
      }
    );
  };
  
  return (
    <div>
      {/* Modal Konfirmasi Checkout */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Konfirmasi Absen Pulang</h3>
            <p className="modal-text">
              Apakah Anda yakin ingin melakukan absen pulang sekarang? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="modal-actions">
              <button onClick={() => setShowConfirmModal(false)} className="btn btn-secondary">
                Batal
              </button>
              <button onClick={handleConfirmCheckout} className="btn btn-danger" disabled={isLoading}>
                {isLoading ? 'Memproses...' : 'Ya, Absen Pulang'}
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="page-title">Absensi Harian</h1>
      
      {showSuccess && (
        <div className="alert alert-success">
          ✅ {successMessage}
        </div>
      )}

      {error && (
        // Gunakan style khusus jika ini adalah error lokasi
        error.includes("meter dari kantor") ? (
          <div className="alert-location-error">
            <span>📍</span> {error}
          </div>
        ) : (
          <div className="alert alert-danger">❌ {error}</div>
        )
      )}
      
      <div className="card">
        <h2 className="card-title">Catat Kehadiran Hari Ini</h2>
        {isCheckingStatus ? (
          <p>Memeriksa status absensi...</p>
        ) : todayAttendance ? (
          todayAttendance.jamPulang ? (
            // Jika sudah check-out, tampilkan pesan ini
            <div className="alert alert-success">
              Anda sudah menyelesaikan absensi hari ini. Check-out tercatat pada pukul{' '}
              <strong>
                {new Date(todayAttendance.jamPulang).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </strong>
              . Selamat beristirahat!
            </div>
          ) : (
            // Jika baru check-in (belum check-out), tampilkan pesan ini
            <div className="alert alert-info">
              Anda sudah melakukan absensi masuk hari ini pada pukul{' '}
              <strong>
                {new Date(todayAttendance.jamMasuk).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </strong>{' '}
              dengan status <strong>{todayAttendance.status}</strong>.
              <button
                onClick={handleInitiateCheckout}
                className="btn-checkout"
                disabled={isLoading}>
                {isLoading ? 'Memproses...' : 'Absen Pulang Sekarang'}
              </button>
            </div>
          )
        ) : (
          <AttendanceForm
            onSubmit={handleAttendanceSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
      
      <div className="card">
        <h2 className="card-title">Riwayat Absensi</h2>
        <div className="attendance-filter">
          <label className="filter-label" htmlFor="filterMonth">Filter Bulan</label>
          <input
            id="filterMonth"
            type="month"
            className="filter-input"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />
          <span className="filter-helper">Menampilkan: {formattedFilterMonth}</span>
        </div>
        <div className="attendance-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Hari Kerja:</span>
              <span className="stat-value">{filteredHistory.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tepat Waktu:</span>
              <span className="stat-value">{filteredHistory.filter(a => a.status === 'Hadir').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Terlambat:</span>
              <span className="stat-value">{filteredHistory.filter(a => a.status === 'Terlambat').length}</span>
            </div>
          </div>
        </div>
        <AttendanceList 
          attendanceData={filteredHistory} 
          isLoading={isHistoryLoading}
        />
      </div>
    </div>
  );
};



export default Absensi;

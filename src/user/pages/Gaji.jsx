import React, { useState, useEffect } from 'react';
import './Gaji.css';

const isLocalDevelopment = import.meta.env.DEV;
const API_BASE_URL = isLocalDevelopment ? '/' : import.meta.env.VITE_API_URL;
/**
 * Fungsi untuk memanggil API backend dan mengambil jumlah hari kerja yang dibayar.
 * @returns {Promise<Object>} Promise yang akan resolve dengan data dari API.
 */
const fetchPayableDaysCountFromAPI = async () => {
  const response = await fetch(`${API_BASE_URL}api/attendance/payable-days-count`, {
    // credentials: 'include' memastikan browser mengirim cookie
    // yang terkait dengan domain backend, bahkan saat melakukan cross-origin request.
    credentials: 'include', 
  });

  if (!response.ok) {
    // Jika respons dari server tidak OK (misal: 401, 403, 500)
    throw new Error('Gagal mengambil data hari kerja dari server.');
  }

  return response.json(); // Mengembalikan data JSON dari respons
};

const Gaji = () => {
  const [payableDays, setPayableDays] = useState(0);
  const [isDaysLoading, setIsDaysLoading] = useState(true);
  const [daysError, setDaysError] = useState(null);

  // State baru untuk data gaji
  const [salaryData, setSalaryData] = useState({
    gajiPokok: 0,
    tunjanganJabatan: 0,
    tunjanganTransport: 0,
    tunjanganMakan: 0,
  });
  const [isSalaryLoading, setIsSalaryLoading] = useState(true);
  const [salaryError, setSalaryError] = useState(null);

  // State baru untuk riwayat rekap gaji dan filternya
  const [monthlyRecap, setMonthlyRecap] = useState([]);
  const [isRecapLoading, setIsRecapLoading] = useState(true);
  const [recapError, setRecapError] = useState(null);
  const [recapFilter, setRecapFilter] = useState({
    year: new Date().getFullYear(),
    month: '', // Kosong berarti semua bulan
  });

  // Menggunakan asumsi 30 hari kalender untuk perhitungan prorata harian
  const HARI_PEMBAGI = 30;

  useEffect(() => {
    // useEffect ini hanya untuk data yang dimuat sekali
    const fetchInitialData = async () => {
      // Fetch payable days
      setIsDaysLoading(true);
      try {
        const daysData = await fetchPayableDaysCountFromAPI();
        setPayableDays(daysData.payableDaysCount);
        setDaysError(null);
      } catch (err) {
        console.error("Error fetching payable days:", err.message);
        setDaysError(err.message);
      } finally {
        setIsDaysLoading(false);
      }

      // Fetch salary details
      setIsSalaryLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}api/employee/salary-details`, { credentials: 'include' });
        if (!response.ok) throw new Error('Gagal mengambil detail gaji.');
        const data = await response.json();
        setSalaryData(data);
        setSalaryError(null);
      } catch (err) {
        console.error("Error fetching salary details:", err.message);
        setSalaryError(err.message);
      } finally {
        setIsSalaryLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Dependency array kosong agar hanya berjalan sekali saat komponen dimuat

  // useEffect terpisah khusus untuk mengambil riwayat gaji berdasarkan filter
  useEffect(() => {
    const fetchPayrollHistory = async () => {
      setIsRecapLoading(true);
      setRecapError(null);
      try {
        let url = `${API_BASE_URL}api/payroll/my-history?year=${recapFilter.year}`;
        if (recapFilter.month) {
          url += `&month=${recapFilter.month}`;
        }
      console.log("Frontend: Fetching payroll history from URL:", url); // DEBUG LOG

        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) throw new Error('Gagal mengambil riwayat gaji.');
        const data = await response.json();
        setMonthlyRecap(data);
        console.log("Frontend: Received payroll history data:", data); // DEBUG LOG
      } catch (err) {
        console.error("Error fetching payroll history:", err.message);
        setRecapError(err.message);
      } finally {
        setIsRecapLoading(false);
      }
    };

    fetchPayrollHistory();
  }, [recapFilter]); // Ambil ulang data setiap kali filter berubah

  // Membuat judul bulan dan tahun menjadi dinamis
  const bulanSekarang = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // Menghitung nilai harian untuk setiap komponen
  const gajiPokokHarian = (salaryData.gajiPokok || 0) / HARI_PEMBAGI;
  const tunjanganJabatanHarian = (salaryData.tunjanganJabatan || 0) / HARI_PEMBAGI;
  const tunjanganTransportHarian = (salaryData.tunjanganTransport || 0) / HARI_PEMBAGI;
  const tunjanganMakanHarian = (salaryData.tunjanganMakan || 0) / HARI_PEMBAGI;

  // Menghitung total estimasi pendapatan harian
  const totalPendapatanHarian = gajiPokokHarian + tunjanganJabatanHarian + tunjanganTransportHarian + tunjanganMakanHarian;

  // Menghitung total gaji yang telah terkumpul berdasarkan kehadiran
  const gajiTerkumpul = totalPendapatanHarian * payableDays;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setRecapFilter(prev => ({ ...prev, [name]: value }));
  };

  // Buat daftar tahun dan bulan untuk filter
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: '', name: 'Semua Bulan' }, { value: 1, name: 'Januari' }, { value: 2, name: 'Februari' },
    { value: 3, name: 'Maret' }, { value: 4, name: 'April' }, { value: 5, name: 'Mei' }, { value: 6, name: 'Juni' },
    { value: 7, name: 'Juli' }, { value: 8, name: 'Agustus' }, { value: 9, name: 'September' }, { value: 10, name: 'Oktober' },
    { value: 11, name: 'November' }, { value: 12, name: 'Desember' },
  ];
  
  return (
    <div>
      <h1 className="page-title">Estimasi Pendapatan Harian</h1>
      
      <div className="card">
        <h2 className="card-title">Rincian Pendapatan per Hari Kerja</h2>
          
        {isSalaryLoading ? <p>Memuat rincian gaji...</p> : salaryError ? <p className="error-message">{salaryError}</p> : (
          <>
            <div className="payroll-item">
              <span>Gaji Pokok Harian:</span>
              <span>Rp {gajiPokokHarian.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="payroll-item">
              <span>Tunjangan Jabatan Harian:</span>
              <span>Rp {tunjanganJabatanHarian.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="payroll-item">
              <span>Tunjangan Transport Harian:</span>
              <span>Rp {tunjanganTransportHarian.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="payroll-item">
              <span>Tunjangan Makan Harian:</span>
              <span>Rp {tunjanganMakanHarian.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="payroll-total">
              <span>Total Estimasi Pendapatan Harian:</span>
              <span>Rp {totalPendapatanHarian.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
            </div>
          </>
        )}

        <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px', fontSize: '0.9rem'}}>
          <p style={{margin: 0, color: '#555'}}>
            <strong>Catatan:</strong> Angka di atas adalah estimasi pendapatan harian, dihitung dengan membagi setiap komponen gaji bulanan dengan {HARI_PEMBAGI} hari.
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Akumulasi Gaji Bulan {bulanSekarang}</h2>

        <div className="payroll-item">
          <span>Total Hari Kerja:</span>
          {daysError ? (
            <span style={{ color: 'red' }}>Gagal memuat</span>
          ) : (
            <span>
              {isDaysLoading ? 'Menghitung...' : `${payableDays} Hari`}
            </span>
          )}
        </div>

        <div className="payroll-total">
          <span>Estimasi Gaji Terkumpul:</span>
          {daysError || salaryError ? (
            <span style={{ color: 'red' }}>Gagal menghitung</span>
          ) : (
            <span>
              {isDaysLoading || isSalaryLoading ? 'Menghitung...' : `Rp ${gajiTerkumpul.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`}
            </span>
          )}
        </div>
      </div>

      {/* Kartu Penjelasan */}
      <div className="card explanation-card">
        <h3 className="explanation-title">
          <span className="icon">💡</span> Memahami Perhitungan Gaji Anda
        </h3>
        <p className="explanation-text">
          <strong>Estimasi Gaji Terkumpul</strong> adalah proyeksi pendapatan berdasarkan total hari Anda diabsen (termasuk Hadir, Terlambat, Cuti). Angka ini berguna untuk melihat progres Anda.
        </p>
        <p className="explanation-text">
          <strong>Rekap Gaji Bulanan</strong> adalah jumlah **gaji final dan tetap** yang Anda terima. Angka ini sudah mencakup pembayaran untuk seluruh hari dalam sebulan, termasuk hari kerja dan hari libur (akhir pekan & libur nasional), sesuai dengan kontrak kerja Anda.
        </p>
      </div>


      {/* Rekap Gaji Bulanan */}
      <div className="card">
  <h2 className="card-title">Rekap Gaji Bulanan</h2>

  <div className="filter-bar-gaji">
    <select name="month" value={recapFilter.month} onChange={handleFilterChange} className="filter-input-gaji">
      {months.map(m => (
        <option key={m.value} value={m.value}>{m.name}</option>
      ))}
    </select>
    <select name="year" value={recapFilter.year} onChange={handleFilterChange} className="filter-input-gaji">
      {years.map(y => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  </div>

  <style>{`
    .filter-bar-gaji { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .filter-input-gaji { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; }
  `}</style>

  <table className="table">
    <thead>
      <tr>
        <th>Bulan</th>
        <th>Gaji Pokok</th>
        <th>Tunjangan</th>
        <th>Potongan</th>
        <th>Total Bersih</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {isRecapLoading ? (
        <tr><td colSpan="6" className="no-data-row">Memuat riwayat gaji...</td></tr>
      ) : recapError ? (
        <tr><td colSpan="6" className="no-data-row error">{recapError}</td></tr>
      ) : monthlyRecap.length > 0 ? (
        monthlyRecap.map((data) => (
          <tr key={data._id}>
            <td>{new Date(data.tahun, data.bulan - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</td>
            <td>Rp {data.gajiPokok.toLocaleString('id-ID')}</td>
            <td>Rp {data.totalTunjangan.toLocaleString('id-ID')}</td>
            <td>
              {data.totalPotongan > 0 ? (
                <span style={{ color: '#dc3545' }}>
                  - Rp {data.totalPotongan.toLocaleString('id-ID')}
                </span>
              ) : (
                'Rp 0'
              )}
            </td>
            <td>Rp {data.gajiBersih.toLocaleString('id-ID')}</td>
            <td>
              <span className={`status-badge status-${data.statusPembayaran.toLowerCase().replace(' ', '-')}`}>
                {data.statusPembayaran}
              </span>
            </td>
          </tr>
        ))
      ) : (
        <tr><td colSpan="6" className="no-data-row">Belum ada riwayat gaji untuk periode ini.</td></tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default Gaji;
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

const Gaji = ({ payrollData }) => {
  const [payableDays, setPayableDays] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Menggunakan asumsi 30 hari kalender untuk perhitungan prorata harian
  const HARI_PEMBAGI = 30;

  useEffect(() => {
    setIsLoading(true);
    fetchPayableDaysCountFromAPI()
      .then(data => {
        setPayableDays(data.payableDaysCount);
        setError(null); // Hapus error jika berhasil
      })
      .catch(err => {
        console.error("Error fetching payable days:", err.message);
        setError(err.message); // Simpan pesan error untuk ditampilkan
      })
      .finally(() => setIsLoading(false)); // Selalu set loading ke false setelah selesai
  }, []); // Dependency array kosong agar hanya berjalan sekali saat komponen dimuat

  // Membuat judul bulan dan tahun menjadi dinamis
  const bulanSekarang = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // Menghitung nilai harian untuk setiap komponen
  const gajiPokokHarian = payrollData.gajiPokok / HARI_PEMBAGI;
  const tunjanganJabatanHarian = payrollData.tunjanganJabatan / HARI_PEMBAGI;
  const tunjanganTransportHarian = payrollData.tunjanganTransport / HARI_PEMBAGI;
  const tunjanganMakanHarian = payrollData.tunjanganMakan / HARI_PEMBAGI;

  // Menghitung total estimasi pendapatan harian
  const totalPendapatanHarian = gajiPokokHarian + tunjanganJabatanHarian + tunjanganTransportHarian + tunjanganMakanHarian;

  // Menghitung total gaji yang telah terkumpul berdasarkan kehadiran
  const gajiTerkumpul = totalPendapatanHarian * payableDays;

  // Data mock untuk rekap gaji bulanan (akan diganti dengan data API di masa depan)
  const monthlyRecapData = [
    {
      bulan: 'November 2023',
      gajiPokok: 5000000,
      tunjangan: 2850000,
      potongan: 0,
      total: 7850000,
      status: 'Dibayar'
    },
    {
      bulan: 'Oktober 2023',
      gajiPokok: 5000000,
      tunjangan: 2850000,
      potongan: 150000,
      total: 7700000,
      status: 'Dibayar'
    },
    {
      bulan: 'September 2023',
      gajiPokok: 5000000,
      tunjangan: 2850000,
      potongan: 0,
      total: 7850000,
      status: 'Dibayar'
    },
    // Tambahkan data bulan sebelumnya di sini
  ];
  
  return (
    <div>
      <h1 className="page-title">Estimasi Pendapatan Harian</h1>
      
      <div className="card">
        <h2 className="card-title">Rincian Pendapatan per Hari Kerja</h2>
          
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
          {error ? (
            <span style={{ color: 'red' }}>Gagal memuat</span>
          ) : (
            <span>
              {isLoading ? 'Menghitung...' : `${payableDays} Hari`}
            </span>
          )}
        </div>

        <div className="payroll-total">
          <span>Estimasi Gaji Terkumpul:</span>
          {error ? (
            <span style={{ color: 'red' }}>Gagal menghitung</span>
          ) : (
            <span>
              {isLoading ? 'Menghitung...' : `Rp ${gajiTerkumpul.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`}
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
          <strong>Estimasi Gaji Terkumpul</strong> adalah proyeksi pendapatan berdasarkan total hari Anda diabsen (termasuk Hadir, Terlambat, Cuti, Sakit, dan Izin). Angka ini berguna untuk melihat progres Anda.
        </p>
        <p className="explanation-text">
          <strong>Rekap Gaji Bulanan</strong> adalah jumlah **gaji final dan tetap** yang Anda terima. Angka ini sudah mencakup pembayaran untuk seluruh hari dalam sebulan, termasuk hari kerja dan hari libur (akhir pekan & libur nasional), sesuai dengan kontrak kerja Anda.
        </p>
      </div>


      {/* Rekap Gaji Bulanan */}
      <div className="card">
        <h2 className="card-title">Rekap Gaji Bulanan</h2>
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
            {monthlyRecapData.map((data, index) => (
              <tr key={index}>
                <td>{data.bulan}</td>
                <td>Rp {data.gajiPokok.toLocaleString('id-ID')}</td>
                <td>Rp {data.tunjangan.toLocaleString('id-ID')}</td>
                <td>
                  {data.potongan > 0 ? 
                    <span style={{color: '#dc3545'}}>- Rp {data.potongan.toLocaleString('id-ID')}</span> : 
                    'Rp 0'
                  }
                </td>
                <td>Rp {data.total.toLocaleString('id-ID')}</td>
                <td><span className="status-hadir">{data.status}</span></td> {/* Menggunakan status-hadir sebagai badge hijau */}
              </tr>
            ))}
            {monthlyRecapData.length === 0 && (
              <tr><td colSpan="6" className="no-data-row">Belum ada riwayat gaji bulanan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Gaji;
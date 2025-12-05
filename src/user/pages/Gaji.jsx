import React from 'react';
import './gaji.css';

const Gaji = ({ payrollData, attendanceData }) => {
  // Hitung jumlah hari kerja
  const hariKerja = attendanceData.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length;
  
  // Hitung gaji per hari
  const gajiPerHari = payrollData.totalGaji / 30; // Asumsi 30 hari dalam sebulan
  
  return (
    <div>
      <h1 className="page-title">Informasi Gaji & Tunjangan</h1>
      
      <div className="card">
        <h2 className="card-title">Detail Gaji Bulan Oktober 2023</h2>
        
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
        
        <div className="payroll-item">
          <span>Bonus Kinerja:</span>
          <span>Rp {payrollData.bonus.toLocaleString('id-ID')}</span>
        </div>
        
        <div className="payroll-item">
          <span>Potongan (jika ada):</span>
          <span style={{color: '#dc3545'}}>- Rp {payrollData.potongan.toLocaleString('id-ID')}</span>
        </div>
        
        <div className="payroll-total">
          <span>Total Gaji Bersih:</span>
          <span>Rp {payrollData.totalGaji.toLocaleString('id-ID')}</span>
        </div>
      </div>
      
      <div className="card">
        <h2 className="card-title">Perhitungan Berdasarkan Kehadiran</h2>
        
        <div className="payroll-item">
          <span>Total Hari Kerja (Bulan Ini):</span>
          <span>{hariKerja} hari</span>
        </div>
        
        <div className="payroll-item">
          <span>Gaji per Hari:</span>
          <span>Rp {gajiPerHari.toLocaleString('id-ID', {maximumFractionDigits: 0})}</span>
        </div>
        
        <div className="payroll-item">
          <span>Total Gaji berdasarkan Kehadiran:</span>
          <span>Rp {(gajiPerHari * hariKerja).toLocaleString('id-ID', {maximumFractionDigits: 0})}</span>
        </div>
        
        <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px'}}>
          <p style={{marginBottom: '10px', color: '#555'}}>
            <strong>Keterangan:</strong> Perhitungan di atas berdasarkan asumsi 30 hari kerja dalam sebulan. 
            Tunjangan tetap dibayar penuh selama karyawan memiliki status aktif.
          </p>
          <p style={{color: '#777', fontSize: '0.9rem'}}>
            Gaji akan ditransfer ke rekening yang terdaftar pada tanggal 28 setiap bulan.
          </p>
        </div>
      </div>
      
      <div className="card">
        <h2 className="card-title">Riwayat Pembayaran</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Bulan</th>
              <th>Gaji Pokok</th>
              <th>Tunjangan</th>
              <th>Potongan</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>September 2023</td>
              <td>Rp 5.000.000</td>
              <td>Rp 2.850.000</td>
              <td>Rp 0</td>
              <td>Rp 7.850.000</td>
              <td><span className="status-hadir">Dibayar</span></td>
            </tr>
            <tr>
              <td>Agustus 2023</td>
              <td>Rp 5.000.000</td>
              <td>Rp 2.850.000</td>
              <td>Rp 150.000</td>
              <td>Rp 7.700.000</td>
              <td><span className="status-hadir">Dibayar</span></td>
            </tr>
            <tr>
              <td>Juli 2023</td>
              <td>Rp 5.000.000</td>
              <td>Rp 2.850.000</td>
              <td>Rp 0</td>
              <td>Rp 7.850.000</td>
              <td><span className="status-hadir">Dibayar</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Gaji;
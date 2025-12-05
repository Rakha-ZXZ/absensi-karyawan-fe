import './App.css'; // Menambahkan ekstensi .css
import Dashboard from './user/pages/Dashboard.jsx'; // Menambahkan ekstensi .jsx
import Absensi from './user/pages/Absensi.jsx'; // Menambahkan ekstensi .jsx
import Gaji from './user/pages/Gaji.jsx'; // Menambahkan ekstensi .jsx
import Profile from './user/pages/Profile.jsx'; // Menambahkan ekstensi .jsx
import Sidebar from './user/components/Sidebar.jsx'; // Menambahkan ekstensi .jsx
import EmployeeLogin from './user/pages/EmployeeLogin.jsx';

import AdminSidebar from './admin/components/AdminSidebar.jsx'; // Menambahkan ekstensi .jsx
import AdminDashboard from './admin/pages/AdminDashboard.jsx'; // Menambahkan ekstensi .jsx
import KelolaAbsensi from './admin/pages/KelolaAbsensi.jsx'; // Menambahkan ekstensi .jsx
import RekapAbsensi from './admin/pages/RekapAbsensi.jsx'; // Menambahkan ekstensi .jsx
import KelolaKaryawan from './admin/pages/KelolaKaryawan.jsx'; // Menambahkan ekstensi .jsx
import Pengaturan from './admin/pages/Pengaturan.jsx'; // Menambahkan ekstensi .jsx

import NotFoundPage from './user/pages/NotFoundPage.jsx';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Header from './user/components/Header.jsx'; // Menambahkan ekstensi .jsx
import AdminLogin from './admin/pages/Login.jsx'; // Menambahkan ekstensi .jsx

// Import komponen dan hook baru
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; // Menambahkan ekstensi .jsx
import AdminRoute from './admin/pages/AdminProtectRoute.jsx';
import EmploeeRoute from './user/pages/EmployeeProtectRoute.jsx';

import { Navigate } from 'react-router-dom';

function AppContent() {

  const location = useLocation();

  const pathsToHideLayout = ['/admin/login', '/login', '/404'];
const showLayout = !pathsToHideLayout.includes(location.pathname);

  // Cek apakah ini route admin yang BUKAN login
  const isAdminRoute = location.pathname.startsWith('/admin') && showLayout;

  // --- Data Simulasi (Pindahkan ke luar atau gunakan database nanti) ---
  const [attendanceData, setAttendanceData] = useState([]);
  const [payrollData, setPayrollData] = useState({
    gajiPokok: 5000000,
    tunjanganJabatan: 1500000,
    tunjanganTransport: 750000,
    tunjanganMakan: 600000,
    bonus: 0,
    potongan: 0,
    totalGaji: 0
  });

  const [employeeData, setEmployeeData] = useState([
    { id: 1, nama: 'Budi Santoso', jabatan: 'Frontend Developer', status: 'Aktif', tanggalBergabung: '2022-01-15', email: 'budi.santoso@example.com', password: 'password123' },
    { id: 2, nama: 'Citra Lestari', jabatan: 'Backend Developer', status: 'Aktif', tanggalBergabung: '2021-11-20', email: 'citra.lestari@example.com', password: 'password123' },
    { id: 3, nama: 'Doni Firmansyah', jabatan: 'UI/UX Designer', status: 'Aktif', tanggalBergabung: '2022-03-10', email: 'doni.firmansyah@example.com', password: 'password123' },
    { id: 4, nama: 'Eka Putri', jabatan: 'Project Manager', status: 'Cuti', tanggalBergabung: '2020-07-01', email: 'eka.putri@example.com', password: 'password123' },
    { id: 5, nama: 'Fajar Nugraha', jabatan: 'DevOps Engineer', status: 'Aktif', tanggalBergabung: '2022-08-05', email: 'fajar.nugraha@example.com', password: 'password123' },
    { id: 6, nama: 'Budi Santoso', jabatan: 'QA Engineer', status: 'Aktif', tanggalBergabung: '2023-01-20', email: 'budi.santoso.qa@example.com', password: 'password123' }, 
  ]);

  const [allAttendanceData, setAllAttendanceData] = useState([]);

  // Simulasi data absensi awal
  useEffect(() => {
    const initialAttendance = [
      { id: 1, nama: 'Budi Santoso', tanggal: '2023-10-01', jamMasuk: '08:00', jamPulang: '17:00', status: 'Hadir' }, 
      { id: 2, nama: 'Citra Lestari', tanggal: '2023-10-02', jamMasuk: '08:15', jamPulang: '17:30', status: 'Hadir' }, 
      { id: 3, nama: 'Doni Firmansyah', tanggal: '2023-10-01', jamMasuk: '08:30', jamPulang: '17:00', status: 'Terlambat' }, 
      { id: 4, nama: 'Eka Putri', tanggal: '2023-10-02', jamMasuk: '08:05', jamPulang: '16:45', status: 'Hadir' },   
    ];
    setAttendanceData(initialAttendance);
    setAllAttendanceData(initialAttendance);

    // Hitung total gaji
    const total = payrollData.gajiPokok + payrollData.tunjanganJabatan +
                  payrollData.tunjanganTransport + payrollData.tunjanganMakan +
                  payrollData.bonus - payrollData.potongan;
    setPayrollData(prev => ({...prev, totalGaji: total}));
  }, []);

  const addAttendance = (attendance) => {
    const newAttendance = {
      id: attendanceData.length + 1,
      ...attendance
    };
    setAttendanceData([...attendanceData, newAttendance]);
  };
  
  // Jika masih memuat status otentikasi, tampilkan loading screen. 
  // Catatan: Loader sudah ada di AdminRoute, tapi ini untuk route yang tidak dilindungi.
  // if (loading) {
  //   return <div className="flex justify-center items-center h-screen">Loading App...</div>;
  // }

  return (
    <div className="app">
      {/* Tampilkan sidebar Admin atau User berdasarkan peran/route saat ini */}
      {showLayout && (isAdminRoute ? <AdminSidebar /> : <Sidebar />)}
      <div className="main-content">
        {showLayout && <Header />}
        <div className={showLayout ? "content" : "content-full"}>
          <Routes>

            <Route element={<EmploeeRoute />}> 
            {/* User Routes (Asumsi Public/kurang dilindungi) */}
            <Route path="/" element={<Dashboard attendanceData={attendanceData} payrollData={payrollData} />} />
            <Route path="/dashboard" element={<Dashboard attendanceData={attendanceData} payrollData={payrollData} />} />
            <Route path="/absensi" element={<Absensi attendanceData={attendanceData} addAttendance={addAttendance} />} />
            <Route path="/gaji" element={<Gaji payrollData={payrollData} attendanceData={attendanceData} />} />
            <Route path="/profile" element={<Profile />} />
            </Route>
           
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/login" element={<EmployeeLogin />} />

            

            {/* --- PROTECTED ADMIN ROUTES menggunakan AdminRoute --- */}
            <Route element={<AdminRoute />}> 
                {/* Semua route di bawah ini hanya bisa diakses jika role == 'admin' */}
                <Route path="/admin/" element={<AdminDashboard allAttendanceData={allAttendanceData} employeeData={employeeData} />} />          
                <Route path="/admin/dashboard" element={<AdminDashboard allAttendanceData={allAttendanceData} employeeData={employeeData} />} />          
                <Route path="/admin/absensi" element={<KelolaAbsensi attendanceData={allAttendanceData} employeeData={employeeData} />} />
                <Route path="/admin/rekap-absensi" element={<RekapAbsensi allAttendanceData={allAttendanceData} employeeData={employeeData} />} />
                <Route path="/admin/karyawan" element={<KelolaKaryawan employeeData={employeeData}/>} />
                <Route path="/admin/pengaturan" element={<Pengaturan />} />
            </Route>

            <Route path="/404" element={<NotFoundPage />} /> 
            <Route path="*" element={<Navigate to="/404" replace />} />
    
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider> {/* Membungkus seluruh aplikasi dengan AuthProvider */}
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
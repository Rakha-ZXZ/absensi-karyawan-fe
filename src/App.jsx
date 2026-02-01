import './App.css'; // Menambahkan ekstensi .css
import Dashboard from './user/pages/Dashboard.jsx'; // Menambahkan ekstensi .jsx
import Absensi from './user/pages/Absensi.jsx'; // Menambahkan ekstensi .jsx
import Cuti from './user/pages/Cuti.jsx'; // Menambahkan ekstensi .jsx
import Gaji from './user/pages/Gaji.jsx'; // Menambahkan ekstensi .jsx
import Profile from './user/pages/Profile.jsx'; // Menambahkan ekstensi .jsx
import Sidebar from './user/components/Sidebar.jsx'; // Menambahkan ekstensi .jsx
import EmployeeLogin from './user/pages/EmployeeLogin.jsx';

import AdminSidebar from './admin/components/AdminSidebar.jsx'; // Menambahkan ekstensi .jsx
import AdminDashboard from './admin/pages/AdminDashboard.jsx'; // Menambahkan ekstensi .jsx
import KelolaAbsensi from './admin/pages/KelolaAbsensi.jsx'; // Menambahkan ekstensi .jsx
import RekapAbsensi from './admin/pages/RekapAbsensi.jsx'; // Menambahkan ekstensi .jsx
import KelolaCuti from './admin/pages/KelolaCuti.jsx'; // Menambahkan ekstensi .jsx
import KelolaKaryawan from './admin/pages/KelolaKaryawan.jsx'; // Menambahkan ekstensi .jsx
import Payroll from './admin/pages/Payroll.jsx'; // Import halaman Payroll baru
import Pengaturan from './admin/pages/Pengaturan.jsx'; // Menambahkan ekstensi .jsx

import NotFoundPage from './user/pages/NotFoundPage.jsx';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';
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
  const isAdminPath = location.pathname.startsWith('/admin');

  // Cek apakah ini route admin yang BUKAN login
  const isAdminRoute = isAdminPath && showLayout;

  // Jika masih memuat status otentikasi, tampilkan loading screen. 
  // Catatan: Loader sudah ada di AdminRoute, tapi ini untuk route yang tidak dilindungi.
  // if (loading) {
  //   return <div className="flex justify-center items-center h-screen">Loading App...</div>;
  // }

  return (
    <div className={`app ${isAdminPath ? 'admin-app' : 'user-app'}`}>
      {/* Tampilkan sidebar Admin atau User berdasarkan peran/route saat ini */}
      {showLayout && (isAdminRoute ? <AdminSidebar /> : <Sidebar />)}
      <div className={`main-content ${showLayout ? (isAdminRoute ? 'with-admin-sidebar' : 'with-user-sidebar') : ''}`}>
        {showLayout && <Header />}
        <div className={showLayout ? "content" : "content-full"}>
          <Routes>

            <Route element={<EmploeeRoute />}> 
            {/* User Routes (Asumsi Public/kurang dilindungi) */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/absensi" element={<Absensi />} />
            <Route path="/cuti" element={<Cuti />} />
            <Route path="/gaji" element={<Gaji />} />
            <Route path="/profile" element={<Profile />} />
            </Route>
           
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/login" element={<EmployeeLogin />} />

            

            {/* --- PROTECTED ADMIN ROUTES menggunakan AdminRoute --- */}
            <Route element={<AdminRoute />}> 
                {/* Semua route di bawah ini hanya bisa diakses jika role == 'admin' */}
                <Route path="/admin/" element={<AdminDashboard />} />          
                <Route path="/admin/dashboard" element={<AdminDashboard />} />          
                <Route path="/admin/absensi" element={<KelolaAbsensi />} />
                <Route path="/admin/rekap-absensi" element={<RekapAbsensi />} />
                <Route path="/admin/cuti" element={<KelolaCuti />} />
                <Route path="/admin/karyawan" element={<KelolaKaryawan />} />
                <Route path="/admin/penggajian" element={<Payroll />} />
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

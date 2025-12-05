import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react'; // Menggunakan ikon loader dari lucide-react

/**
 * Komponen ini melindungi route yang hanya dapat diakses oleh Admin.
 * Jika belum login atau peran bukan Admin, akan diarahkan (redirect).
 */
const AdminRoute = () => {
  const { isLoggedIn, userRole, loading } = useAuth();

  // Tampilkan loader saat pengecekan status awal sedang berlangsung
  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
            <span className="ml-3 text-lg text-gray-700">Memuat sesi...</span>
        </div>
    );
  }

  // 1. Cek apakah sudah login
  if (!isLoggedIn) {
    // Jika belum login, arahkan ke halaman login admin
    return <Navigate to="/admin/login" replace />;
  }
  
  // 2. Cek apakah perannya sesuai (otorisasi)
  if (userRole === 'admin') {
    // Jika login, tapi peran bukan admin, arahkan ke halaman utama user (atau 403)
    // Asumsi halaman utama user adalah "/"
    return <Outlet />;
    
  }

  return <Navigate to="/admin/login" replace />; 
};

export default AdminRoute;
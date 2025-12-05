import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // State untuk melacak status otentikasi
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State untuk melacak peran pengguna (admin, user)
  const [userRole, setUserRole] = useState(null);
  // State untuk melacak apakah pengecekan awal sudah selesai
  const [loading, setLoading] = useState(true); 
  
  // URL API: Asumsi backend Anda berjalan di domain yang sama atau menggunakan proxy
  const CHECK_AUTH_URL = '/api/auth/check-status'; 
  const LOGOUT_URL = '/api/auth/logout';

  /**
   * Fungsi untuk mengecek status otentikasi ke server
   * Ini akan otomatis mengirimkan JWT dari cookie HTTP-Only
   */
  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(CHECK_AUTH_URL);
      const data = await response.json();

      if (response.ok) {
        // Otentikasi Berhasil
        setIsLoggedIn(true);
        setUserRole(data.role); 
      } else {
        // Otentikasi Gagal (e.g., 401 Unauthorized)
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Gagal terhubung atau kesalahan saat verifikasi token:", error);
      setIsLoggedIn(false);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi yang dipanggil saat login berhasil
   */
  const handleLoginSuccess = async (role) => {
    // Set status login di frontend
    setIsLoggedIn(true);
    setUserRole(role);
    // Kita tidak perlu memanggil checkAuthStatus lagi, 
    // karena server sudah merespons 200 OK dengan token baru di cookie.
  };

  /**
   * Fungsi untuk logout
   */
  const handleLogout = async () => {
      try {
          // Kirim permintaan POST ke server untuk membersihkan cookie
          await fetch(LOGOUT_URL, { method: 'POST' }); 
      } catch (error) {
          console.error("Gagal mengirim permintaan logout:", error);
      } finally {
          // Bersihkan state lokal
          setIsLoggedIn(false);
          setUserRole(null);
      }
  };


  // Efek berjalan hanya sekali saat komponen pertama kali dimount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    isLoggedIn,
    userRole,
    loading,
    handleLoginSuccess,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
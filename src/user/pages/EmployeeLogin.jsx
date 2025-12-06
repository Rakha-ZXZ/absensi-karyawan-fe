import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './EmployeeLogin.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { handleLoginSuccess } = useAuth(); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset pesan error setiap kali submit

    // Validasi dasar di frontend
    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    // TODO: Ganti bagian ini dengan logika otentikasi API yang sebenarnya
    // Ini adalah simulasi pemanggilan API
    console.log('Mencoba login dengan:', { email, password });
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/employee/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login gagal');

      console.log('Login berhasil (simulasi). Mengarahkan ke dashboard...');
      handleLoginSuccess('employee'); 

      navigate('/dashboard');

    } catch (err) {
      console.error('Login gagal (simulasi):', err);      
      setError('Email atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Employee Login</h1>
        <p className="login-subtitle">Selamat datang kembali, silakan masuk.</p>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contoh@email.com" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" required />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;
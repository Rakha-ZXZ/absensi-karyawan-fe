import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Absensi from './pages/Absensi';
import Gaji from './pages/Gaji';
import Profile from './pages/Profile';
import './App.css';

function App() {
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

  // Simulasi data absensi awal
  useEffect(() => {
    const initialAttendance = [
      { id: 1, tanggal: '2023-10-01', jamMasuk: '08:00', jamPulang: '17:00', status: 'Hadir' },
      { id: 2, tanggal: '2023-10-02', jamMasuk: '08:15', jamPulang: '17:30', status: 'Hadir' },
      { id: 3, tanggal: '2023-10-03', jamMasuk: '08:05', jamPulang: '16:45', status: 'Hadir' },
    ];
    setAttendanceData(initialAttendance);
    
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

  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard attendanceData={attendanceData} payrollData={payrollData} />} />
              <Route path="/dashboard" element={<Dashboard attendanceData={attendanceData} payrollData={payrollData} />} />
              <Route path="/absensi" element={<Absensi attendanceData={attendanceData} addAttendance={addAttendance} />} />
              <Route path="/gaji" element={<Gaji payrollData={payrollData} attendanceData={attendanceData} />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
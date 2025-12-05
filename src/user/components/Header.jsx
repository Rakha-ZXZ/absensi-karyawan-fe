import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID');
  };
  
  return (
    <div className="header">
      <div className="header-left">
        <h1>Dashboard Absensi</h1>
      </div>
      <div className="header-right">
        <div className="date-time">
          <div className="date">{formatDate(currentDateTime)}</div>
          <div className="time">{formatTime(currentDateTime)}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
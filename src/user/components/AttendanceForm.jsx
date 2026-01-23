import React, { useState } from 'react';
import CameraCapture from './CameraCapture';
import './AttendanceForm.css'

const AttendanceForm = ({ onSubmit }) => {
  const [keterangan, setKeterangan] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const handleCameraCapture = (photoFile) => {
    setCapturedPhoto(photoFile);
    setPhotoPreview(URL.createObjectURL(photoFile));
    setShowCamera(false);
  };

  const handleRemovePhoto = () => {
    setCapturedPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi foto wajib
    if (!capturedPhoto) {
      alert('⚠️ Foto wajib diambil untuk melakukan absensi!');
      return;
    }
    
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5);
    const currentDate = now.toISOString().split('T')[0];
    
    // Tentukan status berdasarkan waktu
    const isLate = currentTime > '08:00';
    const status = isLate ? 'Terlambat' : 'Hadir';
    
    const attendanceData = {
      type: 'masuk',
      tanggal: currentDate,
      waktu: currentTime,
      status: status,
      keterangan: keterangan,
      photo: capturedPhoto // Tambahkan foto
    };
    
    onSubmit(attendanceData);
    setKeterangan(''); // Reset keterangan setelah submit
    setCapturedPhoto(null); // Reset foto
    setPhotoPreview(null);
  };
  
  return (
    <form onSubmit={handleSubmit} className="attendance-form">
      {/* Info Box untuk batas waktu absensi */}
      <div className="info-box-late">
        <span className="info-icon">⚠️</span>
        <p>Batas waktu absensi adalah pukul <strong>08:30</strong>. Melewati batas waktu akan dicatat sebagai <strong>Terlambat</strong>.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Foto Absensi</label>
        {!photoPreview ? (
          <button 
            type="button" 
            className="btn btn-camera"
            onClick={() => setShowCamera(true)}
          >
            📷 Ambil Foto
          </button>
        ) : (
          <div className="photo-preview-container">
            <img src={photoPreview} alt="Preview" className="photo-preview" />
            <button 
              type="button" 
              className="btn btn-remove-photo"
              onClick={handleRemovePhoto}
            >
              🗑️ Hapus Foto
            </button>
          </div>
        )}
        <p className="form-hint"><strong>* Wajib:</strong> Foto diperlukan untuk verifikasi absensi</p>
      </div>

      <div className="form-group">
        <label className="form-label">Keterangan (Opsional)</label>
        <textarea 
          className="textarea-control"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          placeholder="Masukkan keterangan jika diperlukan..."
          rows="3"
        />
      </div>
      
      <button type="submit" className="btn btn-primary">
        🕐 Catat Kehadiran
      </button>

      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </form>
  );
};

export default AttendanceForm;

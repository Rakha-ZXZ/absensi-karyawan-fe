import React, { useState } from 'react';
import CameraCapture from './CameraCapture';
import './AttendanceForm.css'

const AttendanceForm = ({ onSubmit }) => {
  const [attendanceType, setAttendanceType] = useState('masuk');
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
    
    let status = 'Hadir';
    if (attendanceType === 'masuk') {
      const isLate = currentTime > '08:00';
      status = isLate ? 'Terlambat' : 'Hadir';
    } else if (attendanceType === 'cuti') {
      status = 'Cuti';
    }
    
    const attendanceData = {
      type: attendanceType,
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
      <div className="form-group">
        <label className="form-label">Tipe Absensi</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              value="masuk"
              checked={attendanceType === 'masuk'}
              onChange={(e) => setAttendanceType(e.target.value)}
            />
            Masuk
          </label>
          <label className="radio-label">
            <input
              type="radio"
              value="cuti"
              checked={attendanceType === 'cuti'}
              onChange={(e) => setAttendanceType(e.target.value)}
            />
            Cuti
          </label>
        </div>
      </div>
      
      {/* Info Box untuk batas waktu absensi */}
      {attendanceType === 'masuk' && (
        <div className="info-box-late">
          <span className="info-icon">⚠️</span>
          <p>Batas waktu absensi adalah pukul <strong>08:30</strong>. Melewati batas waktu akan dicatat sebagai <strong>Terlambat</strong>.</p>
        </div>
      )}

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
        <label className="form-label">Keterangan {attendanceType === 'cuti' && '(wajib diisi)'}</label>
        <textarea 
          className="textarea-control"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          placeholder={
            attendanceType === 'cuti' 
              ? "Masukkan alasan cuti..." 
              : "Masukkan keterangan jika diperlukan..."
          }
          rows="3"
          required={attendanceType === 'cuti'}
        />
      </div>
      
      <button type="submit" className="btn btn-primary">
        {attendanceType === 'masuk' ? '🕐 Catat Kehadiran' : '📝 Ajukan Cuti'}
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

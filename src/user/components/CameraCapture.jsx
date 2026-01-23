import React, { useRef, useState, useEffect } from 'react';
import './CameraCapture.css';

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Gunakan kamera depan
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraReady(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      // Convert data URL to Blob
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
          stopCamera();
        });
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="camera-capture-overlay">
      <div className="camera-capture-modal">
        <div className="camera-header">
          <h3>📸 Ambil Foto Absensi</h3>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        <div className="camera-body">
          {error ? (
            <div className="camera-error">
              <p>⚠️ {error}</p>
              <button onClick={startCamera} className="retry-btn">Coba Lagi</button>
            </div>
          ) : (
            <>
              {!capturedImage ? (
                <div className="camera-preview">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="video-stream"
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  
                  {isCameraReady && (
                    <div className="camera-controls">
                      <button onClick={capturePhoto} className="capture-btn">
                        📷 Ambil Foto
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="photo-preview">
                  <img src={capturedImage} alt="Captured" className="captured-image" />
                  
                  <div className="photo-controls">
                    <button onClick={retakePhoto} className="retake-btn">
                      🔄 Ambil Ulang
                    </button>
                    <button onClick={confirmPhoto} className="confirm-btn">
                      ✓ Gunakan Foto
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;

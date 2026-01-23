import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Cuti.css";

const Cuti = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    tanggalMulai: "",
    tanggalSelesai: "",
    alasan: "",
  });
  const [fotoSurat, setFotoSurat] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leave-requests/my-requests", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setLeaveRequests(data);
      } else {
        console.error("Gagal mengambil data pengajuan cuti");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoSurat(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setFotoSurat(null);
    setFotoPreview(null);
  };

  const calculateDays = () => {
    if (formData.tanggalMulai && formData.tanggalSelesai) {
      const start = new Date(formData.tanggalMulai);
      const end = new Date(formData.tanggalSelesai);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("tanggalMulai", formData.tanggalMulai);
      formDataToSend.append("tanggalSelesai", formData.tanggalSelesai);
      formDataToSend.append("alasan", formData.alasan);
      if (fotoSurat) {
        formDataToSend.append("fotoSurat", fotoSurat);
      }

      const response = await fetch("http://localhost:5000/api/leave-requests", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ " + data.message);
        setShowForm(false);
        setFormData({ tanggalMulai: "", tanggalSelesai: "", alasan: "" });
        setFotoSurat(null);
        setFotoPreview(null);
        fetchLeaveRequests();
      } else {
        alert("❌ " + (data.message || "Gagal mengajukan cuti"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Terjadi kesalahan saat mengajukan cuti");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengajuan cuti ini?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/leave-requests/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ " + data.message);
        fetchLeaveRequests();
      } else {
        alert("❌ " + (data.message || "Gagal menghapus pengajuan"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Terjadi kesalahan");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: "badge-pending",
      Disetujui: "badge-approved",
      Ditolak: "badge-rejected",
    };
    return badges[status] || "badge-pending";
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  if (loading) {
    return <div className="cuti-container">Loading...</div>;
  }

  return (
    <div className="cuti-container">
      <div className="page-header">
        <h1>📝 Pengajuan Cuti</h1>
        <p>Kelola pengajuan cuti Anda</p>
      </div>

      <div className="cuti-actions">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "❌ Batal" : "➕ Ajukan Cuti Baru"}
        </button>
      </div>

      {showForm && (
        <div className="cuti-form-card">
          <h2>Form Pengajuan Cuti</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Tanggal Mulai Cuti *</label>
                <input
                  type="date"
                  name="tanggalMulai"
                  value={formData.tanggalMulai}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Tanggal Selesai Cuti *</label>
                <input
                  type="date"
                  name="tanggalSelesai"
                  value={formData.tanggalSelesai}
                  onChange={handleInputChange}
                  min={formData.tanggalMulai || new Date().toISOString().split("T")[0]}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {formData.tanggalMulai && formData.tanggalSelesai && (
              <div className="info-box">
                <span className="info-icon">ℹ️</span>
                <p>
                  Durasi cuti: <strong>{calculateDays()} hari</strong>
                </p>
              </div>
            )}

            <div className="form-group">
              <label>Alasan Cuti *</label>
              <textarea
                name="alasan"
                value={formData.alasan}
                onChange={handleInputChange}
                placeholder="Jelaskan alasan pengajuan cuti..."
                rows="4"
                required
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label>Surat Keterangan (Opsional)</label>
              {!fotoPreview ? (
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                    id="fotoSurat"
                  />
                  <label htmlFor="fotoSurat" className="file-label">
                    📎 Pilih File Gambar
                  </label>
                  <p className="form-hint">Format: JPG, PNG, GIF, WEBP (Max 5MB)</p>
                </div>
              ) : (
                <div className="photo-preview-container">
                  <img src={fotoPreview} alt="Preview" className="photo-preview" />
                  <button type="button" className="btn btn-remove" onClick={handleRemovePhoto}>
                    🗑️ Hapus Foto
                  </button>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Mengirim..." : "📤 Kirim Pengajuan"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="cuti-list-card">
        <h2>Riwayat Pengajuan Cuti</h2>
        {leaveRequests.length === 0 ? (
          <div className="empty-state">
            <p>📭 Belum ada pengajuan cuti</p>
          </div>
        ) : (
          <div className="cuti-list">
            {leaveRequests.map((request) => (
              <div key={request._id} className="cuti-item">
                <div className="cuti-item-header">
                  <div className="cuti-dates">
                    <span className="date-label">📅 Periode:</span>
                    <span className="date-value">
                      {formatDate(request.tanggalMulai)} - {formatDate(request.tanggalSelesai)}
                    </span>
                    <span className="days-badge">{request.jumlahHari} hari</span>
                  </div>
                  <span className={`status-badge ${getStatusBadge(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <div className="cuti-item-body">
                  <div className="cuti-detail">
                    <strong>Alasan:</strong>
                    <p>{request.alasan}</p>
                  </div>

                  {request.fotoSurat && (
                    <div className="cuti-detail">
                      <strong>Surat Keterangan:</strong>
                      <a
                        href={`http://localhost:5000${request.fotoSurat}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-view-photo"
                      >
                        📄 Lihat Surat
                      </a>
                    </div>
                  )}

                  {request.keteranganAdmin && (
                    <div className="cuti-detail admin-note">
                      <strong>Keterangan Admin:</strong>
                      <p>{request.keteranganAdmin}</p>
                    </div>
                  )}

                  {request.disetujuiOleh && (
                    <div className="cuti-meta">
                      <small>
                        {request.status === "Disetujui" ? "Disetujui" : "Ditolak"} oleh:{" "}
                        {request.disetujuiOleh.nama} pada {formatDate(request.tanggalDisetujui)}
                      </small>
                    </div>
                  )}
                </div>

                {request.status === "Pending" && (
                  <div className="cuti-item-actions">
                    <button className="btn btn-danger-sm" onClick={() => handleDelete(request._id)}>
                      🗑️ Hapus
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cuti;

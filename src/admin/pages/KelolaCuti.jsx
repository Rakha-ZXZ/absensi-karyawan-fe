import React, { useState, useEffect } from "react";
import "./KelolaCuti.css";

const KelolaCuti = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(""); // "approve" or "reject"
  const [keteranganAdmin, setKeteranganAdmin] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, [filterStatus]);

  const fetchLeaveRequests = async () => {
    try {
      const url = `http://localhost:5000/api/leave-requests/all${
        filterStatus !== "Semua" ? `?status=${filterStatus}` : ""
      }`;

      const response = await fetch(url, {
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

  const handleOpenModal = (request, action) => {
    setSelectedRequest(request);
    setModalAction(action);
    setKeteranganAdmin("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setModalAction("");
    setKeteranganAdmin("");
  };

  const handleSubmitAction = async () => {
    if (!selectedRequest) return;

    setProcessing(true);

    try {
      const endpoint =
        modalAction === "approve"
          ? `http://localhost:5000/api/leave-requests/${selectedRequest._id}/approve`
          : `http://localhost:5000/api/leave-requests/${selectedRequest._id}/reject`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ keteranganAdmin }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ " + data.message);
        handleCloseModal();
        fetchLeaveRequests();
      } else {
        alert("❌ " + (data.message || "Gagal memproses pengajuan"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Terjadi kesalahan");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (request) => {
    const confirmMessage = request.status === "Disetujui"
      ? `Apakah Anda yakin ingin menghapus pengajuan cuti ${request.employeeId?.nama}?\n\nPeringatan: Catatan absensi cuti yang sudah dibuat juga akan dihapus!`
      : `Apakah Anda yakin ingin menghapus pengajuan cuti ${request.employeeId?.nama}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/leave-requests/${request._id}`, {
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

  const getStatistics = () => {
    return {
      total: leaveRequests.length,
      pending: leaveRequests.filter((r) => r.status === "Pending").length,
      approved: leaveRequests.filter((r) => r.status === "Disetujui").length,
      rejected: leaveRequests.filter((r) => r.status === "Ditolak").length,
    };
  };

  const stats = getStatistics();

  if (loading) {
    return <div className="kelola-cuti-container">Loading...</div>;
  }

  return (
    <div className="kelola-cuti-container">
      <div className="page-header">
        <h1>📝 Kelola Pengajuan Cuti</h1>
        <p>Kelola dan setujui pengajuan cuti karyawan</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Pengajuan</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Menunggu</p>
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.approved}</h3>
            <p>Disetujui</p>
          </div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{stats.rejected}</h3>
            <p>Ditolak</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-section">
        <label>Filter Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="Semua">Semua</option>
          <option value="Pending">Pending</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
        </select>
      </div>

      {/* Leave Requests Table */}
      <div className="table-card">
        <h2>Daftar Pengajuan Cuti</h2>
        {leaveRequests.length === 0 ? (
          <div className="empty-state">
            <p>📭 Tidak ada pengajuan cuti</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Karyawan</th>
                  <th>Periode Cuti</th>
                  <th>Durasi</th>
                  <th>Alasan</th>
                  <th>Surat</th>
                  <th>Status</th>
                  <th>Tanggal Pengajuan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request) => (
                  <tr key={request._id}>
                    <td>
                      <div className="employee-info">
                        <strong>{request.employeeId?.nama || "N/A"}</strong>
                        <small>{request.employeeId?.employeeId || "N/A"}</small>
                      </div>
                    </td>
                    <td>
                      <div className="date-range">
                        {formatDate(request.tanggalMulai)}
                        <br />
                        <small>s/d</small>
                        <br />
                        {formatDate(request.tanggalSelesai)}
                      </div>
                    </td>
                    <td>
                      <span className="days-badge">{request.jumlahHari} hari</span>
                    </td>
                    <td>
                      <div className="reason-cell">{request.alasan}</div>
                    </td>
                    <td>
                      {request.fotoSurat ? (
                        <a
                          href={`http://localhost:5000${request.fotoSurat}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-view"
                        >
                          📄 Lihat
                        </a>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadge(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>{formatDate(request.createdAt)}</td>
                    <td>
                      {request.status === "Pending" ? (
                        <div className="action-buttons">
                          <button
                            className="btn-approve"
                            onClick={() => handleOpenModal(request, "approve")}
                          >
                            ✅ Setujui
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleOpenModal(request, "reject")}
                          >
                            ❌ Tolak
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(request)}
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <div className="processed-info">
                            <small>
                              {request.disetujuiOleh?.nama || "Admin"}
                              <br />
                              {formatDate(request.tanggalDisetujui)}
                            </small>
                          </div>
                          <button
                            className="btn-delete-small"
                            onClick={() => handleDelete(request)}
                            title="Hapus pengajuan cuti"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalAction === "approve" ? "✅ Setujui Pengajuan Cuti" : "❌ Tolak Pengajuan Cuti"}
              </h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="request-detail">
                <div className="detail-row">
                  <strong>Karyawan:</strong>
                  <span>{selectedRequest.employeeId?.nama}</span>
                </div>
                <div className="detail-row">
                  <strong>Periode:</strong>
                  <span>
                    {formatDate(selectedRequest.tanggalMulai)} - {formatDate(selectedRequest.tanggalSelesai)}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Durasi:</strong>
                  <span>{selectedRequest.jumlahHari} hari</span>
                </div>
                <div className="detail-row">
                  <strong>Alasan:</strong>
                  <span>{selectedRequest.alasan}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Keterangan Admin {modalAction === "approve" ? "(Opsional)" : "*"}</label>
                <textarea
                  value={keteranganAdmin}
                  onChange={(e) => setKeteranganAdmin(e.target.value)}
                  placeholder={
                    modalAction === "approve"
                      ? "Tambahkan catatan jika diperlukan..."
                      : "Jelaskan alasan penolakan..."
                  }
                  rows="4"
                  className="form-textarea"
                  required={modalAction === "reject"}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseModal} disabled={processing}>
                Batal
              </button>
              <button
                className={modalAction === "approve" ? "btn btn-approve" : "btn btn-reject"}
                onClick={handleSubmitAction}
                disabled={processing || (modalAction === "reject" && !keteranganAdmin)}
              >
                {processing
                  ? "Memproses..."
                  : modalAction === "approve"
                  ? "✅ Setujui"
                  : "❌ Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaCuti;

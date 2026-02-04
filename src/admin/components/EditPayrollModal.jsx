import React, { useState, useEffect } from 'react';
import './EditPayrollModal.css';

const EditPayrollModal = ({ show, onClose, onSave, payrollData }) => {
  const [formData, setFormData] = useState({
    potonganLain: 0,
    statusPembayaran: 'Belum Dibayar',
  });
  const [error, setError] = useState('');
  const currencyFields = new Set(['potonganLain']);

  const formatNumberInput = (value) => {
    if (value === null || value === undefined) return '';
    const digits = String(value).replace(/\D/g, '');
    if (!digits) return '';
    return new Intl.NumberFormat('id-ID').format(Number(digits));
  };

  // Populate form when payrollData prop changes
  useEffect(() => {
    if (payrollData) {
      setFormData({
        potonganLain: payrollData.potonganLain ? String(payrollData.potonganLain) : '',
        statusPembayaran: payrollData.statusPembayaran || 'Belum Dibayar',
      });
    }
  }, [payrollData]);

  if (!show) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (currencyFields.has(name)) {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // The onSave function will handle the API call.
    // We pass the payroll ID and the updated form data.
    const payload = {
      ...formData,
      potonganLain: Number(formData.potonganLain) || 0,
    };
    onSave(payrollData._id, payload);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Gaji: {payrollData?.employeeId?.nama}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <p className="error-message">{error}</p>}
          
          <div className="info-display">
            <div className="info-item">
              <span>Pendapatan Kotor:</span>
              <strong>{formatCurrency(payrollData.pendapatanKotor)}</strong>
            </div>
            <div className="info-item">
              <span>Potongan Otomatis (Absensi & Cuti):</span>
              <strong>{formatCurrency(payrollData.potonganAbsensi)}</strong>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="potonganLain">Potongan Manual (Kasbon, dll)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="potonganLain"
              name="potonganLain"
              className="form-input"
              value={formatNumberInput(formData.potonganLain)}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="statusPembayaran">Status Pembayaran</label>
            <select
              id="statusPembayaran"
              name="statusPembayaran"
              className="form-input"
              value={formData.statusPembayaran}
              onChange={handleChange}
            >
              <option value="Belum Dibayar">Belum Dibayar</option>
              <option value="Diproses">Diproses</option>
              <option value="Dibayar">Dibayar</option>
            </select>
          </div>

          <div className="summary-display">
            <div className="summary-item">
              <span>Total Potongan:</span>
              <strong>{formatCurrency((payrollData.potonganAbsensi || 0) + Number(formData.potonganLain || 0))}</strong>
            </div>
            <div className="summary-item total">
              <span>Gaji Bersih (Estimasi):</span>
              <strong>{formatCurrency(payrollData.pendapatanKotor - ((payrollData.potonganAbsensi || 0) + Number(formData.potonganLain || 0)))}</strong>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-save">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPayrollModal;

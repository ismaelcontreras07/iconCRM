// src/pages/Facturacion.jsx
import React, { useState, useEffect, useCallback } from 'react';
import SalesForm       from '../components/SalesForm';
import SalesList       from '../components/SalesList';
import ComplementForm  from '../components/ComplementForm';
import SummaryBoxes    from '../components/SummaryBoxes';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Facturacion.css';
import MonthlyInvoicesModal from '../components/MonthlyInvoicesModal';

export default function Facturacion() {
  const navigate = useNavigate();
  const [showForm, setShowForm]                 = useState(false);
  const [showComplementForm, setShowComplementForm] = useState(false);
  const [refreshKey, setRefreshKey]             = useState(0);
  const [summary, setSummary]                   = useState(null);
  const [detailModal, setDetailModal]           = useState(null);

  // 1) Carga inicial o recarga del summary
  useEffect(() => {
    fetch('/api/sales/summary.php', { credentials: 'include' })
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setSummary(json);
        } else {
          console.error('Error summary:', json.message);
        }
      })
      .catch(err => console.error('Fetch summary error:', err));
  }, [refreshKey]);

  // 2) Ajusta summary en memoria tras cambios de estatus
  const onSummaryDelta = useCallback(({ category, oldStatus, newStatus, amount }) => {
    setSummary(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [oldStatus]: prev[category][oldStatus] - amount,
          [newStatus]: prev[category][newStatus] + amount
        }
      };
    });
  }, []);

  // 3) Cuando creas venta, cierras form y refrescas
  const handleCreate = useCallback(() => {
    setShowForm(false);
    setRefreshKey(k => k + 1);
  }, []);

  // 4) Cuando creas complemento, cierras form y refrescas
  const handleCreateComplement = useCallback(() => {
    setShowComplementForm(false);
    setRefreshKey(k => k + 1);
  }, []);

  // 5) Abre modal mensual
  const openMonthlyModal = (month, type) => {
    fetch(`/api/sales/monthlyInvoices.php?month=${month}&type=${type}`, { credentials:'include' })
      .then(r => r.json())
      .then(json => {
        if (!json.success) throw new Error(json.message);
        setDetailModal({ month, type, invoices: json.invoices });
      })
      .catch(err => {
        console.error('Error al cargar facturas mensuales:', err);
        alert(err.message);
      });
  };

  return (
    <main>
      <header>
        <div className="header-container">
          <h1 className='page-title'>Facturación</h1>
        </div>
      </header>

      <SummaryBoxes data={summary} />

      <div className="btn-container">
        <button className="btn" onClick={() => setShowForm(f => !f)}>
          + Nueva Venta
        </button>
        <button className="btn" onClick={() => navigate('/facturacion/detalle')}>
          Ver detalle
        </button>
        <button className="btn" onClick={() => setShowComplementForm(c => !c)}>
          + Complemento
        </button>
      </div>

      {showForm && (
        <SalesForm
          onCancel={() => setShowForm(false)}
          onCreate={handleCreate}
        />
      )}

      {showComplementForm && (
        <ComplementForm
          onCancel={() => setShowComplementForm(false)}
          onCreate={handleCreateComplement}
        />
      )}

      <div className="sales-container">
        <div className="sales-content">
          <SalesList
            key={refreshKey}
            onStatusChange={onSummaryDelta}
          />
        </div>
      </div>

      {detailModal && (
        <MonthlyInvoicesModal
          detailModal={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}
    </main>
  );
}

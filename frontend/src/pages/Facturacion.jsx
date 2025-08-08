// src/pages/Facturacion.jsx
import React, { useState, useEffect, useCallback } from 'react';
import SalesForm    from '../components/SalesForm';
import SalesList    from '../components/SalesList';
import SummaryBoxes from '../components/SummaryBoxes';
import '../assets/css/Facturacion.css';

export default function Facturacion() {
  const [showForm, setShowForm]     = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [summary, setSummary]       = useState(null);

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

  // 2) Aplica un delta al summary en memoria
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

  // 3) Al crear una venta, ocultar form y forzar recarga
  const handleCreate = useCallback(() => {
    setShowForm(false);
    setRefreshKey(k => k + 1);
  }, []);

  return (
    <main>
      <header>
        <h1 className="page-title">Facturación</h1>
      </header>

      {/* 4) Aquí pasamos el summary como prop */}
      <SummaryBoxes data={summary} />

      <div className="btn-container">
        <button className="btn" onClick={() => setShowForm(f => !f)}>
          + Nueva Venta
        </button>
      </div>

      {showForm && (
        <SalesForm
          onCancel={() => setShowForm(false)}
          onCreate={handleCreate}
        />
      )}

      <div className="sales-container">
        <div className="sales-content">          
        {/* 5) Le pasamos onStatusChange para que las cards invoquen el delta */}
        <SalesList
          key={refreshKey}
          onStatusChange={onSummaryDelta}
        />
        </div>
      </div>
    </main>
  );
}

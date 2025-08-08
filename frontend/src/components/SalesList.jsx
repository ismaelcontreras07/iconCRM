// src/components/SalesList.jsx
import React, { useState, useEffect, useCallback } from 'react'
import SaleCard       from './SaleCard'
import ComplementCard from './ComplementCard'
import '../assets/css/SalesList.css'

export default function SalesList({ onStatusChange }) {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setLoading(true);
    fetch('/api/sales/listSales.php', { credentials: 'include' })
      .then(res => res.json())
      .then(json => {
        if (!json.success) throw new Error(json.message || 'Error en listado');
  
        const combined = [
          ...json.sales.map(s => ({
            type: 'sale',
            data: s,
            // para conveniencia podríamos guardar también el número:
            num: parseInt(s.customer_invoice.invoice_number.replace(/\D/g, ''), 10)
          })),
          ...json.complements.map(c => ({
            type: 'complement',
            data: c,
            num: parseInt(c.invoice_number.replace(/\D/g, ''), 10)
          }))
        ];
  
        // Orden descendente por num (el mayor arriba)
        combined.sort((a, b) => b.num - a.num);
  
        setItems(combined);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar los registros');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshKey]);
  

  const handleDeleted = useCallback(() => {
    setRefreshKey(k => k + 1)
  }, [])

  if (loading) return <p>Cargando registros…</p>
  if (error)   return <p className="error">{error}</p>

  return (
    <div className="sales-list-container">
      {items.length > 0
        ? items.map(item =>
            item.type === 'sale'
              ? (
                <SaleCard
                  key={`sale-${item.data.sale_id}`}
                  sale={item.data}
                  onStatusChange={onStatusChange}
                  onDeleted={handleDeleted}
                />
              ) : (
                <ComplementCard
                  key={`comp-${item.data.id}`}
                  complement={item.data}
                  onDeleted={handleDeleted}
                />
              )
          )
        : <p>No hay registros.</p>
      }
    </div>
  )
}

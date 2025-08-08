import React, { useState, useEffect, useCallback } from 'react'
import SaleCard from './SaleCard'
import '../assets/css/SalesList.css'

export default function SalesList({ onStatusChange }) {
  const [sales, setSales]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  // Carga inicial
  useEffect(() => {
    fetch('/api/sales/listSales.php', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (!json.success) throw new Error(json.message || 'Error en respuesta')
        setSales(json.data)
      })
      .catch(err => {
        console.error(err)
        setError('No se pudieron cargar las ventas')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Cargando ventas…</p>
  if (error)   return <p className="error">{error}</p>

  return (
    <div className="sales-list-container">
      {sales.length
        ? sales.map(sale => (
<SaleCard
  key={sale.sale_id}
  sale={sale}
  onStatusChange={onStatusChange}
  onDeleted={() => setRefreshKey(k => k + 1)}
/>
          ))
        : <p>No hay ventas registradas.</p>
      }
    </div>
  )
}

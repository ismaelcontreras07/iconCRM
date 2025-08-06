// src/components/SalesList.jsx
import React, { useState, useEffect } from 'react'
import SaleCard from './SaleCard'
import '../assets/css/SalesList.css'

export default function SalesList() {
  const [sales, setSales]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    fetch('/api/sales/listSales.php', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (!json.success) throw new Error(json.message || 'Error en respuesta')
        // Aquí usamos json.data (no json.sales)
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
            // Nota que la clave es sale.sale_id
            <SaleCard key={sale.sale_id} sale={sale} />
          ))
        : <p>No hay ventas registradas.</p>
      }
    </div>
  )
}

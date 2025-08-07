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

        // Orden descendente por número de factura (numérico)
        const sorted = (json.data || []).sort((a, b) => {
          const invA = a.customer_invoice.invoice_number
          const invB = b.customer_invoice.invoice_number
          // localeCompare con opción numeric:true para comparar "100">"20"
          return invB.localeCompare(invA, undefined, { numeric: true })
        })

        setSales(sorted)
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
      {sales.length > 0 ? (
        sales.map(sale => (
          <SaleCard key={sale.sale_id} sale={sale} />
        ))
      ) : (
        <p>No hay ventas registradas.</p>
      )}
    </div>
  )
}

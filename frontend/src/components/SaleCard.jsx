// src/components/SaleCard.jsx
import React, { useState } from 'react'
import '../assets/css/SaleCard.css'

const STATUS_OPTIONS = ['pendiente','vencido','pagado']

export default function SaleCard({ sale, onUpdated, onDeleted }) {
  const { sale_id, sale_date, project, description } = sale
  // guardamos en estado local para que el <select> re-renderice inmediatamente
  const [providers, setProviders]     = useState(sale.provider_invoices)
  const [customerInvoice, setCustomerInvoice] = useState(sale.customer_invoice)

  const [expanded, setExpanded]     = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [reason, setReason]         = useState('')
  const [replacementInv, setReplacementInv] = useState('')

  function formatDDMMYYYY(fecha) {
    const d = new Date(fecha);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear();
    return `${dd}/${mm}/${yy}`;
  }
  
  function formatDDMMYYYY(fechaISO) {
    const [year, month, day] = fechaISO.split('-');
    return `${day}/${month}/${year}`;
  }
  
  const saleDate = formatDDMMYYYY(sale_date);
  

    // update handlers
    const updateProviderStatus = async (provId, newStatus) => {
      const res = await fetch('/api/provider_invoices/updateStatus.php', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ id: provId, status: newStatus })
      }).then(r => r.json())
      if (res.success) {
        // actualizo el estado local
        setProviders(provs =>
          provs.map(p => p.id === provId ? { ...p, status: newStatus } : p)
        )
        onUpdated?.()
      }
      else alert(res.message)
    }
  
    const updateCustomerStatus = async newStatus => {
      const res = await fetch('/api/customer_invoices/updateStatus.php', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ id: customerInvoice.invoice_id, status: newStatus })
      }).then(r => r.json())
      if (res.success) {
        // actualizo el estado local
        setCustomerInvoice({ ...customerInvoice, status: newStatus })
        onUpdated?.()
      }
      else alert(res.message)
    }

  const softReplace = async () => {
    if (!reason.trim() || !replacementInv.trim()) {
      return alert('Debe indicar motivo y nº de factura de reemplazo.')
    }
    const res = await fetch('/api/sales/softReplaceSale.php', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        sale_id,
        replace_reason: reason,
        replace_invoice: replacementInv
      })
    }).then(r => r.json())
    if (res.success) {
      setShowActions(false)
      onUpdated?.()
    } else {
      alert(res.message)
    }
  }

  const hardDelete = async () => {
    if (!window.confirm('¿Eliminar definitivamente esta venta?')) return
    const res = await fetch('/api/sales/deleteSale.php', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ sale_id })
    }).then(r => r.json())
    if (res.success) {
      onDeleted?.()
    } else {
      alert(res.message)
    }
  }

  return (
    <div className="sale-card">
      <header className="sale-card-header">
        <div className="sale-header-main">
          <h2 className="sale-title">Venta {customerInvoice.invoice_number}</h2>
          <p className="sale-date">
            <small>{saleDate}</small>
          </p>
        </div>
        <div className="sale-header-actions">
          <button
            className="btn-toggle-details"
            onClick={() => setExpanded(e => !e)}
            aria-label="Toggle detalles"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M480-360 280-560h400L480-360Z"/></svg>
          </button>
          <button
            className="btn-actions"
            onClick={() => setShowActions(a => !a)}
          >
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/></svg>
          </button>
        </div>
      </header>

      <div className="sale-extra">
        {project && <p className="sale-extra-item"><strong>Proyecto:</strong> {project}</p>}
        {description && <p className="sale-extra-item"><strong>Descripción:</strong> {description}</p>}
      </div>

      <div className={`sale-card-body ${expanded ? 'is-expanded' : ''}`}>
      <section className="provider-section">
          <h3>Proveedores</h3>
          {providers.length === 0 ? (
            <p className="empty">Sin facturas de proveedor</p>
          ) : providers.map(pi => (
            <div key={pi.id} className="provider-invoice">
              <p><strong>#{pi.invoice_number}</strong> — {pi.business_name}</p>
              <p>Subtotal: ${pi.subtotal.toFixed(2)}</p>
              <p>Total: ${pi.total.toFixed(2)}</p>
              <p>Vence: {new Date(pi.due_date).toLocaleDateString()}</p>
              <label>
                Estatus:
                <select
                  value={pi.status}
                  onChange={e => updateProviderStatus(pi.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </section>

        <section className="client-section">
          <h3>Cliente</h3>
          {customerInvoice ? (
            <div className="client-invoice">
              <p><strong>#{customerInvoice.invoice_number}</strong> — {customerInvoice.business_name}</p>
              <p>Subtotal: ${customerInvoice.subtotal.toFixed(2)}</p>
              <p>Total: ${customerInvoice.total.toFixed(2)}</p>
              <p>Utilidad: ${customerInvoice.net_profit.toFixed(2)} ({customerInvoice.profit_pct.toFixed(2)}%)</p>
              <p>Vence: {new Date(customerInvoice.due_date).toLocaleDateString()}</p>
              <label>
                Estatus:
                <select
                  value={customerInvoice.status}
                  onChange={e => updateCustomerStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
          ) : (
            <p className="empty">Sin factura de cliente</p>
          )}
        </section>
      </div>

      {showActions && (
        <div className="action-card">
          <div className="card-content">
            <p className="card-heading">¿Qué deseas hacer?</p>
            <p className="card-description">
              “Reemplazar” marca esta venta como reemplazada;<br/>
              “Borrar” la elimina definitivamente.
            </p>
            <div className="card-button-wrapper">
              <button
                className="card-button secondary"
                onClick={() => setShowActions(false)}
              >
                Cancelar
              </button>
              <button
                className="card-button primary"
                onClick={softReplace}
              >
                Reemplazar
              </button>
              <button
                className="card-button primary"
                onClick={hardDelete}
              >
                Borrar
              </button>
            </div>
            <div className="replace-inputs">
              <label>
                Motivo de cancelación
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </label>
              <label>
                Factura de reemplazo
                <input
                  type="text"
                  value={replacementInv}
                  onChange={e => setReplacementInv(e.target.value)}
                />
              </label>
            </div>
          </div>
          <button
            className="exit-button"
            onClick={() => setShowActions(false)}
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  )
}

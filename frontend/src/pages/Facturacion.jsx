// src/pages/Facturacion.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Facturacion() {
  const navigate = useNavigate();

  return (
    <main>
      <div className="facturacion-page" style={{ padding: '1.5rem' }}>
      <header>
        <div className="header-container">
        <h1 className='page-title'>Facturación</h1>
        </div>
      </header>
    </div>
    </main>
  );
}

// src/pages/Catalog.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Catalog() {
  const navigate = useNavigate();

  return (
    <main>
      <div className="catalog-page" style={{ padding: '1.5rem' }}>
      <header>
        <div className="header-container">
        <h1 className='page-title'>Catalogo</h1>
        </div>
      </header>
    </div>
    </main>
  );
}

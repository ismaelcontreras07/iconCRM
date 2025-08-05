// src/pages/Activities.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Activities() {
  const navigate = useNavigate();

  return (
    <main>
      <div className="activities-page" style={{ padding: '1.5rem' }}>
      <header>
        <div className="header-container">
        <h1 className='page-title'>Actividades</h1>
        </div>
      </header>
    </div>
    </main>
  );
}

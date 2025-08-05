// src/pages/Accounts.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Accounts() {
  const navigate = useNavigate();

  return (
    <main>
      <div className="accounts-page" style={{ padding: '1.5rem' }}>
      <header>
        <div className="header-container">
        <h1 className='page-title'>Cuentas</h1>
        </div>
      </header>
    </div>
    </main>
  );
}

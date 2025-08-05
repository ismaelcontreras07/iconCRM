// src/pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <main>
      <div className="dashboard-page" style={{ padding: '1.5rem' }}>
      <header>
        <div className="header-container">
        <h1 className='page-title'>Dashboard</h1>
        </div>
      </header>
    </div>
    </main>
  );
}

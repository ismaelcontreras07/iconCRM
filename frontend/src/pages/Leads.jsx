// Leads.jsx// src/pages/Leads.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TableLeads from '../components/TableLeads';

export default function Leads() {
  const navigate = useNavigate();

  return (
    <main>
      <div className="leads-page" style={{ padding: '1.5rem' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}
      >
        <h1 style={{ margin: 0 }}>Leads</h1>
        <button
          onClick={() => navigate('/leads/new')}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          + Nuevo Lead
        </button>
      </header>

      <TableLeads />


    </div>
    </main>
  );
}

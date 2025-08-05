// src/pages/Dashboard.jsx
import React, { useContext, useState } from 'react';
import LogoutButton from '../components/LogoutButton';

export default function Dashboard() {


  return (
    <main>
        <div className="dashboard-container" style={{ padding: '2rem' }}>
        <header
          className="dashboard-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}
        >
          <h1 style={{ margin: 0 }}>Panel de Control</h1>
          <LogoutButton />
        </header>

        {/* Aquí puedes añadir el contenido de tu dashboard */}
        <section>
          <p>¡Bienvenido al CRM, aquí verás tus estadísticas y accesos rápidos!</p>
          {/* ... */}
        </section>
      </div>
    </main>
  );
}

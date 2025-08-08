import React, { useContext } from 'react';
import { AuthContext }             from '../context/AuthContext';
import CommissionsCard             from '../components/CommissionsCard';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <main className="dashboard-page">
      <header className="header-container">
        <h1 className="page-title">Dashboard</h1>
        <p className="welcome">¡Hola, {user.name}!</p>
      </header>

      <section className="dashboard-content">
        <CommissionsCard />
        {/* aquí luego podrías añadir más cards */}
      </section>
    </main>
  );
}

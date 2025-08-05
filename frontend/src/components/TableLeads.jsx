// src/components/TableLeads.jsx
import React, { useState, useEffect } from 'react';

export default function TableLeads() {
  const [leads, setLeads]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    fetch('/api/leads/listLeads.php', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar leads');
        return res.json();
      })
      .then(data => {
        setLeads(data.leads || []);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar los leads');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando leads…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <main>
    <table className="leads-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Empresa</th>
          <th>Puesto</th>
          <th>País</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Estado</th>
          <th>Creado</th>
        </tr>
      </thead>
      <tbody>
        {leads.map(lead => (
          <tr key={lead.id}>
            <td>{lead.id}</td>
            <td>{lead.first_name}</td>
            <td>{lead.last_name}</td>
            <td>{lead.company}</td>
            <td>{lead.position}</td>
            <td>{lead.country}</td>
            <td>{lead.email}</td>
            <td>{lead.phone}</td>
            <td>{lead.status.replace('_', ' ')}</td>
            <td>{new Date(lead.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </main>
  );
}

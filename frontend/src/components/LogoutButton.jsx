// src/components/LogoutButton.jsx
import React, { useState, useContext } from 'react';
import { useNavigate }                 from 'react-router-dom';
import { AuthContext }                 from '../context/AuthContext';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  // desestructura el logout del contexto
  const { logout }            = useContext(AuthContext);
  const navigate              = useNavigate();

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    await logout();               // borra sesión en PHP y React
    setLoading(false);
    navigate('/', { replace: true });
  };

  return (
    <button onClick={handleLogout} disabled={loading}>
      {loading ? 'Cerrando sesión…' : 'Cerrar sesión'}
    </button>
  );
}

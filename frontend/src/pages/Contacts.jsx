// src/pages/Contacts.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contacts() {
  const navigate = useNavigate();

  return (
    <main>
      <div className="contacts-page" style={{ padding: '1.5rem' }}>
      <header>
        <div className="header-container">
        <h1 className='page-title'>Contactos</h1>
        </div>
      </header>
    </div>
    </main>
  );
}

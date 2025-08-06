// src/pages/Activities.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivitiesForm from '../components/ActivitiesForm';


export default function Activities() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  return (
    <main>
      <div className="activities-page" style={{ padding: '1.5rem' }}>
      <header>
        <div className="header-container">
        <h1 className='page-title'>Actividades</h1>
        </div>
      </header>

      <div className="btn-container">
      <button
        onClick={() => setShowForm(true)}
        className="btn"
      >
        + Nueva Actividad
      </button>
      </div>

      {showForm ? (
        <ActivitiesForm
          onCancel={() => setShowForm(false)}
        />
      ) : null}
    </div>
    </main>
  );
}

// src/pages/Facturacion.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SalesForm from '../components/SalesForm';
import SalesList from '../components/SalesList';
import '../assets/css/Facturacion.css'

export default function Accounts() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  return (
    <main>
      <header>
        <div className="header-container">
        <h1 className='page-title'>Facturación</h1>
        </div>
      </header>

        <div className="btn-container">
        <button
                onClick={() => setShowForm(prev => !prev)}
                className="btn"
              >
                + Nueva Venta
              </button>
              </div>      
              {showForm ? (
                <SalesForm
                  onCancel={() => setShowForm(false)}
                  requiredFields={[ // Add required field names here, e.g., 'first_name', 'email'
                    // 'first_name',
                    // 'email',
                    // Add more required fields as needed
                  ]}
                />
              ) : null}  
          <div className="sales-container">
          <SalesList />
          </div>
    </main>
  );
}

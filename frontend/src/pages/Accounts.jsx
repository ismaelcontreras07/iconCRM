// src/pages/Accounts.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EntityForm from '../components/EntityForm';
import TableAccounts from '../components/TableAccounts';

export default function Accounts() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  return (
    <main>
      <header>
        <div className="header-container">
        <h1 className='page-title'>Cuentas</h1>
        </div>
      </header>

        <div className="btn-container">
        <button
                onClick={() => setShowForm(prev => !prev)}
                className="btn"
              >
                + Nueva Cuenta
              </button>
              </div>      
              {showForm ? (
                <EntityForm
                  entity="accounts"
                  onCancel={() => setShowForm(false)}
                  requiredFields={[ // Add required field names here, e.g., 'first_name', 'email'
                    // 'first_name',
                    // 'email',
                    // Add more required fields as needed
                  ]}
                />
              ) : null}  
            <div className="table-accounts">
              <TableAccounts />
            </div>
    </main>
  );
}

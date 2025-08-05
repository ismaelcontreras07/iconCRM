// src/components/EntityForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/EntityForm.css';

// Configuración de campos por entidad
const fieldConfigs = {
  leads: [
    { name: 'first_name', label: 'Nombre', type: 'text', required: true },
    { name: 'last_name',  label: 'Apellido', type: 'text', required: true },
    { name: 'company',    label: 'Empresa',  type: 'text' },
    { name: 'position',   label: 'Puesto',   type: 'text' },
    { name: 'country',    label: 'País',     type: 'text' },
    { name: 'email',      label: 'Email',    type: 'email', required: true },
    { name: 'phone',      label: 'Teléfono', type: 'text' },
    { name: 'status',     label: 'Estado',   type: 'select', options: [
        { value: 'interesado', label: 'Interesado' },
        { value: 'aplazados',   label: 'Aplazados'   },
        { value: 'en_curso',    label: 'En curso'    },
        { value: 'completado',  label: 'Completado'  }
      ]
    }
  ],
  accounts: [
    { name: 'name',        label: 'Nombre de la cuenta', type: 'text', required: true },
    { name: 'industry',    label: 'Industria',           type: 'text' },
    { name: 'website',     label: 'Sitio web',           type: 'url'  },
    { name: 'phone',       label: 'Teléfono',            type: 'text' },
    { name: 'email',       label: 'Email',               type: 'email' },
    { name: 'address',     label: 'Dirección',           type: 'text' },
    { name: 'city',        label: 'Ciudad',              type: 'text' },
    { name: 'state',       label: 'Estado',              type: 'text' },
    { name: 'country',     label: 'País',                type: 'text' },
    { name: 'postal_code', label: 'Código Postal',       type: 'text' }
  ],
  contacts: [
    { name: 'account_id',  label: 'ID de Cuenta',        type: 'number', required: true },
    { name: 'first_name',  label: 'Nombre',              type: 'text',   required: true },
    { name: 'last_name',   label: 'Apellido',            type: 'text',   required: true },
    { name: 'title',       label: 'Cargo',               type: 'text' },
    { name: 'department',  label: 'Departamento',        type: 'text' },
    { name: 'email',       label: 'Email',               type: 'email' },
    { name: 'phone',       label: 'Teléfono',            type: 'text' },
    { name: 'mobile',      label: 'Móvil',               type: 'text' },
    { name: 'lead_source', label: 'Fuente del Lead',     type: 'text' }
  ]
};

// Mapeo de archivos PHP por entidad
const endpointMap = {
  leads:    'leads/createLeads.php',
  accounts: 'accounts/createAccounts.php',
  contacts: 'contacts/createContacts.php'
};

/**
 * EntityForm component
 * @param {{
 *   entity: 'leads'|'accounts'|'contacts',
 *   requiredFields?: string[],
 *   onCancel?: () => void
 * }} props
 */
export default function EntityForm({ entity, requiredFields = [], onCancel }) {
  const config   = fieldConfigs[entity] || [];
  const endpoint = endpointMap[entity];
  const navigate = useNavigate();

  // Inicializar estado con todas las claves definidas
  const [formData, setFormData] = useState(
    config.reduce((acc, { name }) => ({ ...acc, [name]: '' }), {})
  );
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!endpoint) {
      setError('Entidad no soportada');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        navigate(`/${entity}`, { replace: true });
      } else {
        setError(data.message || 'Error al crear registro');
      }
    } catch (err) {
      console.error('Error en submit:', err);
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="entity-form">
      {/* Botón de cierre dentro del formulario */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="btn-close-form"
        >
          X
        </button>
      )}

      {config.map(field => {
        const isRequired = field.required || requiredFields.includes(field.name);
        return (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name} className="form-label">{field.label}</label>

            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={isRequired}
              >
                <option value="">Selecciona...</option>
                {field.options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                required={isRequired}
              />
            )}
          </div>
        );
      })}

      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading} className="btn">
        {loading ? 'Guardando…' : 'Guardar'}
      </button>
    </form>
  );
}

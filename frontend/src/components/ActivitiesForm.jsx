// src/components/ActivitiesForm.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../assets/css/EntityForm.css';

export default function ActivitiesForm({ onCreate, onCancel }) {
  const [users, setUsers]               = useState([]);
  const [leadsOptions, setLeadsOptions] = useState([]);
  const [contactsOptions, setContactsOptions] = useState([]);

  const [assignedTo, setAssignedTo]     = useState(null);
  const [dueDate, setDueDate]           = useState('');
  const [allDay, setAllDay]             = useState(true);
  const [dueTime, setDueTime]           = useState('');
  const [activityType, setActivityType] = useState('interno');
  const [referenceId, setReferenceId]   = useState(null);
  const [relatedAccount, setRelatedAccount] = useState('');
  const [description, setDescription]   = useState('');
  const [status, setStatus]             = useState('no_iniciada');
  const [error, setError]               = useState('');

  // 1) Fetch users
  useEffect(() => {
    fetch('/api/users/listUsers.php')
      .then(res => res.json())
      .then(data => {
        console.log('listUsers:', data);
        setUsers(data.users || data.data || []);
      })
      .catch(console.error);
  }, []);
  // 2) Fetch leads or contacts when type changes
  useEffect(() => {
    setReferenceId(null);
    setRelatedAccount('');
    if (activityType === 'leads') {
      fetch('/api/leads/listLeads.php')
        .then(res => res.json())
        .then(data => setLeadsOptions(data.leads || []))
        .catch(console.error);
    } else if (activityType === 'contacto') {
      fetch('/api/contacts/listContacts.php')
        .then(res => res.json())
        .then(data => setContactsOptions(data.contacts || []))
        .catch(console.error);
    }
  }, [activityType]);

  // 3) Fetch related account name for a contact
  useEffect(() => {
    if (activityType === 'contacto' && referenceId) {
      fetch(`/api/contacts/getContacts.php?id=${referenceId}`)
        .then(res => res.json())
        .then(data => setRelatedAccount(data.account_name || ''))
        .catch(console.error);
    }
  }, [activityType, referenceId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const payload = {
      assigned_to: assignedTo,
      due_date: dueDate,
      all_day: allDay ? 1 : 0,
      due_time: allDay ? null : dueTime,
      activity_type: activityType,
      reference_id: referenceId,
      description,
      status
    };
    try {
      const res = await fetch('/api/activities/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onCreate();
        // reset form
        setAssignedTo(null);
        setDueDate('');
        setAllDay(true);
        setDueTime('');
        setActivityType('interno');
        setReferenceId(null);
        setRelatedAccount('');
        setDescription('');
        setStatus('no_iniciada');
      } else {
        setError(data.message || 'Error al crear actividad');
      }
    } catch {
      setError('Error de conexión al servidor');
    }
  };

  // prepare options
  const userOptions    = users.map(u => ({ value: u.id, label: u.name }));
  const leadOptions    = leadsOptions.map(l => ({ value: l.id, label: `${l.first_name} ${l.last_name}` }));
  const contactOptions = contactsOptions.map(c => ({ value: c.id, label: `${c.first_name} ${c.last_name}` }));

  return (
    <form onSubmit={handleSubmit} className="entity-form">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="btn-close-form"
        >
          X
        </button>
      )}
      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label htmlFor="assignedTo" className="form-label">Encargado</label>
        <Select
          id="assignedTo"
          options={userOptions}
          value={userOptions.find(o => o.value === assignedTo) || null}
          onChange={opt => setAssignedTo(opt ? opt.value : null)}
          placeholder="Selecciona usuario..."
          isClearable
          classNamePrefix="react-select"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDate" className="form-label">Fecha límite</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            checked={allDay}
            onChange={e => setAllDay(e.target.checked)}
          />{' '}
          Actividad todo el día
        </label>
      </div>

      {!allDay && (
        <div className="form-group">
          <label htmlFor="dueTime" className="form-label">Hora</label>
          <input
            id="dueTime"
            type="time"
            value={dueTime}
            onChange={e => setDueTime(e.target.value)}
            required
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="activityType" className="form-label">Tipo</label>
        <select
          id="activityType"
          value={activityType}
          onChange={e => setActivityType(e.target.value)}
          required
        >
          <option value="leads">Leads</option>
          <option value="contacto">Contacto</option>
          <option value="interno">Interno</option>
        </select>
      </div>

      {(activityType === 'leads' || activityType === 'contacto') && (
        <div className="form-group">
          <label htmlFor="referenceId" className="form-label">
            {activityType === 'leads' ? 'Lead' : 'Contacto'}
          </label>
          <Select
            id="referenceId"
            options={activityType === 'leads' ? leadOptions : contactOptions}
            value={(activityType === 'leads' ? leadOptions : contactOptions)
              .find(o => o.value === referenceId) || null}
            onChange={opt => setReferenceId(opt ? opt.value : null)}
            placeholder="Selecciona..."
            isClearable
            classNamePrefix="react-select"
            required
          />
          {activityType === 'contacto' && relatedAccount && (
            <p>Pertenece a cuenta: <strong>{relatedAccount}</strong></p>
          )}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="description" className="form-label">Descripción</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="status" className="form-label">Estatus</label>
        <select
          id="status"
          value={status}
          onChange={e => setStatus(e.target.value)}
          required
        >
          <option value="no_iniciada">No iniciada</option>
          <option value="pendiente">Pendiente</option>
          <option value="aplazada">Aplazada</option>
          <option value="completada">Completada</option>
        </select>
      </div>

      <button type="submit" className="btn">
        Crear Actividad
      </button>
    </form>
  );
}

import React, { useState } from 'react';
import '../DatabaseStyles.css';

function EventTable({ events, token, onEventUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };
  
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('de-DE');
  };
  
  const handleEdit = (event) => {
    setEditedEvent({
      ...event,
      event_date: event.event_date.slice(0, 10),
      sign_in_start: new Date(event.sign_in_start).toISOString().slice(0, 16),
      sign_in_end: new Date(event.sign_in_end).toISOString().slice(0, 16)
    });
    setIsEditing(true);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedEvent({
      ...editedEvent,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditedEvent(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://suitwalk-linz-backend.vercel.app/api/admin/suitwalk-events/${editedEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedEvent)
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Events');
      }
      
      setIsEditing(false);
      setEditedEvent(null);
      onEventUpdated();
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler beim Speichern der Änderungen');
    }
  };
  
  const handleSetNext = async (id) => {
    try {
      const response = await fetch(`https://suitwalk-linz-backend.vercel.app/api/admin/suitwalk-events/${id}/set-next`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Setzen des nächsten Events');
      }
      
      onEventUpdated();
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler beim Setzen des nächsten Events');
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Sind Sie sicher, dass Sie dieses Event löschen möchten?')) {
      return;
    }
    
    try {
      const response = await fetch(`https://suitwalk-linz-backend.vercel.app/api/admin/suitwalk-events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Löschen des Events');
      }
      
      onEventUpdated();
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler beim Löschen des Events');
    }
  };
  
  if (isEditing && editedEvent) {
    return (
      <div className="edit-form-container">
        <h2>Event bearbeiten</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Titel</label>
            <input 
              type="text" 
              name="title" 
              value={editedEvent.title || ''} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Beschreibung</label>
            <textarea 
              name="description" 
              value={editedEvent.description || ''} 
              onChange={handleChange} 
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>Event-Datum</label>
            <input 
              type="date" 
              name="event_date" 
              value={editedEvent.event_date} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Anmeldung Start</label>
            <input 
              type="datetime-local" 
              name="sign_in_start" 
              value={editedEvent.sign_in_start} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Anmeldung Ende</label>
            <input 
              type="datetime-local" 
              name="sign_in_end" 
              value={editedEvent.sign_in_end} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group checkbox">
            <label>
              <input 
                type="checkbox" 
                name="is_next" 
                checked={editedEvent.is_next} 
                onChange={handleChange} 
              />
              Als nächsten Suitwalk festlegen
            </label>
          </div>
          
          <div className="form-buttons">
            <button type="button" className="cancel-button" onClick={handleCancel}>
              Abbrechen
            </button>
            <button type="submit" className="save-button">
              Speichern
            </button>
          </div>
        </form>
      </div>
    );
  }
  
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Titel</th>
          <th>Event-Datum</th>
          <th>Anmeldung Start</th>
          <th>Anmeldung Ende</th>
          <th>Nächster</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {events.length > 0 ? (
          events.map(event => (
            <tr key={event.id} className={event.is_next ? 'highlighted-row' : ''}>
              <td>{event.id}</td>
              <td>{event.title || '-'}</td>
              <td>{formatDate(event.event_date)}</td>
              <td>{formatDateTime(event.sign_in_start)}</td>
              <td>{formatDateTime(event.sign_in_end)}</td>
              <td>
                {event.is_next ? (
                  <span className="active-badge">Aktiv</span>
                ) : (
                  <button className="set-next-button" onClick={() => handleSetNext(event.id)}>
                    Als nächstes setzen
                  </button>
                )}
              </td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(event)}>
                  Bearbeiten
                </button>
                <button className="delete-button" onClick={() => handleDelete(event.id)}>
                  Löschen
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="no-data">Keine Events gefunden</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default EventTable;
import React, { useState } from 'react';
import '../DatabaseStyles.css';

function GalleryPhotographerTable({ photographers, token, onPhotographerUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPhotographer, setEditedPhotographer] = useState(null);
  
  const handleEdit = (photographer) => {
    setEditedPhotographer({...photographer});
    setIsEditing(true);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPhotographer({
      ...editedPhotographer,
      [name]: value
    });
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditedPhotographer(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://suitwalk-linz-backend.vercel.app/api/admin/photographers/${editedPhotographer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedPhotographer)
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Fotografen');
      }
      
      setIsEditing(false);
      setEditedPhotographer(null);
      onPhotographerUpdated();
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler beim Speichern der Änderungen');
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Sind Sie sicher, dass Sie diesen Fotografen löschen möchten?')) {
      return;
    }
    
    try {
      const response = await fetch(`https://suitwalk-linz-backend.vercel.app/api/admin/photographers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'Cannot delete photographer with existing photos') {
          alert(`Dieser Fotograf kann nicht gelöscht werden, da er ${errorData.photoCount} Fotos in der Datenbank hat.`);
        } else {
          throw new Error('Fehler beim Löschen des Fotografen');
        }
        return;
      }
      
      onPhotographerUpdated();
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler beim Löschen des Fotografen');
    }
  };
  
  if (isEditing && editedPhotographer) {
    return (
      <div className="edit-form-container">
        <h2>Fotograf bearbeiten</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={editedPhotographer.name || ''} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Telegram ID</label>
            <input 
              type="text" 
              name="telegram_id" 
              value={editedPhotographer.telegram_id || ''} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Website</label>
            <input 
              type="text" 
              name="website" 
              value={editedPhotographer.website || ''} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea 
              name="bio" 
              value={editedPhotographer.bio || ''} 
              onChange={handleChange} 
              rows="3"
            />
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
          <th>Name</th>
          <th>Telegram ID</th>
          <th>Website</th>
          <th>Fotos</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {photographers.length > 0 ? (
          photographers.map(photographer => (
            <tr key={photographer.id}>
              <td>{photographer.id}</td>
              <td>{photographer.name}</td>
              <td>{photographer.telegram_id || '-'}</td>
              <td>{photographer.website || '-'}</td>
              <td>{photographer.photo_count || 0}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(photographer)}>
                  Bearbeiten
                </button>
                <button 
                  className="delete-button" 
                  onClick={() => handleDelete(photographer.id)}
                  disabled={photographer.photo_count > 0}
                >
                  Löschen
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="no-data">Keine Fotografen gefunden</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default GalleryPhotographerTable;
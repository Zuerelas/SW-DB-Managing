import React from 'react';
import '../DatabaseStyles.css';

function PhotographerTable({ photographers }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };
  
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Telegram Username</th>
          <th>Typ</th>
          <th>Badge</th>
          <th>Registriert am</th>
        </tr>
      </thead>
      <tbody>
        {photographers.length > 0 ? (
          photographers.map(photographer => (
            <tr key={photographer.id}>
              <td>{photographer.id}</td>
              <td>{`${photographer.first_name} ${photographer.last_name || ''}`}</td>
              <td>{photographer.username || '-'}</td>
              <td>{photographer.type}</td>
              <td>{photographer.badge ? 'Ja' : 'Nein'}</td>
              <td>{formatDate(photographer.created_at)}</td>
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

export default PhotographerTable;
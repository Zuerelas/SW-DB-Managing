import React from 'react';
import '../DatabaseStyles.css';

function PhotoTable({ photos }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Vorschau</th>
          <th>Dateiname</th>
          <th>Datum</th>
          <th>Fotograf</th>
          <th>Größe</th>
          <th>Downloads</th>
        </tr>
      </thead>
      <tbody>
        {photos.length > 0 ? (
          photos.map(photo => (
            <tr key={photo.id}>
              <td>{photo.id}</td>
              <td className="photo-preview">
                <img 
                  src={`https://suitwalk-linz.at/gallery/${photo.event_date}/${photo.photographer_id}/thumbnails/${photo.filename}`} 
                  alt={photo.title || photo.filename} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/80x80?text=Kein+Bild';
                  }}
                />
              </td>
              <td title={photo.title}>{photo.filename}</td>
              <td>{formatDate(photo.event_date)}</td>
              <td>{photo.photographer_name}</td>
              <td>{formatFileSize(photo.file_size)}</td>
              <td>{photo.download_count}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="no-data">Keine Fotos gefunden</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default PhotoTable;
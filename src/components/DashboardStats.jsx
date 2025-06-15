import React from 'react';
import './DashboardStats.css';

function DashboardStats({ stats, loading, error }) {
  // Datum formatieren
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Lade Dashboard-Daten...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!stats) {
    return <div className="no-data">Keine Daten verfügbar</div>;
  }

  return (
    <div className="dashboard-stats">
      <h1>Suitwalk-Linz Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Registrierungen</h3>
          <div className="stat-value">{stats.registrations.total}</div>
          <div className="stat-details">
            {stats.registrations.byType.map((type, index) => (
              <div key={index} className="stat-detail">
                <span>{type.type}:</span> <span>{type.count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Fotos</h3>
          <div className="stat-value">{stats.totalPhotos}</div>
          <div className="stat-details">
            <div className="stat-detail">
              <span>Fotografen:</span> <span>{stats.totalPhotographers}</span>
            </div>
            <div className="stat-detail">
              <span>Downloads:</span> <span>{stats.totalDownloads}</span>
            </div>
          </div>
        </div>
        
        {stats.nextEvent && (
          <div className="stat-card next-event">
            <h3>Nächster Suitwalk</h3>
            <div className="stat-value">{formatDate(stats.nextEvent.event_date)}</div>
            <div className="stat-details">
              <div className="stat-detail">
                <span>Anmeldungen:</span> <span>{stats.nextEvent.registrations}</span>
              </div>
              <div className="stat-detail">
                <span>Status:</span> 
                <span className={stats.nextEvent.registration_open ? 'status-open' : 'status-closed'}>
                  {stats.nextEvent.registration_open ? 'Offen' : 'Geschlossen'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="recent-section">
        <h3>Neueste Foto-Uploads</h3>
        <div className="recent-photos">
          <table>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Titel</th>
                <th>Fotograf</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUploads.map((upload, index) => (
                <tr key={index}>
                  <td>{new Date(upload.upload_date).toLocaleString('de-DE')}</td>
                  <td>{upload.title || upload.filename}</td>
                  <td>{upload.photographer_name}</td>
                  <td>{formatDate(upload.event_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
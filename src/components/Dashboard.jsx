import React, { useState } from 'react';
import './Dashboard.css';
import UsersTable from './UsersTable';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('users');
  
  // Database structure with tables
  const DATABASES = {
    suitwalk: {
      name: "Suitwalks Datenbank",
      tables: [
        { id: 'users', name: 'Benutzer', description: 'Registrierte Suitwalk-Teilnehmer' },
        { id: 'suitwalk_events', name: 'Veranstaltungen', description: 'Kommende und vergangene Suitwalk-Veranstaltungen' }
      ]
    },
    gallery: {
      name: "Fotos Datenbank",
      tables: [
        { id: 'photos', name: 'Fotos', description: 'Hochgeladene Fotos von Veranstaltungen' },
        { id: 'photographers', name: 'Fotografen', description: 'Registrierte Fotografen' }
      ]
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Suitwalk Datenbank-Manager</h1>
        <div className="user-info">
          <span>Angemeldet als: <strong>{user.username}</strong></span>
          <button className="logout-button" onClick={onLogout}>Abmelden</button>
        </div>
      </div>
      
      <div className="tabs-container">
        <div className="tabs-navigation">
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Benutzer
          </button>
          <button 
            className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Veranstaltungen
          </button>
          <button 
            className={`tab-button ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            Fotos
          </button>
          <button 
            className={`tab-button ${activeTab === 'photographers' ? 'active' : ''}`}
            onClick={() => setActiveTab('photographers')}
          >
            Fotografen
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'users' && (
            <UsersTable token={user.token} />
          )}
          {activeTab === 'events' && (
            <div className="coming-soon">
              <h2>Veranstaltungen</h2>
              <p>Diese Funktion wird in Kürze verfügbar sein.</p>
            </div>
          )}
          {activeTab === 'photos' && (
            <div className="coming-soon">
              <h2>Fotos</h2>
              <p>Diese Funktion wird in Kürze verfügbar sein.</p>
            </div>
          )}
          {activeTab === 'photographers' && (
            <div className="coming-soon">
              <h2>Fotografen</h2>
              <p>Diese Funktion wird in Kürze verfügbar sein.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
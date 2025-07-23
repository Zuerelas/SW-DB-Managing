import React, { useState, useEffect } from 'react';
import './UsersTable.css';

function UsersTable({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);
  // Spaltenauswahl State
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    username: '',
    telegram_id: '',
    type: 'Suiter',
    badge: false
  });
  const [cardView, setCardView] = useState(window.innerWidth < 768);

  // Event Listener für Bildschirmgröße
  useEffect(() => {
    const handleResize = () => {
      setCardView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      // Verwende den Admin-Endpunkt oder public-stats als Fallback
      const response = await fetch('https://suitwalk-linz-backend.vercel.app/api/admin/all-data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Abrufen der Daten: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.data.users || []);
    } catch (err) {
      console.error('Fehler beim Laden der Benutzerdaten:', err);
      setError(err.message);
      
      // Demo-Daten zur Anzeige
      setUsers(generateDemoUsers());
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Spalten initialisieren wenn Benutzer geladen werden
  useEffect(() => {
    if (users.length > 0) {
      const keys = Object.keys(users[0]);
      setAllColumns(keys);
      // Nur beim ersten Laden initialisieren
      setVisibleColumns((prev) => prev.length === 0 ? keys : prev);
    }
  }, [users]);

  // Generiert Beispieldaten
  const generateDemoUsers = () => {
    const types = ['Suiter', 'Spotter', 'Fotograf', 'Sanitaeter', 'Besucher'];
    return Array.from({ length: 25 }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 365));
      
      return {
        id: i + 1,
        telegram_id: 1000000 + i,
        first_name: `Vorname${i + 1}`,
        last_name: `Nachname${i + 1}`,
        username: `benutzer${i + 1}`,
        type: type,
        badge: Math.random() > 0.5,
        created_at: createdDate.toISOString(),
        auth_date: createdDate.toISOString()
      };
    });
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Filtere und sortiere Benutzer
  const filteredAndSortedUsers = users
    .filter(user => {
      if (!searchTerm.trim()) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        (user.first_name && user.first_name.toLowerCase().includes(searchLower)) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchLower)) ||
        (user.username && user.username.toLowerCase().includes(searchLower)) ||
        (user.type && user.type.toLowerCase().includes(searchLower)) ||
        (user.telegram_id && user.telegram_id.toString().includes(searchTerm))
      );
    })
    .sort((a, b) => {
      if (sortField === 'created_at' || sortField === 'auth_date') {
        const dateA = new Date(a[sortField] || 0);
        const dateB = new Date(b[sortField] || 0);
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      const valueA = a[sortField] || '';
      const valueB = b[sortField] || '';
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return sortDirection === 'asc' 
        ? valueA - valueB 
        : valueB - valueA;
    });

  const handleNewUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser({
      ...newUser,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // API-Aufruf zum Hinzufügen eines neuen Benutzers
      const response = await fetch('https://suitwalk-linz-backend.vercel.app/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        throw new Error('Fehler beim Hinzufügen des Benutzers');
      }

      // Benutzer zurücksetzen und Formular schließen
      setNewUser({
        first_name: '',
        last_name: '',
        username: '',
        telegram_id: '',
        type: 'Suiter',
        badge: false
      });
      setShowAddForm(false);
      
      // Benutzerliste aktualisieren
      fetchUsers();
    } catch (err) {
      console.error('Fehler beim Hinzufügen des Benutzers:', err);
      alert(`Fehler: ${err.message}`);
    }
  };

  // Bestätige Löschung eines Benutzers
  const confirmDeleteUser = (user) => {
    setDeleteConfirm(user);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
    setDeleteStatus(null);
  };

  const deleteUser = async () => {
    if (!deleteConfirm) return;
    
    try {
      // API-Aufruf zum Löschen des Benutzers
      const response = await fetch(`https://suitwalk-linz-backend.vercel.app/api/admin/users/${deleteConfirm.telegram_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Fehler beim Löschen des Benutzers');
      }

      setDeleteStatus({
        success: true,
        message: `Benutzer ${deleteConfirm.first_name} ${deleteConfirm.last_name || ''} wurde erfolgreich gelöscht.`
      });
      
      // Benutzerliste aktualisieren
      fetchUsers();
      
      // Bestätigungsdialog nach 3 Sekunden schließen
      setTimeout(() => {
        setDeleteConfirm(null);
        setDeleteStatus(null);
      }, 3000);
      
    } catch (err) {
      console.error('Fehler beim Löschen des Benutzers:', err);
      setDeleteStatus({
        success: false,
        message: `Fehler: ${err.message}`
      });
    }
  };

  // Hilfsfunktion für den View-Toggle-Button
  const toggleView = () => {
    setCardView(!cardView);
  };

  // Spaltenauswahl-Handler
  const handleColumnToggle = (col) => {
    setVisibleColumns((prev) =>
      prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col]
    );
  };

  const renderColumnSelector = () => {
    if (allColumns.length === 0 || cardView) return null;
    return (
      <div className="column-selector">
        <span style={{ fontWeight: 500, color: '#ff8080' }}>Spalten anzeigen:</span>
        {allColumns.map((col) => (
          <label key={col}>
            <input
              type="checkbox"
              checked={visibleColumns.includes(col)}
              onChange={() => handleColumnToggle(col)}
            />
            {col}
          </label>
        ))}
        <button
          type="button"
          className="column-selector-button"
          onClick={() => setVisibleColumns(allColumns)}
        >
          Alle anzeigen
        </button>
        <button
          type="button"
          className="column-selector-button"
          onClick={() => setVisibleColumns([])}
        >
          Alle ausblenden
        </button>
      </div>
    );
  };

  const renderTableHeaders = () => {
    return (
      <tr>
        {visibleColumns.map((col) => (
          <th
            key={col}
            onClick={() => handleSort(col)}
            className={sortField === col ? sortDirection : ''}
          >
            {col === 'telegram_id' ? 'Telegram ID' :
             col === 'first_name' ? 'Vorname' :
             col === 'last_name' ? 'Nachname' :
             col === 'username' ? 'Benutzername' :
             col === 'type' ? 'Typ' :
             col === 'badge' ? 'Badge' :
             col === 'created_at' ? 'Erstellt' :
             col === 'auth_date' ? 'Auth Datum' :
             col}
            {sortField === col && (
              <span className="sort-arrow">
                {sortDirection === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </th>
        ))}
        <th>Aktionen</th>
      </tr>
    );
  };

  const renderTableRows = () => {
    return filteredAndSortedUsers.map((user) => (
      <tr key={user.id || user.telegram_id} className={`user-type-${user.type ? user.type.toLowerCase() : 'unknown'}`}>
        {visibleColumns.map((col) => (
          <td key={col}>
            {col === 'type' ? (
              <span className={`user-type-badge ${user.type ? user.type.toLowerCase() : 'unknown'}`}>
                {user.type === 'Sanitaeter' ? 'Sanitäter' : user.type}
              </span>
            ) : col === 'badge' ? (
              user.badge == 1 ? (
                <span className="badge-icon">✓</span>
              ) : (
                <span className="no-badge-icon">✗</span>
              )
            ) : col === 'created_at' || col === 'auth_date' ? (
              formatDate(user[col])
            ) : (
              user[col] || '-'
            )}
          </td>
        ))}
        <td>
          <button
            className="delete-user-button"
            title="Benutzer löschen"
            onClick={() => confirmDeleteUser(user)}
          >
            🗑️
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="users-table-container">
      <div className="table-header">
        <h2>Benutzer-Verwaltung</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {/* Neue mobile Ansichtssteuerung */}
      <div className="view-controls">
        <button 
          className="add-user-button" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Abbrechen' : 'Neuer Benutzer'}
        </button>
        
        <button 
          className={`view-toggle-button ${cardView ? 'card-active' : 'table-active'}`} 
          onClick={toggleView}
        >
          {cardView ? 'Tabellen-Ansicht' : 'Karten-Ansicht'}
        </button>
      </div>
      
      {/* Löschbestätigung Dialog */}
      {deleteConfirm && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation">
            <h3>Benutzer löschen</h3>
            {!deleteStatus ? (
              <>
                <p>Möchtest du den Benutzer <strong>{deleteConfirm.first_name} {deleteConfirm.last_name || ''}</strong> wirklich löschen?</p>
                <p className="delete-warning">Diese Aktion kann nicht rückgängig gemacht werden!</p>
                <div className="delete-actions">
                  <button className="delete-confirm-button" onClick={deleteUser}>
                    Ja, löschen
                  </button>
                  <button className="delete-cancel-button" onClick={cancelDelete}>
                    Abbrechen
                  </button>
                </div>
              </>
            ) : (
              <div className={`delete-status ${deleteStatus.success ? 'success' : 'error'}`}>
                <p>{deleteStatus.message}</p>
                {!deleteStatus.success && (
                  <button className="delete-cancel-button" onClick={cancelDelete}>
                    Schließen
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Formular zum Hinzufügen eines neuen Benutzers */}
      {showAddForm && (
        <div className="add-user-form-container">
          <h3>Neuen Benutzer hinzufügen</h3>
          <form onSubmit={handleAddUser} className="add-user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">Vorname</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={newUser.first_name}
                  onChange={handleNewUserChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="last_name">Nachname</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={newUser.last_name}
                  onChange={handleNewUserChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Telegram Benutzername</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={handleNewUserChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="telegram_id">Telegram ID</label>
                <input
                  type="text"
                  id="telegram_id"
                  name="telegram_id"
                  value={newUser.telegram_id}
                  onChange={handleNewUserChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Typ</label>
                <select
                  id="type"
                  name="type"
                  value={newUser.type}
                  onChange={handleNewUserChange}
                  required
                >
                  <option value="Suiter">Suiter</option>
                  <option value="Spotter">Spotter</option>
                  <option value="Fotograf">Fotograf</option>
                  <option value="Sanitaeter">Sanitäter</option>
                  <option value="Besucher">Besucher</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="badge"
                    checked={newUser.badge}
                    onChange={handleNewUserChange}
                  />
                  Badge bestellt
                </label>
              </div>
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="submit-button">Hinzufügen</button>
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => setShowAddForm(false)}
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Spaltenauswahl nur in der Tabellenansicht */}
      {!loading && !error && users.length > 0 && renderColumnSelector()}

      {loading ? (
        <div className="loading-message">Benutzer werden geladen...</div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <p>Zeige Beispieldaten an...</p>
        </div>
      ) : (
        <>
          <div className="users-count">
            {filteredAndSortedUsers.length} {filteredAndSortedUsers.length === 1 ? 'Benutzer' : 'Benutzer'} gefunden
            {searchTerm && ` für Suche: "${searchTerm}"`}
          </div>
          
          {/* Kartenansicht für Mobilgeräte */}
          {cardView ? (
            <div className="user-cards">
              {filteredAndSortedUsers.length > 0 ? (
                filteredAndSortedUsers.map((user) => (
                  <div 
                    key={user.id || user.telegram_id} 
                    className={`user-card user-type-${user.type ? user.type.toLowerCase() : 'unknown'}`}
                  >
                    <div className="user-card-header">
                      <span className={`user-type-badge ${user.type ? user.type.toLowerCase() : 'unknown'}`}>
                        {user.type === 'Sanitaeter' ? 'Sanitäter' : user.type}
                      </span>
                      {user.badge == 1 && <span className="badge-icon-mobile">🏷️</span>}
                    </div>
                    
                    <div className="user-card-content">
                      <h3>{user.first_name} {user.last_name || ''}</h3>
                      <p className="username">@{user.username || '-'}</p>
                      <div className="user-details">
                        <div className="detail-item">
                          <span className="detail-label">Telegram ID:</span>
                          <span className="detail-value">{user.telegram_id}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Erstellt:</span>
                          <span className="detail-value">{formatDate(user.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="user-card-actions">
                      <button 
                        className="delete-user-button" 
                        onClick={() => confirmDeleteUser(user)}
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">Keine Benutzer gefunden</div>
              )}
            </div>
          ) : (
            // Tabellenansicht für Desktop
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  {renderTableHeaders()}
                </thead>
                <tbody>
                  {filteredAndSortedUsers.length > 0 ? (
                    renderTableRows()
                  ) : (
                    <tr>
                      <td colSpan={visibleColumns.length + 1} className="no-data">Keine Benutzer gefunden</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UsersTable;


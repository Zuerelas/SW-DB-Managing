import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Bitte geben Sie Benutzername und Passwort ein.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Zuerst die API-Konnektivität testen
      try {
        const testResponse = await fetch('https://suitwalk-linz-backend.vercel.app/api/test-endpoint');
        if (!testResponse.ok) {
          console.error('Test endpoint error:', testResponse.status);
        }
      } catch (testErr) {
        console.error('Test endpoint failed:', testErr);
      }
      
      // Jetzt Login versuchen
      const response = await fetch('https://suitwalk-linz-backend.vercel.app/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          username, 
          password 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Anmeldung fehlgeschlagen');
      }
      
      const data = await response.json();
      
      // Prüfen, ob wir den Token haben
      if (!data.token) {
        throw new Error('Authentifizierung fehlgeschlagen - kein Token erhalten');
      }
      
      // onLogin-Callback aufrufen
      onLogin({
        username: data.user.username,
        token: data.token
      });
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="container-content login-card">
        <h1>Suitwalk Linz</h1>
        <h2>Datenbank-Verwaltung</h2>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Benutzername</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Anmeldung läuft...' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
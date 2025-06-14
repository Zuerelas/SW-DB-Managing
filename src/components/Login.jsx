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
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // First test endpoint connectivity
      console.log('Testing API connectivity...');
      try {
        const testResponse = await fetch('https://suitwalk-linz-backend.vercel.app/api/test-endpoint');
        if (!testResponse.ok) {
          console.error('Test endpoint error:', testResponse.status);
        }
      } catch (testErr) {
        console.error('Test endpoint failed:', testErr);
      }
      
      // Now attempt the login
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
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data = await response.json();
      
      // Check if we have the token
      if (!data.token) {
        throw new Error('Authentication failed - no token received');
      }
      
      // Save user data and token
      localStorage.setItem('user', JSON.stringify({
        username: data.user.username,
        token: data.token
      }));
      
      // Call the onLogin callback
      onLogin({
        username: data.user.username,
        token: data.token
      });
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h1>Datenbank Login</h1>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="admin-login-form">
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
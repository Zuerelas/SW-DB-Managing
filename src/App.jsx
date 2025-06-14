import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  
  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <div className="app-container">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="dashboard">
          <h1>Welcome, {user.username}</h1>
          <button onClick={() => setUser(null)}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;

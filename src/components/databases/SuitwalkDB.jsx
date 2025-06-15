import React, { useState, useEffect } from 'react';
import './DatabaseStyles.css';
import EventTable from './tables/EventTable';
import PhotographerTable from './tables/PhotographerTable';

function SuitwalkDB({ token }) {
  const [activeTable, setActiveTable] = useState('events');
  const [events, setEvents] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://suitwalk-linz-backend.vercel.app/api/admin/suitwalk-events', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Suitwalk-Events');
        }
        
        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Fehler:', err);
        setError('Daten konnten nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };

    const fetchPhotographers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://suitwalk-linz-backend.vercel.app/api/admin/photographers/suitwalk', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Fotografen');
        }
        
        const data = await response.json();
        setPhotographers(data.photographers || []);
      } catch (err) {
        console.error('Fehler:', err);
        setError('Daten konnten nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };

    if (activeTable === 'events') {
      fetchEvents();
    } else if (activeTable === 'photographers') {
      fetchPhotographers();
    }
  }, [activeTable, token]);
  
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://suitwalk-linz-backend.vercel.app/api/admin/suitwalk-events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Suitwalk-Events');
      }
      
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Fehler:', err);
      setError('Daten konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };
  
  
  
  return (
    <div className="database-container">
      <div className="database-header">
        <h1>Suitwalk-Datenbank</h1>
        <div className="table-tabs">
          <button 
            className={activeTable === 'events' ? 'active' : ''} 
            onClick={() => setActiveTable('events')}
          >
            Suitwalk-Events
          </button>
          <button 
            className={activeTable === 'photographers' ? 'active' : ''} 
            onClick={() => setActiveTable('photographers')}
          >
            Fotografen
          </button>
        </div>
      </div>
      
      <div className="table-container">
        {loading ? (
          <div className="loading">Daten werden geladen...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {activeTable === 'events' && (
              <EventTable 
                events={events} 
                token={token} 
                onEventUpdated={fetchEvents} 
              />
            )}
            
            {activeTable === 'photographers' && (
              <PhotographerTable 
                photographers={photographers} 
                token={token} 
                isGalleryTable={false}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SuitwalkDB;
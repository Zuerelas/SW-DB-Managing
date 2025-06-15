import React, { useState, useEffect } from 'react';
import './DatabaseStyles.css';
import PhotoTable from './tables/PhotoTable';
import GalleryPhotographerTable from './tables/GalleryPhotographerTable';

function PhotosDB({ token }) {
  const [activeTable, setActiveTable] = useState('photos');
  const [photos, setPhotos] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // useCallback ensures stable references for dependency array
  const fetchPhotos = React.useCallback(async (page) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://suitwalk-linz-backend.vercel.app/api/admin/photos?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Fotos');
      }
      
      const data = await response.json();
      setPhotos(data.photos || []);
      setTotalPhotos(data.total || 0);
    } catch (err) {
      console.error('Fehler:', err);
      setError('Daten konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  }, [token]);
  
  const fetchPhotographers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://suitwalk-linz-backend.vercel.app/api/admin/photographers/gallery', {
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
  }, [token]);

  useEffect(() => {
    if (activeTable === 'photos') {
      fetchPhotos(currentPage);
    } else if (activeTable === 'photographers') {
      fetchPhotographers();
    }
  }, [activeTable, currentPage, token, fetchPhotos, fetchPhotographers]);
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  const totalPages = Math.ceil(totalPhotos / 20);
  
  return (
    <div className="database-container">
      <div className="database-header">
        <h1>Fotos-Datenbank</h1>
        <div className="table-tabs">
          <button 
            className={activeTable === 'photos' ? 'active' : ''} 
            onClick={() => setActiveTable('photos')}
          >
            Fotos
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
            {activeTable === 'photos' && (
              <>
                <PhotoTable photos={photos} token={token} />
                
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                  >
                    Zurück
                  </button>
                  
                  <span className="page-info">
                    Seite {currentPage} von {totalPages}
                  </span>
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                  >
                    Weiter
                  </button>
                </div>
              </>
            )}
            
            {activeTable === 'photographers' && (
              <GalleryPhotographerTable 
                photographers={photographers} 
                token={token} 
                onPhotographerUpdated={fetchPhotographers}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PhotosDB;
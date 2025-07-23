import React, { useState, useEffect } from 'react';
import './TableViewer.css';

function TableViewer({ database, table, token }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({});
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [allColumns, setAllColumns] = useState([]);

  const itemsPerPage = 10;

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = `https://suitwalk-linz-backend.vercel.app/api/admin/${database}/${table}`;
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...filter
      });
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      const response = await fetch(`${endpoint}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Fehler beim Laden der Daten: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result.data || []);
      setTotalPages(Math.ceil((result.total || result.data.length) / itemsPerPage));
      // Spalten initialisieren, falls noch nicht gesetzt
      if ((result.data || []).length > 0) {
        const keys = Object.keys(result.data[0]);
        setAllColumns(keys);
        // Nur beim ersten Laden initialisieren
        setVisibleColumns((prev) => prev.length === 0 ? keys : prev);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Tabellendaten:', err);
      setError(`Fehler beim Laden der Daten: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [database, table, currentPage, filter, searchTerm, token, itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const clearFilters = () => {
    setFilter({});
    setSearchTerm('');
    setCurrentPage(1);
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
    if (allColumns.length === 0) return null;
    return (
      <div className="column-selector" style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontWeight: 500, color: '#ff8080' }}>Spalten anzeigen:</span>
        {allColumns.map((col) => (
          <label key={col} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.95rem', color: '#eee' }}>
            <input
              type="checkbox"
              checked={visibleColumns.includes(col)}
              onChange={() => handleColumnToggle(col)}
              style={{ accentColor: '#ff5252' }}
            />
            {col}
          </label>
        ))}
        <button
          type="button"
          style={{ marginLeft: '1rem', fontSize: '0.9rem', padding: '0.3rem 1rem', borderRadius: 6, border: 'none', background: '#2b1919', color: '#ff8080', cursor: 'pointer' }}
          onClick={() => setVisibleColumns(allColumns)}
        >
          Alle anzeigen
        </button>
        <button
          type="button"
          style={{ fontSize: '0.9rem', padding: '0.3rem 1rem', borderRadius: 6, border: 'none', background: '#2b1919', color: '#ff8080', cursor: 'pointer' }}
          onClick={() => setVisibleColumns([])}
        >
          Alle ausblenden
        </button>
      </div>
    );
  };

  const renderTableHeaders = () => {
    if (data.length === 0) return null;
    return (
      <tr>
        {visibleColumns.map(key => (
          <th key={key}>{key}</th>
        ))}
      </tr>
    );
  };

  const renderTableRows = () => {
    return data.map((row, index) => (
      <tr key={index}>
        {visibleColumns.map((col, i) => (
          <td key={i}>
            {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="table-viewer">
      <h2>{`Tabelle: ${table} (${database})`}</h2>
      
      <div className="table-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Suchen</button>
        </form>
        
        <button onClick={clearFilters} className="clear-button">
          Filter zurücksetzen
        </button>
      </div>

      {/* Spaltenauswahl */}
      {!loading && !error && data.length > 0 && renderColumnSelector()}

      {loading ? (
        <div className="loading-message">Daten werden geladen...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : data.length === 0 ? (
        <div className="no-data-message">Keine Daten verfügbar</div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                {renderTableHeaders()}
              </thead>
              <tbody>
                {renderTableRows()}
              </tbody>
            </table>
          </div>
          
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Zurück
            </button>
            
            <span className="page-info">
              Seite {currentPage} von {totalPages}
            </span>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Weiter
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TableViewer;
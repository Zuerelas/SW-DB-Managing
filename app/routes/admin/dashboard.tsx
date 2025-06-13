import { useState, useEffect } from "react";
import { useAuth } from "../../root";
import "../../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalPhotos: 0,
    totalPhotographers: 0,
    recentActivity: [],
    userTypes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.token) return;

      try {
        setLoading(true);
        // This would be a real API call in production
        // Simulating API response for demo
        
        // Mock data
        const mockData = {
          totalUsers: 128,
          totalEvents: 4,
          totalPhotos: 342,
          totalPhotographers: 12,
          userTypes: [
            { type: "Suiter", count: 68, color: "#3a5c8a" },
            { type: "Spotter", count: 32, color: "#3a8a5c" },
            { type: "Sanitäter", count: 8, color: "#2c5d3a" },
            { type: "Fotograf", count: 12, color: "#4c2a5c" },
            { type: "Besucher", count: 8, color: "#5c2a4c" }
          ],
          recentActivity: [
            { id: 1, type: "user_register", user: "Max Mustermann", date: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
            { id: 2, type: "photo_upload", user: "Photographer1", count: 25, date: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
            { id: 3, type: "event_create", title: "Suitwalk Sommer 2024", date: new Date(Date.now() - 1000 * 60 * 240).toISOString() }
          ]
        };

        setStats(mockData);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.token]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="dashboard">
      <h1>Database Overview</h1>

      {loading ? (
        <div className="loading">Loading dashboard data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Users</h3>
              <div className="stat-value">{stats.totalUsers}</div>
            </div>

            <div className="stat-card">
              <h3>Events</h3>
              <div className="stat-value">{stats.totalEvents}</div>
            </div>

            <div className="stat-card">
              <h3>Photos</h3>
              <div className="stat-value">{stats.totalPhotos}</div>
            </div>

            <div className="stat-card">
              <h3>Photographers</h3>
              <div className="stat-value">{stats.totalPhotographers}</div>
            </div>
          </div>

          {/* User Type Distribution */}
          <div className="chart-section">
            <h2>User Type Distribution</h2>
            <div className="user-type-chart">
              {stats.userTypes.map(type => (
                <div key={type.type} className="chart-bar-container">
                  <div className="chart-label">{type.type}</div>
                  <div className="chart-bar">
                    <div 
                      className="chart-bar-fill" 
                      style={{
                        width: `${(type.count / stats.totalUsers) * 100}%`,
                        backgroundColor: type.color
                      }}
                    ></div>
                    <div className="chart-value">{type.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {stats.recentActivity.map(activity => (
                <div key={activity.id} className={`activity-item ${activity.type}`}>
                  <div className="activity-icon">
                    {activity.type === "user_register" && "👤"}
                    {activity.type === "photo_upload" && "📸"}
                    {activity.type === "event_create" && "📅"}
                  </div>
                  <div className="activity-details">
                    {activity.type === "user_register" && (
                      <p>New user registered: <strong>{activity.user}</strong></p>
                    )}
                    {activity.type === "photo_upload" && (
                      <p><strong>{activity.user}</strong> uploaded {activity.count} photos</p>
                    )}
                    {activity.type === "event_create" && (
                      <p>New event created: <strong>{activity.title}</strong></p>
                    )}
                    <span className="activity-time">{formatDate(activity.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
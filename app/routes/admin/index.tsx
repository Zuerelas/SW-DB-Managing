import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../root";
import "../../styles/admin-panel.css";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <div className="loading">Redirecting to login...</div>;
  }

  // Determine active tab from the URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/admin") return "dashboard";
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  const activeTab = getActiveTab();

  return (
    <div className="admin-container">
      {/* Sidebar navigation */}
      <div className="admin-sidebar">
        <h1>Database Manager</h1>
        <nav>
          <Link to="/admin" className={activeTab === "dashboard" ? "active" : ""}>
            Dashboard
          </Link>
          <Link to="/admin/users" className={activeTab === "users" ? "active" : ""}>
            Users
          </Link>
          <Link to="/admin/events" className={activeTab === "events" ? "active" : ""}>
            Events
          </Link>
          <Link to="/admin/photos" className={activeTab === "photos" ? "active" : ""}>
            Photos
          </Link>
          <Link to="/admin/photographers" className={activeTab === "photographers" ? "active" : ""}>
            Photographers
          </Link>
          <Link to="/admin/settings" className={activeTab === "settings" ? "active" : ""}>
            Settings
          </Link>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </nav>
      </div>

      {/* Content area */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
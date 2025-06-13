import { useState, useEffect } from "react";
import { useAuth } from "../../root";
import "../../styles/users.css";

export default function UsersManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    type: "Suiter",
    badge: false,
    telegram_id: ""
  });

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.token) return;

      try {
        setLoading(true);
        // Simulate API call with mock data
        // In a real app, you'd fetch from your backend API
        
        // Mock data
        const mockUsers = Array.from({ length: 30 }, (_, i) => ({
          id: i + 1,
          telegram_id: `${1000000 + i}`,
          first_name: `User${i + 1}`,
          last_name: `Lastname${i + 1}`,
          username: `user${i + 1}`,
          photo_url: null,
          type: ["Suiter", "Spotter", "Sanitäter", "Fotograf", "Besucher"][Math.floor(Math.random() * 5)],
          badge: Math.random() > 0.5,
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }));

        setUsers(mockUsers);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.token]);

  // Filter users based on search input and type filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = filter === "" || 
      user.first_name.toLowerCase().includes(filter.toLowerCase()) ||
      user.last_name.toLowerCase().includes(filter.toLowerCase()) ||
      user.username.toLowerCase().includes(filter.toLowerCase());
    
    const matchesType = filterType === "all" || user.type === filterType;
    
    return matchesSearch && matchesType;
  });

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

  const handleAddUser = () => {
    // In a real app, you'd call your API to add the user
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const createdUser = {
      ...newUser,
      id: newId,
      created_at: new Date().toISOString(),
      photo_url: null
    };
    
    setUsers([...users, createdUser]);
    setShowAddModal(false);
    setNewUser({
      first_name: "",
      last_name: "",
      username: "",
      type: "Suiter",
      badge: false,
      telegram_id: ""
    });
  };

  const handleDeleteUser = (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      // In a real app, you'd call your API to delete the user
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  return (
    <div className="users-management">
      <div className="page-header">
        <h1>User Management</h1>
        <button className="add-button" onClick={() => setShowAddModal(true)}>Add User</button>
      </div>

      <div className="filters">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search users..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="type-filter">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="Suiter">Suiter</option>
            <option value="Spotter">Spotter</option>
            <option value="Sanitäter">Sanitäter</option>
            <option value="Fotograf">Fotograf</option>
            <option value="Besucher">Besucher</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Type</th>
                <th>Badge</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.telegram_id}</td>
                  <td>{`${user.first_name} ${user.last_name}`}</td>
                  <td>{user.username ? `@${user.username}` : '-'}</td>
                  <td>
                    <span className={`user-type ${user.type.toLowerCase()}`}>
                      {user.type}
                    </span>
                  </td>
                  <td>{user.badge ? '✅' : '❌'}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-button">Edit</button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New User</h2>
            <div className="form-group">
              <label>First Name</label>
              <input 
                type="text" 
                value={newUser.first_name}
                onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                value={newUser.last_name}
                onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Telegram ID</label>
              <input 
                type="text" 
                value={newUser.telegram_id}
                onChange={(e) => setNewUser({...newUser, telegram_id: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select 
                value={newUser.type}
                onChange={(e) => setNewUser({...newUser, type: e.target.value})}
              >
                <option value="Suiter">Suiter</option>
                <option value="Spotter">Spotter</option>
                <option value="Sanitäter">Sanitäter</option>
                <option value="Fotograf">Fotograf</option>
                <option value="Besucher">Besucher</option>
              </select>
            </div>
            <div className="form-group checkbox">
              <label>
                <input 
                  type="checkbox" 
                  checked={newUser.badge}
                  onChange={(e) => setNewUser({...newUser, badge: e.target.checked})}
                />
                Has Badge
              </label>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button 
                className="save-button" 
                onClick={handleAddUser}
                disabled={!newUser.first_name || !newUser.telegram_id}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
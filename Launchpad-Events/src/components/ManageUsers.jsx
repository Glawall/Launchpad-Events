import { useState, useEffect } from "react";
import { useAdmin } from "../hooks/api-hooks";
import Button from "./common/Button";
import ConfirmBox from "./common/ConfirmBox";

export default function ManageUsers() {
  const { getAllUsers, updateUser, deleteUser } = useAdmin();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (user) => {
    try {
      const newRole = user.role === "admin" ? "user" : "admin";
      await updateUser(user.id, { role: newRole });
      setUsers(
        users.map((existingUser) =>
          existingUser.id === user.id
            ? { ...existingUser, role: newRole }
            : existingUser
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(userToDelete.id);
      await fetchUsers(); // Refresh the list after deletion
      setShowConfirmDelete(false);
      setUserToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="wrapper">
      <div className="manage-users">
        <h2 className="section-title">Manage Users</h2>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="users-list">
          {filteredUsers.map((user) => (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
              </div>
              <div className="user-actions">
                <Button
                  variant={user.role === "admin" ? "red" : "blue"}
                  onClick={() => handleRoleChange(user)}
                >
                  {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                </Button>
                <Button
                  variant="red"
                  onClick={() => {
                    setUserToDelete(user);
                    setShowConfirmDelete(true);
                  }}
                >
                  Delete User
                </Button>
              </div>
            </div>
          ))}
        </div>

        <ConfirmBox
          isOpen={showConfirmDelete}
          onClose={() => {
            setShowConfirmDelete(false);
            setUserToDelete(null);
          }}
          onConfirm={handleDeleteUser}
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        />
      </div>
    </div>
  );
}

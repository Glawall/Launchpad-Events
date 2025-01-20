import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../hooks/api-hooks";
import ConfirmBox from "../common/ConfirmBox";
import { useState } from "react";

export default function Navigation() {
  const { user, isAdmin, logout } = useAuth();
  const { deleteUser } = useAdmin();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user.id);
      logout();
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <div className="nav-left"></div>
          <div className="nav-center">
            <div className="nav-header">
              <Link to="/" className="brand">
                Events Hub
              </Link>
            </div>
            <div className="nav-links">
              <Link to="/events" className="nav-item">
                Events
              </Link>
              {isAdmin && (
                <>
                  <Link to="/events/create" className="nav-item">
                    Create Event
                  </Link>
                  <Link to="/manage-users" className="nav-item">
                    Manage Users
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="nav-right">
            {user ? (
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <div className="user-actions-column">
                  <button onClick={logout} className="btn">
                    Logout
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    className="btn-red"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-blue">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      <ConfirmBox
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
      />
    </nav>
  );
}

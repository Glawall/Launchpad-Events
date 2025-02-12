import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../hooks/api-hooks";
import ConfirmBox from "../common/ConfirmBox";
import { useState } from "react";
import Button from "../common/Button";

export default function Navigation() {
  const { user, isAdmin, logout } = useAuth();
  const { deleteUser } = useAdmin();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user.id);
      logout();
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  const handleLogout = () => {
    setShowConfirmLogout(true);
  };

  return (
    <nav className="nav">
      <div className="nav-content">
        <div className="nav-center">
          <img
            src="https://i.imgur.com/e6vMBpj.png"
            alt="The Events Hive"
            className="nav-logo"
          />
        </div>

        <div className="nav-row">
          <div className="nav-links">
            <Link to="/" className="nav-item">
              Home
            </Link>
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

          <div className="nav-right">
            {user ? (
              <>
                <span className="user-name">{user.name}</span>
                <Button variant="btn-default" onClick={handleLogout}>
                  Logout
                </Button>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="btn-red"
                  style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
                >
                  Delete Account
                </button>
              </>
            ) : (
              <Link to="/login" className="btn">
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
      <ConfirmBox
        isOpen={showConfirmLogout}
        onClose={() => setShowConfirmLogout(false)}
        onConfirm={() => {
          logout();
          setShowConfirmLogout(false);
        }}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
      />
    </nav>
  );
}

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navigation() {
  const { user, isAdmin, logout } = useAuth();

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
                <Link to="/events/create" className="nav-item">
                  Create Event
                </Link>
              )}
            </div>
          </div>
          <div className="nav-right">
            {user ? (
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <button onClick={logout} className="nav-item btn-red">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="nav-item btn-blue">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

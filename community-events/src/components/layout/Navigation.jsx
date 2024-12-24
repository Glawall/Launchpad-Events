import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function Navigation() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="nav">
      <div className="wrapper">
        <div className="nav-row">
          <div className="nav-left">
            <Link to="/" className="logo">
              <h1 className="brand">EventHub</h1>
            </Link>

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
                <button onClick={logout} className="btn-gray">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-blue">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

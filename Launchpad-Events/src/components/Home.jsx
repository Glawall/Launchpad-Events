import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="wrapper">
      <div className="home-content">
        <h1>Welcome to The Events Hive!</h1>
        <h3>For admins</h3>
        <p>
          The Events Hive allows you to create, edit, and delete events, remove
          registrations, delete users, and set up other admin users. It also
          gives you the same functionality as a normal user.
        </p>
        <h3>For users</h3>
        <p>
          The Events Hive helps you discover and register for community events.
          Each event includes a Google Calendar integration that makes it easy
          to add events to your personal calendar.
        </p>
        <p>
          When you click "Add to Google Calendar", you'll be directed to
          Google's secure page where you can review the event details and choose
          to add it to your calendar.
        </p>
        {!user && (
          <>
            <div className="home-actions">
              <Link to="/login" className="btn-default">
                Log In
              </Link>
              <Link to="/signup" className="btn-default">
                Sign Up
              </Link>
            </div>
            <div className="home-links">
              <Link to="/privacy-policy" className="btn-link">
                Privacy Policy
              </Link>
              {" | "}
              <Link to="/terms-of-service" className="btn-link">
                Terms of Service
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

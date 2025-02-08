import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="wrapper">
      <div className="home-content">
        <h1>Welcome to Events Hub!</h1>
        <p>
          Events Hub helps you discover and register for community events. Each
          event includes a Google Calendar integration that makes it easy to add
          events to your personal calendar.
        </p>
        <p>
          When you click "Add to Google Calendar", you'll be directed to
          Google's secure page where you can review the event details and choose
          to add it to your calendar.
        </p>
        <div className="home-actions">
          <Link to="/login" className="btn-blue">
            Log In
          </Link>
          <Link to="/signup" className="btn">
            Sign Up
          </Link>
        </div>
        <div className="home-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          {" | "}
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Link to="/privacy-policy" className="footer-link">
          Privacy Policy
        </Link>
        <Link to="/terms-of-service" className="footer-link">
          Terms of Service
        </Link>
        <span>© 2024 Launchpad Events</span>
      </div>
    </footer>
  );
}

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login(email, password);
      console.log("Logged in successfully as:", user.role);
      navigate("/events");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="form login-form">
        <h2 className="form-title">Login</h2>

        <div className="form-row">
          <div className="input-group">
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>

        {error && (
          <div className="error-box">
            <p className="error-text">{error}</p>
          </div>
        )}

        <div className="btn-group">
          <button type="submit" className="btn-blue" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="form-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="link">
              Sign up
            </Link>
          </p>
          <div className="legal-links">
            <Link to="/privacy-policy" className="link">
              Privacy Policy
            </Link>
            <span className="separator">•</span>
            <Link to="/terms-of-service" className="link">
              Terms of Service
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;

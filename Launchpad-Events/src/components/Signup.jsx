import { useState } from "react";
import { signup } from "../hooks/api-hooks";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await signup(email, name, password);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form-title">Create Account</h2>

        <div className="form-row">
          <div className="input-group">
            <label className="label">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>

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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>

        <div className="form-footer">
          <p>Already have an account? </p>
          <Link to="/login" className="btn-default">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;

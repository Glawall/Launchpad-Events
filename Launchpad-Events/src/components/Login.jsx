import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      console.log("Logged in successfully as:", user.role);
      navigate("/events");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h2 className="title">Sign in to your account</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
          </div>
          {error && (
            <div className="error-box">
              <p className="error-text">{error}</p>
            </div>
          )}
          <button type="submit" className="btn-primary">
            Sign in
          </button>
          <button
            type="button"
            className="btn-secondary mt-4"
            onClick={() => navigate("/signup")}
          >
            Create an account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

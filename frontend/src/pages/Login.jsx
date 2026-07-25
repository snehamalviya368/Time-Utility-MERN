import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      toast.error(msg);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>⏰ Welcome Back</h2>
        <p className="auth-subtitle">Log in to sync your alarms and timers</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn">Log In</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "10px" }}>
  <Link to="/forgot-password" style={{ color: "#7c3aed", fontSize: "13px" }}>Forgot password?</Link>
</p>
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
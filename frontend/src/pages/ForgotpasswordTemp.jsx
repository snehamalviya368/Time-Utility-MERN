import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.put("/auth/forgot-password", { email, newPassword });
      toast.success("Password reset! You can log in now.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Reset failed";
      setError(msg);
      toast.error(msg);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>🔑 Reset Password</h2>
        <p className="auth-subtitle">Enter your email and a new password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your account email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New password (min 6 characters)"
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn">Reset Password</button>
        </form>
        <p className="auth-switch">
          Remembered it? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
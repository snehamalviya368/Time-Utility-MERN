import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function updateName() {
    if (!name.trim()) return toast.error("Name cannot be empty");
    try {
      const res = await api.put("/auth/profile", { name });
      setUser(res.data.user);
      toast.success("Name updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update name");
    }
  }

  async function changePassword() {
    if (!currentPassword || !newPassword) {
      return toast.error("Fill both password fields");
    }
    try {
      await api.put("/auth/change-password", { currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password");
    }
  }

  if (!user) {
    return (
      <div className="card">
        <h2>👤 Profile</h2>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>👤 Profile</h2>

      <div className="profile-section">
        <label className="profile-label">Email</label>
        <input type="text" value={user.email} disabled />

        <label className="profile-label">Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={updateName} className="profile-save-btn">Save Name</button>
      </div>

      <div className="profile-section" style={{ marginTop: "25px" }}>
        <h3 style={{ marginBottom: "12px" }}>Change Password</h3>
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password (min 6 characters)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={changePassword} className="profile-save-btn">Change Password</button>
      </div>

      <button
        onClick={() => { logout(); navigate("/login"); }}
        style={{ background: "#ef4444", color: "white", width: "100%", marginTop: "20px" }}
      >
        Log Out
      </button>
    </div>
  );
}
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ITEMS = [
  { key: "dashboard", label: "🏠 Dashboard" },
  { key: "weather", label: "🌦 Weather" },
  { key: "stopwatch", label: "⏱ Stopwatch" },
  { key: "timer", label: "⏳ Timer" },
  { key: "alarm", label: "⏰ Alarm" },
  { key: "worldclock", label: "🌍 World Clock" },
  { key: "calendar", label: "📅 Calendar" },
  { key: "progress", label: "📊 Progress" },
  { key: "todo", label: "✅ To-Do List" },
];

export default function Sidebar({ activeSection, onSelectSection }) {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <h2>⏰ Time Utility</h2>
      <ul>
        {ITEMS.map((item) => (
          <li
            key={item.key}
            onClick={() => onSelectSection(item.key)}
            style={{
              background: activeSection === item.key ? "#3b82f6" : "transparent"
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>

       {user && (
  <div style={{ marginTop: "30px", textAlign: "center", color: "#94a3b8" }}>
    <Link to="/profile" style={{ color: "#60a5fa", textDecoration: "underline", display: "block", marginBottom: "10px" }}>
      Hi, {user.name} (Profile)
    </Link>
          <button
            onClick={logout}
            style={{ background: "#ef4444", color: "white", width: "100%", padding: "10px" }}
          >
            Log Out
          </button>
        </div>
      )}
    </aside>
  );
}
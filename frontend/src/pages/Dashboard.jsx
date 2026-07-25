import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";
import Weather from "../components/Weather";
import Stopwatch from "../components/Stopwatch";
import Countdown from "../components/Countdown";
import Alarm from "../components/Alarm";
import WorldClock from "../components/WorldClock";
import Calendar from "../components/Calendar";
import DayProgress from "../components/DayProgress";
import Todo from "../components/Todo";

const SECTION_INFO = {
  weather: { title: "Weather", icon: "🌦", desc: "Live conditions for any city", color: "#3b82f6" },
  stopwatch: { title: "Stopwatch", icon: "⏱", desc: "Track elapsed time precisely", color: "#22c55e" },
  timer: { title: "Countdown Timer", icon: "⏳", desc: "Set a timer and save presets", color: "#f59e0b" },
  alarm: { title: "Alarms", icon: "⏰", desc: "Never miss an important moment", color: "#8b5cf6" },
  worldclock: { title: "World Clock", icon: "🌍", desc: "Track time across timezones", color: "#06b6d4" },
  calendar: { title: "Calendar", icon: "📅", desc: "Browse dates and months", color: "#ef4444" },
  progress: { title: "Day Progress", icon: "📊", desc: "See how much of today is gone", color: "#22c55e" },
  todo: { title: "To-Do List", icon: "✅", desc: "Keep track of your daily tasks", color: "#14b8a6" }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(user?.theme || "light");
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    if (user?.theme) setTheme(user.theme);
  }, [user]);

  useEffect(() => {
    document.body.style.background = theme === "dark" ? "#020617" : "#e2e8f0";
  }, [theme]);

  async function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (user) {
      try {
        await api.put("/user/theme", { theme: next });
      } catch (err) {
        console.error(err);
      }
    }
  }

  function renderSectionContent() {
    switch (activeSection) {
      case "weather": return <Weather />;
      case "stopwatch": return <Stopwatch />;
      case "timer": return <Countdown />;
      case "alarm": return <Alarm />;
      case "worldclock": return <WorldClock />;
      case "calendar": return <Calendar />;
      case "progress": return <DayProgress />;
      case "todo": return <Todo />;
      default: return null;
    }
  }

  const info = SECTION_INFO[activeSection];

  return (
    <div className={`container ${theme === "dark" ? "dark-mode" : ""}`}>
      <Sidebar activeSection={activeSection} onSelectSection={setActiveSection} />

      {/* <main className="main"> */}
      <main className={`main ${activeSection === "dashboard" ? "main-dashboard" : ""}`}>
        {!user && (
          <div className="guest-banner">
            You're browsing as a guest — alarms and timer presets won't be saved.{" "}
            <Link to="/login">Log in</Link> or <Link to="/signup">sign up</Link> to keep your data.
          </div>
        )}

        {activeSection === "dashboard" ? (
          <Hero theme={theme} onToggleTheme={toggleTheme} />
        ) : (
          <div className="section-focus">
            <div className="section-header" style={{ borderColor: info.color }}>
              <span className="section-icon" style={{ background: info.color }}>{info.icon}</span>
              <div>
                <h2>{info.title}</h2>
                <p>{info.desc}</p>
              </div>
            </div>

            <div className="section-body">
              {renderSectionContent()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  function enterApp() {
    setShowSplash(false);
  }

  if (showSplash) {
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hourHandDeg = ((now.getHours() % 12) / 12) * 360 + (minutes / 60) * 30;
    const minHandDeg = (minutes / 60) * 360;
    const secHandDeg = (seconds / 60) * 360;

    return (
      <div className="splash-screen" onClick={enterApp}>
        <div className="splash-analog-clock">
          <div className="clock-face">
            <div className="clock-hand hour-hand" style={{ transform: `rotate(${hourHandDeg}deg)` }}></div>
            <div className="clock-hand min-hand" style={{ transform: `rotate(${minHandDeg}deg)` }}></div>
            <div className="clock-hand sec-hand" style={{ transform: `rotate(${secHandDeg}deg)` }}></div>
            <div className="clock-center"></div>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="clock-tick" style={{ transform: `rotate(${i * 30}deg)` }}></div>
            ))}
          </div>
        </div>
        <h1 className="splash-title">Time Utility</h1>
        <p className="splash-subtitle">Everything time-related, in one place</p>
        <button className="splash-enter-btn" onClick={enterApp}>Tap to Enter →</button>
      </div>
    );
  }

  return (
    <div className="app-fade-in">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}
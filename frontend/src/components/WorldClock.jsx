import { useState, useEffect } from "react";

const ZONES = [
  { flag: "🇮🇳", label: "India", tz: "Asia/Kolkata", locale: "en-IN", color: "#f59e0b" },
  { flag: "🇺🇸", label: "New York", tz: "America/New_York", locale: "en-US", color: "#3b82f6" },
  { flag: "🇬🇧", label: "London", tz: "Europe/London", locale: "en-GB", color: "#ef4444" },
  { flag: "🇯🇵", label: "Tokyo", tz: "Asia/Tokyo", locale: "ja-JP", color: "#22c55e" }
];

export default function WorldClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <h2>🌍 World Clock</h2>
      <div className="world-clock-grid">
        {ZONES.map((z, i) => (
          <div
            className="world-clock-tile"
            key={z.tz}
            style={{ animationDelay: `${i * 0.12}s`, borderColor: z.color }}
          >
            <div className="world-clock-flag">{z.flag}</div>
            <div className="world-clock-label">
              {z.label}
              <span className="live-dot" style={{ background: z.color }}></span>
            </div>
            <div className="world-clock-time" style={{ color: z.color }}>
              {now.toLocaleTimeString(z.locale, {
                timeZone: z.tz,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Countdown() {
  const { user } = useAuth();
  const [minutesInput, setMinutesInput] = useState("");
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [initialSeconds, setInitialSeconds] = useState(0);
  const [presets, setPresets] = useState([]);
  const [presetLabel, setPresetLabel] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    if (user) setPresets(user.timerPresets || []);
  }, [user]);

  function tick() {
    setTotalSeconds((prev) => {
      if (prev <= 0) {
        clearInterval(intervalRef.current);
        return 0;
      }
      return prev - 1;
    });
  }

  function start() {
    if (totalSeconds === 0) {
      const secs = Number(minutesInput || 0) * 60;
      setTotalSeconds(secs);
      setInitialSeconds(secs);
    }
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 1000);
  }

  function pause() {
    clearInterval(intervalRef.current);
  }

  function reset() {
    clearInterval(intervalRef.current);
    setTotalSeconds(0);
    setInitialSeconds(0);
    setMinutesInput("");
  }

  async function savePreset() {
    if (!presetLabel.trim() || !minutesInput) return;
    try {
      const res = await api.post("/user/timer-presets", {
        label: presetLabel.trim(),
        minutes: Number(minutesInput)
      });
      setPresets(res.data.timerPresets);
      setPresetLabel("");
    } catch (err) {
      console.error(err);
    }
  }

  async function deletePreset(id) {
    try {
      const res = await api.delete(`/user/timer-presets/${id}`);
      setPresets(res.data.timerPresets);
    } catch (err) {
      console.error(err);
    }
  }

  const min = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const sec = String(totalSeconds % 60).padStart(2, "0");

  const progress = initialSeconds > 0 ? (totalSeconds / initialSeconds) : 0;
  const circumference = 2 * Math.PI * 65;
  const offset = circumference - progress * circumference;

  return (
    <div className="card">
      <h2>⏳ Countdown</h2>
      <input
        type="number"
        placeholder="Minutes"
        value={minutesInput}
        onChange={(e) => setMinutesInput(e.target.value)}
      />

      <div className="countdown-ring-wrap">
        <svg width="160" height="160">
          <circle cx="80" cy="80" r="65" className="countdown-bg-ring" />
          <circle
            cx="80" cy="80" r="65"
            className="countdown-progress-ring"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: initialSeconds > 0 ? offset : circumference
            }}
          />
        </svg>
        <div className="countdown-center-text">
          <div className="hourglass">⏳</div>
          <h1>{min}:{sec}</h1>
        </div>
      </div>

      <div className="btns">
        <button id="timerStart" onClick={start}>Start</button>
        <button id="timerPause" onClick={pause}>Pause</button>
        <button id="timerReset" onClick={reset}>Reset</button>
      </div>

      {user && (
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Preset name (e.g. Pomodoro)"
              value={presetLabel}
              onChange={(e) => setPresetLabel(e.target.value)}
              style={{ margin: 0 }}
            />
            <button onClick={savePreset} style={{ background: "#8b5cf6", color: "white" }}>
              Save
            </button>
          </div>

          {presets.length > 0 && (
            <ul style={{ listStyle: "none", marginTop: "12px" }}>
              {presets.map((p) => (
                <li
                  key={p._id}
                  className="preset-item"
                  onClick={() => setMinutesInput(String(p.minutes))}
                >
                  <span>{p.label} — {p.minutes} min</span>
                  <button
                    className="deleteBtn"
                    onClick={(e) => { e.stopPropagation(); deletePreset(p._id); }}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
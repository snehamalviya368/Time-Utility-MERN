import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Alarm() {
  const { user } = useAuth();
  const [alarmTime, setAlarmTime] = useState("");
  const [alarms, setAlarms] = useState([]);
  const [status, setStatus] = useState("");
  const [isRinging, setIsRinging] = useState(false);
  const audioCtxRef = useRef(null);
  const beepIntervalRef = useRef(null);

  useEffect(() => {
    if (user) setAlarms(user.alarms || []);
  }, [user]);

  function playBeep() {
    const ctx = audioCtxRef.current;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.4);
  }

  function startRinging() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    setIsRinging(true);
    playBeep();
    beepIntervalRef.current = setInterval(playBeep, 600);
  }

  function stopAlarm() {
    clearInterval(beepIntervalRef.current);
    setIsRinging(false);
    setStatus("Alarm Stopped");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime =
        String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
      const match = alarms.find((a) => a.time === currentTime);
      if (match && !isRinging) {
        startRinging();
        setStatus("🔔 Alarm Ringing...");
        deleteAlarm(match._id);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [alarms, isRinging]);

  async function addAlarm() {
    if (!alarmTime) {
      toast.error("Please select alarm time");
      return;
    }
    if (!user) {
      toast.error("Log in to save alarms across sessions");
      return;
    }
    try {
      const res = await api.post("/user/alarms", { time: alarmTime });
      setAlarms(res.data.alarms);
      setStatus("✅ Alarm Added");
      setAlarmTime("");
      toast.success("Alarm added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add alarm");
    }
  }

  async function deleteAlarm(id) {
    try {
      const res = await api.delete(`/user/alarms/${id}`);
      setAlarms(res.data.alarms);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="card">
      <h2>⏰ Alarm</h2>

      <div className={`alarm-bell-wrap ${isRinging ? "ringing" : ""}`}>
        <div className="alarm-bell">🔔</div>
      </div>

      <input type="time" value={alarmTime} onChange={(e) => setAlarmTime(e.target.value)} />
      <button id="setAlarm" onClick={addAlarm}>➕ Add Alarm</button>

      <ul id="alarmList">
        {alarms.map((a, i) => (
          <li key={a._id} style={{ animationDelay: `${i * 0.08}s` }} className="alarm-item">
            {a.time}
            <button className="deleteBtn" onClick={() => deleteAlarm(a._id)}>❌</button>
          </li>
        ))}
      </ul>

      <button id="stopAlarm" onClick={stopAlarm}>Stop Alarm</button>
      <p id="alarmStatus">{status}</p>
      {!user && <p style={{ fontSize: "13px", color: "#64748b", marginTop: "8px" }}>Log in to save alarms permanently.</p>}
    </div>
  );
}
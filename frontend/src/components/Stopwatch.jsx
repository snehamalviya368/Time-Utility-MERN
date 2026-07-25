import { useState, useRef } from "react";

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  function start() {
    clearInterval(timerRef.current);
    setRunning(true);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function pause() {
    clearInterval(timerRef.current);
    setRunning(false);
  }

  function reset() {
    clearInterval(timerRef.current);
    setRunning(false);
    setSeconds(0);
  }

  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  return (
    <div className="card">
      <h2>⏱ Stopwatch</h2>

      <div className="stopwatch-display-wrap">
        <div className={`stopwatch-ring ${running ? "spinning" : ""}`}></div>
        <h1>{h}:{m}:{s}</h1>
      </div>

      <div className={`running-badge ${running ? "on" : "off"}`}>
        <span className="running-dot"></span>
        {running ? "Running" : "Paused"}
      </div>

      <div className="btns">
        <button id="startBtn" onClick={start}>Start</button>
        <button id="pauseBtn" onClick={pause}>Pause</button>
        <button id="resetBtn" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
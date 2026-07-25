import { useState, useEffect } from "react";

export default function DayProgress() {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    function update() {
      const now = new Date();
      const totalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      setPercentage((totalSeconds / 86400) * 100);
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="card">
      <h2>📊 Day Progress</h2>
      <div className="progressBox">
        <div className="circle glow-pulse">
          <svg width="170" height="170">
            <circle cx="85" cy="85" r={radius} className="bgCircle" />
            <circle
              cx="85"
              cy="85"
              r={radius}
              className="progressCircle"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset
              }}
            />
          </svg>
          <div id="progressText">{percentage.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}
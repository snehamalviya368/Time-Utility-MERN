import { useState, useEffect } from "react";
import nightSVG from "../assets/night.svg";
import morningSVG from "../assets/morning.svg";

export default function Hero({ theme, onToggleTheme }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hour = now.getHours();
  const minute = String(now.getMinutes()).padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  let displayHour = hour % 12;
  displayHour = displayHour ? displayHour : 12;
  displayHour = String(displayHour).padStart(2, "0");

  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  let greeting = "🌞 Good Morning";
  let timeOfDay = "morning";

  if (hour >= 5 && hour < 12) {
    greeting = "🌞 Good Morning";
    timeOfDay = "morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "☀️ Good Afternoon";
    timeOfDay = "day";
  } else if (hour >= 17 && hour < 20) {
    greeting = "🌇 Good Evening";
    timeOfDay = "evening";
  } else {
    greeting = "🌙 Good Night";
    timeOfDay = "night";
  }

  return (
    <section className={`hero-full sky-${timeOfDay}`}>

      {timeOfDay === "night" && (
        <img src={nightSVG} alt="night sky" className="hero-svg-full" />
      )}

      {(timeOfDay === "morning" || timeOfDay === "day") && (
        <img src={morningSVG} alt="sunrise sky" className="hero-svg-full" />
      )}

      <div className="hero-overlay-side">
        <h2 id="greeting">{greeting}</h2>
        <h1 id="clock">{displayHour}:{minute} {ampm}</h1>
        <h3 id="date">{dateString}</h3>
        <button id="themeBtn" onClick={onToggleTheme}>
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </section>
  );
}
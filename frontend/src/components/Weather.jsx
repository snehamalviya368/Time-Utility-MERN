import { useState, useEffect } from "react";
import api from "../api/axios";

const CONDITION_ICONS = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Haze: "🌫️",
  Fog: "🌫️"
};

function getSceneType(condition) {
  if (!condition) return "clear";
  if (condition === "Clear") return "clear";
  if (condition === "Clouds") return "clouds";
  if (condition === "Rain" || condition === "Drizzle") return "rain";
  if (condition === "Thunderstorm") return "storm";
  if (condition === "Snow") return "snow";
  return "clouds";
}

export default function Weather() {
  const [cityInput, setCityInput] = useState("");
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchAll(params) {
    try {
      setLoading(true);
      setError("");
      const [weatherRes, forecastRes] = await Promise.all([
        api.get("/weather", { params }),
        api.get("/weather/forecast", { params })
      ]);
      setData(weatherRes.data);
      setForecast(forecastRes.data.forecast || []);
    } catch (err) {
      setError("City not found");
      setData(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          fetchAll({ lat: position.coords.latitude, lon: position.coords.longitude }),
        () => fetchAll({ city: "Indore" })
      );
    } else {
      fetchAll({ city: "Indore" });
    }
  }, []);

  function handleSearch() {
    if (cityInput.trim() !== "") fetchAll({ city: cityInput.trim() });
  }

  const condition = data?.weather[0]?.main;
  const icon = CONDITION_ICONS[condition] || "🌡️";
  const scene = getSceneType(condition);

  return (
    <div className="card weather-card">
      <h2>🌦 Weather</h2>

      <div className="weather-search">
        <input
          type="text"
          placeholder="Enter City"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className={`weather-scene scene-${scene}`}>
        {scene === "clear" && <div className="w-sun"></div>}

        {scene === "clouds" && (
          <>
            <div className="w-sun small"></div>
            <div className="w-cloud w-cloud1">☁️</div>
            <div className="w-cloud w-cloud2">☁️</div>
          </>
        )}

        {(scene === "rain" || scene === "storm") && (
          <>
            <div className="w-cloud w-cloud1 dark">☁️</div>
            <div className="w-cloud w-cloud2 dark">☁️</div>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-raindrop"
                style={{
                  left: `${8 + i * 7}%`,
                  animationDelay: `${(i % 5) * 0.15}s`,
                  animationDuration: `${0.6 + (i % 3) * 0.15}s`
                }}
              ></div>
            ))}
            {scene === "storm" && <div className="w-lightning">⚡</div>}
          </>
        )}

        {scene === "snow" && (
          <>
            <div className="w-cloud w-cloud1">☁️</div>
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="w-snowflake"
                style={{
                  left: `${5 + i * 6.5}%`,
                  animationDelay: `${(i % 6) * 0.4}s`,
                  animationDuration: `${3 + (i % 4)}s`
                }}
              >
                ❄
              </div>
            ))}
          </>
        )}
      </div>

      <div className={`weather-main-display ${loading ? "loading" : "loaded"}`} key={data ? data.name : "empty"}>
        <div className="weather-icon-float">{loading ? "🔄" : icon}</div>
        <h1>{data ? `${Math.round(data.main.temp)}°C` : "--°C"}</h1>
        <p className="weather-condition-text">{error || (data ? condition : "Loading...")}</p>
      </div>

      {data && (
        <div className="weather-stats-grid">
          <div className="weather-stat">
            <span className="weather-stat-label">💧 Humidity</span>
            <span className="weather-stat-value">{data.main.humidity}%</span>
          </div>
          <div className="weather-stat">
            <span className="weather-stat-label">💨 Wind</span>
            <span className="weather-stat-value">{data.wind.speed} m/s</span>
          </div>
          <div className="weather-stat">
            <span className="weather-stat-label">📍 City</span>
            <span className="weather-stat-value">{data.name}</span>
          </div>
          <div className="weather-stat">
            <span className="weather-stat-label">🌅 Sunrise</span>
            <span className="weather-stat-value">{new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="weather-stat">
            <span className="weather-stat-label">🌇 Sunset</span>
            <span className="weather-stat-value">{new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast-section">
          <h3 className="forecast-title">5-Day Forecast</h3>
          <div className="forecast-scroll">
            {forecast.map((day, i) => {
              const date = new Date(day.dt * 1000);
              const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
              const dayIcon = CONDITION_ICONS[day.weather[0].main] || "🌡️";
              return (
                <div className="forecast-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                  <span className="forecast-day">{dayName}</span>
                  <span className="forecast-icon">{dayIcon}</span>
                  <span className="forecast-temp">{Math.round(day.main.temp)}°C</span>
                  <span className="forecast-condition">{day.weather[0].main}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
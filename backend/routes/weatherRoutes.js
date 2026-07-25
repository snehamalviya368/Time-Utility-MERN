const express = require("express");
const axios = require("axios");

const router = express.Router();

// GET /api/weather?city=Indore
// GET /api/weather?lat=22.7&lon=75.8
router.get("/", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Weather API key not configured on server" });
    }

    let url;

    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${apiKey}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else {
      return res.status(400).json({ message: "Provide either city or lat & lon" });
    }

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(500).json({ message: "Failed to fetch weather", error: error.message });
  }
});

// GET /api/weather/forecast?city=Indore
// GET /api/weather/forecast?lat=22.7&lon=75.8
router.get("/forecast", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Weather API key not configured on server" });
    }

    let url;

    if (city) {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${apiKey}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else {
      return res.status(400).json({ message: "Provide either city or lat & lon" });
    }

    const response = await axios.get(url);

    // API gives data every 3 hours for 5 days.
    // We pick one entry per day (closest to 12:00 PM) to build a clean 5-day summary.
    const dailyMap = {};

    response.data.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
      const hour = entry.dt_txt.split(" ")[1];

      if (!dailyMap[date] || hour === "12:00:00") {
        dailyMap[date] = entry;
      }
    });

    const dailyForecast = Object.values(dailyMap).slice(0, 5);

    res.json({
      city: response.data.city.name,
      forecast: dailyForecast
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(500).json({ message: "Failed to fetch forecast", error: error.message });
  }
});

module.exports = router;
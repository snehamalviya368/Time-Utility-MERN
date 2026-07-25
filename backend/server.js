require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const userDataRoutes = require("./routes/userDataRoutes");

const app = express();

connectDB();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Time Utility API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/user", userDataRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// ---------- THEME ----------

router.put("/theme", async (req, res) => {
  try {
    const { theme } = req.body;
    if (!["light", "dark"].includes(theme)) {
      return res.status(400).json({ message: "Theme must be 'light' or 'dark'" });
    }
    const user = await User.findByIdAndUpdate(req.userId, { theme }, { new: true });
    res.json({ theme: user.theme });
  } catch (error) {
    res.status(500).json({ message: "Failed to update theme", error: error.message });
  }
});

// ---------- ALARMS ----------

router.post("/alarms", async (req, res) => {
  try {
    const { time, label } = req.body;
    if (!time) return res.status(400).json({ message: "Alarm time is required" });

    const user = await User.findById(req.userId);
    const exists = user.alarms.some((a) => a.time === time);
    if (exists) return res.status(400).json({ message: "Alarm already exists" });

    user.alarms.push({ time, label: label || "" });
    await user.save();
    res.status(201).json({ alarms: user.alarms });
  } catch (error) {
    res.status(500).json({ message: "Failed to add alarm", error: error.message });
  }
});

router.delete("/alarms/:alarmId", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.alarms = user.alarms.filter((a) => a._id.toString() !== req.params.alarmId);
    await user.save();
    res.json({ alarms: user.alarms });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete alarm", error: error.message });
  }
});

// ---------- TIMER PRESETS ----------

router.post("/timer-presets", async (req, res) => {
  try {
    const { label, minutes } = req.body;
    if (!label || !minutes) {
      return res.status(400).json({ message: "Label and minutes are required" });
    }
    const user = await User.findById(req.userId);
    user.timerPresets.push({ label, minutes });
    await user.save();
    res.status(201).json({ timerPresets: user.timerPresets });
  } catch (error) {
    res.status(500).json({ message: "Failed to add preset", error: error.message });
  }
});

router.delete("/timer-presets/:presetId", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.timerPresets = user.timerPresets.filter(
      (p) => p._id.toString() !== req.params.presetId
    );
    await user.save();
    res.json({ timerPresets: user.timerPresets });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete preset", error: error.message });
  }
});

// ---------- FAVORITE CITIES ----------

router.post("/favorite-cities", async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) return res.status(400).json({ message: "City is required" });
    const user = await User.findById(req.userId);
    if (!user.favoriteCities.includes(city)) {
      user.favoriteCities.push(city);
      await user.save();
    }
    res.status(201).json({ favoriteCities: user.favoriteCities });
  } catch (error) {
    res.status(500).json({ message: "Failed to add city", error: error.message });
  }
});

router.delete("/favorite-cities/:city", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.favoriteCities = user.favoriteCities.filter((c) => c !== req.params.city);
    await user.save();
    res.json({ favoriteCities: user.favoriteCities });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove city", error: error.message });
  }
});

// ---------- TODOS ----------

router.post("/todos", async (req, res) => {
  try {
    const { text, priority, dueDate } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: "Task text is required" });

    const user = await User.findById(req.userId);
    user.todos.push({
      text: text.trim(),
      completed: false,
      priority: priority || "medium",
      dueDate: dueDate || ""
    });
    await user.save();
    res.status(201).json({ todos: user.todos });
  } catch (error) {
    res.status(500).json({ message: "Failed to add task", error: error.message });
  }
});

router.put("/todos/:todoId/toggle", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const todo = user.todos.id(req.params.todoId);
    if (!todo) return res.status(404).json({ message: "Task not found" });

    todo.completed = !todo.completed;
    await user.save();
    res.json({ todos: user.todos });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
});

router.put("/todos/:todoId", async (req, res) => {
  try {
    const { text, priority, dueDate } = req.body;
    const user = await User.findById(req.userId);
    const todo = user.todos.id(req.params.todoId);
    if (!todo) return res.status(404).json({ message: "Task not found" });

    if (text !== undefined) todo.text = text;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;

    await user.save();
    res.json({ todos: user.todos });
  } catch (error) {
    res.status(500).json({ message: "Failed to edit task", error: error.message });
  }
});

router.delete("/todos/:todoId", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.todos = user.todos.filter((t) => t._id.toString() !== req.params.todoId);
    await user.save();
    res.json({ todos: user.todos });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
});

module.exports = router;
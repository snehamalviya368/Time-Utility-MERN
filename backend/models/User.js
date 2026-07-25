const mongoose = require("mongoose");

const alarmSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    label: { type: String, default: "" }
  },
  { _id: true }
);

const timerPresetSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    minutes: { type: Number, required: true }
  },
  { _id: true }
);

const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: { type: String, default: "" }
  },
  { _id: true, timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    favoriteCities: { type: [String], default: [] },
    alarms: { type: [alarmSchema], default: [] },
    timerPresets: { type: [timerPresetSchema], default: [] },
    todos: { type: [todoSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
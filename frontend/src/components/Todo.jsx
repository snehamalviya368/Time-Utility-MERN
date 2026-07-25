import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PRIORITY_COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e"
};

export default function Todo() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (user) setTodos(user.todos || []);
  }, [user]);

  async function addTodo() {
    if (!text.trim()) return;
    if (!user) {
      toast.error("Log in to save your to-do list");
      return;
    }
    try {
      const res = await api.post("/user/todos", { text, priority, dueDate });
      setTodos(res.data.todos);
      setText("");
      setDueDate("");
      toast.success("Task added!");
    } catch (err) {
      console.error(err);
      toast.error("Could not add task");
    }
  }

  async function toggleTodo(id) {
    try {
      const res = await api.put(`/user/todos/${id}/toggle`);
      setTodos(res.data.todos);
    } catch (err) {
      console.error(err);
      toast.error("Could not update task");
    }
  }

  async function deleteTodo(id) {
    try {
      const res = await api.delete(`/user/todos/${id}`);
      setTodos(res.data.todos);
      toast.success("Task deleted");
    } catch (err) {
      console.error(err);
      toast.error("Could not delete task");
    }
  }

  function startEdit(todo) {
    setEditingId(todo._id);
    setEditText(todo.text);
  }

  async function saveEdit(id) {
    if (!editText.trim()) return;
    try {
      const res = await api.put(`/user/todos/${id}`, { text: editText.trim() });
      setTodos(res.data.todos);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast.error("Could not save changes");
    }
  }

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  function isOverdue(todo) {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date(new Date().toDateString());
  }

  return (
    <div className="card">
      <h2>✅ To-Do List</h2>

      <div className="todo-input-row">
        <input
          type="text"
          placeholder="Add a task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button className="todo-add-btn" onClick={addTodo}>➕</button>
      </div>

      <div className="todo-meta-row">
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="todo-priority-select">
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="todo-date-input"
        />
      </div>

      {todos.length > 0 && (
        <>
          <div className="todo-progress-bar">
            <div className="todo-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="todo-filter-tabs">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                className={`todo-filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </>
      )}

      <ul className="todo-list">
        {filteredTodos.map((t, i) => (
          <li
            key={t._id}
            className={`todo-item ${t.completed ? "completed" : ""}`}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <label className="todo-checkbox-wrap">
              <input type="checkbox" checked={t.completed} onChange={() => toggleTodo(t._id)} />
              <span className="todo-checkmark"></span>
            </label>

            <span
              className="todo-priority-dot"
              style={{ background: PRIORITY_COLORS[t.priority || "medium"] }}
            ></span>

            {editingId === t._id ? (
              <input
                className="todo-edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit(t._id)}
                onBlur={() => saveEdit(t._id)}
                autoFocus
              />
            ) : (
              <span className="todo-text" onDoubleClick={() => startEdit(t)}>
                {t.text}
                {t.dueDate && (
                  <span className={`todo-due-badge ${isOverdue(t) ? "overdue" : ""}`}>
                    📅 {new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                )}
              </span>
            )}

            <button className="deleteBtn" onClick={() => deleteTodo(t._id)}>❌</button>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "15px" }}>
          {todos.length === 0 ? "No tasks yet — add one above!" : "Nothing here"}
        </p>
      )}

      {!user && (
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "10px" }}>
          Log in to save your to-do list permanently.
        </p>
      )}
    </div>
  );
}
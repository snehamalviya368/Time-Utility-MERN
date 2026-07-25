import { useState, useEffect } from "react";

export default function Card({ title, icon, children, className = "" }) {
  const [expanded, setExpanded] = useState(false);

  // Let Escape key close the fullscreen view too
  useEffect(() => {
    if (!expanded) return;
    function onKey(e) {
      if (e.key === "Escape") setExpanded(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  return (
    <div className={`card ${className} ${expanded ? "card-fullscreen" : ""}`}>
      <div className="card-header">
        <h2>
          {icon} {title}
        </h2>
        <button
          className="expandBtn"
          onClick={() => setExpanded((e) => !e)}
          title={expanded ? "Exit full screen" : "Full screen"}
          aria-label={expanded ? "Exit full screen" : "Full screen"}
        >
          {expanded ? "✖" : "⛶"}
        </button>
      </div>

      {children}
    </div>
  );
}

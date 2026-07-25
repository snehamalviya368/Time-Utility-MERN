import { useState } from "react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState("next");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthYearLabel = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let day = 1; day <= lastDate; day++) cells.push(day);

  function isToday(day) {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  }

  function goPrev() {
    setDirection("prev");
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function goNext() {
    setDirection("next");
    setCurrentDate(new Date(year, month + 1, 1));
  }

  return (
    <div className="card">
      <h2>📅 Calendar</h2>
      <div className="calendar-header">
        <button onClick={goPrev}>◀</button>
        <h3>{monthYearLabel}</h3>
        <button onClick={goNext}>▶</button>
      </div>

      <div className="days">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      <div className={`dates anim-${direction}`} key={monthYearLabel}>
        {cells.map((day, idx) => (
          <div key={idx} className={day && isToday(day) ? "today" : ""}>
            {day || ""}
          </div>
        ))}
      </div>
    </div>
  );
}
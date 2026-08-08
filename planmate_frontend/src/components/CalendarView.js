import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/styles.css';
import './CalendarView.css';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [tasks, setTasks] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (storedUser && storedUser.id) {
      axios.get(`http://localhost:8080/api/tasks/user/${storedUser.id}`)
        .then(response => {
          setTasks(response.data);
        })
        .catch(error => {
          console.error("Error fetching tasks:", error);
        });
    }
  }, [storedUser]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const days = dayHeaders.map((day, idx) => (
      <div key={`header-${idx}`} className="calendar-day-header">{day}</div>
    ));

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const thisDate = new Date(year, month, d);
      const thisDateStr = thisDate.toISOString().split('T')[0];

      const dayTasks = tasks.filter(task => task.dueDate === thisDateStr);

      days.push(
        <div key={d} className="calendar-day">
          <div className="calendar-day-number">{d}</div>
          {dayTasks.map((task, idx) => (
            <div key={idx} className="calendar-task">
              📌 {task.title}
            </div>
          ))}
        </div>
      );
    }

    setCalendarDays(days);
  }, [currentDate, tasks]);

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  return (
    <div className="calendar-view">
      <h2 className="calendar-title">
        {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
      </h2>

      <div className="calendar-nav">
        <button onClick={() => changeMonth(-12)}>Prev Year</button>
        <button onClick={() => changeMonth(-1)}>Prev Month</button>
        <button onClick={() => changeMonth(1)}>Next Month</button>
        <button onClick={() => changeMonth(12)}>Next Year</button>
      </div>

      <div className="calendar-grid">
        {calendarDays}
      </div>
    </div>
  );
};

export default CalendarView;

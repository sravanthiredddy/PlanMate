import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Notifications() {
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
    } else {
      console.warn("No valid user found in localStorage");
    }
  }, [storedUser]);

  const notifications = tasks
    .filter(task => (task.status || "").toLowerCase() !== "completed")
    .map(task => {
      if (!task.dueDate) return null; // Skip tasks without due date

      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const isToday = dueDate.toDateString() === today.toDateString();

      if (isToday) {
        return {
          message: `📌 Task "${task.title}" is due today.`,
          time: "Just now"
        };
      } else if (dueDate < today) {
        return {
          message: `⚠️ Task "${task.title}" is overdue.`,
          time: "Overdue"
        };
      } else {
        return {
          message: `⏳ Task "${task.title}" is due on ${dueDate.toDateString()}.`,
          time: ""
        };
      }
    })
    .filter(note => note !== null); // Remove skipped tasks

  return (
    <div
      style={{
        width: '500px',
        background: '#fff',
        color: '#333',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 6px 14px rgba(0,0,0,0.15)',
        padding: '20px',
        margin: '40px auto',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid #ddd',
          paddingBottom: '12px',
          marginBottom: '16px',
          fontWeight: 'bold',
          fontSize: '20px',
        }}
      >
        Notifications
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {notifications.length > 0 ? (
          notifications.map((note, index) => (
            <div key={index} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
              {note.message}
              <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{note.time}</div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#888' }}>No new notifications</div>
        )}
      </div>
    </div>
  );
}

export default Notifications;

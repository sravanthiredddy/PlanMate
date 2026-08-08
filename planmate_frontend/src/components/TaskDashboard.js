import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import '../assets/styles.css';

function TaskDashboard() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [tasks, setTasks] = useState([]);

  // FETCH TASKS ✅ (fixed warning)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?.id) {
      axios.get(`http://localhost:8080/api/tasks/user/${storedUser.id}`)
        .then(res => setTasks(res.data))
        .catch(err => console.error("Error fetching tasks:", err));
    }
  }, []); // ✅ no dependency issue now

  // CHART
  useEffect(() => {
    if (!chartRef.current || tasks.length === 0) return;

    const completedCount = tasks.filter(
      task => task?.status?.toLowerCase() === "completed"
    ).length;

    const pendingCount = tasks.filter(
      task => task?.status?.toLowerCase() === "pending"
    ).length;

    const today = new Date();

    const overdueCount = tasks.filter(task => {
      if (!task?.dueDate) return false;
      const due = new Date(task.dueDate);
      return task?.status?.toLowerCase() !== "completed" && due < today;
    }).length;

    // destroy old chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending', 'Overdue'],
        datasets: [{
          data: [completedCount, pendingCount, overdueCount],
          backgroundColor: ['#28a745', '#ffc107', '#dc3545']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Task Status Overview'
          }
        }
      }
    });

    // cleanup
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };

  }, [tasks]);

  // SAFE COUNTS
  const completedCount = tasks.filter(
    task => task?.status?.toLowerCase() === "completed"
  ).length;

  const pendingCount = tasks.filter(
    task => task?.status?.toLowerCase() === "pending"
  ).length;

  const today = new Date();

  const overdueCount = tasks.filter(task => {
    if (!task?.dueDate) return false;
    const due = new Date(task.dueDate);
    return task?.status?.toLowerCase() !== "completed" && due < today;
  }).length;

  return (
    <section className="dashboard" style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      margin: '40px auto',
      maxWidth: '600px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      color: '#000'
    }}>
      <h2 style={{ textAlign: 'center' }}>Dashboard</h2>

      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '20px'
      }}>
        <div style={{ flex: '1', padding: '10px', background: '#f0f8ff', borderRadius: '8px' }}>
          <h3>Total Tasks</h3>
          <div>{tasks.length}</div>
        </div>

        <div style={{ flex: '1', padding: '10px', background: '#f0f8ff', borderRadius: '8px' }}>
          <h3>Completed</h3>
          <div>{completedCount}</div>
        </div>

        <div style={{ flex: '1', padding: '10px', background: '#f0f8ff', borderRadius: '8px' }}>
          <h3>Pending</h3>
          <div>{pendingCount}</div>
        </div>

        <div style={{ flex: '1', padding: '10px', background: '#f0f8ff', borderRadius: '8px' }}>
          <h3>Overdue</h3>
          <div>{overdueCount}</div>
        </div>
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        height: '300px',
        margin: '0 auto'
      }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </section>
  );
}

export default TaskDashboard;
import React, { useEffect, useState } from 'react';
import '../assets/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const fetchTasks = async () => {
    if (storedUser && storedUser.id) {
      try {
        const res = await fetch(`http://localhost:8080/api/tasks/user/${storedUser.id}`);
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      if (storedUser && storedUser.id) {
        try {
          const res = await fetch(`http://localhost:8080/api/tasks/user/${storedUser.id}`);
          if (!res.ok) throw new Error("Failed to fetch tasks");
          const data = await res.json();
          setTasks(data);
        } catch (err) {
          console.error("Error fetching tasks:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTasks();
  }, [storedUser]);

  const handleComplete = async (task) => {
    try {
      await fetch(`http://localhost:8080/api/tasks/user/${storedUser.id}/task/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, status: "COMPLETED" })
      });
      fetchTasks();
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  const handleEdit = async (task) => {
    const newTitle = prompt("Enter new task title:", task.title);
    const newDescription = prompt("Enter new task description:", task.description);

    if (newTitle || newDescription) {
      try {
        await fetch(`http://localhost:8080/api/tasks/user/${storedUser.id}/task/${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...task,
            title: newTitle || task.title,
            description: newDescription || task.description
          })
        });
        fetchTasks();
      } catch (err) {
        console.error("Error editing task:", err);
      }
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await fetch(`http://localhost:8080/api/tasks/user/${storedUser.id}/task/${taskId}`, {
        method: "DELETE"
      });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <section className="task-list">
      <div className="task-list-header">
        <h2>My Tasks</h2>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'gray' }}>Loading tasks...</p>
      ) : (
        <div className="task-cards" id="task-container">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`task-item priority-${task.priority ? task.priority.toLowerCase() : 'low'} ${task.status === 'COMPLETED' ? 'completed' : ''}`}
            >
             <div className="task-title" style={{ color: 'black' }}>{task.title}</div>
            <div className="task-description" style={{ color: 'black' }}>{task.description}</div>
            <div className="task-meta" style={{ color: 'black' }}>
            <span className="task-due-date">Due: {task.dueDate || 'N/A'}</span>
            <span className="task-category">{task.category || 'N/A'}</span>
            </div>

              <div className="task-actions">
                {task.status !== 'COMPLETED' && (
                  <button className="complete-btn" onClick={() => handleComplete(task)}>
                    <FontAwesomeIcon icon={faCheck} /> Complete
                  </button>
                )}
                <button className="edit-btn" onClick={() => handleEdit(task)}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(task.id)}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <p style={{ textAlign: 'center', color: 'gray' }}>No tasks left.</p>
          )}
        </div>
      )}
    </section>
  );
}

export default TaskList;

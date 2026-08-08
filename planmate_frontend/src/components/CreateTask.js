import React, { useState } from 'react';
import axios from 'axios';
import '../assets/styles.css';

function CreateTask() {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-description").value.trim();
    const dueDate = document.getElementById("task-due-date").value;
    const category = document.getElementById("task-category").value;
    const priority = document.getElementById("task-priority").value;
    const tags = document.getElementById("task-tags").value;

    // Get actual logged-in user ID
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      setMessage("❌ User not logged in");
      return;
    }

    //  Check required fields
    if (!title) {
      setMessage("❌ Please enter a task title.");
      return;
    }

    if (!description) {
      setMessage("❌ Please enter a task description.");
      return;
    }

    if (!dueDate) {
      setMessage("❌ Please select a due date.");
      return;
    }

    // ✅ Check if due date is today or future
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // reset time to midnight
    const selectedDate = new Date(dueDate);

    if (selectedDate < today) {
      setMessage("❌ You chose a past date. Please select today or a future date.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/tasks/user/${user.id}`,
        {
          title: title,
          description: description,
          status: "Pending",
          dueDate: dueDate,
          category: category,
          priority: priority,
          tags: tags
        }
      );

      console.log(response);
      setMessage("✅ Task added successfully!");
      e.target.reset();
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add task. Please try again.");
    }
  };

  return (
    <section className="task-creation">
      <h2>Create New Task</h2>

      <form id="task-form" onSubmit={handleSubmit}>
        <div id="message" style={{
          textAlign: "center",
          color: message.includes("✅") ? "green" : "red",
          marginTop: "10px",
          fontWeight: "bold"
        }}>
          {message}
        </div>

        <div className="form-group">
          <label htmlFor="task-title">Title</label>
          <input type="text" id="task-title" placeholder="Enter task title" required />
        </div>

        <div className="form-group">
          <label htmlFor="task-description">Description</label>
          <textarea id="task-description" placeholder="Enter task description" required></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-due-date">Due Date</label>
            <input type="date" id="task-due-date" required />
          </div>
          <div className="form-group">
            <label htmlFor="task-category">Category</label>
            <select id="task-category">
              <option value="">Select category</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select id="task-priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="task-tags">Tags</label>
            <input type="text" id="task-tags" placeholder="Enter tags (optional)" />
          </div>
        </div>

        <button type="submit" className="add-task-btn">Add Task</button>
      </form>
    </section>
  );
}

export default CreateTask;

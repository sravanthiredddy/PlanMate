import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles.css";
import { FaSearch } from "react-icons/fa";
import './FilterSearch.css';

const FilterSearch = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priority: "",
    status: "",
    date: ""
  });

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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) 
      || (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = filters.category ? (task.category || "").toLowerCase() === filters.category : true;
    const matchesPriority = filters.priority ? (task.priority || "").toLowerCase() === filters.priority : true;
    const matchesStatus = filters.status ? (task.status || "").toLowerCase() === filters.status : true;
    const matchesDate = filters.date ? (task.dueDate || "").toLowerCase().includes(filters.date) : true;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesDate;
  });

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    filters.category !== "" ||
    filters.priority !== "" ||
    filters.status !== "" ||
    filters.date.trim() !== "";

  const resetFilters = () => {
    setFilters({
      category: "",
      priority: "",
      status: "",
      date: ""
    });
    setSearchTerm("");
    setShowResults(true);
  };

  return (
    <section className="filter-section">
      <div className="filter-row">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
          />
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => {
              setFilters({ ...filters, category: e.target.value });
              setShowResults(true);
            }}
          >
            <option value="">Select Category</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="study">Study</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-priority">Priority</label>
          <select
            id="filter-priority"
            value={filters.priority}
            onChange={(e) => {
              setFilters({ ...filters, priority: e.target.value });
              setShowResults(true);
            }}
          >
            <option value="">Select Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-status">Status</label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setShowResults(true);
            }}
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-date">Date</label>
          <input
            type="text"
            id="filter-date"
            placeholder="YYYY-MM-DD or keyword"
            value={filters.date}
            onChange={(e) => {
              setFilters({ ...filters, date: e.target.value });
              setShowResults(true);
            }}
          />
        </div>
      </div>

      <ul id="task-list">
        {!showResults && !hasActiveFilters ? (
          <div style={{ color: "gray", fontStyle: "italic", marginTop: "10px" }}>
            Select...
          </div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <li key={task.id}>
              <strong>{task.title}</strong> | {task.category || 'N/A'} | {task.priority || 'N/A'} | {task.status || 'N/A'} | {task.dueDate || 'N/A'}
            </li>
          ))
        ) : (
          <div style={{ color: "gray", fontStyle: "italic", marginTop: "10px" }}>
            No tasks match your filters.
          </div>
        )}
      </ul>

      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <button className="show-all-btn" onClick={resetFilters}>Show All</button>
      </div>
    </section>
  );
};

export default FilterSearch;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../assets/styles.css';

const ExportDownload = () => {
  const [tasks, setTasks] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (storedUser && storedUser.id) {
      axios.get(`http://localhost:8080/api/tasks/user/${storedUser.id}`)
        .then(response => setTasks(response.data))
        .catch(error => console.error("Error fetching tasks:", error));
    }
  }, [storedUser]);

  const handlePDFExport = () => {
    if (tasks.length === 0) {
      alert("No tasks to export.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Task List", 14, 16);

    const tableColumn = ["ID", "Title", "Status", "Due Date", "Category", "Priority", "Tags"];
    const tableRows = tasks.map(task => [
      task.id,
      task.title || '',
      task.status || '',
      task.dueDate || '',
      task.category || '',
      task.priority || '',
      task.tags || ''
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save("tasks.pdf");
  };

  const handleCSVExport = () => {
    if (tasks.length === 0) {
      alert("No tasks to export.");
      return;
    }

    const csvRows = [];
    const headers = ["ID", "Title", "Description", "Status", "Due Date", "Category", "Priority", "Tags"];
    csvRows.push(headers.join(","));

    tasks.forEach(task => {
      const row = [
        task.id,
        `"${task.title || ''}"`,
        `"${task.description || ''}"`,
        task.status || '',
        task.dueDate || '',
        task.category || '',
        task.priority || '',
        task.tags || ''
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "tasks.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-container" style={{
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '30px',
      maxWidth: '400px',
      margin: '40px auto',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#000' }}>Export & Download</h2>
      <div className="export-options">
        <button
          onClick={handlePDFExport}
          style={{
            background: 'linear-gradient(135deg, #56b98e, #ebe6e9)',
            color: '#000',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            margin: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          Export as PDF
        </button>

        <button
          onClick={handleCSVExport}
          style={{
            background: 'linear-gradient(135deg, #56b98e, #ebe6e9)',
            color: '#000',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            margin: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          Export as CSV
        </button>
      </div>
    </div>
  );
};

export default ExportDownload;

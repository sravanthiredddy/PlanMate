import React, { useEffect, useState } from 'react';
import '../assets/styles.css'; // Optional: If you have a global styles file

function ThemeSettings() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    document.body.classList.toggle('dark', selectedTheme === 'dark');
    localStorage.setItem('theme', selectedTheme);
  };

  return (
    <section className="settings" style={{
      maxWidth: '400px',
      margin: 'auto',
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      color: theme === 'dark' ? '#fff' : '#333'
    }}>
      <h2>Settings</h2>
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label htmlFor="theme-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
          Select Theme:
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={handleThemeChange}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </section>
  );
}

export default ThemeSettings;

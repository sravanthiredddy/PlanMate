import React, { useEffect, useState } from 'react';
import './DashboardHome.css';

import CreateTask from './CreateTask';
import TaskList from './TaskList';
import FilterSearch from './FilterSearch';
import CalendarView from './CalendarView';
import TaskDashboard from './TaskDashboard';
import ExportDownload from './ExportDownload';
import ProfilePage from './ProfilePage';
import AIChat from './AIChat';

function DashboardHome() {
  const [activeContent, setActiveContent] = useState('Welcome');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const profileInitial = (user?.name || user?.username || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  const renderContent = () => {
    switch (activeContent) {
      case 'CreateTask':
        return <CreateTask user={user} />;
      case 'TaskList':
        return <TaskList user={user} />;
      case 'FilterSearch':
        return <FilterSearch />;
      case 'Calendar':
        return <CalendarView />;
      case 'Charts':
        return <TaskDashboard />;
      case 'Export':
        return <ExportDownload />;
      case 'Profile':
        return <ProfilePage user={user} />;
      case 'AI':
        return <AIChat />;
      default:
        return <h2 style={{ color: '#10233f' }}>Welcome to PLANMATE! Select an option.</h2>;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="profile-summary" onClick={() => setActiveContent('Profile')}>
          <div className="profile-avatar">
            <span>{profileInitial}</span>
          </div>
          <div className="profile-copy">
            <div className="profile-name">{user?.name || "Guest User"}</div>
            <div className="profile-email">{user?.email || "guest@example.com"}</div>
          </div>
        </div>

        <h3 className="dashboard-title">Task Tracker</h3>
        <button className="glow" onClick={() => setActiveContent('CreateTask')}>Create Task</button>
        <button className="glow" onClick={() => setActiveContent('TaskList')}>Task List</button>
        <button className="glow" onClick={() => setActiveContent('FilterSearch')}>Filter & Search</button>
        <button className="glow" onClick={() => setActiveContent('Calendar')}>Calendar</button>
        <button className="glow" onClick={() => setActiveContent('Charts')}>Charts</button>
        <button className="glow" onClick={() => setActiveContent('Export')}>Export</button>
        <button className="glow" onClick={() => setActiveContent('AI')}>AI Assistant</button>
      </div>

      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
}

export default DashboardHome;

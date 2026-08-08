import './assets/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import SignUp from './components/SignUp';
import DashboardHome from './components/DashboardHome';
import CreateTask from './components/CreateTask';
import TaskList from './components/TaskList';
import Notifications from './components/Notifications';
import FilterSearch from './components/FilterSearch';
import TaskDashboard from './components/TaskDashboard';
import ProfilePage from './components/ProfilePage';
import CalendarView from './components/CalendarView';
import ExportDownload from './components/ExportDownload';
import ForgotPassword from './components/ForgotPassword';
import AIChat from './components/AIChat';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/createtask" element={<CreateTask />} />
        <Route path="/tasklist" element={<TaskList />} />
        <Route path="/notifications" element={<Notifications />} /> 
        <Route path="/fs" element={<FilterSearch />} />
        <Route path="/task-dashboard" element={<TaskDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/export" element={<ExportDownload />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/ai" element={<AIChat />} />

      </Routes>
    </Router>
  );
}

export default App;

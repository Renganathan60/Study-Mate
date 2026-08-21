import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StudyProvider, useStudy } from './context/StudyContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudyPlanner from './pages/StudyPlanner';
import Subjects from './pages/Subjects';
import Tasks from './pages/Tasks';
import StudyTimer from './pages/StudyTimer';
import Notes from './pages/Notes';
import Goals from './pages/Goals';
import ProgressAnalytics from './pages/ProgressAnalytics';
import ProfileSettings from './pages/ProfileSettings';

// Layout wrapper to handle sidebar toggling and route layout spacing
function AppLayout() {
  const { user } = useStudy();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Apply visual preferences on load
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('sm_app_theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    if (localStorage.getItem('sm_app_compact') === 'true') {
      document.body.classList.add('layout-compact');
    } else {
      document.body.classList.remove('layout-compact');
    }

    if (localStorage.getItem('sm_app_reduce_animations') === 'true') {
      document.body.classList.add('reduce-animations');
    } else {
      document.body.classList.remove('reduce-animations');
    }
  }, []);

  // Pages that DO NOT get the sidebar layout (Landing, Login, Register)
  const isAuthOrLanding = ['/', '/login', '/register'].includes(location.pathname);

  // Auth Guard
  if (!user && !isAuthOrLanding) {
    return <Navigate to="/login" replace />;
  }

  // Auth Redirect (if logged in, redirect away from landing/login/register to dashboard)
  if (user && isAuthOrLanding && location.pathname !== '/') {
    return <Navigate to="/dashboard" replace />;
  }

  if (isAuthOrLanding) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Workspace views panel */}
        <main className="flex-1 py-6 md:px-6 overflow-hidden">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/planner" element={<StudyPlanner />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/timer" element={<StudyTimer />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/analytics" element={<ProgressAnalytics />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StudyProvider>
      <Router>
        <AppLayout />
      </Router>
    </StudyProvider>
  );
}

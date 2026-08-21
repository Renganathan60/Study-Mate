import React, { createContext, useContext, useState, useEffect } from 'react';

const StudyContext = createContext(null);

const defaultSubjects = [
  { id: 'sub-1', name: 'Mathematics', code: 'MATH101', description: 'Calculus, Linear Algebra and differential equations.', color: 'indigo', progress: 75, targetHours: 30, targetDate: '2026-12-15' },
  { id: 'sub-2', name: 'Physics', code: 'PHYS101', description: 'Thermodynamics, optics, and electromagnetism.', color: 'sky', progress: 45, targetHours: 25, targetDate: '2026-12-18' },
  { id: 'sub-3', name: 'Computer Science', code: 'CS101', description: 'Data structures, algorithms, and software development.', color: 'emerald', progress: 90, targetHours: 40, targetDate: '2026-12-20' },
];

const defaultTasks = [
  { id: 'task-1', title: 'Solve Chapter 3 Integration exercises', subjectId: 'sub-1', priority: 'High', dueDate: '2026-08-18', status: 'Pending' },
  { id: 'task-2', title: 'Code Pathfinding Visualizer', subjectId: 'sub-3', priority: 'High', dueDate: '2026-08-19', status: 'Completed' },
  { id: 'task-3', title: 'Lab Report on Thermodynamics', subjectId: 'sub-2', priority: 'Medium', dueDate: '2026-08-21', status: 'Pending' },
  { id: 'task-4', title: 'Revise Organic Chemistry reactions', subjectId: 'sub-4', priority: 'Low', dueDate: '2026-08-23', status: 'Pending' },
];

const defaultSessions = [
  { id: 'sess-1', subjectId: 'sub-1', date: '2026-08-18', time: '10:00', duration: 60, priority: 'High', notes: 'Solve integration questions', status: 'Pending' },
  { id: 'sess-2', subjectId: 'sub-3', date: '2026-08-18', time: '14:30', duration: 90, priority: 'Medium', notes: 'Code visualizer component', status: 'Completed' },
  { id: 'sess-3', subjectId: 'sub-2', date: '2026-08-19', time: '09:00', duration: 120, priority: 'High', notes: 'Lab book writeup', status: 'Pending' },
];

const defaultNotes = [
  { id: 'note-1', title: 'Big O Notation Basics', content: 'O(1) is constant time.\nO(log n) is logarithmic.\nO(n) is linear.\nO(n^2) is quadratic.\n\nSpace complexity measures the total amount of memory that an algorithm uses relative to the input size.', subjectId: 'sub-3', updatedAt: '2026-08-17' },
  { id: 'note-2', title: 'Integration Formulas', content: 'Integral of sin(x) dx = -cos(x) + C\nIntegral of cos(x) dx = sin(x) + C\nIntegral of e^x dx = e^x + C\n\nRemember substitution method for composite functions!', subjectId: 'sub-1', updatedAt: '2026-08-18' },
];

const defaultGoals = [
  { id: 'goal-1', title: 'Complete Computer Science Project', targetDate: '2026-08-25', progress: 90 },
  { id: 'goal-2', title: 'Score A+ in Chemistry Midterm', targetDate: '2026-09-10', progress: 40 },
  { id: 'goal-3', title: 'Master Calculus Basics', targetDate: '2026-08-30', progress: 60 },
];

const defaultTimerLogs = [
  { id: 'log-1', subjectId: 'sub-1', date: '2026-08-18', duration: 25 },
  { id: 'log-2', subjectId: 'sub-3', date: '2026-08-18', duration: 45 },
  { id: 'log-3', subjectId: 'sub-3', date: '2026-08-18', duration: 25 },
  { id: 'log-4', subjectId: 'sub-2', date: '2026-08-17', duration: 60 },
];

export const StudyProvider = ({ children }) => {
  // Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sm_user');
    return saved ? JSON.parse(saved) : { name: 'Alex Mercer', email: 'alex@studymate.io', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop' };
  });

  // Core App States
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('sm_subjects');
    return saved ? JSON.parse(saved) : defaultSubjects;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('sm_tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('sm_sessions');
    return saved ? JSON.parse(saved) : defaultSessions;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('sm_notes');
    return saved ? JSON.parse(saved) : defaultNotes;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('sm_goals');
    return saved ? JSON.parse(saved) : defaultGoals;
  });

  const [timerLogs, setTimerLogs] = useState(() => {
    const saved = localStorage.getItem('sm_timer_logs');
    return saved ? JSON.parse(saved) : defaultTimerLogs;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sm_app_theme') || 'light';
  });

  const [streak, setStreak] = useState(5);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sm_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sm_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('sm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('sm_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('sm_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('sm_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('sm_timer_logs', JSON.stringify(timerLogs));
  }, [timerLogs]);

  useEffect(() => {
    localStorage.setItem('sm_app_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Actions for Authentication
  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  // Subject Actions
  const addSubject = (subject) => {
    const newSubject = { 
      id: 'sub-' + Date.now(), 
      progress: 0,
      code: subject.code || '',
      description: subject.description || '',
      targetDate: subject.targetDate || new Date().toISOString().split('T')[0],
      ...subject
    };
    setSubjects([...subjects, newSubject]);
  };

  const updateSubject = (id, updatedSubject) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, ...updatedSubject } : s));
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
    // Cascade delete related items
    setTasks(tasks.filter(t => t.subjectId !== id));
    setSessions(sessions.filter(s => s.subjectId !== id));
    setNotes(notes.filter(n => n.subjectId !== id));
  };

  // Task Actions
  const addTask = (task) => {
    const newTask = { ...task, id: 'task-' + Date.now(), status: 'Pending' };
    setTasks([...tasks, newTask]);
    updateSubjectProgress(task.subjectId);
  };

  const updateTask = (id, updatedTask) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t));
  };

  const toggleTaskStatus = (id) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setTasks(updated);
    
    // Auto-update subject progress when tasks complete/change
    const task = tasks.find(t => t.id === id);
    if (task) {
      setTimeout(() => updateSubjectProgress(task.subjectId, updated), 50);
    }
  };

  const deleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    if (task) {
      setTimeout(() => updateSubjectProgress(task.subjectId, updated), 50);
    }
  };

  const updateSubjectProgress = (subjId, currentTasks = tasks) => {
    if (!subjId) return;
    const subjTasks = currentTasks.filter(t => t.subjectId === subjId);
    if (subjTasks.length === 0) return;
    const completed = subjTasks.filter(t => t.status === 'Completed').length;
    const progress = Math.round((completed / subjTasks.length) * 100);
    setSubjects(prev => prev.map(s => s.id === subjId ? { ...s, progress } : s));
  };

  // Session Actions
  const addSession = (session) => {
    const newSession = { ...session, id: 'sess-' + Date.now(), status: 'Pending' };
    setSessions([...sessions, newSession]);
  };

  const updateSession = (id, updatedSession) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, ...updatedSession } : s));
  };

  const toggleSessionStatus = (id) => {
    setSessions(prevSessions => prevSessions.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Completed' ? 'Pending' : 'Completed';
        
        if (nextStatus === 'Completed') {
          // Add focus session log
          const newLog = {
            id: 'tlog-sess-' + s.id,
            subjectId: s.subjectId,
            date: s.date,
            duration: s.duration
          };
          setTimerLogs(prevLogs => {
            const exists = prevLogs.some(log => log.id === newLog.id);
            return exists ? prevLogs : [...prevLogs, newLog];
          });
        } else {
          // Remove session log
          setTimerLogs(prevLogs => prevLogs.filter(log => log.id !== 'tlog-sess-' + s.id));
        }

        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const deleteSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
    setTimerLogs(prevLogs => prevLogs.filter(log => log.id !== 'tlog-sess-' + id));
  };

  // Note Actions
  const addNote = (note) => {
    const newNote = { ...note, id: 'note-' + Date.now(), updatedAt: new Date().toISOString().split('T')[0] };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id, updatedNote) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updatedNote, updatedAt: new Date().toISOString().split('T')[0] } : n));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // Goal Actions
  const addGoal = (goal) => {
    const newGoal = { ...goal, id: 'goal-' + Date.now() };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (id, updatedGoal) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updatedGoal } : g));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  // Timer Actions
  const addTimerLog = (log) => {
    const newLog = { ...log, id: 'tlog-' + Date.now(), date: new Date().toISOString().split('T')[0] };
    setTimerLogs([...timerLogs, newLog]);
  };

  return (
    <StudyContext.Provider value={{
      user, login, logout,
      subjects, addSubject, updateSubject, deleteSubject,
      tasks, addTask, updateTask, toggleTaskStatus, deleteTask,
      sessions, addSession, updateSession, deleteSession, toggleSessionStatus,
      notes, addNote, updateNote, deleteNote,
      goals, addGoal, updateGoal, deleteGoal,
      timerLogs, addTimerLog,
      streak, setStreak,
      theme, setTheme
    }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};

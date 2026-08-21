import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  Timer, 
  FileText, 
  Target, 
  BarChart2, 
  Settings, 
  X 
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Study Planner', path: '/planner', icon: Calendar },
    { name: 'Subjects', path: '/subjects', icon: BookOpen },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Study Timer', path: '/timer', icon: Timer },
    { name: 'Notes', path: '/notes', icon: FileText },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Progress Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Profile / Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white pt-16 transition-transform duration-300 md:sticky md:top-16 md:z-30 md:h-[calc(100vh-4rem)] md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button for mobile */}
        <div className="flex items-center justify-end px-4 py-2 md:hidden">
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-600 ' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 '
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-indigo-600 ' : 'text-slate-400 group-hover:text-slate-500 '}`} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

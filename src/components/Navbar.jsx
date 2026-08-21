import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { Sun, Moon, LogOut, Flame, BookOpen, User, Menu } from 'lucide-react';

export default function Navbar({ onMenuToggle }) {
  const { user, logout, theme, setTheme, streak } = useStudy();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Brand and Menu toggle */}
        <div className="flex items-center gap-3">
          {!isAuthPage && (
            <button
              onClick={onMenuToggle}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden transition"
              aria-label="Toggle Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <BookOpen className="h-5.5 w-5.5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-955">
              Study<span className="text-indigo-600">Mate</span>
            </span>
          </Link>
        </div>

        {/* Right Side: Options & Profile */}
        <div className="flex items-center gap-4">
          {/* Quick theme switcher button */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Toggle Theme"
            title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {user ? (
            <>
              {/* Streak Widget */}
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200/50">
                <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-pulse" />
                <span>{streak} Day Streak</span>
              </div>

              {/* Profile Avatar & Actions */}
              <div className="flex items-center gap-3">
                <Link to="/settings" className="flex items-center gap-2 group">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/60 transition"
                  />
                  <span className="hidden md:inline text-sm font-medium text-slate-750 group-hover:text-slate-950 transition">
                    {user.name}
                  </span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-650 transition"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            isAuthPage && location.pathname !== '/login' && location.pathname !== '/register' && (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-905 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-100 hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

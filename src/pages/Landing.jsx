import React from 'react';
import { Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { 
  BookOpen, 
  CheckSquare, 
  Timer, 
  FileText, 
  Target, 
  BarChart2, 
  ShieldCheck, 
  Clock, 
  Smartphone 
} from 'lucide-react';

export default function Landing() {
  const { user } = useStudy();

  const features = [
    { name: 'Study Planner', desc: 'Create daily and weekly schedules. Block out time for focused studies.', icon: Clock },
    { name: 'Task Management', desc: 'Break down your goals into actionable tasks. Filter, sort, and complete.', icon: CheckSquare },
    { name: 'Pomodoro Timer', desc: 'Boost focus with custom Pomodoro intervals. Tracks your completed study hours.', icon: Timer },
    { name: 'Note Taking', desc: 'Write, search, and categorize your lecture notes by subjects.', icon: FileText },
    { name: 'Goal Tracker', desc: 'Set ambitious study milestones and track progress over time.', icon: Target },
    { name: 'Analytics Dashboard', desc: 'Visualize your weekly study performance and subject distribution.', icon: BarChart2 },
  ];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 border border-indigo-200/30">
          <span>🚀 Smart Studying Made Simple</span>
        </div>
        
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-950 max-w-3xl mx-auto leading-tight">
          Master Your Classes with <span className="text-indigo-600 ">StudyMate</span>
        </h1>
        
        <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
          The ultimate productivity companion for students. Keep track of subjects, design study schedules, block tasks, write notes, use Pomodoro timer and watch your grades soar.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to={user ? "/dashboard" : "/register"}
            className="rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-indigo-700 transition"
          >
            {user ? "Go to Dashboard" : "Get Started Free"}
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200/50 ">
        <h2 className="text-3xl font-bold tracking-tight text-center text-slate-950 mb-12">
          Everything You Need to Succeed
        </h2>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div 
                key={feat.name}
                className="group relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow "
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ">
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-950 ">{feat.name}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-white border-t border-slate-200/50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div className="p-6">
              <div className="text-4xl font-extrabold text-indigo-600 ">100%</div>
              <div className="mt-2 text-sm font-medium text-slate-500 ">Offline & Private (LocalStorage)</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-extrabold text-indigo-600 ">Zero</div>
              <div className="mt-2 text-sm font-medium text-slate-500 ">Cloud Sync Lag / Account Hassles</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-extrabold text-indigo-600 ">Pomodoro</div>
              <div className="mt-2 text-sm font-medium text-slate-500 ">Built-in Focus Boosting Timer</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

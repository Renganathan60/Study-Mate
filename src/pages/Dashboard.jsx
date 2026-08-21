import React from 'react';
import { Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Calendar, 
  ChevronRight, 
  Target 
} from 'lucide-react';

export default function Dashboard() {
  const { 
    subjects, 
    tasks, 
    sessions, 
    goals, 
    timerLogs, 
    streak 
  } = useStudy();

  const todayStr = new Date().toISOString().split('T')[0];

  const todayMinutes = timerLogs
    .filter(log => log.date === todayStr)
    .reduce((sum, log) => sum + log.duration, 0);
  const todayHours = (todayMinutes / 60).toFixed(1);

  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'Pending').length;

  const averageGoalProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0;

  const todaySessions = sessions
    .filter(s => s.date === todayStr)
    .map(s => {
      const subject = subjects.find(sub => sub.id === s.subjectId);
      return {
        ...s,
        subjectName: subject ? subject.name : 'Unknown Subject',
        color: subject ? subject.color : 'slate'
      };
    });

  const upcomingTasks = [...tasks]
    .filter(t => t.status === 'Pending')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4)
    .map(t => {
      const subject = subjects.find(sub => sub.id === t.subjectId);
      return {
        ...t,
        subjectName: subject ? subject.name : 'Unknown Subject',
        color: subject ? subject.color : 'slate'
      };
    });

  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayMinutes = timerLogs
        .filter(log => log.date === dateStr)
        .reduce((sum, log) => sum + log.duration, 0);
      
      data.push({
        name: label,
        hours: parseFloat((dayMinutes / 60).toFixed(1))
      });
    }
    return data;
  };

  const chartData = getLast7DaysData();

  const colorMap = {
    indigo: 'bg-indigo-600 border-indigo-600 text-indigo-600',
    sky: 'bg-sky-500 border-sky-500 text-sky-500',
    emerald: 'bg-emerald-500 border-emerald-500 text-emerald-500',
    amber: 'bg-amber-500 border-amber-500 text-amber-500',
    rose: 'bg-rose-500 border-rose-500 text-rose-500',
    slate: 'bg-slate-500 border-slate-500 text-slate-500',
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Student Dashboard</h1>
        <p className="text-sm text-slate-500 ">Here's an overview of your academic focus and tasks today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study Time (Today)</span>
            <Clock className="h-5 w-5 text-indigo-600 " />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-950 ">{todayHours}</span>
            <span className="text-sm text-slate-500">hours</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Tasks</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-950 ">{completedTasksCount}</span>
            <span className="text-sm text-slate-500">done ({pendingTasksCount} pending)</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study Streak</span>
            <Flame className="h-5 w-5 text-amber-500 fill-amber-500 animate-pulse" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-950 ">{streak}</span>
            <span className="text-sm text-slate-500">consecutive days</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Goal Progress</span>
            <Target className="h-5 w-5 text-sky-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-950 ">{averageGoalProgress}%</span>
            <span className="text-sm text-slate-500">average completion</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="rounded-xl border border-slate-200 bg-white p-5 ">
            <h3 className="font-semibold text-slate-950 ">Weekly Focus Hours</h3>
            <p className="text-xs text-slate-400 mb-4">Total study time logged via the study timer.</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                  />
                  <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-950 ">Subject Progress</h3>
              <Link to="/subjects" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center">
                Manage Subjects <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {subjects.map(sub => (
                <div key={sub.id} className="rounded-lg border border-slate-100 p-4 bg-slate-50/50 ">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-900 ">{sub.name}</span>
                    <span className="text-xs font-bold text-slate-500">{sub.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${colorMap[sub.color] ? colorMap[sub.color].split(' ')[0] : 'bg-indigo-600'}`}
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          <div className="rounded-xl border border-slate-200 bg-white p-5 ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-950 ">Today's Schedule</h3>
              <Link to="/planner" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center">
                Full Planner <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>

            {todaySessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
                <Calendar className="h-8 w-8 stroke-1 mb-2" />
                <span className="text-xs font-medium">No sessions scheduled for today.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySessions.map(session => (
                  <div 
                    key={session.id} 
                    className="flex items-center justify-between p-3 rounded-lg border-l-4 border-slate-100 bg-slate-50/50 "
                    style={{ borderLeftColor: session.color === 'indigo' ? '#4f46e5' : session.color === 'sky' ? '#0ea5e9' : session.color === 'emerald' ? '#10b981' : session.color === 'amber' ? '#f59e0b' : '#64748b' }}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 ">{session.subjectName}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{session.time} ({session.duration} min)</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${session.priority === 'High' ? 'bg-red-50 text-red-700 ' : session.priority === 'Medium' ? 'bg-amber-50 text-amber-700 ' : 'bg-slate-100 text-slate-600 '}`}>
                      {session.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-950 ">Upcoming Deadlines</h3>
              <Link to="/tasks" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center">
                All Tasks <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>

            {upcomingTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
                <CheckCircle2 className="h-8 w-8 stroke-1 mb-2 text-emerald-500/50" />
                <span className="text-xs font-medium">All tasks caught up! Yay!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-start justify-between p-3 rounded-lg bg-slate-50/50 border border-slate-100 ">
                    <div className="space-y-1 pr-2">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{task.title}</h4>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                        <span className="font-medium">{task.subjectName}</span>
                        <span>•</span>
                        <span className="font-medium text-red-650 ">{task.dueDate}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${task.priority === 'High' ? 'bg-red-50 text-red-700 ' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 ' : 'bg-slate-100 text-slate-600 '}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

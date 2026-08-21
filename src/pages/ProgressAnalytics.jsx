import React from 'react';
import { useStudy } from '../context/StudyContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { BarChart2, CheckCircle2, BookOpen, Clock } from 'lucide-react';

export default function ProgressAnalytics() {
  const { subjects, tasks, timerLogs } = useStudy();

  // 1. Calculate general stats
  const totalFocusMinutes = timerLogs.reduce((sum, log) => sum + log.duration, 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  const totalTasksCount = tasks.length;
  const taskCompletionRate = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // 2. Data for Subject Division (Pie Chart)
  const getSubjectPieData = () => {
    const dataMap = {};
    
    // Initialize subjects
    subjects.forEach(s => {
      dataMap[s.id] = { name: s.name, value: 0, color: s.color };
    });

    // Populate log minutes
    timerLogs.forEach(log => {
      if (dataMap[log.subjectId]) {
        dataMap[log.subjectId].value += log.duration;
      }
    });

    // Format & filter subjects with >0 minutes
    return Object.values(dataMap)
      .map(item => ({
        ...item,
        value: parseFloat((item.value / 60).toFixed(1)) // convert to hours
      }))
      .filter(item => item.value > 0);
  };

  const subjectPieData = getSubjectPieData();

  // Color Hex Map for Recharts Cell rendering
  const colorsHex = {
    indigo: '#4f46e5',
    sky: '#0ea5e9',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e',
    slate: '#64748b'
  };

  // 3. Data for Tasks status per subject (Grouped Bar Chart)
  const getSubjectTasksData = () => {
    return subjects.map(sub => {
      const subTasks = tasks.filter(t => t.subjectId === sub.id);
      const completed = subTasks.filter(t => t.status === 'Completed').length;
      const pending = subTasks.filter(t => t.status === 'Pending').length;

      return {
        name: sub.name,
        Completed: completed,
        Pending: pending
      };
    });
  };

  const subjectTasksData = getSubjectTasksData();

  // 4. Last 7 Days details
  const getDailyFocusData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayMinutes = timerLogs
        .filter(log => log.date === dateStr)
        .reduce((sum, log) => sum + log.duration, 0);
      
      data.push({
        name: label,
        Hours: parseFloat((dayMinutes / 60).toFixed(1))
      });
    }
    return data;
  };

  const dailyFocusData = getDailyFocusData();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Academic Analytics</h1>
        <p className="text-sm text-slate-500 ">Deep-dive reports showing focus distribution and task accomplishment rate.</p>
      </div>

      {/* Analytics Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-205 bg-white p-5 flex items-center gap-4">
          <div className="rounded-lg bg-indigo-50 p-3 text-indigo-650 ">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Focused Study</span>
            <span className="text-xl font-bold text-slate-900 ">{totalFocusHours} hours</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-205 bg-white p-5 flex items-center gap-4">
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-655 ">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Task Completion Rate</span>
            <span className="text-xl font-bold text-slate-900 ">{taskCompletionRate}% ({completedTasksCount}/{totalTasksCount})</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-205 bg-white p-5 flex items-center gap-4">
          <div className="rounded-lg bg-sky-50 p-3 text-sky-650 ">
            <BookOpen className="h-6 w-6 text-sky-500" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Active Courses</span>
            <span className="text-xl font-bold text-slate-900 ">{subjects.length} subjects</span>
          </div>
        </div>
      </div>

      {/* Main Charts Layout Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Daily Focus Log bar chart */}
        <div className="rounded-xl border border-slate-202 bg-white p-5 ">
          <h3 className="font-semibold text-slate-950 text-sm mb-1.5">Daily Study Hours (Last 7 Days)</h3>
          <p className="text-xs text-slate-400 mb-6">Logs collected through focused Pomodoro sessions.</p>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyFocusData} margin={{ left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }}
                  contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="Hours" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subjects Time Division Pie Chart */}
        <div className="rounded-xl border border-slate-202 bg-white p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-950 text-sm mb-1.5 font-sans">Study Focus Share</h3>
            <p className="text-xs text-slate-405 mb-4">Total focus time breakdown (in hours) per subject.</p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            {subjectPieData.length === 0 ? (
              <div className="text-xs text-slate-400 italic">No study hours logged yet. Start Pomodoro focus timer to see share logs.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {subjectPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colorsHex[entry.color] || colorsHex.slate} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} hrs`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Task Completion Per Subject Double Bar Chart */}
        <div className="md:col-span-2 rounded-xl border border-slate-202 bg-white p-5 ">
          <h3 className="font-semibold text-slate-955 text-sm mb-1">Subject Task Progression</h3>
          <p className="text-xs text-slate-400 mb-6">Compare completed tasks vs pending tasks categorized by courses.</p>
          
          <div className="h-64 w-full">
            {subjects.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-slate-400 italic">Add subjects and tasks to see chart layout.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectTasksData} margin={{ left: -25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Completed" fill="#10b981" radius={[3, 3, 0, 0]} barSize={16} />
                  <Bar dataKey="Pending" fill="#94a3b8" radius={[3, 3, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

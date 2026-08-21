import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Calendar as CalendarIcon, Plus, Trash2, Edit2, Clock, CheckCircle, Circle, Filter, BookOpen } from 'lucide-react';

export default function StudyPlanner() {
  const { subjects, sessions, addSession, updateSession, deleteSession, toggleSessionStatus } = useStudy();
  
  // View states
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'week', 'upcoming'
  const [isOpen, setIsOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  // Filters State
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form State
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('60');
  const [priority, setPriority] = useState('Medium');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingSession(null);
    if (subjects.length > 0) setSubjectId(subjects[0].id);
    setDate(new Date().toISOString().split('T')[0]);
    setTime('09:00');
    setDuration('60');
    setPriority('Medium');
    setNotes('');
    setIsOpen(true);
  };

  const openEditModal = (session) => {
    setEditingSession(session);
    setSubjectId(session.subjectId);
    setDate(session.date);
    setTime(session.time);
    setDuration(session.duration.toString());
    setPriority(session.priority);
    setNotes(session.notes || '');
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subjectId) return;

    const payload = {
      subjectId,
      date,
      time,
      duration: parseInt(duration),
      priority,
      notes,
    };

    if (editingSession) {
      updateSession(editingSession.id, payload);
    } else {
      addSession(payload);
    }
    setIsOpen(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper date calculations for tab sorting
  const isToday = (dateStr) => dateStr === todayStr;

  const isThisWeek = (dateStr) => {
    const sessionDate = new Date(dateStr);
    const today = new Date(todayStr);
    
    // Set hours to 0 to compare days directly
    today.setHours(0, 0, 0, 0);
    sessionDate.setHours(0, 0, 0, 0);
    
    // Difference in days
    const diffTime = sessionDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // True if date is within next 7 days (including today)
    return diffDays >= 0 && diffDays <= 7;
  };

  const isUpcoming = (dateStr) => {
    const sessionDate = new Date(dateStr);
    const today = new Date(todayStr);
    today.setHours(0, 0, 0, 0);
    sessionDate.setHours(0, 0, 0, 0);
    
    return sessionDate > today;
  };

  // 1. Filter by Tab View
  const tabSessions = sessions.filter(session => {
    if (activeTab === 'today') return isToday(session.date);
    if (activeTab === 'week') return isThisWeek(session.date);
    if (activeTab === 'upcoming') return isUpcoming(session.date);
    return true;
  });

  // 2. Filter by Search criteria
  const filteredSessions = tabSessions.filter(session => {
    const matchesSubject = subjectFilter === 'All' || session.subjectId === subjectFilter;
    const matchesPriority = priorityFilter === 'All' || session.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || session.status === statusFilter;
    return matchesSubject && matchesPriority && matchesStatus;
  });

  // 3. Sort chronologically (date, then time)
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const dateComp = new Date(a.date) - new Date(b.date);
    if (dateComp !== 0) return dateComp;
    return a.time.localeCompare(b.time);
  });

  const colorMap = {
    indigo: 'border-indigo-600 hover:bg-indigo-50/5 text-indigo-600',
    sky: 'border-sky-500 hover:bg-sky-50/5 text-sky-500',
    emerald: 'border-emerald-500 hover:bg-emerald-50/5 text-emerald-500',
    amber: 'border-amber-500 hover:bg-amber-50/5 text-amber-500',
    rose: 'border-rose-500 hover:bg-rose-50/5 text-rose-500',
    slate: 'border-slate-500 hover:bg-slate-50/5 text-slate-550',
  };

  const badgeColorMap = {
    indigo: 'bg-indigo-50 text-indigo-705 ',
    sky: 'bg-sky-50 text-sky-705 ',
    emerald: 'bg-emerald-50 text-emerald-705 ',
    amber: 'bg-amber-50 text-amber-705 ',
    rose: 'bg-rose-50 text-rose-750 ',
    slate: 'bg-slate-100 text-slate-650 ',
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Study Planner</h1>
          <p className="text-sm text-slate-500 ">Design your focus schedule and check off blocks to log study hours.</p>
        </div>
        
        <button
          onClick={openAddModal}
          disabled={subjects.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-xs self-start sm:self-center"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Session
        </button>
      </div>

      {subjects.length === 0 && (
        <div className="rounded-xl border border-amber-250 bg-amber-50/50 p-4 text-sm text-amber-800 ">
          ⚠️ You need to add at least one <strong>Subject</strong> before you can schedule planner blocks. Go to Subjects tab first.
        </div>
      )}

      {/* Nav Tabs & Filter Controls Panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Timeline View Tabs */}
          <div className="inline-flex rounded-lg border border-slate-202 bg-slate-100 p-0.5 ">
            <button
              onClick={() => setActiveTab('today')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${activeTab === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-550 '}`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveTab('week')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${activeTab === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-550 '}`}
            >
              This Week
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${activeTab === 'upcoming' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-550 '}`}
            >
              Upcoming
            </button>
          </div>

          {/* Inline filters */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Filter className="h-4 w-4" />
              <span>Filters:</span>
            </div>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 focus:outline-none "
            >
              <option value="All">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 focus:outline-none "
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 focus:outline-none "
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions schedule timeline list */}
      {sortedSessions.length === 0 ? (
        <EmptyState 
          icon={CalendarIcon} 
          title="No study blocks match parameters" 
          description="Try clearing filters, switching tabs, or add a session block to start planning your time."
          actionText={subjects.length > 0 ? "Schedule Session" : null}
          onAction={openAddModal}
        />
      ) : (
        <div className="relative pl-6 border-l border-slate-200 space-y-6 text-left">
          
          {sortedSessions.map((session) => {
            const subject = subjects.find(s => s.id === session.subjectId);
            const subjectName = subject ? subject.name : 'Unknown Subject';
            const subjectColor = subject ? subject.color : 'slate';
            const colors = colorMap[subjectColor] || colorMap.slate;
            const badgeColors = badgeColorMap[subjectColor] || badgeColorMap.slate;

            return (
              <div 
                key={session.id} 
                className={`relative rounded-xl border border-slate-200 p-5 bg-white shadow-xs transition hover:shadow-md border-l-4 ${colors.split(' ')[0]} ${session.status === 'Completed' ? 'opacity-70 bg-slate-50/20' : ''}`}
              >
                {/* Timeline node icon locator */}
                <div className="absolute top-1/2 -left-[31px] -translate-y-1/2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-100 border-2 border-slate-200 ">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    
                    {/* Completion status toggle button */}
                    <button
                      onClick={() => toggleSessionStatus(session.id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 transition"
                      title={session.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}
                    >
                      {session.status === 'Completed' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
                      ) : (
                        <Circle className="h-5 w-5 hover:scale-105" />
                      )}
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeColors}`}>
                          {subjectName}
                        </span>
                        
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                          session.priority === 'High' ? 'bg-red-55/10 text-red-700' :
                          session.priority === 'Medium' ? 'bg-amber-55/10 text-amber-700' :
                          'bg-slate-100 text-slate-600 '
                        }`}>
                          {session.priority} Priority
                        </span>
                      </div>

                      {/* Notes text info */}
                      {session.notes && (
                        <p className="text-xs font-sans text-slate-700 mt-1.5 italic">
                          "{session.notes}"
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-semibold ">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{session.date} at {session.time}</span>
                        </div>
                        <span>•</span>
                        <span>{session.duration} minutes block</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    <button
                      onClick={() => openEditModal(session)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition"
                      title="Edit Session"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-650 transition"
                      title="Delete Session"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingSession ? 'Edit Study Session' : 'Add Study Session'}>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          <div>
            <label className="block text-sm font-semibold text-slate-705 mb-1">Subject</label>
            <select
              required
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-705 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-705 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-705 mb-1">Duration (minutes)</label>
              <input
                type="number"
                min="10"
                max="480"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-705 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-705 mb-1">Session Notes (Optional)</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Focus on exercises 5 to 10. Review textbook section 2.4."
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 ">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm"
            >
              {editingSession ? 'Save Changes' : 'Schedule Session'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

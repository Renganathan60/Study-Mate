import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { CheckSquare, Plus, Trash2, Edit2, Search, Filter, ArrowUpDown } from 'lucide-react';

export default function Tasks() {
  const { subjects, tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useStudy();
  const [isOpen, setIsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Search, Filter, Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDateAsc'); // dueDateAsc, dueDateDesc, priorityDesc, priorityAsc

  // Form State
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const openAddModal = () => {
    setEditingTask(null);
    setTitle('');
    if (subjects.length > 0) setSubjectId(subjects[0].id);
    setPriority('Medium');
    setDueDate(new Date().toISOString().split('T')[0]);
    setIsOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setSubjectId(task.subjectId);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    const payload = {
      title,
      subjectId,
      priority,
      dueDate
    };

    if (editingTask) {
      updateTask(editingTask.id, payload);
    } else {
      addTask(payload);
    }
    setIsOpen(false);
  };

  // Filter Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || task.subjectId === subjectFilter;
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesSubject && matchesStatus && matchesPriority;
  });

  // Sort Logic
  const priorityWeight = { High: 3, Medium: 2, Low: 1 };
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDateAsc') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'dueDateDesc') {
      return new Date(b.dueDate) - new Date(a.dueDate);
    }
    if (sortBy === 'priorityDesc') {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    if (sortBy === 'priorityAsc') {
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Task Management</h1>
          <p className="text-sm text-slate-500 ">Add checklist milestones and set reminders for due dates.</p>
        </div>

        <button
          onClick={openAddModal}
          disabled={subjects.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-xs"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Task
        </button>
      </div>

      {subjects.length === 0 && (
        <div className="rounded-xl border border-amber-250 bg-amber-50/50 p-4 text-sm text-amber-855 ">
          ⚠️ You need to add at least one <strong>Subject</strong> before you can create tasks. Go to the Subjects tab first.
        </div>
      )}

      {/* Search & Filters Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium focus:outline-none "
            >
              <option value="dueDateAsc">Due Date (Soonest)</option>
              <option value="dueDateDesc">Due Date (Furthest)</option>
              <option value="priorityDesc">Priority (High to Low)</option>
              <option value="priorityAsc">Priority (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Filter selectors */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1 border-t border-slate-50 ">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 focus:outline-none "
          >
            <option value="All">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 focus:outline-none "
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 focus:outline-none "
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Task List Render */}
      {sortedTasks.length === 0 ? (
        <EmptyState 
          icon={CheckSquare} 
          title="No tasks found" 
          description="Try modifying your filters, search term, or create a new assignment milestone."
          actionText={subjects.length > 0 ? "Add Task" : null}
          onAction={openAddModal}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white ">
          <div className="divide-y divide-slate-100 ">
            {sortedTasks.map((task) => {
              const subject = subjects.find(s => s.id === task.subjectId);
              const subjectName = subject ? subject.name : 'Unknown Subject';

              return (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between p-4 hover:bg-slate-50/30 transition ${task.status === 'Completed' ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-center gap-3 pr-4 min-w-0">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${task.status === 'Completed' ? 'bg-indigo-600 border-indigo-650 text-white' : 'border-slate-300 hover:border-indigo-500 '}`}
                      aria-label="Toggle completed status"
                    >
                      {task.status === 'Completed' && (
                        <svg className="h-3.5 w-3.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Task Title & Meta */}
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold text-slate-900 truncate ${task.status === 'Completed' ? 'line-through text-slate-400 ' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-slate-505">
                        <span className="font-semibold">{subjectName}</span>
                        <span>•</span>
                        <span>Due: {task.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Priority Flag */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      task.priority === 'High' ? 'bg-red-50 text-red-700 ' :
                      task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 ' :
                      'bg-slate-100 text-slate-600 '
                    }`}>
                      {task.priority}
                    </span>

                    <button
                      onClick={() => openEditModal(task)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-750 transition"
                      title="Edit Task"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-650 transition"
                      title="Delete Task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingTask ? 'Edit Task' : 'Add Task'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finish Calculus Homework"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
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
              <label className="block text-sm font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
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
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

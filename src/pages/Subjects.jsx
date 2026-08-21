import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { BookOpen, Plus, Trash2, Edit2, Target, Search, ArrowUpDown, Calendar, HelpCircle } from 'lucide-react';

export default function Subjects() {
  const { subjects, addSubject, updateSubject, deleteSubject, tasks } = useStudy();
  const [isOpen, setIsOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  
  // Confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Search and Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('nameAsc'); // nameAsc, nameDesc, hoursDesc, progressDesc

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [targetHours, setTargetHours] = useState('30');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [color, setColor] = useState('indigo');

  // Success/Error Feedback notifications
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const triggerFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback({ message: '', type: '' });
    }, 4000);
  };

  const openAddModal = () => {
    setEditingSubject(null);
    setName('');
    setCode('');
    setDescription('');
    setColor('indigo');
    setTargetHours('30');
    setTargetDate(new Date().toISOString().split('T')[0]);
    setIsOpen(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setName(subject.name);
    setCode(subject.code || '');
    setDescription(subject.description || '');
    setColor(subject.color);
    setTargetHours(subject.targetHours.toString());
    setTargetDate(subject.targetDate || new Date().toISOString().split('T')[0]);
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Required field validation
    if (!name.trim()) {
      triggerFeedback('Subject Name is required.', 'error');
      return;
    }
    if (!targetHours.trim() || parseInt(targetHours) <= 0) {
      triggerFeedback('A valid study goal in hours is required.', 'error');
      return;
    }
    if (!targetDate) {
      triggerFeedback('Target Date is required.', 'error');
      return;
    }

    // Duplicate name validation
    const nameExists = subjects.some(sub => 
      sub.name.toLowerCase().trim() === name.toLowerCase().trim() && 
      (!editingSubject || sub.id !== editingSubject.id)
    );

    if (nameExists) {
      triggerFeedback('A subject with this name already exists. Please choose a unique name.', 'error');
      return;
    }

    const payload = {
      name: name.trim(),
      code: code.trim(),
      description: description.trim(),
      color,
      targetHours: parseInt(targetHours),
      targetDate
    };

    if (editingSubject) {
      updateSubject(editingSubject.id, payload);
      triggerFeedback('Subject updated successfully!');
    } else {
      addSubject(payload);
      triggerFeedback('Subject created successfully!');
    }
    setIsOpen(false);
  };

  const handleDeleteConfirm = (id) => {
    deleteSubject(id);
    setConfirmDeleteId(null);
    triggerFeedback('Subject deleted successfully!');
  };

  const colorOptions = [
    { value: 'indigo', label: 'Indigo', bg: 'bg-indigo-500', ring: 'ring-indigo-500' },
    { value: 'sky', label: 'Sky Blue', bg: 'bg-sky-500', ring: 'ring-sky-500' },
    { value: 'emerald', label: 'Emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
    { value: 'amber', label: 'Amber', bg: 'bg-amber-500', ring: 'ring-amber-500' },
    { value: 'rose', label: 'Rose', bg: 'bg-rose-500', ring: 'ring-rose-500' },
    { value: 'slate', label: 'Slate', bg: 'bg-slate-500', ring: 'ring-slate-500' },
  ];

  const colorMap = {
    indigo: { text: 'text-indigo-600 ', bg: 'bg-indigo-600', bgLight: 'bg-indigo-50 ', border: 'border-indigo-100 ' },
    sky: { text: 'text-sky-600 ', bg: 'bg-sky-500', bgLight: 'bg-sky-50 ', border: 'border-sky-100 ' },
    emerald: { text: 'text-emerald-600 ', bg: 'bg-emerald-500', bgLight: 'bg-emerald-50 ', border: 'border-emerald-100 ' },
    amber: { text: 'text-amber-600 ', bg: 'bg-amber-500', bgLight: 'bg-amber-50 ', border: 'border-amber-100 ' },
    rose: { text: 'text-rose-600 ', bg: 'bg-rose-500', bgLight: 'bg-rose-50 ', border: 'border-rose-100 ' },
    slate: { text: 'text-slate-600 ', bg: 'bg-slate-500', bgLight: 'bg-slate-50 ', border: 'border-slate-100 ' },
  };

  // Filter & Search subjects
  const filteredSubjects = subjects.filter(sub => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = sub.name.toLowerCase().includes(searchLower);
    const codeMatch = sub.code ? sub.code.toLowerCase().includes(searchLower) : false;
    const descMatch = sub.description ? sub.description.toLowerCase().includes(searchLower) : false;
    return nameMatch || codeMatch || descMatch;
  });

  // Sort subjects
  const sortedSubjects = [...filteredSubjects].sort((a, b) => {
    if (sortBy === 'nameAsc') return a.name.localeCompare(b.name);
    if (sortBy === 'nameDesc') return b.name.localeCompare(a.name);
    if (sortBy === 'hoursDesc') return b.targetHours - a.targetHours;
    if (sortBy === 'progressDesc') return b.progress - a.progress;
    return 0;
  });

  return (
    <div className="space-y-6">
      
      {/* Feedback Banner */}
      {feedback.message && (
        <div className={`fixed top-4 right-4 z-50 rounded-xl p-4 shadow-lg border transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          feedback.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2 font-medium text-sm">
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Subjects Manager</h1>
          <p className="text-sm text-slate-500 ">Add course categories, goals, and track your overall completions.</p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-xs"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Subject
        </button>
      </div>

      {/* Search and Sort controls */}
      {subjects.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects by name, code or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-55 py-2 pr-4 pl-10 text-sm placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block rounded-xl border border-slate-200 bg-slate-55 p-2 text-xs font-semibold focus:outline-none"
            >
              <option value="nameAsc">Name (A-Z)</option>
              <option value="nameDesc">Name (Z-A)</option>
              <option value="hoursDesc">Study Goal (High to Low)</option>
              <option value="progressDesc">Progress (High to Low)</option>
            </select>
          </div>
        </div>
      )}

      {subjects.length === 0 ? (
        <EmptyState 
          icon={BookOpen} 
          title="No subjects yet" 
          description="Add your first subject to start tracking your progress."
          actionText="Add Subject"
          onAction={openAddModal}
        />
      ) : sortedSubjects.length === 0 ? (
        <EmptyState 
          icon={HelpCircle} 
          title="No matching subjects" 
          description="Try modifying your search query to find your subject."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedSubjects.map((sub) => {
            const colors = colorMap[sub.color] || colorMap.slate;
            const subTasks = tasks.filter(t => t.subjectId === sub.id);
            const completedCount = subTasks.filter(t => t.status === 'Completed').length;
            
            // Calculate actual dynamically updated progress percentage based on tasks
            const calculatedProgress = subTasks.length > 0 
              ? Math.round((completedCount / subTasks.length) * 100)
              : 0;

            return (
              <div 
                key={sub.id} 
                className={`rounded-2xl border p-5 bg-white transition shadow-xs flex flex-col justify-between ${colors.border}`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="flex flex-col gap-1 items-start min-w-0">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${colors.bgLight} ${colors.text} truncate max-w-full`}>
                        {sub.name}
                      </span>
                      {sub.code && (
                        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider px-1">
                          {sub.code}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(sub)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition"
                        title="Edit Subject"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(sub.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-650 transition"
                        title="Delete Subject"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {sub.description && (
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 px-1">
                      {sub.description}
                    </p>
                  )}

                  {/* Stat labels */}
                  <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mb-4">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Tasks</span>
                      <span className="text-sm font-semibold text-slate-700 ">
                        {subTasks.length} ({completedCount} done)
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Target className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Goal</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-700 ">{sub.targetHours} hours</span>
                    </div>
                  </div>

                  {/* Target Date */}
                  {sub.targetDate && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-405 font-medium mb-4">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>Target: {sub.targetDate}</span>
                    </div>
                  )}
                </div>

                {/* Progress bar info */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                    <span>Task Completion</span>
                    <span>{calculatedProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${colors.bg}`}
                      style={{ width: `${calculatedProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <Modal 
          isOpen={true} 
          onClose={() => setConfirmDeleteId(null)} 
          title="Confirm Delete"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to delete this subject? This action cannot be undone and will delete all linked tasks, notes, and study sessions.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteConfirm(confirmDeleteId)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingSubject ? 'Edit Subject' : 'Add Subject'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Subject Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Linear Algebra"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Subject Code (Optional)</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. MATH201"
              className="block w-full rounded-xl border border-slate-200 bg-slate-55 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description (Optional)</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of course modules or topics..."
              className="block w-full rounded-xl border border-slate-200 bg-slate-55 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Study Goal (Hours) *</label>
              <input
                type="number"
                min="1"
                max="500"
                required
                value={targetHours}
                onChange={(e) => setTargetHours(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Target Date *</label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Accent Theme Color</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {colorOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setColor(opt.value)}
                  className={`h-8 w-8 rounded-full ${opt.bg} transition ${color === opt.value ? `ring-2 ring-offset-2 ${opt.ring}` : 'opacity-70 hover:opacity-100'}`}
                  title={opt.label}
                />
              ))}
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
              {editingSubject ? 'Save Changes' : 'Add Subject'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

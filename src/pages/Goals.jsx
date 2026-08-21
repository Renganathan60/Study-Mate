import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Target, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useStudy();
  const [isOpen, setIsOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [progress, setProgress] = useState(0);

  const openAddModal = () => {
    setEditingGoal(null);
    setTitle('');
    setTargetDate(new Date().toISOString().split('T')[0]);
    setProgress(0);
    setIsOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setTargetDate(goal.targetDate);
    setProgress(goal.progress);
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;

    const payload = {
      title,
      targetDate,
      progress: parseInt(progress)
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, payload);
    } else {
      addGoal(payload);
    }
    setIsOpen(false);
  };

  // Group goals
  const activeGoals = goals.filter(g => g.progress < 100);
  const completedGoals = goals.filter(g => g.progress === 100);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Academic Goals</h1>
          <p className="text-sm text-slate-500 ">Set key semester study targets and track your completion progress.</p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-xs"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <EmptyState 
          icon={Target} 
          title="No goals set yet" 
          description="Define milestone targets like 'Study 3 hours daily' or 'Finish research project'."
          actionText="Set First Goal"
          onAction={openAddModal}
        />
      ) : (
        <div className="space-y-8">
          
          {/* Active Goals Section */}
          {activeGoals.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">In Progress Goals ({activeGoals.length})</h2>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeGoals.map(goal => (
                  <div key={goal.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-905 text-sm line-clamp-2">{goal.title}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditModal(goal)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="mt-1 text-[10px] text-slate-400 font-bold uppercase">Deadline: {goal.targetDate}</p>
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-indigo-650 transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      
                      {/* Incrementor shortcut */}
                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          onClick={() => updateGoal(goal.id, { progress: Math.min(100, goal.progress + 10) })}
                          className="rounded bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-650 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                          +10%
                        </button>
                        <button
                          onClick={() => updateGoal(goal.id, { progress: 100 })}
                          className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-705 hover:bg-indigo-600 hover:text-white transition"
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Goals Section */}
          {completedGoals.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Completed Milestones ({completedGoals.length})</h2>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {completedGoals.map(goal => (
                  <div key={goal.id} className="rounded-xl border border-slate-205 bg-slate-50/50 p-5 flex flex-col justify-between opacity-85">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-700 text-sm line-through line-clamp-2">{goal.title}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-[10px] text-slate-400 font-bold uppercase">Achieved on deadline: {goal.targetDate}</p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 ">
                        <CheckCircle2 className="h-4 w-4" /> Completed
                      </span>
                      <button
                        onClick={() => updateGoal(goal.id, { progress: 90 })}
                        className="rounded border border-slate-200 px-2 py-0.5 text-[9px] font-bold text-slate-500 hover:bg-white transition "
                      >
                        Reopen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingGoal ? 'Edit Goal' : 'Create Goal'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Goal Milestone</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Linear Algebra Syllabus"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Target Date</label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-slate-700 ">Progress Completion Percentage</label>
              <span className="text-sm font-bold text-indigo-650">{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-605 "
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
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {editingGoal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

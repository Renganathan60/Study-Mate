import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Sparkles, Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';

export default function AISuggestions() {
  const { subjects } = useStudy();
  
  // Form State
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [availableHours, setAvailableHours] = useState('3');
  const [daysCount, setDaysCount] = useState('5');
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const handleSubjectToggle = (id) => {
    if (selectedSubjects.includes(id)) {
      setSelectedSubjects(selectedSubjects.filter(subId => subId !== id));
    } else {
      setSelectedSubjects([...selectedSubjects, id]);
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject to generate your study plan.");
      return;
    }

    setLoading(true);
    setGeneratedPlan(null);

    // Simulate API network call delay
    setTimeout(() => {
      setLoading(false);
      
      // Deterministically generate a beautiful study guide based on selected subjects
      const plan = [];
      const days = parseInt(daysCount);
      const hours = parseInt(availableHours);

      const subjectsData = selectedSubjects.map(id => {
        return subjects.find(s => s.id === id) || { name: 'Focus Study' };
      });

      for (let day = 1; day <= days; day++) {
        const slots = [];
        const slotsCount = Math.min(3, hours); // up to 3 blocks per day
        const minutesPerSlot = Math.round((hours * 60) / slotsCount);

        for (let slot = 1; slot <= slotsCount; slot++) {
          const subject = subjectsData[(day + slot) % subjectsData.length];
          
          let taskDescription = '';
          if (subject.name.toLowerCase().includes('math')) {
            taskDescription = slot === 1 ? 'Review formula sheets and solve practice equations.' : 'Attempt textbook exercises and self-grade.';
          } else if (subject.name.toLowerCase().includes('science') || subject.name.toLowerCase().includes('phys') || subject.name.toLowerCase().includes('chem')) {
            taskDescription = slot === 1 ? 'Read textbook chapter summaries and outline main definitions.' : 'Review lab logs and attempt chapter review questions.';
          } else if (subject.name.toLowerCase().includes('computer') || subject.name.toLowerCase().includes('code')) {
            taskDescription = slot === 1 ? 'Write sample scripts and solve programming exercises.' : 'Debug codebase or review system documentation.';
          } else {
            taskDescription = `Review lecture outline notes and prepare flashcards for active recall.`;
          }

          slots.push({
            id: `slot-${day}-${slot}`,
            subjectName: subject.name,
            duration: minutesPerSlot,
            activity: taskDescription,
            timeSlot: slot === 1 ? '09:00 - 10:30' : slot === 2 ? '13:00 - 14:30' : '16:00 - 17:30'
          });
        }

        plan.push({
          dayNumber: day,
          slots
        });
      }

      setGeneratedPlan(plan);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-905 ">AI Study Plan Generator</h1>
        <p className="text-sm text-slate-500 ">Generate a custom revision and calendar framework customized to your study hours.</p>
      </div>

      {subjects.length === 0 && (
        <div className="rounded-xl border border-amber-250 bg-amber-50/50 p-4 text-sm text-amber-800 ">
          ⚠️ You need to add at least one <strong>Subject</strong> before generating an AI Study Plan.
        </div>
      )}

      {/* Control Form Card */}
      <div className="rounded-xl border border-slate-205 bg-white p-6 text-left">
        <form onSubmit={handleGenerate} className="space-y-5">
          
          {/* Select subjects */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              1. Which subjects should be included?
            </label>
            <div className="flex flex-wrap gap-2.5">
              {subjects.map(s => {
                const isSelected = selectedSubjects.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSubjectToggle(s.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition ${isSelected ? 'bg-indigo-600 border-indigo-650 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 '}`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Daily available hours */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                2. Daily Available Study Hours
              </label>
              <input
                type="number"
                min="1"
                max="12"
                required
                value={availableHours}
                onChange={(e) => setAvailableHours(e.target.value)}
                className="block w-full rounded-xl border border-slate-202 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
              />
            </div>

            {/* Total days count */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                3. Schedule Duration (in Days)
              </label>
              <input
                type="number"
                min="1"
                max="14"
                required
                value={daysCount}
                onChange={(e) => setDaysCount(e.target.value)}
                className="block w-full rounded-xl border border-slate-202 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-455">
              <AlertCircle className="h-4 w-4" /> Client-side deterministic model. Fast and reliable.
            </span>
            
            <button
              type="submit"
              disabled={loading || subjects.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-xs"
            >
              <Sparkles className="h-4.5 w-4.5" />
              {loading ? 'Synthesizing...' : 'Generate Plan'}
            </button>
          </div>

        </form>
      </div>

      {/* Generated Response Render */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <span className="text-sm font-semibold">StudyMate AI is analyzing your goals and planning hours...</span>
        </div>
      )}

      {generatedPlan && (
        <div className="space-y-6 text-left">
          <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600 " /> Generated Study Guide
          </h2>
          
          <div className="space-y-4">
            {generatedPlan.map((day) => (
              <div 
                key={day.dayNumber} 
                className="rounded-xl border border-slate-200 bg-white p-5 "
              >
                <h3 className="font-bold text-sm text-indigo-605 mb-3 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Day {day.dayNumber} Outline
                </h3>
                
                <div className="divide-y divide-slate-100 ">
                  {day.slots.map((slot) => (
                    <div key={slot.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="inline-flex items-center rounded bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500 ">
                          {slot.subjectName}
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {slot.activity}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-slate-450 shrink-0 font-semibold sm:self-center">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{slot.timeSlot} ({slot.duration} min)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

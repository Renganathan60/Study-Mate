import React, { useState, useEffect, useRef } from 'react';
import { useStudy } from '../context/StudyContext';
import { Timer as TimerIcon, Play, Pause, RotateCcw, Award } from 'lucide-react';

export default function StudyTimer() {
  const { subjects, addTimerLog, timerLogs } = useStudy();

  // Timer configuration
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [presetDuration, setPresetDuration] = useState(25); // 25, 45, 60 minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  const timerRef = useRef(null);

  // Default subject selection
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  // Adjust time-left when changing presets, but only if not currently running
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(presetDuration * 60);
    }
  }, [presetDuration, isRunning]);

  // Main countdown ticker loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleTimerComplete = () => {
    // Save completion log
    addTimerLog({
      subjectId: selectedSubjectId || 'unknown',
      duration: presetDuration
    });
    
    // Play alert sound or trigger browser notification
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.2); // Beep for 1.2s
    } catch (e) {
      console.warn("Audio Context failed to load", e);
    }

    alert(`🎉 Great job! You completed a ${presetDuration}-minute study block!`);
    resetTimer();
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(presetDuration * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate percentage progress for circle ring
  const totalSeconds = presetDuration * 60;
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  // Group stats
  const completedTodayCount = timerLogs.filter(
    log => log.date === new Date().toISOString().split('T')[0]
  ).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Study Focus Timer</h1>
        <p className="text-sm text-slate-500 ">Boost focus and beat procrastination using Pomodoro cycles.</p>
      </div>

      {subjects.length === 0 && (
        <div className="rounded-xl border border-amber-250 bg-amber-50/50 p-4 text-sm text-amber-800 ">
          ⚠️ You need to add at least one <strong>Subject</strong> before starting the focus timer.
        </div>
      )}

      {/* Main Grid split */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left Side: Timer Box (Col-span 2) */}
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center">
          
          {/* Preset Buttons */}
          <div className="flex gap-2 mb-8">
            {[25, 45, 60].map((dur) => (
              <button
                key={dur}
                onClick={() => {
                  if (!isRunning) setPresetDuration(dur);
                }}
                disabled={isRunning}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${presetDuration === dur ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 ' : 'bg-slate-50 text-slate-650 hover:bg-slate-100 '}`}
              >
                {dur} mins
              </button>
            ))}
          </div>

          {/* Subject selector */}
          <div className="w-full max-w-xs mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 text-left">Subject Log Target</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              disabled={isRunning || subjects.length === 0}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Large Clock Display */}
          <div className="relative flex items-center justify-center h-64 w-64 rounded-full border-4 border-slate-100 mb-8 bg-slate-50/50 shadow-inner">
            
            {/* SVG Arc for clock timer ring */}
            <svg className="absolute inset-0 h-full w-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                className="stroke-indigo-600 fill-none"
                strokeWidth="6"
                strokeDasharray="754"
                strokeDashoffset={754 - (754 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>

            {/* Time string */}
            <div className="z-10 space-y-1">
              <span className="block text-5xl font-extrabold tracking-tighter text-slate-950 font-mono">
                {formatTime(timeLeft)}
              </span>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                {isRunning ? 'Focusing...' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={resetTimer}
              className="rounded-xl border border-slate-200 bg-white p-3.5 text-slate-500 hover:bg-slate-50 transition"
              title="Reset Timer"
            >
              <RotateCcw className="h-5.5 w-5.5" />
            </button>

            {isRunning ? (
              <button
                onClick={pauseTimer}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 font-semibold text-white shadow-md hover:bg-amber-600 transition"
              >
                <Pause className="h-5.5 w-5.5 fill-white text-white" />
                Pause
              </button>
            ) : (
              <button
                onClick={startTimer}
                disabled={subjects.length === 0}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                <Play className="h-5.5 w-5.5 fill-white text-white" />
                Start Focus
              </button>
            )}
          </div>

        </div>

        {/* Right Side: Focus Stats Box */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 ">
            <h3 className="font-semibold text-slate-950 mb-4">Focus Record</h3>
            
            <div className="space-y-4">
              {/* Daily count */}
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 ">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed (Today)</span>
                  <span className="text-base font-bold text-slate-905 ">{completedTodayCount} Pomodoros</span>
                </div>
              </div>

              {/* Total minutes logged */}
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600 ">
                  <TimerIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Focus Time</span>
                  <span className="text-base font-bold text-slate-905 ">
                    {Math.round(timerLogs.reduce((sum, log) => sum + log.duration, 0))} minutes
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 text-xs text-slate-500 space-y-2">
            <h4 className="font-bold text-slate-950 ">💡 Pomodoro Tips:</h4>
            <p>1. Stay focused on one single task for the entire interval.</p>
            <p>2. Keep notifications silent and close extra browser tabs.</p>
            <p>3. Take a short 5-minute break after each interval completes.</p>
          </div>
        </div>

      </div>

    </div>
  );
}

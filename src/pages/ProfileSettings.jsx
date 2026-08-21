import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, School, GraduationCap, Target, Clock, 
  AlertTriangle, ShieldCheck, Download, Trash2, 
  RotateCcw, Edit2, Check, X, Bell, Layout, Settings, 
  LogOut, Shield, CheckCircle2, Sparkles
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'
];

export default function ProfileSettings() {
  const { user, login, logout } = useStudy();
  const navigate = useNavigate();

  // Toast State
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Confirmation Modal States
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', title: '', message: '', action: null });

  // Avatar Picker Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Edit Mode State
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Last Saved State
  const [lastSaved, setLastSaved] = useState(() => {
    return localStorage.getItem('sm_settings_last_saved') || 'Never';
  });

  // Profile Draft States (Section 1)
  const [profileDraft, setProfileDraft] = useState({
    name: user?.name || 'Alex Mercer',
    email: user?.email || 'alex@studymate.io',
    avatar: user?.avatar || PRESET_AVATARS[1],
    college: user?.college || 'Stanford University',
    course: user?.course || 'Computer Science & Engineering',
    studyGoal: user?.studyGoal || 'Master Full-Stack Software Engineering and pass midterms with high grades'
  });

  // Keep main profile view state in sync
  const [profileView, setProfileView] = useState({ ...profileDraft });

  // Load profile details from context/localStorage on mount
  useEffect(() => {
    if (user) {
      const loaded = {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        college: user.college || 'Stanford University',
        course: user.course || 'Computer Science & Engineering',
        studyGoal: user.studyGoal || 'Master Full-Stack Software Engineering and pass midterms with high grades'
      };
      setProfileDraft(loaded);
      setProfileView(loaded);
    }
  }, [user]);

  // Study Preferences States (Section 2)
  const [studyPrefs, setStudyPrefs] = useState({
    dailyGoal: localStorage.getItem('sm_pref_daily_goal') || '4',
    startTime: localStorage.getItem('sm_pref_start_time') || '09:00',
    endTime: localStorage.getItem('sm_pref_end_time') || '17:05',
    sessionDuration: localStorage.getItem('sm_pref_session_duration') || '45',
    weeklyTarget: localStorage.getItem('sm_pref_weekly_target') || '20',
    defaultPriority: localStorage.getItem('sm_pref_default_priority') || 'Medium'
  });

  // Notification Preferences States (Section 3)
  const [notifications, setNotifications] = useState({
    sessionReminder: localStorage.getItem('sm_notify_session') !== 'false',
    deadlineReminder: localStorage.getItem('sm_notify_deadline') !== 'false',
    dailyReminder: localStorage.getItem('sm_notify_daily') !== 'false',
    weeklySummary: localStorage.getItem('sm_notify_weekly') !== 'false'
  });

  // Appearance States (Section 4)
  const [appearance, setAppearance] = useState({
    theme: localStorage.getItem('sm_app_theme') || 'light',
    layoutCompact: localStorage.getItem('sm_app_compact') === 'true',
    reduceAnimations: localStorage.getItem('sm_app_reduce_animations') === 'true'
  });

  // Apply Appearance settings globally
  useEffect(() => {
    // Theme Mode
    if (appearance.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    // Layout Compact
    if (appearance.layoutCompact) {
      document.body.classList.add('layout-compact');
    } else {
      document.body.classList.remove('layout-compact');
    }

    // Reduce Animations
    if (appearance.reduceAnimations) {
      document.body.classList.add('reduce-animations');
    } else {
      document.body.classList.remove('reduce-animations');
    }
  }, [appearance.theme, appearance.layoutCompact, appearance.reduceAnimations]);

  // Helpers
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  };

  const updateLastSavedTimestamp = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString() + ' at ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    localStorage.setItem('sm_settings_last_saved', formatted);
    setLastSaved(formatted);
  };

  // Section 1 - Profile Save / Cancel
  const handleEditProfile = () => {
    setProfileDraft({ ...profileView });
    setIsEditingProfile(true);
  };

  const handleCancelProfileEdit = () => {
    setProfileDraft({ ...profileView });
    setIsEditingProfile(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    // Validation
    if (!profileDraft.name.trim()) return showToast('Full name is required.', 'error');
    if (!profileDraft.email.trim()) return showToast('Email address is required.', 'error');
    if (!profileDraft.college.trim()) return showToast('College / Institution is required.', 'error');
    if (!profileDraft.course.trim()) return showToast('Course / Department is required.', 'error');
    if (!profileDraft.studyGoal.trim()) return showToast('Study goal is required.', 'error');

    const updatedUser = {
      ...user,
      name: profileDraft.name,
      email: profileDraft.email,
      avatar: profileDraft.avatar,
      college: profileDraft.college,
      course: profileDraft.course,
      studyGoal: profileDraft.studyGoal
    };

    // Update global state and context
    login(updatedUser);
    setProfileView({ ...profileDraft });
    setIsEditingProfile(false);
    updateLastSavedTimestamp();
    showToast('✅ Profile information updated successfully.');
  };

  // Section 2 - Save Study Preferences
  const handleSaveStudyPrefs = (e) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('sm_pref_daily_goal', studyPrefs.dailyGoal);
    localStorage.setItem('sm_pref_start_time', studyPrefs.startTime);
    localStorage.setItem('sm_pref_end_time', studyPrefs.endTime);
    localStorage.setItem('sm_pref_session_duration', studyPrefs.sessionDuration);
    localStorage.setItem('sm_pref_weekly_target', studyPrefs.weeklyTarget);
    localStorage.setItem('sm_pref_default_priority', studyPrefs.defaultPriority);

    updateLastSavedTimestamp();
    showToast('✅ Study preferences saved successfully.');
  };

  // Section 3 - Auto Save Toggles
  const handleNotificationToggle = (key) => {
    const newValue = !notifications[key];
    setNotifications(prev => ({ ...prev, [key]: newValue }));
    
    const storageKeys = {
      sessionReminder: 'sm_notify_session',
      deadlineReminder: 'sm_notify_deadline',
      dailyReminder: 'sm_notify_daily',
      weeklySummary: 'sm_notify_weekly'
    };

    localStorage.setItem(storageKeys[key], newValue ? 'true' : 'false');
    updateLastSavedTimestamp();
    showToast(`🔔 Notification settings updated.`);
  };

  // Section 4 - Auto Save Appearance Toggles
  const handleAppearanceToggle = (key) => {
    if (key === 'theme') {
      const newTheme = appearance.theme === 'light' ? 'dark' : 'light';
      setAppearance(prev => ({ ...prev, theme: newTheme }));
      localStorage.setItem('sm_app_theme', newTheme);
      updateLastSavedTimestamp();
      showToast(`🎨 Appearance theme updated to ${newTheme} mode.`);
      return;
    }
    const newValue = !appearance[key];
    setAppearance(prev => ({ ...prev, [key]: newValue }));

    const storageKeys = {
      layoutCompact: 'sm_app_compact',
      reduceAnimations: 'sm_app_reduce_animations'
    };

    localStorage.setItem(storageKeys[key], newValue ? 'true' : 'false');
    updateLastSavedTimestamp();
    showToast(`🎨 Appearance preferences updated.`);
  };

  // Section 5 - Data & Privacy Actions
  const handleExportData = () => {
    const data = {
      user,
      subjects: JSON.parse(localStorage.getItem('sm_subjects')) || [],
      tasks: JSON.parse(localStorage.getItem('sm_tasks')) || [],
      sessions: JSON.parse(localStorage.getItem('sm_sessions')) || [],
      notes: JSON.parse(localStorage.getItem('sm_notes')) || [],
      goals: JSON.parse(localStorage.getItem('sm_goals')) || [],
      timerLogs: JSON.parse(localStorage.getItem('sm_timer_logs')) || [],
      settings: {
        studyPrefs,
        notifications,
        appearance,
        lastSaved
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `studymate_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('💾 Data exported successfully.');
  };

  const handleClearLocalData = () => {
    setConfirmModal({
      isOpen: true,
      type: 'clear',
      title: 'Clear Local Study Data?',
      message: 'Are you sure you want to clear your study records? This will delete all subjects, tasks, goals, session planners, and notes. Your profile and settings will be preserved.',
      action: () => {
        // Clear local study keys
        localStorage.removeItem('sm_subjects');
        localStorage.removeItem('sm_tasks');
        localStorage.removeItem('sm_sessions');
        localStorage.removeItem('sm_notes');
        localStorage.removeItem('sm_goals');
        localStorage.removeItem('sm_timer_logs');
        
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast('🗑️ Local study data cleared.');
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  };

  const handleResetApplication = () => {
    setConfirmModal({
      isOpen: true,
      type: 'reset',
      title: 'Reset Application Entirely?',
      message: 'This action is permanent. It will clear all local storage, including your profile, settings, preferences, and all study data. The application will be restored to its default fresh state.',
      action: () => {
        localStorage.clear();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast('🔄 Application reset to default.');
        setTimeout(() => {
          window.location.href = '/';
        }, 1200);
      }
    });
  };

  // Section 6 - Account Actions
  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-top duration-300 ${
          toast.type === 'error' 
            ? 'bg-rose-50 border-rose-100 text-rose-800' 
            : 'bg-emerald-50 border-emerald-100 text-emerald-800'
        }`}>
          <div className={`p-1 rounded-lg ${toast.type === 'error' ? 'bg-rose-100' : 'bg-emerald-100'}`}>
            {toast.type === 'error' ? <AlertTriangle className="h-4 w-4 text-rose-600" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          </div>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between pb-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Profile & Settings
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage your profile, preferences and StudyMate experience.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
          <Clock className="h-3.5 w-3.5" />
          <span>Last Saved: <strong className="text-slate-600">{lastSaved}</strong></span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Sections 1 & 2 */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 1 — PROFILE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden transition-all duration-200">
            {/* Header decoration */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                Student Profile
              </h2>
              {!isEditingProfile && (
                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Content */}
            <div className="space-y-6">
              {/* Avatar Selector Panel */}
              <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-slate-100">
                <div className="relative group">
                  <img
                    src={isEditingProfile ? profileDraft.avatar : profileView.avatar}
                    alt="Student Avatar"
                    className="h-20 w-20 rounded-full object-cover ring-4 ring-indigo-50 shadow-md transition-all duration-205"
                  />
                  {isEditingProfile && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left space-y-1.5">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Picture</span>
                  {isEditingProfile ? (
                    <button
                      type="button"
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition active:scale-95"
                    >
                      Change Avatar
                    </button>
                  ) : (
                    <span className="text-xs text-slate-505 italic">Click Edit Profile to change preset</span>
                  )}
                </div>
              </div>

              {/* Profile Details Form / View */}
              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Student Full Name</label>
                      <div className="relative">
                        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={profileDraft.name}
                          onChange={(e) => setProfileDraft(prev => ({ ...prev, name: e.target.value }))}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-9 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                          placeholder="e.g. Alex Mercer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={profileDraft.email}
                          onChange={(e) => setProfileDraft(prev => ({ ...prev, email: e.target.value }))}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-9 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                          placeholder="e.g. alex@studymate.io"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">College / Institution</label>
                      <div className="relative">
                        <School className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={profileDraft.college}
                          onChange={(e) => setProfileDraft(prev => ({ ...prev, college: e.target.value }))}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-9 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                          placeholder="College name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Course / Department</label>
                      <div className="relative">
                        <GraduationCap className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={profileDraft.course}
                          onChange={(e) => setProfileDraft(prev => ({ ...prev, course: e.target.value }))}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-9 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                          placeholder="Field of study"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Study Goal</label>
                    <div className="relative">
                      <Target className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                      <textarea
                        required
                        rows={2}
                        value={profileDraft.studyGoal}
                        onChange={(e) => setProfileDraft(prev => ({ ...prev, studyGoal: e.target.value }))}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-9 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all resize-none"
                        placeholder="What is your primary study objective?"
                      />
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleCancelProfileEdit}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 active:scale-97 shadow-sm transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                /* View Mode */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Student Full Name</span>
                    <p className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400 shrink-0" />
                      {profileView.name}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Email Address</span>
                    <p className="font-medium text-slate-700 text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                      {profileView.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">College / Institution</span>
                    <p className="font-medium text-slate-700 text-sm flex items-center gap-2">
                      <School className="h-4 w-4 text-slate-400 shrink-0" />
                      {profileView.college}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Course / Department</span>
                    <p className="font-medium text-slate-700 text-sm flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-slate-400 shrink-0" />
                      {profileView.course}
                    </p>
                  </div>

                  <div className="sm:col-span-2 space-y-1 pt-1.5 border-t border-slate-50">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Academic Goal</span>
                    <p className="font-medium text-slate-750 text-sm leading-relaxed flex items-start gap-2">
                      <Target className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                      <span>{profileView.studyGoal}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2 — STUDY PREFERENCES */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />
            
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              Study Preferences
            </h2>

            <form onSubmit={handleSaveStudyPrefs} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* Daily Study Goal */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Daily Study Goal (Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    required
                    value={studyPrefs.dailyGoal}
                    onChange={(e) => setStudyPrefs(prev => ({ ...prev, dailyGoal: e.target.value }))}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Session Duration */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Default Session Duration (Minutes)
                  </label>
                  <select
                    value={studyPrefs.sessionDuration}
                    onChange={(e) => setStudyPrefs(prev => ({ ...prev, sessionDuration: e.target.value }))}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="25">25 Minutes (Pomodoro)</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="50">50 Minutes</option>
                    <option value="60">60 Minutes (1 Hour)</option>
                    <option value="90">90 Minutes</option>
                    <option value="120">120 Minutes (2 Hours)</option>
                  </select>
                </div>

              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* Preferred Start Time */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Preferred Study Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={studyPrefs.startTime}
                    onChange={(e) => setStudyPrefs(prev => ({ ...prev, startTime: e.target.value }))}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Preferred End Time */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Preferred Study End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={studyPrefs.endTime}
                    onChange={(e) => setStudyPrefs(prev => ({ ...prev, endTime: e.target.value }))}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* Weekly Study Target */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Weekly Study Target (Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    required
                    value={studyPrefs.weeklyTarget}
                    onChange={(e) => setStudyPrefs(prev => ({ ...prev, weeklyTarget: e.target.value }))}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Default Task Priority */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Default Task Priority
                  </label>
                  <select
                    value={studyPrefs.defaultPriority}
                    onChange={(e) => setStudyPrefs(prev => ({ ...prev, defaultPriority: e.target.value }))}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                </div>

              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 active:scale-97 transition shadow-sm"
                >
                  Save Study Preferences
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column: Sections 3, 4, 5, 6 */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SECTION 3 — NOTIFICATIONS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />

            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-indigo-600" />
              Notifications
            </h2>

            <div className="space-y-4">
              
              {/* Option 1: Study Session Reminder */}
              <div className="flex items-center justify-between">
                <div className="pr-4">
                  <label className="block text-sm font-semibold text-slate-800">Study Session Reminder</label>
                  <span className="block text-xs text-slate-400">Remind you 15m before a session starts</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationToggle('sessionReminder')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications.sessionReminder ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notifications.sessionReminder ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Option 2: Task Deadline Reminder */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="pr-4">
                  <label className="block text-sm font-semibold text-slate-800">Task Deadline Reminder</label>
                  <span className="block text-xs text-slate-400">Notify you about tasks due tomorrow</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationToggle('deadlineReminder')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications.deadlineReminder ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notifications.deadlineReminder ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Option 3: Daily Progress Reminder */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="pr-4">
                  <label className="block text-sm font-semibold text-slate-800">Daily Progress Reminder</label>
                  <span className="block text-xs text-slate-400">Encouragement to finish daily goal</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationToggle('dailyReminder')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications.dailyReminder ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notifications.dailyReminder ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Option 4: Weekly Progress Summary */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="pr-4">
                  <label className="block text-sm font-semibold text-slate-800">Weekly Progress Summary</label>
                  <span className="block text-xs text-slate-400">Receive performance statistics emails</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationToggle('weeklySummary')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications.weeklySummary ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notifications.weeklySummary ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>

          {/* SECTION 4 — APPEARANCE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />

            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layout className="h-4.5 w-4.5 text-indigo-600" />
              Appearance
            </h2>

            <div className="space-y-4">
              {/* Theme: Light / Dark Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-semibold text-slate-800">Dark Theme</label>
                  <span className="block text-xs text-slate-400">Switch between light and dark modes</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAppearanceToggle('theme')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    appearance.theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      appearance.theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Compact / Comfortable Layout Toggle */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="pr-4">
                  <label className="block text-sm font-semibold text-slate-800">Compact Layout</label>
                  <span className="block text-xs text-slate-400">Reduce spacing, margins, and layouts</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAppearanceToggle('layoutCompact')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    appearance.layoutCompact ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      appearance.layoutCompact ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Reduce Animations Toggle */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="pr-4">
                  <label className="block text-sm font-semibold text-slate-800">Reduce Animations</label>
                  <span className="block text-xs text-slate-400">Deactivate transitions for faster speed</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAppearanceToggle('reduceAnimations')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    appearance.reduceAnimations ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      appearance.reduceAnimations ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 5 — DATA & PRIVACY */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />

            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-red-500" />
              Data & Privacy
            </h2>
            <p className="text-[11.5px] text-slate-400 mb-4 leading-normal">
              Your study data is processed and stored locally on your device. Manage data exports or clear storage options.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleExportData}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition"
              >
                <Download className="h-4 w-4 text-slate-500" /> 
                Export Study Backup JSON
              </button>

              <button
                type="button"
                onClick={handleClearLocalData}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-50 border border-orange-100 px-4 py-2.5 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition"
              >
                <Trash2 className="h-4 w-4 text-orange-600" /> 
                Clear Local Study Data
              </button>

              <button
                type="button"
                onClick={handleResetApplication}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white transition"
              >
                <RotateCcw className="h-4 w-4 shrink-0" /> 
                Reset Application Entirely
              </button>
            </div>
          </div>

          {/* SECTION 6 — ACCOUNT */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-700" />

            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="h-4.5 w-4.5 text-slate-750" />
              Account Status
            </h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-50">
                <span className="text-slate-400 font-semibold uppercase tracking-wide">Status</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Student Account
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-50">
                <span className="text-slate-400 font-semibold uppercase tracking-wide">Primary Identity</span>
                <span className="font-semibold text-slate-700">{profileView.email}</span>
              </div>

              <div className="flex justify-between items-center text-xs pb-3">
                <span className="text-slate-400 font-semibold uppercase tracking-wide">Settings Synced</span>
                <span className="text-slate-500 font-medium">{lastSaved}</span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition active:scale-97"
              >
                <LogOut className="h-4 w-4 text-slate-400" />
                Sign Out from StudyMate
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* AVATAR PRESET SELECTOR MODAL */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Select Profile Avatar</h3>
                <p className="text-xs text-slate-400 mt-0.5">Pick one of our premium preset options</p>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-3.5 my-6">
              {PRESET_AVATARS.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setProfileDraft(prev => ({ ...prev, avatar: url }));
                    setIsAvatarModalOpen(false);
                    showToast('Preset avatar selected.');
                  }}
                  className={`relative rounded-full aspect-square overflow-hidden hover:scale-105 border-2 transition duration-200 active:scale-95 ${
                    profileDraft.avatar === url 
                      ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-sm' 
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={url} alt={`avatar-${index}`} className="h-full w-full object-cover" />
                  {profileDraft.avatar === url && (
                    <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                      <Check className="h-5 w-5 text-indigo-700 drop-shadow-md stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-full sm:w-auto px-4.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Warning Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 border border-rose-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-rose-600" />
            </div>

            {/* Content */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">{confirmModal.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{confirmModal.message}</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.action}
                className="w-full px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition active:scale-97 shadow-sm shadow-rose-100"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const { login } = useStudy();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    
    // Simulate login lag
    setTimeout(() => {
      setLoading(false);
      login({
        name: 'Alex Mercer',
        email: email,
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop'
      });
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-colors">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 ">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500 ">
            Sign in to access your study schedules
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200/50 ">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 ">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@studymate.io"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all "
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 ">
                  Password
                </label>
              </div>
              <div className="relative mt-1.5">
                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all "
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 ">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 ">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}

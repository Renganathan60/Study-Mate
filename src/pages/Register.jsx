import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const { login } = useStudy();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      login({
        name: name,
        email: email,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
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
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-500 ">
            Start planning and tracking your studies today
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200/50 ">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 ">
                Full Name
              </label>
              <div className="relative mt-1.5">
                <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all "
                />
              </div>
            </div>

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
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 ">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all "
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition"
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 ">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 ">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Activity, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      // Auth context updates user; redirect based on credentials or let ProtectedRoute handle it
      navigate('/dashboard/user');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to Medinexa AI</h1>
            <p className="text-sm text-slate-500">Access your patient portal, doctor desk, or admin suite</p>
          </div>

          {/* Quick Demo Selector */}
          <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200/80 text-xs space-y-2">
            <span className="font-semibold text-blue-900 block">⚡ Quick Demo One-Click Fill:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('user@medinexa.ai', 'User123!')}
                className="px-2 py-1.5 rounded-lg bg-white border border-blue-200 hover:bg-blue-100 font-medium text-blue-800 transition-colors truncate"
              >
                👤 Patient
              </button>
              <button
                type="button"
                onClick={() => fillDemo('doctor@medinexa.ai', 'Doctor123!')}
                className="px-2 py-1.5 rounded-lg bg-white border border-blue-200 hover:bg-blue-100 font-medium text-teal-800 transition-colors truncate"
              >
                🩺 Doctor
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@medinexa.ai', 'Admin123!')}
                className="px-2 py-1.5 rounded-lg bg-white border border-blue-200 hover:bg-blue-100 font-medium text-purple-800 transition-colors truncate"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-blue-600 font-semibold hover:underline">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

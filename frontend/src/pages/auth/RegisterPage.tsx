import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Activity, Lock, Mail, User, Phone, Globe, AlertCircle, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'user' | 'doctor'>('user');
  const [country, setCountry] = useState('BD');
  const [consent, setConsent] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('You must accept the medical safety agreement and terms.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await register({
        full_name: fullName,
        email,
        password,
        phone,
        role,
        country,
      });
      navigate('/dashboard/user');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Medinexa AI Account</h1>
            <p className="text-sm text-slate-500">Sign up for personalized first-aid triage and healthcare booking</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    role === 'user'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  👤 Patient / User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    role === 'doctor'
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  🩺 Medical Doctor
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahim Khan"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+8801700000000"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="Min 6 characters"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <div className="relative">
                  <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none transition-all bg-white"
                  >
                    <option value="BD">Bangladesh (999)</option>
                    <option value="US">United States (911)</option>
                    <option value="UK">United Kingdom (999)</option>
                    <option value="IN">India (112)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical disclaimer agreement checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-600 leading-snug">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>
                  I understand that Medinexa AI is a preliminary first-aid assistance platform and <strong>not a medical diagnosis tool</strong>. In life-threatening emergencies, I will call local emergency authorities immediately.
                </span>
              </label>
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
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-blue-600 font-semibold hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

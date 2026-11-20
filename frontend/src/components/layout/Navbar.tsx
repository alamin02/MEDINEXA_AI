import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Activity, ShieldAlert, User, LogOut, Menu, X, Calendar, MapPin, MessageSquare, PlusCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/auth/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'doctor') return '/dashboard/doctor';
    return '/dashboard/user';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Check Injury', path: '/dashboard/user/assessment', highlight: true },
    { name: 'Find Hospitals', path: '/hospitals' },
    { name: 'Find Doctors', path: '/doctors' },
    { name: 'AI Telehealth', path: '/telehealth' },
    { name: 'Safety & Triage', path: '/safety' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Emergency Global Ticker */}
      <div className="bg-amber-500 text-slate-900 px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-700 animate-pulse" />
            <span>Emergency? If in severe distress, call local emergency services immediately (Bangladesh: <strong>999</strong>). Medinexa AI provides guidance, not diagnosis.</span>
          </span>
          <span className="hidden md:inline-block bg-slate-900 text-white text-[11px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">
            Prototype Demo Mode
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">Medinexa</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">AI</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-none">First Aid & Triage Care</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'text-blue-600 font-semibold'
                  : item.highlight
                  ? 'text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.highlight && <PlusCircle className="w-4 h-4" />}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardPath()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <User className="w-4 h-4" />
                <span>Dashboard ({user?.role})</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm"
                >
                  Go to {user?.role.toUpperCase()} Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full py-2 text-center text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

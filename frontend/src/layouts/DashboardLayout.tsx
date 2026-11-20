import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Activity,
  Calendar,
  Building2,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  Stethoscope,
  Users,
  ShieldCheck,
  FileText,
  Clock,
  ChevronRight
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userRole = user?.role || 'user';

  // Navigation items per role
  const roleNavItems: Record<string, SidebarItem[]> = {
    user: [
      { name: 'Overview', path: '/dashboard/user', icon: LayoutDashboard },
      { name: 'Check Injury AI', path: '/dashboard/user/assessment', icon: Activity },
      { name: 'My Appointments', path: '/dashboard/user/appointments', icon: Calendar },
      { name: 'Find Hospitals', path: '/hospitals', icon: Building2 },
      { name: 'Doctor Directory', path: '/doctors', icon: Stethoscope },
      { name: 'AI Telehealth Chat', path: '/dashboard/user/telehealth', icon: MessageSquare },
      { name: 'Profile & Settings', path: '/dashboard/user/profile', icon: User },
    ],
    doctor: [
      { name: 'Overview', path: '/dashboard/doctor', icon: LayoutDashboard },
      { name: 'My Appointments', path: '/dashboard/doctor/appointments', icon: Calendar },
      { name: 'Manage Availability', path: '/dashboard/doctor/availability', icon: Clock },
      { name: 'Doctor Profile', path: '/dashboard/doctor/profile', icon: User },
      { name: 'Telehealth Room', path: '/telehealth', icon: MessageSquare },
    ],
    admin: [
      { name: 'System Overview', path: '/dashboard/admin', icon: LayoutDashboard },
      { name: 'User Management', path: '/dashboard/admin/users', icon: Users },
      { name: 'Doctor Approvals', path: '/dashboard/admin/doctors', icon: ShieldCheck },
      { name: 'Hospital Facilities', path: '/dashboard/admin/hospitals', icon: Building2 },
      { name: 'All Appointments', path: '/dashboard/admin/appointments', icon: Calendar },
      { name: 'Audit & Safety Logs', path: '/dashboard/admin/logs', icon: FileText },
    ],
  };

  const currentNav = roleNavItems[userRole] || roleNavItems.user;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-400" />
          <span className="font-bold text-sm tracking-wide">Medinexa AI</span>
          <span className="text-[10px] uppercase font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
            {userRole}
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded bg-slate-800 text-slate-200"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 z-40 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">Medinexa AI</span>
              <p className="text-[10px] text-teal-400 uppercase tracking-widest font-semibold">{userRole} Portal</p>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-sm">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.full_name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Building2 className="w-4 h-4" />
            <span>Public Website</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};

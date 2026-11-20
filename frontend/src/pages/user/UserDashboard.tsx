import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { userAPI, appointmentAPI, assessmentAPI } from '../../services/api';
import { DashboardStats, Appointment, Assessment } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import {
  Activity,
  Calendar,
  Building2,
  Bell,
  Clock,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    upcoming_appointments: 0,
    total_assessments: 0,
    saved_hospitals: 0,
    unread_notifications: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [recentAssessments, setRecentAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, aptRes, assessRes] = await Promise.all([
          userAPI.getDashboard(),
          appointmentAPI.list(),
          assessmentAPI.list(),
        ]);
        setStats(dashRes.data);
        setRecentAppointments(aptRes.data.slice(0, 3));
        setRecentAssessments(assessRes.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-semibold">
            <span>Patient Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-sm text-slate-300">
            Need urgent guidance? Check an injury with our safety-first triage system or book an appointment with our verified specialists.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/dashboard/user/assessment"
            className="px-5 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Activity className="w-4 h-4 text-slate-950" />
            <span>Check Injury</span>
          </Link>
          <Link
            to="/hospitals"
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm flex items-center justify-center gap-2 border border-white/20 transition-all"
          >
            <Building2 className="w-4 h-4" />
            <span>Find Hospitals</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming Visits</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.upcoming_appointments}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Assessments</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.total_assessments}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nearby Hospitals</p>
            <p className="text-2xl font-black text-slate-900 mt-1">15+</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unread Alerts</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.unread_notifications}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Split: Recent Appointments & Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Appointments</h2>
            </div>
            <Link
              to="/dashboard/user/appointments"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              <p>No active appointments scheduled.</p>
              <Link
                to="/doctors"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
              >
                <span>Browse Doctor Directory</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Dr. {apt.doctor_name || 'Specialist'}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(apt.date_time).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-semibold capitalize mt-1 inline-block">
                      {apt.consultation_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'requested'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assessments Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-slate-900">Recent Injury Screenings</h2>
            </div>
            <Link
              to="/dashboard/user/assessment"
              className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1"
            >
              <span>New Check</span>
              <PlusCircle className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAssessments.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              <p>No injury assessments submitted yet.</p>
              <Link
                to="/dashboard/user/assessment"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline"
              >
                <span>Submit first assessment</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAssessments.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-900 line-clamp-1">{item.description}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      item.urgency === 'emergency'
                        ? 'bg-red-100 text-red-800'
                        : item.urgency === 'urgent'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.urgency}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

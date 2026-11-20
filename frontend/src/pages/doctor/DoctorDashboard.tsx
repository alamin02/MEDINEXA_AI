import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { doctorAPI } from '../../services/api';
import { Appointment, DashboardStats } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import {
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Video,
  Building2,
  Users,
  AlertCircle,
  FileText
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    upcoming_appointments: 0,
    total_assessments: 0, // used as pending requests
    saved_hospitals: 0,
    unread_notifications: 0,
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const [statsRes, aptRes] = await Promise.all([
        doctorAPI.getDashboard(),
        doctorAPI.getAppointments(),
      ]);
      setStats(statsRes.data);
      setAppointments(aptRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      await doctorAPI.updateAppointmentStatus(appointmentId, { status: newStatus });
      fetchDoctorData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update status.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-semibold">
              <Stethoscope className="w-4 h-4" />
              <span>Doctor Clinical Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dr. {user?.full_name}
            </h1>
            <p className="text-sm text-teal-100 max-w-xl">
              Manage incoming patient booking requests, approve confirmed clinic slots, and launch telehealth consultation rooms.
            </p>
          </div>
          <div className="shrink-0 bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 text-xs space-y-1">
            <p className="font-semibold text-white">License & Verification:</p>
            <span className="inline-flex items-center gap-1 text-emerald-300 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approved by Admin</span>
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirmed Today</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{stats.upcoming_appointments}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Requests</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{stats.total_assessments}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{appointments.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Appointment Queue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Patient Consultation Queue</h2>
            <span className="badge-demo">Demo Slots</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p>No appointment requests waiting in your queue.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {appointments.map((apt) => (
                <div key={apt.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-slate-900">Patient: {apt.patient_name || 'Anonymous Patient'}</p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'requested'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(apt.date_time).toLocaleString()}</span>
                      </span>
                      <span className="flex items-center gap-1 capitalize">
                        {apt.consultation_type === 'telehealth' ? (
                          <Video className="w-3.5 h-3.5 text-teal-600" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        <span>{apt.consultation_type.replace('_', ' ')}</span>
                      </span>
                    </div>

                    {apt.reason && (
                      <p className="text-xs text-slate-600 pt-1">
                        <strong>Reason:</strong> {apt.reason}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {apt.status === 'requested' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(apt.id, 'confirmed')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(apt.id, 'rejected')}
                          className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(apt.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

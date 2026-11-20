import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { adminAPI } from '../../services/api';
import { AdminDashboardStats, DoctorProfile, Hospital, User } from '../../types';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Building2,
  Calendar,
  Activity,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats>({
    total_users: 0,
    total_doctors: 0,
    total_appointments: 0,
    pending_verifications: 0,
    total_hospitals: 0,
    total_assessments: 0,
  });
  const [pendingDoctors, setPendingDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getPendingDoctors(),
      ]);
      setStats(statsRes.data);
      setPendingDoctors(pendingRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerify = async (doctorId: number, status: 'approved' | 'rejected') => {
    try {
      await adminAPI.verifyDoctor(doctorId, { status });
      fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update doctor verification.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-400/20 text-purple-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Administration & Safety Oversight</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital & Clinical Governance Console
            </h1>
            <p className="text-sm text-purple-200 max-w-xl">
              Review credential submissions, manage healthcare facilities, monitor appointments, and ensure patient safety standards.
            </p>
          </div>
          <span className="badge-demo bg-purple-200 text-purple-950 font-bold px-3 py-1 text-xs rounded-lg shrink-0">
            Full Access Superadmin
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">{stats.total_users}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Users</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <Stethoscope className="w-5 h-5 text-teal-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">{stats.total_doctors}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Doctors</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <Building2 className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">{stats.total_hospitals}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Hospitals</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <Calendar className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">{stats.total_appointments}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Bookings</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <Activity className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">{stats.total_assessments}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Screenings</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <ShieldCheck className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-amber-600">{stats.pending_verifications}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Pending</p>
          </div>
        </div>

        {/* Doctor Verification Queue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Doctor Credential Verification Requests</h2>
            <span className="text-xs text-slate-500">{pendingDoctors.length} Pending Review</span>
          </div>

          {loading ? (
            <div className="h-20 bg-slate-100 rounded-xl animate-pulse"></div>
          ) : pendingDoctors.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p>All submitted medical licenses have been verified and processed.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingDoctors.map((doc) => (
                <div key={doc.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{doc.full_name}</h3>
                    <p className="text-xs text-slate-600">{doc.qualifications} — {doc.specialty?.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Affiliation: {doc.hospital_name || 'Independent'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify(doc.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                    >
                      Approve License
                    </button>
                    <button
                      onClick={() => handleVerify(doc.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                    >
                      Reject
                    </button>
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

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { appointmentAPI, doctorAPI } from '../../services/api';
import { Appointment, DoctorProfile } from '../../types';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Video,
  Building2,
  XCircle,
  PlusCircle,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const UserAppointmentsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preSelectedDoctorId = searchParams.get('doctor_id');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New Appointment Form State
  const [doctorId, setDoctorId] = useState<string>(preSelectedDoctorId || '');
  const [dateTime, setDateTime] = useState('');
  const [consultationType, setConsultationType] = useState('in_person');
  const [reason, setReason] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aptRes, docRes] = await Promise.all([
        appointmentAPI.list(),
        doctorAPI.list(),
      ]);
      setAppointments(aptRes.data);
      setDoctors(docRes.data);
      if (preSelectedDoctorId) {
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [preSelectedDoctorId]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(null);

    try {
      await appointmentAPI.create({
        doctor_id: parseInt(doctorId),
        date_time: new Date(dateTime).toISOString(),
        consultation_type: consultationType,
        reason,
      });
      setBookingSuccess('Appointment requested successfully!');
      setTimeout(() => {
        setShowModal(false);
        setBookingSuccess(null);
        fetchData();
      }, 1500);
    } catch (err: any) {
      setBookingError(err.response?.data?.detail || 'Failed to book slot.');
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentAPI.cancel(id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to cancel.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Appointments</h1>
              <span className="badge-demo">Demo Schedule</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Review your scheduled clinic and telehealth consultations with doctor status updates.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book New Appointment</span>
          </button>
        </div>

        {/* Appointment List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse h-24"></div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Appointments Booked</h3>
            <p className="text-sm text-slate-500">Select a verified physician to schedule your consultation.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              Book First Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-slate-900">Dr. {apt.doctor_name || 'Specialist'}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'requested'
                            ? 'bg-yellow-100 text-yellow-800'
                            : apt.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    {apt.specialty && <p className="text-xs font-semibold text-teal-600">{apt.specialty}</p>}
                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(apt.date_time).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
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
                    {apt.reason && <p className="text-xs text-slate-600 pt-1 italic">Reason: "{apt.reason}"</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                    <button
                      onClick={() => handleCancel(apt.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900">Book Doctor Consultation</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              {bookingSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{bookingSuccess}</span>
                </div>
              )}

              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Select Doctor
                  </label>
                  <select
                    required
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="">-- Choose a doctor --</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.full_name} ({d.specialty?.name || 'General'} - ৳{d.consultation_fee || '800'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Consultation Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultationType('in_person')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                        consultationType === 'in_person'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      In-Person Hospital Visit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultationType('telehealth')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                        consultationType === 'telehealth'
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      Telehealth Video Call
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Reason for Consultation
                  </label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Brief description of current pain or symptom..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { doctorAPI } from '../../services/api';
import { DoctorProfile, Specialty } from '../../types';
import {
  Stethoscope,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  DollarSign,
  Video,
  Award
} from 'lucide-react';

export const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [consultationFilter, setConsultationFilter] = useState('');

  useEffect(() => {
    doctorAPI.getSpecialties().then(res => setSpecialties(res.data)).catch(console.error);
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (specialtyFilter) params.specialty = specialtyFilter;
      if (consultationFilter) params.consultation_type = consultationFilter;
      if (searchQuery) params.search = searchQuery;
      const res = await doctorAPI.list(params);
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialtyFilter, consultationFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Verified Medical Specialists</h1>
              <span className="badge-demo">Demo Schedule</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Connect with certified physicians for in-person clinic visits or telehealth video consultations.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctor by name or credentials..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none bg-white text-slate-700"
            >
              <option value="">All Specialties</option>
              {specialties.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={consultationFilter}
              onChange={(e) => setConsultationFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none bg-white text-slate-700"
            >
              <option value="">Any Consultation Mode</option>
              <option value="in_person">In-Person Clinic</option>
              <option value="telehealth">Telehealth Video</option>
            </select>
          </div>
        </form>

        {/* Doctor List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse space-y-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-12 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Doctors Found</h3>
            <p className="text-sm text-slate-500 mt-1">Try resetting your specialty filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map(doctor => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 border border-blue-200">
                      {doctor.full_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-base text-slate-900">{doctor.full_name}</h3>
                        {doctor.is_verified ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="badge-demo">Demo</span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-teal-600 mt-0.5">
                        {doctor.specialty?.name || 'General Practitioner'}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">{doctor.qualifications}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    {doctor.hospital_name && (
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doctor.hospital_name}</span>
                      </p>
                    )}
                    <p className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doctor.experience_years} Years Clinical Practice</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="capitalize">{doctor.consultation_modes.replace(',', ' & ')}</span>
                    </p>
                    {doctor.consultation_fee && (
                      <p className="flex items-center gap-1 text-slate-900 font-semibold pt-1">
                        <span>Consultation Fee:</span>
                        <span className="text-blue-700">৳{doctor.consultation_fee} BDT</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/dashboard/user/appointments?doctor_id=${doctor.id}`}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs text-center transition-colors shadow-sm"
                  >
                    Book Appointment
                  </Link>
                  <Link
                    to="/telehealth"
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                    title="Ask AI Assistant about this doctor"
                  >
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

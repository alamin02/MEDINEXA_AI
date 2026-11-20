import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { hospitalAPI } from '../../services/api';
import { Hospital } from '../../types';
import {
  Building2,
  MapPin,
  Phone,
  Search,
  Filter,
  Navigation,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Bed
} from 'lucide-react';

export const HospitalsPage: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('');

  const fetchHospitals = async (lat?: number, lng?: number) => {
    setLoading(true);
    try {
      const params: any = {};
      if (cityFilter) params.city = cityFilter;
      if (typeFilter) params.facility_type = typeFilter;
      if (searchQuery) params.search = searchQuery;
      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
      }
      const res = await hospitalAPI.search(params);
      setHospitals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals(userCoords?.lat, userCoords?.lng);
  }, [cityFilter, typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHospitals(userCoords?.lat, userCoords?.lng);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }
    setLocationStatus('Locating nearby facilities...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocationStatus('Sorted by proximity to your device location.');
        fetchHospitals(coords.lat, coords.lng);
      },
      (err) => {
        setLocationStatus('Location access denied. Displaying general hospital directory.');
        fetchHospitals();
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hospital & Emergency Discovery</h1>
              <span className="badge-demo">Demo Directory</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Find verified government and private medical facilities in Bangladesh with emergency triage units.
            </p>
          </div>

          <button
            onClick={requestLocation}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-sm font-semibold transition-colors shrink-0"
          >
            <Navigation className="w-4 h-4 text-teal-600" />
            <span>Find Near My Location</span>
          </button>
        </div>

        {locationStatus && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{locationStatus}</span>
          </div>
        )}

        {/* Search & Filters */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hospital name or address..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none bg-white text-slate-700"
            >
              <option value="">All Cities (Bangladesh)</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Khulna">Khulna</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none bg-white text-slate-700"
            >
              <option value="">All Facility Types</option>
              <option value="government">Government Hospitals</option>
              <option value="private">Private Medical Centers</option>
            </select>
          </div>
        </form>

        {/* Results List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="h-16 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : hospitals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Hospitals Found</h3>
            <p className="text-sm text-slate-500 mt-1">Try relaxing your search terms or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        hospital.facility_type === 'government'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {hospital.facility_type}
                    </span>
                    {hospital.distance_km !== null && hospital.distance_km !== undefined && (
                      <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {hospital.distance_km} km away
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {hospital.name}
                  </h3>

                  <div className="mt-2 text-xs text-slate-500 space-y-1.5">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{hospital.address}, {hospital.city}</span>
                    </p>
                    {hospital.phone && (
                      <p className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{hospital.phone}</span>
                      </p>
                    )}
                    {hospital.bed_count && (
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <Bed className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{hospital.bed_count} Inpatient Beds</span>
                      </p>
                    )}
                  </div>

                  {hospital.emergency_services && (
                    <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3 h-3 text-red-600" />
                      <span>24/7 Emergency Care Available</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${hospital.name}, ${hospital.address}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {hospital.phone && (
                    <a
                      href={`tel:${hospital.phone}`}
                      className="py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  )}
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

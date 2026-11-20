import React, { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { userAPI } from '../../services/api';
import { User, Phone, Mail, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || 'BD');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userAPI.updateProfile({
        full_name: fullName,
        phone,
        country,
        language,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Profile & Consent</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal contact details, preferred emergency country, and medical data preferences.
          </p>
        </div>

        {saved && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile successfully updated.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Account Email
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801700000000"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                Emergency Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="BD">Bangladesh (Local Dispatch: 999)</option>
                <option value="US">United States (911)</option>
                <option value="UK">United Kingdom (999)</option>
                <option value="IN">India (112)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

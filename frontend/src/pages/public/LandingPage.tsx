import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import {
  Activity,
  ShieldAlert,
  Camera,
  MapPin,
  Calendar,
  Stethoscope,
  ChevronRight,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-teal-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Next-Generation First Aid & Clinical Triage</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Rapid First Aid Advice. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-teal-400">
                Nearest Hospitals. Verified Doctors.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Describe your injury by photo, text, or voice. Medinexa AI screens urgency levels, provides cautious first aid guidance, and immediately connects you with nearby hospitals and appointments.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard/user/assessment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-teal-300 to-teal-400 hover:from-teal-200 hover:to-teal-300 shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Activity className="w-5 h-5 text-slate-950" />
                <span>Check An Injury Now</span>
              </Link>
              <Link
                to="/hospitals"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all"
              >
                <MapPin className="w-5 h-5 text-teal-400" />
                <span>Find Nearby Hospitals</span>
              </Link>
            </div>

            {/* Emergency Prompt */}
            <div className="pt-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/60 border border-red-800/40 text-red-200 text-xs font-medium">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>Suspected life-threatening trauma? Stop here and call <strong>999</strong> immediately.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="bg-amber-500/10 border-y border-amber-500/20 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <p>
              <strong>Safety Priority Notice:</strong> Medinexa AI provides rule-grounded educational triage. It is not an FDA/DGDA approved medical diagnostic device.
            </p>
          </div>
          <Link to="/safety" className="font-semibold text-blue-700 hover:underline shrink-0">
            Read Clinical Triage Protocols →
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Complete Emergency Support Ecosystem
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              From the instant an accident occurs to verified doctor appointments and telehealth sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Multimodal Assessment</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload injury photos, speak via microphone, or type symptoms. Rigorous rules classify urgency: Emergency, Urgent, or Non-urgent.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Hospital Discovery</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Locate nearby government and private healthcare facilities in Bangladesh with distance calculations, bed counts, and emergency indicators.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Appointments</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Book verified time slots directly with doctors. Backend concurrency checks ensure no double booking.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Telehealth Desk</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Consult with our conversational assistant in English or Bangla. Get specialist recommendations and demo consultation room entry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-teal-400 font-bold uppercase tracking-wider text-xs">Four Simple Steps</span>
            <h2 className="text-3xl font-bold tracking-tight">How Medinexa AI Guides You</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              { step: '01', title: 'Describe or Snap', desc: 'Describe symptoms or upload a photo of the wound with explicit privacy consent.' },
              { step: '02', title: 'Safety Triage', desc: 'Our engine detects red-flag indicators immediately, prioritizing life over AI inference.' },
              { step: '03', title: 'First Aid Guidance', desc: 'Receive step-by-step non-invasive first-aid steps and clear warning signs.' },
              { step: '04', title: 'Direct Care Match', desc: 'Instantly view verified hospitals and book specialized doctor slots.' },
            ].map((s, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                <span className="text-4xl font-extrabold text-teal-400/40 block mb-3">{s.step}</span>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fast Demo Access Card */}
      <section className="py-16 bg-blue-50 border-t border-blue-100">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Testing & Evaluation Portal</h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Ready to evaluate Medinexa AI? Sign in with one of our pre-seeded role accounts to explore Patient, Doctor, or Administrator workflows.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-blue-600 uppercase">Patient Demo</span>
              <p className="text-sm font-semibold text-slate-900 mt-1">user@medinexa.ai</p>
              <p className="text-xs text-slate-500 font-mono">User123!</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-teal-600 uppercase">Doctor Demo</span>
              <p className="text-sm font-semibold text-slate-900 mt-1">doctor@medinexa.ai</p>
              <p className="text-xs text-slate-500 font-mono">Doctor123!</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-purple-600 uppercase">Admin Demo</span>
              <p className="text-sm font-semibold text-slate-900 mt-1">admin@medinexa.ai</p>
              <p className="text-xs text-slate-500 font-mono">Admin123!</p>
            </div>
          </div>
          <div className="pt-2">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span>Access Demo Credentials</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

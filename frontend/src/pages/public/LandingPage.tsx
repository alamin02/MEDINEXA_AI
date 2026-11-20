import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
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
  AlertCircle,
  HeartPulse,
  PhoneCall,
  ArrowRight
} from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
      <Navbar />

      {/* Hero Section with Framer Motion */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-teal-500/10 to-transparent pointer-events-none" />
        
        {/* Animated Background Glow Blobs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 9, repeat: Infinity, delay: 1 }}
          className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl pointer-events-none"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-teal-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-teal-400 animate-spin-slow" />
              <span>Safety-First AI First Aid & Clinical Triage</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Rapid First Aid Advice. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-teal-400">
                Nearest Hospitals. Verified Doctors.
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Describe your injury by photo, text, or voice. Medinexa AI screens urgency levels, provides cautious first-aid guidance, and connects you directly with nearby hospitals and certified doctors.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  to="/dashboard/user/assessment"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-300 to-teal-400 hover:from-teal-200 hover:to-teal-300 shadow-lg shadow-teal-500/25 transition-all"
                >
                  <Activity className="w-5 h-5 text-slate-950" />
                  <span>Check An Injury Now</span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  to="/hospitals"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 transition-all backdrop-blur"
                >
                  <MapPin className="w-5 h-5 text-teal-400" />
                  <span>Find Nearby Hospitals</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Emergency Prompt */}
            <motion.div variants={fadeInUp} className="pt-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-950/60 border border-red-800/40 text-red-200 text-xs font-medium backdrop-blur">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
                <span>Immediate life threat? Call local emergency services now (Bangladesh: <strong>999</strong>).</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Safety Notice Banner */}
      <section className="bg-amber-500/10 border-y border-amber-500/20 py-3.5">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <p>
              <strong>Clinical Guardrails:</strong> Medinexa AI provides rule-grounded triage education. It does not replace emergency medical response or diagnostic devices.
            </p>
          </div>
          <Link to="/safety" className="font-semibold text-blue-700 hover:underline shrink-0">
            View Triage Safeguards →
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              End-to-End Emergency & Triage Ecosystem
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              From immediate injury intake to verified hospital discovery, specialist appointments, and AI telehealth.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Feature 1 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-400 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Multimodal Assessment</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Provide injury photos, speak via microphone, or type symptoms. Clear safety rules classify Emergency, Urgent, or Non-urgent care.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <Link to="/dashboard/user/assessment" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  <span>Start Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-400 hover:bg-white hover:shadow-xl hover:shadow-teal-500/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Hospital Discovery</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Locate government and private hospitals across Bangladesh with distance calculation, bed availability info, and 24/7 emergency tags.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <Link to="/hospitals" className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1">
                  <span>Explore Hospitals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-400 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Appointments</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Book slots directly with doctors. Concurrency protection ensures slots cannot be double-booked.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <Link to="/doctors" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  <span>Find Specialists</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-400 hover:bg-white hover:shadow-xl hover:shadow-teal-500/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">AI Telehealth Desk</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Consult in real time with our symptom assistant. Get specialist matching, voice dictation, and demo consultation access.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <Link to="/telehealth" className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1">
                  <span>Chat With Assistant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-teal-400 font-bold uppercase tracking-wider text-xs">Four Simple Steps</span>
            <h2 className="text-3xl font-extrabold tracking-tight">How Medinexa AI Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Describe or Snap', desc: 'Type symptoms, speak using your microphone, or upload an injury photo with explicit consent.' },
              { step: '02', title: 'Safety Triage', desc: 'Deterministic keyword filtering checks for red flags immediately, prioritizing life over AI delay.' },
              { step: '03', title: 'First Aid Guidance', desc: 'Receive cautious step-by-step first-aid steps, limitations, and red-flag warning signs.' },
              { step: '04', title: 'Direct Care Match', desc: 'View nearby verified hospitals with directions and book specialist appointment slots.' },
            ].map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition-colors"
              >
                <span className="text-4xl font-black text-teal-400/30 block mb-2">{s.step}</span>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Credentials Quick-Access */}
      <section className="py-16 bg-blue-50/60 border-t border-blue-100">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Live Hackathon Demonstration Access</h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Experience all three dashboards with pre-seeded role credentials:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <Link to="/auth/login" className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all block group">
              <span className="text-xs font-bold text-blue-600 uppercase">Patient Demo</span>
              <p className="text-sm font-semibold text-slate-900 mt-1">user@medinexa.ai</p>
              <p className="text-xs text-slate-500 font-mono">User123!</p>
            </Link>
            <Link to="/auth/login" className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-teal-400 transition-all block group">
              <span className="text-xs font-bold text-teal-600 uppercase">Doctor Demo</span>
              <p className="text-sm font-semibold text-slate-900 mt-1">doctor@medinexa.ai</p>
              <p className="text-xs text-slate-500 font-mono">Doctor123!</p>
            </Link>
            <Link to="/auth/login" className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-purple-400 transition-all block group">
              <span className="text-xs font-bold text-purple-600 uppercase">Admin Demo</span>
              <p className="text-sm font-semibold text-slate-900 mt-1">admin@medinexa.ai</p>
              <p className="text-xs text-slate-500 font-mono">Admin123!</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

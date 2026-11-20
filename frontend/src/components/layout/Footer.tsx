import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Heart, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Medinexa AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              AI-powered first aid triage, real-time hospital discovery, and doctor consultation portal built for rapid, reliable preliminary emergency guidance.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-amber-300 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>Medical Notice:</strong> Medinexa AI is a prototype demonstration platform. It does not provide medical diagnoses or replace emergency medical responders.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/dashboard/user/assessment" className="hover:text-white transition-colors">Injury Assessment</Link></li>
              <li><Link to="/hospitals" className="hover:text-white transition-colors">Nearby Hospitals</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition-colors">Verified Doctors</Link></li>
              <li><Link to="/telehealth" className="hover:text-white transition-colors">AI Telehealth Assistant</Link></li>
              <li><Link to="/safety" className="hover:text-white transition-colors">Clinical Triage Rules</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Dashboards</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/dashboard/user" className="hover:text-white transition-colors">Patient Portal</Link></li>
              <li><Link to="/dashboard/doctor" className="hover:text-white transition-colors">Doctor Schedule Desk</Link></li>
              <li><Link to="/dashboard/admin" className="hover:text-white transition-colors">Hospital Admin Console</Link></li>
              <li><Link to="/auth/login" className="hover:text-white transition-colors">Demo Credentials</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Emergency BD</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2 text-white font-medium">
                <Phone className="w-4 h-4 text-red-400" />
                <span>Emergency: 999 (Toll-Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@medinexa.ai</span>
              </div>
              <div className="pt-2 text-xs">
                <Link to="/privacy" className="hover:text-white underline mr-3">Privacy</Link>
                <Link to="/terms" className="hover:text-white underline">Terms</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Medinexa AI. Built with safety-first clinical intelligence.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for global health accessibility
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

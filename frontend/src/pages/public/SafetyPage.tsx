import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, Stethoscope, PhoneCall } from 'lucide-react';

export const SafetyPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex-1 max-w-4xl space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Clinical Safety & Triage Architecture</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Safety Protocols & Disclaimer</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Medinexa AI adheres to strict clinical safety safeguards to ensure patients are directed toward immediate emergency care when red flags appear.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Zero Delay for Red Flags</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              If severe bleeding, chest pain, stroke-like symptoms, or breathing distress is detected, the platform immediately overrides normal AI flow with emergency dispatch instructions (Bangladesh 999).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Non-Diagnostic Boundary</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Image analysis provides only preliminary visual cues. It explicitly states that fractures, internal hemorrhages, or infections cannot be ruled out without licensed clinical examination.
            </p>
          </div>
        </div>

        {/* Emergency Red Flags Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Automatic Emergency Red Flags</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-800 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Symptom Category</th>
                  <th className="p-3">Trigger Symptoms</th>
                  <th className="p-3">Automated System Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Cardiovascular</td>
                  <td className="p-3">Chest pressure, left arm pain, severe heart palpitations</td>
                  <td className="p-3 text-red-600 font-medium">Immediate 999 prompt; aborts questionnaire</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Respiratory</td>
                  <td className="p-3">Severe choking, cyanosis (blue lips), gasping for air</td>
                  <td className="p-3 text-red-600 font-medium">Directs to nearest Emergency ER</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Trauma</td>
                  <td className="p-3">Unstoppable arterial bleeding, open fractures, head trauma</td>
                  <td className="p-3 text-red-600 font-medium">Direct pressure instructions + ambulance dispatch</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Neurological</td>
                  <td className="p-3">Sudden paralysis, facial drooping, seizures, loss of consciousness</td>
                  <td className="p-3 text-red-600 font-medium">Stroke protocol advisory</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Verified Data Transparency */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-sm text-blue-950 space-y-2">
          <h3 className="font-bold text-base">Labeling of Demo Records</h3>
          <p className="leading-relaxed">
            Any hospital, doctor availability slot, or AI classification that has not been authenticated against a live clinical provider is visibly tagged with a <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded text-xs font-bold">Demo</span> badge to maintain absolute transparency.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

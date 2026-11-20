import React, { useState, useRef } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { assessmentAPI } from '../../services/api';
import { Assessment } from '../../types';
import {
  Activity,
  Camera,
  UploadCloud,
  Mic,
  MicOff,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  X,
  FileText,
  PhoneCall,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

export const InjuryAssessmentPage: React.FC = () => {
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Assessment | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Setup Voice Recognition
  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file exceeds the 5MB limit.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a description of the injury or symptoms.');
      return;
    }
    if (!consentGiven) {
      setError('You must confirm consent before submitting for preliminary screening.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('description', description);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await assessmentAPI.create(formData);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit assessment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                AI Injury Screening & Triage
              </h1>
              <span className="badge-demo">Demo Classifier</span>
            </div>
            <p className="text-sm text-slate-500">
              Provide symptoms and optional injury photo for risk classification and immediate first-aid instructions.
            </p>
          </div>
        </div>

        {/* Emergency Callout */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Immediate Emergency Notice:</strong> If you or the patient are experiencing heavy arterial bleeding, difficulty breathing, head injury with nausea, or sudden loss of consciousness, do NOT wait. Call <strong>999</strong> (Bangladesh) immediately.
          </p>
        </div>

        {/* Main Input Form */}
        {!result ? (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Description Textarea + Voice Button */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Describe the Injury & Symptoms
                </label>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isRecording ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="How did the injury happen? Is there bleeding? What is the pain level (1-10)? Where on the body is it located?"
                className="w-full p-4 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none transition-all leading-relaxed"
              />
            </div>

            {/* Photo Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Optional Injury Photo (JPEG, PNG, WebP — Max 5MB)
              </label>

              {imagePreview ? (
                <div className="relative inline-block border-2 border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                  <img src={imagePreview} alt="Injury Preview" className="max-h-64 object-contain" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30"
                >
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Click to upload or take a photo</p>
                  <p className="text-xs text-slate-400 mt-1">Image metadata is sanitized before processing</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Consent Notice Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>
                  I give consent for automated preliminary assessment. I understand this <strong>does not constitute a medical diagnosis</strong> and will seek certified physician care.
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Symptoms & Triage Urgency</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Assessment Results View */
          <div className="space-y-6">
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${
                result.urgency === 'emergency'
                  ? 'bg-red-50 border-red-300 text-red-950'
                  : result.urgency === 'urgent'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-blue-50 border-blue-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Urgency Level:</span>
                  <span
                    className={`text-sm font-extrabold uppercase px-3 py-1 rounded-full ${
                      result.urgency === 'emergency'
                        ? 'bg-red-600 text-white animate-pulse'
                        : result.urgency === 'urgent'
                        ? 'bg-amber-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {result.urgency}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Model: {result.model_version} (DEMO)</span>
              </div>

              {/* Main AI Explanation */}
              <div className="mt-4 text-sm leading-relaxed whitespace-pre-line font-medium">
                {result.ai_response}
              </div>

              {/* Visual Observations & Limitations */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {result.observations && (
                  <div className="p-4 bg-white/80 rounded-xl border border-black/5 space-y-1">
                    <p className="font-bold uppercase tracking-wider text-slate-700">What Can Be Observed</p>
                    <p className="text-slate-600">{result.observations}</p>
                  </div>
                )}
                {result.limitations && (
                  <div className="p-4 bg-white/80 rounded-xl border border-black/5 space-y-1">
                    <p className="font-bold uppercase tracking-wider text-slate-700">What Cannot Be Determined</p>
                    <p className="text-slate-600">{result.limitations}</p>
                  </div>
                )}
              </div>

              {/* Step by step First Aid */}
              {result.first_aid && (
                <div className="mt-6 p-4 bg-white/90 rounded-xl border border-black/10 space-y-2">
                  <p className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Cautious First-Aid Instructions</span>
                  </p>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {result.first_aid}
                  </p>
                </div>
              )}

              {/* Warning Signs */}
              {result.warning_signs && (
                <div className="mt-4 p-4 bg-red-100/60 rounded-xl border border-red-200/80 text-xs text-red-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Warning Signs Requiring Immediate Emergency Care</span>
                  </p>
                  <p className="leading-relaxed">{result.warning_signs}</p>
                </div>
              )}
            </div>

            {/* Next Steps Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setResult(null);
                  setDescription('');
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="flex-1 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors text-center"
              >
                Start New Assessment
              </button>
              <a
                href="/hospitals"
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors text-center shadow-sm"
              >
                Find Nearby Hospital Now
              </a>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

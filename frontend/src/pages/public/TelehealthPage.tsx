import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { telehealthAPI } from '../../services/api';
import { ChatResponse, DoctorProfile } from '../../types';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  ShieldAlert,
  Calendar,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isEmergency?: boolean;
  doctors?: DoctorProfile[];
}

export const TelehealthPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your Medinexa AI Telehealth Assistant. 🏥\n\nI can help triage your symptoms, suggest the right medical specialty, and recommend verified doctors in Bangladesh.\n\nWhat health concern or symptoms can I help you with today?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);

    try {
      const res = await telehealthAPI.chat({
        message: userText,
        session_id: sessionId || undefined,
      });

      const data: ChatResponse = res.data;
      if (!sessionId) setSessionId(data.session_id);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        isEmergency: data.is_emergency,
        doctors: data.suggested_doctors,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I apologize, but I encountered an error connecting to the health engine. Please try again or visit our Doctor Directory directly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        setIsRecording(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1 max-w-4xl flex flex-col space-y-4">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">AI Telehealth Assistant</h1>
                <span className="badge-demo">Demo Assistant</span>
              </div>
              <p className="text-xs text-slate-500">Multilingual symptom triage & doctor recommendation engine</p>
            </div>
          </div>

          <button
            onClick={() => {
              setMessages([
                {
                  id: 'welcome',
                  role: 'assistant',
                  content: 'Session refreshed. How can I help you with your symptoms today?',
                },
              ]);
              setSessionId('');
            }}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Emergency Notice */}
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Disclaimer:</strong> This conversational assistant is for demonstration and preliminary triage. If experiencing chest pain, stroke signs, or severe trauma, call <strong>999</strong> immediately.
          </span>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 overflow-y-auto space-y-4 min-h-[420px] max-h-[550px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : m.isEmergency
                    ? 'bg-red-50 border border-red-200 text-red-900 rounded-bl-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.content}</div>

                {/* Render Suggested Doctors Card inside Chat */}
                {m.doctors && m.doctors.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                      Suggested Matching Specialists:
                    </span>
                    <div className="space-y-2">
                      {m.doctors.map((d) => (
                        <div
                          key={d.id}
                          className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{d.full_name}</p>
                            <p className="text-teal-600">{d.specialty?.name || 'Specialist'}</p>
                            {d.hospital_name && <p className="text-slate-500">{d.hospital_name}</p>}
                          </div>
                          <Link
                            to={`/dashboard/user/appointments?doctor_id=${d.id}`}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shrink-0"
                          >
                            Book ৳{d.consultation_fee || '800'}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-500">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span>Analyzing symptoms & matching specialists...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
          {voiceSupported && (
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-2.5 rounded-xl transition-all ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
              title={isRecording ? 'Listening... click to stop' : 'Click to speak'}
            >
              {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
          )}

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              isRecording
                ? 'Listening to speech...'
                : 'Describe your symptoms, location, or required doctor specialty...'
            }
            className="flex-1 py-2 px-3 text-sm outline-none text-slate-800"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

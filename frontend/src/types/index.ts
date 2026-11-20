export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'user' | 'doctor' | 'admin';
  country: string;
  language: string;
  avatar_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface DashboardStats {
  upcoming_appointments: number;
  total_assessments: number;
  saved_hospitals: number;
  unread_notifications: number;
}

export interface Specialty {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

export interface DoctorProfile {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  specialty?: Specialty;
  hospital_name?: string;
  hospital_id?: number;
  qualifications?: string;
  experience_years: number;
  languages: string;
  consultation_modes: string;
  bio?: string;
  consultation_fee?: number;
  is_verified: boolean;
  verification_status: string;
  is_demo: boolean;
  avatar_url?: string;
}

export interface DoctorAvailability {
  id: number;
  doctor_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  slot_duration_minutes: number;
}

export interface Hospital {
  id: number;
  name: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  facility_type: string;
  specialties?: string;
  departments?: string;
  emergency_services: boolean;
  bed_count?: number;
  is_active: boolean;
  is_demo: boolean;
  source: string;
  last_verified?: string;
  distance_km?: number;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  patient_name: string;
  doctor_name: string;
  specialty: string;
  date_time: string;
  end_time: string;
  consultation_type: string;
  status: string;
  reason?: string;
  notes?: string;
  is_demo: boolean;
  created_at?: string;
}

export interface Assessment {
  id: number;
  user_id: number;
  description: string;
  image_path?: string;
  urgency: 'emergency' | 'urgent' | 'non_urgent' | 'info_only';
  ai_response?: string;
  observations?: string;
  limitations?: string;
  next_steps?: string;
  first_aid?: string;
  warning_signs?: string;
  model_version: string;
  is_demo: boolean;
  created_at?: string;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  session_id: string;
  created_at?: string;
}

export interface ChatResponse {
  reply: string;
  session_id: string;
  suggested_doctors?: DoctorProfile[];
  is_emergency: boolean;
  emergency_message?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link?: string;
  created_at?: string;
}

export interface AdminDashboardStats {
  total_users: number;
  total_doctors: number;
  total_appointments: number;
  pending_verifications: number;
  total_hospitals: number;
  total_assessments: number;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  action: string;
  details?: string;
  ip_address?: string;
  created_at?: string;
}

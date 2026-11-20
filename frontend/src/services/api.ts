import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('refresh_token', res.data.refresh_token);
          error.config.headers.Authorization = `Bearer ${res.data.access_token}`;
          return api(error.config);
        } catch {
          localStorage.clear();
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// --- Auth ---
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  refresh: (token: string) => api.post('/auth/refresh', { refresh_token: token }),
};

// --- Users ---
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getDashboard: () => api.get('/users/dashboard'),
};

// --- Doctors ---
export const doctorAPI = {
  list: (params?: any) => api.get('/doctors', { params }),
  get: (id: number) => api.get(`/doctors/${id}`),
  getAvailability: (id: number) => api.get(`/doctors/${id}/availability`),
  getSpecialties: () => api.get('/doctors/specialties'),
  updateProfile: (data: any) => api.put('/doctors/profile', data),
  updateAvailability: (data: any) => api.put('/doctors/availability', data),
  getDashboard: () => api.get('/doctors/dashboard/stats'),
  getAppointments: (params?: any) => api.get('/doctors/appointments/list', { params }),
  updateAppointmentStatus: (id: number, data: any) => api.put(`/doctors/appointments/${id}/status`, data),
};

// --- Hospitals ---
export const hospitalAPI = {
  search: (params?: any) => api.get('/hospitals', { params }),
  get: (id: number) => api.get(`/hospitals/${id}`),
};

// --- Appointments ---
export const appointmentAPI = {
  create: (data: any) => api.post('/appointments', data),
  list: (params?: any) => api.get('/appointments', { params }),
  get: (id: number) => api.get(`/appointments/${id}`),
  cancel: (id: number) => api.put(`/appointments/${id}/cancel`),
};

// --- Assessments ---
export const assessmentAPI = {
  create: (data: FormData) => api.post('/assessments', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  list: () => api.get('/assessments'),
  get: (id: number) => api.get(`/assessments/${id}`),
  delete: (id: number) => api.delete(`/assessments/${id}`),
};

// --- Telehealth ---
export const telehealthAPI = {
  chat: (data: any) => api.post('/telehealth/chat', data),
  history: (sessionId: string) => api.get('/telehealth/chat/history', { params: { session_id: sessionId } }),
};

// --- Notifications ---
export const notificationAPI = {
  list: () => api.get('/notifications'),
  markRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// --- Admin ---
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUserStatus: (id: number, data: any) => api.put(`/admin/users/${id}/status`, data),
  getPendingDoctors: () => api.get('/admin/doctors/pending'),
  verifyDoctor: (id: number, data: any) => api.put(`/admin/doctors/${id}/verify`, data),
  getHospitals: () => api.get('/admin/hospitals'),
  createHospital: (data: any) => api.post('/admin/hospitals', data),
  updateHospital: (id: number, data: any) => api.put(`/admin/hospitals/${id}`, data),
  getAppointments: (params?: any) => api.get('/admin/appointments', { params }),
  getAuditLogs: (params?: any) => api.get('/admin/audit-logs', { params }),
};

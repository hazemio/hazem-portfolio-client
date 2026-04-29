

import axios from 'axios';
import { time } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL:         API_URL,
  withCredentials: true,
});

let csrfToken: string | null = null;

export async function getCsrfToken() {
  if (csrfToken) return csrfToken;

  const res = await api.get('/auth/csrf-token');
  csrfToken = res.data.csrfToken;

  return csrfToken;
}
export function clearCsrfToken() {
  csrfToken = null;
}

// ─── Request interceptor: auto-attach CSRF token on mutations ─────────────────
api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase() || '';

  const isMutating = ['post', 'put', 'patch', 'delete'].includes(method);

  const url = config.url || '';

  if (
    url.includes('/auth/login') ||
    url.includes('/auth/csrf-token')
  ) {
    return config;
  }

  if (isMutating) {
    try {
      const token = await getCsrfToken();

      config.headers = {
        ...(config.headers || {}),
        'X-CSRF-Token': token,
      } as any;
    } catch (e) {
      console.warn('CSRF error:', e);
    }
  }

  return config;
});

// ─── Response interceptor: handle 401 (session expired) ───────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearCsrfToken();
      // Only redirect if currently on an admin page
      if (window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    if (err.response?.status === 403) {
      // CSRF token may have expired — clear and retry next request
      clearCsrfToken();
    }
    return Promise.reject(err);
  },
);

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login:          (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout:         () => api.post('/auth/logout'),
  me:             () => api.get('api/auth/me'),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch('/auth/change-password', data),
};

// ─── Profile ───────────────────────────────────────────────────────────────────
export const profileApi = {
  get:    () => api.get('/profile'),
  update: (data: Record<string, unknown>) => api.patch('/profile', data),

  /** Upload profile image — multipart/form-data, field: "image" */
  uploadImage: (file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post<{ imageUrl: string; imageId: string }>(
      '/profile/upload-image',
       fd,
  {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000,
  }
      
    );
  },
};

// ─── Projects ──────────────────────────────────────────────────────────────────
export const projectsApi = {
  getAll:  () => api.get('/projects'),
  getOne:  (id: string) => api.get(`/projects/${id}`),
  create:  (data: Record<string, unknown>) => api.post('/projects', data),
  update:  (id: string, data: Record<string, unknown>) => api.patch(`/projects/${id}`, data),
  delete:  (id: string) => api.delete(`/projects/${id}`),


  uploadImage: (projectId: string, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post<{ imageUrl: string; imageId: string }>(
      `/projects/upload-image/${projectId}`,
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },
};

// ─── Certificates ──────────────────────────────────────────────────────────────
export const certificatesApi = {
  getAll:  () => api.get('/certificates'),
  getOne:  (id: string) => api.get(`/certificates/${id}`),
  create:  (data: Record<string, unknown>) => api.post('/certificates', data),
  update:  (id: string, data: Record<string, unknown>) => api.patch(`/certificates/${id}`, data),
  delete:  (id: string) => api.delete(`/certificates/${id}`),


  uploadImage: (certId: string, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post<{ imageUrl: string; imageId: string }>(
      `/certificates/upload-image/${certId}`,
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },
};

// ─── Social Links ──────────────────────────────────────────────────────────────
export const socialLinksApi = {
  getAll:  () => api.get('/social-links'),
  create:  (data: Record<string, unknown>) => api.post('/social-links', data),
  update:  (id: string, data: Record<string, unknown>) => api.patch(`/social-links/${id}`, data),
  delete:  (id: string) => api.delete(`/social-links/${id}`),
};

// ─── Messages ──────────────────────────────────────────────────────────────────
export const messagesApi = {
  send:        (data: Record<string, unknown>) => api.post('/messages', data),
  getAll:      () => api.get('/messages'),
  getOne:      (id: string) => api.get(`/messages/${id}`),
  markRead:    (id: string) => api.patch(`/messages/${id}/read`),
  delete:      (id: string) => api.delete(`/messages/${id}`),
  unreadCount: () => api.get('/messages/unread-count'),
};

// ─── Skills ────────────────────────────────────────────────────────────────────
export const skillsApi = {
  getAll:  () => api.get('/skills'),
  create:  (data: Record<string, unknown>) => api.post('/skills', data),
  update:  (id: string, data: Record<string, unknown>) => api.patch(`/skills/${id}`, data),
  delete:  (id: string) => api.delete(`/skills/${id}`),
};
export const experienceApi = {
  getAll: () => api.get('/experience'),
  getOne: (id: string) => api.get(`/experience/${id}`),
  create: (data: any) => api.post('/experience', data),
  update: (id: string, data: any) => api.patch(`/experience/${id}`, data),
  delete: (id: string) => api.delete(`/experience/${id}`),
};
import axios from 'axios';

// Create a configured Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// CSRF Protection
let csrfToken: string | null = null;

export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

export const clearCsrfToken = () => {
  csrfToken = null;
};

// Request Interceptor: Attach CSRF Token
api.interceptors.request.use((config) => {
  if (
    csrfToken &&
    ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')
  ) {
    config.headers['x-csrf-token'] = csrfToken;
  }
  return config;
});

// Response Interceptor: Extract CSRF Token & Handle 401
api.interceptors.response.use(
  (response) => {
    const headerToken = response.headers['x-csrf-token'];
    if (headerToken) {
      csrfToken = headerToken;
    }
    return response;
  },
  (err) => {
    if (err.response?.status === 401) {
      clearCsrfToken();
      if (
        window.location.pathname.startsWith('/tech/mode1/dash/hg/admin') &&
        window.location.pathname !== '/tech/mode1/dash/hg/admin/login'
      ) {
        window.location.href = '/tech/mode1/dash/hg/admin/login';
      }
    }
    if (err.response?.status === 403) {
      clearCsrfToken();
    }
    return Promise.reject(err);
  },
);

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ─── Profile ───────────────────────────────────────────────────────────────────
export const profileApi = {
  get: () => api.get('/profile'),
  update: (data: Record<string, unknown>) => api.patch('/profile', data),
  uploadImage: (file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post('/profile/upload-image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadHeroImage: (file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post('/profile/upload-hero-image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadFootballVideo: (file: File) => {
    const fd = new FormData();
    fd.append('video', file);
    return api.post('/profile/upload-football-video', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteFootballVideo: () => api.delete('/profile/football-video'),
};

// ─── Projects ──────────────────────────────────────────────────────────────────
export const projectsApi = {
  getAll: () => api.get('/projects'),
  getOne: (id: string) => api.get(`/projects/${id}`),
  create: (data: Record<string, unknown>) => api.post('/projects', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),

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
  getAll: () => api.get('/certificates'),
  getOne: (id: string) => api.get(`/certificates/${id}`),
  create: (data: Record<string, unknown>) => api.post('/certificates', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/certificates/${id}`, data),
  delete: (id: string) => api.delete(`/certificates/${id}`),

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
  getAll: () => api.get('/social-links'),
  create: (data: Record<string, unknown>) => api.post('/social-links', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/social-links/${id}`, data),
  delete: (id: string) => api.delete(`/social-links/${id}`),
};

// ─── Messages ──────────────────────────────────────────────────────────────────
export const messagesApi = {
  send: (data: Record<string, unknown>) => api.post('/messages', data),
  getAll: () => api.get('/messages'),
  getOne: (id: string) => api.get(`/messages/${id}`),
  markRead: (id: string) => api.patch(`/messages/${id}/read`),
  delete: (id: string) => api.delete(`/messages/${id}`),
  unreadCount: () => api.get('/messages/unread-count'),
};

// ─── Skills ────────────────────────────────────────────────────────────────────
export const skillsApi = {
  getAll: () => api.get('/skills'),
  create: (data: Record<string, unknown>) => api.post('/skills', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/skills/${id}`, data),
  delete: (id: string) => api.delete(`/skills/${id}`),
};

// ─── Experience ────────────────────────────────────────────────────────────────
export const experienceApi = {
  getAll: () => api.get('/experience'),
  getOne: (id: string) => api.get(`/experience/${id}`),
  create: (data: any) => api.post('/experience', data),
  update: (id: string, data: any) => api.patch(`/experience/${id}`, data),
  delete: (id: string) => api.delete(`/experience/${id}`),
  uploadImage: (id: string, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post<{ imageUrl: string; imageId: string }>(
      `/experience/upload-image/${id}`,
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },
};

// ─── Education ─────────────────────────────────────────────────────────────────
export const educationApi = {
  getAll: () => api.get('/education'),
  getOne: (id: string) => api.get(`/education/${id}`),
  create: (data: any) => api.post('/education', data),
  update: (id: string, data: any) => api.patch(`/education/${id}`, data),
  delete: (id: string) => api.delete(`/education/${id}`),
  uploadImage: (id: string, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post<{ imageUrl: string; imageId: string }>(
      `/education/upload-image/${id}`,
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },
};

// ─── LinkedIn ──────────────────────────────────────────────────────────────────
export const linkedinApi = {
  getPosts: () => api.get('/linkedin/posts'),
  getAdminPosts: () => api.get('/linkedin/admin/posts'),
  getStatus: () => api.get('/linkedin/status'),
  getAuthUrl: () => api.get('/linkedin/auth'),
  sync: () => api.post('/linkedin/sync'),
  disconnect: () => api.post('/linkedin/disconnect'),
  updatePost: (id: string, data: { isVisible?: boolean; isFeatured?: boolean }) =>
    api.patch(`/linkedin/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/linkedin/posts/${id}`),
};

export default api;

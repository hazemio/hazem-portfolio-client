export interface Profile {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  cvUrl?: string;
}

export interface Project {
  technologies: any;
  demoUrl: string;
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl?: string;
  credentialUrl?: string;
  order: number;
}

export interface SocialLink {
  icon: string;
  id: string;
  platform: string;
  url: string;
  iconName: string;
  order: number;
}

export interface Skill {
  icon: any;
  id: string;
  name: string;
  level: number;
  category: string;
  iconName?: string;
  order: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

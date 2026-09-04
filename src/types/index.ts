export interface Profile {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
  imageId?: string;
  heroImageUrl?: string;
  heroImageId?: string;
  yearsExperience?: string;
  completedProjectsLabel?: string;
  clientSatisfaction?: string;
  happyClients?: string;
  projectsCount?: number;
  footballVideoType?: 'CLOUDINARY_UPLOAD' | 'CLOUDINARY_URL' | 'YOUTUBE';
  footballVideoUrl?: string;
  footballVideoPublicId?: string;
  footballYoutubeUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  cvUrl?: string;

  // 🌙 Ramadan Theme & Countdown Settings
  ramadanThemeEnabled?: boolean;
  ramadanThemeForceEnabled?: boolean;
  ramadanThemeStartDate?: string;
  ramadanThemeEndDate?: string;
  ramadanTimerEnabled?: boolean;
  ramadanBannerText?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  detailedContent?: string;
  imageUrl?: string;
  imageId?: string;
  youtubeUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  liveUrl?: string;
  technologies?: string[];
  tags?: string[];
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt?: string;
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
  description?: string;
  imageUrl?: string;
  imageId?: string;
  technologies?: string[];
  order: number;
}

export interface Education {
  id: string;
  title: string;
  institution: string;
  degree?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  imageUrl?: string;
  imageId?: string;
  order: number;
  createdAt?: string;
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

export interface LinkedInPost {
  id: string;
  source?: string;
  linkedinId?: string;
  authorId?: string;
  title?: string;
  content?: string;
  text: string;
  postUrl?: string;
  linkedinUrl?: string;
  imageUrl?: string;
  imageId?: string;
  videoUrl?: string;
  publishedAt?: string;
  reactions: number;
  comments: number;
  reposts: number;
  isVisible: boolean;
  isFeatured: boolean;
  order?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface LinkedInStatus {
  isConnected: boolean;
  isExpired: boolean;
  memberId?: string;
  memberName?: string;
  memberEmail?: string;
  lastSyncAt?: string;
  syncStatus?: string;
  totalPosts: number;
  visiblePosts: number;
  hasClientCredentials: boolean;
  permissionNote?: string;
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

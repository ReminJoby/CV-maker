
export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface Project {
  id: string;
  name: string;
  link?: string;
  description: string;
}

export type ResumeTemplate = 'modern' | 'classic' | 'ats';

export interface ResumeData {
  id: string;
  title: string;
  lastModified: number;
  template: ResumeTemplate;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

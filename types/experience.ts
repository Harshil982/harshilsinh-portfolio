export interface Experience {
  id: string;
  company: string;
  companyInitials: string;
  role: string;
  duration: string;
  startDate: string;
  endDate: string;
  location: string;
  type: string;
  summary: string;
  achievements: string[];
  responsibilities: string[];
  technologies: string[];
  color: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  location: string;
  description: string;
}

export type TimelineType =
  | "education"
  | "job"
  | "project"
  | "certificate"
  | "goal";

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  type: TimelineType;
  icon: string;
}

export interface ProcessStep {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: string;
}

export interface Certificate {
  id: string;
  slug: string;
  title: string;
  issuer: string;
  date: string;
  certificateNumber?: string;
  verifyUrl?: string;
  image: string;
  icon: string;
  color: string;
  summary: string;
  description: string;
  whatILearned: string[];
  realWorldApplication: string[];
  skills: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  metric: string;
  icon: string;
}

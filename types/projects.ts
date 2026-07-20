export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectArchitecture {
  frontend: string;
  stateManagement: string;
  styling: string;
  testing: string;
  notes: string;
}

export interface ProjectScreenshot {
  caption: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  status: string;
  duration: string;
  overview: string;
  description: string;
  features: string[];
  responsibilities: string[];
  challenges: { challenge: string; solution: string }[];
  technologies: string[];
  architecture: ProjectArchitecture;
  metrics: ProjectMetric[];
  screenshots: ProjectScreenshot[];
  github: string;
  live: string;
  color: string;
  gradientSeed: string;
}

export interface LandingProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  designGoal: string;
  technologies: string[];
  responsive: boolean;
  animationLevel: "Low" | "Medium" | "High";
  cta: string;
  demo: string;
  github: string;
  color: string;
  gradientSeed: string;
  images?: string[];
}

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

export interface OpenSourcePackage {
  name: string;
  role: string;
}

export interface OpenSourceCodeExample {
  label: string;
  code: string;
}

export interface OpenSourceLibrary {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  status: string;
  npmPackage: string;
  overview: string;
  problem: string;
  problemExamples?: OpenSourceCodeExample[];
  codeExampleIntro?: string;
  codeExample?: string;
  keyFeatures: string[];
  howItsBuilt: string[];
  docsHighlights: string[];
  technologies: string[];
  docsStack: string[];
  license: string;
  bundleSize?: string;
  packages?: OpenSourcePackage[];
  npmUrl: string;
  githubUrl: string;
  websiteUrl?: string;
  docsUrl: string;
  docsRepoUrl?: string;
  playgroundUrl?: string;
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

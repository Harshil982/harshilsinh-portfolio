export interface Skill {
  name: string;
  icon: string;
  level: number;
  years: number;
}

export interface SkillCategory {
  id: string;
  label: string;
  icon: string;
  skills: Skill[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

export interface OrbitItem {
  name: string;
  icon: string;
}

export interface OrbitRing {
  radius: number;
  duration: number;
  reverse?: boolean;
  items: OrbitItem[];
}

export interface TechOrbitData {
  center: OrbitItem;
  rings: OrbitRing[];
}

import { Cloud, Code2, Layers, type LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiRedux,
  SiTailwindcss,
  SiMui,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiExpress,
  SiSequelize,
  SiPostgresql,
  SiMongodb,
  SiJest,
  SiTestinglibrary,
  SiGit,
  SiBitbucket,
  SiGitlab,
  SiJirasoftware,
  SiFigma,
} from "react-icons/si";

interface TechIconEntry {
  icon: LucideIcon | IconType;
  color: string;
}

const techRegistry: Record<string, TechIconEntry> = {
  react: { icon: SiReact, color: "#61DAFB" },
  nextjs: { icon: SiNextdotjs, color: "#FFFFFF" },
  typescript: { icon: SiTypescript, color: "#3178C6" },
  javascript: { icon: SiJavascript, color: "#F7DF1E" },
  redux: { icon: SiRedux, color: "#764ABC" },
  zustand: { icon: Layers, color: "#F5A623" },
  tailwind: { icon: SiTailwindcss, color: "#38BDF8" },
  mui: { icon: SiMui, color: "#007FFF" },
  html5: { icon: SiHtml5, color: "#E34F26" },
  css3: { icon: SiCss, color: "#2965F1" },
  nodejs: { icon: SiNodedotjs, color: "#5FA04E" },
  express: { icon: SiExpress, color: "#FFFFFF" },
  sequelize: { icon: SiSequelize, color: "#52B0E7" },
  postgresql: { icon: SiPostgresql, color: "#4169E1" },
  mongodb: { icon: SiMongodb, color: "#47A248" },
  jest: { icon: SiJest, color: "#C21325" },
  "testing-library": { icon: SiTestinglibrary, color: "#E33332" },
  github: { icon: SiGit, color: "#F05032" },
  bitbucket: { icon: SiBitbucket, color: "#0052CC" },
  gitlab: { icon: SiGitlab, color: "#FC6D26" },
  jira: { icon: SiJirasoftware, color: "#0052CC" },
  azure: { icon: Cloud, color: "#0078D4" },
  figma: { icon: SiFigma, color: "#F24E1E" },
};

export function getTechIcon(key: string): TechIconEntry {
  return techRegistry[key] ?? { icon: Code2, color: "oklch(0.6 0.02 264)" };
}

export function TechIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const entry = getTechIcon(name);
  const Component = entry.icon;
  return (
    <Component
      className={className}
      style={{ color: entry.color }}
      aria-hidden="true"
    />
  );
}

import {
  Atom,
  Triangle,
  Braces,
  FileCode2,
  Boxes,
  Layers,
  Wind,
  Palette,
  Server,
  Route,
  Database,
  Leaf,
  FlaskConical,
  TestTube2,
  GitBranch,
  GitMerge,
  Kanban,
  Cloud,
  PenTool,
  Code2,
  type LucideIcon,
} from "lucide-react";

interface TechIconEntry {
  icon: LucideIcon;
  color: string;
}

const techRegistry: Record<string, TechIconEntry> = {
  react: { icon: Atom, color: "oklch(0.75 0.15 220)" },
  nextjs: { icon: Triangle, color: "oklch(0.92 0 0)" },
  typescript: { icon: Braces, color: "oklch(0.65 0.16 250)" },
  javascript: { icon: FileCode2, color: "oklch(0.85 0.16 95)" },
  redux: { icon: Boxes, color: "oklch(0.6 0.2 300)" },
  zustand: { icon: Layers, color: "oklch(0.6 0.02 60)" },
  tailwind: { icon: Wind, color: "oklch(0.75 0.13 220)" },
  mui: { icon: Palette, color: "oklch(0.65 0.18 240)" },
  html5: { icon: Code2, color: "oklch(0.65 0.2 40)" },
  css3: { icon: Code2, color: "oklch(0.6 0.2 260)" },
  nodejs: { icon: Server, color: "oklch(0.65 0.16 145)" },
  express: { icon: Route, color: "oklch(0.8 0 0)" },
  sequelize: { icon: Database, color: "oklch(0.6 0.14 250)" },
  postgresql: { icon: Database, color: "oklch(0.55 0.1 250)" },
  mongodb: { icon: Leaf, color: "oklch(0.65 0.17 145)" },
  jest: { icon: TestTube2, color: "oklch(0.6 0.18 20)" },
  "testing-library": { icon: FlaskConical, color: "oklch(0.65 0.15 340)" },
  github: { icon: Code2, color: "oklch(0.9 0 0)" },
  bitbucket: { icon: GitBranch, color: "oklch(0.6 0.15 250)" },
  gitlab: { icon: GitMerge, color: "oklch(0.6 0.18 40)" },
  jira: { icon: Kanban, color: "oklch(0.6 0.15 235)" },
  azure: { icon: Cloud, color: "oklch(0.6 0.13 235)" },
  figma: { icon: PenTool, color: "oklch(0.6 0.2 20)" },
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

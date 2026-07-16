"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronDown, MapPin } from "lucide-react";
import { MonogramAvatar } from "@/components/animations/gradient-mesh-art";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types";

export function ExperienceCard({
  experience,
  defaultExpanded = false,
}: {
  experience: Experience;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="glass relative rounded-xl p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <MonogramAvatar
            seed={experience.company}
            initials={experience.companyInitials}
            className="size-12 shrink-0 rounded-xl text-sm"
          />
          <div>
            <h3 className="font-display text-xl font-semibold">
              {experience.role}
            </h3>
            <p className="text-primary">{experience.company}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {experience.duration}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {experience.location}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex items-center gap-1 self-start rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Show details"}
          <ChevronDown
            className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
          />
        </button>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{experience.summary}</p>

      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Key achievements
            </h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {experience.achievements.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Responsibilities
            </h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {experience.responsibilities.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-secondary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {experience.technologies.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

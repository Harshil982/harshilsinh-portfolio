import { Icon } from "@/components/icons/icon-registry";
import { TechIcon } from "@/components/icons/tech-icon";
import type { SkillCategory } from "@/types";

/**
 * A category of tools, listed rather than rated.
 *
 * This used to render a labelled progress bar and a year count per skill. Both
 * are gone on purpose:
 *
 * - A self-assigned percentage is unverifiable and unfalsifiable. "Redux 85%"
 *   tells a reader nothing they can act on, and twenty-six gradient meters
 *   stacked up read as decoration rather than information.
 * - A per-technology year count gives a screener the smallest number on the
 *   page to filter on. The years that matter are already stated once, as total
 *   experience — repeating them per tool can only cost.
 *
 * What is left is the honest claim: these are the tools the work is built
 * with. Depth is evidenced by the projects and case studies, not asserted by a
 * bar chart.
 */
export function SkillCategoryCard({ category }: { category: SkillCategory }) {
  return (
    <div className="glass flex flex-col gap-5 rounded-xl p-6">
      <div className="flex items-center gap-3">
        <span className="glass flex size-10 items-center justify-center rounded-lg text-primary">
          <Icon name={category.icon} className="size-5" />
        </span>
        <h3 className="font-display text-lg font-semibold">{category.label}</h3>
      </div>

      <ul className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <li key={skill.name}>
            <span className="flex items-center gap-2 rounded-full border border-border bg-foreground/[0.03] px-3 py-1.5 text-sm text-foreground/90 transition-colors duration-200 hover:border-primary/40 hover:bg-foreground/[0.06]">
              <TechIcon name={skill.icon} className="size-4 shrink-0" />
              {skill.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { Reveal } from "@/components/animations/reveal";
import { slideInLeft, slideInRight } from "@/lib/animations";
import { Icon } from "@/components/icons/icon-registry";
import { cn } from "@/lib/utils";
import type { TimelineItem } from "@/types";

export function TimelineEntry({
  item,
  index,
}: {
  item: TimelineItem;
  index: number;
}) {
  const isLeft = index % 2 === 0;

  return (
    <div className="relative flex md:justify-normal">
      <Reveal
        variants={isLeft ? slideInLeft : slideInRight}
        className={cn(
          "w-full pl-14 md:w-[calc(50%-2.5rem)] md:pl-0",
          !isLeft && "md:ml-auto"
        )}
      >
        <div className="glass rounded-xl p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {item.date}
          </span>
          <h3 className="mt-1 font-display text-base font-semibold">
            {item.title}
          </h3>
          <p className="text-xs text-muted-foreground">{item.subtitle}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>
      </Reveal>
      <span className="glass absolute left-0 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-primary md:left-1/2 md:-translate-x-1/2">
        <Icon name={item.icon} className="size-4" />
      </span>
    </div>
  );
}

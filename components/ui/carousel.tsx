"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CarouselProps {
  /** Slides, each pre-sized by the consumer (e.g. `flex-[0_0_100%] sm:flex-[0_0_50%]`). */
  children: ReactNode;
  /** Applied to the flex track — use for the negative-margin/gap trick between slides. */
  trackClassName?: string;
  className?: string;
  /** Loop back to the start/end instead of stopping at the edges. */
  loop?: boolean;
  /** Auto-advance slides after `autoScrollInterval` ms. */
  autoScroll?: boolean;
  autoScrollInterval?: number;
  /** Used in the prev/next button aria-labels, e.g. "projects" -> "Previous projects". */
  label: string;
}

export function Carousel({
  children,
  trackClassName,
  className,
  loop = false,
  autoScroll = false,
  autoScrollInterval = 4000,
  label,
}: CarouselProps) {
  const plugins = useMemo(
    () =>
      autoScroll
        ? [Autoplay({ delay: autoScrollInterval, stopOnInteraction: true })]
        : [],
    [autoScroll, autoScrollInterval]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", slidesToScroll: 1, containScroll: "trimSnaps", loop },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onUpdate = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setShowControls(emblaApi.scrollSnapList().length > 1);
    };
    emblaApi.on("select", onUpdate);
    emblaApi.on("reInit", onUpdate);
    onUpdate();
    return () => {
      emblaApi.off("select", onUpdate);
      emblaApi.off("reInit", onUpdate);
    };
  }, [emblaApi]);

  return (
    <div className={cn("flex items-center gap-2 sm:gap-4", className)}>
      {showControls && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          disabled={!loop && !canScrollPrev}
          aria-label={`Previous ${label}`}
          className="shrink-0"
        >
          <ChevronLeft className="size-4" />
        </Button>
      )}

      <div className="min-w-0 flex-1 overflow-hidden" ref={emblaRef}>
        <div className={cn("flex", trackClassName)}>{children}</div>
      </div>

      {showControls && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          disabled={!loop && !canScrollNext}
          aria-label={`Next ${label}`}
          className="shrink-0"
        >
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );
}

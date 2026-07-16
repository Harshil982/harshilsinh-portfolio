import { Star } from "lucide-react";
import { MonogramAvatar } from "@/components/animations/gradient-mesh-art";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div className="glass flex h-full flex-col gap-5 rounded-xl p-6 sm:p-8">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              "size-4",
              index < testimonial.rating
                ? "fill-primary text-primary"
                : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      <p className="flex-1 text-sm leading-relaxed text-foreground/90">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <MonogramAvatar
          seed={testimonial.avatarSeed}
          initials={initials}
          className="size-10 rounded-full text-xs"
        />
        <div>
          <p className="text-sm font-semibold">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

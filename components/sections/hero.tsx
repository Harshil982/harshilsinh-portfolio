"use client";

import type { MouseEvent } from "react";
import { ArrowRight, Download, Code2, Briefcase, Mail } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { personal, socials } from "@/lib/data";
import { RotatingRoles } from "@/components/animations/rotating-roles";
import { FloatingParticles } from "@/components/animations/floating-particles";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { MonogramAvatar } from "@/components/animations/gradient-mesh-art";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { SHOW_PERSONAL_AVATAR } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Hero() {
  const github = socials.find((item) => item.id === "github");
  const linkedin = socials.find((item) => item.id === "linkedin");
  const email = socials.find((item) => item.id === "email");

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 150, damping: 20 });
  const springY = useSpring(my, { stiffness: 150, damping: 20 });

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set(((event.clientX - rect.left) / rect.width - 0.5) * 24);
    my.set(((event.clientY - rect.top) / rect.height - 0.5) * 24);
  }

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-28"
    >
      <div
        aria-hidden
        className="bg-gradient-mesh absolute inset-0 -z-10 opacity-60"
      />
      <div
        aria-hidden
        className="animate-blob pointer-events-none absolute -top-32 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
      />
      <FloatingParticles
        className="pointer-events-none absolute inset-0 -z-10"
        count={30}
      />

      <div
        className={cn(
          "mx-auto grid w-full grid-cols-1 items-center gap-16 px-6 lg:px-8",
          SHOW_PERSONAL_AVATAR ? "max-w-7xl lg:grid-cols-[1.1fr_0.9fr]" : "max-w-3xl"
        )}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.12)}
          className="flex flex-col items-start gap-6"
        >
          <motion.span
            variants={fadeInUp}
            className="glass rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary"
          >
            {personal.availableForWork
              ? "Available for new opportunities"
              : personal.title}
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Hello, I&apos;m{" "}
            <span className="text-gradient">{personal.firstName}</span>
            <br />
            <RotatingRoles roles={personal.roles} className="mt-2 h-[1.2em]" />
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="max-w-xl text-lg text-muted-foreground"
          >
            {personal.bio}
          </motion.p>

          <motion.p variants={fadeInUp} className="font-mono text-sm text-accent">
            {personal.tagline}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <MagneticButton>
              <Button asChild size="lg">
                <a href={personal.resumeUrl} download>
                  <Download className="size-4" /> Download Resume
                </a>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button asChild size="lg" variant="outline">
                <a href="#projects">
                  View Projects <ArrowRight className="size-4" />
                </a>
              </Button>
            </MagneticButton>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center gap-3 pt-2">
            {github && (
              <a
                href={github.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="glass flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary"
              >
                <Code2 className="size-4" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="glass flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary"
              >
                <Briefcase className="size-4" />
              </a>
            )}
            {email && (
              <a
                href={email.url}
                aria-label="Email"
                className="glass flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="size-4" />
              </a>
            )}
          </motion.div>
        </motion.div>

        {SHOW_PERSONAL_AVATAR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ x: springX, y: springY }}
            className="relative mx-auto aspect-square w-full max-w-md"
          >
            <div className="animate-float absolute inset-0 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
            <MonogramAvatar
              seed={personal.avatarSeed}
              initials={personal.initials}
              className="relative size-full rounded-full border border-border text-7xl shadow-2xl"
            />
            <FloatingCodeSnippet
              className="absolute -left-6 top-10 hidden lg:block"
              label="const dev = 'Harshilsinh';"
            />
            <FloatingCodeSnippet
              className="absolute -right-4 bottom-16 hidden lg:block"
              label="<Portfolio stack='Next.js' />"
              delay={1.2}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}

function FloatingCodeSnippet({
  label,
  className,
  delay = 0,
}: {
  label: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
      className={cn(
        "glass rounded-lg px-4 py-2 font-mono text-xs text-accent shadow-lg",
        className
      )}
    >
      {label}
    </motion.div>
  );
}

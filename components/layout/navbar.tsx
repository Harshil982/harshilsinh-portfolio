"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { Menu } from "lucide-react";
import { navigation, personal } from "@/lib/data";
import { useUIStore } from "@/lib/store";
import { useActiveSection } from "@/hooks/use-active-section";
import { NavLink } from "@/components/layout/nav-link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const sectionIds = navigation.navItems
  .filter((item) => item.href.startsWith("#"))
  .map((item) => item.id);

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useUIStore((state) => state.activeSection);
  const mobileMenuOpen = useUIStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useUIStore((state) => state.setMobileMenuOpen);

  useActiveSection(sectionIds);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 16);
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "glass" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="/"
          className="rounded-md font-display text-lg font-bold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="text-gradient">{personal.initials}</span>
          <span className="sr-only">{personal.name}</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navigation.navItems.map((item) => (
            <li key={item.id}>
              <NavLink
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                  activeSection === item.id && "bg-foreground/5 text-foreground"
                )}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button asChild size="sm">
            <a href={navigation.ctaHref} download>
              {navigation.ctaLabel}
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>{personal.name}</SheetTitle>
              <ul className="flex flex-1 flex-col gap-1">
                {navigation.navItems.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      href={item.href}
                      onNavigate={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-base font-medium text-muted-foreground outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                        activeSection === item.id &&
                          "bg-foreground/5 text-foreground"
                      )}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full">
                <a href={navigation.ctaHref} download>
                  {navigation.ctaLabel}
                </a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

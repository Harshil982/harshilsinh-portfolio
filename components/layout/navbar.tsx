"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { Menu } from "lucide-react";
import { navigation, personal } from "@/lib/data";
import { useUIStore } from "@/lib/store";
import { useActiveSection } from "@/hooks/use-active-section";
import { NavLink } from "@/components/layout/nav-link";
import { NavDropdown } from "@/components/layout/nav-dropdown";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * Every in-page destination, flattened out of the groups.
 *
 * The scroll-spy needs the leaf section ids, not the group labels — a group is
 * a container in the header, never a place on the page.
 */
const sectionIds = [
  ...navigation.navGroups.flatMap((group) => group.items),
  ...navigation.navLinks,
]
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
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
      >
        <Link
          href="/"
          className="rounded-md font-display text-lg font-bold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="text-gradient">{personal.initials}</span>
          <span className="sr-only">{personal.name}</span>
        </Link>

        {/* Eleven flat links became two grouped menus plus two direct links. */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navigation.navGroups.map((group) => (
            <li key={group.id}>
              <NavDropdown group={group} activeSection={activeSection} />
            </li>
          ))}

          {navigation.navLinks.map((item) => (
            <li key={item.id}>
              <NavLink
                href={item.href}
                className={cn(
                  "block rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
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
            <SheetContent className="overflow-y-auto">
              <SheetTitle>{personal.name}</SheetTitle>

              {/* Same grouping on mobile, but expanded rather than collapsed —
                  a dropdown inside a drawer is a menu inside a menu. The
                  headings give the list structure without hiding anything. */}
              <div className="flex flex-1 flex-col gap-6">
                {navigation.navGroups.map((group) => (
                  <div key={group.id}>
                    <p className="px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {group.label}
                    </p>
                    <ul className="mt-1 flex flex-col gap-0.5">
                      {group.items.map((item) => (
                        <li key={item.id}>
                          <NavLink
                            href={item.href}
                            onNavigate={() => setMobileMenuOpen(false)}
                            className={cn(
                              "block rounded-lg px-4 py-2.5 text-base font-medium text-muted-foreground outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                              activeSection === item.id &&
                                "bg-foreground/5 text-foreground"
                            )}
                          >
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <ul className="flex flex-col gap-0.5">
                  {navigation.navLinks.map((item) => (
                    <li key={item.id}>
                      <NavLink
                        href={item.href}
                        onNavigate={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block rounded-lg px-4 py-2.5 text-base font-medium text-muted-foreground outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                          activeSection === item.id &&
                            "bg-foreground/5 text-foreground"
                        )}
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>

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

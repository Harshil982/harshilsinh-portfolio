"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { NavLink } from "@/components/layout/nav-link";
import { useReducedMotion } from "@/hooks/use-media-query";
import type { NavGroup } from "@/types";
import { cn } from "@/lib/utils";

interface NavDropdownProps {
  group: NavGroup;
  activeSection: string;
}

/**
 * A grouped section menu for the header.
 *
 * Built as a *disclosure* (button with `aria-expanded` revealing a list of
 * links) rather than with `role="menu"`. The ARIA menu pattern models a set of
 * commands — it hijacks the arrow keys, removes the links from the tab order,
 * and tells a screen reader "menu item" for things that are plainly links.
 * Navigation should stay navigation, so these remain real anchors in the
 * normal tab order and every browser affordance keeps working: middle-click,
 * open-in-new-tab, "copy link address".
 *
 * Arrow keys are still wired up as a convenience on top of that, not as a
 * replacement for tabbing.
 */
export function NavDropdown({ group, activeSection }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /*
   * Why the panel is open, not just whether.
   *
   * Without this, hovering opens the menu and the click that naturally follows
   * toggles it straight back shut — so hover-then-click, which is what most
   * people actually do with a pointer, made the panel flash and vanish. A
   * click can promote a hover-open to a click-open, but it can never close
   * one.
   */
  const openedBy = useRef<"hover" | "click" | null>(null);
  const reducedMotion = useReducedMotion();
  const panelId = useId();

  const groupOwnsActive = group.items.some(
    (item) => item.id === activeSection
  );

  const close = useCallback((returnFocus = false) => {
    openedBy.current = null;
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  function handleTriggerClick() {
    if (!open) {
      openedBy.current = "click";
      setOpen(true);
      return;
    }
    if (openedBy.current === "hover") {
      // Committing to a menu the pointer already opened.
      openedBy.current = "click";
      return;
    }
    close();
  }

  // Pointer intent: open on hover, but close on a short delay so travelling
  // diagonally from the trigger to the panel doesn't dismiss it mid-move.
  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      openedBy.current = null;
      setOpen(false);
    }, 140);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  // Dismiss on outside interaction and on Escape.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        openedBy.current = null;
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        close(true);
      }
    }
    // Any focus landing outside the group closes it — this is what makes
    // tabbing straight through the panel behave sanely.
    function onFocusIn(event: FocusEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        openedBy.current = null;
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open, close]);

  function focusItem(index: number) {
    const links = panelRef.current?.querySelectorAll<HTMLAnchorElement>("a");
    if (!links?.length) return;
    const next = (index + links.length) % links.length;
    links[next]?.focus();
  }

  function onTriggerKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openedBy.current = "click";
      setOpen(true);
      // Wait for the panel to mount before reaching into it.
      requestAnimationFrame(() => focusItem(0));
    }
  }

  function onPanelKeyDown(event: React.KeyboardEvent) {
    const links = Array.from(
      panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []
    );
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (current === -1) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem(current + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem(current - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItem(links.length - 1);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        if (!open) openedBy.current = "hover";
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleTriggerClick}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
          groupOwnsActive || open
            ? "bg-foreground/5 text-foreground"
            : "text-muted-foreground"
        )}
      >
        {group.label}
        <ChevronDown
          aria-hidden
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            ref={panelRef}
            onKeyDown={onPanelKeyDown}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            // Not `.glass`: at 45% opacity the hero headline reads straight
            // through a floating panel. `--popover` exists in the palette for
            // exactly this — an opaque surface that sits above content — and
            // the blur behind it keeps the glassy feel without costing
            // legibility.
            className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover/95 p-1.5 shadow-2xl backdrop-blur-xl"
          >
            <ul className="flex flex-col">
              {group.items.map((item) => (
                <li key={item.id}>
                  <NavLink
                    href={item.href}
                    onNavigate={() => close()}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring",
                      activeSection === item.id && "bg-foreground/5"
                    )}
                  >
                    <span
                      className={cn(
                        "block text-sm font-medium",
                        activeSection === item.id
                          ? "text-primary"
                          : "text-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

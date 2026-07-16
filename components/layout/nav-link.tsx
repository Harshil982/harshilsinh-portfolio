"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { useLenis } from "@/hooks/use-lenis";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}

export function NavLink({ href, children, className, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const isHash = href.startsWith("#");

  if (isHash && pathname === "/") {
    return (
      <a
        href={href}
        className={className}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
          const target = document.getElementById(href.slice(1));
          if (target) {
            if (lenis.current) {
              lenis.current.scrollTo(target, { offset: -88 });
            } else {
              target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
          onNavigate?.();
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={isHash ? `/${href}` : href} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
}

import Link from "next/link";
import { footer, socials, personal } from "@/lib/data";
import { Icon } from "@/components/icons/icon-registry";

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="absolute inset-x-0 top-0 h-px animate-gradient-shift bg-gradient-brand bg-[length:200%_100%]" />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <span className="text-gradient font-display text-xl font-bold">
              {personal.name}
            </span>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {footer.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="glass flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary"
                >
                  <Icon name={social.icon} className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/80">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {footer.copyrightName}. All
            rights reserved.
          </p>
          <div className="flex gap-6">
            {footer.bottomLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                download
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

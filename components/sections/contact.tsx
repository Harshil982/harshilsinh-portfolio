import { Clock, Mail, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/animations/reveal";
import { ContactForm } from "@/components/sections/contact-form";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icons/icon-registry";
import { contact, socials } from "@/lib/data";

export function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something together"
          description="Open to full-time roles and remote opportunities — reach out and I'll usually reply within a day."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="flex flex-col gap-6">
            <div className="glass flex flex-col gap-4 rounded-2xl p-6">
              <div className="flex flex-wrap gap-2">
                {contact.availability.openToWork && <Badge>Open to work</Badge>}
                {contact.availability.openToRemote && (
                  <Badge variant="secondary">Open to remote</Badge>
                )}
                {contact.availability.openToRelocation && (
                  <Badge variant="accent">Open to relocation</Badge>
                )}
              </div>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Mail className="size-4 text-primary" /> {contact.email}
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="size-4 text-primary" /> {contact.location}
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="size-4 text-primary" /> {contact.responseTime}
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="glass flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary"
                >
                  <Icon name={social.icon} className="size-4" />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

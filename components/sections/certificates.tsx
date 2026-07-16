import { SectionHeading } from "@/components/layout/section-heading";
import { RevealGroup, RevealItem } from "@/components/animations/reveal";
import { CertificateCard } from "@/components/cards/certificate-card";
import { certificates } from "@/lib/data";

export function Certificates() {
  return (
    <section id="certificates" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Certificates"
          title="Continuous learning, on record"
          description="Credentials I've picked up alongside day-to-day project work."
        />

        <RevealGroup
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {certificates.map((certificate) => (
            <RevealItem key={certificate.id}>
              <CertificateCard certificate={certificate} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

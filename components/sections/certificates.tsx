import { SectionHeading } from "@/components/layout/section-heading";
import { CertificateCard } from "@/components/cards/certificate-card";
import { Carousel } from "@/components/ui/carousel";
import { certificates } from "@/lib/data";

export function Certificates() {
  return (
    <section id="certificates" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Certificates"
          title="Continuous learning, on record"
          description="Anthropic credentials I've completed on Claude Code, and how each one shows up in my day-to-day work."
        />

        <div className="mt-16">
          <Carousel label="certificates" trackClassName="-ml-6" autoScroll>
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="min-w-0 flex-[0_0_100%] pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.3333%] xl:flex-[0_0_25%]"
              >
                <CertificateCard certificate={certificate} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}

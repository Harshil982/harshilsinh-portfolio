import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { TiltCard } from "@/components/animations/tilt-card";
import { Icon } from "@/components/icons/icon-registry";
import { Badge } from "@/components/ui/badge";
import type { Certificate } from "@/types";

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <TiltCard maxTilt={4} className="h-full">
      <div className="glass flex h-full flex-col overflow-hidden rounded-2xl">
        <Link
          href={`/certificates/${certificate.slug}`}
          className="relative block h-36 w-full overflow-hidden sm:h-40"
        >
          <Image
            src={certificate.image}
            alt={`${certificate.title} certificate`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 hover:scale-105"
          />
        </Link>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="glass flex size-9 items-center justify-center rounded-lg text-primary">
              <Icon name={certificate.icon} className="size-4" />
            </span>
            <span className="text-xs text-muted-foreground">
              {certificate.issuer} &middot;{" "}
              {new Date(certificate.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold">
              {certificate.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
              {certificate.summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {certificate.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-4 pt-1">
            <Link
              href={`/certificates/${certificate.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-accent"
            >
              View Details <ArrowUpRight className="size-4" />
            </Link>
            {certificate.verifyUrl && (
              <a
                href={certificate.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ShieldCheck className="size-4" /> Verify
              </a>
            )}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

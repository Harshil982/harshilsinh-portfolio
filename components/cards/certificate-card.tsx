import { ExternalLink } from "lucide-react";
import { GlowCard } from "@/components/animations/glow-card";
import { Icon } from "@/components/icons/icon-registry";
import type { Certificate } from "@/types";

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <GlowCard className="glass flex h-full flex-col gap-4 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <span className="glass flex size-11 items-center justify-center rounded-lg text-primary">
          <Icon name={certificate.icon} className="size-5" />
        </span>
        <a
          href={certificate.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${certificate.title} credential`}
          className="text-muted-foreground transition-colors hover:text-primary"
        >
          <ExternalLink className="size-4" />
        </a>
      </div>
      <div>
        <h3 className="font-display text-base font-semibold">
          {certificate.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {certificate.issuer} &middot; {certificate.date}
        </p>
      </div>
    </GlowCard>
  );
}

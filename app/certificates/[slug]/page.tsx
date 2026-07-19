import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Icon } from "@/components/icons/icon-registry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { certificates, getCertificateBySlug } from "@/lib/data";

export function generateStaticParams() {
  return certificates.map((certificate) => ({ slug: certificate.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const certificate = getCertificateBySlug(slug);
  if (!certificate) return buildMetadata({ title: "Certificate not found" });
  return buildMetadata({
    title: certificate.title,
    description: certificate.summary,
    path: `/certificates/${certificate.slug}`,
  });
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const certificate = getCertificateBySlug(slug);
  if (!certificate) notFound();

  const formattedDate = new Date(certificate.date).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  );

  return (
    <article className="pb-24 pt-32 sm:pb-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Link
          href="/#certificates"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to certificates
        </Link>

        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{certificate.issuer}</Badge>
            <span className="text-xs text-muted-foreground">
              Issued {formattedDate}
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {certificate.title}
          </h1>
          <p className="mt-2 text-lg text-primary">{certificate.summary}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-10 aspect-16/10 w-full overflow-hidden rounded-2xl shadow-xl sm:aspect-21/9">
            <Image
              src={certificate.image}
              alt={`${certificate.title} certificate`}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover object-top"
            />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-10">
            <Reveal>
              <h2 className="font-display text-xl font-semibold">Overview</h2>
              <p className="mt-3 text-muted-foreground">
                {certificate.description}
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-xl font-semibold">
                What I Learned
              </h2>
              <ul className="mt-3 space-y-2">
                {certificate.whatILearned.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-xl font-semibold">
                How I&apos;m Using It in Real Development
              </h2>
              <div className="mt-3 flex flex-col gap-4">
                {certificate.realWorldApplication.map((item) => (
                  <div key={item} className="glass rounded-xl p-5">
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal className="flex flex-col gap-6">
            <div className="glass rounded-xl p-6">
              <span className="glass flex size-11 items-center justify-center rounded-lg text-primary">
                <Icon name={certificate.icon} className="size-5" />
              </span>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    Issuer
                  </dt>
                  <dd className="mt-0.5 text-foreground/90">
                    {certificate.issuer}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    Issued
                  </dt>
                  <dd className="mt-0.5 text-foreground/90">
                    {formattedDate}
                  </dd>
                </div>
                {certificate.certificateNumber && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      Certificate No.
                    </dt>
                    <dd className="mt-0.5 font-mono text-foreground/90">
                      {certificate.certificateNumber}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/70">
                Skills
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {certificate.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {certificate.verifyUrl && (
              <Button asChild>
                <a
                  href={certificate.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ShieldCheck className="size-4" /> Verify Certificate{" "}
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            )}
          </Reveal>
        </div>
      </div>
    </article>
  );
}

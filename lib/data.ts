import personalJson from "@/data/personal.json";
import socialsJson from "@/data/socials.json";
import navigationJson from "@/data/navigation.json";
import experienceJson from "@/data/experience.json";
import educationJson from "@/data/education.json";
import skillsJson from "@/data/skills.json";
import techOrbitJson from "@/data/techOrbit.json";
import projectsJson from "@/data/projects.json";
import landingProjectsJson from "@/data/landingProjects.json";
import openSourceJson from "@/data/openSource.json";
import projectFiltersJson from "@/data/projectFilters.json";
import processJson from "@/data/process.json";
import timelineJson from "@/data/timeline.json";
import certificatesJson from "@/data/certificates.json";
import achievementsJson from "@/data/achievements.json";
import testimonialsJson from "@/data/testimonials.json";
import blogJson from "@/data/blog.json";
import faqJson from "@/data/faq.json";
import statsJson from "@/data/stats.json";
import contactJson from "@/data/contact.json";
import footerJson from "@/data/footer.json";
import seoJson from "@/data/seo.json";

import type {
  Personal,
  SocialLink,
  NavigationData,
  Experience,
  Education,
  SkillsData,
  TechOrbitData,
  Project,
  LandingProject,
  OpenSourceLibrary,
  ProcessStep,
  TimelineItem,
  Certificate,
  Achievement,
  Testimonial,
  BlogPost,
  FaqItem,
  Stat,
  ContactData,
  FooterData,
  SeoData,
} from "@/types";

export const personal = personalJson as Personal;
export const socials = socialsJson as SocialLink[];
export const navigation = navigationJson as NavigationData;
export const experience = experienceJson as Experience[];
export const education = educationJson as Education[];
export const skills = skillsJson as SkillsData;
export const techOrbit = techOrbitJson as TechOrbitData;
export const projects = projectsJson as Project[];
export const landingProjects = landingProjectsJson as LandingProject[];
export const openSourceLibraries = openSourceJson as OpenSourceLibrary[];
export const projectFilters = projectFiltersJson as string[];
export const processSteps = processJson as ProcessStep[];
export const timeline = timelineJson as TimelineItem[];
export const certificates = certificatesJson as Certificate[];
/**
 * Sums the per-project module counts rather than trusting a typed-in total.
 *
 * Project metrics record these as "6+", "8+", "4" and so on, so the sum is a
 * floor: at least this many, never fewer. That is the honest direction, and it
 * updates itself when a project is added.
 */
function countProductModules(): string {
  let total = 0;
  let approximate = false;

  for (const project of projects) {
    for (const metric of project.metrics ?? []) {
      if (!/modules/i.test(metric.label)) continue;
      const parsed = Number.parseInt(metric.value, 10);
      if (Number.isNaN(parsed)) continue;
      total += parsed;
      if (metric.value.includes("+")) approximate = true;
    }
  }

  return approximate ? `${total}+` : String(total);
}

const DERIVED_METRICS: Record<string, () => string> = {
  productModules: countProductModules,
};

/*
 * The previous set led with "-35%" bundle reduction and "95%" sprint
 * reliability. Neither is recorded anywhere, and a precise-looking percentage
 * nobody can check is worse than no number: it invites the reader to discount
 * the figures that *are* real. What is here now is either derived from the
 * project data or publicly verifiable — the test count and the bundle size sit
 * in a public repo and on npm respectively.
 */
export const achievements: Achievement[] = (
  achievementsJson as Achievement[]
).map((achievement) => ({
  ...achievement,
  metric: achievement.derived
    ? (DERIVED_METRICS[achievement.derived]?.() ?? achievement.metric)
    : achievement.metric,
}));
export const testimonials = testimonialsJson as Testimonial[];
export const blogPosts = blogJson as BlogPost[];
export const faqs = faqJson as FaqItem[];
/*
 * Stats are derived, not typed in.
 *
 * The previous set claimed "2 enterprise projects" while projects.json held
 * five, alongside "1,200+ commits" and "900+ cups of coffee" — one number
 * simply wrong, one unverifiable, one a joke. A single decorative metric is
 * enough to make a reader discount the real ones next to it, which is exactly
 * the wrong trade on a page whose job is to be believed.
 *
 * Anything countable now counts the thing it describes, so a stat cannot drift
 * away from the data again: add a sixth project and the tile says six.
 */
const DERIVED: Record<string, () => number> = {
  yearsOfExperience: () => yearsSinceCareerStart(),
  enterpriseProjects: () => projects.length,
  // TreeKit ships one package; universal-api-errors is a monorepo of five.
  npmPackages: () =>
    openSourceLibraries.reduce(
      (total, library) => total + (library.packages?.length ?? 1),
      0
    ),
};

/**
 * Years since the first role began, floored to the half year.
 *
 * Flooring means the figure can only ever understate, which is the safe
 * direction for a number a reader may check against the dates listed a few
 * sections further down.
 */
export function yearsSinceCareerStart(now: Date = new Date()): number {
  const earliest = experience
    .map((role) => role.startDate)
    .sort()[0];
  if (!earliest) return 0;
  const [year, month] = earliest.split("-").map(Number);
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.floor(months / 6) / 2;
}

export const stats: Stat[] = (statsJson as Stat[]).map((stat) => ({
  ...stat,
  value: stat.derived ? (DERIVED[stat.derived]?.() ?? stat.value ?? 0) : (stat.value ?? 0),
}));
export const contact = contactJson as ContactData;
export const footer = footerJson as FooterData;
export const seo = seoJson as SeoData;

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((item) => item.slug === slug);
}

export function getLandingProjectBySlug(slug: string): LandingProject | undefined {
  return landingProjects.find((item) => item.slug === slug);
}

export function getOpenSourceLibraryBySlug(slug: string): OpenSourceLibrary | undefined {
  return openSourceLibraries.find((item) => item.slug === slug);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((item) => item.slug === slug);
}

export function getCertificateBySlug(slug: string): Certificate | undefined {
  return certificates.find((item) => item.slug === slug);
}

export function getShowcaseCategories(): string[] {
  return ["All", ...Array.from(new Set(landingProjects.map((item) => item.category)))];
}

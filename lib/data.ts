import personalJson from "@/data/personal.json";
import socialsJson from "@/data/socials.json";
import navigationJson from "@/data/navigation.json";
import experienceJson from "@/data/experience.json";
import educationJson from "@/data/education.json";
import skillsJson from "@/data/skills.json";
import techOrbitJson from "@/data/techOrbit.json";
import projectsJson from "@/data/projects.json";
import landingProjectsJson from "@/data/landingProjects.json";
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
export const projectFilters = projectFiltersJson as string[];
export const processSteps = processJson as ProcessStep[];
export const timeline = timelineJson as TimelineItem[];
export const certificates = certificatesJson as Certificate[];
export const achievements = achievementsJson as Achievement[];
export const testimonials = testimonialsJson as Testimonial[];
export const blogPosts = blogJson as BlogPost[];
export const faqs = faqJson as FaqItem[];
export const stats = statsJson as Stat[];
export const contact = contactJson as ContactData;
export const footer = footerJson as FooterData;
export const seo = seoJson as SeoData;

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((item) => item.slug === slug);
}

export function getLandingProjectBySlug(slug: string): LandingProject | undefined {
  return landingProjects.find((item) => item.slug === slug);
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

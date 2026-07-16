import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { TechOrbit } from "@/components/sections/tech-orbit";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { FrontendShowcase } from "@/components/sections/frontend-showcase";
import { Process } from "@/components/sections/process";
import { Timeline } from "@/components/sections/timeline";
import { Certificates } from "@/components/sections/certificates";
import { Achievements } from "@/components/sections/achievements";
import { Testimonials } from "@/components/sections/testimonials";
import { BlogPreview } from "@/components/sections/blog-preview";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <TechOrbit />
      <Skills />
      <Experience />
      <Projects />
      <FrontendShowcase />
      <Process />
      <Timeline />
      <Certificates />
      <Achievements />
      <Testimonials />
      <BlogPreview />
      <Faq />
      <Contact />
    </>
  );
}

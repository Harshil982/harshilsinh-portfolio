import {
  personal,
  experience,
  projects,
  landingProjects,
  openSourceLibraries,
  certificates,
  achievements,
  faqs,
  contact,
  skills,
  timeline,
  socials,
} from "@/lib/data";

interface FallbackChunk {
  id: string;
  keywords: string[];
  reply: string;
}

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "do", "does",
  "did", "have", "has", "had", "what", "which", "who", "whom", "how", "why",
  "when", "where", "to", "of", "in", "on", "for", "and", "or", "but", "with",
  "about", "your", "you", "his", "him", "he", "it", "its", "this", "that",
  "can", "could", "would", "should", "will", "i", "me", "my", "please", "tell",
  "me", "orbit", "harshilsinh", "harshil", "rajput",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+.]+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word));
}

function skillNames(categoryId: string): string {
  return (
    skills.categories.find((category) => category.id === categoryId)?.skills.map((s) => s.name).join(", ") ??
    ""
  );
}

function buildChunks(): FallbackChunk[] {
  const chunks: FallbackChunk[] = [];

  chunks.push({
    id: "greeting",
    keywords: ["hi", "hello", "hey", "yo", "sup", "greetings"],
    reply: `Hey there! Still happy to talk about ${personal.name} — his projects, skills, or how to reach him. What are you curious about?`,
  });

  chunks.push({
    id: "intro",
    keywords: ["who", "yourself", "bio", "background", "himself", "introduce"],
    reply: `${personal.name} is a ${personal.title} with ${personal.yearsOfExperience}+ years shipping enterprise React and Next.js applications. ${personal.bio}`,
  });

  chunks.push({
    id: "skills",
    keywords: ["skill", "skills", "tech", "stack", "technology", "technologies", "language", "framework", "frameworks", "tools"],
    reply: `His core stack is ${skillNames("frontend")}. On the backend he works with ${skillNames("backend")} and databases like ${skillNames("database")}, with testing via ${skillNames("testing")}.`,
  });

  const previousJob = experience.find((job) => job.company !== personal.currentCompany);
  chunks.push({
    id: "experience",
    keywords: ["experience", "job", "company", "companies", "career", "currently", "current", "role", "employer"],
    reply: `He's currently a ${personal.currentRole} at ${personal.currentCompany}. ${
      previousJob ? `Before that he spent ${previousJob.duration} at ${previousJob.company}, ${previousJob.summary.charAt(0).toLowerCase()}${previousJob.summary.slice(1)}` : ""
    }`,
  });

  chunks.push({
    id: "enterprise-projects",
    keywords: ["project", "projects", "built", "shipped", "worked", "enterprise", "client", "clients"],
    reply: `On the enterprise side he's shipped ${projects.map((p) => p.title).join(", ")}. Live demos of those aren't public since they're client work, but he can talk through the engineering in detail.`,
  });

  chunks.push({
    id: "showcase",
    keywords: ["showcase", "demo", "demos", "live", "site", "sites", "freelance", "personal"],
    reply: `For real, publicly viewable work, check the Frontend Showcase — ${landingProjects.map((p) => `${p.title} (${p.demo})`).join(", ")}.`,
  });

  for (const library of openSourceLibraries) {
    chunks.push({
      id: `open-source-${library.id}`,
      keywords: [
        "library", "libraries", "npm", "package", "packages", "opensource",
        "open", "source", "publish", "published", "maintainer", "maintains",
        ...tokenize(library.id),
        ...tokenize(library.name),
      ],
      reply: `He builds and publishes open-source npm packages independently — ${library.name} (${library.npmPackage}) is ${library.tagline.toLowerCase()}. ${library.overview} It's MIT licensed${library.bundleSize ? `, ${library.bundleSize}` : ""}, with full docs at ${library.docsUrl}, source on GitHub at ${library.githubUrl}, and published on npm at ${library.npmUrl}.`,
    });
  }

  const afterwords = projects.find((p) => p.slug === "afterwords");
  if (afterwords) {
    chunks.push({
      id: "afterwords",
      keywords: ["afterwords", "video", "upload", "1.8gb", "s3", "multipart", "chunk", "chunked"],
      reply: `On Afterwords, he reworked a video upload pipeline using S3 multipart upload with a Web Worker chunking pool — a 1.8GB recording went from 12-15 minutes down to 90-100 seconds.`,
    });
  }

  const smartCity = projects.find((p) => p.slug === "smart-city-iot-platform");
  if (smartCity) {
    chunks.push({
      id: "smart-city",
      keywords: ["smart", "city", "iot", "migration", "legacy", "hooks", "classcomponents", "class"],
      reply: `On Smart City, he modernized a legacy IoT platform for infrastructure operators — migrating class components to hooks module by module, upgrading to current Node.js LTS, and building out the rule engine and analytics modules.`,
    });
  }

  chunks.push({
    id: "certificates",
    keywords: ["certificate", "certificates", "certification", "certifications", "claude", "anthropic", "course"],
    reply: `He holds ${certificates.map((c) => `"${c.title}" from ${c.issuer}`).join(" and ")}. Check the Certificates section for details on what each one covers.`,
  });

  chunks.push({
    id: "timeline",
    keywords: ["timeline", "journey", "history", "graduated", "education", "degree", "college", "university", "started"],
    reply: `${timeline[0]?.description ?? ""} From there it's been a steady run through Tatvasoft and now ${personal.currentCompany} — the Timeline section has the full path.`,
  });

  const featureAchievement = achievements.find((a) => a.id === "features-shipped");
  const bundleAchievement = achievements.find((a) => a.id === "bundle-optimization");
  const sprintAchievement = achievements.find((a) => a.id === "sprint-reliability");
  chunks.push({
    id: "pitch",
    keywords: [
      "hire", "hiring", "recruiter", "recruiting", "candidate", "why",
      "worth", "convince", "sell", "stand", "standout", "strength",
      "strengths", "qualify", "qualified", "qualification", "qualifications",
      "fit", "pitch", "elevator",
    ],
    reply: `He's a ${personal.title.toLowerCase()} with ${personal.yearsOfExperience}+ years shipping production React/Next.js apps end-to-end — architecture, state management, performance, and testing, not just UI. A few concrete reasons: ${featureAchievement?.metric} features shipped end-to-end across two enterprise platforms, a ${bundleAchievement?.metric} bundle-size cut through code-splitting, and a video upload pipeline reworked from 12-15 minutes down to under two on a 1.8GB file. He's also reliable in Agile delivery (${sprintAchievement?.metric} sprint reliability) and picks up unfamiliar codebases fast.`,
  });

  chunks.push({
    id: "availability",
    keywords: ["available", "availability", "hire", "hiring", "remote", "relocate", "relocation", "opportunity", "opportunities"],
    reply: `Yes — he's ${contact.availability.openToWork ? "open to new opportunities" : "not actively looking"} right now, open to remote work, and open to relocating for the right role.`,
  });

  chunks.push({
    id: "contact",
    keywords: ["contact", "email", "reach", "phone", "linkedin", "github", "connect", "message"],
    reply: `Best way to reach him is email: ${contact.email}. He typically responds within ${contact.responseTime.toLowerCase()}. You can also find him at ${socials.map((s) => s.label).join(", ")} — all linked in the footer.`,
  });

  for (const faq of faqs) {
    chunks.push({
      id: `faq-${faq.id}`,
      keywords: tokenize(faq.question),
      reply: faq.answer,
    });
  }

  return chunks;
}

let cachedChunks: FallbackChunk[] | null = null;
function getChunks(): FallbackChunk[] {
  if (!cachedChunks) cachedChunks = buildChunks();
  return cachedChunks;
}

const GENERIC_MISS = `I'm running on backup power right now and don't have a canned answer for that one — try rephrasing, or reach out directly via the Contact section and ${personal.firstName} will get back to you.`;

export function getLocalFallbackReply(message: string): string {
  const messageTokens = new Set(tokenize(message));
  if (messageTokens.size === 0) return GENERIC_MISS;

  let bestChunk: FallbackChunk | null = null;
  let bestScore = 0;

  for (const chunk of getChunks()) {
    let score = 0;
    for (const keyword of chunk.keywords) {
      if (messageTokens.has(keyword)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestChunk = chunk;
    }
  }

  if (!bestChunk || bestScore === 0) return GENERIC_MISS;

  return `Running on backup power right now, so here's the short answer from my archives: ${bestChunk.reply}`;
}

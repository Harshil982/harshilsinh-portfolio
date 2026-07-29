import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SmoothScrollProvider } from "@/components/layout/smooth-scroll-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgressBar } from "@/components/layout/scroll-progress-bar";
import { BackToTop } from "@/components/layout/back-to-top";
import { CursorFollower } from "@/components/animations/cursor-follower";
import { NoiseOverlay } from "@/components/animations/noise-overlay";
import { ServiceWorkerRegister } from "@/components/layout/service-worker-register";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { buildMetadata } from "@/lib/metadata";
import { personal, seo, socials } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...buildMetadata(),
  metadataBase: new URL(seo.siteUrl),
  authors: [{ name: personal.name }],
  creator: personal.name,
  publisher: personal.name,
  keywords: seo.keywords,
  appleWebApp: {
    capable: true,
    title: personal.firstName,
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfe" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b10" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personal.name,
    jobTitle: personal.title,
    url: seo.siteUrl,
    email: `mailto:${personal.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: personal.location,
    },
    sameAs: socials
      .filter((social) => social.url.startsWith("http"))
      .map((social) => social.url),
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SmoothScrollProvider>
            <TooltipProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
              >
                Skip to content
              </a>
              <NoiseOverlay />
              <CursorFollower />
              <ScrollProgressBar />
              <Navbar />
              <main id="main-content">{children}</main>
              <Footer />
              <BackToTop />
              <Toaster position="bottom-right" />
            </TooltipProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

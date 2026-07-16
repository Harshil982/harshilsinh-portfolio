export interface Personal {
  name: string;
  firstName: string;
  lastName: string;
  initials: string;
  title: string;
  roles: string[];
  tagline: string;
  bio: string;
  summary: string;
  philosophy: string[];
  location: string;
  email: string;
  phone: string;
  resumeUrl: string;
  availableForWork: boolean;
  yearsOfExperience: number;
  currentCompany: string;
  currentRole: string;
  avatarSeed: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface NavigationData {
  navItems: NavItem[];
  ctaLabel: string;
  ctaHref: string;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export interface ContactAvailability {
  openToWork: boolean;
  openToRemote: boolean;
  openToRelocation: boolean;
}

export interface ContactData {
  availability: ContactAvailability;
  currentCompany: string;
  currentRole: string;
  location: string;
  email: string;
  phone: string;
  preferredContact: string;
  responseTime: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterData {
  tagline: string;
  columns: FooterColumn[];
  copyrightName: string;
  bottomLinks: { label: string; href: string }[];
}

export interface SeoData {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  twitterHandle: string;
  locale: string;
}

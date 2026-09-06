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
  /** Shown under the label inside a dropdown; omitted for top-level links. */
  description?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export interface NavigationData {
  /** Collapsed into dropdowns in the header. */
  navGroups: NavGroup[];
  /** Rendered as top-level links beside the dropdowns. */
  navLinks: NavItem[];
  ctaLabel: string;
  ctaHref: string;
}

export interface Stat {
  id: string;
  label: string;
  /** Literal value; omitted when `derived` supplies it from real data. */
  value?: number;
  /** Key of a deriver in lib/data.ts that counts the underlying records. */
  derived?: string;
  suffix: string;
  /** Decimal places for the counter. Defaults to 0. */
  decimals?: number;
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

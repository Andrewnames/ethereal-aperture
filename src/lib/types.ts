export type Photo = {
  id: string;
  gallery: "student" | "mine" | "portrait";
  caption: string;
  alt: string;
  indexLabel: string;
  src: string | null;
  hasFile: boolean;
  sortOrder: number;
};

export type ClassStatus =
  | "registration-open"
  | "waitlist"
  | "coming-soon"
  | "full"
  | "completed";

export type UpcomingClass = {
  id: string;
  title: string;
  description: string;
  status: ClassStatus;
  ctaLabel: string;
  ctaHref: string;
  dates?: string;
  time?: string;
  where?: string;
  level?: string;
  bring?: string;
  cost?: string;
  sortOrder: number;
};

export type PastClass = {
  id: string;
  term: string;
  title: string;
  note: string;
  photosHref: string;
  sortOrder: number;
};

export type NewsItem = {
  id: string;
  year: string;
  headline: string;
  description: string;
  flag?: string;
  linkLabel?: string;
  linkHref?: string;
  sortOrder: number;
};

export type SiteSettings = {
  title: string;
  description: string;
  wordmark: string;
  searchable: boolean;
  email: string;
  links: {
    instagramEa: string;
    instagramCara: string;
    halideUrl: string;
    halideLabel: string;
  };
  about: {
    pull: string;
    paragraphs: string[];
    portraitCaption: string;
    portraitAlt: string;
    draft: boolean;
  };
  artistStatement: {
    pull: string;
    note: string;
    rotation: string;
  };
};

export type ContactStatus = "new" | "replied" | "archived";

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  source: string;
  status: ContactStatus;
  notes: string;
  createdAt: string;
};

export type SiteContent = {
  site: SiteSettings;
  studentWork: Photo[];
  myWork: Photo[];
  portrait: Photo | null;
  news: NewsItem[];
  upcoming: UpcomingClass[];
  past: PastClass[];
};

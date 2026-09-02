export type Photo = {
  id: string;
  caption: string;
  alt: string;
  src: string | null;
  indexLabel: string;
};

export type ClassStatus =
  | "registration-open"
  | "waitlist"
  | "coming-soon"
  | "full"
  | "completed";

export type UpcomingClass = {
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
};

export type PastClass = {
  term: string;
  title: string;
  note: string;
  photosHref: string;
};

export type NewsItem = {
  year: string;
  headline: string;
  description: string;
  flag?: string;
  linkLabel?: string;
  linkHref?: string;
};

export type Site = {
  title: string;
  description: string;
  wordmark: string;
  searchable: boolean;
  email: string;
  about: {
    pull: string;
    paragraphs: string[];
    portraitCaption: string;
    portraitSrc: string | null;
    portraitAlt: string;
    draft: boolean;
  };
  artistStatement: {
    pull: string;
    note: string;
    rotation: string;
  };
};

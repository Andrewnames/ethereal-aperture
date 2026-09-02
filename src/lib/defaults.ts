import type { SiteSettings } from "./types";
import siteJson from "../data/site.json";

export const defaultSite = (): SiteSettings => ({
  title: siteJson.title,
  description: siteJson.description,
  wordmark: siteJson.wordmark,
  searchable: siteJson.searchable,
  email: siteJson.email,
  links: {
    instagramEa: "https://instagram.com/etherealaperturephoto",
    instagramCara: "https://instagram.com/caramiaphoto",
    halideUrl: "https://www.thehalideproject.org/9/16/26-dreamworld",
    halideLabel: "THE HALIDE PROJECT ↗",
  },
  about: {
    pull: siteJson.about.pull,
    paragraphs: siteJson.about.paragraphs,
    portraitCaption: siteJson.about.portraitCaption,
    portraitAlt: siteJson.about.portraitAlt,
    draft: siteJson.about.draft,
  },
  artistStatement: siteJson.artistStatement,
});

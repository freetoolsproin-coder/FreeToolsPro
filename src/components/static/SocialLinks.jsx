// Footer social icons. Profiles come from SITE.social; an empty URL hides that icon.
// LinkedIn, Instagram, Facebook and Dribbble are lucide-react icons; YouTube and X are drawn in the same 24px outline style.
import { Dribbble, Facebook, Instagram, Linkedin } from "lucide-react";
import { SITE } from "../../data/site.js";

const line = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };

function Youtube() {
  return (
    <svg {...line}>
      <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}
function XLogo() {
  return (
    <svg {...line}>
      <path d="M4 4l11.7 16H20L8.3 4z" />
      <path d="M4 20l6.8-6.8M20 4l-6.8 6.8" />
    </svg>
  );
}

// Display order in the footer.
export const SOCIAL_NETWORKS = [
  ["linkedin", "LinkedIn", () => <Linkedin size={20} aria-hidden="true" />],
  ["instagram", "Instagram", () => <Instagram size={20} aria-hidden="true" />],
  ["facebook", "Facebook", () => <Facebook size={20} aria-hidden="true" />],
  ["dribbble", "Dribbble", () => <Dribbble size={20} aria-hidden="true" />],
  ["youtube", "YouTube", Youtube],
  ["x", "X (Twitter)", XLogo],
];

/** Profile URLs that are filled in, in display order. */
export const socialProfiles = () => SOCIAL_NETWORKS.map(([k, label]) => [k, label, (SITE.social || {})[k]]).filter(([, , url]) => url);

export function SocialLinks() {
  const items = SOCIAL_NETWORKS.filter(([k]) => (SITE.social || {})[k]);
  if (!items.length) return null;
  return (
    <ul className="site-foot__social" aria-label={`${SITE.name} on social media`}>
      {items.map(([k, label, Icon]) => (
        <li key={k}>
          <a href={SITE.social[k]} target="_blank" rel="me noopener" aria-label={`${SITE.name} on ${label}`} title={label}>
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}

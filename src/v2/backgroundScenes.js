// One background palette per section, blended by PageBackground as you scroll.
// Keys match the section ids; values are palette hex codes.
const ink = "#070A16";
const ink2 = "#0E1430";
const deep = "#132A7A";
const royal = "#2448C9";
const glow = "#5B83E8";
const ice = "#C9D8F4";
const snow = "#F2F5FB";

function scene(base, band, glowA, glowB) {
  return { base, band, glowA, glowB };
}

export const SCENES = {
  hero: scene(ink, royal, ice, glow),
  manifesto: scene(deep, glow, snow, ice),
  services: scene(deep, royal, glow, ice),
  work: scene(ink2, deep, royal, glow),
  "before-after": scene(deep, glow, ice, snow),
  "focus-engine": scene(ink, deep, royal, deep),
  process: scene(ink2, royal, ice, glow),
  testimonials: scene(deep, glow, ice, royal),
  trust: scene(ink, royal, glow, deep),
  now: scene(deep, glow, snow, ice),
  contact: scene(royal, glow, snow, ice),
  footer: scene(ink, deep, royal, ink2),
};

// Page order (the order the scenes blend in).
export const SCENE_ORDER = [
  "hero",
  "manifesto",
  "services",
  "work",
  "before-after",
  "focus-engine",
  "process",
  "testimonials",
  "trust",
  "now",
  "contact",
  "footer",
];

// Scene keys → the CSS custom properties PageBackground reads.
export const SCENE_VARS = {
  base: "--bg-base",
  band: "--bg-band",
  glowA: "--bg-glow-a",
  glowB: "--bg-glow-b",
};

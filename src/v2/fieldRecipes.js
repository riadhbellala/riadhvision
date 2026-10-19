// Grainy gradient field recipes, one per section id (see GradientField.jsx).
//
// light  corner light: a linear gradient starting at one corner/edge in
//        snow → ice → glow and fading out before the middle. `dir` is the CSS
//        direction it travels (e.g. "to bottom left" starts top-right).
// body   the colour body filling the field (top → bottom).
// pool   a dark pool: a very large radial gradient whose centre sits at or
//        beyond the edge, so only its soft inner part shows.
// tone   text tone: "dark" (snow / ice text) or "light" (deep / royal text).
//
// Rules: no radial gradient smaller than 120vw; no gradient centre inside the
// visible area. That's what keeps the fields from reading as circles.

const ink = "7,10,22";
const deep = "19,42,122";
const royal = "36,72,201";
const glow = "91,131,232";
const ice = "201,216,244";
const snow = "242,245,251";

const rgba = (c, a = 1) => `rgba(${c},${a})`;

export const FIELD_RECIPES = {
  // After the reference: bright royal top-left deepening to navy bottom-left,
  // grey-white light filling the top-right half, and a dark ink pool with a
  // royal halo rising at the bottom centre-right (drawn over the light).
  hero: {
    tone: "dark",
    bodyCss: `linear-gradient(165deg, ${rgba(royal)} 0%, ${rgba(royal)} 26%, ${rgba(deep)} 58%, ${rgba(ink)} 92%)`,
    // From the right edge, tilted down: fills the top-right half, leaves the top-left and the headline on blue.
    light: { dir: "250deg", stops: [[snow, 1, 0], [snow, 0.95, 18], [ice, 0.9, 30], [glow, 0.4, 42], [glow, 0, 52]] },
    pool: { color: ink, alpha: 1, at: "62% 80%", rx: "46vw", ry: "46%", halo: royal },
  },
  manifesto: {
    tone: "light",
    body: [rgba(glow), rgba(glow)],
    light: { dir: "to bottom right", stops: [[snow, 1, 0], [snow, 1, 40], [ice, 1, 62], [ice, 0, 92]] },
    pool: { color: deep, alpha: 0.4, at: "110% 115%", rx: "80vw", ry: "55%" },
  },
  services: {
    tone: "dark",
    body: [rgba(royal), rgba(deep)],
    light: { dir: "to top right", stops: [[ice, 0.9, 0], [glow, 0.5, 18], [glow, 0, 38]] },
    pool: { color: deep, alpha: 0.95, at: "112% -12%", rx: "90vw", ry: "70%" },
  },
  work: {
    tone: "dark",
    body: [rgba(deep), rgba(deep)],
    light: { dir: "to left", stops: [[glow, 0.55, 0], [glow, 0, 22]] },
    pool: { color: ink, alpha: 0.95, at: "-18% 50%", rx: "95vw", ry: "80%" },
  },
  "before-after": {
    tone: "light",
    body: [rgba(glow), rgba(royal)],
    light: { dir: "to bottom", stops: [[snow, 1, 0], [snow, 1, 55], [ice, 1, 78], [ice, 0, 96]] },
    pool: { color: ink, alpha: 0.55, at: "-12% 115%", rx: "80vw", ry: "50%" },
  },
  "focus-engine": {
    tone: "dark",
    body: [rgba(deep), rgba(deep)],
    light: { dir: "to top", stops: [[glow, 0.45, 0], [glow, 0, 22]] },
    pool: { color: ink, alpha: 1, at: "50% 105%", rx: "120vw", ry: "95%" },
  },
  process: {
    tone: "dark",
    // Royal → deep: the fluted ribs brighten the field, so the body sits a step darker.
    body: [rgba(royal), rgba(deep)],
    light: { dir: "to top left", stops: [[ice, 0.9, 0], [glow, 0.5, 18], [glow, 0, 38]] },
    pool: { color: ink, alpha: 0.9, at: "-12% -12%", rx: "90vw", ry: "70%" },
  },
  testimonials: {
    tone: "dark",
    // Royal rather than glow: snow text on glow tops out at ~3.4:1.
    body: [rgba(royal), rgba(deep)],
    light: { dir: "to bottom right", stops: [[ice, 0.45, 0], [glow, 0.25, 12], [glow, 0, 28]] },
    pool: { color: deep, alpha: 0.95, at: "112% 112%", rx: "95vw", ry: "75%" },
  },
  trust: {
    tone: "dark",
    body: [rgba(deep), rgba(deep)],
    light: { dir: "to right", stops: [[glow, 0.4, 0], [glow, 0, 24]] },
    pool: { color: ink, alpha: 0.95, at: "118% 50%", rx: "95vw", ry: "85%" },
  },
  now: {
    tone: "light",
    body: [rgba(ice), rgba(glow)],
    light: { dir: "to bottom left", stops: [[snow, 1, 0], [snow, 1, 45], [ice, 0.8, 70], [ice, 0, 95]] },
    pool: { color: deep, alpha: 0.35, at: "-12% 115%", rx: "80vw", ry: "50%" },
  },
  contact: {
    tone: "dark",
    body: [rgba(royal), rgba(royal)],
    light: { dir: "to bottom left", stops: [[snow, 1, 0], [ice, 0.9, 10], [glow, 0.6, 24], [glow, 0, 42]] },
    pool: { color: ink, alpha: 0.95, at: "50% 112%", rx: "95vw", ry: "62%" },
  },
  footer: {
    tone: "dark",
    body: [rgba(deep), rgba(ink)],
    light: null,
    pool: { color: ink, alpha: 1, at: "50% 125%", rx: "130vw", ry: "110%" },
  },
};

// Shared styling for the "carved groove" line used by the Hero arcs, the
// Services dial and GrooveLine. One place for thickness and colours.

const mix = (token, pct) => `color-mix(in srgb, var(--color-${token}) ${pct}%, transparent)`;

// Width of the channel band; the 1px edges sit at ±GROOVE_WIDTH / 2.
export const GROOVE_WIDTH = 10;

// Hero arc radii (vh) and their top/bottom fade.
export const ARC_RADII = { outer: 125, middle: 115, inner: 105 };
export const ARC_FADE_MASK = "linear-gradient(transparent, black 15%, black 85%, transparent)";

export const groove = {
  light: { band: mix("navy", 3.5), inner: mix("navy", 8), outer: mix("navy", 4) },
  navy: { band: mix("base", 4), inner: mix("base", 10), outer: mix("base", 5) },
};

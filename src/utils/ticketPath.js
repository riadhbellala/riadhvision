// Geometry for every ticket shape on the site (navbar, stub, mobile menu, CTA).
// One function produces the SVG "d" that is reused for the glass clip-path, the
// outline stroke and the shadow, so all three always line up.

const EDGE_EPSILON = 0.5;

function toCorners(radius) {
  if (typeof radius === "number") return { tl: radius, tr: radius, br: radius, bl: radius };
  return { tl: 0, tr: 0, br: 0, bl: 0, ...radius };
}

function toSideNotch(value, fallbackRadius, height) {
  if (!value) return [];
  const r = typeof value === "number" ? value : fallbackRadius;
  return [{ y: height / 2, r }];
}

function fmt(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Rounded rectangle with semicircle notches cut into its edges.
 *
 * width, height   size in px
 * radius          corner radius: a number, or { tl, tr, br, bl }
 * notchRadius     radius of the perforation notches
 * notchesX        x positions of perforations: a notch is cut into BOTH the top
 *                 and bottom edges at each x. An x at 0 or width cuts a quarter
 *                 notch into that corner (where two ticket pieces meet).
 * notchesY        y positions of horizontal perforations: notches are cut into
 *                 BOTH the left and right edges (vertical menu, stacked tickets).
 *                 A y at 0 or height cuts quarter notches into those two corners.
 * leftNotch       true, or a radius: a notch in the middle of the left edge
 * rightNotch      true, or a radius: a notch in the middle of the right edge
 *
 * All notch arcs sweep inward (sweep-flag 0 when walking the outline clockwise).
 */
export function buildTicketPath({
  width,
  height,
  radius = 0,
  notchRadius = 8,
  notchesX = [],
  notchesY = [],
  leftNotch = false,
  rightNotch = false,
}) {
  const W = width;
  const H = height;
  const n = notchRadius;
  const c = toCorners(radius);

  const xs = [...notchesX].sort((a, b) => a - b);
  const innerXs = xs.filter((x) => x > EDGE_EPSILON && x < W - EDGE_EPSILON);
  const atLeft = xs.some((x) => x <= EDGE_EPSILON);
  const atRight = xs.some((x) => x >= W - EDGE_EPSILON);
  const atTop = notchesY.some((y) => y <= EDGE_EPSILON);
  const atBottom = notchesY.some((y) => y >= H - EDGE_EPSILON);
  // Quarter notches where a perforation meets a corner.
  const tlN = atLeft || atTop;
  const trN = atRight || atTop;
  const brN = atRight || atBottom;
  const blN = atLeft || atBottom;

  const ys = notchesY
    .filter((y) => y > EDGE_EPSILON && y < H - EDGE_EPSILON)
    .sort((a, b) => a - b)
    .map((y) => ({ y, r: n }));
  const rightSide = [...ys, ...toSideNotch(rightNotch, n, H)].sort((a, b) => a.y - b.y);
  const leftSide = [...ys, ...toSideNotch(leftNotch, n, H)].sort((a, b) => b.y - a.y);

  const parts = [];
  function line(x, y) {
    parts.push(`L ${fmt(x)} ${fmt(y)}`);
  }
  function arc(r, sweep, x, y) {
    parts.push(`A ${fmt(r)} ${fmt(r)} 0 0 ${sweep} ${fmt(x)} ${fmt(y)}`);
  }

  // Top edge, left → right
  parts.push(`M ${fmt(tlN ? n : c.tl)} 0`);
  innerXs.forEach(function cutTop(x) {
    line(x - n, 0);
    arc(n, 0, x + n, 0);
  });
  if (trN) {
    line(W - n, 0);
    arc(n, 0, W, n);
  } else {
    line(W - c.tr, 0);
    if (c.tr) arc(c.tr, 1, W, c.tr);
  }

  // Right edge, top → bottom
  rightSide.forEach(function cutRight({ y, r }) {
    line(W, y - r);
    arc(r, 0, W, y + r);
  });
  if (brN) {
    line(W, H - n);
    arc(n, 0, W - n, H);
  } else {
    line(W, H - c.br);
    if (c.br) arc(c.br, 1, W - c.br, H);
  }

  // Bottom edge, right → left
  [...innerXs].reverse().forEach(function cutBottom(x) {
    line(x + n, H);
    arc(n, 0, x - n, H);
  });
  if (blN) {
    line(n, H);
    arc(n, 0, 0, H - n);
  } else {
    line(c.bl, H);
    if (c.bl) arc(c.bl, 1, 0, H - c.bl);
  }

  // Left edge, bottom → top
  leftSide.forEach(function cutLeft({ y, r }) {
    line(0, y + r);
    arc(r, 0, 0, y - r);
  });
  if (tlN) {
    line(0, n);
    arc(n, 0, n, 0);
  } else {
    line(0, c.tl);
    if (c.tl) arc(c.tl, 1, c.tl, 0);
  }

  parts.push("Z");
  return parts.join(" ");
}

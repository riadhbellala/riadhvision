import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useBox, useDrawOn } from "./useLineArt";

// Same soft top/bottom fade as Bloom, so the lines dissolve with the backdrop.
const EDGE_MASK = "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)";

function rotate([x, y], [cx, cy], deg) {
  const r = (deg * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  return [cx + dx * Math.cos(r) - dy * Math.sin(r), cy + dx * Math.sin(r) + dy * Math.cos(r)];
}

// Point on a rotated ellipse at angle t (degrees).
function onEllipse([cx, cy], rx, ry, rot, t) {
  const a = (t * Math.PI) / 180;
  return rotate([cx + rx * Math.cos(a), cy + ry * Math.sin(a)], [cx, cy], rot);
}

// Line through p and q, extended past both page edges.
function through(p, q, w) {
  const m = (q[1] - p[1]) / (q[0] - p[0]);
  return `M${-20},${p[1] + m * (-20 - p[0])} L${w + 20},${p[1] + m * (w + 20 - p[0])}`;
}

/**
 * Each variant returns { paths, dots } in px for a w×h section box.
 *
 * sweep  one long slow curve with a dot riding it
 * cross  two long diagonals crossing off-centre, a dot where they meet
 * rings  two concentric rings half off the left edge, a dot on the outer one
 * orbit  a tilted ellipse wrapping the bloom, cut by one long chord that runs
 *        off both edges, with dots where the chord meets the ellipse
 * slab   a tall tilted rectangle half off the right edge, a hairline from the
 *        left edge landing on its corner, and a second ring of dots down its side
 */
const VARIANTS = {
  orbit(w, h, desktop) {
    const c = [w * 0.5, h * 0.58]; // below the heading
    const rx = desktop ? w * 0.4 : w * 0.62;
    const ry = desktop ? h * 0.24 : h * 0.2;
    const rot = desktop ? -12 : -20;
    const p = onEllipse(c, rx, ry, rot, 200);
    const q = onEllipse(c, rx, ry, rot, 335);
    return {
      paths: [
        `M${c[0] - rx},${c[1]} a${rx},${ry} 0 1,0 ${rx * 2},0 a${rx},${ry} 0 1,0 ${-rx * 2},0`,
        through(p, q, w),
      ],
      rotations: [rot, 0],
      center: c,
      dots: [p, q],
    };
  },
  slab(w, h, desktop) {
    const c = [desktop ? w * 0.74 : w * 0.78, h * (desktop ? 0.5 : 0.64)];
    const sw = desktop ? w * 0.34 : w * 0.7;
    const sh = h * (desktop ? 0.56 : 0.46);
    const rot = 14;
    const corners = [
      [c[0] - sw / 2, c[1] - sh / 2],
      [c[0] + sw / 2, c[1] - sh / 2],
      [c[0] + sw / 2, c[1] + sh / 2],
      [c[0] - sw / 2, c[1] + sh / 2],
    ].map((pt) => rotate(pt, c, rot));
    const [tl, , , bl] = corners;
    // Evenly spaced marks along the left side.
    const marks = [0.25, 0.5, 0.75].map((f) => [tl[0] + (bl[0] - tl[0]) * f, tl[1] + (bl[1] - tl[1]) * f]);
    return {
      paths: [
        `M${corners.join(" L")} Z`,
        `M-20,${tl[1] - h * 0.04} L${tl[0]},${tl[1]}`,
        `M${bl[0]},${bl[1]} L${bl[0] - w},${bl[1] + h * 0.12}`,
      ],
      dots: [tl, bl, ...marks],
      small: 3, // index from which dots are drawn smaller
    };
  },
  // One long, slow curve across the section with a single dot riding it.
  sweep(w, h) {
    const y0 = h * 0.82;
    const y1 = h * 0.3;
    const cp = [w * 0.55, h * 0.95];
    const t = 0.62; // dot position along the curve
    const dot = [
      (1 - t) ** 2 * -20 + 2 * (1 - t) * t * cp[0] + t ** 2 * (w + 20),
      (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cp[1] + t ** 2 * y1,
    ];
    return { paths: [`M-20,${y0} Q${cp[0]},${cp[1]} ${w + 20},${y1}`], dots: [dot] };
  },
  // Two long diagonals crossing off-centre, a dot where they meet.
  cross(w, h, desktop) {
    const x = desktop ? w * 0.7 : w * 0.6;
    const y = h * 0.62;
    const [ax, ay, bx, by] = [-20, y + h * 0.14, w + 20, y - h * 0.08];
    const [cx, cy, dx, dy] = [x - w * 0.12, h * 0.2, x + w * 0.1, h * 0.95];
    // Intersection of the two lines.
    const u = ((ax - cx) * (cy - dy) - (ay - cy) * (cx - dx)) / ((ax - bx) * (cy - dy) - (ay - by) * (cx - dx));
    return {
      paths: [`M${ax},${ay} L${bx},${by}`, `M${cx},${cy} L${dx},${dy}`],
      dots: [[ax + u * (bx - ax), ay + u * (by - ay)]],
    };
  },
  // Two concentric rings half off the left edge, one dot on the outer ring.
  rings(w, h, desktop) {
    const c = [desktop ? w * 0.04 : -w * 0.1, h * 0.55];
    const r1 = desktop ? h * 0.26 : w * 0.5;
    const r2 = r1 * 1.45;
    const circle = (r) => `M${c[0] - r},${c[1]} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0`;
    const a = (-28 * Math.PI) / 180;
    return { paths: [circle(r1), circle(r2)], dots: [[c[0] + r2 * Math.cos(a), c[1] + r2 * Math.sin(a)]] };
  },
};

/**
 * Background hairlines that frame the bloom: thin snow strokes and a few dots,
 * drawn on when the section enters, fading out at the section edges like the
 * backdrop. Purely decorative. Use as Section's `lines` with a `variant`.
 */
function Contours({ variant = "orbit" }) {
  const ref = useRef(null);
  const { w, h } = useBox(ref);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  useDrawOn(ref, w > 0);
  const shape = w > 0 ? VARIANTS[variant](w, h, isDesktop) : null;

  return (
    <div ref={ref} aria-hidden className="absolute inset-0" style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}>
      {shape && (
        <svg width={w} height={h} className="absolute inset-0 opacity-70" fill="none" stroke="var(--line)" strokeWidth="1">
          {shape.paths.map(function renderPath(d, i) {
            const rot = shape.rotations?.[i];
            return (
              <path
                key={i}
                data-draw
                pathLength="1"
                d={d}
                transform={rot ? `rotate(${rot} ${shape.center[0]} ${shape.center[1]})` : undefined}
              />
            );
          })}
          {shape.dots.map(function renderDot(pt, i) {
            const small = shape.small !== undefined && i >= shape.small;
            return <circle key={i} data-pop cx={pt[0]} cy={pt[1]} r={small ? 2.5 : 4.5} fill="var(--color-snow)" stroke="none" />;
          })}
        </svg>
      )}
    </div>
  );
}

export default Contours;

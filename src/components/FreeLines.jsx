import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GROOVE_WIDTH, groove } from "../lib/groove";

gsap.registerPlugin(ScrollTrigger);

const RIBBON_HALF = 28; // the two lines sit ±28px from the centre path (56px apart)
const EDGE = GROOVE_WIDTH / 2; // each groove's 1px edges sit ±5px from its band
const SAMPLES = 300;
const FADE = 260; // px faded at each end of the ribbon
const PANEL_INSET = 24; // navy panels: transparent from this far inside their edges
// Minimum bend radius of the centre line; the inner line (28px further in)
// then stays at or above ~300px.
const MIN_RADIUS = RIBBON_HALF + 300;

// Centre-line waypoints: x as a fraction of the page width, y as a fraction of
// the section's height.
const WAYPOINTS = [
  { section: "#about", points: [[0.75, 0.25], [0.35, 0.8]] },
  { section: "#work", points: [[0.2, 0.25], [0.65, 0.8]] },
  { section: "#journey", points: [[0.8, 0.25], [0.4, 0.8]] },
];

function boxOf(el, origin) {
  const r = el.getBoundingClientRect();
  return { top: r.top - origin.top, bottom: r.bottom - origin.top, height: r.height };
}

function fmt(n) {
  return n.toFixed(1);
}

/**
 * Centripetal Catmull-Rom → cubic Bézier segments [p0, c1, c2, p1]. Control
 * points are clamped so y never runs backwards (no loops).
 */
function catmullRom(points) {
  const p = [points[0], ...points, points[points.length - 1]];
  const segments = [];
  function dist(a, b) {
    return Math.max(1e-3, Math.sqrt(Math.hypot(b.x - a.x, b.y - a.y)));
  }
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    const d1 = dist(p0, p1);
    const d2 = dist(p1, p2);
    const d3 = dist(p2, p3);
    function c1Of(k) {
      return (d1 * d1 * p2[k] - d2 * d2 * p0[k] + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1[k]) / (3 * d1 * (d1 + d2));
    }
    function c2Of(k) {
      return (d3 * d3 * p1[k] - d2 * d2 * p3[k] + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2[k]) / (3 * d3 * (d3 + d2));
    }
    const c1y = Math.min(p2.y, Math.max(p1.y, c1Of("y")));
    const c2y = Math.min(p2.y, Math.max(c1y, c2Of("y")));
    segments.push([p1, { x: c1Of("x"), y: c1y }, { x: c2Of("x"), y: c2y }, p2]);
  }
  return segments;
}

/** Smallest bend radius of an S-span from (0,0) to (dx,dy) with vertical tangents. */
function spanMinRadius(dx, dy) {
  if (Math.abs(dx) < 0.5) return Infinity;
  const s = [{ x: 0, y: 0 }, { x: 0, y: dy / 2 }, { x: dx, y: dy / 2 }, { x: dx, y: dy }];
  let min = Infinity;
  for (let i = 1; i < 100; i++) {
    const t = i / 100;
    const u = 1 - t;
    const d1 = bezierTangent(s, t);
    const d2x = 6 * u * (s[2].x - 2 * s[1].x + s[0].x) + 6 * t * (s[3].x - 2 * s[2].x + s[1].x);
    const d2y = 6 * u * (s[2].y - 2 * s[1].y + s[0].y) + 6 * t * (s[3].y - 2 * s[2].y + s[1].y);
    const cross = Math.abs(d1.x * d2y - d1.y * d2x);
    if (cross > 1e-9) min = Math.min(min, Math.pow(d1.x * d1.x + d1.y * d1.y, 1.5) / cross);
  }
  return min;
}

/**
 * Centre line: Catmull-Rom with tangents clamped to vertical at every waypoint,
 * so each span is a relaxed S-curve (handles of dy/2). Each waypoint's sideways
 * swing is reduced, by binary search on the span's real minimum radius, until
 * the span bends no tighter than MIN_RADIUS (a short span swings less).
 */
function relaxedSCurves(waypoints) {
  const pts = [waypoints[0]];
  for (let i = 1; i < waypoints.length; i++) {
    const prev = pts[i - 1];
    const dy = waypoints[i].y - prev.y;
    const want = waypoints[i].x - prev.x;
    let dx = want;
    if (spanMinRadius(Math.abs(want), dy) < MIN_RADIUS) {
      let lo = 0;
      let hi = Math.abs(want);
      for (let k = 0; k < 24; k++) {
        const mid = (lo + hi) / 2;
        if (spanMinRadius(mid, dy) >= MIN_RADIUS) lo = mid;
        else hi = mid;
      }
      dx = Math.sign(want) * lo;
    }
    pts.push({ x: prev.x + dx, y: waypoints[i].y });
  }
  const segments = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const h = (b.y - a.y) / 2;
    segments.push([a, { x: a.x, y: a.y + h }, { x: b.x, y: b.y - h }, b]);
  }
  return segments;
}

function toPath(segments) {
  return segments
    .map(function segmentToD(s, i) {
      const start = i === 0 ? `M ${fmt(s[0].x)} ${fmt(s[0].y)} ` : "";
      return `${start}C ${fmt(s[1].x)} ${fmt(s[1].y)}, ${fmt(s[2].x)} ${fmt(s[2].y)}, ${fmt(s[3].x)} ${fmt(s[3].y)}`;
    })
    .join(" ");
}

function bezier(s, t) {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return { x: a * s[0].x + b * s[1].x + c * s[2].x + d * s[3].x, y: a * s[0].y + b * s[1].y + c * s[2].y + d * s[3].y };
}

function bezierTangent(s, t) {
  const u = 1 - t;
  return {
    x: 3 * u * u * (s[1].x - s[0].x) + 6 * u * t * (s[2].x - s[1].x) + 3 * t * t * (s[3].x - s[2].x),
    y: 3 * u * u * (s[1].y - s[0].y) + 6 * u * t * (s[2].y - s[1].y) + 3 * t * t * (s[3].y - s[2].y),
  };
}

/**
 * Samples the centre curve (~SAMPLES points, spread by segment length) with
 * unit normals, so every offset curve is built from the same stations and
 * stays exactly parallel.
 */
function sampleWithNormals(segments) {
  const lengths = segments.map(function approxLength(s) {
    let len = 0;
    let prev = s[0];
    for (let i = 1; i <= 20; i++) {
      const q = bezier(s, i / 20);
      len += Math.hypot(q.x - prev.x, q.y - prev.y);
      prev = q;
    }
    return len;
  });
  const total = lengths.reduce(function sum(a, b) {
    return a + b;
  }, 0);
  const out = [];
  segments.forEach(function sampleSegment(s, i) {
    const n = Math.max(4, Math.round((lengths[i] / total) * SAMPLES));
    for (let k = i === 0 ? 0 : 1; k <= n; k++) {
      const t = k / n;
      const p = bezier(s, t);
      const tan = bezierTangent(s, t);
      const len = Math.hypot(tan.x, tan.y) || 1;
      out.push({ x: p.x, y: p.y, nx: -tan.y / len, ny: tan.x / len });
    }
  });
  return out;
}

function offsetPath(stations, offset) {
  const pts = stations.map(function shift(s) {
    return { x: s.x + s.nx * offset, y: s.y + s.ny * offset };
  });
  return toPath(catmullRom(pts));
}

function measure(wrapper) {
  const origin = wrapper.getBoundingClientRect();
  const W = origin.width;
  const H = origin.height;
  const hero = wrapper.querySelector("#home");
  const contact = wrapper.querySelector("#contact");
  if (!hero || !contact) return null;

  const start = boxOf(hero, origin).bottom;
  const end = boxOf(contact, origin).top;
  const centre = [{ x: 0.5 * W, y: start }];
  WAYPOINTS.forEach(function addSection(w) {
    const el = wrapper.querySelector(w.section);
    if (!el) return;
    const box = boxOf(el, origin);
    w.points.forEach(function addPoint([fx, fy]) {
      centre.push({ x: fx * W, y: box.top + fy * box.height });
    });
  });
  centre.push({ x: 0.55 * W, y: end });

  const stations = sampleWithNormals(relaxedSCurves(centre));
  // y → fraction of the ribbon's length, so the drawn tip can track the
  // viewport centre (the ribbon is longer than it is tall).
  const ys = [];
  const fractions = [];
  let run = 0;
  stations.forEach(function accumulate(st, i) {
    if (i > 0) run += Math.hypot(st.x - stations[i - 1].x, st.y - stations[i - 1].y);
    ys.push(st.y);
    fractions.push(run);
  });
  const lookup = {
    ys,
    fractions: fractions.map(function normalise(v) {
      return v / (run || 1);
    }),
  };
  const lines = [-RIBBON_HALF, RIBBON_HALF].map(function grooveOf(o) {
    const inward = o < 0 ? 1 : -1; // inner edge faces the ribbon's centre
    return {
      band: offsetPath(stations, o),
      inner: offsetPath(stations, o + inward * EDGE),
      outer: offsetPath(stations, o - inward * EDGE),
    };
  });

  // Fade both ends; hide across navy panels (a pinned panel uses its spacer).
  const stops = ["transparent 0px", `transparent ${start}px`, `black ${start + FADE}px`];
  [...wrapper.querySelectorAll('[data-theme="navy"]')]
    .map(function panelBox(el) {
      return boxOf(el.closest(".pin-spacer") || el, origin);
    })
    .sort(function byTop(a, b) {
      return a.top - b.top;
    })
    .forEach(function hidePanel(b) {
      if (b.top >= end - FADE) return; // the Contact panel is handled by the end fade
      // Hidden from the navy sheet's top edge; visible again where the next
      // sheet overlaps its bottom.
      stops.push(`black ${b.top - PANEL_INSET}px`, `transparent ${b.top}px`, `transparent ${b.bottom - 48}px`, `black ${b.bottom - 48 + PANEL_INSET}px`);
    });
  stops.push(`black ${end - FADE}px`, `transparent ${end}px`);

  return { W, H, lines, lookup, start, end, mask: `linear-gradient(to bottom, ${stops.join(", ")})` };
}

/**
 * One long ribbon of two parallel grooves (Hero arc styling) flowing from the
 * bottom of the Hero to the Contact panel; it draws itself as you scroll.
 * Render as the first child of a `relative` page wrapper.
 */
function FreeLines() {
  const rootRef = useRef(null);
  const [geo, setGeo] = useState(null);

  useLayoutEffect(function observeLayout() {
    const wrapper = rootRef.current.parentElement;
    let timer;
    function update() {
      const next = measure(wrapper);
      if (!next) return;
      setGeo(function keepIfSame(prev) {
        return prev && prev.mask === next.mask && prev.lines[0].band === next.lines[0].band && prev.start === next.start && prev.end === next.end ? prev : next;
      });
    }
    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(update, 150);
    }
    const observer = new ResizeObserver(schedule);
    observer.observe(wrapper);
    document.fonts?.ready.then(schedule);
    schedule();
    return function stopObserving() {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Draw on scroll: one trigger on the page wrapper scrubs every stroke together.
  useLayoutEffect(
    function drawOnScroll() {
      if (!geo) return undefined;
      const ctx = gsap.context(function build() {
        const paths = rootRef.current.querySelectorAll("path");
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          gsap.set(paths, { strokeDashoffset: 0 });
          return;
        }
        const { ys, fractions } = geo.lookup;
        function drawTo(y) {
          // Fraction of the ribbon whose centre line lies above y.
          let lo = 0;
          let hi = ys.length - 1;
          if (y <= ys[0]) lo = -1;
          else {
            while (lo < hi) {
              const mid = (lo + hi + 1) >> 1;
              if (ys[mid] <= y) lo = mid;
              else hi = mid - 1;
            }
          }
          const f = lo < 0 ? 0 : fractions[lo];
          gsap.set(paths, { strokeDashoffset: 1 - f });
        }
        const proxy = { y: geo.start };
        gsap.set(paths, { strokeDashoffset: 1 });
        // The viewport centre travels from the ribbon's start to its end; the
        // drawn tip follows it. One trigger on the page wrapper scrubs all strokes.
        gsap.to(proxy, {
          y: geo.end,
          ease: "none",
          onUpdate: function syncDraw() {
            drawTo(proxy.y);
          },
          scrollTrigger: {
            trigger: rootRef.current.parentElement,
            start: `top+=${Math.round(geo.start)} center`,
            end: `top+=${Math.round(geo.end)} center`,
            scrub: 1,
            // Spans the pinned Services section, so measure after its spacing.
            refreshPriority: -1,
          },
        });
      }, rootRef);
      ScrollTrigger.refresh();
      return function revertDraw() {
        ctx.revert();
      };
    },
    [geo]
  );

  const colors = groove.light;
  function stroke(d, width, color, key) {
    return (
      <path
        key={key}
        d={d}
        fill="none"
        pathLength={1}
        strokeWidth={width}
        strokeLinecap="round"
        style={{ stroke: color, strokeDasharray: 1, strokeDashoffset: 1 }}
      />
    );
  }

  return (
    <div ref={rootRef} aria-hidden className="absolute inset-0 z-[1] pointer-events-none hidden md:block">
      {geo && (
        <svg
          width={geo.W}
          height={geo.H}
          viewBox={`0 0 ${geo.W} ${geo.H}`}
          className="absolute left-0 top-0"
          style={{ maskImage: geo.mask, WebkitMaskImage: geo.mask }}
        >
          {geo.lines.map(function renderGroove(line, i) {
            return (
              <g key={i}>
                {stroke(line.band, GROOVE_WIDTH, colors.band, "band")}
                {stroke(line.inner, 1, colors.inner, "inner")}
                {stroke(line.outer, 1, colors.outer, "outer")}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

export default FreeLines;

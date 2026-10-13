import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import GlassTicket from "./GlassTicket";
import { useTicketShape } from "../hooks/useTicketShape";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const HEIGHT = 96;
const PLANE = 34;
const CLEAR = 16; // min distance between the route and text / tiles
const LOOP_R = 16; // radius of the loop-de-loop

// Glass colours for the stub (GlassTicket reads these variables).
const glassVars = {
  "--t-glass": "rgba(244, 248, 251, 0.55)",
  "--t-edge": "rgba(255, 255, 255, 0.95)",
  "--t-edge-dark": "rgba(0, 49, 82, 0.10)",
  "--t-rim": "rgba(255, 255, 255, 0.6)",
  "--t-shadow": "rgba(0, 49, 82, 0.12)",
};

function bodyRadius() {
  return 16;
}

function stubRadius() {
  return { tl: 0, bl: 0, tr: 16, br: 16 };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isTouchOnly() {
  return window.matchMedia("(hover: none)").matches;
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <g transform="rotate(45 12 12)">
        <path d="M12 3.5 14.6 12 12 20.5 9.4 12Z" />
        <path d="M12 3.5 14.6 12H9.4Z" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

function PlaneIcon() {
  // Points right (0°), so MotionPath's autoRotate aligns it with the route.
  return (
    <svg viewBox="0 0 34 34" width={PLANE} height={PLANE} fill="none" stroke="var(--color-navy)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
      <path d="M3 16.5 31 6 22 30 16.5 19.5Z" />
      <path d="M31 6 16.5 19.5" />
      <path d="M16.5 19.5 14 26.5 19 22.5" />
    </svg>
  );
}

// --- Route geometry (coordinates relative to the route layer) -------------------

function cubicAt(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

function fmtPt(p) {
  return `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
}

/**
 * Stub top-right → up-right → one full loop in the free space right of the
 * subtext → curve up-left, arriving horizontally 16px right of the target word.
 * Every candidate is sampled against the obstacles (already inflated by
 * CLEAR); returns null when no loop position fits (the route is then hidden).
 */
function computeRoute(root, stubWrap, getRouteAnchors, layer) {
  if (!getRouteAnchors || !layer || window.innerWidth < 1024 || prefersReducedMotion()) return null;
  const anchors = getRouteAnchors();
  if (!anchors) return null;

  const L = layer.getBoundingClientRect();
  const rootBox = root.getBoundingClientRect();
  // Layout offsets, so a hover tilt of the stub doesn't move the anchor.
  const S = { x: rootBox.left + stubWrap.offsetLeft + stubWrap.offsetWidth - L.left, y: rootBox.top - L.top };
  const E = { x: anchors.end.x - L.left, y: anchors.end.y - L.top };
  const maxRight = anchors.maxRight - L.left;
  const avoid = anchors.avoid.map(function inflate(r) {
    return { l: r.left - L.left - CLEAR, r: r.right - L.left + CLEAR, t: r.top - L.top - CLEAR, b: r.bottom - L.top + CLEAR };
  });
  const sub = anchors.subtext;
  const subRight = sub.right - L.left;
  const subMid = (sub.top + sub.bottom) / 2 - L.top;

  function blocked(p) {
    if (p.x > maxRight) return true;
    return avoid.some(function hits(r) {
      return p.x > r.l && p.x < r.r && p.y > r.t && p.y < r.b;
    });
  }

  const cx = subRight + CLEAR + LOOP_R + 2;
  for (const dy of [0, 10, -10, 20, -20]) {
    const cy = subMid + dy;
    const Rt = { x: cx + LOOP_R, y: cy };
    // 1. Leave the stub heading up-right, arrive at the loop heading up.
    const c1 = { x: S.x + (Rt.x - S.x) * 0.5, y: S.y - (S.y - cy) * 0.15 };
    const c2 = { x: Rt.x, y: Rt.y + Math.max(24, (S.y - cy) * 0.5) };
    // 3. Continue up, then curve left onto the word, arriving horizontally.
    const c3 = { x: Rt.x, y: Math.min(cy - LOOP_R - 10, E.y + (cy - E.y) * 0.5) };
    const c4 = { x: E.x + Math.max(30, (Rt.x - E.x) * 0.4), y: E.y };

    const samples = [];
    for (let i = 0; i <= 40; i++) samples.push(cubicAt(S, c1, c2, Rt, i / 40));
    for (let i = 0; i <= 40; i++) {
      const a = (-2 * Math.PI * i) / 40; // counter-clockwise on screen
      samples.push({ x: cx + LOOP_R * Math.cos(a), y: cy + LOOP_R * Math.sin(a) });
    }
    for (let i = 0; i <= 40; i++) samples.push(cubicAt(Rt, c3, c4, E, i / 40));
    // The start sits on the stub itself; skip its first few samples.
    if (samples.slice(3).some(blocked)) continue;

    const d =
      `M ${fmtPt(S)} C ${fmtPt(c1)}, ${fmtPt(c2)}, ${fmtPt(Rt)} ` +
      // 2. One full loop: over the top to the left point, back under to the start.
      `A ${LOOP_R} ${LOOP_R} 0 0 0 ${fmtPt({ x: cx - LOOP_R, y: cy })} ` +
      `A ${LOOP_R} ${LOOP_R} 0 0 0 ${fmtPt(Rt)} ` +
      `C ${fmtPt(c3)}, ${fmtPt(c4)}, ${fmtPt(E)}`;
    return { d };
  }
  return null;
}

/**
 * Boarding-pass CTA: a solid navy body plus a frosted glass stub that tears
 * away when you "board". On hover a dashed flight route draws itself from the
 * stub to a target word and a paper plane flies it.
 *
 * routeLayer         element the route and plane render into (a portal), so
 *                    the route can reach beyond the button
 * getRouteAnchors()  viewport-space anchors, or null for no route:
 *                    { end: {x, y}, subtext: DOMRect, avoid: DOMRect[], maxRight }
 */
function TicketButton({
  label = "Start a project",
  meta = "idea → launch",
  gate = "gate 01",
  onClick,
  getRouteAnchors,
  routeLayer,
  className = "",
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rootRef = useRef(null);
  const bodyRef = useRef(null);
  const stubWrapRef = useRef(null);
  const stubRef = useRef(null);
  const compassRef = useRef(null);
  const textRef = useRef(null);
  const routeRef = useRef(null);
  const routeSvgRef = useRef(null);
  const maskPathRef = useRef(null);
  const planeRef = useRef(null);

  const ctxRef = useRef(null);
  const hoverTlRef = useRef(null);
  const marchRef = useRef(null);
  const busyRef = useRef(false);
  const timersRef = useRef([]);
  const getRouteAnchorsRef = useRef(getRouteAnchors);
  getRouteAnchorsRef.current = getRouteAnchors;

  const [text, setText] = useState({ label, meta });
  const [route, setRoute] = useState(null);

  const bodyShape = useTicketShape(bodyRef, null, {
    radius: bodyRadius,
    notchRadius: 10,
    leftNotch: 11,
    edgeNotches: { end: true },
  });
  const stubShape = useTicketShape(stubRef, null, {
    radius: stubRadius,
    notchRadius: 10,
    edgeNotches: { start: true },
  });

  // Recompute the route on resize, in a ResizeObserver and once fonts settle.
  useEffect(
    function trackRoute() {
      let frame = 0;
      function update() {
        const next = computeRoute(rootRef.current, stubWrapRef.current, getRouteAnchorsRef.current, routeLayer);
        setRoute(function keepIfSame(prev) {
          return (prev?.d || null) === (next?.d || null) ? prev : next;
        });
      }
      function schedule() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update);
      }
      const observer = new ResizeObserver(schedule);
      observer.observe(rootRef.current);
      if (routeLayer) observer.observe(routeLayer);
      window.addEventListener("resize", schedule);
      document.fonts?.ready.then(schedule);
      // Hero content fades/settles after mount.
      const late = setTimeout(schedule, 900);
      schedule();
      return function stopTracking() {
        cancelAnimationFrame(frame);
        clearTimeout(late);
        observer.disconnect();
        window.removeEventListener("resize", schedule);
      };
    },
    [routeLayer]
  );

  // One context for every animation; the hover timeline is rebuilt only when
  // the route geometry changes, never on ordinary re-renders.
  useLayoutEffect(
    function buildHoverTimeline() {
      const ctx = gsap.context(function build() {
        if (prefersReducedMotion()) return;
        const tl = gsap.timeline({ paused: true });
        tl.to(bodyRef.current, { x: -4, duration: 0.45, ease: "back.out(1.8)" }, 0)
          .to(stubWrapRef.current, { x: 8, rotate: 7, duration: 0.5, ease: "back.out(2)" }, 0)
          .to(compassRef.current, { rotate: 225, duration: 0.9, ease: "back.out(2)" }, 0);

        if (route && routeRef.current) {
          const path = routeRef.current;
          const length = path.getTotalLength();
          // The route is hidden at rest; the mask then draws it on during hover.
          gsap.set(routeSvgRef.current, { autoAlpha: 0 });
          gsap.set(maskPathRef.current, { strokeDasharray: `${length} ${length}`, strokeDashoffset: length });
          tl.set(routeSvgRef.current, { autoAlpha: 1 }, 0);
          const motion = { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true };
          gsap.set(planeRef.current, { opacity: 0, motionPath: { ...motion, start: 0, end: 0 } });
          tl.to(maskPathRef.current, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 0)
            .to(planeRef.current, { motionPath: { ...motion, start: 0, end: 1 }, duration: 1.6, ease: "power1.inOut" }, 0)
            .to(planeRef.current, { opacity: 1, duration: 0.16, ease: "none" }, 0);
        }
        hoverTlRef.current = tl;

        // Touch screens never hover: tell the story once when the ticket shows.
        if (isTouchOnly()) {
          ScrollTrigger.create({
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
            onEnter: function playOnce() {
              tl.play();
            },
          });
        }
      }, rootRef);
      ctxRef.current = ctx;

      return function revertTimeline() {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
        marchRef.current = null;
        hoverTlRef.current = null;
        ctx.revert();
        ctxRef.current = null;
      };
    },
    [route]
  );

  function handleEnter() {
    if (busyRef.current || !hoverTlRef.current) return;
    hoverTlRef.current.play();
    if (route && routeRef.current && ctxRef.current) {
      ctxRef.current.add(function marchDashes() {
        marchRef.current?.kill();
        // Dashes slowly march along the route while hovered (-14px per second).
        marchRef.current = gsap.to(routeRef.current, { strokeDashoffset: "-=14", duration: 1, ease: "none", repeat: -1 });
      });
    }
  }

  function handleLeave() {
    marchRef.current?.kill();
    marchRef.current = null;
    if (!busyRef.current) hoverTlRef.current?.reverse();
  }

  function swapText(next) {
    if (prefersReducedMotion() || !ctxRef.current) {
      setText(next);
      return;
    }
    ctxRef.current.add(function flipText() {
      gsap
        .timeline()
        .to(textRef.current, { yPercent: -40, opacity: 0, duration: 0.12, ease: "power2.in" })
        .call(function applyText() {
          setText(next);
        })
        .fromTo(textRef.current, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.13, ease: "power2.out" });
    });
  }

  function later(fn, ms) {
    timersRef.current.push(setTimeout(fn, ms));
  }

  function handleClick() {
    if (busyRef.current) return; // guard double clicks
    busyRef.current = true;
    const reduce = prefersReducedMotion();

    if (reduce || !ctxRef.current) {
      setText({ label: "Boarding…", meta: "ticket validated" });
      onClick?.();
      later(function reset() {
        setText({ label, meta });
        busyRef.current = false;
      }, 1900);
      return;
    }

    ctxRef.current.add(function tear() {
      gsap
        .timeline()
        // 1. The stub tears off along the perforation.
        .to(stubWrapRef.current, { x: 40, y: 60, rotate: 32, opacity: 0, duration: 0.6, ease: "power2.in" })
        // 2. Ticket validated.
        .call(function validated() {
          swapText({ label: "Boarding…", meta: "ticket validated" });
        })
        // 3. Board.
        .call(function board() {
          onClick?.();
        }, null, "+=0.25")
        // 4. Reprint a fresh stub (if we're still on the page).
        .fromTo(
          stubWrapRef.current,
          { x: 20, y: -10, rotate: -6, opacity: 0 },
          { x: 0, y: 0, rotate: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)", immediateRender: false },
          "+=1.9"
        )
        .call(function reprint() {
          swapText({ label, meta });
          hoverTlRef.current?.pause(0);
          busyRef.current = false;
        });
    });
  }

  const bodyReady = Boolean(bodyShape.d);

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      aria-label={`${text.label}, ${text.meta}`}
      className={`relative flex items-stretch text-left cursor-pointer w-full max-w-[360px] min-[480px]:w-[420px] min-[480px]:max-w-none ${className}`}
      style={{ height: HEIGHT, ...glassVars }}
    >
      {/* Body: solid navy, so a plain drop-shadow is safe (no glass to break). */}
      <span
        ref={bodyRef}
        className="relative block h-full flex-1 min-w-0"
        style={{ filter: "drop-shadow(0 14px 22px rgba(0, 49, 82, 0.22))" }}
      >
        {!bodyReady && <span className="absolute inset-0 rounded-[16px] bg-navy" />}
        {bodyReady && (
          <svg aria-hidden width={bodyShape.width} height={bodyShape.height} className="absolute left-0 top-0 overflow-visible">
            <defs>
              <clipPath id={`${uid}-body`}>
                <path d={bodyShape.d} />
              </clipPath>
            </defs>
            <path d={bodyShape.d} fill="var(--color-navy)" />
            {/* Bevel: 1px inner edge (a 2px stroke clipped to the shape) */}
            <path d={bodyShape.d} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2} clipPath={`url(#${uid}-body)`} />
          </svg>
        )}
        <span className="absolute inset-0 flex flex-col justify-center pl-9 pr-5 overflow-hidden">
          <span ref={textRef} className="block">
            <span className="block font-mono text-accent whitespace-nowrap" style={{ fontSize: 15, letterSpacing: "0.06em" }}>
              {text.meta}
            </span>
            <span className="block text-base whitespace-nowrap mt-1" style={{ fontSize: 28, lineHeight: 1.1 }}>
              {text.label}
            </span>
          </span>
        </span>
      </span>

      {/* Stub: frosted glass, pivots from its bottom-left corner like tearing paper */}
      <span
        ref={stubWrapRef}
        className="relative block h-full shrink-0 w-[96px] min-[480px]:w-[120px]"
        style={{ transformOrigin: "0% 100%" }}
      >
        <GlassTicket innerRef={stubRef} shape={stubShape} fallbackRadius={16} className="h-full">
          {/* Perforation along the tear line */}
          <span
            aria-hidden
            className="absolute left-0 top-[12px] bottom-[12px] w-px"
            style={{
              backgroundImage: "linear-gradient(to bottom, color-mix(in srgb, var(--color-navy) 40%, transparent) 3px, transparent 3px)",
              backgroundSize: "1px 7px",
            }}
          />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-navy">
            <span className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-current">
              <span ref={compassRef} className="flex">
                <CompassIcon />
              </span>
            </span>
            <span className="font-mono -rotate-6" style={{ fontSize: 13 }}>
              {gate}
            </span>
          </span>
        </GlassTicket>
      </span>

      {/* Flight route + plane (lg+, only where it fits), drawn in the route layer */}
      {route &&
        routeLayer &&
        createPortal(
          <>
            <svg ref={routeSvgRef} aria-hidden className="absolute left-0 top-0 overflow-visible pointer-events-none" width="1" height="1">
              <defs>
                <mask id={`${uid}-route`} maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="4000" height="4000">
                  {/* Butt caps: a round cap would leave a dot at the start while undrawn */}
                  <path ref={maskPathRef} d={route.d} fill="none" stroke="white" strokeWidth={6} strokeLinecap="butt" />
                </mask>
              </defs>
              <path
                ref={routeRef}
                d={route.d}
                fill="none"
                stroke="var(--color-navy)"
                strokeWidth={2}
                strokeDasharray="7 7"
                strokeLinecap="round"
                mask={`url(#${uid}-route)`}
              />
            </svg>
            <span ref={planeRef} aria-hidden className="absolute left-0 top-0 pointer-events-none" style={{ width: PLANE, height: PLANE, opacity: 0 }}>
              <PlaneIcon />
            </span>
          </>,
          routeLayer
        )}
    </button>
  );
}

export default TicketButton;

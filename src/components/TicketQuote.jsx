import { useId, useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "react-responsive";
import GlassTicket from "./GlassTicket";
import { useTicketShape } from "../hooks/useTicketShape";

gsap.registerPlugin(ScrollTrigger);

const NOTCH = 11;
const CORNER = 18;
const BAR_HEIGHT = 34;

// Stub glass colours (GlassTicket reads these variables).
const glassVars = {
  "--t-stub": "rgba(173, 223, 241, 0.6)",
  "--t-edge": "rgba(255, 255, 255, 0.95)",
  "--t-edge-dark": "rgba(0, 49, 82, 0.10)",
  "--t-rim": "rgba(255, 255, 255, 0.55)",
  "--t-shadow": "rgba(0, 49, 82, 0.12)",
};

const mono = { fontFamily: "var(--font-mono)" };

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Deterministic barcode: hash the quote, then derive bar/gap widths from it,
// so every quote prints its own code.
function barcodeFor(text, width) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  function next() {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    return h;
  }
  const bars = [];
  let x = 0;
  while (x < width) {
    const w = 1 + (next() % 3);
    if (x + w > width) break;
    bars.push({ x, w });
    x += w + 1 + (next() % 2);
  }
  return bars;
}

function QuoteMark() {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" fill="currentColor" aria-hidden>
      <path d="M13 8c-4.4 1.6-8 5.4-8 10.6V25h8v-8H9.2c.4-2.8 2.2-4.9 4.8-6.1L13 8Zm14 0c-4.4 1.6-8 5.4-8 10.6V25h8v-8h-3.8c.4-2.8 2.2-4.9 4.8-6.1L27 8Z" />
    </svg>
  );
}

/**
 * A featured sentence printed on a boarding pass: a solid navy body holding
 * the quote, plus a frosted glass stub with passenger, "boarded" stamp and a
 * barcode derived from the quote. Desktop: stub on the right; below 640px the
 * stub drops below the body and the perforation turns horizontal.
 */
function TicketQuote({
  quote,
  caption = "Riadh's promise to every client",
  route = "ORN → ANYWHERE",
  passenger = "Riadh",
  stampYear = new Date().getFullYear(),
  index = "01",
  label = "boarding note",
  className = "",
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const layoutKey = isMobile ? "stacked" : "side";

  const rootRef = useRef(null);
  const ticketRef = useRef(null);
  const bodyRef = useRef(null);
  const stubWrapRef = useRef(null);
  const stubRef = useRef(null);
  const stampRef = useRef(null);
  const barcodeRef = useRef(null);
  const hoverTlRef = useRef(null);
  const ctxRef = useRef(null);

  const words = useMemo(
    function splitWords() {
      return quote.split(/\s+/).filter(Boolean);
    },
    [quote]
  );
  const bars = useMemo(
    function makeBars() {
      return barcodeFor(quote, 96);
    },
    [quote]
  );

  // Desktop: body notched at its right corners, stub at its left corners.
  // Mobile: body notched at its bottom corners, stub at its top corners.
  const bodyShape = useTicketShape(bodyRef, null, {
    radius: isMobile ? { tl: CORNER, tr: CORNER } : { tl: CORNER, bl: CORNER },
    notchRadius: NOTCH,
    axis: isMobile ? "y" : "x",
    edgeNotches: { end: true },
    layoutKey,
  });
  const stubShape = useTicketShape(stubRef, null, {
    radius: isMobile ? { bl: CORNER, br: CORNER } : { tr: CORNER, br: CORNER },
    notchRadius: NOTCH,
    axis: isMobile ? "y" : "x",
    edgeNotches: { start: true },
    layoutKey,
  });

  useLayoutEffect(
    function setUpAnimations() {
      const ctx = gsap.context(function build() {
        if (prefersReducedMotion()) return;

        // Printed (text), encoded (barcode), then validated (stamp).
        const enter = gsap.timeline({
          scrollTrigger: { trigger: rootRef.current, start: "top 80%", once: true },
        });
        enter
          .from(ticketRef.current, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" })
          .from("[data-word]", { y: 12, opacity: 0, duration: 0.4, ease: "power2.out", stagger: 0.04 }, "-=0.45")
          .from(
            barcodeRef.current.querySelectorAll("rect"),
            { scaleY: 0, transformOrigin: "50% 100%", duration: 0.25, ease: "power2.out", stagger: 0.01 },
            "-=0.2"
          )
          .fromTo(
            stampRef.current,
            { scale: 1.6, opacity: 0, rotate: -30 },
            { scale: 1, opacity: 1, rotate: -14, duration: 0.45, ease: "back.out(3)" }
          )
          // A tiny 2px shake of the stub on impact.
          .to(stubWrapRef.current, { x: 2, duration: 0.05, repeat: 3, yoyo: true, ease: "none" })
          .set(stubWrapRef.current, { x: 0 });

        if (!isMobile) {
          hoverTlRef.current = gsap
            .timeline({ paused: true })
            .to(bodyRef.current, { x: -3, duration: 0.45, ease: "back.out(1.8)" }, 0)
            .to(stubWrapRef.current, { x: 6, rotate: 4, transformOrigin: "0% 100%", duration: 0.5, ease: "back.out(2)" }, 0);
        }
      }, rootRef);
      ctxRef.current = ctx;

      return function revertAnimations() {
        hoverTlRef.current = null;
        ctx.revert();
        ctxRef.current = null;
      };
    },
    [isMobile, quote]
  );

  function handleEnter() {
    if (!hoverTlRef.current || !ctxRef.current) return;
    hoverTlRef.current.play();
    // The re-press is its own tween so it never plays backwards on leave.
    ctxRef.current.add(function repress() {
      gsap.fromTo(stampRef.current, { scale: 1 }, { scale: 1.2, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 1 });
    });
  }

  function handleLeave() {
    hoverTlRef.current?.reverse();
  }

  const bodyReady = Boolean(bodyShape.d);

  return (
    <figure ref={rootRef} className={className} style={glassVars}>
      {/* Bracket label, like the section headers */}
      <p className="text-navy/70 mb-4" style={{ ...mono, fontSize: 12 }}>
        [ <span className="tabular-nums">{index}</span>&nbsp; {label} ]
      </p>

      <div
        ref={ticketRef}
        className="flex flex-col sm:flex-row items-stretch"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {/* Body: solid navy, so a plain drop-shadow is safe (no glass to break) */}
        <div
          ref={bodyRef}
          className="relative flex-1 min-w-0 min-h-[240px]"
          style={{ filter: "drop-shadow(0 18px 28px rgba(0, 49, 82, 0.22))" }}
        >
          {!bodyReady && <span className="absolute inset-0 rounded-[18px] bg-navy" />}
          {bodyReady && (
            <svg aria-hidden width={bodyShape.width} height={bodyShape.height} className="absolute left-0 top-0 overflow-visible">
              <defs>
                <clipPath id={`${uid}-body`}>
                  <path d={bodyShape.d} />
                </clipPath>
              </defs>
              <path d={bodyShape.d} fill="var(--color-navy)" />
              {/* Bevel: 1px inner edge (2px stroke clipped to the shape) */}
              <path d={bodyShape.d} fill="none" stroke="rgba(244,248,251,0.15)" strokeWidth={2} clipPath={`url(#${uid}-body)`} />
            </svg>
          )}

          <div className="relative flex flex-col h-full p-8 md:p-10 gap-6">
            <span className="text-accent">
              <QuoteMark />
            </span>
            <blockquote className="text-base" style={{ fontSize: "clamp(22px, 2.4vw, 32px)", lineHeight: 1.3, fontWeight: 400 }}>
              <span className="sr-only">{quote}</span>
              <span aria-hidden>
                {words.map(function renderWord(word, i) {
                  return (
                    <span key={`${word}-${i}`} data-word className="inline-block mr-[0.25em]">
                      {word}
                    </span>
                  );
                })}
              </span>
            </blockquote>
            <div aria-hidden className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-accent" style={{ ...mono, fontSize: 12, letterSpacing: "0.06em" }}>
              <span>{caption}</span>
              <span>{route}</span>
            </div>
          </div>
        </div>

        {/* Stub: frosted glass; pivots from its bottom-left like tearing paper */}
        <div
          ref={stubWrapRef}
          className="relative shrink-0 w-full h-[128px] sm:w-[170px] sm:h-auto"
          style={{ transformOrigin: "0% 100%" }}
        >
          <GlassTicket innerRef={stubRef} shape={stubShape} tint="accent" fallbackRadius={CORNER} className="h-full">
            {/* Perforation along the seam */}
            <span
              aria-hidden
              className={isMobile ? "absolute top-0 left-[14px] right-[14px] h-px" : "absolute left-0 top-[14px] bottom-[14px] w-px"}
              style={{
                backgroundImage: `linear-gradient(${isMobile ? "to right" : "to bottom"}, color-mix(in srgb, var(--color-navy) 40%, transparent) 3px, transparent 3px)`,
                backgroundSize: isMobile ? "7px 1px" : "1px 7px",
              }}
            />
            <div className="absolute inset-0 flex sm:flex-col items-center justify-between sm:justify-center gap-4 sm:gap-5 px-6 py-4 sm:p-5 text-navy">
              <div className="sm:text-center">
                <span className="block text-navy/70" style={{ ...mono, fontSize: 11 }}>
                  passenger
                </span>
                <span className="block" style={{ fontSize: 17, fontWeight: 400 }}>
                  {passenger}
                </span>
              </div>

              <div
                ref={stampRef}
                aria-hidden
                className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-[1.5px] border-dashed border-navy shrink-0"
                style={{ transform: "rotate(-14deg)" }}
              >
                <span style={{ ...mono, fontSize: 11 }}>boarded</span>
                <span style={{ fontSize: 14, fontWeight: 400 }}>{stampYear}</span>
              </div>

              <svg ref={barcodeRef} aria-hidden width="96" height={BAR_HEIGHT} viewBox={`0 0 96 ${BAR_HEIGHT}`} className="shrink-0">
                {bars.map(function renderBar(bar, i) {
                  return <rect key={i} x={bar.x} y={0} width={bar.w} height={BAR_HEIGHT} fill="var(--color-navy)" />;
                })}
              </svg>
            </div>
          </GlassTicket>
        </div>
      </div>

      <figcaption className="sr-only">
        {caption}. Passenger: {passenger}, {route}.
      </figcaption>
    </figure>
  );
}

export default TicketQuote;

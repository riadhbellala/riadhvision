// TextPath (adapted from the wensity TextPath component: plain JSX, no `cn`
// helper). Curved text on an SVG textPath that loops: wave/arc tile along an
// open path (rAF on startOffset, no re-renders), circle spins a ring sized to
// the text. Pauses off-screen or in hidden tabs; still with reduced motion.
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

const CURVES = {
  wave: {
    d: "M 0 72 C 50 12, 90 132, 140 72 S 230 12, 280 72 S 370 132, 420 72 S 510 12, 560 72",
    viewBox: "0 0 560 144",
  },
  arc: {
    d: "M 24 118 Q 280 -8 536 118",
    viewBox: "0 0 560 140",
  },
};

function useAutoPause(paused) {
  const pausedPropRef = useRef(paused);
  const inViewRef = useRef(true);
  const reduceMotionRef = useRef(false);
  const [host, setHost] = useState(null);
  const [playing, setPlaying] = useState(true);
  pausedPropRef.current = paused;

  const setHostRef = useCallback((node) => setHost(node), []);

  useEffect(() => {
    if (!host) return undefined;
    let pageVisible = document.visibilityState !== "hidden";
    const mq = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const syncReduceMotion = () => {
      reduceMotionRef.current = mq?.matches ?? false;
    };
    syncReduceMotion();

    const sync = () => {
      if (reduceMotionRef.current) return setPlaying(false);
      const forced = pausedPropRef.current;
      if (forced === true) return setPlaying(false);
      if (forced === false) return setPlaying(true);
      return setPlaying(inViewRef.current && pageVisible);
    };

    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { threshold: 0.01 }
    );
    const onVisibility = () => {
      pageVisible = document.visibilityState !== "hidden";
      sync();
    };
    const onReduceMotionChange = () => {
      syncReduceMotion();
      sync();
    };

    if (paused !== false) {
      io.observe(host);
      document.addEventListener("visibilitychange", onVisibility);
    }
    mq?.addEventListener("change", onReduceMotionChange);
    sync();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      mq?.removeEventListener("change", onReduceMotionChange);
    };
  }, [paused, host]);

  return { setHostRef, playing };
}

/** Circle mode: ring radius = text length / 2π, then the whole group spins. */
function TextPathCircle({ text, duration, direction, separator, repeats, fontSize, fontWeight, letterSpacing, fill, showPath, pathColor, pathWidth, paused, className = "", ariaLabel }) {
  const pathId = `text-path-circle-${useId().replace(/:/g, "")}`;
  const measureRef = useRef(null);
  const spinRef = useRef(null);
  const angleRef = useRef(0);
  const { setHostRef, playing } = useAutoPause(paused);

  const trimmed = text.trim() || "Text Path";
  const displayText = `${trimmed}${separator}`.repeat(Math.max(1, repeats));
  const [radius, setRadius] = useState(0);

  const textStyle = { fontSize, fontWeight, letterSpacing: `${letterSpacing}em`, fill: fill ?? "currentColor" };

  useLayoutEffect(() => {
    const measure = measureRef.current;
    if (!measure) return;
    const len = measure.getComputedTextLength();
    if (len > 1) setRadius(len / (2 * Math.PI));
  }, [displayText, fontSize, fontWeight, letterSpacing]);

  const pad = fontSize * 1.35;
  const size = radius > 0 ? 2 * radius + 2 * pad : fontSize * 10;
  const cx = size / 2;
  const cy = size / 2;
  const r = radius > 0 ? radius : Math.max(1, size / 2 - pad);
  const pathD = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`;

  useEffect(() => {
    const spin = spinRef.current;
    if (!spin) return undefined;
    let raf = 0;
    let last = performance.now();
    const degPerMs = ((direction === "forward" ? 1 : -1) * 360) / (duration * 1000);
    const paint = (angle) => spin.setAttribute("transform", `rotate(${angle} ${cx} ${cy})`);
    paint(angleRef.current);
    if (!playing || radius <= 0) return () => raf && cancelAnimationFrame(raf);
    const tick = (now) => {
      angleRef.current += degPerMs * (now - last);
      last = now;
      paint(angleRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, [playing, duration, direction, cx, cy, radius]);

  return (
    <svg ref={setHostRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={ariaLabel ?? trimmed} className={`mx-auto block overflow-visible ${className}`}>
      <text ref={measureRef} x={-9999} y={-9999} aria-hidden="true" style={textStyle} className="font-[inherit]">
        {displayText}
      </text>
      <path id={pathId} d={pathD} fill="none" stroke={showPath ? pathColor ?? "rgba(242,245,251,0.3)" : "none"} strokeWidth={showPath ? pathWidth : 0} strokeLinecap="round" vectorEffect="non-scaling-stroke" aria-hidden="true" />
      <g ref={spinRef}>
        {radius > 0 ? (
          <text style={textStyle} className="font-[inherit] [dominant-baseline:central]">
            <textPath href={`#${pathId}`} startOffset="0" method="align" spacing="exact">
              {displayText}
            </textPath>
          </text>
        ) : null}
      </g>
    </svg>
  );
}

/** Open path mode: SVG textPath marquee (wave / arc / custom path). */
function TextPathOpen({ text, curve, path: pathOverride, viewBox: viewBoxOverride, duration, direction, separator, repeats, fontSize, fontWeight, letterSpacing, fill, showPath, pathColor, pathWidth, paused, className = "", ariaLabel }) {
  const pathId = `text-path-${useId().replace(/:/g, "")}`;
  const textPathRef = useRef(null);
  const offsetRef = useRef(0);
  const { setHostRef, playing } = useAutoPause(paused);

  const curveDef = CURVES[curve];
  const pathD = pathOverride?.trim() || curveDef.d;
  const viewBox = viewBoxOverride?.trim() || (pathOverride ? "0 0 560 144" : curveDef.viewBox);
  const trimmed = text.trim() || "Text Path";
  const displayText = `${trimmed}${separator}`.repeat(Math.max(1, repeats));

  useEffect(() => {
    offsetRef.current = 0;
    textPathRef.current?.setAttribute("startOffset", "0");
  }, [pathD, displayText, repeats, direction, duration, fontSize, fontWeight, letterSpacing]);

  useEffect(() => {
    const textPath = textPathRef.current;
    if (!textPath) return undefined;
    let raf = 0;
    let start = performance.now();
    let loopDistance = 0;
    let running = false;

    const measure = () => {
      const total = textPath.getComputedTextLength();
      loopDistance = total > 0 ? total / Math.max(1, repeats) : 0;
    };
    const paint = (offset) => {
      offsetRef.current = offset;
      textPath.setAttribute("startOffset", String(offset));
    };
    const resumeFromOffset = () => {
      if (loopDistance <= 0) {
        start = performance.now();
        return;
      }
      const raw = direction === "forward" ? -offsetRef.current / loopDistance : offsetRef.current / loopDistance;
      const progress = ((raw % 1) + 1) % 1;
      start = performance.now() - progress * duration * 1000;
    };
    const tick = (now) => {
      if (!running) return;
      if (!playing) {
        running = false;
        raf = 0;
        return;
      }
      if (loopDistance <= 0) measure();
      if (loopDistance > 0) {
        const progress = ((now - start) / 1000 / duration) % 1;
        paint(direction === "forward" ? -progress * loopDistance : progress * loopDistance);
      }
      raf = requestAnimationFrame(tick);
    };
    const startLoop = () => {
      if (running || !playing) return;
      measure();
      if (loopDistance <= 0) {
        paint(0);
        return;
      }
      resumeFromOffset();
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    if (playing) startLoop();
    else stopLoop();
    return () => stopLoop();
  }, [playing, pathD, displayText, duration, repeats, direction, fontSize, fontWeight, letterSpacing]);

  return (
    <svg ref={setHostRef} viewBox={viewBox} role="img" aria-label={ariaLabel ?? trimmed} className={`block h-auto w-full overflow-visible ${className}`}>
      <path id={pathId} d={pathD} fill="none" stroke={showPath ? pathColor ?? "rgba(242,245,251,0.3)" : "none"} strokeWidth={showPath ? pathWidth : 0} strokeLinecap="round" vectorEffect="non-scaling-stroke" aria-hidden="true" />
      <text style={{ fontSize, fontWeight, letterSpacing: `${letterSpacing}em`, fill: fill ?? "currentColor" }} className="font-[inherit] [dominant-baseline:central]">
        <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0" method="align" spacing="exact">
          {displayText}
        </textPath>
      </text>
    </svg>
  );
}

export function TextPath({
  text,
  curve = "arc",
  path,
  viewBox,
  duration = 14,
  direction = "forward",
  separator = "  ·  ",
  repeats = 3,
  fontSize = 28,
  fontWeight = 500,
  letterSpacing = 0.05,
  fill,
  showPath = false,
  pathColor,
  pathWidth = 1,
  paused,
  className,
  "aria-label": ariaLabel,
}) {
  const shared = {
    text,
    duration: Math.max(2, duration),
    direction,
    separator,
    repeats: Math.max(1, Math.min(8, Math.round(repeats))),
    fontSize: Math.max(10, fontSize),
    fontWeight,
    letterSpacing,
    fill,
    showPath,
    pathColor,
    pathWidth: Math.max(0.5, pathWidth),
    paused,
    className,
    ariaLabel,
  };
  if (curve === "circle" && !path?.trim()) return <TextPathCircle {...shared} />;
  return <TextPathOpen {...shared} curve={curve === "wave" ? "wave" : "arc"} path={path} viewBox={viewBox} />;
}

export default TextPath;

import { useId } from "react";

/**
 * One frosted-glass ticket piece, built from three stacked layers that all use
 * the same outline "d" (see utils/ticketPath.js):
 *
 * 1. Shadow (bottom): an SVG filling the path, blurred and offset down. It is a
 *    sibling because clip-path would clip a box-shadow, and a filter on a parent
 *    would make that parent a backdrop root and kill the glass blur.
 * 2. Glass (middle): clip-path: path(d) + backdrop-filter. Holds the content.
 * 3. Outline (top): an SVG stroking the path (clip-path can't draw borders):
 *    a 1px light edge, a faint dark line just outside it for the bevel, and a
 *    soft inner rim (--t-rim) that gives the glass its thickness.
 *
 * Colours come from CSS variables (--t-*) set by the parent, so a theme switch
 * is a variable swap with CSS transitions.
 *
 * Until "d" is measured, the glass uses a plain rounded clip with the final
 * size, so nothing shifts; the SVG layers fade in once the path exists.
 */
function GlassTicket({ shape, tint = "base", fallbackRadius = 0, className = "", style, innerRef, children }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ready = Boolean(shape.d);
  const { width, height, d } = shape;
  const pad = 40;

  return (
    <div ref={innerRef} className={`relative ${className}`} style={style}>
      {/* 1. Shadow */}
      <svg
        aria-hidden
        width={width}
        height={height}
        className="absolute left-0 top-0 overflow-visible pointer-events-none"
        style={{ transform: "translateY(10px)", opacity: ready ? 1 : 0, transition: "opacity 300ms" }}
      >
        <defs>
          <filter id={`${uid}-blur`} x="-20%" y="-80%" width="140%" height="260%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        {ready && <path d={d} filter={`url(#${uid}-blur)`} style={{ fill: "var(--t-shadow)", transition: "fill 300ms" }} />}
      </svg>

      {/* 2. Glass */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: ready ? `path('${d}')` : `inset(0 round ${fallbackRadius}px)`,
          background: tint === "accent" ? "var(--t-stub)" : "var(--t-glass)",
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
          transition: "background-color 300ms",
        }}
      >
        {children}
      </div>

      {/* 3. Outline */}
      <svg
        aria-hidden
        width={width}
        height={height}
        className="absolute left-0 top-0 overflow-visible pointer-events-none"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 300ms" }}
      >
        {ready && (
          <>
            <defs>
              <clipPath id={`${uid}-inside`}>
                <path d={d} />
              </clipPath>
              {/* Only the part outside the shape: the dark line sits 0.5px outward */}
              <mask id={`${uid}-outside`} maskUnits="userSpaceOnUse" x={-pad} y={-pad} width={width + pad * 2} height={height + pad * 2}>
                <rect x={-pad} y={-pad} width={width + pad * 2} height={height + pad * 2} fill="white" />
                <path d={d} fill="black" />
              </mask>
            </defs>
            <path
              d={d}
              fill="none"
              strokeWidth={2}
              mask={`url(#${uid}-outside)`}
              style={{ stroke: "var(--t-edge-dark)", transition: "stroke 300ms" }}
            />
            {/* Inner rim: a 3px stroke clipped to the inside shows 1.5px */}
            <path
              d={d}
              fill="none"
              strokeWidth={3}
              clipPath={`url(#${uid}-inside)`}
              style={{ stroke: "var(--t-rim, transparent)", transition: "stroke 300ms" }}
            />
            <path d={d} fill="none" strokeWidth={1} style={{ stroke: "var(--t-edge)", transition: "stroke 300ms" }} />
          </>
        )}
      </svg>
    </div>
  );
}

export default GlassTicket;

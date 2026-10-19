import { useRef } from "react";
import { useDrawOn, END_FADE } from "./useLineArt";

/**
 * Full-width 1px horizontal line with optional tiny labels sitting on it.
 * style   positions it (e.g. { top: "14vh" })
 * labels  { left, center, right }: strings or nodes
 */
function Rule({ style, labels }) {
  const ref = useRef(null);
  useDrawOn(ref, true);
  return (
    <div ref={ref} aria-hidden={labels ? undefined : true} className="absolute left-0 right-0 pointer-events-none" style={style}>
      <svg className="block w-full h-px overflow-visible" style={{ maskImage: END_FADE, WebkitMaskImage: END_FADE }}>
        <line data-draw x1="0" y1="0.5" x2="100%" y2="0.5" pathLength="1" strokeWidth="1" style={{ stroke: "var(--line)" }} />
      </svg>
      {labels && (
        <div className="absolute inset-x-4 md:inset-x-6 bottom-2 flex items-end justify-between gap-4 text-label tone-label">
          <span data-pop className="relative">{labels.left}</span>
          <span data-pop className="hidden md:inline relative">{labels.center}</span>
          {/* The right label runs under the bright top-right of the background: deep text */}
          <span data-pop className="pointer-events-auto text-deep">{labels.right}</span>
        </div>
      )}
    </div>
  );
}

export default Rule;

import { useRef } from "react";
import { useBox, useDrawOn } from "./useLineArt";

/** Pill outline (1.5px). Size and position it with style/className; it may bleed off-screen. */
function Stadium({ style, className = "" }) {
  const ref = useRef(null);
  const { w, h } = useBox(ref);
  useDrawOn(ref, w > 0);
  const s = 1.5;
  return (
    <div ref={ref} aria-hidden className={`absolute pointer-events-none ${className}`} style={style}>
      {w > 0 && (
        <svg width={w} height={h} className="block overflow-visible">
          <rect
            data-draw
            x={s / 2}
            y={s / 2}
            width={w - s}
            height={h - s}
            rx={(h - s) / 2}
            pathLength="1"
            fill="none"
            strokeWidth={s}
            style={{ stroke: "var(--line)" }}
          />
        </svg>
      )}
    </div>
  );
}

export default Stadium;

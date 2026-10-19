import { useRef } from "react";
import { useBox, useDrawOn } from "./useLineArt";

/** Circle outline (1.5px), placed mostly off-screen so only a curve shows. */
function Arc({ style }) {
  const ref = useRef(null);
  const { w } = useBox(ref);
  useDrawOn(ref, w > 0);
  const s = 1.5;
  return (
    <div ref={ref} aria-hidden className="absolute pointer-events-none aspect-square" style={style}>
      {w > 0 && (
        <svg width={w} height={w} className="block overflow-visible">
          <circle data-draw cx={w / 2} cy={w / 2} r={(w - s) / 2} pathLength="1" fill="none" strokeWidth={s} style={{ stroke: "var(--line)" }} />
        </svg>
      )}
    </div>
  );
}

export default Arc;

import { useRef } from "react";
import { useDrawOn } from "./useLineArt";

const OPACITY = [1, 0.75, 0.5, 0.25];

/** A row of 4 dots (14px) fading from 100% to 25%. */
function Dots({ style }) {
  const ref = useRef(null);
  useDrawOn(ref, true);
  return (
    <div ref={ref} aria-hidden className="absolute flex gap-2.5 pointer-events-none" style={style}>
      {OPACITY.map((o) => (
        <span key={o} data-pop data-opacity={o} className="block w-3.5 h-3.5 rounded-full" style={{ background: "var(--line)", opacity: o }} />
      ))}
    </div>
  );
}

export default Dots;

import { useRef } from "react";
import { useBox } from "./lines/useLineArt";

const R = 24; // corner radius, convex and concave

// Rounded card with a stepped cut-out at the top-left and the bottom-right
// (after the "3 Lessons" slide): clockwise path in px for a w×h box.
function notchPath(w, h, tl, br) {
  const [tw, th] = tl;
  const [bw, bh] = br;
  const r = R;
  return [
    `M${tw + r},0`,
    `H${w - r}`, `A${r},${r} 0 0 1 ${w},${r}`,
    `V${h - bh - r}`, `A${r},${r} 0 0 1 ${w - r},${h - bh}`,
    `H${w - bw + r}`, `A${r},${r} 0 0 0 ${w - bw},${h - bh + r}`,
    `V${h - r}`, `A${r},${r} 0 0 1 ${w - bw - r},${h}`,
    `H${r}`, `A${r},${r} 0 0 1 0,${h - r}`,
    `V${th + r}`, `A${r},${r} 0 0 1 ${r},${th}`,
    `H${tw - r}`, `A${r},${r} 0 0 0 ${tw},${th - r}`,
    `V${r}`, `A${r},${r} 0 0 1 ${tw + r},0`,
    "Z",
  ].join(" ");
}

/**
 * A glass card with two stepped cut-outs: `tab` sits in the top-left one (a
 * label pill) and `corner` in the bottom-right one (controls or an action).
 * The shape is clipped from the card's measured size, so the frosted glass,
 * border and cut-outs stay exact at every width. `tl` / `br` = [width, height]
 * of each cut-out in px.
 */
function NotchCard({ tab, corner, tl = [180, 56], br = [140, 72], className = "", children }) {
  const ref = useRef(null);
  const { w, h } = useBox(ref);
  const d = w > 0 ? notchPath(w, h, tl, br) : null;

  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        className="relative"
        style={{
          clipPath: d ? `path("${d}")` : undefined,
          background: "linear-gradient(160deg, rgba(242,245,251,0.10), rgba(242,245,251,0.03)), rgba(14,20,48,0.55)",
          paddingTop: tl[1],
          paddingBottom: br[1],
        }}
      >
        {children}
      </div>
      {d && (
        <svg aria-hidden width={w} height={h} className="absolute left-0 top-0 pointer-events-none overflow-visible">
          <path d={d} fill="none" stroke="rgba(242,245,251,0.22)" strokeWidth="1.5" />
        </svg>
      )}
      {tab && (
        <div className="absolute left-0 top-0 flex items-center" style={{ width: tl[0] - 12, height: tl[1] - 12 }}>
          {tab}
        </div>
      )}
      {corner && (
        <div className="absolute right-0 bottom-0 flex items-center justify-end" style={{ width: br[0] - 12, height: br[1] - 12 }}>
          {corner}
        </div>
      )}
    </div>
  );
}

export default NotchCard;

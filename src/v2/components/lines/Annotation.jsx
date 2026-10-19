import { useLayoutEffect, useRef, useState } from "react";
import { useDrawOn } from "./useLineArt";

/**
 * Annotation line linking the elements matched by `targets` (a selector,
 * resolved inside the section): a polyline running `gap` px above them with a
 * 6px node over each, a short tick down to each one, and a label block
 * (title + one line) attached above the node at `labelAt`.
 */
function Annotation({ targets, gap = 22, labelAt = -1, title, text }) {
  const ref = useRef(null);
  const [geo, setGeo] = useState(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const section = root.closest("section");
    const measure = () => {
      const origin = root.getBoundingClientRect();
      const els = [...section.querySelectorAll(targets)];
      if (!els.length) return;
      const nodes = els.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - origin.left, top: r.top - origin.top };
      });
      const y = Math.min(...nodes.map((n) => n.top)) - gap;
      setGeo({ nodes, y, start: nodes[0].x - 60, end: nodes[nodes.length - 1].x + 60 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    return () => ro.disconnect();
  }, [targets, gap]);

  useDrawOn(ref, Boolean(geo));
  const labelNode = geo && geo.nodes[labelAt < 0 ? geo.nodes.length + labelAt : labelAt];

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 pointer-events-none">
      {geo && (
        <>
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <polyline
              data-draw
              points={`${geo.start},${geo.y} ${geo.end},${geo.y}`}
              pathLength="1"
              fill="none"
              strokeWidth="1"
              style={{ stroke: "var(--line)" }}
            />
            {geo.nodes.map((n, i) => (
              <line key={i} data-draw x1={n.x} y1={geo.y} x2={n.x} y2={n.top - 4} pathLength="1" strokeWidth="1" style={{ stroke: "var(--line)" }} />
            ))}
          </svg>
          {geo.nodes.map((n, i) => (
            <span
              key={i}
              data-pop
              className="absolute w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full"
              style={{ left: n.x, top: geo.y, background: "var(--line)" }}
            />
          ))}
          {labelNode && (
            <div data-pop className="absolute text-right" style={{ left: labelNode.x, top: geo.y - 12, transform: "translate(-100%, -100%)" }}>
              <p className="text-label tone-label">{title}</p>
              <p className="text-small tone-body mt-1 whitespace-nowrap">{text}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Annotation;

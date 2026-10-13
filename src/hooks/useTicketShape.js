import { useLayoutEffect, useRef, useState } from "react";
import { buildTicketPath } from "../utils/ticketPath";

const EMPTY = { width: 0, height: 0, d: "" };

/**
 * Measures a ticket container and its perforation elements and returns the
 * ticket outline: { width, height, d }.
 *
 * containerRef      ref to the ticket's box (its size is the ticket size)
 * perforationRefs   ref whose .current is an array of perforation elements
 * options
 *   radius          number, { tl, tr, br, bl }, or function(width, height)
 *   notchRadius     perforation notch radius
 *   axis            "x" (default): perforations are vertical lines → notches in
 *                   the top/bottom edges; "y": horizontal lines → left/right edges
 *   edgeNotches     { start, end }: quarter notches at the start/end corners
 *                   (left/right for axis "x", top/bottom for axis "y"), where
 *                   this piece meets a neighbouring ticket piece
 *   leftNotch, rightNotch   passed through to buildTicketPath
 *   layoutKey       change it when the set of perforations changes
 */
export function useTicketShape(containerRef, perforationRefs, options = {}) {
  const [shape, setShape] = useState(EMPTY);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useLayoutEffect(
    function observeTicket() {
      const container = containerRef.current;
      if (!container) return undefined;
      let frame = 0;

      function measure() {
        const opts = optionsRef.current;
        // offsetWidth/Height ignore transforms (entrance animations, tilts).
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        if (!width || !height) return;

        const box = container.getBoundingClientRect();
        const axis = opts.axis || "x";
        const positions = (perforationRefs?.current || [])
          .filter(Boolean)
          .map(function centreOf(el) {
            const r = el.getBoundingClientRect();
            return axis === "x" ? r.left + r.width / 2 - box.left : r.top + r.height / 2 - box.top;
          });

        const radius = typeof opts.radius === "function" ? opts.radius(width, height) : opts.radius || 0;
        const notchesX = axis === "x" ? positions : [];
        const notchesY = axis === "y" ? positions : [];
        const edges = axis === "x" ? notchesX : notchesY;
        if (opts.edgeNotches?.start) edges.unshift(0);
        if (opts.edgeNotches?.end) edges.push(axis === "x" ? width : height);

        const d = buildTicketPath({
          width,
          height,
          radius,
          notchRadius: opts.notchRadius,
          notchesX,
          notchesY,
          leftNotch: opts.leftNotch,
          rightNotch: opts.rightNotch,
        });

        setShape(function keepIfSame(prev) {
          return prev.d === d && prev.width === width && prev.height === height ? prev : { width, height, d };
        });
      }

      function schedule() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(measure);
      }

      const observer = new ResizeObserver(schedule);
      observer.observe(container);
      (perforationRefs?.current || []).forEach(function observeParent(el) {
        if (el?.parentElement) observer.observe(el.parentElement);
      });
      // A font swap changes text widths and therefore segment positions.
      document.fonts?.ready.then(schedule);
      measure();

      return function stopObserving() {
        cancelAnimationFrame(frame);
        observer.disconnect();
      };
    },
    // layoutKey re-runs the effect when the perforation set changes.
    [containerRef, perforationRefs, options.layoutKey]
  );

  return shape;
}

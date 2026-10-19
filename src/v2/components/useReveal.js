import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

/**
 * Wrap a heading's words in inline-block spans for animation. A <Selected>
 * highlight ([data-selected]) stays one unit (it has its own Motion animation),
 * tags and line breaks are left alone. Returns the units and an undo function.
 */
function splitWords(heading) {
  const units = [];
  const made = [];
  [...heading.childNodes].forEach(function wrap(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          return;
        }
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.textContent = part;
        frag.appendChild(span);
        units.push(span);
      });
      made.push({ node, frag: [...frag.childNodes] });
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.matches("[data-selected]")) {
      units.push(node);
    }
  });
  function undo() {
    made.forEach(({ node, frag }) => {
      frag[0]?.before(node);
      frag.forEach((n) => n.remove());
    });
  }
  return { units, undo };
}

/**
 * Page motion (GSAP).
 *
 * Appear, once: section headings (h2.text-section) animate word by word, each
 * with a variant from data-title: "focus" (blur to sharp, default), "chars"
 * (words flip up), "spread" (words close up, scrubbed) or "slide" (words slide
 * in leaning). Every other block in a section's content ([data-content] > *)
 * rises into place, staggered (transform + opacity only, so it stays cheap).
 *
 * Scroll, both ways (scrubbed, so scrolling up plays it back): elements with
 * data-scroll get a light effect tied to their position on screen:
 *   "lift"  moves up faster than the page (parallax)
 *   "sink"  moves down slower than the page (parallax)
 *   "spin"  turns as it passes
 *   "grow"  scales up as it reaches the middle
 * Reduced motion leaves everything still.
 */
export function useReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const undos = [];

    const ctx = gsap.context(() => {
      gsap.utils.toArray("h2.text-section").forEach(function animateHeading(heading) {
        const variant = heading.dataset.title || "focus";
        const { units, undo } = splitWords(heading);
        undos.push(undo);
        const once = { trigger: heading, start: "top 88%", once: true };

        if (variant === "spread") {
          const n = units.length;
          gsap.from(units, {
            xPercent: (i) => (i - (n - 1) / 2) * (window.innerWidth < 768 ? 20 : 60),
            autoAlpha: 0.15,
            ease: "none",
            scrollTrigger: { trigger: heading, start: "top 100%", end: "top 45%", scrub: 0.6 },
          });
        } else if (variant === "chars") {
          gsap.from(units, {
            autoAlpha: 0,
            yPercent: 90,
            rotateX: -75,
            transformPerspective: 700,
            transformOrigin: "50% 100%",
            duration: 0.9,
            ease: OUT,
            stagger: 0.08,
            scrollTrigger: once,
          });
        } else if (variant === "slide") {
          gsap.from(units, {
            autoAlpha: 0,
            x: -80,
            skewX: 12,
            duration: 0.9,
            ease: OUT,
            stagger: 0.08,
            scrollTrigger: once,
          });
        } else {
          gsap.from(units, {
            autoAlpha: 0,
            filter: "blur(10px)",
            yPercent: 30,
            duration: 0.8,
            ease: OUT,
            stagger: 0.06,
            clearProps: "filter",
            scrollTrigger: once,
          });
        }
      });

      // Blocks rise into place, in order.
      const blocks = gsap.utils.toArray("[data-content] > *").filter((el) => !el.matches("h2.text-section"));
      gsap.set(blocks, { autoAlpha: 0, y: 56 });
      ScrollTrigger.batch(blocks, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: OUT, stagger: 0.12, overwrite: true, clearProps: "transform" }),
      });

      // Scroll-linked effects that reverse when scrolling back up.
      const FX = {
        lift: { from: { y: 80 }, to: { y: -80 } },
        sink: { from: { y: -40 }, to: { y: 60 } },
        spin: { from: { rotate: -25 }, to: { rotate: 25 } },
        grow: { from: { scale: 0.86 }, to: { scale: 1.04 } },
      };
      gsap.utils.toArray("[data-scroll]").forEach(function scrollFx(el) {
        const fx = FX[el.dataset.scroll];
        if (!fx) return;
        gsap.fromTo(el, fx.from, {
          ...fx.to,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      });
    });

    // Layout settles after fonts and images; keep trigger positions right.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
      undos.reverse().forEach((u) => u());
    };
  }, []);
}

export default useReveal;

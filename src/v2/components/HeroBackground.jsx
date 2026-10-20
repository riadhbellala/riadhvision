import { useEffect, useRef } from "react";
import gsap from "gsap";

const FRAMES = 60;
const CYCLES = 1; // how many times the sequence plays over the whole page (frame 60 loops back to 1)
const EASE = 0.08; // per-frame catch-up toward the scroll target (lower = floatier)

function frameSrc(set, i) {
  return `/bg/${set}/frame_${String(i + 1).padStart(3, "0")}.webp`;
}

/**
 * Fixed background driven by scroll: the 60 frames in public/bg/{desktop,mobile}
 * are drawn on a canvas, and the scroll position picks the frame. Neighbouring
 * frames are blended by the fractional position, and the position eases toward
 * the scroll target, so the light moves continuously with no cuts. Portrait
 * screens use the mobile set.
 */
function HeroBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const portrait = window.matchMedia("(orientation: portrait)");
    let set = portrait.matches ? "mobile" : "desktop";
    let images = [];
    let current = -1; // eased frame position
    let drawn = -1;

    function load() {
      images = Array.from({ length: FRAMES }, (_, i) => {
        const img = new Image();
        img.decoding = "async";
        img.src = frameSrc(set, i);
        img.onload = () => (drawn = -1); // redraw once a frame arrives
        return img;
      });
    }

    function resize() {
      // The frames are soft gradients, so 1x pixels are plenty and keep drawing cheap.
      canvas.width = Math.round(window.innerWidth);
      canvas.height = Math.round(window.innerHeight);
      drawn = -1;
    }

    function ready(i) {
      const img = images[((i % FRAMES) + FRAMES) % FRAMES];
      return img && img.complete && img.naturalWidth ? img : null;
    }

    // Nearest loaded frame, so a slow network never shows a blank canvas.
    function nearest(i) {
      for (let d = 0; d < FRAMES; d++) {
        const img = ready(i - d) || ready(i + d);
        if (img) return img;
      }
      return null;
    }

    function cover(img, alpha) {
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }

    // Page height is measured on resize, not every frame (reading it in the
    // ticker forced a layout on every frame while other things animated).
    let max = 0;
    const measureMax = () => (max = document.documentElement.scrollHeight - window.innerHeight);
    measureMax();
    const pageRO = new ResizeObserver(measureMax);
    pageRO.observe(document.body);

    function target() {
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      return p * CYCLES * (FRAMES - 1);
    }

    function tick() {
      const t = target();
      current = current < 0 || reduce ? t : current + (t - current) * EASE;
      if (Math.abs(t - current) < 0.001) current = t;
      if (Math.abs(current - drawn) < 0.002) return;

      const base = Math.floor(current);
      const frac = current - base;
      const a = ready(base) || nearest(base);
      if (!a) return;
      cover(a, 1);
      const b = ready(base + 1);
      if (b && frac > 0.001) cover(b, frac);
      ctx.globalAlpha = 1;
      drawn = current;
    }

    function onOrientation() {
      set = portrait.matches ? "mobile" : "desktop";
      load();
    }

    load();
    resize();
    gsap.ticker.add(tick);
    window.addEventListener("resize", resize);
    portrait.addEventListener("change", onOrientation);
    return () => {
      gsap.ticker.remove(tick);
      pageRO.disconnect();
      window.removeEventListener("resize", resize);
      portrait.removeEventListener("change", onOrientation);
    };
  }, []);

  return (
    <div aria-hidden className="grain-heavy fixed inset-0 z-0 pointer-events-none overflow-hidden bg-ink">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Tame the light so white type stays readable over every frame: a cobalt
          multiply turns the white areas ice-blue, and a soft ink centre (where
          the content sits) keeps the moving light visible around it. Stronger
          on phones, where text runs edge to edge. */}
      <div className="absolute inset-0 mix-blend-multiply" style={{ background: "rgba(91,131,232,0.45)" }} />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(7,10,22,0.42), rgba(7,10,22,0.18) 75%, rgba(7,10,22,0.08))" }}
      />
      <div
        className="md:hidden absolute inset-0"
        style={{ background: "radial-gradient(ellipse 110% 75% at 50% 50%, rgba(7,10,22,0.3), rgba(7,10,22,0.1) 75%, transparent)" }}
      />
    </div>
  );
}

export default HeroBackground;

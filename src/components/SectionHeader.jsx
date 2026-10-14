import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const tones = {
  light: { meta: "text-navy/70", name: "text-navy", title: "text-navy", intro: "text-navy/70" },
  navy: { meta: "text-base/70", name: "text-base", title: "text-base", intro: "text-base/70" },
};

// Split layout title: uppercase, label | title | intro on lg.
const SPLIT_TITLE = {
  fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
  fontWeight: 400,
  letterSpacing: "-0.02em",
  lineHeight: 1.05,
};

// Big display title used for section openers (size="xl").
const XL_TITLE = {
  fontSize: "clamp(2.75rem, 6vw, 5.5rem)",
  fontWeight: 400,
  letterSpacing: "-0.04em",
  lineHeight: 1,
};

/**
 * Shared section header: optional bracket label ([ 02 Work ]), title and
 * optional intro. `title` may contain "\n" to force line breaks; each line
 * rises from its own mask on entrance.
 */
const SectionHeader = ({
  number,
  label,
  title,
  intro,
  size,
  layout,
  align = "left",
  theme = "light",
  id,
  className = "",
}) => {
  const rootRef = useRef(null);
  const tone = tones[theme];
  const centered = align === "center";
  const lines = String(title).split("\n");

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
      });
      if (label) tl.from("[data-sh-label]", { opacity: 0, y: 8, duration: 0.5, ease: "power2.out" });
      tl.from("[data-sh-line]", { yPercent: 100, duration: 0.9, ease: "expo.out", stagger: 0.08 }, label ? "-=0.2" : 0);
      if (intro) tl.from("[data-sh-intro]", { opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.4");
    },
    { scope: rootRef }
  );

  const labelEl = label && (
    <p data-sh-label className={`text-small ${layout === "split" ? "lg:col-span-2 lg:pt-3" : "mb-4"}`}>
      <span className={tone.meta}>
        [ <span className="tabular-nums">{number}</span>{" "}
      </span>
      <span className={tone.name}>{label}</span>
      <span className={tone.meta}> ]</span>
    </p>
  );
  const titleLines = lines.map((line, i) => (
    // pb keeps descenders inside the mask
    <span key={i} className="block overflow-hidden pb-[0.08em]">
      <span data-sh-line className="block">
        {line}
      </span>
    </span>
  ));

  if (layout === "split") {
    return (
      <header
        ref={rootRef}
        className={`grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start mb-10 md:mb-14 ${className}`}
      >
        {labelEl}
        <h2 id={id} className={`lg:col-span-6 uppercase ${tone.title}`} style={SPLIT_TITLE}>
          {titleLines}
        </h2>
        {intro && (
          <p data-sh-intro className={`lg:col-span-4 lg:pt-3 text-body-lg ${tone.intro}`}>
            {intro}
          </p>
        )}
      </header>
    );
  }

  return (
    <header ref={rootRef} className={`mb-10 md:mb-14 ${centered ? "text-center" : ""} ${className}`}>
      {labelEl}
      <h2 id={id} className={`${size === "xl" ? "" : "text-h2"} ${tone.title}`} style={size === "xl" ? XL_TITLE : undefined}>
        {titleLines}
      </h2>
      {intro && (
        <p data-sh-intro className={`text-body-lg ${tone.intro} max-w-[56ch] mt-4 ${centered ? "mx-auto" : ""}`}>
          {intro}
        </p>
      )}
    </header>
  );
};

export default SectionHeader;

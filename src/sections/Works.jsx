import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { projects } from "../constants";
import SectionShell from "../components/SectionShell";
import SectionHeader from "../components/SectionHeader";

const FILTERS = ["All", "E-commerce", "SaaS & Platforms", "Websites"];

const cards = projects.map((project) => {
  const [title] = project.name.split(" — ");
  const live = Boolean(project.href) && project.href !== "#";
  let domain = project.slug;
  if (live) {
    try {
      domain = new URL(project.href).hostname.replace(/^www\./, "");
    } catch {
      domain = project.slug;
    }
  }
  return {
    key: project.slug,
    slug: project.slug,
    title,
    category: project.category,
    line: project.description,
    href: live ? project.href : null,
    domain,
    image: project.image,
  };
});

const BrowserFrame = ({ card }) => (
  <div className="relative rounded-xl border border-navy/10 bg-base overflow-hidden">
    <div className="relative h-7 flex items-center px-3 border-b border-navy/10">
      <span className="flex gap-1.5" aria-hidden>
        <span className="w-1.5 h-1.5 rounded-full bg-navy/15" />
        <span className="w-1.5 h-1.5 rounded-full bg-navy/15" />
        <span className="w-1.5 h-1.5 rounded-full bg-navy/15" />
      </span>
      <span className="absolute left-1/2 -translate-x-1/2 font-mono text-[11px] text-navy/50 bg-navy/[0.04] rounded-full px-3 max-w-[60%] truncate">
        {card.domain}
      </span>
    </div>
    <div className="relative overflow-hidden aspect-[16/10]">
      <img
        src={card.image}
        alt=""
        loading="lazy"
        className="w-full h-full object-cover object-top transition-transform duration-500 ease-out-expo motion-safe:group-hover:scale-[1.03]"
      />
      <span
        aria-hidden
        className="absolute top-3 right-3 grid place-items-center w-11 h-11 rounded-full bg-base/90 backdrop-blur text-navy opacity-0 scale-80 transition-[opacity,transform] duration-300 ease-out-expo group-hover:opacity-100 group-hover:scale-100"
      >
        ↗
      </span>
    </div>
  </div>
);

const Info = ({ card, featured }) => (
  <div className="p-5 flex flex-col flex-1">
    <p className="text-eyebrow text-navy/70">{card.category}</p>
    <h3 className={`${featured ? "text-h2" : "text-h3"} text-navy mt-2`}>{card.title}</h3>
    <p className="text-body text-navy/80 mt-2 line-clamp-2">{card.line}</p>
    {/* Actions sit above the card's stretched link */}
    <div className="relative z-[2] mt-auto pt-6 flex items-center gap-4">
      <Link
        to={`/project/${card.slug}`}
        className="group/btn inline-flex items-center gap-3 h-[44px] pl-5 pr-2 rounded-full bg-navy text-base text-small font-medium transition-colors duration-150 hover:bg-navy/90"
      >
        View project
        <span
          aria-hidden
          className="grid place-items-center w-7 h-7 rounded-full bg-accent text-navy transition-transform duration-200 ease-out-expo group-hover/btn:translate-x-1"
        >
          →
        </span>
      </Link>
      {card.href && (
        <a
          href={card.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-small text-navy/70 hover:text-navy hover:underline underline-offset-4"
        >
          Live site ↗
        </a>
      )}
    </div>
  </div>
);

/**
 * One card system. `featured` = horizontal on lg (image 7 / info 5),
 * `mirrored` puts the image on the right. Below lg every card is vertical.
 * The card's own background covers the page lines behind it.
 */
const Card = ({ card, featured = false, mirrored = false }) => (
  <div
    className={`group relative h-full bg-base border border-navy/10 rounded-2xl p-3 shadow-sm transition-[box-shadow,transform] duration-[250ms] ease-out-expo hover:shadow-md motion-safe:hover:-translate-y-1 ${
      featured ? "flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center" : "flex flex-col"
    }`}
  >
    {/* Stretched link: the whole card opens the project page */}
    <Link to={`/project/${card.slug}`} aria-label={`View project: ${card.title}`} className="absolute inset-0 z-[1] rounded-2xl" />
    <div className={featured ? `lg:col-span-7 ${mirrored ? "lg:order-2" : ""}` : ""}>
      <BrowserFrame card={card} />
    </div>
    <div className={featured ? "lg:col-span-5 flex flex-col h-full" : "flex flex-col flex-1"}>
      <Info card={card} featured={featured} />
    </div>
  </div>
);

// ── Main Section ─────────────────────────────────────────────────────────────
const Works = () => {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? cards : cards.filter((c) => c.category === filter);
  const featured = visible.slice(0, 2);
  let rest = visible.slice(2);
  // Odd count: the last one gets the featured horizontal style.
  const tail = rest.length % 2 === 1 ? rest[rest.length - 1] : null;
  if (tail) rest = rest.slice(0, -1);

  // Filtering and image loads change the section height; re-measure the
  // ScrollTriggers below (e.g. the pinned Services section) once settled.
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => clearTimeout(id);
  }, [filter]);

  useEffect(() => {
    const imgs = [...sectionRef.current.querySelectorAll("img")];
    let cancelled = false;
    Promise.all(
      imgs.map((img) =>
        img.complete
          ? null
          : new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            })
      )
    ).then(() => !cancelled && ScrollTrigger.refresh());
    return () => {
      cancelled = true;
    };
  }, []);

  const motionProps = (i) => ({
    layout: !reduceMotion,
    initial: { opacity: 0, y: reduceMotion ? 0 : 24 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.08 } },
    viewport: { once: true, amount: 0.15 },
    exit: { opacity: 0, y: reduceMotion ? 0 : 12, transition: { duration: 0.25 } },
  });

  return (
    <SectionShell
      ref={sectionRef}
      id="work"
      theme="light"
      flat
      // Pull the header up so the title's top ~10% sits in About's bottom fade
      // (title box ≈ 2 lines × 1.05 → 10% ≈ 0.2 × font size).
      className="text-navy pt-0! md:pt-0!"
      style={{ marginTop: "calc(-0.2 * clamp(2.5rem, 5.5vw, 5rem))" }}
    >
      <SectionHeader
        number="02"
        label="Work"
        layout="split"
        title="Selected projects"
        intro="Real products for real businesses: e-commerce stores, platforms and websites built to perform."
      />

      {/* Filter tabs */}
      <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-2 mb-10 md:mb-14">
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={`text-small rounded-full px-4 py-2 transition-colors duration-150 cursor-pointer ${
                active ? "bg-navy text-base" : "border border-navy/15 text-navy/70 hover:text-navy hover:border-navy/30"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Featured: horizontal, the second mirrored */}
      <div className="flex flex-col gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {featured.map((card, i) => (
            <motion.article key={card.key} {...motionProps(i)}>
              <Card card={card} featured mirrored={i === 1} />
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* The rest: two equal-height columns */}
      {rest.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <AnimatePresence mode="popLayout" initial={false}>
            {rest.map((card, i) => (
              <motion.article key={card.key} {...motionProps(i)} className="h-full">
                <Card card={card} />
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}

      {tail && (
        <motion.article key={tail.key} {...motionProps(0)} className="mt-6">
          <Card card={tail} featured />
        </motion.article>
      )}
    </SectionShell>
  );
};

export default Works;

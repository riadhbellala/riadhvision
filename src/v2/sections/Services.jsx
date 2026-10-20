import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Section from "../components/Section";
import { Selected, Tag } from "../components/Selected";
import GlassIcon from "../components/GlassIcon";
import { InfiniteRibbon } from "../../components/ui/infinite-ribbon";
import { servicesData } from "../../constants";

const EASE = [0.22, 1, 0.36, 1];

// The two halves of the work, each crossed by two ribbons of what it covers.
const LENSES = [
  {
    label: "Design",
    ribbons: [
      "Interfaces · Brand look · Figma prototypes ·",
      "Motion · Mobile-first layouts · Design systems ·",
    ],
  },
  {
    label: "Development",
    ribbons: [
      "Websites · Online stores · Web apps ·",
      "APIs · Databases · Fast and SEO ready ·",
    ],
  },
];

// One glass icon per service, in servicesData order.
const ICONS = ["nodes", "bag", "browser", "cursor"];

const RIBBON =
  "rounded-pill py-2 text-[clamp(0.95rem,1.4vw,1.2rem)] font-medium tracking-[-0.01em] shadow-[0_10px_30px_rgba(7,10,22,0.35)]";

function clean(text) {
  return text.replace(/^\(|\)$/g, "");
}

/** A glowing glass circle with two ribbons crossing inside it. */
function Lens({ lens, flip }) {
  const tilt = flip ? -1 : 1;
  return (
    <figure className="flex flex-col items-center gap-5">
      <div
        className="relative w-full max-w-[380px] aspect-square rounded-full overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 55%, #5B83E8 0%, #2448C9 45%, #132A7A 72%, #070A16 100%)",
          boxShadow:
            "inset 0 0 0 1px rgba(242,245,251,0.28), inset 0 0 80px rgba(201,216,244,0.35), 0 30px 80px rgba(7,10,22,0.45)",
        }}
      >
        <div className="absolute inset-x-[-12%] top-1/2 -translate-y-1/2 flex flex-col gap-8">
          <InfiniteRibbon duration={26} rotation={10 * tilt} className={RIBBON}>
            {lens.ribbons[0]}
          </InfiniteRibbon>
          <InfiniteRibbon
            duration={30}
            reverse
            rotation={-8 * tilt}
            className={RIBBON}
          >
            {lens.ribbons[1]}
          </InfiniteRibbon>
        </div>
        <div
          aria-hidden
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, transparent 60%, rgba(7,10,22,0.45) 100%)",
            boxShadow: "inset 0 2px 0 rgba(255,255,255,0.35)",
          }}
        />
      </div>
      <figcaption className="glass-pill px-6 py-2.5 text-label text-snow">
        {lens.label}
      </figcaption>
    </figure>
  );
}

/** The selected service's details: icon, summary and what it includes (`compact` drops the heading under an accordion title). */
function Detail({ service, icon, compact = false }) {
  return (
    <div>
      <div
        className={`${compact ? "hidden" : "flex"} items-start justify-between gap-6`}
      >
        <h3 className="text-h2 text-snow max-w-[16ch]">{service.title}</h3>
        <GlassIcon
          name={icon}
          size={96}
          className="shrink-0 -mt-2 w-16 h-16 md:w-24 md:h-24"
        />
      </div>
      <p
        className={`text-body text-snow/90 max-w-[52ch] ${compact ? "" : "mt-4"}`}
      >
        {service.description}
      </p>
      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {service.items?.map(function renderItem(item) {
          return (
            <li
              key={item.title}
              className="rounded-[18px] bg-ink/40 border border-snow/10 p-4"
            >
              <p className="text-body text-snow">{item.title}</p>
              <p className="text-small text-ice mt-1">
                {clean(item.description)}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// 03 — Services: design and development as two ribbon lenses, then the four
// services as a list that opens one at a time (side panel on desktop, accordion on phones).
function Services() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = servicesData[active];

  return (
    <Section id="services">
      <h2 data-title="rise" className="relative text-section text-snow">
        <Selected>Designed</Selected>, then built.
        <Tag rotate={-6} className="-top-12 right-0">Design with meaning</Tag>
      </h2>
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-16 items-center">
        <p className="text-snow font-light leading-[1.25] tracking-[-0.02em] max-w-[24ch]" style={{ fontSize: "clamp(1.35rem, 2.2vw, 2rem)" }}>
          One person from the first sketch to the live site, so nothing gets lost between the design and the code.
        </p>
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          {LENSES.map(function renderLens(lens, i) {
            return <Lens key={lens.label} lens={lens} flip={i === 1} />;
          })}
        </div>
      </div>

      <div className="mt-14 md:mt-16 grid grid-cols-1 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-6 md:gap-10 items-start">
        <ul className="flex flex-col gap-2" role="list">
          {servicesData.map(function renderService(service, i) {
            const on = i === active;
            return (
              <li key={service.title}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  aria-expanded={on}
                  className={`w-full flex items-center gap-4 rounded-[20px] px-4 py-3 text-left transition-colors duration-200 ${
                    on
                      ? "bg-snow/12 border border-snow/25"
                      : "border border-transparent hover:bg-snow/6"
                  }`}
                >
                  <GlassIcon
                    name={ICONS[i] || "layers"}
                    size={48}
                    className="shrink-0"
                  />
                  <span className={`text-h4 ${on ? "text-snow" : "text-ice"}`}>
                    {service.title}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden
                    className={`ml-auto shrink-0 text-snow transition-transform duration-300 ${on ? "md:-rotate-90 rotate-180" : ""}`}
                  >
                    <path d="M3 6l5 5 5-5" />
                  </svg>
                </button>
                {/* Phones: the details open under the title. */}
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      className="md:hidden overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                    >
                      <div className="px-4 pt-4 pb-6">
                        <Detail
                          service={service}
                          icon={ICONS[i] || "layers"}
                          compact
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {/* Desktop: one glass panel showing the selected service. */}
        <div className="hidden md:block glass-panel bg-ink/30! p-10 min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <Detail service={current} icon={ICONS[active] || "layers"} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

export default Services;

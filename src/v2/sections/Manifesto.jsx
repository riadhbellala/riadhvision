import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Selected, Tag } from "../components/Selected";
import Section from "../components/Section";
import EmblemDrift from "../components/EmblemDrift";
import Contours from "../components/lines/Contours";
import NotchCard from "../components/NotchCard";
import BeforeAfter from "./BeforeAfter";

const EASE = [0.22, 1, 0.36, 1];
const CYCLE = 3200; // ms per value

const VALUES = [
  { title: "Clarity", text: "One clear message per page, so visitors know what to do next." },
  { title: "Performance", text: "Fast on every phone and connection, measured, not guessed." },
  { title: "Intelligence", text: "AI and automation where they save you real time." },
];

// About: two cards. The first (notched) holds the statement with its moving
// tags, the three values (they take turns on their own; hovering or tapping
// one holds it) and a short paragraph. The second is "From rough to refined".
function Manifesto() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(
    function cycle() {
      if (held || reduce) return undefined;
      const t = setTimeout(() => setActive((i) => (i + 1) % VALUES.length), CYCLE);
      return () => clearTimeout(t);
    },
    [active, held, reduce]
  );

  return (
    <Section id="manifesto" lines={<Contours variant="sweep" />} backdrop={<EmblemDrift src="/blob.webp" side="right" />}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <NotchCard
          className="lg:col-span-6"
          tab={<span className="ml-1 rounded-pill bg-snow text-deep px-4 py-2 text-small font-medium">About me</span>}
          corner={
            <a href="#work" aria-label="See the work" className="grid place-items-center w-14 h-14 mr-1 rounded-full bg-snow text-deep transition-transform duration-200 hover:scale-105 active:scale-95">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M8 2v12M3 9l5 5 5-5" />
              </svg>
            </a>
          }
        >
          <div className="px-7 pb-2 pt-2 md:px-10">
            <h2 className="relative text-statement tone-head text-[clamp(2.6rem,3.4vw,3.25rem)]! leading-[1.15]!">
              I build where <Selected>design</Selected> and <Selected delay={0.35}>engineering</Selected> meet.
              <Tag rotate={-7} className="-top-12 right-[2%]">Strategy first</Tag>
              <Tag rotate={6} delay={0.2} className="-bottom-12 right-[6%]">Built to scale</Tag>
            </h2>

            <ul className="mt-14 flex flex-wrap gap-3">
              {VALUES.map(function renderValue(value, i) {
                const on = i === active;
                return (
                  <li key={value.title}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => {
                        setActive(i);
                        setHeld(true);
                      }}
                      onMouseLeave={() => setHeld(false)}
                      className={`relative overflow-hidden rounded-pill px-6 py-3 text-label border transition-colors duration-300 ${
                        on ? "bg-snow text-deep border-snow" : "glass-pill text-snow"
                      }`}
                    >
                      {value.title}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="min-h-[3.4em] mt-5">
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  className="text-body-lg text-snow"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  aria-live="polite"
                >
                  {VALUES[active].text}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="text-body tone-body mt-4 max-w-[52ch]">
              I’m a full-stack developer who also designs. I take a project from the first sketch to launch, so what you approve is what goes live.
            </p>
          </div>
        </NotchCard>

        <div data-scroll="grow" className="lg:col-span-6">
          <BeforeAfter />
        </div>
      </div>
    </Section>
  );
}

export default Manifesto;

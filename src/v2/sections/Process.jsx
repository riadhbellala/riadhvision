import { useRef, useState } from "react";
import {
  AnimatePresence,
  // eslint-disable-next-line no-unused-vars
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import Section from "../components/Section";
import { Tag } from "../components/Selected";
import GlassIcon from "../components/GlassIcon";

const EASE = [0.22, 1, 0.36, 1];

const STEPS = [
  {
    name: "Discover",
    icon: "search",
    text: "A call about your goals, your audience and what success looks like. You leave it with a clear plan and a quote.",
  },
  {
    name: "Design",
    icon: "pen",
    text: "Layouts and the look in Figma, shaped with you until it feels right. Nothing gets built before you approve it.",
  },
  {
    name: "Build",
    icon: "browser",
    text: "Clean, fast code, with content you can update yourself. You follow progress on a live preview link.",
  },
  {
    name: "Launch",
    icon: "paper-plane",
    text: "Tested on real phones, deployed and measured. Then I stay around to fix, tune and improve.",
  },
];

// 07 — Process: on desktop the heading and a big glass icon stay pinned on the
// left while the four steps scroll by on the right; a rail fills as you go and
// the icon follows the step in focus. On phones each step carries its own icon.
function Process() {
  const reduce = useReducedMotion();
  const listRef = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 60%", "end 60%"],
  });

  useMotionValueEvent(scrollYProgress, "change", function pick(p) {
    setActive(
      Math.min(STEPS.length - 1, Math.max(0, Math.floor(p * STEPS.length))),
    );
  });

  return (
    <Section id="process">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h2 className="relative text-section text-[clamp(3rem,5.4vw,5.75rem)]! text-snow max-w-[10ch]">
              How we’ll work.
              <Tag rotate={7} className="-bottom-5 right-0">No surprises</Tag>
            </h2>
            <p className="text-body text-ice mt-6 max-w-[34ch]">
              Four steps from the first call to a live site, with something to
              see at every one of them.
            </p>

            <div
              className="hidden lg:grid mt-10 place-items-center w-[240px] h-[240px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(91,131,232,0.45), transparent 70%)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={STEPS[active].icon}
                  initial={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.85, rotate: -6 }
                  }
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.9, rotate: 6 }
                  }
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <GlassIcon name={STEPS[active].icon} size={180} float />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <ol ref={listRef} className="lg:col-span-7 relative flex flex-col">
          {/* Progress rail. */}
          <span
            aria-hidden
            className="absolute left-[11px] top-3 bottom-3 w-[2px] rounded-full bg-snow/15"
          />
          <motion.span
            aria-hidden
            className="absolute left-[11px] top-3 bottom-3 w-[2px] rounded-full bg-snow origin-top"
            style={{ scaleY: reduce ? 1 : scrollYProgress }}
          />
          {STEPS.map(function renderStep(step, i) {
            const reached = reduce || i <= active;
            const focus = reduce || i === active;
            return (
              <li
                key={step.name}
                className="relative pl-12 md:pl-16 py-6 md:py-10 lg:min-h-[40vh]"
              >
                <span
                  aria-hidden
                  className={`absolute left-0 top-8 md:top-12 w-6 h-6 rounded-full border-2 transition-colors duration-300 ${reached ? "bg-snow border-snow" : "bg-ink border-snow/30"}`}
                />
                <GlassIcon
                  name={step.icon}
                  size={72}
                  className="lg:hidden mb-3"
                />
                <h3
                  className={`font-light tracking-[-0.035em] leading-none transition-colors duration-300 ${focus ? "text-snow" : "text-snow/45"}`}
                  style={{ fontSize: "clamp(2.25rem, 4.4vw, 4.25rem)" }}
                >
                  {step.name}
                </h3>
                <p
                  className={`text-body-lg mt-4 max-w-[44ch] transition-colors duration-300 ${focus ? "text-snow/90" : "text-snow/55"}`}
                >
                  {step.text}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

export default Process;

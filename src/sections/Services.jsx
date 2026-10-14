import { useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useMotionValue, useReducedMotion } from "framer-motion";
import { servicesData } from "../constants";
import SectionShell, { SHEET_OVERLAP } from "../components/SectionShell";
import SectionHeader from "../components/SectionHeader";
import { GROOVE_WIDTH, groove } from "../lib/groove";

gsap.registerPlugin(ScrollTrigger);

const N = servicesData.length;
const STEP = 40; // degrees between markers on the dial
const pad = (n) => String(n + 1).padStart(2, "0");
const snapEase = (t) => 1 - (1 - t) * (1 - t); // power2.out

// The pinned sheet fills the viewport; the dial is 85% of it (radius 42.5%).
const PANEL_H = "100vh";
const DIAL_R = `calc(${PANEL_H} * 0.425)`;

// --- Desktop: pinned, scroll-driven dial ------------------------------------------
const PinnedServices = () => {
  const pinRef = useRef(null);
  const stRef = useRef(null);
  const settledRef = useRef(0); // last step the snap settled on
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  const progress = useMotionValue(0);
  const service = servicesData[active];

  useGSAP(
    () => {
      const proxy = { p: 0 };
      const tween = gsap.to(proxy, {
        p: 1,
        ease: "none",
        onUpdate: () => {
          progress.set(proxy.p);
          setActive(Math.round(proxy.p * (N - 1)));
        },
        scrollTrigger: {
          // Pin a full-width, margin-free wrapper; margins and rounding live on
          // the inner panel. Pinning the panel itself made it overflow the
          // viewport by its side margin and cut off the right corners.
          trigger: pinRef.current,
          pin: true,
          anticipatePin: 1,
          start: "top top",
          end: "+=" + (N - 1) * 100 + "%",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onEnter: () => (settledRef.current = 0),
          onEnterBack: () => (settledRef.current = N - 1),
        },
      });
      stRef.current = tween.scrollTrigger;
    },
    { scope: pinRef }
  );

  const stepPosition = (step) => {
    const st = stRef.current;
    return st.start + (step / (N - 1)) * (st.end - st.start);
  };

  const scrollToStep = (step, duration) => {
    const target = stepPosition(step);
    if (lenis) lenis.scrollTo(target, { duration, easing: snapEase });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  // Snap once Lenis stops scrolling inside the pin. One gesture moves one step
  // from the last settled step, so wheel momentum can't skip services; a long
  // drag (e.g. the scrollbar) snaps to the nearest step instead.
  // ScrollTrigger's built-in `snap` tweens the native scroll position, which
  // Lenis overrides, so snapping is driven through Lenis here.
  useEffect(() => {
    if (!lenis) return;
    let timer;
    const snap = () => {
      const st = stRef.current;
      if (!st?.isActive) return;
      const exact = st.progress * (N - 1);
      const settled = settledRef.current;
      let step = settled;
      if (Math.abs(exact - settled) > 1.5) step = Math.round(exact);
      else if (exact > settled + 0.1) step = settled + 1;
      else if (exact < settled - 0.1) step = settled - 1;
      step = Math.max(0, Math.min(N - 1, step));
      settledRef.current = step;
      if (Math.abs(window.scrollY - stepPosition(step)) > 2) scrollToStep(step, 0.4);
    };
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(snap, 120);
    };
    const off = lenis.on("scroll", onScroll);
    return () => {
      clearTimeout(timer);
      off();
    };
    // stepPosition/scrollToStep only read refs and `lenis`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis]);

  // Clicking a marker (or arrow keys) scrolls to that step's position.
  const goTo = (i) => {
    if (!stRef.current) return;
    const step = Math.max(0, Math.min(N - 1, i));
    settledRef.current = step;
    scrollToStep(step, 0.8);
  };

  const onKeyDown = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowRight" && e.key !== "ArrowUp" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    goTo(active + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1));
  };

  const colors = groove.navy;

  return (
    // The pin goes on this full-width outer wrapper, which carries the sheet
    // overlap; the sheet inside has no margins of its own.
    <div ref={pinRef} className={`relative ${SHEET_OVERLAP}`}>
      <SectionShell
        id="services"
        theme="navy"
        overlap={false}
        aria-labelledby="services-heading"
        onKeyDown={onKeyDown}
        className="py-0!"
        // Top padding clears the fixed navbar.
        innerClassName="h-full pt-24 pb-6"
        style={{ height: PANEL_H }}
        decoration={
          <>
            {/* Half-circle dial: flat side on the panel's left edge, curve bulging right */}
            <div
              aria-hidden
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full pointer-events-none"
              style={{
                height: `calc(${PANEL_H} * 0.85)`,
                aspectRatio: "1 / 2",
                borderStyle: "solid",
                borderColor: colors.band,
                borderWidth: `${GROOVE_WIDTH}px ${GROOVE_WIDTH}px ${GROOVE_WIDTH}px 0`,
                background: "linear-gradient(to right, rgba(244,248,251,0.06), transparent)",
              }}
            >
              {/* Inner and outer edges of the carved channel */}
              <div className="absolute inset-0 rounded-r-full" style={{ border: `1px solid ${colors.inner}`, borderLeft: 0 }} />
              <div
                className="absolute rounded-r-full"
                style={{
                  top: -GROOVE_WIDTH,
                  bottom: -GROOVE_WIDTH,
                  right: -GROOVE_WIDTH,
                  left: 0,
                  border: `1px solid ${colors.outer}`,
                  borderLeft: 0,
                }}
              />
            </div>

            {/* Markers ride the curve: a 0×0 pivot at the dial centre rotates the ring */}
            <motion.div
              role="tablist"
              aria-label="Services"
              aria-orientation="vertical"
              className="absolute left-0 top-1/2 w-0 h-0 z-20"
              initial={false}
              animate={{ rotate: -active * STEP }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            >
              {servicesData.map((s, i) => {
                const isActive = i === active;
                const visible = Math.abs((i - active) * STEP) <= 90;
                return (
                  <div key={s.title} className="absolute left-0 top-0" style={{ transform: `rotate(${i * STEP}deg)` }}>
                    <div
                      className="absolute left-0 top-0"
                      style={{ transform: `translate(-50%, -50%) translateX(calc(${DIAL_R} - ${GROOVE_WIDTH / 2}px))` }}
                    >
                      <motion.div initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.3 }}>
                        <button
                          type="button"
                          role="tab"
                          id={`service-tab-${i}`}
                          aria-selected={isActive}
                          aria-controls="service-panel"
                          aria-label={`Show service: ${s.title}`}
                          tabIndex={isActive ? 0 : -1}
                          disabled={!visible}
                          onClick={() => goTo(i)}
                          className="flex items-center justify-center cursor-pointer rounded-md disabled:pointer-events-none"
                        >
                          {isActive ? (
                            <span className="flex items-center justify-center w-14 h-14 rounded-md bg-accent text-navy text-h4 shadow-md">
                              {pad(i)}
                            </span>
                          ) : (
                            <span className="flex items-center justify-center w-11 h-11 rotate-45 rounded-md bg-navy border border-base/15 shadow-md transition-colors duration-150 hover:border-base/40">
                              <span className="-rotate-45 text-small text-base/70">{pad(i)}</span>
                            </span>
                          )}
                        </button>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Progress track on the far right */}
            <div aria-hidden className="absolute right-6 top-[15%] bottom-[15%] w-[2px] bg-base/10 rounded-full overflow-hidden z-20">
              <motion.div className="w-full h-full bg-accent origin-top" style={{ scaleY: progress }} />
            </div>
          </>
        }
      >
        <div className="h-full grid grid-cols-[5fr_7fr] items-center">
          <div aria-hidden />
          <div className="max-w-[520px]">
            <SectionHeader theme="navy" title="What I can build for you" id="services-heading" className="mb-12!" />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                role="tabpanel"
                id="service-panel"
                aria-labelledby={`service-tab-${active}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-eyebrow text-base/60">
                  {pad(active)} / {pad(N - 1)}
                </p>
                <h3 className="text-h1 text-base mt-3">{service.title}</h3>
                <p className="text-body-lg text-base/70 mt-4">{service.description}</p>

                <ul className="mt-6 border-y border-dashed border-base/15 divide-y divide-dashed divide-base/15">
                  {service.items.map((item) => (
                    <li key={item.title} className="flex items-center gap-3 py-3 text-body text-base/80">
                      <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {item.title}
                    </li>
                  ))}
                </ul>

                <RouterLink
                  to="/start"
                  className="mt-8 inline-flex items-center justify-center h-[44px] px-5 rounded-sm bg-accent text-navy text-[15px] font-medium transition-colors duration-150 hover:bg-accent/85"
                >
                  Start your project
                </RouterLink>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </SectionShell>
    </div>
  );
};

// --- Below lg / reduced motion: a plain stack of cards ----------------------------
const ServiceList = () => (
  <SectionShell
    id="services"
    theme="navy"
    aria-labelledby="services-heading"
  >
    <SectionHeader theme="navy" title="What I can build for you" id="services-heading" />
    <div className="flex flex-col gap-4">
      {servicesData.map((service, i) => (
        <article key={service.title} className="rounded-lg border border-base/10 p-6">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-accent text-navy text-small font-medium">
            {pad(i)}
          </span>
          <h3 className="text-h3 text-base mt-4">{service.title}</h3>
          <p className="text-body text-base/70 mt-2">{service.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {service.items.map((item) => (
              <li key={item.title} className="rounded-full border border-base/15 px-3 py-1 text-small text-base/70">
                {item.title}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </SectionShell>
);

const Services = () => {
  const isLg = useMediaQuery({ minWidth: 1024 });
  const reduceMotion = useReducedMotion();
  return isLg && !reduceMotion ? <PinnedServices /> : <ServiceList />;
};

export default Services;

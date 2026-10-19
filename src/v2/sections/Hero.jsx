import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";


const OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";
import { useLenis } from "lenis/react";
import OrbButton from "../components/OrbButton";
import WorkLens from "../components/WorkLens";
import GlassIcon from "../components/GlassIcon";
import ScanLens from "../components/ScanLens";
import { TextPath } from "../../components/ui/text-path";

const CONTACT = [
  { label: "riadh5726@gmail.com", short: "Email", href: "mailto:riadh5726@gmail.com" },
  { label: "WhatsApp +213 555 71 10 88", short: "WhatsApp", href: "https://wa.me/213555711088" },
];

// The glass sheet: frosted, a bright top edge, a soft ink floor so the bottom
// row and the lens captions stay readable over the light of the background.
const SHEET = {
  background:
    "radial-gradient(ellipse 60% 55% at 100% 100%, rgba(7,10,22,0.45), transparent), linear-gradient(to top, rgba(7,10,22,0.4), rgba(7,10,22,0) 40%), linear-gradient(135deg, rgba(242,245,251,0.10), rgba(242,245,251,0.03))",
  WebkitBackdropFilter: "blur(28px) saturate(140%)",
  backdropFilter: "blur(28px) saturate(140%)",
  border: "1px solid rgba(242,245,251,0.22)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 40px 120px rgba(7,10,22,0.35)",
};

/**
 * Hero: one big glass sheet floating over the moving background. Left: who
 * and what in large Swiss type, one sentence, one action. Right: real shipped
 * sites in a glass browser (WorkLens). Bottom left (clear of the chatbot): how
 * to reach me.
 *
 * Motion: see the entrance below. Reduced motion: everything simply shows.
 */
function Hero() {
  const lenis = useLenis();
  const rootRef = useRef(null);

  // Entrance (GSAP), "vision" coming into focus: the hello line wipes in as the
  // logo turns into place; the headline's lines come into focus one after the other
  // (blur to sharp); the line under it rises; the CTA's glass orb rolls in from
  // the far end to its rest; the browser is revealed from the bottom; the
  // contact row follows. Strong ease-out, no layout properties animated.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const root = rootRef.current;
    const ctx = gsap.context(() => {
      const orb = root.querySelector("[data-cta] [data-orb]");
      const cta = root.querySelector("[data-cta] a");
      const roll = cta && orb ? cta.offsetWidth - orb.offsetWidth : 0;

      gsap
        .timeline({ defaults: { ease: OUT } })
        .from("[data-sheet]", { autoAlpha: 0, duration: 0.6, ease: "power1.out" })
        .fromTo("[data-hello]", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: IN_OUT, clearProps: "clipPath" }, 0.15)
        .from("[data-hello-logo]", { rotate: -120, scale: 0.8, autoAlpha: 0, duration: 0.9 }, 0.15)
        .from("[data-headline] [data-line]", { autoAlpha: 0, filter: "blur(12px)", yPercent: 25, duration: 0.8, stagger: 0.12, clearProps: "filter" }, 0.35)
        .from("[data-sub]", { autoAlpha: 0, y: 16, duration: 0.7 }, 0.85)
        .from("[data-cta]", { autoAlpha: 0, duration: 0.4 }, 1)
        .from(orb, { x: roll, rotate: 360, duration: 0.9, ease: IN_OUT, clearProps: "transform" }, 1)
        .from("[data-cta] [data-orb-label]", { autoAlpha: 0, x: -10, duration: 0.5 }, 1.45)
        .fromTo(
          "[data-lens]",
          { clipPath: "inset(100% 0% 0% 0% round 22px)", y: 24 },
          { clipPath: "inset(0% 0% 0% 0% round 22px)", y: 0, duration: 1, ease: IN_OUT, clearProps: "clipPath,transform" },
          0.55
        )
        .from("[data-contact]", { autoAlpha: 0, y: 12, duration: 0.6 }, 1.3)
    }, root);
    return () => {
      ctx.revert();
    };
  }, []);

  function scrollToWork(event) {
    event.preventDefault();
    if (lenis) lenis.scrollTo("#work");
    else document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section ref={rootRef} id="hero" data-tone="dark" className="relative px-3 pt-3 md:px-4 md:pt-4">
      <div
        data-sheet
        className="relative z-10 overflow-hidden rounded-[32px] min-h-[calc(100svh-24px)] md:min-h-[max(680px,calc(100svh-32px))] px-5 pt-24 pb-6 md:px-14 md:pt-32 md:pb-10 flex flex-col origin-top"
        style={SHEET}
      >
        {/* A light sheen sweeps across the sheet every few seconds. */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="hero-sheen absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-snow/10 to-transparent" />
        </div>
        <div className="relative flex-1 grid grid-cols-1 gap-10 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,30vw)] lg:gap-16 lg:items-center">
          <div>
            {/* A short hello before the headline, the logo set in the line like a
                letter. Phones: a compact glass chip. */}
            <p
              data-hello
              className="mb-6 text-snow max-md:inline-flex max-md:items-center max-md:rounded-pill max-md:border max-md:border-snow/20 max-md:bg-snow/8 max-md:py-1 max-md:pl-1.5 max-md:pr-4 max-md:text-small md:text-body-lg"
            >
              <span data-hello-logo aria-hidden className="relative inline-block align-middle w-7 h-7 md:w-8 md:h-8 mr-2 md:-mt-1">
                <GlassIcon name="logo" size={72} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[52px] h-[52px] md:w-[60px] md:h-[60px] max-w-none" />
              </span>
              Hi, I’m Riadh.<span className="hidden md:inline text-ice"> I design and build for the web.</span>
            </p>
            <h1
              data-headline
              className="text-snow font-light leading-[0.88] md:leading-[0.9] tracking-[-0.05em] text-[clamp(3.4rem,15.5vw,5rem)] md:text-[clamp(3.5rem,8.4vw,9.5rem)]"
            >
              <ScanLens lines={["Where ideas", "take shape."]} />
            </h1>

            <p data-sub className="mt-6 md:mt-8 max-w-[36ch] text-snow text-[clamp(1.125rem,1.5vw,1.375rem)] leading-[1.5]">
              Full-stack developer in Algeria. Fast, clear websites and web apps, from the first sketch to launch.
            </p>

            <div data-cta className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-4 sm:gap-x-8 gap-y-4">
              <OrbButton to="/start" icon="arrow">
                Start a project
              </OrbButton>
              {/* Phones: a round glass "see the work" button beside the CTA. */}
              <a
                href="#work"
                onClick={scrollToWork}
                aria-label="See the work"
                className="sm:hidden grid place-items-center w-14 h-14 rounded-full border border-snow/25 bg-snow/10 text-snow transition-transform duration-150 active:scale-95"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M8 2v12M3 9l5 5 5-5" />
                </svg>
              </a>
              {/* "See the work" as a slowly turning ring of text around an arrow (from sm up). */}
              <a href="#work" onClick={scrollToWork} aria-label="See the work" className="group relative hidden sm:grid place-items-center w-[150px] h-[150px] text-snow">
                <span aria-hidden className="absolute inset-0">
                  <TextPath curve="circle" text="See the work · Selected projects" separator="  ·  " repeats={1} fontSize={16} fontWeight={500} letterSpacing={0.08} duration={18} className="w-full h-full" />
                </span>
                <span className="relative grid place-items-center w-12 h-12 rounded-full bg-snow/10 border border-snow/25 transition-[transform,background-color] duration-200 ease-out group-hover:scale-110 group-hover:bg-snow/20">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M8 2v12M3 9l5 5 5-5" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          <div data-lens>
            <WorkLens />
          </div>
        </div>

        {/* Contact. Phones: two glass pills and a line under them. */}
        <div data-contact className="relative mt-10 md:mt-14 flex flex-wrap items-center gap-2 md:gap-8 text-small text-ice">
          <ul className="contents">
            {CONTACT.map(function renderContact(item) {
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="hover:text-snow transition-colors max-md:inline-flex max-md:rounded-pill max-md:border max-md:border-snow/20 max-md:bg-snow/8 max-md:px-4 max-md:py-2 max-md:text-snow max-md:active:scale-95"
                    {...(item.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    <span className="md:hidden">{item.short}</span>
                    <span className="hidden md:inline">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="max-md:basis-full max-md:mt-2">Based in Algeria. Working worldwide.</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;

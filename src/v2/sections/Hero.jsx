import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";


const OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
import { useLenis } from "lenis/react";
import OrbButton from "../components/OrbButton";
import { Folder } from "../../components/ui/folder";
import { EXTERNAL, START, siteOf } from "../components/links";
import { cover } from "../components/projectArt";
import { projects } from "../components/shownProjects";
import ScanLens from "../components/ScanLens";
import { TextPath } from "../../components/ui/text-path";

// The three projects in the hero folder.
const FOLDER = ["yashome", "batioil", "hydrame"]
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter(Boolean)
  .map((p) => ({ key: p.slug, title: p.name.split(" — ")[0], image: cover(p), href: siteOf(p) }));


// The glass sheet (tinted, no live backdrop blur: the background behind is
// already soft, and blurring it every scroll frame was the heaviest cost): a bright top edge, a soft ink floor so the bottom
// row and the lens captions stay readable over the light of the background.
const SHEET = {
  background:
    "radial-gradient(ellipse 60% 55% at 100% 100%, rgba(7,10,22,0.45), transparent), linear-gradient(to top, rgba(7,10,22,0.4), rgba(7,10,22,0) 40%), linear-gradient(135deg, rgba(242,245,251,0.12), rgba(242,245,251,0.04)), rgba(36,72,201,0.12)",
  border: "1px solid rgba(242,245,251,0.22)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 40px 120px rgba(7,10,22,0.35)",
};

/**
 * Hero: one big glass sheet floating over the moving background. Left: who
 * and what in large Swiss type, one sentence, one action. Right: real shipped
 * work as a glass folder whose project pages fan out (Folder). Bottom left (clear of the chatbot): how
 * to reach me.
 *
 * Motion: see the entrance below. Reduced motion: everything simply shows.
 */
function Hero() {
  const lenis = useLenis();
  // Desktop opens the folder after the entrance; phones open it on scroll.
  const wide = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
  const rootRef = useRef(null);

  // Entrance (GSAP), one language for every part on desktop and phones: the
  // sheet fades in, then each block rises 24px and fades in, in reading order,
  // 0.1s apart, with the same duration and ease. The headline types itself in
  // (ScanLens) alongside. Transform and opacity only.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const root = rootRef.current;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: OUT, duration: 0.8 } })
        .from("[data-sheet]", { autoAlpha: 0, duration: 0.6, ease: "power1.out" })
        .from(
          ["[data-hello]", "[data-sub]", "[data-cta]", "[data-contact]", "[data-lens]"],
          { autoAlpha: 0, y: 24, stagger: 0.1, clearProps: "transform" },
          0.2
        );
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
        className="relative z-10 overflow-hidden rounded-[32px] md:min-h-[max(680px,calc(100svh-32px))] px-5 pt-24 pb-6 md:px-14 md:pt-32 md:pb-10 flex flex-col origin-top"
        style={SHEET}
      >
        {/* A light sheen sweeps across the sheet every few seconds. */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="hero-sheen absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-snow/10 to-transparent" />
        </div>
        <div className="relative max-lg:contents flex-1 grid grid-cols-1 gap-10 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,30vw)] lg:gap-16 lg:items-center">
          <div>
            {/* A short hello before the headline, the logo set in the line like a
                letter. Phones: a compact glass chip. */}
            <p
              data-hello
              className="mb-6 text-snow max-md:inline-flex max-md:items-center max-md:rounded-pill max-md:border max-md:border-snow/20 max-md:bg-snow/8 max-md:py-1.5 max-md:px-4 max-md:text-small md:text-body-lg"
            >
              Hi, I’m Riadh.<span className="hidden md:inline text-ice"> I design and build for the web.</span>
            </p>
            <h1
              data-headline
              className="text-snow font-medium md:font-light leading-[0.88] md:leading-[0.9] tracking-[-0.05em] text-[clamp(3.4rem,15.5vw,5rem)] md:text-[clamp(3.5rem,8.4vw,9.5rem)]"
            >
              <ScanLens lines={["Where ideas", "take shape."]} typeDelay={0.35} />
            </h1>

            <p data-sub className="mt-6 md:mt-8 max-w-[36ch] text-snow text-[clamp(1.125rem,1.5vw,1.375rem)] leading-[1.5]">
              Full-stack developer in Algeria. Fast, clear websites and web apps, from the first sketch to launch.
            </p>

            <div data-cta className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-4 sm:gap-x-8 gap-y-4">
              <span className="md:hidden">
                <OrbButton href={START} {...EXTERNAL} icon="arrow" size="sm">
                  Start a project
                </OrbButton>
              </span>
              <span className="hidden md:inline-flex">
                <OrbButton href={START} {...EXTERNAL} icon="arrow">
                  Start a project
                </OrbButton>
              </span>
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

          {/* Phones: after the contact row, peeking into the first screen and
              opening as soon as it does, so the fanning projects invite the scroll. */}
          <div data-lens className="max-lg:order-2 max-lg:mt-4">
            {/* Selected work in a glass folder: the projects fan out of it. */}
            <Folder items={FOLDER} label="Selected work" defaultOpen={wide} openOnView={!wide} openDelay={2300} viewThreshold={0.25} className="lg:mt-16 lg:scale-[1.2] origin-bottom max-lg:scale-[0.86] max-lg:origin-top max-lg:-mb-16" />
          </div>
        </div>

        {/* Contact. Phones: two glass pills and a line under them. */}
        <div data-contact className="max-lg:order-1 relative mt-10 md:mt-14 text-small text-ice">
          <p>Based in Algeria. Working worldwide.</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;

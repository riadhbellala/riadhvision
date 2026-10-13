import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { useNavigate } from "react-router-dom";
import { useLenis } from "lenis/react";
import { Icon } from "@iconify/react/dist/iconify.js";
// eslint-disable-next-line no-unused-vars
import { motion, animate, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { GROOVE_WIDTH as GROOVE, groove, ARC_RADII, ARC_FADE_MASK } from "../lib/groove";
import TicketButton from "../components/TicketButton";

// --- Responsive geometry --------------------------------------------------------
// Arc apex positions and tile sizes per breakpoint, as CSS variables on the hero.
// Pure CSS, so it applies instantly with no resize listeners or layout flicker.
// md uses 11vw (not 9vw): on tall tablet viewports a 9vw arc pushes tiles
// partly off-screen at the edges of the visible band.
// The 1280–1599 tier is pulled in from 27vw to 21vw: at 1280–1440 a 27vw arc
// would run tiles into the headline; 27vw only clears it (24px+) from ~1600px.
const heroStyles = `
  .hero-geo {
    --arc-inner-x: 11vw;
    --arc-middle-x: 4vw;
    --arc-outer-x: -2vw;
    --tile-size: 52px;
    --tile-icon: 20px;
    --tile-radius: 11px;
  }
  @media (min-width: 1024px) {
    .hero-geo {
      --arc-inner-x: 17vw;
      --arc-middle-x: 9vw;
      --arc-outer-x: 2vw;
      --tile-size: 62px;
      --tile-icon: 24px;
      --tile-radius: 12px;
    }
  }
  @media (min-width: 1280px) {
    .hero-geo {
      --arc-inner-x: 21vw;
      --arc-middle-x: 13vw;
      --arc-outer-x: 4vw;
      --tile-size: 72px;
      --tile-icon: 28px;
      --tile-radius: 14px;
    }
  }
  @media (min-width: 1600px) {
    .hero-geo {
      --arc-inner-x: 27vw;
      --arc-middle-x: 17vw;
      --arc-outer-x: 6vw;
    }
  }
`;

// --- Arc system ---------------------------------------------------------------
// Each arc is a circle whose centre sits off-screen; `xVar` holds where its
// apex (rightmost point on the left side) lands in the viewport.
const arcs = [
  { id: "outer", radius: ARC_RADII.outer, xVar: "--arc-outer-x" },
  { id: "middle", radius: ARC_RADII.middle, xVar: "--arc-middle-x" },
  { id: "inner", radius: ARC_RADII.inner, xVar: "--arc-inner-x" },
];
const INNER = arcs[2];

const circleBox = ({ radius, xVar }, side) => ({
  width: `${radius * 2}vh`,
  height: `${radius * 2}vh`,
  top: `calc(50% - ${radius}vh)`,
  [side]: `calc(var(${xVar}) - ${radius * 2}vh)`,
});

export const Arc = ({ arc, side }) => (
  <div
    data-arc={arc.id}
    data-side={side}
    className="absolute rounded-full"
    style={{ ...circleBox(arc, side), border: `${GROOVE}px solid ${groove.light.band}` }}
  >
    {/* Inner and outer edges of the carved channel */}
    <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${groove.light.inner}` }} />
    <div className="absolute rounded-full" style={{ inset: -GROOVE, border: `1px solid ${groove.light.outer}` }} />
  </div>
);

// --- Tiles --------------------------------------------------------------------
// Conveyor loop on the inner arc: every tile travels -40° → +40° linearly in
// LOOP_DURATION seconds. All tiles read one shared clock, offset by 1/4 of the
// loop each, so they stay exactly 20° apart and never bunch. Rotating the
// wrapper clockwise moves the left apex down and the right apex up, giving the
// counter-flow. The wrap from +40° to -40° happens off-screen / under the mask.
const LOOP_DURATION = 32;
const ANGLE_FROM = -40;
const ANGLE_TO = 40;

const tileIcons = {
  left: ["simple-icons:figma", "simple-icons:threedotjs", "simple-icons:nodedotjs", "simple-icons:react"],
  right: ["simple-icons:tailwindcss", "simple-icons:supabase", "simple-icons:nextdotjs", "simple-icons:mongodb"],
};
const TILT = { left: -8, right: 8 };

const ArcTile = ({ icon, side, index, count, progress }) => {
  const rotate = useTransform(progress, (p) => {
    const phase = (p + index / count) % 1;
    return ANGLE_FROM + (ANGLE_TO - ANGLE_FROM) * phase;
  });
  // Counter-rotate so the tile keeps a fixed tilt instead of spinning.
  const counter = useTransform(rotate, (r) => TILT[side] - r);
  const onLeft = side === "left";

  return (
    // Same box as the inner arc, so rotating it slides the tile along the groove.
    <motion.div className="absolute" style={{ ...circleBox(INNER, side), rotate }}>
      <div
        className="absolute top-1/2"
        style={{
          [onLeft ? "right" : "left"]: GROOVE / 2,
          transform: `translate(${onLeft ? "50%" : "-50%"}, -50%)`,
        }}
      >
        <motion.div
          className="w-[var(--tile-size)] h-[var(--tile-size)] rounded-[var(--tile-radius)] bg-base border border-navy/10 shadow-md flex items-center justify-center"
          style={{ rotate: counter }}
        >
          <Icon
            icon={icon}
            width="1em"
            height="1em"
            className="text-navy/25"
            style={{
              fontSize: "var(--tile-icon)",
              filter: "drop-shadow(0 1px 0 rgba(244,248,251,0.9)) drop-shadow(0 -1px 0 rgba(0,49,82,0.12))",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Proof row ----------------------------------------------------------------
const techStack = [
  { name: "React", icon: "simple-icons:react" },
  { name: "Next.js", icon: "simple-icons:nextdotjs" },
  { name: "Three.js", icon: "simple-icons:threedotjs" },
  { name: "Node.js", icon: "simple-icons:nodedotjs" },
  { name: "Supabase", icon: "simple-icons:supabase" },
  { name: "Figma", icon: "simple-icons:figma" },
];

const TechLogo = ({ tech }) => (
  <Icon
    icon={tech.icon}
    width={22}
    height={22}
    role="img"
    aria-label={tech.name}
    className="shrink-0 text-navy/35 hover:text-navy/80 transition-colors duration-300"
  />
);

// --- Motion -------------------------------------------------------------------
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const arcMask = ARC_FADE_MASK;
const tileMask = "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)";

// Px value of a CSS length set in px or vw (the hero geometry variables).
const cssPx = (el, name) => {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v.endsWith("vw") ? (parseFloat(v) * window.innerWidth) / 100 : parseFloat(v);
};

const Hero = () => {
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const subtextRef = useRef(null);
  const proofRef = useRef(null);
  const headlineRef = useRef(null);
  const businessesRef = useRef(null);
  const [routeLayer, setRouteLayer] = useState(null);

  const handleViewWork = (e) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo("#work", { offset: -110 });
    else document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartProject = () => navigate("/start");

  // Anchors for the ticket's flight route (viewport coords): it ends 16px right
  // of "businesses" and must keep 16px clear of the subtext, the headline
  // letters and the right-hand tile track.
  const getRouteAnchors = () => {
    const hero = heroRef.current;
    if (!hero || !subtextRef.current || !headlineRef.current || !businessesRef.current) return null;
    const heroBox = hero.getBoundingClientRect();
    const tileSize = cssPx(hero, "--tile-size");
    // Tiles ride the inner arc; its apex is the track's innermost point.
    // Half-extent of a tile tilted 8°: size/2 × (cos 8° + sin 8°) ≈ 0.57 × size.
    const trackLeft = heroBox.right - cssPx(hero, "--arc-inner-x") + GROOVE / 2 - tileSize * 0.57;
    const word = businessesRef.current.getBoundingClientRect();
    const subtext = subtextRef.current.getBoundingClientRect();
    // The headline's actual letter boxes, line by line.
    const range = document.createRange();
    range.selectNodeContents(headlineRef.current);
    const letters = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
    return {
      end: { x: word.right + 16, y: word.top + word.height / 2 },
      subtext,
      avoid: [subtext, ...letters],
      maxRight: trackLeft - 16,
    };
  };

  // Shared conveyor clock (0 → 1). With reduced motion it stays put at a phase
  // where all four tiles per side sit inside the visible band.
  const progress = useMotionValue(0.125);

  useEffect(() => {
    if (reduceMotion) {
      progress.set(0.125);
      return;
    }
    const controls = animate(progress, [0, 1], {
      duration: LOOP_DURATION,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [reduceMotion, progress]);

  return (
    <section
      ref={heroRef}
      id="home"
      className="hero-geo relative block md:flex md:items-center md:justify-center md:min-h-screen bg-transparent overflow-hidden px-4 pt-32 pb-16 md:pt-48 md:pb-4"
    >
      <style>{heroStyles}</style>

      {/* Arcs (md and up) */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none hidden md:block"
        style={{ maskImage: arcMask, WebkitMaskImage: arcMask }}
      >
        {["left", "right"].map((side) =>
          arcs.map((arc) => <Arc key={`${side}-${arc.id}`} arc={arc} side={side} />)
        )}
      </div>

      {/* Tiles on the inner arc (md and up) */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none hidden md:block"
        style={{ maskImage: tileMask, WebkitMaskImage: tileMask }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {["left", "right"].map((side) =>
          tileIcons[side].map((icon, i) => (
            <ArcTile
              key={`${side}-${icon}`}
              icon={icon}
              side={side}
              index={i}
              count={tileIcons[side].length}
              progress={progress}
            />
          ))
        )}
      </motion.div>

      {/* Content (narrower between md and lg to keep clear of the tiles) */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-[640px] md:max-w-[540px] lg:max-w-[640px] mx-auto text-center"
      >
        <motion.div variants={fadeUp} className="mb-6">
          <span className="inline-block px-3 py-1.5 rounded-xs border border-dashed border-navy/20 text-eyebrow text-navy/70">
            Full-Stack Developer
          </span>
        </motion.div>

        <motion.h1
          ref={headlineRef}
          variants={fadeUp}
          className="mb-5 text-display text-navy text-balance"
        >
          I build digital products
          <br className="hidden sm:block" />{" "}
          that{" "}
          <span className="relative inline-block isolate">
            {/* Icy-blue highlighter behind the lower part of the word */}
            <motion.span
              aria-hidden
              className="absolute inset-x-0 bottom-[0.08em] h-[45%] -mx-1 px-1 -z-10 rounded-xs bg-accent origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            grow
          </span>{" "}
          <span ref={businessesRef}>businesses</span>
        </motion.h1>

        <motion.p
          ref={subtextRef}
          variants={fadeUp}
          className="mb-8 mx-auto max-w-[600px] text-body-lg text-navy/70 text-pretty"
        >
          From strategy and design to full-stack development, I turn ideas into fast, beautiful,
          conversion-focused web experiences.
        </motion.p>

        {/* CTA: the boarding-pass ticket, centred; "View my work" is a quiet link
            to its left on lg+ (the right side is where the flight route flies). */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-8"
        >
          <a
            href="#work"
            onClick={handleViewWork}
            className="order-2 lg:order-none lg:justify-self-end whitespace-nowrap text-small text-navy/70 hover:text-navy hover:underline underline-offset-4 transition-colors duration-150"
          >
            View my work
          </a>
          <TicketButton
            className="order-1 lg:order-none"
            onClick={handleStartProject}
            getRouteAnchors={getRouteAnchors}
            routeLayer={routeLayer}
          />
          <span aria-hidden className="hidden lg:block" />
        </motion.div>

        {/* Proof row: inset at md/lg so its dashed lines stay clear of the tiles,
            720px wide (breaking out of the 640px column) from xl up */}
        <motion.div ref={proofRef} variants={fadeUp} className="mt-12 md:mt-24 md:mx-5 lg:mx-8 xl:-mx-10">
          <div className="flex items-center gap-4">
            <span className="flex-1 border-t border-dashed border-navy/15" />
            <span className="text-eyebrow text-navy/70 whitespace-nowrap">
              Technologies I work with
            </span>
            <span className="flex-1 border-t border-dashed border-navy/15" />
          </div>

          {/* Below sm: scrolling row */}
          <div className="mt-11 sm:hidden -mx-4">
            <Marquee speed={30} gradient={false} autoFill play={!reduceMotion}>
              {techStack.map((tech) => (
                <span key={tech.name} className="mx-5 flex">
                  <TechLogo tech={tech} />
                </span>
              ))}
            </Marquee>
          </div>

          {/* sm and up: single static row */}
          <div className="mt-11 hidden sm:flex flex-nowrap items-center justify-center gap-10">
            {techStack.map((tech) => (
              <TechLogo key={tech.name} tech={tech} />
            ))}
          </div>
        </motion.div>

        {/* Flight-route layer: TicketButton draws its route + plane here so the
            route can run from the ticket up to the headline. */}
        <div ref={setRouteLayer} aria-hidden className="absolute inset-0 z-20 pointer-events-none hidden lg:block" />
      </motion.div>
    </section>
  );
};

export default Hero;

import { useEffect } from "react";
import Marquee from "react-fast-marquee";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Icon } from "@iconify/react/dist/iconify.js";
// eslint-disable-next-line no-unused-vars
import { motion, animate, useMotionValue, useTransform, useReducedMotion } from "framer-motion";

// --- Responsive geometry --------------------------------------------------------
// Arc apex positions and tile sizes per breakpoint, as CSS variables on the hero.
// Pure CSS, so it applies instantly with no resize listeners or layout flicker.
// md uses 11vw (not 9vw): on tall tablet viewports a 9vw arc pushes tiles
// partly off-screen at the edges of the visible band.
// The 1280–1599 tier is pulled in from 27vw to 22vw: at 1280–1440 a 27vw arc
// would run tiles into the headline; 27vw only clears it (24px+) from ~1600px.
const heroStyles = `
  .hero-geo {
    --arc-inner-x: 11vw;
    --arc-middle-x: 4vw;
    --arc-outer-x: -2vw;
    --tile-size: 52px;
    --tile-icon: 20px;
    --tile-radius: 11px;
    --hero-h1-max: 3.9rem;
  }
  @media (min-width: 768px) and (max-width: 1023.98px) {
    .hero-geo { --hero-h1-max: 3.25rem; }
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
      --arc-inner-x: 22vw;
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
  { id: "outer", radius: 125, xVar: "--arc-outer-x" },
  { id: "middle", radius: 115, xVar: "--arc-middle-x" },
  { id: "inner", radius: 105, xVar: "--arc-inner-x" },
];
const INNER = arcs[2];
const GROOVE = 10;

const circleBox = ({ radius, xVar }, side) => ({
  width: `${radius * 2}vh`,
  height: `${radius * 2}vh`,
  top: `calc(50% - ${radius}vh)`,
  [side]: `calc(var(${xVar}) - ${radius * 2}vh)`,
});

const Arc = ({ arc, side }) => (
  <div
    className="absolute rounded-full"
    style={{
      ...circleBox(arc, side),
      border: `${GROOVE}px solid rgba(255,255,255,0.02)`,
    }}
  >
    {/* Inner and outer edges of the carved channel (tuned for the flat #050505 background) */}
    <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
    <div
      className="absolute rounded-full border border-white/[0.028]"
      style={{ inset: -GROOVE }}
    />
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
          className="w-[var(--tile-size)] h-[var(--tile-size)] rounded-[var(--tile-radius)] bg-[#111111] border border-white/[0.06] flex items-center justify-center"
          style={{
            rotate: counter,
            boxShadow: "0 18px 36px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <Icon
            icon={icon}
            width="1em"
            height="1em"
            style={{
              fontSize: "var(--tile-icon)",
              color: "rgba(255,255,255,0.16)",
              filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.07)) drop-shadow(0 -1px 0 rgba(0,0,0,0.9))",
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
    className="shrink-0 text-white/35 hover:text-white/70 transition-colors duration-300"
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
const drawIn = {
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { duration: 0.8, delay: 0.8, ease: "easeInOut" },
};

const arcMask = "linear-gradient(transparent, black 15%, black 85%, transparent)";
const tileMask = "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)";

const Hero = () => {
  const reduceMotion = useReducedMotion();

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
      id="home"
      className="hero-geo relative block md:flex md:items-center md:justify-center md:min-h-screen bg-transparent text-white overflow-hidden px-4 pt-32 pb-16 md:pt-48 md:pb-4"
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
          <span className="inline-block px-3 py-1.5 rounded-[4px] border border-dashed border-white/15 text-[11px] uppercase tracking-[0.2em] text-white/55">
            Full-Stack Developer
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mb-5 font-amiamie text-white text-balance"
          style={{
            fontSize: "clamp(2.25rem, 5vw, var(--hero-h1-max))",
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            fontWeight: 500,
          }}
        >
          I build digital products
          <br className="hidden sm:block" />{" "}
          that <span className="text-[#a1ebd4]">grow</span> businesses
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mb-8 mx-auto max-w-[500px] text-[16px] leading-[1.5] text-white/50 text-pretty"
        >
          From strategy and design to full-stack development, I turn ideas into fast, beautiful,
          conversion-focused web experiences.
        </motion.p>

        <motion.div variants={fadeUp} className="flex items-start sm:items-center justify-center gap-3">
          <div className="relative flex flex-col items-center">
            <RouterLink
              to="/start"
              className="inline-flex items-center justify-center h-[44px] px-5 rounded-[8px] bg-[#a1ebd4] text-black text-[15px] font-medium transition-colors duration-200 hover:bg-[#8fdcc4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a1ebd4] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Start a project
            </RouterLink>

            {/* Annotation, sm+: below-left of the button, arrow pointing up-right at its left edge */}
            <div className="absolute top-[60%] right-[calc(100%+6px)] hidden sm:flex flex-col items-end gap-0.5 pointer-events-none select-none">
              <svg viewBox="0 0 34 30" fill="none" aria-hidden className="shrink-0 w-[34px] h-[30px] mr-2">
                <motion.path
                  d="M4 28 C 6 17, 15 7, 31 3 M25 1 L31 3 L27 8"
                  stroke="rgba(161,235,212,0.6)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...drawIn}
                />
              </svg>
              <span className="font-caveat text-[17px] leading-none text-[#a1ebd4]/75 whitespace-nowrap">
                Free consultation
              </span>
            </div>

            {/* Annotation, below sm: centred under the button, arrowhead pointing straight up at it */}
            <div className="sm:hidden mt-3 flex flex-col items-center gap-0.5 pointer-events-none select-none">
              <svg viewBox="0 0 28 24" fill="none" aria-hidden className="w-[28px] h-[24px]">
                <motion.path
                  d="M7 22 C 6 15, 14 13, 14 3 M10 7 L14 3 L18 7"
                  stroke="rgba(161,235,212,0.6)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...drawIn}
                />
              </svg>
              <span className="font-caveat text-[16px] leading-none text-[#a1ebd4]/75 whitespace-nowrap">
                Free consultation
              </span>
            </div>
          </div>

          <ScrollLink
            to="work"
            smooth
            duration={1000}
            href="#work"
            className="cursor-pointer inline-flex items-center justify-center h-[44px] px-5 rounded-[8px] bg-white text-black text-[15px] font-medium transition-colors duration-200 hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a1ebd4] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            View my work
          </ScrollLink>
        </motion.div>

        {/* Proof row: inset at md/lg so its dashed lines stay clear of the tiles,
            720px wide (breaking out of the 640px column) from xl up */}
        <motion.div variants={fadeUp} className="mt-12 md:mt-24 md:mx-5 lg:mx-8 xl:-mx-10">
          <div className="flex items-center gap-4">
            <span className="flex-1 border-t border-dashed border-white/15" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">
              Technologies I work with
            </span>
            <span className="flex-1 border-t border-dashed border-white/15" />
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
      </motion.div>
    </section>
  );
};

export default Hero;

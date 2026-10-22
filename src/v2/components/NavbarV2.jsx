import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import GlassIcon from "./GlassIcon";
import OrbButton from "./OrbButton";
import { EXTERNAL, START, siteOf } from "./links";
import { cover, hasArtwork } from "./projectArt";
import { servicesData } from "../../constants";
import { projects } from "./shownProjects";

const EASE = [0.23, 1, 0.32, 1];

// Local time in Algeria, for the bar.
const TIME = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Algiers", hour: "2-digit", minute: "2-digit" });

const WORK = projects.filter(hasArtwork).slice(0, 4);

// What each menu shows when hovered (Apple-style): a large first column of
// main links, then smaller columns.
const MENUS = [
  {
    label: "About",
    target: "#manifesto",
    columns: [
      { title: "About", big: true, links: [{ label: "Who I am", target: "#manifesto" }, { label: "From rough to refined", target: "#before-after" }] },
      { title: "What I care about", links: [{ label: "Clarity" }, { label: "Performance" }, { label: "Intelligence" }] },
    ],
  },
  {
    label: "Work",
    target: "#work",
    work: true,
    columns: [{ title: "Work", big: true, links: [{ label: "Selected work", target: "#work" }, { label: "In their words", target: "#testimonials" }] }],
  },
  {
    label: "Services",
    target: "#services",
    columns: [
      { title: "Services", big: true, links: servicesData.map((s) => ({ label: s.title, target: "#services" })) },
      { title: "Also", links: [{ label: "Describe your idea", target: "#focus-engine" }, { label: "Start a project", href: START }] },
    ],
  },
  {
    label: "Contact",
    target: "#contact",
    columns: [
      { title: "Contact", big: true, links: [{ label: "Start a project", href: START }, { label: "Write an email", href: "mailto:riadh5726@gmail.com" }] },
      {
        title: "Elsewhere",
        links: [
          { label: "WhatsApp", href: "https://wa.me/213555711088" },
          { label: "Instagram", href: "https://www.instagram.com/riadhvision/" },
          { label: "GitHub", href: "https://github.com/riadhbellala" },
        ],
      },
    ],
  },
];

/**
 * Main navigation. Over the hero it has no chrome and sits in the hero's
 * content line (logo, menus, local time, the rolling-lens CTA); past the hero
 * it becomes a floating rounded glass bar. Hovering a menu opens an
 * Apple-style panel that grows out of the bar with its links (large first
 * column, smaller columns; Work shows project artwork), while the page behind
 * dims and blurs. Moving to another
 * menu swaps the content in place; leaving closes it after a short grace.
 * Phones get a menu button that opens the same links full screen.
 */
function NavbarV2() {
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [time, setTime] = useState(() => TIME.format(new Date()));
  const closeTimer = useRef(0);
  const [past, setPast] = useState(false);

  // Over the hero the bar has no chrome and sits in the hero's content line;
  // past the hero it becomes a floating glass bar.
  useEffect(function trackHero() {
    function update() {
      const hero = document.getElementById("hero");
      // Phones: the hero is taller than the screen, so switch almost at once.
      const limit = window.innerWidth < 768 ? 40 : hero ? hero.offsetHeight - 120 : 200;
      setPast(window.scrollY > limit);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(function tickClock() {
    const id = setInterval(() => setTime(TIME.format(new Date())), 20000);
    return () => clearInterval(id);
  }, []);

  function show(label) {
    clearTimeout(closeTimer.current);
    setOpen(label);
  }

  function hide() {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  }

  function go(target) {
    setOpen(null);
    setMobile(false);
    if (lenis) lenis.scrollTo(target === "top" ? 0 : target);
    else if (target === "top") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }

  const menu = MENUS.find((m) => m.label === open);

  function renderLink(link, big) {
    const cls = big
      ? "block text-snow font-light tracking-[-0.03em] leading-tight text-[clamp(1.5rem,2.2vw,2rem)] hover:text-ice transition-colors duration-150"
      : "block text-small text-ice hover:text-snow transition-colors duration-150";
    if (link.href)
      return (
        <a href={link.href} className={cls} {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
          {link.label}
        </a>
      );
    if (link.target)
      return (
        <a
          href={link.target}
          className={cls}
          onClick={(e) => {
            e.preventDefault();
            go(link.target);
          }}
        >
          {link.label}
        </a>
      );
    return <span className={cls.replace(/hover:\S+/g, "")}>{link.label}</span>;
  }

  return (
    <>
      {/* The page dims and blurs behind an open menu. */}
      <AnimatePresence>
        {(open || mobile) && (
          <motion.div
            aria-hidden
            className="fixed inset-0 z-[55] bg-ink/45 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobile(false)}
          />
        )}
      </AnimatePresence>

      <header
        onMouseLeave={hide}
        className={`fixed left-1/2 -translate-x-1/2 z-[60] transition-[top,width] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          past ? "top-3 w-[min(1200px,calc(100%-24px))]" : "top-5 md:top-7 w-[calc(100%-56px)] md:w-[calc(100%-144px)]"
        }`}
      >
        <div
          className={`overflow-hidden rounded-[22px] border transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ${
            past || open || mobile
              ? "bg-ink/60 backdrop-blur-xl backdrop-saturate-150 border-snow/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_20px_60px_rgba(7,10,22,0.35)]"
              : "bg-transparent border-transparent"
          }`}
        >
          <nav
            aria-label="Main"
            className={`h-14 flex items-center justify-between gap-6 transition-[padding] duration-500 ${past || open || mobile ? "px-4 md:px-5" : "px-0"}`}
          >
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                go("top");
              }}
              onMouseEnter={hide}
              className="flex items-center text-body font-medium tracking-[-0.02em] text-snow whitespace-nowrap"
            >
              <span aria-hidden className="relative inline-block w-7 h-7 mr-1.5 shrink-0">
                <GlassIcon name="logo" size={64} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[52px] h-[52px] max-w-none" />
              </span>
              RiadhVision
            </a>

            <ul className="hidden md:flex items-center gap-1 h-full">
              {MENUS.map(function renderMenu(m) {
                const on = open === m.label;
                return (
                  <li key={m.label} className="h-full flex items-center" onMouseEnter={() => show(m.label)}>
                    <a
                      href={m.target}
                      aria-expanded={on}
                      onClick={(e) => {
                        e.preventDefault();
                        go(m.target);
                      }}
                      onFocus={() => show(m.label)}
                      className={`px-4 py-2 rounded-pill text-small transition-colors duration-150 ${on ? "text-snow bg-snow/10" : "text-snow/80 hover:text-snow"}`}
                    >
                      {m.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-4" onMouseEnter={hide}>
              <p className="hidden xl:block whitespace-nowrap text-small tabular-nums text-ice">Algeria {time}</p>
              <span className="hidden sm:inline-flex">
                <OrbButton href={START} {...EXTERNAL} size="sm" className="mr-1">
                  Start a project
                </OrbButton>
              </span>
              <button
                type="button"
                aria-label={mobile ? "Close menu" : "Open menu"}
                aria-expanded={mobile}
                onClick={() => setMobile((v) => !v)}
                className="md:hidden grid place-items-center w-10 h-10 rounded-full border border-snow/20 text-snow"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  {mobile ? <path d="M4 4l10 10M14 4 4 14" /> : <path d="M2 6h14M2 12h14" />}
                </svg>
              </button>
            </div>
          </nav>

          {/* Desktop mega panel: grows out of the bar, content swaps in place. */}
          <AnimatePresence initial={false}>
            {menu && (
              <motion.div
                key="panel"
                className="hidden md:block overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: reduce ? 0 : 0.32, ease: EASE }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={menu.label}
                    className="px-5 pt-6 pb-8 flex gap-16 border-t border-snow/10"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: EASE }}
                  >
                    {menu.columns.map(function renderColumn(col, ci) {
                      return (
                        <div key={col.title} className={ci === 0 ? "min-w-[260px]" : ""}>
                          <p className="text-small text-ice/70 mb-4">{col.title}</p>
                          <ul className={`flex flex-col ${col.big ? "gap-2" : "gap-2.5"}`}>
                            {col.links.map(function renderItem(link, li) {
                              return (
                                <motion.li
                                  key={link.label}
                                  initial={reduce ? false : { opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.25, ease: EASE, delay: 0.03 * li + 0.04 * ci }}
                                >
                                  {renderLink(link, col.big)}
                                </motion.li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                    {menu.work && (
                      <ul className="flex-1 grid grid-cols-4 gap-4">
                        {WORK.map(function renderWork(p, i) {
                          return (
                            <motion.li
                              key={p.slug}
                              initial={reduce ? false : { opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, ease: EASE, delay: 0.04 * i }}
                            >
                              <a href={siteOf(p) || "#work"} {...(siteOf(p) ? EXTERNAL : {})} onClick={() => setOpen(null)} className="group block">
                                <span className="block aspect-[4/5] overflow-hidden rounded-[14px] border border-snow/15">
                                  <img src={cover(p)} alt="" loading="lazy" className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.05]" />
                                </span>
                                <span className="block mt-2 text-small text-snow">{p.name.split(" — ")[0]}</span>
                              </a>
                            </motion.li>
                          );
                        })}
                      </ul>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phones: the same links, full height. */}
          <AnimatePresence>
            {mobile && (
              <motion.div
                className="md:hidden overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
              >
                <ul className="px-4 pt-2 pb-6 flex flex-col gap-1 border-t border-snow/10">
                  {MENUS.map(function renderMobile(m) {
                    return (
                      <li key={m.label}>
                        <a
                          href={m.target}
                          onClick={(e) => {
                            e.preventDefault();
                            go(m.target);
                          }}
                          className="block py-2 text-snow font-light tracking-[-0.03em] text-[2rem]"
                        >
                          {m.label}
                        </a>
                      </li>
                    );
                  })}
                  <li className="pt-4">
                    <OrbButton href={START} {...EXTERNAL} onClick={() => setMobile(false)}>
                      Start a project
                    </OrbButton>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}

export default NavbarV2;

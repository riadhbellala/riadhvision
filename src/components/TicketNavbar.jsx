import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useMediaQuery } from "react-responsive";
import GlassTicket from "./GlassTicket";
import { useTicketShape } from "../hooks/useTicketShape";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: "Projects", target: "#work" },
  { label: "About", target: "#about" },
  { label: "Services", target: "#services" },
  { label: "Contact", target: "#contact" },
];

const BAR_HEIGHT = 76;
const NAV_LINE = 20 + BAR_HEIGHT; // the navbar's bottom edge, px from the viewport top
const SCROLL_OFFSET = -110; // matches the sections' scroll-margin-top
const NOTCH = 7; // tuned to image 1: small notches relative to the bar height
const DOT = 10;
const LOGO_PAD_RIGHT = 48;
const LOGO_WEIGHT = 900; // closest to image 1 (Amiamie has no 600; 400 matched the links)
const MENU_ROW = 56;
const MENU_HEIGHT = LINKS.length * MENU_ROW + (LINKS.length - 1); // rows + 1px perforations

// Ticket colours as variables so the dark variant (over navy panels) is a swap
// with 300ms transitions. Pure white appears only as the 1px glass edge.
const styles = `
  .ticket-nav {
    --t-glass: rgba(244, 248, 251, 0.6);
    /* Icy stub: lighter on its left, bluer towards the pill end (image 1) */
    --t-stub: linear-gradient(90deg, rgba(173, 223, 241, 0.38), rgba(173, 223, 241, 0.66));
    --t-ink: var(--color-navy);
    --t-ink-soft: color-mix(in srgb, var(--color-navy) 70%, transparent);
    --t-perf: color-mix(in srgb, var(--color-navy) 25%, transparent);
    --t-edge: rgba(255, 255, 255, 0.95);
    --t-edge-dark: rgba(0, 49, 82, 0.10);
    --t-rim: rgba(255, 255, 255, 0.65);
    --t-shadow: rgba(0, 49, 82, 0.10);
    --t-hover: rgba(244, 248, 251, 0.6);
  }
  .ticket-nav[data-theme="dark"] {
    --t-glass: rgba(0, 49, 82, 0.55);
    --t-ink: var(--color-base);
    --t-ink-soft: color-mix(in srgb, var(--color-base) 70%, transparent);
    --t-perf: color-mix(in srgb, var(--color-base) 25%, transparent);
    --t-edge: rgba(244, 248, 251, 0.15);
    --t-edge-dark: transparent;
    --t-rim: rgba(244, 248, 251, 0.08);
    --t-shadow: rgba(0, 0, 0, 0.25);
    --t-hover: color-mix(in srgb, var(--color-base) 10%, transparent);
  }
  /* The stub keeps its accent tint and navy ink in both themes. */
  .ticket-nav .ticket-stub {
    --t-ink: var(--color-navy);
    --t-ink-soft: color-mix(in srgb, var(--color-navy) 70%, transparent);
    --t-perf: color-mix(in srgb, var(--color-navy) 25%, transparent);
  }
  .ticket-ink { color: var(--t-ink); transition: color 300ms; }
  .ticket-ink-soft { color: var(--t-ink-soft); transition: color 300ms; }
  .ticket-perf-v {
    width: 1px; flex: none; margin: 9px 0; /* starts just below the notch */
    background-image: linear-gradient(to bottom, var(--t-perf) 3px, transparent 3px);
    background-size: 1px 6px; background-repeat: repeat-y;
  }
  .ticket-perf-h {
    height: 1px; margin: 0 10px;
    background-image: linear-gradient(to right, var(--t-perf) 3px, transparent 3px);
    background-size: 6px 1px; background-repeat: repeat-x;
  }
  .ticket-seg { position: relative; outline: none; }
  .ticket-seg .ticket-hl { opacity: 0; transition: opacity 200ms ease; background: var(--t-hover); }
  .ticket-seg:hover .ticket-hl { opacity: 1; }
  .ticket-seg .ticket-lift { display: inline-block; transition: transform 200ms ease; }
  .ticket-seg:hover .ticket-lift { transform: translateY(-2px); }
  .ticket-seg:focus-visible::after {
    content: ""; position: absolute; inset: 8px 6px; border-radius: 16px;
    outline: 2px solid var(--t-ink);
  }
  @media (prefers-reduced-motion: reduce) {
    .ticket-seg .ticket-lift { transition: none; }
    .ticket-seg:hover .ticket-lift { transform: none; }
  }
`;

function mainRadius(width, height) {
  return { tl: height / 2, bl: height / 2, tr: 0, br: 0 };
}

function stubRadius(width, height) {
  return { tl: 0, bl: 0, tr: height / 2, br: height / 2 };
}

function menuRadius() {
  return 22;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      {/* Needle points NE, as in image 1 */}
      <g transform="rotate(45 12 12)">
        <path d="M12 3.5 14.6 12 12 20.5 9.4 12Z" />
        <path d="M12 3.5 14.6 12H9.4Z" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

function Compass({ iconRef }) {
  return (
    <span className="flex items-center justify-center w-[30px] h-[30px] rounded-full border-[1.5px] border-current shrink-0">
      <span ref={iconRef} className="flex">
        <CompassIcon />
      </span>
    </span>
  );
}

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" />
      ) : (
        <>
          <path d="M4 8h16" />
          <path d="M4 16h16" />
        </>
      )}
    </svg>
  );
}

function TicketNavbar() {
  const lenis = useLenis();
  const isMobile = useMediaQuery({ maxWidth: 899 });
  const isTiny = useMediaQuery({ maxWidth: 479 });
  const layoutKey = isMobile ? "mobile" : "desktop";

  const navRef = useRef(null);
  const barRef = useRef(null);
  const mainRef = useRef(null);
  const stubWrapRef = useRef(null);
  const stubRef = useRef(null);
  const compassRef = useRef(null);
  const dotRef = useRef(null);
  const perfRefs = useRef([]);
  const linkRefs = useRef({});
  const menuWrapRef = useRef(null);
  const menuRef = useRef(null);
  const menuPerfRefs = useRef([]);
  const menuButtonRef = useRef(null);

  const ctxRef = useRef(null);
  const stubTlRef = useRef(null);
  const dotTlRef = useRef(null);
  const menuTlRef = useRef(null);
  const activeRef = useRef(null);
  const enteredRef = useRef(false);

  const [active, setActive] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const mainShape = useTicketShape(mainRef, perfRefs, {
    radius: mainRadius,
    notchRadius: NOTCH,
    edgeNotches: { end: true },
    layoutKey,
  });
  const stubShape = useTicketShape(stubRef, null, {
    radius: stubRadius,
    notchRadius: NOTCH,
    edgeNotches: { start: true },
    layoutKey,
  });
  const menuShape = useTicketShape(menuRef, menuPerfRefs, {
    radius: menuRadius,
    notchRadius: NOTCH,
    axis: "y",
    layoutKey,
  });

  // --- Scrolling -----------------------------------------------------------------
  function scrollToTarget(target) {
    if (lenis) {
      lenis.scrollTo(target, { offset: SCROLL_OFFSET });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleLinkClick(event) {
    event.preventDefault();
    scrollToTarget(event.currentTarget.getAttribute("href"));
    closeMenu();
  }

  function handleLogoClick(event) {
    event.preventDefault();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
    closeMenu();
  }

  function handleTalkClick() {
    scrollToTarget("#contact");
    closeMenu();
  }

  // --- Stamp dot -------------------------------------------------------------------
  // Image 1: the dot sits above the first letter of the active label.
  function dotXFor(target) {
    const link = linkRefs.current[target];
    const labelEl = link?.querySelector("[data-ticket-text]");
    return link && labelEl ? link.offsetLeft + labelEl.offsetLeft : 0;
  }

  function moveDot(target, instant) {
    const dot = dotRef.current;
    if (!dot || !ctxRef.current) return;
    ctxRef.current.add(function animateDot() {
      dotTlRef.current?.kill();
      if (!target) {
        dotTlRef.current = gsap.to(dot, { opacity: 0, scale: 0.6, duration: 0.3, ease: "power2.out" });
        return;
      }
      const x = dotXFor(target);
      const hidden = Number(gsap.getProperty(dot, "opacity")) < 0.05;
      if (instant || hidden || prefersReducedMotion()) {
        // Appearing (or no motion): place it, then stamp it in.
        gsap.set(dot, { x, y: 0 });
        dotTlRef.current = gsap.to(dot, { opacity: 1, scale: 1, duration: instant ? 0 : 0.3, ease: "back.out(2)" });
        return;
      }
      // Travel along the ticket with a small hop, then press like a stamp.
      dotTlRef.current = gsap
        .timeline()
        .to(dot, { x, duration: 0.5, ease: "power2.out" }, 0)
        .to(dot, { y: -6, duration: 0.2, ease: "power2.out" }, 0)
        .to(dot, { y: 0, duration: 0.3, ease: "bounce.out" }, 0.2)
        .to(dot, { opacity: 1, scale: 1.3, duration: 0.12, ease: "power2.out" }, 0.38)
        .to(dot, { scale: 1, duration: 0.18, ease: "power2.inOut" }, 0.5);
    });
  }

  // --- Mobile menu -----------------------------------------------------------------
  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen(function flip(open) {
      return !open;
    });
  }

  // --- Stub hover ------------------------------------------------------------------
  function handleStubEnter() {
    stubTlRef.current?.play();
  }

  function handleStubLeave() {
    stubTlRef.current?.reverse();
  }

  // Entrance, stub tilt, scroll tracking (active section + dark theme).
  useLayoutEffect(
    function setUpAnimations() {
      const ctx = gsap.context(function build() {
        const reduce = prefersReducedMotion();

        // Entrance plays once, not again when crossing the mobile breakpoint.
        if (!reduce && !enteredRef.current) {
          enteredRef.current = true;
          gsap.from(barRef.current, {
            y: -30,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
          });
          gsap.from("[data-ticket-text]", {
            autoAlpha: 0,
            y: 6,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.05,
            delay: 0.35,
            clearProps: "opacity,visibility,transform",
          });
        }

        if (!reduce) {
          stubTlRef.current = gsap
            .timeline({ paused: true })
            .to(compassRef.current, { rotate: 225, duration: 0.8, ease: "back.out(2)" }, 0)
            .to(stubWrapRef.current, { rotate: 3, x: 3, transformOrigin: "0% 100%", duration: 0.5, ease: "back.out(2)" }, 0);
        }

        if (dotRef.current) gsap.set(dotRef.current, { opacity: 0, scale: 0.6 });

        function track(instant) {
          // Dark glass while a navy panel sits under the navbar.
          let dark = false;
          document.querySelectorAll('[data-theme="navy"]').forEach(function checkPanel(panel) {
            const r = panel.getBoundingClientRect();
            if (r.top <= NAV_LINE && r.bottom >= NAV_LINE) dark = true;
          });
          navRef.current.dataset.theme = dark ? "dark" : "light";

          // Active link: the tracked section containing the viewport centre.
          // Reading live rects keeps this right while #services is pinned.
          const centre = window.innerHeight / 2;
          let found = null;
          LINKS.forEach(function checkSection(link) {
            const el = document.querySelector(link.target);
            if (!el) return;
            const r = el.getBoundingClientRect();
            if (r.top <= centre && r.bottom >= centre) found = link.target;
          });
          if (found !== activeRef.current) {
            activeRef.current = found;
            setActive(found);
            moveDot(found, instant);
          } else if (instant && found && dotRef.current) {
            gsap.set(dotRef.current, { x: dotXFor(found) });
          }
        }

        // Read positions on the next frame, after every ScrollTrigger (notably
        // the Services pin) has applied this scroll position.
        let frame = 0;
        function trackNextFrame() {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(function runTrack() {
            track(false);
          });
        }

        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: trackNextFrame,
          onRefresh: function onScrollRefresh() {
            track(true);
          },
        });
        track(true);

        return function cancelTrack() {
          cancelAnimationFrame(frame);
        };
      }, navRef);

      ctxRef.current = ctx;
      return function revertAnimations() {
        ctx.revert();
        ctxRef.current = null;
        stubTlRef.current = null;
        dotTlRef.current = null;
      };
    },
    // layoutKey: desktop and mobile render different elements.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layoutKey]
  );

  // Mobile menu open/close animation.
  useLayoutEffect(
    function animateMenu() {
      const wrap = menuWrapRef.current;
      const inner = menuRef.current;
      if (!wrap || !inner || !ctxRef.current) return;
      ctxRef.current.add(function buildMenuTween() {
        menuTlRef.current?.kill();
        const rows = inner.querySelectorAll("[data-menu-row]");
        const reduce = prefersReducedMotion();
        if (menuOpen) {
          // Height (with room for the shadow) on an overflow-hidden wrapper:
          // unlike clip-path or opacity, it doesn't break the glass blur.
          menuTlRef.current = gsap
            .timeline()
            .set(wrap, { visibility: "visible" })
            .fromTo(wrap, { height: 0 }, { height: inner.offsetHeight + 32, duration: reduce ? 0 : 0.45, ease: "power3.out" })
            .from(rows, { y: -8, opacity: 0, duration: reduce ? 0 : 0.3, stagger: 0.05, ease: "power2.out" }, reduce ? 0 : 0.1);
        } else {
          menuTlRef.current = gsap
            .timeline()
            .to(wrap, { height: 0, duration: reduce ? 0 : 0.3, ease: "power2.in" })
            .set(wrap, { visibility: "hidden" });
        }
      });
    },
    [menuOpen, layoutKey]
  );

  // Close the menu on Escape and on taps outside it.
  useEffect(
    function listenForDismiss() {
      if (!menuOpen) return undefined;
      function handleKey(event) {
        if (event.key === "Escape") {
          closeMenu();
          menuButtonRef.current?.focus();
        }
      }
      function handlePointer(event) {
        if (menuWrapRef.current?.contains(event.target) || menuButtonRef.current?.contains(event.target)) return;
        closeMenu();
      }
      document.addEventListener("keydown", handleKey);
      document.addEventListener("pointerdown", handlePointer);
      return function stopListening() {
        document.removeEventListener("keydown", handleKey);
        document.removeEventListener("pointerdown", handlePointer);
      };
    },
    [menuOpen]
  );

  // Leaving mobile layout closes the menu.
  useEffect(
    function closeOnDesktop() {
      if (!isMobile) setMenuOpen(false);
    },
    [isMobile]
  );

  perfRefs.current = [];
  menuPerfRefs.current = [];
  function addPerf(el) {
    if (el) perfRefs.current.push(el);
  }
  function addMenuPerf(el) {
    if (el) menuPerfRefs.current.push(el);
  }
  function linkRef(target) {
    return function setLinkRef(el) {
      linkRefs.current[target] = el;
    };
  }

  const fallback = BAR_HEIGHT / 2;

  return (
    <nav ref={navRef} aria-label="Main" data-theme="light" className="ticket-nav">
      <style>{styles}</style>

      {/* The bar */}
      <div
        ref={barRef}
        className="fixed top-5 inset-x-0 mx-auto z-[60] flex"
        style={{ width: "min(1180px, calc(100% - 40px))", height: BAR_HEIGHT }}
      >
        <GlassTicket innerRef={mainRef} shape={mainShape} fallbackRadius={fallback} className="h-full flex-1 min-w-0">
          <div className="flex h-full items-stretch">
            {/* Logo segment */}
            <a
              href="#home"
              onClick={handleLogoClick}
              className={`ticket-seg flex flex-col justify-center min-w-0 ${isMobile ? "pl-7 pr-4" : ""}`}
              // Desktop: the logo hugs its text; the four links share the rest.
              style={isMobile ? { flex: "1 1 auto" } : { flex: "0 0 auto", paddingLeft: 40, paddingRight: LOGO_PAD_RIGHT }}
            >
              <span data-ticket-text className="ticket-ink leading-none truncate" style={{ fontSize: isMobile ? 20 : 26, fontWeight: LOGO_WEIGHT }}>
                RiadhVision
              </span>
              {!isTiny && (
                <span data-ticket-text className="ticket-ink-soft font-mono mt-1.5 truncate" style={{ fontSize: 13, letterSpacing: "0.08em" }}>
                  ORN → ANYWHERE
                </span>
              )}
            </a>

            {isMobile ? (
              <>
                <span ref={addPerf} aria-hidden className="ticket-perf-v" />
                <button
                  ref={menuButtonRef}
                  type="button"
                  onClick={toggleMenu}
                  aria-expanded={menuOpen}
                  aria-controls="ticket-menu"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  className="ticket-seg ticket-ink flex items-center justify-center w-[84px] shrink-0 cursor-pointer"
                >
                  <span className="ticket-hl absolute inset-x-[6px] inset-y-[10px] rounded-[18px]" />
                  <span data-ticket-text className="ticket-lift relative">
                    <MenuIcon open={menuOpen} />
                  </span>
                </button>
              </>
            ) : (
              LINKS.map(function renderLink(link) {
                const isActive = active === link.target;
                return (
                  <span key={link.target} className="contents">
                    <span ref={addPerf} aria-hidden className="ticket-perf-v" />
                    <a
                      ref={linkRef(link.target)}
                      href={link.target}
                      onClick={handleLinkClick}
                      aria-current={isActive ? "true" : undefined}
                      className="ticket-seg ticket-ink flex items-center justify-center min-w-0"
                      style={{ flex: "1 1 0", fontSize: 17 }}
                    >
                      <span className="ticket-hl absolute inset-x-[6px] inset-y-[10px] rounded-[18px]" />
                      <span data-ticket-text className="relative">
                        {/* The stamped (active) label sits a touch lower, as in image 1 */}
                        <span className="relative block transition-[top] duration-300" style={{ top: isActive ? 3 : 0 }}>
                          <span className="ticket-lift">{link.label}</span>
                        </span>
                      </span>
                    </a>
                  </span>
                );
              })
            )}
          </div>

          {/* Stamp dot: one element that travels between links (desktop) */}
          {!isMobile && (
            <span
              ref={dotRef}
              aria-hidden
              className="absolute top-[16px] left-0 rounded-full bg-accent pointer-events-none"
              style={{ width: DOT, height: DOT, boxShadow: "0 0 0 1px rgba(244,248,251,0.95)", opacity: 0 }}
            />
          )}
        </GlassTicket>

        {/* The stub: its own glass piece so it can tilt; its left corner notches
            meet the main ticket's, so together they read as one ticket. */}
        <div
          ref={stubWrapRef}
          className="ticket-stub h-full shrink-0"
          style={{ flex: isMobile ? "0 0 76px" : "0 0 20%" }}
          onMouseEnter={handleStubEnter}
          onMouseLeave={handleStubLeave}
        >
          <GlassTicket innerRef={stubRef} shape={stubShape} tint="accent" fallbackRadius={fallback} className="h-full">
            <span aria-hidden className="ticket-perf-v absolute left-0 top-0 bottom-0" />
            <button
              type="button"
              onClick={handleTalkClick}
              onFocus={handleStubEnter}
              onBlur={handleStubLeave}
              aria-label={isMobile ? "Let's talk" : undefined}
              className="ticket-seg ticket-ink w-full h-full flex items-center justify-center gap-3 cursor-pointer"
              style={{ fontSize: 17 }}
            >
              <span data-ticket-text className="flex items-center gap-3">
                <Compass iconRef={compassRef} />
                {!isMobile && <span>Let&rsquo;s talk</span>}
              </span>
            </button>
          </GlassTicket>
        </div>
      </div>

      {/* Mobile menu: a vertical ticket unfolding below the bar. A separate fixed
          layer so it can sit above the chatbot without lifting the bar too. */}
      {isMobile && (
        <div
          ref={menuWrapRef}
          id="ticket-menu"
          className="fixed inset-x-0 mx-auto z-[10000] overflow-hidden"
          style={{ top: 20 + BAR_HEIGHT + 8, width: "min(1180px, calc(100% - 40px))", height: 0, visibility: "hidden" }}
        >
          <GlassTicket innerRef={menuRef} shape={menuShape} fallbackRadius={22} style={{ height: MENU_HEIGHT }}>
            <ul className="relative">
              {LINKS.map(function renderMenuLink(link, i) {
                const isActive = active === link.target;
                return (
                  <li key={link.target} data-menu-row>
                    {i > 0 && <div ref={addMenuPerf} aria-hidden className="ticket-perf-h" />}
                    <a
                      href={link.target}
                      onClick={handleLinkClick}
                      aria-current={isActive ? "true" : undefined}
                      className="ticket-seg ticket-ink flex items-center justify-between px-6"
                      style={{ fontSize: 17, height: MENU_ROW }}
                    >
                      <span className="ticket-hl absolute inset-x-[10px] inset-y-[6px] rounded-[14px]" />
                      <span className="relative flex items-center gap-3">
                        {isActive && <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-accent" />}
                        {link.label}
                      </span>
                      <span className="relative ticket-ink-soft font-mono" style={{ fontSize: 13, letterSpacing: "0.08em" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </GlassTicket>
        </div>
      )}
    </nav>
  );
}

export default TicketNavbar;

const FLUTED_MASK = "linear-gradient(to bottom, transparent, black 160px, black calc(100% - 160px), transparent)";

// Spacing scale: one section pad (top and bottom) for the whole page, so the
// gap between two sections is 2 × PAD.
const PAD = "clamp(32px, 4vw, 64px)";

/**
 * v2 section frame. Transparent: the whole site sits on one fixed
 * HeroBackground. Text is always the dark tone (snow statements, ice body and
 * labels) via the tone-head / tone-body / tone-label utilities. The section
 * creates no stacking context: fluted glass (z-1) → line art (z-2) → content (z-10).
 *
 * fluted    a fluted glass layer refracting the background
 * backdrop  optional layer below the fluted glass and the content
 * lines     optional line-art layer (see components/lines)
 */
function Section({
  id,
  fluted = false,
  backdrop,
  lines,
  className = "",
  children,
}) {
  return (
    <section
      id={id}
      data-tone="dark"
      className={`relative tone-head ${className}`}
      style={{ paddingTop: PAD, paddingBottom: PAD }}
    >
      {backdrop}
      {fluted && (
        <div
          aria-hidden
          className="fluted absolute inset-0 z-[1] pointer-events-none"
          // Ribs only: a section-wide backdrop blur ignores the mask and leaves a hard
          // edge at the section top, so the blur stays off and the ribs fade in/out.
          style={{ maskImage: FLUTED_MASK, WebkitMaskImage: FLUTED_MASK, backdropFilter: "none", WebkitBackdropFilter: "none" }}
        />
      )}
      {lines && <div className="hidden md:block absolute inset-0 z-[2] pointer-events-none overflow-x-clip">{lines}</div>}

      <div data-content className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-6">{children}</div>
    </section>
  );
}

export default Section;

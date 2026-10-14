// Stacked sheets: every section after the Hero is a full-width sheet with
// rounded top corners that overlaps the previous one. The section itself has
// no z-index (no stacking context), so layers interleave page-wide:
//   sheet background (z-0) → page FreeLines (z-1) → content (z-10).
// Later sheets paint over earlier ones because they come later in the DOM.
// `flat` sections (About, Works, Process) skip the overlap, rounding and shadow.
// `panel` is the inset navy card (Contact): side/vertical gaps, all corners
// rounded, no overlap or shadow.
const sheets = {
  light: "bg-base",
  navy: "bg-navy",
};

const pads = {
  light: "py-14 md:py-20",
  navy: "py-16 md:py-24",
};

export const SHEET_OVERLAP = "-mt-10 md:-mt-12";

const SectionShell = ({
  theme = "light",
  id,
  className = "",
  innerClassName = "",
  overlap = true,
  flat = false,
  panel = false,
  decoration,
  children,
  ...rest
}) => (
  <section
    id={id}
    data-theme={theme}
    className={`relative scroll-mt-[88px] ${
      panel ? "mx-2 md:mx-4 my-3 md:my-4 overflow-hidden rounded-[24px] md:rounded-[40px]" : overlap && !flat ? SHEET_OVERLAP : ""
    } ${pads[theme]} ${
      theme === "navy" ? "text-base/80" : ""
    } ${className}`}
    {...rest}
  >
    {/* Sheet background with a soft top shadow so the overlap reads as a layer */}
    <div
      aria-hidden
      className={`absolute inset-0 z-0 pointer-events-none ${
        panel
          ? "rounded-[24px] md:rounded-[40px]"
          : flat
            ? ""
            : "rounded-t-[28px] md:rounded-t-[48px] shadow-[0_-12px_32px_rgba(0,49,82,0.06)]"
      } ${sheets[theme]}`}
    />
    {/* Extra background layers (e.g. TintBackground), above the sheet */}
    {decoration}
    <div data-shell-inner className={`relative z-10 max-w-[1200px] mx-auto px-4 md:px-6 ${innerClassName}`}>
      {children}
    </div>
  </section>
);

export default SectionShell;

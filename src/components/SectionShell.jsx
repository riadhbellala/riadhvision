// Page rhythm: light sections sit directly on the base body background (no
// fill of their own, no overflow clipping, so position: sticky keeps working
// and the page BackgroundLines show through); navy sections are inset, rounded
// panels framed by that light background, and cover the lines.
const themes = {
  light: "py-20 md:py-28",
  navy: "bg-navy text-base/80 mx-2 md:mx-4 my-3 md:my-4 rounded-[24px] md:rounded-[40px] py-20 md:py-28 overflow-hidden",
};

const SectionShell = ({
  theme = "light",
  id,
  className = "",
  innerClassName = "",
  decoration,
  children,
  ...rest
}) => (
  <section
    id={id}
    data-theme={theme}
    className={`relative z-10 scroll-mt-[110px] ${themes[theme]} ${className}`}
    {...rest}
  >
    {/* Background layer (e.g. GrooveLine), positioned against the whole section */}
    {decoration}
    <div data-shell-inner className={`relative z-10 max-w-[1200px] mx-auto px-4 md:px-6 ${innerClassName}`}>
      {children}
    </div>
  </section>
);

export default SectionShell;

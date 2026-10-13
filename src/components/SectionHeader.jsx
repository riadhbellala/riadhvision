const tones = {
  light: { meta: "text-navy/70", name: "text-navy", title: "text-navy", intro: "text-navy/70" },
  navy: { meta: "text-base/70", name: "text-base", title: "text-base", intro: "text-base/70" },
};

// Section label in brackets, numbered in page order: [ 02 Work ].
// Brackets and number are muted (70%, the lowest text opacity that passes AA).
export const BracketLabel = ({ number, name, theme = "light", className = "" }) => {
  const tone = tones[theme];
  return (
    <p className={`text-small ${className}`}>
      <span className={tone.meta}>
        [ <span className="tabular-nums">{number}</span>{" "}
      </span>
      <span className={tone.name}>{name}</span>
      <span className={tone.meta}> ]</span>
    </p>
  );
};

// Shared section header: bracket label, title and optional intro.
const SectionHeader = ({ number, eyebrow, title, intro, align = "left", theme = "light", id, className = "" }) => {
  const tone = tones[theme];
  const centered = align === "center";

  return (
    <header className={`mb-12 md:mb-16 ${centered ? "text-center" : ""} ${className}`}>
      {eyebrow && <BracketLabel number={number} name={eyebrow} theme={theme} className="mb-4" />}
      <h2 id={id} className={`text-h2 ${tone.title}`}>
        {title}
      </h2>
      {intro && (
        <p className={`text-body-lg ${tone.intro} max-w-[56ch] mt-4 ${centered ? "mx-auto" : ""}`}>{intro}</p>
      )}
    </header>
  );
};

export default SectionHeader;

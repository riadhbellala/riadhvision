import Section from "../components/Section";

const VALUES = ["Clarity", "Performance", "Intelligence"];

// 03 — Values "Three Pills": staggered glass pills over a horizon aura.
function Values() {
  return (
    <Section id="values" index="03" name="Values">
      <h2 className="text-statement tone-head">
        Clarity. Performance. Intelligence.
      </h2>
      <p className="text-body tone-body mt-4 max-w-[44ch]">
        Note: three staggered glass pills; hovering a pill expands it into one
        sentence.
      </p>
      <ul className="mt-16 flex flex-col gap-6">
        {VALUES.map(function renderValue(value, i) {
          return (
            <li key={value} style={{ marginLeft: `${i * 18}%` }}>
              <span className="glass-pill inline-flex text-label tone-head px-8 py-4">
                {value}
              </span>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export default Values;

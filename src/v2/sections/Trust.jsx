import Section from "../components/Section";
import Testimonials from "./Testimonials";
import { InfiniteRibbon } from "../../components/ui/infinite-ribbon";
import { projects } from "../../constants";

// Client names from the shipped projects, and the tools behind them.
const CLIENTS = projects.map((p) => p.name.split(" — ")[0]);
const STACK = [
  "React",
  "Next.js",
  "Node.js",
  "Supabase",
  "Tailwind CSS",
  "Framer Motion",
  "GSAP",
  "Electron",
  "MongoDB",
  "PostgreSQL",
];

function Row({ items }) {
  return (
    <span className="inline-flex items-center">
      {items.map(function renderItem(item) {
        return (
          <span key={item} className="inline-flex items-center">
            {item}
            <span
              aria-hidden
              className="mx-8 md:mx-12 inline-block w-2.5 h-2.5 rounded-full bg-glow/80 align-middle"
            />
          </span>
        );
      })}
    </span>
  );
}

// 08 — Trust "They trust the work": a poster headline, two slow ribbons (the
// clients' names large, the stack small and the other way), then the clients' words.
function Trust() {
  return (
    <Section
      id="trust"
      index="08"
      name="Trust"
      corners={["Real brands. Real results.", "Trusted across industries."]}
    >
      <h2 className="text-section text-snow">
        They trust
        <br />
        the work.
      </h2>
      <p className="text-body text-ice mt-8 max-w-[40ch]">
        Brands, shops and platforms across real estate, retail, health and
        industry, in Algeria and beyond.
      </p>

      <div className="mt-20 left-1/2 -translate-x-1/2 relative w-screen flex flex-col gap-6">
        <InfiniteRibbon
          duration={60}
          className="bg-transparent! text-snow font-light tracking-[-0.03em] text-[clamp(2rem,4.5vw,4rem)] py-4!"
        >
          <Row items={CLIENTS} />
        </InfiniteRibbon>
        <InfiniteRibbon
          duration={45}
          reverse
          className="bg-snow/8! border-y border-snow/20 text-ice text-body py-4!"
        >
          <Row items={STACK} />
        </InfiniteRibbon>
      </div>
      <Testimonials />
    </Section>
  );
}

export default Trust;

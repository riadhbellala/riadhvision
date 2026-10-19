import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Section from "../components/Section";
import { TextPath } from "../../components/ui/text-path";
import Now from "./Now";
import OrbButton from "../components/OrbButton";

const EMAIL = "riadh5726@gmail.com";
const KINDS = [
  "Website",
  "Online store",
  "Web app",
  "Redesign",
  "Not sure yet",
];

function mailto(picked) {
  const subject = picked.length
    ? `New project: ${picked.join(" + ")}`
    : "New project";
  const body = `Hi Riadh,\n\nI'd like to talk about ${picked.length ? `a ${picked.join(" + ").toLowerCase()}` : "a project"}.\n\nAbout the project:\n\nTimeline:\n\nBudget range:\n`;
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// 11 — Contact: one centred moment. Pick what you need, the email writes itself.
function Contact() {
  const [picked, setPicked] = useState([]);
  const [copied, setCopied] = useState(false);

  function toggle(kind) {
    setPicked((p) =>
      p.includes(kind) ? p.filter((k) => k !== kind) : [...p, kind],
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  return (
    <Section id="contact">
      {/* A curved glass blade sweeping behind the content, off the right edge (desktop). */}
      <div
        aria-hidden
        className="hidden md:block absolute -right-[30vw] top-[10%] w-[90vw] h-[110%] rounded-[50%] pointer-events-none -z-0"
        style={{
          rotate: "-24deg",
          background:
            "linear-gradient(200deg, rgba(201,216,244,0.35), rgba(36,72,201,0.18) 40%, rgba(7,10,22,0) 70%)",
          boxShadow: "inset 2px 2px 0 rgba(242,245,251,0.35)",
        }}
      />

      <div className="relative isolate flex flex-col items-center text-center">
        {/* Phones: the blade stays behind "Got a project" only, clipped to this block. */}
        <div aria-hidden className="md:hidden absolute -z-10 -top-8 -bottom-6 left-[calc(50%-50vw)] w-screen overflow-hidden pointer-events-none">
          <div
            className="absolute -right-[45vw] top-0 w-[120vw] h-[105%] rounded-[50%]"
            style={{
              rotate: "-24deg",
              background: "linear-gradient(200deg, rgba(201,216,244,0.35), rgba(36,72,201,0.18) 40%, rgba(7,10,22,0) 70%)",
              boxShadow: "inset 2px 2px 0 rgba(242,245,251,0.35)",
            }}
          />
        </div>
        {/* What I make, travelling along an arc over the title. */}
        <TextPath
          curve="arc"
          text="Websites · Online stores · Web apps · Redesigns"
          separator="  ·  "
          repeats={2}
          fontSize={20}
          fontWeight={400}
          letterSpacing={0.02}
          duration={24}
          className="w-full max-w-[620px] -mb-6 text-ice"
        />
        <h2 data-title="focus" className="text-section text-snow">
          Got a project?
          <br />
          Let’s talk.
        </h2>

        <fieldset className="mt-12">
          <legend className="text-body text-ice mb-5">What do you need?</legend>
          <div className="flex flex-wrap justify-center gap-3">
            {KINDS.map(function renderKind(kind) {
              const on = picked.includes(kind);
              return (
                <button
                  key={kind}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(kind)}
                  className={`h-12 px-5 rounded-pill text-body border transition-[background-color,color,border-color,transform] duration-200 ease-out active:scale-[0.97] ${
                    on
                      ? "bg-snow text-deep border-snow"
                      : "glass-pill text-snow hover:bg-snow/15"
                  }`}
                >
                  {kind}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <OrbButton href={mailto(picked)} icon="paper-plane">
            Write the email
          </OrbButton>
          <div className="glass-pill inline-flex items-center gap-2 h-14 pl-6 pr-2 text-body text-snow">
            {EMAIL}
            <button
              type="button"
              onClick={copy}
              className="h-10 px-4 rounded-pill bg-ink/50 text-small text-snow transition-colors hover:bg-ink/80"
              aria-live="polite"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <p className="mt-8 text-body text-ice">
          Or{" "}
          <a
            href="https://wa.me/213555711088"
            target="_blank"
            rel="noopener noreferrer"
            className="text-snow underline underline-offset-4 decoration-snow/40 hover:decoration-snow"
          >
            message me on WhatsApp
          </a>{" "}
          or{" "}
          <RouterLink
            to="/start"
            className="text-snow underline underline-offset-4 decoration-snow/40 hover:decoration-snow"
          >
            fill in the project brief
          </RouterLink>
          .
        </p>
      </div>
      <Now />
    </Section>
  );
}

export default Contact;

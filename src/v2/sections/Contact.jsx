import { useState } from "react";
import Section from "../components/Section";
import EmblemDrift from "../components/EmblemDrift";
import { TextPath } from "../../components/ui/text-path";
import Now from "./Now";
import OrbButton from "../components/OrbButton";
import { EXTERNAL, whatsapp } from "../components/links";

const EMAIL = "riadh5726@gmail.com";
const KINDS = ["Website", "Online store", "Web app", "Redesign", "Not sure yet"];

function message(picked) {
  return picked.length
    ? `Hi Riadh, I'd like to talk about a ${picked.join(" + ").toLowerCase()}.`
    : "Hi Riadh, I'd like to start a project with you.";
}

// 11 — Contact: one centred moment. Pick what you need, then one button
// straight to WhatsApp with the message written; or copy the email.
function Contact() {
  const [picked, setPicked] = useState([]);
  const [copied, setCopied] = useState(false);

  function toggle(kind) {
    setPicked((p) => (p.includes(kind) ? p.filter((k) => k !== kind) : [...p, kind]));
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
    <Section
      id="contact"
      // The logo shape, large and soft in the background on the left, turning as you scroll.
      backdrop={<EmblemDrift src="/emblem.webp" side="left" top="6%" opacity={0.55} imgClassName="max-md:top-[0%]! max-md:w-[40vw]! max-md:opacity-45!" />}
    >
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
        {/* Phones: one whole glass disc behind the title (fully on screen, so
            nothing is ever cut), lit from the top-left like the desktop blade. */}
        <div
          aria-hidden
          className="md:hidden absolute -z-10 left-1/2 top-[4%] -translate-x-1/2 w-[86vw] aspect-square rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle at 30% 25%, rgba(201,216,244,0.32), rgba(91,131,232,0.16) 45%, rgba(36,72,201,0.06) 70%, transparent 72%)",
            boxShadow: "inset 2px 2px 0 rgba(242,245,251,0.35), inset -10px -14px 40px rgba(7,10,22,0.25)",
          }}
        />
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
          className="w-full max-w-[620px] -mb-6 max-md:mb-2 max-md:px-2 text-ice"
        />
        <h2 data-title="focus" className="text-section max-md:text-[3.4rem]! max-md:leading-[0.92]! text-snow">
          Got a project?
          <br />
          Let’s talk.
        </h2>

        <fieldset className="mt-10 md:mt-12">
          <legend className="text-body text-ice mb-5">What do you need?</legend>
          <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
            {KINDS.map(function renderKind(kind) {
              const on = picked.includes(kind);
              return (
                <button
                  key={kind}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(kind)}
                  className={`h-11 md:h-12 px-4 md:px-5 rounded-pill text-small md:text-body border transition-[background-color,color,border-color,transform] duration-200 ease-out active:scale-[0.97] ${
                    on ? "bg-snow text-deep border-snow" : "glass-pill text-snow hover:bg-snow/15"
                  }`}
                >
                  {kind}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* One step: WhatsApp opens with a message that already names what was picked. */}
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-3">
          <OrbButton href={whatsapp(message(picked))} {...EXTERNAL} icon="paper-plane">
            Message me on WhatsApp
          </OrbButton>
          <div className="glass-pill inline-flex items-center gap-2 h-14 pl-5 md:pl-6 pr-2 text-small md:text-body text-snow">
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
      </div>
      <Now />
    </Section>
  );
}

export default Contact;

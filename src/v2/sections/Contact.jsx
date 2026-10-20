import Section from "../components/Section";
import EmblemDrift from "../components/EmblemDrift";
import { TextPath } from "../../components/ui/text-path";
import Now from "./Now";
import OrbButton from "../components/OrbButton";
import { EXTERNAL, START } from "../components/links";

const EMAIL = "riadh5726@gmail.com";
// 11 — Contact: one centred moment, one button straight to WhatsApp.
function Contact() {
  return (
    <Section
      id="contact"
      // The logo shape, large and soft in the background on the left, turning as you scroll.
      backdrop={<EmblemDrift src="/emblem.webp" side="left" top="6%" opacity={0.55} />}
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

        {/* One step: the button opens WhatsApp with a ready message. */}
        <div className="mt-12 flex flex-col items-center gap-5">
          <OrbButton href={START} {...EXTERNAL} icon="paper-plane">
            Message me on WhatsApp
          </OrbButton>
          <p className="text-body text-ice">
            Or email{" "}
            <a href={`mailto:${EMAIL}`} className="text-snow underline underline-offset-4 decoration-snow/40 hover:decoration-snow">
              {EMAIL}
            </a>
          </p>
        </div>
      </div>
      <Now />
    </Section>
  );
}

export default Contact;

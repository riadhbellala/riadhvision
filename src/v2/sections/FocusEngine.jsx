import { useState } from "react";
import { EXTERNAL, whatsapp } from "../components/links";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Section from "../components/Section";
import OrbButton from "../components/OrbButton";
import GlassIcon from "../components/GlassIcon";

const EASE = [0.22, 1, 0.36, 1];

const EXAMPLES = [
  "An online store for my clothing brand",
  "A booking app for my clinic",
  "A website for my restaurant",
  "A mobile app for my gym",
  "A CRM for my sales team",
];

// Rough scoping by keywords: what kind of build it is and what it usually includes.
const KINDS = [
  {
    test: /crm|clients?\b|leads?|pipeline|sales team|follow.?ups?/i,
    type: "Custom CRM",
    icon: "layers",
    parts: ["Clients and pipeline", "Follow-up reminders", "Reports and dashboards", "Roles for your team"],
  },
  {
    test: /mobile|ios|android|iphone|play store|app store|phone app/i,
    type: "Mobile app",
    icon: "chat-ai",
    parts: ["iOS and Android from one codebase", "Accounts and push notifications", "Admin to manage content", "App Store and Google Play launch"],
  },
  {
    test: /shop|store|boutique|sell|e-?commerce|product|cart|clothing|sneaker/i,
    type: "Online store",
    icon: "bag",
    parts: [
      "Product catalog with filters",
      "Cart and checkout",
      "Order management",
      "Admin to add products",
    ],
  },
  {
    test: /app|saas|platform|dashboard|booking|appointment|rental|portal|tenant|clinic|hospital|manage/i,
    type: "Web app",
    icon: "layers",
    parts: [
      "Accounts and roles",
      "Dashboard for your team",
      "Database and API",
      "Notifications",
    ],
  },
  {
    test: /.*/,
    type: "Website",
    icon: "browser",
    parts: [
      "Home, services and contact pages",
      "Mobile-first design",
      "SEO basics",
      "Content you can update",
    ],
  },
];

function scope(idea) {
  const kind = KINDS.find((k) => k.test.test(idea));
  const languages =
    /arab|french|english|bilingual|multilingual|languages?/i.test(idea);
  return {
    ...kind,
    parts: languages ? [...kind.parts, "Several languages"] : kind.parts,
  };
}

// Focus Engine: one rounded glass rectangle; a speech bubble inside turns a
// one-line idea into a rough scope.
function FocusEngine() {
  const reduce = useReducedMotion();
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState(null);

  function submit(event) {
    event.preventDefault();
    const text = idea.trim();
    if (text) setResult({ idea: text, ...scope(text) });
  }

  return (
    <Section id="focus-engine">
      <div className="relative">
        {/* The whole engine sits in one rounded glass rectangle. */}
        <div
          className="rounded-[32px] p-6 py-10 md:p-14 lg:p-16"
          style={{
            background:
              "linear-gradient(160deg, rgba(242,245,251,0.10), rgba(242,245,251,0.03)), rgba(7,10,22,0.35)",
            border: "1px solid rgba(242,245,251,0.2)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.3), 0 40px 120px rgba(7,10,22,0.35)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-12 lg:gap-20 items-center">
            <div>
              <h2 data-title="slide" className="text-section text-[clamp(3rem,7vw,7.5rem)]! text-snow max-w-[12ch]">
                Describe your idea.
              </h2>
              <p className="text-body text-ice mt-6 max-w-[38ch]">
                One sentence is enough. You get a first shape of the project
                here, then we refine it together on a call.
              </p>
            </div>

            {/* The glass speech bubble. */}
            <div className="relative">
              <div className="relative rounded-[24px] p-5 md:p-8 bg-ink/45 border border-snow/15">
                <form onSubmit={submit} className="flex flex-col gap-4">
                  <label htmlFor="idea" className="text-small text-ice">
                    What do you want to build?
                  </label>
                  <div className="flex items-center gap-2 rounded-pill bg-ink/60 border border-snow/20 p-1.5 pl-5 focus-within:border-snow/60 transition-colors">
                    <input
                      id="idea"
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="A booking app for my clinic"
                      className="flex-1 min-w-0 bg-transparent text-body text-snow placeholder:text-ice/60 outline-none"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      className="shrink-0 h-11 px-5 rounded-pill bg-snow text-deep text-small font-medium transition-[background-color,transform] duration-200 ease-out hover:bg-ice active:scale-[0.97]"
                    >
                      Shape it
                    </button>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {EXAMPLES.map(function renderExample(example) {
                      return (
                        <li key={example}>
                          <button
                            type="button"
                            onClick={() => {
                              setIdea(example);
                              setResult({ idea: example, ...scope(example) });
                            }}
                            className="glass-pill px-4 py-2 text-small text-snow transition-colors hover:bg-snow/15"
                          >
                            {example}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </form>

                <AnimatePresence mode="wait">
                  {result && (
                    <motion.div
                      key={result.idea}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="mt-8 rounded-[24px] bg-snow/8 border border-snow/15 p-6"
                      aria-live="polite"
                    >
                      <div className="flex items-center gap-4">
                        <GlassIcon name={result.icon} size={56} />
                        <div>
                          <p className="text-small text-ice">First shape</p>
                          <p className="text-h3 text-snow">{result.type}</p>
                        </div>
                      </div>
                      <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        {result.parts.map(function renderPart(part) {
                          return (
                            <li
                              key={part}
                              className="flex items-center gap-3 text-body text-snow"
                            >
                              <span
                                aria-hidden
                                className="w-1.5 h-1.5 rounded-full bg-glow shrink-0"
                              />
                              {part}
                            </li>
                          );
                        })}
                      </ul>
                      <OrbButton
                        href={whatsapp(`Hi Riadh, I'd like to build this: ${result.idea}`)}
                        {...EXTERNAL}
                        icon="paper-plane"
                        size="sm"
                        className="mt-6"
                      >
                        Start this project
                      </OrbButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* The bubble's tail. */}
              <div
                aria-hidden
                className="hidden lg:block absolute -left-4 top-24 w-10 h-10 rotate-45 rounded-[6px] border-l border-b border-snow/25"
                style={{ background: "rgba(14,20,48,0.6)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default FocusEngine;

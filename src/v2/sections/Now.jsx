import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];
const ORAN = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Algiers",
  hour: "2-digit",
  minute: "2-digit",
  weekday: "long",
});

/** A dark glass card with a tab on its top edge (after the Mission / Vision cards). */
function TabCard({ tab, children, className = "", delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className={`relative ${className}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      <p className="absolute -top-9 left-8 rounded-t-[12px] bg-royal px-5 pt-2 pb-3 text-small text-snow">
        {tab}
      </p>
      <div
        className="relative rounded-[24px] p-8 md:p-10 text-snow border border-snow/15"
        style={{
          background:
            "linear-gradient(160deg, rgba(242,245,251,0.10), rgba(242,245,251,0.03)), rgba(14,20,48,0.6)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.25), 0 30px 80px rgba(7,10,22,0.35)",
        }}
      >
        {children}
      </div>
    </motion.article>
  );
}

// "Right now" (rendered inside Contact): what's on the desk and what I'm open for, two tabbed cards.
function Now() {
  const [time, setTime] = useState(() => ORAN.format(new Date()));
  useEffect(function tick() {
    const id = setInterval(() => setTime(ORAN.format(new Date())), 20000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-24 md:mt-32 text-left">
      <h3 className="text-snow font-light leading-none tracking-[-0.04em]" style={{ fontSize: "clamp(2.25rem, 4.5vw, 4.5rem)" }}>
        Right now.
      </h3>

      <div className="relative mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        <TabCard tab="Building now" className="">
          <h3 className="text-h2">Drivo</h3>
          <p className="text-body mt-3 max-w-[40ch]">
            A multi-tenant platform and desktop app for car rental agencies:
            bookings, vehicles, billing and rental contracts in one place.
          </p>
          <p className="text-small mt-6 text-ice">
            React, Electron, Node.js, Supabase
          </p>
        </TabCard>

        <TabCard
          tab="Open for"
          className=""
          delay={0.12}
        >
          <h3 className="text-h2">New projects</h3>
          <p className="text-body mt-3 max-w-[40ch]">
            Websites, online stores and web apps, for clients in Algeria and
            anywhere else.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-small text-ice tabular-nums">Algeria: {time}</p>
            <Link
              to="/start"
              className="btn-primary"
            >
              Start a project
            </Link>
          </div>
        </TabCard>
      </div>
    </div>
  );
}

export default Now;

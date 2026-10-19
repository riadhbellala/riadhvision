import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from "framer-motion";
import { Selected } from "../components/Selected";
import Section from "../components/Section";
import Arc from "../components/lines/Arc";
import Testimonials from "./Testimonials";
import { projects } from "../../constants";
import { cover, hasArtwork } from "../components/projectArt";

const EASE = [0.22, 1, 0.36, 1];
// Projects with poster artwork first, then the rest.
const SHOWN = [...projects].sort((a, b) => hasArtwork(b) - hasArtwork(a)).slice(0, 8);
const YEARS = [Math.min(...projects.map((p) => +p.year)), Math.max(...projects.map((p) => +p.year))];

function split(name) {
  const [title, kind] = name.split(" — ");
  return { title, kind };
}


/**
 * One project as a 4:5 poster: its artwork (or the real site), its name on a
 * glass pill. It slides in from its own side (left column from the left, right
 * column from the right). On hover the art eases in, the arrow turns, and a
 * fluted glass panel rises from the bottom with what it is and what it took
 * (also on focus).
 */
function Poster({ project, index }) {
  const reduce = useReducedMotion();
  const { title, kind } = split(project.name);
  const art = hasArtwork(project);

  return (
    <motion.li
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: index % 2 ? 160 : -160, rotate: index % 2 ? 4 : -4 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease: EASE }}
    >
      <Link
        to={`/project/${project.slug}`}
        className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] border border-snow/15 bg-ink-2 outline-none focus-visible:ring-2 focus-visible:ring-snow"
      >
        <img
          src={cover(project)}
          alt={`${title} website`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        {!art && <div aria-hidden className="absolute inset-0 bg-deep/25 mix-blend-multiply" />}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
        />

        <span className="absolute left-5 bottom-5 md:left-6 md:bottom-6 glass-pill bg-ink/40! px-5 py-2.5 text-body text-snow transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0">
          {title}
        </span>
        <span className="absolute right-5 top-5 md:right-6 md:top-6 grid place-items-center w-12 h-12 rounded-full bg-snow text-deep transition-transform duration-300 ease-out group-hover:rotate-45">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden
          >
            <path d="M5 13 13 5M6 5h7v7" />
          </svg>
        </span>

        {/* Fluted glass details panel. */}
        <div className="fluted absolute inset-x-0 bottom-0 p-6 md:p-8 bg-ink/45 border-t border-snow/20 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
          <h3 className="text-h3 text-snow">{title}</h3>
          {kind && <p className="text-small text-ice mt-1">{kind}</p>}
          <p className="text-small text-snow mt-4 line-clamp-3">
            {project.description}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.frameworks?.slice(0, 4).map(function renderTag(tag) {
              return (
                <li
                  key={tag.id}
                  className="glass-pill px-3 py-1.5 text-small text-snow"
                >
                  {tag.name}
                </li>
              );
            })}
          </ul>
        </div>
      </Link>
      <p className="mt-4 flex justify-between text-small text-ice">
        <span>{project.category}</span>
        <span className="tabular-nums">{project.year}</span>
      </p>
    </motion.li>
  );
}

// Work: a large intro, a staggered wall of project posters (the right column
// sits lower), then the clients' words.
function Work() {
  return (
    <Section
      id="work"
      // A large circle mostly off the top-right: only its curve passes behind the posters.
      lines={<Arc style={{ width: "100vw", left: "62vw", top: "-38vw" }} />}
    >
      <h2 data-title="spread" className="text-section text-snow">
        <Selected>Selected</Selected> work.
      </h2>
      <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:items-end">
        <p
          className="md:col-span-7 text-snow font-light leading-[1.25] tracking-[-0.02em]"
          style={{ fontSize: "clamp(1.35rem, 2.4vw, 2.125rem)" }}
        >
          Real sites and platforms, shipped for brands in Algeria and abroad: real estate, retail, industry and health.
        </p>
        <p className="md:col-span-4 md:col-start-9 text-body-lg text-ice">
          {projects.length} projects from {YEARS[0]} to {YEARS[1]}. Open any of them to see how it was made.
        </p>
      </div>

      {/* Two columns; the right one starts lower, so the posters stagger. */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
        {[0, 1].map(function renderColumn(col) {
          return (
            <ul
              key={col}
              data-scroll={col ? "lift" : "sink"}
              className={`flex flex-col gap-16 ${col ? "md:pt-[18vh]" : ""}`}
            >
              {SHOWN.map(function renderPoster(project, i) {
                return i % 2 === col ? (
                  <Poster key={project.slug} project={project} index={i} />
                ) : null;
              })}
            </ul>
          );
        })}
      </div>
      <Testimonials />
    </Section>
  );
}

export default Work;

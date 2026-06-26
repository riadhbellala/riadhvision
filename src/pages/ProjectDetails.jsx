import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { projects } from "../constants";
import { Icon } from "@iconify/react/dist/iconify.js";


const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const ProjectDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [nextProject, setNextProject] = useState(null);

  useEffect(() => {
    const idx = projects.findIndex((p) => p.slug === slug);
    if (idx !== -1) {
      setProject(projects[idx]);
      setNextProject(projects[(idx + 1) % projects.length]);
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white gap-4">
        <p className="text-white/40">Project not found.</p>
        <Link to="/" className="text-white hover:text-white/60 transition-colors text-sm uppercase tracking-widest">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pb-32 flex flex-col items-center">

      {/* ── Top Nav ── */}
      <div className="w-full max-w-7xl px-6 md:px-12 pt-10 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-3 text-white/40 hover:text-white transition-colors duration-300 group"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest">Home</span>
        </Link>
        {project.href !== "#" && (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/40 hover:text-[#a1ebd4] transition-colors duration-300"
          >
            <span className="text-xs uppercase tracking-widest hidden sm:block">Live Site</span>
            <Icon icon="lucide:arrow-up-right" className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* ── Title ── */}
      <div className="w-full max-w-7xl px-6 md:px-12 mt-16 mb-4">
        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="text-xs uppercase tracking-widest text-white/30 mb-5"
        >
          {project.role} — {project.year}
        </motion.p>
        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="text-[clamp(3rem,9vw,8rem)] font-bold tracking-tighter leading-[0.88] uppercase"
        >
          {project.name.split(" — ")[0]}
        </motion.h1>
        {project.name.includes(" — ") && (
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="mt-3 text-base text-white/30 uppercase tracking-widest"
          >
            {project.name.split(" — ")[1]}
          </motion.p>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="w-full max-w-7xl px-6 md:px-12 mt-8 mb-10">
        <div className="w-full h-px bg-white/10" />
      </div>

      {/* ── Image ── */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={3}
        className="w-full max-w-7xl px-6 md:px-12 mb-16"
      >
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 group">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover object-top group-hover:object-bottom transition-[object-position] duration-[6s] ease-in-out"
          />
        </div>
      </motion.div>

      {/* ── Content Grid ── */}
      <div className="w-full max-w-7xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-20">

        {/* Description */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
          <p className="text-xs uppercase tracking-widest text-white/30 mb-4">About</p>
          <p className="text-base md:text-lg text-white/60 font-light leading-relaxed">
            {project.longDescription}
          </p>
        </motion.div>

        {/* Highlights */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.2}>
          <p className="text-xs uppercase tracking-widest text-white/30 mb-4">Key Features</p>
          <ul className="flex flex-col gap-3">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-2 w-1 h-1 rounded-full bg-[#a1ebd4] shrink-0" />
                <span className="text-white/60 font-light text-sm md:text-base leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ── Tech Stack ── */}
      <div className="w-full max-w-7xl px-6 md:px-12 mb-20">
        <p className="text-xs uppercase tracking-widest text-white/30 mb-4">Stack</p>
        <div className="flex flex-wrap gap-2">
          {project.frameworks.map((fw) => (
            <span
              key={fw.id}
              className="border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-white/60 hover:text-white hover:border-white/30 transition-colors duration-300 cursor-default"
            >
              {fw.name}
            </span>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="w-full max-w-7xl px-6 md:px-12 mb-16">
        <div className="w-full h-px bg-white/10" />
      </div>

      {/* ── Next Project ── */}
      {nextProject && (
        <div className="w-full max-w-7xl px-6 md:px-12">
          <p className="text-xs uppercase tracking-widest text-white/30 mb-6">Next Project</p>
          <button
            onClick={() => navigate(`/project/${nextProject.slug}`)}
            className="group flex items-center justify-between w-full"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase text-white/80 group-hover:text-white transition-colors duration-300">
              {nextProject.name.split(" — ")[0]}
            </h2>
            <Icon
              icon="lucide:arrow-up-right"
              className="w-8 h-8 text-white/30 group-hover:text-[#a1ebd4] transition-colors duration-300 shrink-0"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;

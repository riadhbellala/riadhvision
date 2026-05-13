
import ProjectCard from '../components/ProjectCard';

import athleteImg from '../assets/athlete.webp';
import domaineImg from '../assets/dompaine.webp';
import lyceumImg from '../assets/lyceum.webp';
import smartserviceImg from '../assets/smartservicedz.webp';
import triageflowImg from '../assets/triageflow.webp';

const projects = [
  {
    title: "Athléte",
    description: "A premium e-commerce platform for sports gear, featuring product filtering, cart management, and a seamless checkout experience.",
    image: athleteImg,
    tags: ["React", "Vite", "Tailwind CSS", "E-commerce"],
    url: "https://athlete-gamma.vercel.app/",
    wide: true,
  },
  {
    title: "SmartService DZ",
    description: "A modern SaaS platform for automated appointment booking and service management tailored for Algerian businesses.",
    image: smartserviceImg,
    tags: ["React", "Node.js", "SaaS", "Booking"],
    url: "https://smartservice-dz.vercel.app/",
    wide: false,
  },
  {
    title: "TriageFlow",
    description: "A bilingual (Arabic/French) smart hospital triage dashboard for real-time patient prioritization and medical staff management.",
    image: triageflowImg,
    tags: ["React", "Dashboard", "Healthcare", "Bilingual"],
    url: null,
    wide: false,
  },
  {
    title: "Dopamine",
    description: "A specialty coffee brand experience with a cinematic UI, interactive menu, order management, and a full checkout flow.",
    image: domaineImg,
    tags: ["React", "Framer Motion", "Brand", "GSAP"],
    url: "https://dopamine-lemon.vercel.app/",
    wide: false,
  },
  {
    title: "Lyceum",
    description: "A clean and modern educational platform built to manage courses, students, and academic resources seamlessly.",
    image: lyceumImg,
    tags: ["React", "Platform", "Education"],
    url: "https://lyceum-club.vercel.app/",
    wide: false,
  },
];

const Projects = () => {
  return (
    <section id="projects" className="relative z-30 py-32 px-6">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter font-syne text-white leading-tight">
            Selected <br className="hidden md:block" />Work
          </h2>
          <p className="text-white/50 font-light max-w-xs text-right leading-relaxed hidden md:block">
            A curated selection of products and experiences I have built.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              index={index}
              title={project.title}
              description={project.description}
              image={project.image}
              tags={project.tags}
              url={project.url}
              wide={project.wide}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Projects;

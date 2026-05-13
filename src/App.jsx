import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Services from './sections/Services';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import IsoLevelWarp from './components/IsoLevelWarp';
import TechStack from './sections/TechStack';
import { ContainerScroll } from './components/ContainerScroll';
import { ArrowUpRight } from 'lucide-react';

import athleteImg from './assets/athlete.webp';
import domaineImg from './assets/dompaine.webp';
import lyceumImg from './assets/lyceum.webp';
import smartserviceImg from './assets/smartservicedz.webp';
import triageflowImg from './assets/triageflow.webp';

const allProjects = [
  { title: "Athléte", label: "E-commerce", image: athleteImg, url: "https://athlete-gamma.vercel.app/" },
  { title: "SmartService DZ", label: "SaaS Platform", image: smartserviceImg, url: "https://smartservice-dz.vercel.app/" },
  { title: "Dopamine", label: "Brand Experience", image: domaineImg, url: "https://dopamine-lemon.vercel.app/" },
  { title: "Lyceum", label: "Education Platform", image: lyceumImg, url: "https://lyceum-club.vercel.app/" },
  { title: "TriageFlow", label: "Healthcare Dashboard", image: triageflowImg, url: null },
];

// Auto-cycling project carousel for inside the 3D card
function ProjectCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % allProjects.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const project = allProjects[active];

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      {/* Image layer */}
      <AnimatePresence mode="wait">
        <motion.img
          key={active}
          src={project.image}
          alt={project.title}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Project info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={`info-${active}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-xs font-medium text-white/50 uppercase tracking-widest mb-1 block">{project.label}</span>
            <h3 className="text-2xl md:text-3xl font-bold text-white font-syne">{project.title}</h3>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex flex-col items-end gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Visit <ArrowUpRight size={14} />
            </a>
          )}
          <div className="flex gap-2">
            {allProjects.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === active ? 'bg-white scale-125' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-white/20 selection:text-white relative">
      {/* Global Interactive Background */}
      <IsoLevelWarp color="66, 108, 129" density={50} speed={1.5} />

      {/* Global Noise Overlay */}
      <div className="fixed inset-0 z-10 bg-noise pointer-events-none mix-blend-overlay"></div>
      
      <div className="relative z-20">
        <Navbar />
        <main>
          <Hero />

          {/* Cinematic scroll transition between Hero and Projects */}
          <ContainerScroll
            titleComponent={
              <div className="flex flex-col items-center gap-4 mb-6">
                <span className="text-sm font-medium tracking-widest text-white/50 uppercase">Selected Work</span>
                <h2 className="text-4xl md:text-6xl font-bold font-syne text-white tracking-tighter">
                  Products I've Built
                </h2>
              </div>
            }
          >
            <ProjectCarousel />
          </ContainerScroll>

          <Projects />
          <TechStack />
          <Services />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;

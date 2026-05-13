import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const rotatingSkills = [
  "modern digital products",
  "scalable backend systems",
  "seamless user experiences",
  "high-performance web apps",
  "AI-integrated solutions",
];

const TextRotator = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingSkills.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="relative inline-flex items-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="text-[#5a9ab8] font-medium"
        >
          {rotatingSkills[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const AnimatedTitle = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center mb-10 group cursor-default"
    >
      <div className="font-syne text-[clamp(2.5rem,6vw,5rem)] font-bold text-white flex items-center tracking-tighter leading-none">
        {/* R -> RIADH */}
        <div className="flex items-center">
          <span className="translate-x-2 group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-10">
            R
          </span>
          <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <span className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out delay-75 whitespace-nowrap">
              IADH
            </span>
          </div>
        </div>
        {/* V -> VISION */}
        <div className="flex items-center text-white/60 group-hover:text-white/90 transition-colors duration-700 group-hover:ml-3">
          <span className="-translate-x-2 group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] mix-blend-screen relative z-0">
            V
          </span>
          <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <span className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out delay-100 whitespace-nowrap">
              ISION
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto w-full gap-8">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#426C81] shadow-[0_0_8px_#426C81] animate-pulse" />
          <span className="text-xs font-medium tracking-[0.2em] text-white/60 uppercase">
            From idea to reality
          </span>
        </motion.div>

        {/* Logo / Title */}
        <AnimatedTitle />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl font-light text-white/70 leading-relaxed -mt-4"
        >
          I build <TextRotator /> — <br className="hidden sm:block" />
          with precision, speed, and premium design.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-[1px] bg-white/10 origin-center"
        />

        {/* Sub-description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm md:text-base text-white/40 font-light max-w-xl mx-auto leading-relaxed -mt-2"
        >
          Full-stack developer crafting digital experiences that are fast, intuitive, and thoughtfully engineered.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#projects"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-neutral-100 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,255,255,0.12)]"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/10 text-white/80 rounded-full text-sm font-semibold hover:bg-white/10 hover:text-white transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-md"
          >
            Contact Me
          </a>
        </motion.div>

      </div>



    </section>
  );
};

export default Hero;

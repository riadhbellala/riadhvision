import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const rotatingSkills = [
  "modern digital products.",
  "scalable backend systems.",
  "seamless user experiences.",
  "high-performance web apps.",
  "AI-integrated solutions."
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
    <div className="h-[1.5em] mt-4 flex items-center justify-center w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="text-[#426C81] font-semibold drop-shadow-[0_0_15px_rgba(66,108,129,0.5)] whitespace-nowrap text-3xl md:text-5xl lg:text-6xl"
        >
          {rotatingSkills[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const AnimatedTitle = () => {
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    // Automatically expand the title 1.2 seconds after mount
    const timer = setTimeout(() => setExpanded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center text-5xl md:text-7xl lg:text-8xl xl:text-[8rem] font-bold tracking-tighter mb-8 font-syne text-white relative z-10"
    >
      {/* R -> RIADH */}
      <div className="flex items-center">
        <span className={`${expanded ? 'translate-x-0' : 'translate-x-2 md:translate-x-4'} transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-10`}>R</span>
        <div className={`grid transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${expanded ? 'grid-cols-[1fr]' : 'grid-cols-[0fr]'}`}>
          <span className={`overflow-hidden transition-opacity duration-1000 ease-out delay-75 whitespace-nowrap ${expanded ? 'opacity-100' : 'opacity-0'}`}>
            IADH
          </span>
        </div>
      </div>
      
      {/* V -> VISION */}
      <div className={`flex items-center transition-colors duration-1000 ${expanded ? 'text-white/90 ml-2 md:ml-5' : 'text-white/60 ml-0'}`}>
        <span className={`${expanded ? 'translate-x-0' : '-translate-x-2 md:-translate-x-4'} transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] mix-blend-screen relative z-0`}>V</span>
        <div className={`grid transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${expanded ? 'grid-cols-[1fr]' : 'grid-cols-[0fr]'}`}>
          <span className={`overflow-hidden transition-opacity duration-1000 ease-out delay-100 whitespace-nowrap ${expanded ? 'opacity-100' : 'opacity-0'}`}>
            ISION
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto w-full">
        
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#426C81] shadow-[0_0_10px_#426C81] animate-pulse" />
          <span className="text-xs md:text-sm font-medium tracking-widest text-white/80 uppercase">
            From idea to reality
          </span>
        </motion.div>

        {/* Main Title (Animated RV -> RIADHVISION) */}
        <AnimatedTitle />

        {/* Storytelling / About Text with Animated Rotator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 w-full flex flex-col items-center mt-4"
        >
          <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white/90 font-syne leading-[1.4] max-w-4xl mx-auto flex flex-col items-center w-full">
            <span>I design clean interfaces and turn ambitious ideas into</span>
            <TextRotator />
          </h2>
          <p className="text-lg md:text-xl text-white/50 font-light max-w-2xl mx-auto leading-relaxed mt-6">
            Bridging the gap between engineering precision and premium aesthetics. I focus on creating digital experiences that are fast, intuitive, and deeply meaningful.
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto mt-12"
        >
          <a href="#projects" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1">
            View Projects
          </a>
          <a href="#contact" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-md">
            Contact Me
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;

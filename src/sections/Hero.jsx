import Marquee from "react-fast-marquee";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import Robot from "../components/Robot";

// We create a wrapper that generates a totally unique ID for each cloned instance in the marquee.
// This allows the browser to render 4+ copies of the robot scrolling smoothly without crashing WebGL!
const MarqueeRobot = () => {
  const uniqueId = useMemo(() => Math.random().toString(), []);
  return (
    <div className="w-32 h-32 md:w-64 md:h-64 lg:w-[400px] lg:h-[400px] mx-8 md:mx-16 inline-block relative pointer-events-auto mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={3} />
          <directionalLight position={[-10, -10, -5]} intensity={1} />
          {/* We turn off the massive "isHero" drift because it would fly out of its small marquee container */}
          <Robot scale={0.03} position={[0, -0.6, 0]} modelPath={`/models/mini_robot.glb?v=${uniqueId}`} isHero={false} />
        </Suspense>
      </Canvas>
    </div>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative flex flex-col justify-between min-h-screen bg-transparent text-white overflow-hidden pb-10">
      
      {/* Foreground Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none">
        
        {/* Top Left Text */}
        <div className="pt-32 pl-6 md:pl-12 text-white/50 text-xs md:text-sm tracking-[0.2em] uppercase font-light">
          Based in Algeria
        </div>

        {/* HUGE Marquee Text in Middle */}
        <div className="flex-1 flex flex-col justify-center">
          <Marquee speed={100} className="overflow-hidden w-full flex items-center mix-blend-difference">
            <h1 className="text-[120px] sm:text-[180px] md:text-[250px] lg:text-[320px] leading-none font-bold tracking-tighter whitespace-nowrap flex items-center text-white">
              Riadh Vision 
              <MarqueeRobot />
            </h1>
            <h1 className="text-[120px] sm:text-[180px] md:text-[250px] lg:text-[320px] leading-none font-bold tracking-tighter whitespace-nowrap flex items-center text-white">
              Riadh Vision 
              <MarqueeRobot />
            </h1>
          </Marquee>
        </div>

        {/* Bottom Section: Left CTA & Right Text */}
        <div className="w-full pb-10 px-6 md:px-12 flex flex-col-reverse md:flex-row items-start md:items-end justify-between gap-8 pointer-events-auto">
          
          {/* Left CTA - Premium Animated Button */}
          <RouterLink 
            to="/start" 
            className="group relative flex items-center gap-4 bg-white/[0.03] border border-white/10 backdrop-blur-xl text-white pl-8 pr-2 py-2 rounded-full text-base md:text-lg font-medium hover:bg-[#a1ebd4] hover:border-[#a1ebd4] hover:text-black hover:shadow-[0_0_30px_rgba(161,235,212,0.3)] transition-all duration-500 overflow-hidden"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            
            <span className="relative z-10 tracking-wide">Start a Project</span>
            <div className="relative z-10 w-10 h-10 rounded-full bg-white/10 group-hover:bg-black/10 flex items-center justify-center transition-colors duration-500">
              <Icon icon="lucide:arrow-up-right" className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </RouterLink>

          {/* Right Text */}
          <div className="flex flex-col gap-1 text-left md:text-right pointer-events-none">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-light text-white tracking-wide">Full-Stack Developer</h2>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-light text-white tracking-wide">Design Scalable Systems</h2>
          </div>
        </div>

      </div>

    </section>
  );
};

export default Hero;

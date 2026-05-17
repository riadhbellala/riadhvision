import Marquee from "react-fast-marquee";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
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

        {/* Bottom Right Text */}
        <div className="pb-10 pr-6 md:pr-12 text-right flex flex-col gap-1">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-light text-white tracking-wide">Full-Stack Developer</h2>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-light text-white tracking-wide">Design Scalable Systems</h2>
        </div>

      </div>

    </section>
  );
};

export default Hero;

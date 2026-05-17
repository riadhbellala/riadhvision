import { useRef, useEffect, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas} from "@react-three/fiber";
import { Float, Environment, ContactShadows, Center } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { step: "01", title: "Discovery", description: "We start with a conversation. You tell me your vision, problem, and goals. I ask the right questions — about users, scope, and what success looks like." },
  { step: "02", title: "Architecture", description: "Your idea becomes a technical plan: stack selection, database design, feature breakdown, and a project roadmap with clear milestones." },
  { step: "03", title: "Design", description: "Before logic is written, the interface is designed. We define the look, feel, and flow — making sure it feels premium and intuitive." },
  { step: "04", title: "Development", description: "Frontend, backend, APIs, database — all built clean, modular, and scalable. Progress demos shared throughout. You're never in the dark." },
  { step: "05", title: "Testing", description: "Tested across devices, browsers, and edge cases. Performance optimized. Security hardened. A product that doesn't break in the real world." },
  { step: "06", title: "Launch", description: "Deployment, DNS, CI/CD — all handled. Your product goes live with zero downtime. I stay available post-launch for fixes and growth." },
];

import Robot from "../components/Robot";



/* ── Main Section ────────────────────────────────────────────── */
const Journey = () => {
  const containerRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const cards = gsap.utils.toArray(".journey-step");
    
    cards.forEach((card) => {
      // Smoothly fade and slide in as it enters the center of the screen
      gsap.to(card, {
        opacity: 1,
        x: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 75%",
          end: "top 30%",
          scrub: true,
        }
      });
    });
  }, []);

  return (
    <section ref={containerRef} id="work" className="relative bg-transparent text-white py-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row relative">
        
        {/* Left: Timeline Content */}
        <div className="w-full md:w-[55%] z-10">
          
          {/* Minimal Header */}
          <div className="mb-24 md:mb-32">
            <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-4">The Process</p>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-none">
              How we get there.
            </h2>
          </div>

          {/* Minimal Timeline Layout */}
          <div className="relative">
            {/* Global Vertical Line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />

            <div className="flex flex-col gap-20 md:gap-32">
              {steps.map((item, i) => (
                <div 
                  key={i} 
                  className="journey-step relative opacity-20 -translate-x-8 pl-8 md:pl-16"
                >
                  {/* Glowing Dot on the line */}
                  <div className="absolute -left-[4.5px] top-3 md:top-5 w-[10px] h-[10px] rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                  
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
                    {/* Huge Minimal Number */}
                    <span className="text-5xl md:text-6xl font-light text-white/20 tracking-tighter w-20 flex-shrink-0">
                      {item.step}
                    </span>
                    
                    {/* Content */}
                    <div className="flex-1 mt-1 md:mt-3">
                      <h3 className="text-2xl md:text-4xl font-medium tracking-tight mb-4 text-white">
                        {item.title}
                      </h3>
                      <p className="text-base md:text-lg text-white/50 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive 3D Robot Canvas */}
        <div className={`z-0 ${isMobile ? "absolute inset-0 pointer-events-none overflow-hidden opacity-30 flex items-center justify-center pt-[20vh]" : "hidden md:block w-[45%] h-[80vh] sticky top-[10vh]"}`}>
          <Canvas camera={{ position: [0, 0, isMobile ? 8 : 6], fov: 45 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 10, 5]} intensity={3} />
              <directionalLight position={[-10, -10, -5]} intensity={1} />
              <pointLight position={[0, 5, 0]} intensity={2} />
              <Robot />
            </Suspense>
          </Canvas>
        </div>

      </div>
    </section>
  );
};

export default Journey;

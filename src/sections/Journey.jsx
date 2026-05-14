import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { step: "01", tag: "Discovery",   title: "You Share the Idea",        description: "We start with a conversation. You tell me your vision, problem, and goals. I ask the right questions — about users, scope, and what success looks like.", color: "#a1ebd4" },
  { step: "02", tag: "Planning",    title: "I Map the Architecture",    description: "Your idea becomes a technical plan: stack selection, database design, feature breakdown, and a project roadmap with clear milestones.",                  color: "#7dd3fc" },
  { step: "03", tag: "Design",      title: "UI & Experience First",     description: "Before logic is written, the interface is designed. We define the look, feel, and flow — making sure it feels premium and intuitive.",                       color: "#f9a8d4" },
  { step: "04", tag: "Development", title: "Building the Real Thing",   description: "Frontend, backend, APIs, database — all built clean, modular, and scalable. Progress demos shared throughout. You're never in the dark.",                    color: "#fcd34d" },
  { step: "05", tag: "Testing",     title: "Battle-Testing Everything", description: "Tested across devices, browsers, and edge cases. Performance optimized. Security hardened. A product that doesn't break in the real world.",             color: "#c4b5fd" },
  { step: "06", tag: "Launch",      title: "From Local to Live",        description: "Deployment, DNS, CI/CD — all handled. Your product goes live with zero downtime. I stay available post-launch for fixes and growth.",                         color: "#a1ebd4" },
];

/* ── 3D Core Component ────────────────────────────────────────── */
// It smoothly interpolates its material and distortion based on activeStep
const EvolvingCore = ({ activeStep }) => {
  const materialRef = useRef();
  
  // Define the target states for each step
  const states = [
    { distort: 0.8, speed: 8, color: "#a1ebd4", wireframe: true,  roughness: 0.8, metalness: 0.1, emissive: "#000000" }, // Idea: Chaotic energy
    { distort: 0.0, speed: 1, color: "#7dd3fc", wireframe: true,  roughness: 0.5, metalness: 0.8, emissive: "#000000" }, // Planning: Structured wireframe
    { distort: 0.3, speed: 2, color: "#f9a8d4", wireframe: false, roughness: 0.1, metalness: 0.9, emissive: "#000000" }, // Design: Smooth, glassy, beautiful
    { distort: 0.6, speed: 5, color: "#fcd34d", wireframe: false, roughness: 0.4, metalness: 0.6, emissive: "#221100" }, // Dev: Hard working, morphing, building
    { distort: 0.0, speed: 0, color: "#c4b5fd", wireframe: false, roughness: 0.2, metalness: 0.9, emissive: "#000000" }, // Testing: Perfect, solid, impenetrable
    { distort: 0.2, speed: 3, color: "#a1ebd4", wireframe: false, roughness: 0.1, metalness: 0.8, emissive: "#114433" }, // Launch: Alive, pulsing, glowing
  ];

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    const target = states[activeStep] || states[0];
    
    // Smoothly interpolate current values towards target values using lerp
    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, target.distort, delta * 3);
    materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, target.speed, delta * 3);
    materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, target.roughness, delta * 3);
    materialRef.current.metalness = THREE.MathUtils.lerp(materialRef.current.metalness, target.metalness, delta * 3);
    
    // Wireframe is a boolean, swap it at the halfway point of transition
    materialRef.current.wireframe = target.wireframe;

    // Color interpolation
    const targetColor = new THREE.Color(target.color);
    materialRef.current.color.lerp(targetColor, delta * 3);
    
    const targetEmissive = new THREE.Color(target.emissive);
    materialRef.current.emissive.lerp(targetEmissive, delta * 3);
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh scale={1.2}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          ref={materialRef}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
};

/* ── Main Section ────────────────────────────────────────────── */
const Journey = () => {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Setup ScrollTriggers for each card to update the active step
    const triggers = [];
    gsap.utils.toArray(".journey-card").forEach((card, i) => {
      const st = ScrollTrigger.create({
        trigger: card,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setActiveStep(i);
        },
      });
      triggers.push(st);
    });

    return () => triggers.forEach(t => t.kill());
  }, []);

  return (
    <section ref={containerRef} id="work" className="relative bg-transparent text-white py-24 min-h-screen">
      
      {/* Header */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto mb-16">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-4">The Process</p>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
          Idea <span className="text-white/20">→ Product.</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col md:flex-row relative">
        
        {/* Left: Scrollable Text Cards */}
        <div className="w-full md:w-1/2 flex flex-col gap-[30vh] pb-[30vh] z-10">
          {steps.map((item, index) => {
            const isActive = activeStep === index;
            return (
              <div 
                key={index} 
                className={`journey-card transition-all duration-700 ${isActive ? "opacity-100 scale-100" : "opacity-30 scale-95"}`}
              >
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-3xl p-6 lg:p-10 shadow-2xl relative overflow-hidden">
                  {/* Subtle glow background */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ background: `radial-gradient(circle at top left, ${item.color}, transparent 60%)` }} />
                  
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 relative z-10 flex-wrap">
                    <div 
                      className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center font-black text-sm md:text-lg bg-black/60 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                      style={{ borderColor: item.color, color: item.color }}
                    >
                      {item.step}
                    </div>
                    <span 
                      className="inline-block text-[9px] md:text-[11px] font-bold tracking-widest uppercase px-2 py-1 md:px-3 md:py-1.5 rounded-full border"
                      style={{ color: item.color, borderColor: item.color + "40", backgroundColor: item.color + "15" }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  
                  <h3 className="text-lg md:text-3xl font-bold tracking-tight mb-2 md:mb-4 relative z-10">{item.title}</h3>
                  <p className="text-[11px] md:text-lg text-white/60 font-light leading-relaxed relative z-10">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Sticky 3D Canvas (Desktop Only) */}
        <div className="hidden md:block w-1/2 h-[80vh] sticky top-[10vh] z-0">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} />
            <directionalLight position={[-10, -10, -5]} intensity={1} color="#a1ebd4" />
            <Environment preset="city" />
            <EvolvingCore activeStep={activeStep} />
          </Canvas>
          
          {/* Label below the 3D object */}
          <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
            <p className="text-sm tracking-[0.3em] uppercase text-white/40 font-light transition-all duration-500">
              Phase: <span style={{ color: steps[activeStep].color }} className="font-bold">{steps[activeStep].tag}</span>
            </p>
          </div>
        </div>

        {/* Mobile 3D Canvas Background (Behind cards) */}
        <div className="md:hidden absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="sticky top-[20vh] w-full h-[60vh] opacity-30 flex items-center justify-center">
            <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={2} />
              <Environment preset="city" />
              <EvolvingCore activeStep={activeStep} />
            </Canvas>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Journey;

import React from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import ServiceSummary from "./sections/ServiceSummary";
import Services from "./sections/Services";
import ReactLenis from "lenis/react";
import Works from "./sections/Works";
import ContactSummary from "./sections/ContactSummary";
import Contact from "./sections/Contact";
import Journey from "./sections/Journey";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";
import { useRef } from "react";

const Universe = () => {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x += delta * 0.02;
    }
  });
  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1.5} />
      <Sparkles count={300} scale={50} size={4} speed={0.4} opacity={0.6} color="#a1ebd4" />
    </group>
  );
};

const App = () => {
  return (
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-auto">
      {/* Global Universe Canvas — fixed behind all dark sections */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 1000 }}>
          <color attach="background" args={["#050505"]} />
          <Universe />
        </Canvas>
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <ServiceSummary />
        <Works />
        <Services />
        <Journey />
        <ContactSummary />
        <Contact />
      </div>
    </ReactLenis>
  );
};

export default App;

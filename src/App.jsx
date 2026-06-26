import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactLenis from "lenis/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";
import { useRef } from "react";

import Home from "./pages/Home";
import ProjectDetails from "./pages/ProjectDetails";
import ScrollToTop from "./components/ScrollToTop";

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
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-hidden">
      {/* Global Universe Canvas — fixed behind all dark sections */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 1000 }}>
          <color attach="background" args={["#050505"]} />
          <Universe />
        </Canvas>
      </div>

      <div className="relative z-10 min-h-screen">
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:slug" element={<ProjectDetails />} />
          </Routes>
        </Router>
      </div>
    </ReactLenis>
  );
};

export default App;

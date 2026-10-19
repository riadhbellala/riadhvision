import React, { Suspense, lazy, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactLenis, { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import Chatbot from "./components/Chatbot";

// Pages other than Home load on demand, so the first visit only downloads Home.
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const ProjectRequest = lazy(() => import("./pages/ProjectRequest"));
const Login = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
import ProtectedRoute from "./components/ProtectedRoute";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const lenisRef = useRef(null);

  // Keep ScrollTrigger in step with Lenis' smoothed scroll position.
  useLenis(ScrollTrigger.update);

  // Drive Lenis from GSAP's ticker so both run on a single animation loop.
  // The instance is read lazily because ReactLenis creates it after mount.
  useEffect(() => {
    const update = (time) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false }}
      className="relative w-screen min-h-screen overflow-x-hidden"
      style={{ position: "relative" }}
    >
      <div className="min-h-screen">
        <Router>
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen bg-ink" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:slug" element={<ProjectDetails />} />
            <Route path="/start" element={<ProjectRequest />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
          </Suspense>
          <Chatbot />
        </Router>
      </div>
    </ReactLenis>
  );
};

export default App;

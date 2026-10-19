import React from "react";
import NavbarV2 from "../v2/components/NavbarV2";
import HeroBackground from "../v2/components/HeroBackground";
import Hero from "../v2/sections/Hero";
import Manifesto from "../v2/sections/Manifesto";
import Services from "../v2/sections/Services";
import Work from "../v2/sections/Work";
import FocusEngine from "../v2/sections/FocusEngine";
import Contact from "../v2/sections/Contact";
import Footer from "../v2/sections/Footer";
import { useReveal } from "../v2/components/useReveal";

// v2 "Aura" skeleton. The v1 sections in src/sections stay in the repo, unrendered.
// ScrollToTop and the Chatbot are rendered by App.jsx.
const Home = () => {
  useReveal();
  return (
    <>
      {/* One fixed background for the whole site (after the reference); content scrolls over it */}
      <HeroBackground />
      <NavbarV2 />
      {/* Each section paints its own grainy gradient field; they cross-dissolve.
          Clip only horizontally so fields can extend above and below sections. */}
      <div className="relative overflow-x-clip">
        <main>
          <Hero />
          <Manifesto />
          <Services />
          <Work />
          <FocusEngine />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;

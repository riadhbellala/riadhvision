import React from "react";
import Navbar from "../sections/Navbar";
import Hero from "../sections/Hero";
import ServiceSummary from "../sections/ServiceSummary";
import Services from "../sections/Services";
import Works from "../sections/Works";
import ContactSummary from "../sections/ContactSummary";
import Contact from "../sections/Contact";
import Journey from "../sections/Journey";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <ServiceSummary />
      <Works />
      <Services />
      <Journey />
      <ContactSummary />
      <Contact />
    </>
  );
};

export default Home;

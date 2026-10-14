import React from "react";
import TicketNavbar from "../components/TicketNavbar";
import Hero from "../sections/Hero";
import ServiceSummary from "../sections/ServiceSummary";
import Services from "../sections/Services";
import Works from "../sections/Works";
import ContactSummary from "../sections/ContactSummary";
import Contact from "../sections/Contact";
import Journey from "../sections/Journey";
import SectionShell from "../components/SectionShell";
import FreeLines from "../components/FreeLines";

const Home = () => {
  return (
    <>
      <TicketNavbar />
      {/* Page wrapper: FreeLines run behind every section (sections are z-10;
          light ones are transparent, navy panels cover the ribbon). */}
      <div className="relative">
        <FreeLines />
        <Hero />
        <ServiceSummary />
        <Works />
        <Services />
        <Journey />
        {/* Contact summary + footer share one navy panel */}
        <SectionShell id="contact" theme="navy" panel className="pb-6 md:pb-8">
          <ContactSummary />
          <Contact />
        </SectionShell>
      </div>
    </>
  );
};

export default Home;

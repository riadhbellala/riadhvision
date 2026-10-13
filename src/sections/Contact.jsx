import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { projects, socials } from "../constants";

const socialIcons = {
  Instagram: "mdi:instagram",
  WhatsApp: "mdi:whatsapp",
  GitHub: "mdi:github",
};

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Works", href: "#work" },
  { label: "Contact", href: "#contact" },
];

const serviceLinks = [
  "Custom App",
  "Full-stack",
  "API Integration",
  "SaaS Softwares",
  "E-Commerce",
];

const Contact = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      window.location.href = `mailto:riadh5726@gmail.com?subject=Getting in Touch&body=From: ${email}`;
    }
  };

  return (
    <footer className="border-t border-base/10">
      <div>

        {/* Top Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-14 md:pt-20 pb-10">

          {/* Left: Stay Updated + Socials */}
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-6 text-base">
                Stay Updated with Riadh's News
              </h3>
              {/* Email Input */}
              <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-base/10 border border-base/10 focus-within:border-base/40 rounded-full px-5 py-3 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="flex-1 bg-transparent text-sm text-base placeholder:text-base/70 outline-none"
                />
                <button
                  type="submit"
                  className="w-8 h-8 bg-accent text-navy rounded-full flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform duration-200"
                >
                  <Icon icon="lucide:arrow-up-right" className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socials.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-base/10 text-accent rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
                  aria-label={social.name}
                >
                  <Icon icon={socialIcons[social.name] || "mdi:link"} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Nav Columns */}
          <div className="grid grid-cols-3 gap-6">
            {/* Nav Links */}
            <div className="flex flex-col gap-3">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="text-sm text-base/70 hover:text-accent transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Projects */}
            <div className="flex flex-col gap-3">
              {projects.slice(0, 5).map((p, i) => (
                <a
                  key={i}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-base/70 hover:text-accent transition-colors duration-200"
                >
                  {p.name}
                </a>
              ))}
            </div>

            {/* Services */}
            <div className="flex flex-col gap-3">
              {serviceLinks.map((s, i) => (
                <span key={i} className="text-sm text-base/70">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-base/10 mx-auto" />

        {/* Huge Name Typography */}
        <div className="overflow-hidden leading-none select-none pt-4">
          <h1
            className="font-black tracking-tighter text-base w-full whitespace-nowrap text-center"
            style={{ fontSize: "clamp(40px, 12.5vw, 176px)", lineHeight: 0.85 }}
          >
            RIADHVISION
          </h1>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-2 text-xs text-base/70 font-light">
          <span>© {new Date().getFullYear()} Riadh Bellala. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="/admin/login" className="hover:text-base transition-colors">Admin Login</a>
            <span>Built &amp; Designed by Riadh Vision</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Contact;

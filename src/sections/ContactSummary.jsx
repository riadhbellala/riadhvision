import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Icon } from "@iconify/react/dist/iconify.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

const ContactSummary = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const btnRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Magnetic button
  const handleMouseMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btnRef.current, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: "power2.out" });
  };
  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.5)" });
    setHovered(false);
  };

  useGSAP(() => {
    // Animate each word of the heading on scroll
    if (!headingRef.current) return;
    const split = new SplitText(headingRef.current, { type: "words" });
    gsap.from(split.words, {
      y: 120,
      opacity: 0,
      rotateX: -80,
      stagger: 0.1,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-transparent text-white flex flex-col items-center justify-center overflow-hidden px-6 py-32"
    >
      {/* Faint background label */}
      <p className="absolute top-10 left-0 right-0 text-center text-xs tracking-[0.4em] uppercase text-white/20 font-light">
        Available for new projects
      </p>

      {/* Decorative glowing orb */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#a1ebd4]/5 blur-[120px] pointer-events-none" />

      {/* Main Heading */}
      <div className="text-center mb-16" style={{ perspective: "800px" }}>
        <h2
          ref={headingRef}
          className="text-[60px] sm:text-[80px] md:text-[110px] lg:text-[140px] font-black tracking-tighter leading-none uppercase"
          style={{ transformStyle: "preserve-3d" }}
        >
          Got a Project?
        </h2>
        <p className="text-base md:text-xl text-white/40 font-light mt-6 max-w-md mx-auto">
          Whether it's a new build or improving an existing product — let's create something meaningful together.
        </p>
      </div>

      {/* Magnetic CTA Button */}
      <div
        className="relative inline-block"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setHovered(true)}
      >
        <a
          href="mailto:riadh5726@gmail.com"
          ref={btnRef}
          className="relative flex items-center gap-4 bg-white text-black font-semibold text-lg md:text-xl px-10 py-5 rounded-full group overflow-hidden shadow-[0_0_40px_rgba(161,235,212,0.15)] hover:shadow-[0_0_60px_rgba(161,235,212,0.3)] transition-shadow duration-500"
        >
          <span className="relative z-10">Let's Talk</span>
          <div className="relative z-10 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
            <Icon icon="lucide:arrow-up-right" className="w-5 h-5" />
          </div>
          {/* Green fill on hover */}
          <div className="absolute inset-0 bg-[#a1ebd4] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left rounded-full" />
        </a>
      </div>

      {/* Bottom decorative divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default ContactSummary;

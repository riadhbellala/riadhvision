import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-scroll";
import { Icon } from "@iconify/react/dist/iconify.js";

const Navbar = () => {
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const contactRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const tl = useRef(null);
  const iconTl = useRef(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  useGSAP(() => {
    gsap.set(navRef.current, { xPercent: 100 });
    gsap.set([linksRef.current, contactRef.current], {
      autoAlpha: 0,
      x: -20,
    });

    tl.current = gsap
      .timeline({ paused: true })
      .to(navRef.current, {
        xPercent: 0,
        duration: 1,
        ease: "power3.out",
      })
      .to(
        linksRef.current,
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
        },
        "<"
      )
      .to(
        contactRef.current,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "<+0.2"
      );

    iconTl.current = gsap
      .timeline({ paused: true })
      .to(topLineRef.current, {
        rotate: 45,
        y: 3.3,
        duration: 0.3,
        ease: "power2.inOut",
      })
      .to(
        bottomLineRef.current,
        {
          rotate: -45,
          y: -3.3,
          duration: 0.3,
          ease: "power2.inOut",
        },
        "<"
      );
  }, []);

  const toggleMenu = () => {
    if (isOpen) {
      tl.current.reverse();
      iconTl.current.reverse();
    } else {
      tl.current.play();
      iconTl.current.play();
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* FULLSCREEN MOBILE OVERLAY MENU (Kept for mobile devices) */}
      <nav
        ref={navRef}
        className="fixed z-50 flex flex-col justify-between w-full h-full px-6 md:px-10 uppercase bg-black text-white/80 py-28 gap-y-10 md:hidden"
      >
        <div className="flex flex-col text-4xl gap-y-2">
          {["home", "work", "services", "contact"].map((section, index) => (
            <div key={index} ref={(el) => (linksRef.current[index] = el)}>
              <Link
                className="transition-all duration-700 cursor-pointer hover:text-white hover:tracking-[0.5rem] ease-in-out hover:font-bold"
                to={section}
                smooth
                onClick={toggleMenu}
              >
                {section}
              </Link>
            </div>
          ))}
        </div>
        <div ref={contactRef} className="flex flex-col gap-8 font-light">
          <div>
            <p className="tracking-wider text-white/50">E-mail</p>
            <p className="text-xl tracking-widest lowercase text-pretty">riadh5726@gmail.com</p>
          </div>
        </div>
      </nav>

      {/* TOP HORIZONTAL NAVBAR — Floating glass pill */}
      <div 
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl transition-all duration-500"
      >
        <div className="flex items-center justify-between px-6 md:px-10 py-3.5 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_4px_32px_rgba(0,0,0,0.3)] rounded-full">

          {/* Left: Expandable Logo */}
          <div 
            className="flex items-center cursor-pointer font-bold text-lg tracking-widest text-white uppercase select-none"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <span>R</span>
            <span 
              className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isLogoHovered ? 'max-w-[60px] opacity-100' : 'max-w-0 opacity-0'}`}
            >
              IADH
            </span>
            <span>V</span>
            <span 
              className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isLogoHovered ? 'max-w-[60px] opacity-100' : 'max-w-0 opacity-0'}`}
            >
              ISION
            </span>
          </div>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
            <Link to="work" smooth duration={1000} className="cursor-pointer hover:text-white transition-colors flex items-center gap-1">
              Works <span className="text-white/40">+</span>
            </Link>
            <Link to="services" smooth duration={1000} className="cursor-pointer hover:text-white transition-colors flex items-center gap-1">
              Services <span className="text-white/40">+</span>
            </Link>
            <Link to="contact" smooth duration={1000} className="cursor-pointer hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Right: CTA & Hamburger */}
          <div className="flex items-center gap-3">
            <Link 
              to="contact" 
              smooth 
              duration={1000} 
              className="hidden md:flex cursor-pointer items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-[#a1ebd4] transition-colors duration-300"
            >
              Get In Touch <Icon icon="lucide:arrow-up-right" className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger */}
            <div
              className="md:hidden flex flex-col items-center justify-center gap-1.5 cursor-pointer w-9 h-9 rounded-full bg-white/10 border border-white/20"
              onClick={toggleMenu}
            >
              <span ref={topLineRef} className="block w-4 h-0.5 bg-white rounded-full origin-center"></span>
              <span ref={bottomLineRef} className="block w-4 h-0.5 bg-white rounded-full origin-center"></span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;

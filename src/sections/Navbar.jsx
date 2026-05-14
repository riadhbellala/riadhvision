import React, { useEffect, useRef, useState } from "react";
import { socials } from "../constants";
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
  const [showBurger, setShowBurger] = useState(true);
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

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (isOpen) {
        setShowBurger(true);
        return;
      }
      const currentScrollY = window.scrollY;
      setShowBurger(currentScrollY <= lastScrollY || currentScrollY < 10);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

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

      {/* TOP HORIZONTAL NAVBAR */}
      <div 
        className={`w-full fixed top-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 transition-transform duration-500 ${showBurger ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Left: Expandable Logo */}
        <div 
          className="flex items-center cursor-pointer font-bold text-2xl tracking-widest text-white mix-blend-difference uppercase select-none"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <span>R</span>
          <span 
            className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isLogoHovered ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'}`}
          >
            IADH
          </span>
          <span>V</span>
          <span 
            className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isLogoHovered ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'}`}
          >
            ISION
          </span>
        </div>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white mix-blend-difference">
          <Link to="work" smooth duration={1000} className="cursor-pointer hover:text-white/70 transition-colors flex items-center gap-1">
            Works <span className="text-white/50">+</span>
          </Link>
          <Link to="services" smooth duration={1000} className="cursor-pointer hover:text-white/70 transition-colors flex items-center gap-1">
            Services <span className="text-white/50">+</span>
          </Link>
          <Link to="contact" smooth duration={1000} className="cursor-pointer hover:text-white/70 transition-colors">
            Contact
          </Link>
        </div>

        {/* Right: Desktop CTA Button & Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <Link 
            to="contact" 
            smooth 
            duration={1000} 
            className="hidden md:flex cursor-pointer items-center gap-2 bg-[#e5e5e0] text-black px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform duration-300"
          >
            Get In Touch <Icon icon="lucide:arrow-up-right" className="w-4 h-4" />
          </Link>

          {/* Mobile Hamburger Icon */}
          <div
            className="md:hidden flex flex-col items-center justify-center gap-1 transition-all duration-300 bg-white mix-blend-difference rounded-full cursor-pointer w-10 h-10"
            onClick={toggleMenu}
          >
            <span
              ref={topLineRef}
              className="block w-5 h-0.5 bg-black rounded-full origin-center"
            ></span>
            <span
              ref={bottomLineRef}
              className="block w-5 h-0.5 bg-black rounded-full origin-center"
            ></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

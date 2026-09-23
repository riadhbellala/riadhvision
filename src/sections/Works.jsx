import { useRef, useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { projects } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

// ── Gallery Image Component ──────────────────────────────────────────────────
// isHovered is controlled by the outer container (above the z-20 Link overlay)
// isActive drives mobile auto-cycle
const GalleryImage = ({ project, isActive, isHovered }) => {
  const gallery = project.gallery || [project.image];
  const [frameIndex, setFrameIndex] = useState(0);
  const intervalRef = useRef(null);

  const startCycle = useCallback(() => {
    if (gallery.length <= 1) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % gallery.length);
    }, 600);
  }, [gallery.length]);

  const stopCycle = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setFrameIndex(0);
  }, []);

  // Desktop: start/stop based on isHovered prop (set by outer container)
  useEffect(() => {
    if (window.innerWidth < 768) return;
    if (isHovered && isActive) {
      startCycle();
    } else {
      stopCycle();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, isActive, startCycle, stopCycle]);

  // Mobile: auto-cycle when in view
  useEffect(() => {
    if (window.innerWidth >= 768) return;
    if (isActive && gallery.length > 1) {
      startCycle();
    } else {
      stopCycle();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, gallery.length, startCycle, stopCycle]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {gallery.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${project.name} screenshot ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            opacity: i === frameIndex ? 1 : 0,
            transition: "opacity 300ms ease",
            willChange: "opacity",
          }}
        />
      ))}

      {/* Dot indicators */}
      {gallery.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {gallery.map((_, i) => (
            <span
              key={i}
              className="block rounded-full transition-all duration-200"
              style={{
                width: i === frameIndex ? "16px" : "6px",
                height: "6px",
                background: i === frameIndex ? "white" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Section ─────────────────────────────────────────────────────────────
const Works = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isContainerHovered, setIsContainerHovered] = useState(false);
  const rightColumnRef = useRef(null);

  useGSAP(() => {
    const projectBlocks = gsap.utils.toArray(".project-block");
    projectBlocks.forEach((block, index) => {
      ScrollTrigger.create({
        trigger: block,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
      });
    });
  }, []);

  const activeProject = projects[activeIndex];

  return (
    <section id="work" className="relative w-full bg-[#e5e5e0] text-black">
      <div className="flex flex-col md:flex-row w-full">

        {/* Left Side: Sticky Image Preview */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-screen sticky top-0 flex flex-col items-start justify-center p-6 md:p-16 overflow-hidden">

          <div className="z-10 pointer-events-none w-full mb-6 md:mb-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">Selected Works</h2>
            <p className="text-xs md:text-sm font-light mt-2 max-w-sm text-black/60">
              Structure in Code, Story in Results.
            </p>
          </div>

          {/* 
            onMouseEnter/Leave here — ABOVE the z-20 Link overlay.
            This is the actual outer container div, so it fires correctly.
          */}
          <div
            className="group/container relative w-full flex-1 max-h-[50vh] md:max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl"
            onMouseEnter={() => setIsContainerHovered(true)}
            onMouseLeave={() => setIsContainerHovered(false)}
          >

            {projects.map((project, index) => (
              <div
                key={project.id}
                className="absolute inset-0 w-full h-full"
                style={{
                  opacity: index === activeIndex ? 1 : 0,
                  transform: index === activeIndex ? "scale(1)" : "scale(1.05)",
                  transition: "opacity 700ms ease, transform 700ms ease",
                  pointerEvents: "none", // Let parent handle events
                }}
              >
                {project.gallery ? (
                  <GalleryImage
                    project={project}
                    isActive={index === activeIndex}
                    isHovered={isContainerHovered}
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="absolute inset-0 w-full h-full object-cover object-top group-hover/container:object-bottom"
                    style={{
                      transitionProperty: "object-position",
                      transitionDuration: "5s",
                      transitionTimingFunction: "ease-in-out",
                    }}
                  />
                )}
              </div>
            ))}

            {/* Overlay link — z-20, sits on top but parent div catches hover */}
            <Link
              to={`/project/${activeProject?.slug}`}
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity duration-300 group cursor-pointer z-20"
            >
              <div className="bg-white text-black rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                <span className="sr-only">View Project</span>
                <Icon icon="lucide:arrow-up-right" className="w-8 h-8" />
              </div>
            </Link>
          </div>
        </div>

        {/* Right Side: Vertically Scrolling List */}
        <div ref={rightColumnRef} className="w-full md:w-1/2 flex flex-col py-[10vh] md:py-[50vh]">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to={`/project/${project.slug}`}
              className="project-block group flex flex-col justify-center min-h-[50vh] px-6 md:px-24 border-b border-black/10 last:border-b-0 cursor-pointer"
            >
              <h1 className={`text-[40px] sm:text-[60px] md:text-[80px] font-bold leading-none tracking-tighter uppercase transition-colors duration-500 ${index === activeIndex ? "text-black" : "text-black/30"}`}>
                {project.name.split(" — ")[0]}
              </h1>
              {project.name.includes(" — ") && (
                <p className={`mt-2 text-sm md:text-base font-light uppercase tracking-widest transition-colors duration-500 ${index === activeIndex ? "text-black/60" : "text-black/20"}`}>
                  {project.name.split(" — ")[1]}
                </p>
              )}
              <p className={`mt-4 text-sm font-light leading-relaxed max-w-sm transition-colors duration-500 ${index === activeIndex ? "text-black/70" : "text-black/20"}`}>
                {project.description}
              </p>
              <div className={`mt-6 flex items-center gap-2 text-xs font-mono uppercase tracking-widest transition-all duration-500 ${index === activeIndex ? "text-black opacity-100 translate-x-0" : "text-black/20 opacity-0 -translate-x-2"}`}>
                <span>View Project</span>
                <Icon icon="lucide:arrow-up-right" className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Works;

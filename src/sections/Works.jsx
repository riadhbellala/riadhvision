import { useRef, useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { projects } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import SectionShell from "../components/SectionShell";
import SectionHeader from "../components/SectionHeader";

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
                background: i === frameIndex ? "var(--color-base)" : "color-mix(in srgb, var(--color-base) 40%, transparent)",
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
  const sectionRef = useRef(null);

  // Images change the section's height as they load; re-measure all
  // ScrollTriggers (this section's and everything below it) once they're in.
  useEffect(() => {
    const imgs = [...sectionRef.current.querySelectorAll("img")];
    let cancelled = false;
    Promise.all(
      imgs.map((img) =>
        img.complete
          ? null
          : new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            })
      )
    ).then(() => !cancelled && ScrollTrigger.refresh());
    return () => {
      cancelled = true;
    };
  }, []);

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
    <SectionShell
      ref={sectionRef}
      id="work"
      theme="light"
      className="text-navy"
    >
      <SectionHeader number="02" eyebrow="Work" title="Selected Works" intro="Structure in Code, Story in Results." />

      <div data-anchor="work-row" className="flex flex-col md:flex-row w-full">

        {/* Left Side: Sticky Image Preview (sticks below the fixed Navbar) */}
        <div className="w-full md:w-1/2 h-[45vh] md:h-[calc(100vh-9rem)] sticky top-[92px] md:top-28 z-10 flex flex-col items-start justify-center py-4 md:pr-10 overflow-hidden">

          {/* 
            onMouseEnter/Leave here — ABOVE the z-20 Link overlay.
            This is the actual outer container div, so it fires correctly.
          */}
          <div
            className="group/container relative w-full flex-1 max-h-[50vh] md:max-h-[70vh] rounded-2xl overflow-hidden border border-navy/10 shadow-md"
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
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-navy/20 transition-opacity duration-300 group cursor-pointer z-20"
            >
              <div className="bg-base text-navy rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                <span className="sr-only">View Project</span>
                <Icon icon="lucide:arrow-up-right" className="w-8 h-8" />
              </div>
            </Link>
          </div>
        </div>

        {/* Right Side: Vertically Scrolling List */}
        <div ref={rightColumnRef} className="w-full md:w-1/2 flex flex-col pt-[10vh] pb-[10vh] md:pt-0 md:pb-[35vh]">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to={`/project/${project.slug}`}
              className="project-block group flex flex-col justify-center min-h-[50vh] md:px-12 border-b border-navy/10 last:border-b-0 cursor-pointer"
            >
              <h1 className={`text-[40px] sm:text-[60px] md:text-[clamp(32px,4.6vw,64px)] break-words font-bold leading-none tracking-tighter uppercase transition-colors duration-500 ${index === activeIndex ? "text-navy" : "text-navy/55"}`}>
                {project.name.split(" — ")[0]}
              </h1>
              {project.name.includes(" — ") && (
                <p className={`mt-2 text-sm md:text-body font-light uppercase tracking-widest transition-colors duration-500 ${index === activeIndex ? "text-navy/80" : "text-navy/70"}`}>
                  {project.name.split(" — ")[1]}
                </p>
              )}
              <p className={`mt-4 text-sm font-light leading-relaxed max-w-sm transition-colors duration-500 ${index === activeIndex ? "text-navy/80" : "text-navy/70"}`}>
                {project.description}
              </p>
              <div className={`mt-6 flex items-center gap-2 text-xs font-mono uppercase tracking-widest transition-all duration-500 ${index === activeIndex ? "text-navy opacity-100 translate-x-0" : "text-navy/70 opacity-0 -translate-x-2"}`}>
                <span>View Project</span>
                <Icon icon="lucide:arrow-up-right" className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </SectionShell>
  );
};

export default Works;

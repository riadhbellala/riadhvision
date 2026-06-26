import { useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { projects } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Works = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const rightColumnRef = useRef(null);

  useGSAP(() => {
    // We create a ScrollTrigger for each project block on the right to update the active image on the left
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

          <div className="group/container relative w-full flex-1 max-h-[50vh] md:max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
            {projects.map((project, index) => (
              <img
                key={project.id}
                src={project.image}
                alt={project.name}
                className={`absolute inset-0 w-full h-full object-cover object-top group-hover/container:object-bottom ${
                  index === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
                style={{
                  transitionProperty: "object-position, opacity, transform",
                  transitionDuration: "5s, 700ms, 700ms",
                  transitionTimingFunction: "ease-in-out"
                }}
              />
            ))}
            
            {/* Overlay link button */}
            <Link 
              to={`/project/${projects[activeIndex].slug}`} 
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity duration-300 group cursor-pointer"
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

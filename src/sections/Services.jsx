import { useRef } from "react";
import { servicesData } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useGSAP(() => {
    const container = scrollContainerRef.current;
    
    gsap.to(container, {
      x: () => -(container.scrollWidth - window.innerWidth + window.innerWidth * 0.1), 
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        end: () => "+=" + container.scrollWidth,
      },
    });
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="services" 
      className="h-[100svh] w-full bg-transparent text-white overflow-hidden flex flex-col pt-20 md:pt-24 pb-8 rounded-t-4xl"
    >
      {/* Title Section */}
      <div className="w-full text-center px-6 mb-4 md:mb-8 flex-shrink-0">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-2">
          My Services
        </h2>
        <p className="text-sm md:text-base font-light text-white/50 max-w-xl mx-auto">
          End-to-end development that transforms ideas into scalable digital products.
        </p>
      </div>

      {/* Horizontal Scrolling Track */}
      <div className="flex-1 flex items-center min-h-0 w-full">
        <div 
          ref={scrollContainerRef} 
          className="flex h-full gap-6 md:gap-10 px-[10vw] items-center"
          style={{ width: "max-content" }}
        >
          {servicesData.map((service, index) => (
            <div 
              key={index} 
              className="w-[85vw] md:w-[60vw] lg:w-[40vw] h-[85%] max-h-[500px] flex-shrink-0 bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 md:p-8 lg:p-10 flex flex-col shadow-2xl hover:bg-[#111] transition-colors duration-300 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="flex-shrink-0">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-white/60 font-light leading-relaxed mb-6">
                  "{service.description}"
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-auto flex-shrink-0">
                {service.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                      <span className="text-[#a1ebd4] text-sm font-medium">{itemIndex + 1}</span>
                    </div>
                    <div className="flex flex-col pt-1">
                      <span className="text-base md:text-lg font-medium text-white/90">{item.title}</span>
                      {item.description && (
                        <span className="text-xs md:text-sm text-white/50 mt-1">{item.description}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

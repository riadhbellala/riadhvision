import { useRef } from "react";
import { servicesData } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useGSAP(() => {
    // Only apply GSAP horizontal scroll on desktop
    if (window.innerWidth < 768) return;

    const container = scrollContainerRef.current;
    
    // Calculate the distance to scroll horizontally
    // It's the total width of the container minus the viewport width
    // plus a little padding at the end
    const scrollWidth = container.scrollWidth - window.innerWidth + window.innerWidth * 0.15;

    gsap.to(container, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: pinRef.current,
        pin: true,
        scrub: 1,
        start: "center center",
        end: () => "+=" + scrollWidth,
      },
    });
  }, []);

  return (
    <section id="services" ref={sectionRef} className="bg-transparent text-white pt-20 md:pt-28">
      {/* Title — normal flow, outside the pinned area */}
      <div className="w-full text-center px-6 mb-12">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-3">My Services</h2>
        <p className="text-sm md:text-base font-light text-white/50 max-w-xl mx-auto">
          End-to-end development that transforms ideas into scalable digital products.
        </p>
      </div>

      {/* ── Mobile: vertical cards ── */}
      <div className="md:hidden px-5 pb-16 flex flex-col gap-6">
        {servicesData.map((service, index) => (
          <div key={index} className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
            <h3 className="text-xl font-bold tracking-tight">{service.title}</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed">"{service.description}"</p>
            <div className="flex flex-col gap-3 mt-auto">
              {service.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 mt-0.5">
                    <span className="text-[#a1ebd4] text-xs font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white/90">{item.title}</span>
                    {item.description && <p className="text-xs text-white/40 mt-0.5">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: pinned horizontal scroll area ── */}
      <div ref={pinRef} className="hidden md:flex h-[80vh] items-center overflow-hidden w-full">
        <div
          ref={scrollContainerRef}
          className="flex gap-8 px-[10vw] items-stretch h-[85%] max-h-[600px]"
          style={{ width: "max-content" }}
        >
          {servicesData.map((service, i) => (
            <div
              key={i}
              className="w-[60vw] lg:w-[45vw] flex-shrink-0 bg-[#0d0d0d] border border-white/10 rounded-3xl p-8 lg:p-10 flex flex-col shadow-2xl hover:bg-[#111] hover:border-white/20 transition-all duration-300 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div>
                <h3 className="text-2xl lg:text-4xl font-semibold tracking-tight mb-4">{service.title}</h3>
                <p className="text-sm md:text-base text-white/60 font-light leading-relaxed mb-6">"{service.description}"</p>
              </div>
              <div className="flex flex-col gap-4 mt-auto">
                {service.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#a1ebd4] text-sm font-bold">{j + 1}</span>
                    </div>
                    <div className="flex flex-col pt-1">
                      <p className="text-base lg:text-lg font-medium text-white/90">{item.title}</p>
                      {item.description && <p className="text-sm text-white/50 mt-0.5">{item.description}</p>}
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

import React, { useRef, useState, useEffect } from "react";
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import { servicesData } from "../constants";
import ServiceCard from "../components/ServiceCard";

const Services = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const targetRef = useRef(null);
  const horizontalContainerRef = useRef(null);
  const [measurements, setMeasurements] = useState({ scrollRange: 0, dynamicHeight: "auto" });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setMeasurements({ scrollRange: 0, dynamicHeight: "auto" });
      return;
    }

    const updateMeasurements = () => {
      if (horizontalContainerRef.current) {
        const totalWidth = horizontalContainerRef.current.scrollWidth;
        const viewportW = window.innerWidth;
        const range = totalWidth - viewportW;
        // Add a little padding at the end for safe range
        const safeRange = range > 0 ? range + window.innerWidth * 0.1 : 0;

        setMeasurements({
          scrollRange: safeRange,
          dynamicHeight: `${safeRange + window.innerHeight}px`,
        });
      }
    };

    updateMeasurements();

    const timeout = setTimeout(updateMeasurements, 100);
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateMeasurements);
    });

    if (horizontalContainerRef.current) {
      resizeObserver.observe(horizontalContainerRef.current);
    }

    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
    };
  }, [isDesktop, servicesData]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -measurements.scrollRange]);
  const smoothX = useSpring(x, { stiffness: 400, damping: 60, restDelta: 0.5 });

  return (
    <section
      id="services"
      ref={targetRef}
      className="relative w-full bg-transparent text-white pt-20 md:pt-0"
      style={{ height: measurements.dynamicHeight }}
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] md:w-[50%] h-[300px] bg-[#a1ebd4]/5 blur-[120px] rounded-full pointer-events-none" />

      <div
        className={`w-full ${
          isDesktop ? "sticky top-0 h-screen flex items-center overflow-hidden" : "relative flex flex-col px-6 pb-20 gap-8"
        }`}
      >
        {!isDesktop ? (
          <>
            <div className="w-full text-center mb-8 relative z-10">
              <h2 className="text-4xl font-bold tracking-tighter mb-4 text-white">My Services</h2>
              <p className="text-sm font-light text-white/50 max-w-xl mx-auto">
                End-to-end development that transforms ideas into scalable digital products.
              </p>
            </div>
            {servicesData.map((service, index) => (
              <ServiceCard key={index} service={service} isDesktop={false} />
            ))}
          </>
        ) : (
          <motion.div
            ref={horizontalContainerRef}
            style={{ x: smoothX }}
            className="flex px-[10vw] w-max items-center h-full relative z-10 gap-8 lg:gap-16"
          >
            {/* Title Section (Leftmost in scroll) */}
            <div className="w-[60vw] lg:w-[40vw] shrink-0 flex flex-col justify-center pr-10">
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 text-white uppercase">
                My Services
              </h2>
              <p className="text-xl md:text-2xl font-light text-white/50 leading-relaxed">
                End-to-end development that transforms ideas into scalable digital products.
              </p>
              <div className="mt-12 flex items-center gap-4">
                <div className="h-px w-24 bg-white/20" />
                <span className="text-sm font-mono text-white/40 uppercase tracking-widest">
                  Scroll to explore
                </span>
              </div>
            </div>

            {/* Cards */}
            {servicesData.map((service, index) => (
              <ServiceCard key={index} service={service} isDesktop={true} />
            ))}

            {/* End Section (Rightmost in scroll) */}
            <div className="w-[40vw] shrink-0 flex flex-col justify-center items-center pl-10">
              <h3 className="text-[10vw] font-black tracking-tighter text-white/5 uppercase">
                End
              </h3>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Services;

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const ServiceSummary = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const imageContainerRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const bgTextRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    // Parallax scrolling for huge background text
    gsap.to(bgTextRef.current, {
      xPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        scrub: true,
      },
    });

    // Creative clip-path reveal for the image container
    tl.from(imageContainerRef.current, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      duration: 1.5,
      ease: "power4.inOut",
    });

    // Image scale down while revealing
    tl.from(
      imageRef.current,
      {
        scale: 1.3,
        duration: 1.5,
        ease: "power4.out",
      },
      "<"
    );

    // Text fade and slide in
    tl.from(
      text1Ref.current,
      {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.8"
    );

    tl.from(
      text2Ref.current,
      {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.6"
    );
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-transparent overflow-hidden flex items-center pt-32 pb-32"
    >
      {/* Huge Background Text */}
      <div
        ref={bgTextRef}
        className="absolute top-[15%] left-0 whitespace-nowrap text-white text-[100px] sm:text-[150px] md:text-[200px] lg:text-[250px] font-medium tracking-tighter select-none z-0"
      >
        Full-Stack Software Engineer
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 h-full pt-20">
        
        {/* Left: Image with creative reveal */}
        <div className="w-full lg:w-5/12 flex justify-center lg:justify-start">
          <div 
            ref={imageContainerRef}
            className="w-full max-w-[420px] aspect-[3/4] overflow-hidden rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            <img
              ref={imageRef}
              src="/assets/riadh.webp"
              alt="Riadh Portrait"
              className="w-full h-full object-cover grayscale transition-all duration-700"
            />
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="w-full lg:w-7/12 flex flex-col justify-end text-white h-full lg:mt-[20%]">
          <div
            ref={text1Ref}
            className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-10 max-w-2xl"
          >
            Full-stack Software Developer with more than 2 years of experience,
            working in multiple software projects, building high-quality,
            production-ready web applications.
          </div>

          <div
            ref={text2Ref}
            className="text-sm md:text-base lg:text-lg text-white/50 font-light leading-loose max-w-xl self-end text-right"
          >
            I work across frontend systems, backend services, and application
            architecture to deliver scalable web products built for real users.
            Whether developing a platform from scratch, refining an existing
            codebase, or optimizing performance, I focus on clean implementation,
            long-term maintainability, and solutions that support real business
            growth.
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSummary;

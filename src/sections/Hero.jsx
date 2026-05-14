import Marquee from "react-fast-marquee";

const Hero = () => {
  return (
    <section id="home" className="relative flex flex-col justify-between min-h-screen bg-transparent text-white overflow-hidden pb-10">
      
      {/* Foreground Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none">
        
        {/* Top Left Text */}
        <div className="pt-32 pl-6 md:pl-12 text-white/50 text-xs md:text-sm tracking-[0.2em] uppercase font-light">
          Based in Algeria
        </div>

        {/* HUGE Marquee Text in Middle */}
        <div className="flex-1 flex flex-col justify-center">
          <Marquee speed={100} className="overflow-hidden w-full flex items-center mix-blend-difference">
            <h1 className="text-[120px] sm:text-[180px] md:text-[250px] lg:text-[320px] leading-none font-bold tracking-tighter whitespace-nowrap flex items-center text-white">
              Riadh Vision 
              <span className="w-8 h-8 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-[#a1ebd4] rounded-full mx-10 md:mx-20 inline-block"></span>
            </h1>
            <h1 className="text-[120px] sm:text-[180px] md:text-[250px] lg:text-[320px] leading-none font-bold tracking-tighter whitespace-nowrap flex items-center text-white">
              Riadh Vision 
              <span className="w-8 h-8 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-[#a1ebd4] rounded-full mx-10 md:mx-20 inline-block"></span>
            </h1>
          </Marquee>
        </div>

        {/* Bottom Right Text */}
        <div className="pb-10 pr-6 md:pr-12 text-right flex flex-col gap-1">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-light text-white tracking-wide">Full-Stack Developer</h2>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-light text-white tracking-wide">Design Scalable Systems</h2>
        </div>

      </div>

    </section>
  );
};

export default Hero;

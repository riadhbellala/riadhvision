import React from "react";
import ServiceFeature from "./ServiceFeature";

const ServiceCard = ({ service, isDesktop }) => {
  return (
    <div
      className={`group relative w-full shrink-0 cursor-pointer ${
        isDesktop ? "md:w-[50vw] lg:w-[45vw] aspect-4/3" : "min-h-[60vh]"
      } perspective-1000`}
    >
      <div className="relative w-full h-full overflow-hidden bg-base/[0.04] border border-base/10 transition-all duration-700 ease-out group-hover:border-accent/40 rounded-3xl shadow-lg flex flex-col">
        
        {/* Massive Background Text Effect (Kintaro Style) */}
        <h3 className="absolute -bottom-6 -left-6 md:bottom-6 md:left-6 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase text-base opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700 pointer-events-none z-0 whitespace-nowrap">
          {service.title.split(" ")[0]}
        </h3>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-8 xl:p-12 h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="overflow-hidden">
              <span className="block text-sm font-mono tracking-widest text-accent uppercase transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100">
                Service Focus
              </span>
            </div>
          </div>

          <div className="mb-auto">
             <h3 className="text-2xl lg:text-4xl font-semibold tracking-tight mb-4 text-base">
                {service.title}
             </h3>
             <p className="text-sm md:text-body text-base/70 font-light leading-relaxed max-w-xl">
                "{service.description}"
             </p>
          </div>
          
          <div className="flex flex-col gap-4 mt-8 bg-base/[0.04] p-6 rounded-2xl backdrop-blur-sm border border-base/10 group-hover:border-base/15 transition-colors duration-500">
            {service.items.map((item, j) => (
              <ServiceFeature
                key={j}
                index={j + 1}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

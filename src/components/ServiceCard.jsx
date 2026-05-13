import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ServiceCard = ({ title, description, Icon, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative w-full h-full cursor-pointer"
    >
      {/* Background Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#426C81]/30 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 rounded-3xl" />
      
      <div className="relative h-full p-8 md:p-10 bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/5 group-hover:border-white/20 transition-colors duration-500 overflow-hidden flex flex-col justify-between shadow-[0_0_0_rgba(0,0,0,0)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] group-hover:-translate-y-2 transform">
        
        {/* Subtle top border highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div>
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-[#426C81]/20 group-hover:border-[#426C81]/50 shadow-inner">
            {Icon && <Icon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-500" />}
          </div>

          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white font-syne transition-colors duration-500 tracking-tight">{title}</h3>
          <p className="text-white/50 font-light leading-relaxed group-hover:text-white/70 transition-colors duration-500">{description}</p>
        </div>

        {/* Hover Action / Arrow */}
        <div className="mt-8 flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-2 -translate-x-8 group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <span className="text-sm font-bold text-transparent group-hover:text-white transition-colors duration-500">Discover</span>
            <ArrowRight className="w-4 h-4 text-transparent group-hover:text-[#426C81] transition-colors duration-500" />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ServiceCard;

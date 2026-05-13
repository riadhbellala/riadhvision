import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const ProjectCard = ({ title, description, image, tags, index, wide = false, url = null }) => {
  const cardContent = (
    <>
      {/* Image */}
      <div className="relative w-full overflow-hidden aspect-[16/10]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-top scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top-right arrow icon on hover */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <ArrowUpRight size={18} className="text-white" />
        </div>

        {/* Live badge */}
        {url && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs text-white/80 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 md:p-8">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span key={i} className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 tracking-wide">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-2xl md:text-3xl font-bold font-syne text-white tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-white/50 font-light leading-relaxed text-sm md:text-base">
          {description}
        </p>

        {/* Bottom CTA */}
        <div className="flex items-center gap-2 mt-6 text-sm font-semibold text-white/30 group-hover:text-[#426C81] transition-colors duration-300">
          <span>{url ? 'Visit Live Site' : 'View Case Study'}</span>
          <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-500 bg-white/[0.02] backdrop-blur-sm ${wide ? 'md:col-span-2' : ''}`}
    >
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          {cardContent}
        </a>
      ) : (
        <div>{cardContent}</div>
      )}
    </motion.div>
  );
};

export default ProjectCard;

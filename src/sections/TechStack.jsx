
import { motion } from 'framer-motion';
import {
  SiReact, SiNextdotjs, SiVite, SiTailwindcss, SiFramer,
  SiNodedotjs, SiExpress, SiMongodb, SiFirebase, SiSupabase,
  SiTypescript, SiJavascript, SiPython, SiGit, SiGithub,
  SiVercel, SiDocker, SiFigma, SiPostman
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

const tools = [
  { Icon: SiReact, name: 'React', color: '#61DAFB' },
  { Icon: SiNextdotjs, name: 'Next.js', color: '#FFFFFF' },
  { Icon: SiVite, name: 'Vite', color: '#646CFF' },
  { Icon: SiTailwindcss, name: 'Tailwind', color: '#06B6D4' },
  { Icon: SiFramer, name: 'Framer Motion', color: '#FF0055' },
  { Icon: SiTypescript, name: 'TypeScript', color: '#3178C6' },
  { Icon: SiJavascript, name: 'JavaScript', color: '#F7DF1E' },
  { Icon: SiNodedotjs, name: 'Node.js', color: '#339933' },
  { Icon: SiExpress, name: 'Express', color: '#FFFFFF' },
  { Icon: SiMongodb, name: 'MongoDB', color: '#47A248' },
  { Icon: SiFirebase, name: 'Firebase', color: '#FFCA28' },
  { Icon: SiSupabase, name: 'Supabase', color: '#3ECF8E' },
  { Icon: SiPython, name: 'Python', color: '#3776AB' },
  { Icon: SiGit, name: 'Git', color: '#F05032' },
  { Icon: SiGithub, name: 'GitHub', color: '#FFFFFF' },
  { Icon: SiVercel, name: 'Vercel', color: '#FFFFFF' },
  { Icon: SiDocker, name: 'Docker', color: '#2496ED' },
  { Icon: SiFigma, name: 'Figma', color: '#F24E1E' },
  { Icon: VscVscode, name: 'VS Code', color: '#007ACC' },
  { Icon: SiPostman, name: 'Postman', color: '#FF6C37' },
];

// Duplicate for seamless loop
const doubled = [...tools, ...tools];

const TechStack = () => {
  return (
    <section className="relative z-30 py-20 overflow-hidden">

      {/* Section label */}
      <p className="text-center text-xs font-semibold tracking-widest uppercase text-white/20 mb-10">
        Tools & Technologies
      </p>

      {/* Fade masks on edges */}
      <div className="absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />

      {/* Row 1: Left to Right */}
      <div className="relative flex overflow-hidden mb-6">
        <motion.div
          className="flex gap-6 shrink-0"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
        >
          {doubled.map((tool, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.03] border border-white/[0.06] whitespace-nowrap group hover:border-white/20 transition-colors duration-300"
            >
              <tool.Icon size={18} style={{ color: tool.color }} className="opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="text-sm text-white/30 group-hover:text-white/70 transition-colors duration-300 font-medium">
                {tool.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Row 2: Right to Left (reverse) */}
      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex gap-6 shrink-0"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
        >
          {doubled.map((tool, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.03] border border-white/[0.06] whitespace-nowrap group hover:border-white/20 transition-colors duration-300"
            >
              <tool.Icon size={18} style={{ color: tool.color }} className="opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="text-sm text-white/30 group-hover:text-white/70 transition-colors duration-300 font-medium">
                {tool.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
};

export default TechStack;

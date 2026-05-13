import  { useState  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between w-full max-w-4xl bg-white/[0.08] backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        
        {/* Logo - Left */}
        <div className="flex-1 flex justify-start">
          <a href="#" className="relative flex items-center group py-1">
            <div className="font-syne text-xl md:text-2xl font-bold text-white relative z-10 flex items-center tracking-wider">
              {/* R -> RIADH */}
              <div className="flex items-center">
                <span className="translate-x-1 group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-10">R</span>
                <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <span className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out delay-75 whitespace-nowrap">IADH</span>
                </div>
              </div>
              {/* V -> VISION */}
              <div className="flex items-center text-white/60 group-hover:text-white/90 transition-colors duration-700 group-hover:ml-1.5">
                <span className="-translate-x-1 group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] mix-blend-screen relative z-0">V</span>
                <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <span className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out delay-100 whitespace-nowrap">ISION</span>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Desktop Nav Links - Center */}
        <div className="hidden md:flex flex-none justify-center items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Action Button & Mobile Toggle - Right */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <a href="#contact" className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white text-black rounded-full hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] group">
            Let's Talk
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </a>
          
          <button
            className="md:hidden p-2 text-white/70 hover:text-white relative z-50"
            onClick={() => setMobileMenuIsOpen((prev) => !prev)}
          >
            {mobileMenuIsOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuIsOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-20 left-4 right-4 md:hidden bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuIsOpen(false)}
                  className="block text-white/70 hover:text-white text-base font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10">
                <a 
                  href="#contact"
                  onClick={() => setMobileMenuIsOpen(false)}
                  className="w-full flex justify-center items-center gap-2 px-6 py-3 text-sm font-semibold bg-white text-black rounded-full hover:bg-neutral-200 transition-colors"
                >
                  Contact Me
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;

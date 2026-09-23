import React, { useState, useLayoutEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Icon } from '@iconify/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Prevent white flash by setting the body background explicitly for this route
  useLayoutEffect(() => {
    const originalBackground = document.body.style.background;
    document.body.style.background = '#050505';
    return () => {
      document.body.style.background = originalBackground;
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-sans fixed inset-0 z-50">
      
      {/* Subtle, professional background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Header / Nav */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50">
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-white/50 hover:text-white transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all">
            <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium tracking-wide">Return to Site</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] px-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* The Glassmorphic Login Space */}
        <div 
          className={`relative w-full rounded-[2rem] p-10 transition-all duration-700 ease-out flex flex-col gap-8
            ${isHovered 
              ? 'bg-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/20 backdrop-blur-2xl' 
              : 'bg-transparent shadow-none border border-white/5 backdrop-blur-sm'
            }`}
        >
          {/* Hover highlight effect */}
          <div 
            className={`absolute inset-0 rounded-[2rem] pointer-events-none transition-opacity duration-700 bg-gradient-to-br from-white/10 to-transparent ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
          />

          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-700 ${isHovered ? 'bg-white border border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-white/10 border border-white/5'}`}>
              <Icon icon="lucide:lock-keyhole" className={`w-7 h-7 transition-colors duration-700 ${isHovered ? 'text-black' : 'text-white/50'}`} />
            </div>
            <div>
              <h1 className={`text-2xl font-semibold tracking-tight transition-colors duration-700 ${isHovered ? 'text-white' : 'text-white/70'}`}>
                Secure Authentication
              </h1>
              <p className="text-white/40 text-sm mt-1">Authorized personnel only</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-2 relative group">
              <label className={`text-xs font-semibold uppercase tracking-widest ml-1 transition-colors duration-300 ${isHovered ? 'text-white/70' : 'text-white/30'}`}>Email</label>
              <div className="relative">
                <Icon icon="lucide:mail" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white/70 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-12 pl-11 pr-4 rounded-xl text-white text-sm focus:outline-none transition-all duration-300
                    ${isHovered 
                      ? 'bg-black/50 border border-white/10 focus:border-white/30 focus:bg-black/70 shadow-inner' 
                      : 'bg-black/20 border border-white/5'
                    }`}
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2 relative group">
              <label className={`text-xs font-semibold uppercase tracking-widest ml-1 transition-colors duration-300 ${isHovered ? 'text-white/70' : 'text-white/30'}`}>Password</label>
              <div className="relative">
                <Icon icon="lucide:key" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white/70 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-12 pl-11 pr-4 rounded-xl text-white text-sm focus:outline-none transition-all duration-300
                    ${isHovered 
                      ? 'bg-black/50 border border-white/10 focus:border-white/30 focus:bg-black/70 shadow-inner' 
                      : 'bg-black/20 border border-white/5'
                    }`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2"
              >
                <Icon icon="lucide:alert-circle" className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-400 text-xs font-medium leading-tight">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading || !isHovered}
              className={`mt-2 w-full h-12 rounded-xl font-medium text-sm transition-all duration-500 flex items-center justify-center gap-2
                ${isHovered
                  ? 'bg-white text-black hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed'
                  : 'bg-white/5 text-white/30 border border-white/5 cursor-default'
                }`}
            >
              {isLoading ? (
                <>
                  <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;

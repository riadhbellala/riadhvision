import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Icon } from '@iconify/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div className="relative min-h-screen w-full bg-[#030303] flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* Premium ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#a1ebd4]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#2c5584]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header / Nav */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50">
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-white/50 hover:text-white transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium tracking-wide">Back to Site</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl flex flex-col gap-8">
          
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-16 h-16 bg-[#a1ebd4]/10 rounded-2xl flex items-center justify-center mb-2 border border-[#a1ebd4]/20">
              <Icon icon="lucide:lock" className="w-8 h-8 text-[#a1ebd4]" />
            </div>
            <h1 className="text-3xl font-light text-white tracking-tight">Admin Access</h1>
            <p className="text-white/40 text-sm tracking-wide">RiadhVision Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#a1ebd4]/50 focus:bg-white/[0.05] transition-all"
                placeholder="admin@example.com"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#a1ebd4]/50 focus:bg-white/[0.05] transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-red-400 text-sm text-center mt-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex items-center justify-center gap-3 w-full px-8 h-14 bg-[#a1ebd4] text-black font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(161,235,212,0.2)] disabled:shadow-none"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {isLoading ? (
                <Icon icon="lucide:loader" className="w-5 h-5 animate-spin" />
              ) : (
                <Icon icon="lucide:arrow-right" className="w-5 h-5" />
              )}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Icon } from '@iconify/react';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
      } else {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center font-sans">
        <Icon icon="lucide:loader" className="w-8 h-8 text-[#a1ebd4] animate-spin mb-4" />
        <p className="text-white/40 text-sm tracking-wide">Checking access...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

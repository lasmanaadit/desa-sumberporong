// src/components/dashboard/Topbar.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Topbar = ({ setIsOpen }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Ambil inisial nama untuk avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-20 bg-surface-container-lowest border-b border-outline-variant/20 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
      
      {/* ================= MOBILE MENU ================= */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-10 h-10 rounded-xl hover:bg-primary/10 flex items-center justify-center text-on-surface-variant"
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '24px' }}
        >
          menu
        </span>
      </button>

      {/* ================= SPACER DESKTOP ================= */}
      <div className="hidden lg:block">
        <p className="font-body-md text-on-surface-variant">
          Dashboard Pengguna
        </p>
      </div>

      {/* ================= USER PROFILE ================= */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="text-right hidden sm:block">
          <p className="font-label-sm text-on-surface-variant tracking-normal">
            Selamat datang,
          </p>
          <p className="font-label-md font-semibold text-on-surface">
            {user?.name || 'Pengguna'}
          </p>
        </div>

        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
          <span className="font-headline-md text-base font-semibold">
            {getInitials(user?.name)}
          </span>
        </div>

        <span
          className="material-symbols-outlined text-on-surface-variant hidden sm:block"
          style={{ fontSize: '22px' }}
        >
          expand_more
        </span>
      </motion.div>
    </header>
  );
};

export default Topbar;
// src/components/dashboard/Topbar.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfileDropdown from '../ProfileDropdown';

const Topbar = ({ isOpen, setIsOpen }) => {
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

  return (
    <header className="h-20 bg-surface-container-lowest border-b border-outline-variant/20 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl hover:bg-primary/10 flex items-center justify-center text-on-surface-variant"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      <div className="hidden lg:block">
        <p className="font-body-md text-on-surface-variant">Dashboard Pengguna</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="font-label-sm text-on-surface-variant tracking-normal">Selamat datang,</p>
          <p className="font-label-md font-semibold text-on-surface">{user?.name || 'Pengguna'}</p>
        </div>
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Topbar;
// src/components/admin/AdminTopbar.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfileDropdown from '../ProfileDropdown';

const AdminTopbar = ({ isOpen, setIsOpen }) => {
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
      {/* Burger toggle – selalu tampil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl hover:bg-primary/10 flex items-center justify-center text-on-surface-variant"
        aria-label="Toggle menu"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      <div className="hidden lg:block">
        <p className="font-body-md text-on-surface-variant">Admin Panel</p>
      </div>

      {/* User Profile dengan Dropdown */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="font-label-sm text-on-surface-variant tracking-normal">Selamat datang,</p>
          <p className="font-label-md font-semibold text-on-surface">{user?.name || 'Admin'}</p>
        </div>
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default AdminTopbar;
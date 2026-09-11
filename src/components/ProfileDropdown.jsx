// src/components/ProfileDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Tentukan path edit profil berdasarkan role
  const getEditProfilePath = () => {
    const role = user?.role?.name || user?.role || 'user';
    if (role === 'admin') return '/admin/edit-profile';
    if (role === 'superadmin') return '/superadmin/edit-profile';
    return '/edit-profile';
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setIsOpen(false);
    navigate('/login');
  };

  const handleEditProfile = () => {
    setIsOpen(false);
    navigate(getEditProfilePath());
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol avatar */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
          <span className="font-headline-md text-base font-semibold">
            {getInitials(user?.name)}
          </span>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant hidden sm:block" style={{ fontSize: '22px' }}>
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-lg overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-outline-variant/20">
              <p className="font-label-md font-semibold text-on-surface truncate">
                {user?.name || 'Pengguna'}
              </p>
              <p className="text-xs text-on-surface-variant truncate">
                {user?.email || 'email@desa.id'}
              </p>
            </div>

            <button
              onClick={handleEditProfile}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-primary">edit</span>
              <span className="font-label-md">Edit Profil</span>
            </button>
            <button
          type="button"
          onClick={() => { navigate('/'); if (window.innerWidth < 1024) setIsOpen(false); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all mb-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>home</span>
          <span className="font-label-md">Kembali ke Beranda</span>
        </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-error/5 transition-colors border-t border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-error">logout</span>
              <span className="font-label-md text-error">Keluar</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
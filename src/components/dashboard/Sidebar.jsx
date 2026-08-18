// src/components/dashboard/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '/src/assets/logo.webp';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isUmkmOpen, setIsUmkmOpen] = useState(true);
  const navigate = useNavigate();

  const mainMenu = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Pengajuan Administrasi', path: '/dashboard/pengajuan', icon: 'description' },
    { name: 'Riwayat Pengajuan', path: '/dashboard/riwayat', icon: 'history' },
    { name: 'Pengaduan', path: '/dashboard/pengaduan', icon: 'report' },
  ];

  const umkmMenu = [
    { name: 'UMKM Saya', path: '/dashboard/umkm', icon: 'storefront' },
    { name: 'Ajukan Produk UMKM', path: '/dashboard/umkm/tambah', icon: 'add_business' },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-sm'
        : 'text-on-surface-variant hover:bg-primary/10 hover:text-primary'
    }`;

  const closeMenu = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 w-72 h-screen bg-surface-container-lowest
          border-r border-outline-variant/30 flex flex-col transition-transform duration-300 overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-outline-variant/20">
          <NavLink to="/dashboard" onClick={closeMenu}>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo Desa" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="font-headline-md text-primary text-lg font-bold leading-tight">
                  Desa Sumberporong
                </h1>
                <p className="font-label-sm text-on-surface-variant tracking-normal">
                  Sistem Informasi Desa
                </p>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Menu */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="font-label-sm text-on-surface-variant mb-3 px-2">
            MENU UTAMA
          </p>

          <nav className="space-y-2">
            {mainMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={closeMenu}
                className={linkClass}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '22px',
                        fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="font-label-md">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}

            {/* UMKM submenu */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsUmkmOpen(!isUmkmOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '22px' }}
                  >
                    storefront
                  </span>
                  <span className="font-label-md">UMKM</span>
                </div>
                <motion.span
                  animate={{ rotate: isUmkmOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="material-symbols-outlined"
                  style={{ fontSize: '20px' }}
                >
                  expand_more
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isUmkmOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-5 mt-1 pl-4 border-l border-outline-variant/40 space-y-1">
                      {umkmMenu.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          end
                          onClick={closeMenu}
                          className={linkClass}
                        >
                          {({ isActive }) => (
                            <>
                              <span
                                className="material-symbols-outlined"
                                style={{
                                  fontSize: '20px',
                                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                                }}
                              >
                                {item.icon}
                              </span>
                              <span className="font-label-md">{item.name}</span>
                            </>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        {/* Bottom area */}
        <div className="px-4 py-4 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
              logout
            </span>
            <span className="font-label-md">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
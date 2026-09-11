// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '/src/assets/logo.webp';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const dropdownRef = useRef(null);

  // ==========================================
  // STATE LOGIN
  // ==========================================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLogin = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          setIsLoggedIn(true);
          setUser(parsed);
        } catch {
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  // ==========================================
  // CLOSE DROPDOWN SAAT KLIK DI LUAR
  // ==========================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ==========================================
  // ROLE HELPER
  // ==========================================
  const role = user?.role?.name || user?.role || 'user';

  // ==========================================
  // DATA MENU
  // ==========================================
  const menus = [
    { name: 'Beranda', path: '/' },
    { name: 'Profile', path: '/profile' },
    { name: 'Layanan', path: '/layanan' },
    { name: 'Statistik', path: '/statistik' },
    { name: 'UMKM', path: '/umkm' },
    { name: 'Berita', path: '/berita' },
    { name: 'Galeri', path: '/galeri' },
  ];

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // ==========================================
  // CEK ACTIVE MENU
  // ==========================================
  const isActiveMenu = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path;
  };

  // ==========================================
  // HANDLE LOGOUT
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setIsLoggedIn(false);
    setUser(null);
    closeMenu();
    navigate('/');
  };

  // ==========================================
  // HANDLE NAVIGASI DASHBOARD
  // ==========================================
  const handleDashboardClick = (path) => {
    navigate(path);
    closeMenu();
  };

  // Path dashboard sesuai role
  const dashboardPath =
    role === 'admin'
      ? '/admin'
      : role === 'superadmin'
        ? '/superadmin'
        : '/dashboard';

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-surface/90 dark:bg-on-background/90 backdrop-blur-md shadow-sm transition-all duration-300">
      {/* ==================================================
          NAVBAR UTAMA
      ================================================== */}
      <div className="flex justify-between items-center h-18 px-margin-mobile md:px-margin-desktop mx-auto">
        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-sm shrink-0">
          <img src={logo} alt="Logo Desa Sumberporong" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed leading-tight">
              Desa Sumberporong
            </span>
            <span className="text-[10px] font-medium text-on-surface-variant dark:text-surface-variant leading-tight">
              Pemerintah Desa Sumberporong
            </span>
          </div>
        </NavLink>

        {/* ==================================================
            DESKTOP RIGHT AREA
        ================================================== */}
        <div className="hidden md:flex items-center ml-auto">
          {/* MENU DESKTOP */}
          <div className="flex items-center gap-lg font-label-md text-label-md">
            {menus.map((menu) => {
              const active = isActiveMenu(menu.path);
              return (
                <NavLink
                  key={menu.path}
                  to={menu.path}
                  end={menu.path === '/'}
                  onMouseEnter={() => setHoveredMenu(menu.path)}
                  onMouseLeave={() => setHoveredMenu(null)}
                  className={`relative py-3 px-1 transition-colors duration-200 ${
                    active
                      ? 'text-primary dark:text-primary-fixed'
                      : 'text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed'
                  }`}
                >
                  <span className="relative z-10">{menu.name}</span>

                  {active && (
                    <motion.span
                      layoutId="navbar-active-indicator"
                      className="absolute left-0 right-0 bottom-0 h-0.75 rounded-full bg-primary dark:bg-primary-fixed"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}

                  <AnimatePresence>
                    {hoveredMenu === menu.path && !active && (
                      <motion.span
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 0.35, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute left-0 right-0 bottom-0 h-0.5 rounded-full bg-primary dark:bg-primary-fixed origin-center"
                      />
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </div>

          {/* ==================================================
              TOMBOL AUTH / DASHBOARD (DESKTOP)
          ================================================== */}
          {isLoggedIn ? (
            <div className="relative ml-lg" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-label-md font-medium shadow-sm hover:shadow-md transition-shadow duration-200 bg-secondary text-white"
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                Dashboard
                <span className="material-symbols-outlined text-lg">
                  {isDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    {/* Satu tombol dashboard sesuai role */}
                    <button
                      onClick={() => handleDashboardClick(dashboardPath)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-primary">
                        {role === 'admin'
                          ? 'admin_panel_settings'
                          : role === 'superadmin'
                            ? 'supervisor_account'
                            : 'person'}
                      </span>
                      <span className="font-label-md">
                        {role === 'admin'
                          ? 'Dashboard Admin'
                          : role === 'superadmin'
                            ? 'Dashboard Superadmin'
                            : 'Dashboard User'}
                      </span>
                    </button>

                    {/* Logout – selalu ada */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-error/5 transition-colors border-t border-outline-variant/20"
                    >
                      <span className="material-symbols-outlined text-error">logout</span>
                      <span className="font-label-md text-error">Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="ml-lg flex items-center gap-2 px-5 py-2.5 rounded-lg font-label-md font-medium shadow-sm hover:shadow-md transition-shadow duration-200 bg-primary text-white"
            >
              <span className="material-symbols-outlined text-lg">account_circle</span>
              Login
            </button>
          )}
        </div>

        {/* ==================================================
            MOBILE BURGER BUTTON
        ================================================== */}
        <button
          className="md:hidden p-sm text-on-surface-variant hover:text-primary transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* ==================================================
          MOBILE MENU
      ================================================== */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col bg-surface/95 dark:bg-on-background/95 backdrop-blur-md border-t border-outline-variant/20 px-margin-mobile py-md gap-sm font-label-md text-label-md">
              {menus.map((menu) => {
                const active = isActiveMenu(menu.path);
                return (
                  <NavLink
                    key={menu.path}
                    to={menu.path}
                    end={menu.path === '/'}
                    onClick={closeMenu}
                    className={`relative py-3 px-3 rounded-lg transition-all duration-200 ${
                      active
                        ? 'bg-primary/10 text-primary dark:text-primary-fixed'
                        : 'text-on-surface-variant dark:text-surface-variant hover:bg-primary/5 hover:text-primary dark:hover:text-primary-fixed'
                    }`}
                  >
                    <span>{menu.name}</span>
                  </NavLink>
                );
              })}

              {/* AUTH / DASHBOARD MOBILE */}
              {isLoggedIn ? (
                <div className="w-full mt-sm border border-outline-variant/20 rounded-lg overflow-hidden">
                  {/* Satu tombol dashboard sesuai role */}
                  <button
                    onClick={() => handleDashboardClick(dashboardPath)}
                    className="flex items-center gap-2 w-full py-3 px-4 text-left bg-primary text-white hover:bg-primary/80 transition-colors"
                  >
                    <span className="material-symbols-outlined text-white">
                      {role === 'admin'
                        ? 'admin_panel_settings'
                        : role === 'superadmin'
                          ? 'supervisor_account'
                          : 'person'}
                    </span>
                    <span>
                      {role === 'admin'
                        ? 'Dashboard Admin'
                        : role === 'superadmin'
                          ? 'Dashboard Superadmin'
                          : 'Dashboard User'}
                    </span>
                  </button>

                  {/* Logout – selalu ada */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full py-3 px-4 text-left bg-error text-white hover:bg-error/80 transition-colors border-t border-white/20"
                  >
                    <span className="material-symbols-outlined text-white">logout</span>
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { navigate('/login'); closeMenu(); }}
                  className="flex items-center justify-center gap-2 w-full mt-sm py-3 px-4 rounded-lg font-medium shadow-sm bg-primary text-white"
                >
                  <span className="material-symbols-outlined text-lg">account_circle</span>
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
// src/components/admin/AdminSidebar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '/src/assets/logo.webp';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const [isPengajuanOpen, setIsPengajuanOpen] = useState(false);
  const navigate = useNavigate();

  const mainMenu = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { name: 'Hero', path: '/admin/hero', icon: 'image' },
    { name: 'Sambutan', path: '/admin/sambutan', icon: 'record_voice_over' },
    { name: 'Perangkat Desa', path: '/admin/perangkat-desa', icon: 'group' },
    { name: 'Berita', path: '/admin/berita', icon: 'newspaper' },
    { name: 'Statistik', path: '/admin/statistik', icon: 'analytics' },
    { name: 'Galeri', path: '/admin/galeri', icon: 'photo_library' },
    { name: 'Kritik & Saran', path: '/admin/kritik-saran', icon: 'feedback' },
  ];

  const pengajuanMenu = [
    { name: 'Pengajuan KTP', path: '/admin/pengajuan/ktp', icon: 'badge' },
    { name: 'Pengajuan SKU', path: '/admin/pengajuan/sku', icon: 'storefront' },
    { name: 'Pengaduan', path: '/admin/pengaduan', icon: 'report' },
  ];

  const umkmMenu = [
    { name: 'UMKM Approval', path: '/admin/umkm', icon: 'storefront' },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-sm'
        : 'text-on-surface-variant hover:bg-primary/10 hover:text-primary'
    }`;

  const closeMenu = () => {
    // Hanya tutup sidebar jika di layar mobile (< 1024px)
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('token');

    navigate('/login');

    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 w-72 h-screen
          bg-surface-container-lowest
          border-r border-outline-variant/30
          flex flex-col
          transition-transform duration-300
          overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header / Logo */}
        <div className="border-b border-outline-variant/20 px-6 py-6">
          <NavLink to="/admin" onClick={closeMenu}>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo Desa"
                className="h-12 w-12 object-contain"
              />

              <div>
                <h1 className="font-headline-md text-lg font-bold leading-tight text-primary">
                  Desa Sumberporong
                </h1>

                <p className="font-label-sm tracking-normal text-on-surface-variant">
                  Admin Panel
                </p>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-2 font-label-sm text-on-surface-variant">
            KELOLA DESA
          </p>

          <nav className="space-y-2">
            {/* Menu Utama */}
            {mainMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={closeMenu}
                className={linkClass}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '22px',
                        fontVariationSettings: isActive
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      {item.icon}
                    </span>

                    <span className="font-label-md">
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}

            {/* Pengajuan */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsPengajuanOpen(!isPengajuanOpen)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-on-surface-variant transition-all hover:bg-primary/10 hover:text-primary"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '22px' }}
                  >
                    description
                  </span>

                  <span className="font-label-md">
                    Pengajuan
                  </span>
                </div>

                <motion.span
                  animate={{
                    rotate: isPengajuanOpen ? 180 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="material-symbols-outlined"
                  style={{ fontSize: '20px' }}
                >
                  expand_more
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isPengajuanOpen && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="ml-5 mt-1 space-y-1 border-l border-outline-variant/40 pl-4">
                      {pengajuanMenu.map((item) => (
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
                                  fontVariationSettings: isActive
                                    ? "'FILL' 1"
                                    : "'FILL' 0",
                                }}
                              >
                                {item.icon}
                              </span>

                              <span className="font-label-md">
                                {item.name}
                              </span>
                            </>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* UMKM */}
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
                        fontSize: '22px',
                        fontVariationSettings: isActive
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      {item.icon}
                    </span>

                    <span className="font-label-md">
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="border-t border-outline-variant/20 px-4 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-on-surface-variant transition-all hover:bg-error/10 hover:text-error"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '22px' }}
            >
              logout
            </span>

            <span className="font-label-md">
              Keluar
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
// src/components/superadmin/SuperAdminSidebar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '/src/assets/logo.webp';

const SuperAdminSidebar = ({ isOpen, setIsOpen }) => {
  const [isPengajuanOpen, setIsPengajuanOpen] = useState(false);
  const [isSuperAdminOpen, setIsSuperAdminOpen] = useState(true);
  const navigate = useNavigate();

  const mainMenu = [
    { name: 'Dashboard', path: '/superadmin', icon: 'dashboard' },
    { name: 'Hero', path: '/superadmin/hero', icon: 'image' },
    { name: 'Sambutan', path: '/superadmin/sambutan', icon: 'record_voice_over' },
    { name: 'Perangkat Desa', path: '/superadmin/perangkat-desa', icon: 'group' },
    { name: 'Berita', path: '/superadmin/berita', icon: 'newspaper' },
    { name: 'Statistik', path: '/superadmin/statistik', icon: 'analytics' },
    { name: 'Galeri', path: '/superadmin/galeri', icon: 'photo_library' },
    { name: 'Kritik & Saran', path: '/superadmin/kritik-saran', icon: 'feedback' },
  ];

  const pengajuanMenu = [
    { name: 'Pengajuan KTP', path: '/superadmin/pengajuan/ktp', icon: 'badge' },
    { name: 'Pengajuan SKU', path: '/superadmin/pengajuan/sku', icon: 'storefront' },
    { name: 'Pengaduan', path: '/superadmin/pengajuan/pengaduan', icon: 'report' },
    { name: 'UMKM Approval', path: '/superadmin/pengajuan/umkm', icon: 'storefront' },
  ];

  const superAdminMenu = [
    { name: 'Manajemen User', path: '/superadmin/users', icon: 'manage_accounts' },
    { name: 'Role Management', path: '/superadmin/roles', icon: 'shield_person' },
    { name: 'Audit Log', path: '/superadmin/audit-logs', icon: 'history' },
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');

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
        {/* Header */}
        <div className="border-b border-outline-variant/20 px-6 py-6">
          <NavLink to="/superadmin" onClick={closeMenu}>
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
                  Super Admin Panel
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
            {/* Main Menu */}
            {mainMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/superadmin'}
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

            {/* Pengajuan Submenu */}
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

            {/* Super Admin Submenu */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setIsSuperAdminOpen(!isSuperAdminOpen)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-on-surface-variant transition-all hover:bg-primary/10 hover:text-primary"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '22px' }}
                  >
                    admin_panel_settings
                  </span>

                  <span className="font-label-md">
                    Super Admin
                  </span>
                </div>

                <motion.span
                  animate={{
                    rotate: isSuperAdminOpen ? 180 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="material-symbols-outlined"
                  style={{ fontSize: '20px' }}
                >
                  expand_more
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isSuperAdminOpen && (
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
                      {superAdminMenu.map((item) => (
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

export default SuperAdminSidebar;
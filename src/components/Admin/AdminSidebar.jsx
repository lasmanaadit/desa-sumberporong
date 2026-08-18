// src/components/admin/AdminSidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '/src/assets/logo.webp';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const [isPengajuanOpen, setIsPengajuanOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserRole(parsed.role || 'user');
      } catch {
        setUserRole('user');
      }
    }
  }, []);

  // Menu utama (semua admin)
  const mainMenu = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { name: 'Hero', path: '/admin/hero', icon: 'image' },
    { name: 'Sambutan', path: '/admin/sambutan', icon: 'speaker' },
    //{ name: 'Visi & Misi', path: '/admin/visi-misi', icon: 'visibility' },
    { name: 'Struktur Organisasi', path: '/admin/struktur-organisasi', icon: 'account_tree' },
    { name: 'Perangkat Desa', path: '/admin/perangkat-desa', icon: 'group' },
    { name: 'Berita', path: '/admin/berita', icon: 'newspaper' },
    { name: 'Profil Desa', path: '/admin/profil-desa', icon: 'home' },
    { name: 'Statistik', path: '/admin/statistik', icon: 'analytics' },
    { name: 'Galeri', path: '/admin/galeri', icon: 'photo_library' },
    { name: 'Kritik & Saran', path: '/admin/kritik-saran', icon: 'feedback' },
  ];

  // Menu khusus Superadmin
  const superAdminMenu = [
    { name: 'Kelola Admin', path: '/admin/manage-admins', icon: 'admin_panel_settings' },
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
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    navigate('/login');
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
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
          <NavLink to="/admin" onClick={closeMenu}>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="font-headline-md text-primary text-lg font-bold leading-tight">
                  Desa Sumberporong
                </h1>
                <p className="font-label-sm text-on-surface-variant tracking-normal">
                  Admin Panel
                </p>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Menu */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="font-label-sm text-on-surface-variant mb-3 px-2">KELOLA DESA</p>
          <nav className="space-y-2">
            {/* Main menu untuk semua admin */}
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

            {/* Superadmin only menu */}
            {userRole === 'superadmin' && (
              <div className="pt-2">
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
              </div>
            )}

            {/* Pengajuan submenu */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsPengajuanOpen(!isPengajuanOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                    description
                  </span>
                  <span className="font-label-md">Pengajuan</span>
                </div>
                <motion.span
                  animate={{ rotate: isPengajuanOpen ? 180 : 0 }}
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
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-5 mt-1 pl-4 border-l border-outline-variant/40 space-y-1">
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

            {/* UMKM Approval */}
            <div className="pt-2">
              <NavLink
                to="/admin/umkm"
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
                        fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      storefront
                    </span>
                    <span className="font-label-md">UMKM Approval</span>
                  </>
                )}
              </NavLink>
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

export default AdminSidebar;
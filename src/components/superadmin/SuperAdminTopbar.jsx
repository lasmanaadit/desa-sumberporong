// src/components/superadmin/SuperAdminTopbar.jsx

import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import ProfileDropdown from '../ProfileDropdown';
import api from '../../api/axios';

const SuperAdminTopbar = ({ isOpen, setIsOpen }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const notificationRef = useRef(null);
  const navigate = useNavigate();

  // Ambil user dari localStorage
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

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  // Fetch notifikasi
  useEffect(() => {
    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        const response = await api.get('/superadmin/dashboard');

        if (cancelled) return;

        const data = response.data?.data || {};
        const ktp = data.ktp || {};
        const sku = data.sku || {};
        const umkm = data.umkm || {};
        const pengaduan = data.pengaduan || {};

        const items = [];

        const ktpPending = Number(ktp.menunggu_verifikasi ?? 0);
        if (ktpPending > 0) {
          items.push({
            id: 'ktp',
            title: 'Pengajuan KTP',
            count: ktpPending,
            description: 'Menunggu verifikasi',
            icon: 'badge',
            iconClass: 'bg-blue-100 text-blue-600',
            route: '/superadmin/pengajuan/ktp',
          });
        }

        const skuPending = Number(sku.menunggu_verifikasi ?? 0);
        if (skuPending > 0) {
          items.push({
            id: 'sku',
            title: 'Pengajuan SKU',
            count: skuPending,
            description: 'Menunggu verifikasi',
            icon: 'storefront',
            iconClass: 'bg-orange-100 text-orange-600',
            route: '/superadmin/pengajuan/sku',
          });
        }

        const umkmPending = Number(umkm.menunggu_verifikasi ?? 0);
        if (umkmPending > 0) {
          items.push({
            id: 'umkm',
            title: 'Pengajuan UMKM',
            count: umkmPending,
            description: 'Menunggu verifikasi',
            icon: 'storefront',
            iconClass: 'bg-green-100 text-green-600',
            route: '/superadmin/pengajuan/umkm',
          });
        }

        const pengaduanPending = Number(pengaduan.terkirim ?? 0);
        if (pengaduanPending > 0) {
          items.push({
            id: 'pengaduan',
            title: 'Pengaduan',
            count: pengaduanPending,
            description: 'Menunggu ditangani',
            icon: 'report',
            iconClass: 'bg-red-100 text-red-600',
            route: '/superadmin/pengajuan/pengaduan',
          });
        }

        setNotifications(items);
      } catch (err) {
        console.error('Gagal mengambil notifikasi Super Admin:', err);
        if (!cancelled) setNotifications([]);
      }
    };

    fetchNotifications();

    const interval = window.setInterval(fetchNotifications, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const notificationCount = notifications.reduce(
    (total, item) => total + item.count,
    0
  );

  const handleNotificationClick = (route) => {
    setNotificationOpen(false);
    navigate(route);
  };

  return (
    <header className="w-full h-20 bg-surface-container-lowest border-b border-outline-variant/20 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">

      {/* BURGER TOGGLE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl hover:bg-primary/10 flex items-center justify-center text-on-surface-variant transition-colors"
        aria-label="Toggle menu"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* TITLE */}
      <div className="hidden lg:block">
        <p className="font-body-md text-on-surface-variant">Super Admin Panel</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">

        {/* NOTIFICATION */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setNotificationOpen((prev) => !prev)}
            className="relative w-10 h-10 rounded-xl hover:bg-primary/10 flex items-center justify-center text-on-surface-variant transition-colors"
            aria-label="Notifikasi"
            aria-expanded={notificationOpen}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              notifications
            </span>

            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center border-2 border-surface-container-lowest">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>

          {/* NOTIFICATION DROPDOWN */}
          <AnimatePresence>
            {notificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 top-14 z-50 w-80 sm:w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-2xl"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between gap-3 border-b border-outline-variant/20 bg-surface-container-low/50 px-5 py-4">
                  <div className="min-w-0">
                    <h3 className="font-label-md font-semibold text-on-surface">
                      Notifikasi
                    </h3>
                    <p className="mt-0.5 text-xs text-on-surface-variant">
                      Pengajuan yang perlu ditindaklanjuti
                    </p>
                  </div>

                  {notificationCount > 0 && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {notificationCount} baru
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center px-5 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                      <span className="material-symbols-outlined text-3xl">
                        check_circle
                      </span>
                    </div>

                    <p className="mt-4 font-label-md font-semibold text-on-surface">
                      Tidak ada notifikasi
                    </p>

                    <p className="mt-1 max-w-[240px] text-xs leading-5 text-on-surface-variant">
                      Semua pengajuan dan pengaduan sudah ditangani.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto divide-y divide-outline-variant/10">
                    {notifications.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNotificationClick(item.route)}
                        className="group flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-primary/5"
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
                        >
                          <span className="material-symbols-outlined text-xl">
                            {item.icon}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate font-label-sm font-semibold text-on-surface">
                              {item.title}
                            </p>
                            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                              {item.count}
                            </span>
                          </div>

                          <p className="mt-0.5 truncate text-xs text-on-surface-variant">
                            {item.description}
                          </p>
                        </div>

                        <span className="material-symbols-outlined shrink-0 text-base text-on-surface-variant opacity-0 -translate-x-1 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                          arrow_forward
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* FOOTER */}
                {notifications.length > 0 && (
                  <div className="border-t border-outline-variant/20 bg-surface-container-low/50 px-5 py-3">
                    <p className="text-center text-xs text-on-surface-variant">
                      Diperbarui otomatis setiap 30 detik
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* USER PROFILE */}
        <div className="text-right hidden sm:block">
          <p className="font-label-sm text-on-surface-variant tracking-normal">
            Selamat datang,
          </p>
          <p className="font-label-md font-semibold text-on-surface">
            {user?.name || 'Super Admin'}
          </p>
        </div>

        <ProfileDropdown />
      </div>
    </header>
  );
};

export default SuperAdminTopbar;
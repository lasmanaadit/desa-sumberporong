// src/pages/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import StatCard from '../components/dashboard/StatCard';
import RecentSubmission from '../components/dashboard/RecentSubmission';

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 min-w-0">
      <Topbar setIsOpen={setIsSidebarOpen} />

        <main className="p-6 lg:p-8 max-w-7xl mx-auto">
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8"
          >
            <h1 className="font-headline-lg text-on-background">
              Selamat datang, {user?.name || 'Pengguna'} 👋
            </h1>
            <p className="font-body-md text-on-surface-variant mt-2">
              Kelola pengajuan administrasi dan produk UMKM Anda dengan lebih mudah.
            </p>
          </motion.section>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            <StatCard title="Total Pengajuan" value="5" description="Seluruh pengajuan" icon="description" />
            <StatCard title="Sedang Diproses" value="2" description="Menunggu proses" icon="pending" iconBg="bg-blue-100" iconColor="text-blue-600" />
            <StatCard title="Pengajuan Selesai" value="2" description="Berhasil diselesaikan" icon="task_alt" iconBg="bg-green-100" iconColor="text-green-600" />
            <StatCard title="Produk UMKM" value="3" description="Produk yang diajukan" icon="storefront" iconBg="bg-orange-100" iconColor="text-orange-600" />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-3">
              <RecentSubmission />
            </div>
          </section>

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            <h2 className="font-headline-md text-on-background text-xl mb-4">Akses Cepat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button onClick={() => navigate('/dashboard/pengajuan')} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontSize: '23px' }}>post_add</span>
                </div>
                <div>
                  <p className="font-label-md font-semibold text-on-surface">Buat Pengajuan</p>
                  <p className="font-label-sm text-on-surface-variant mt-1">Ajukan administrasi desa</p>
                </div>
              </button>
              <button onClick={() => navigate('/dashboard/umkm/tambah')} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all">
                <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontSize: '23px' }}>add_business</span>
                </div>
                <div>
                  <p className="font-label-md font-semibold text-on-surface">Tambah Produk UMKM</p>
                  <p className="font-label-sm text-on-surface-variant mt-1">Promosikan produk Anda</p>
                </div>
              </button>
              <button onClick={() => navigate('/dashboard/riwayat')} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all">
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontSize: '23px' }}>history</span>
                </div>
                <div>
                  <p className="font-label-md font-semibold text-on-surface">Riwayat Pengajuan</p>
                  <p className="font-label-sm text-on-surface-variant mt-1">Lihat semua pengajuan</p>
                </div>
              </button>
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
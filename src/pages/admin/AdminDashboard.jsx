// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Mock data – will be replaced with real API
  const stats = [
    { title: 'Total Pengajuan', value: '12', description: 'Semua jenis', icon: 'description' },
    { title: 'Pengajuan KTP', value: '5', description: 'Menunggu verifikasi', icon: 'badge', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { title: 'Pengajuan SKU', value: '4', description: 'Menunggu verifikasi', icon: 'storefront', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
    { title: 'Pengaduan', value: '3', description: 'Belum ditindaklanjuti', icon: 'report', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
    { title: 'UMKM Menunggu', value: '2', description: 'Persetujuan', icon: 'storefront', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  ];

  const recentSubmissions = [
    { id: 1, jenis: 'KTP Baru', pemohon: 'Andi Saputra', tanggal: '2026-08-12', status: 'Diproses' },
    { id: 2, jenis: 'SKU', pemohon: 'Budi Santoso', tanggal: '2026-08-11', status: 'Menunggu' },
    { id: 3, jenis: 'Pengaduan', pemohon: 'Siti Rahma', tanggal: '2026-08-10', status: 'Baru' },
  ];

  return (
    <div>
      {/* Welcome */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-8"
      >
        <h1 className="font-headline-lg text-on-background">Dashboard Admin</h1>
        <p className="font-body-md text-on-surface-variant mt-2">
          Kelola konten desa, pantau pengajuan, dan validasi data.
        </p>
      </motion.section>

      {/* Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </section>

      {/* Recent Submissions */}
      <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline-md text-on-surface text-lg">Pengajuan Terbaru</h2>
          <button
            onClick={() => navigate('/admin/pengajuan/ktp')}
            className="text-primary font-label-md hover:underline"
          >
            Lihat semua
          </button>
        </div>
        <div className="divide-y divide-outline-variant/20">
          {recentSubmissions.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-label-md font-semibold text-on-surface">{item.jenis}</p>
                <p className="font-label-sm text-on-surface-variant tracking-normal">
                  {item.pemohon} • {item.tanggal}
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-full font-label-sm tracking-normal bg-blue-100 text-blue-700">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-6">
        <h2 className="font-headline-md text-on-background text-xl mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/berita')}
            className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center gap-4 text-left hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontSize: '23px' }}>
                post_add
              </span>
            </div>
            <div>
              <p className="font-label-md font-semibold text-on-surface">Tambah Berita</p>
              <p className="font-label-sm text-on-surface-variant tracking-normal mt-1">
                Posting berita terbaru
              </p>
            </div>
          </button>
          <button
            onClick={() => navigate('/admin/pengajuan/ktp')}
            className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center gap-4 text-left hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontSize: '23px' }}>
                badge
              </span>
            </div>
            <div>
              <p className="font-label-md font-semibold text-on-surface">Verifikasi KTP</p>
              <p className="font-label-sm text-on-surface-variant tracking-normal mt-1">
                Proses pengajuan KTP
              </p>
            </div>
          </button>
          <button
            onClick={() => navigate('/admin/umkm')}
            className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center gap-4 text-left hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontSize: '23px' }}>
                storefront
              </span>
            </div>
            <div>
              <p className="font-label-md font-semibold text-on-surface">Approval UMKM</p>
              <p className="font-label-sm text-on-surface-variant tracking-normal mt-1">
                Setujui UMKM baru
              </p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
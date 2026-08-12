// src/pages/UmkmPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { dummyUmkmList } from '../data/umkmDummy';

const UmkmPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ['Semua', ...new Set(dummyUmkmList.map(item => item.kategori))];
  const filtered = selectedCategory === 'Semua' ? dummyUmkmList : dummyUmkmList.filter(item => item.kategori === selectedCategory);
  const activeUmkm = filtered.filter(item => item.status === 'active');

  const totalPages = Math.ceil(activeUmkm.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentItems = activeUmkm.slice(start, start + itemsPerPage);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline-md text-3xl md:text-4xl font-bold text-primary">UMKM Desa Sumberporong</h1>
          <p className="mt-4 max-w-2xl text-on-surface-variant">Temukan berbagai usaha lokal yang siap melayani Anda.</p>

          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map(cat => (
              <button key={cat} onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/20 hover:bg-primary/10'}`}>
                {cat}
              </button>
            ))}
          </div>
          <p className="text-sm text-on-surface-variant mt-3">Menampilkan {activeUmkm.length} UMKM</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {currentItems.map((umkm) => (
              <Link key={umkm.id} to={`/umkm/${umkm.id}`} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 hover:shadow-md transition-all hover:-translate-y-1 group">
                <div className="h-48 overflow-hidden">
                  <img src={umkm.foto_utama} alt={umkm.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-primary bg-primary/10 inline-block px-2 py-1 rounded-full">{umkm.kategori}</p>
                  <h2 className="font-headline-md text-lg font-bold text-on-surface mt-2 line-clamp-1">{umkm.nama}</h2>
                  <p className="text-sm text-on-surface-variant line-clamp-2 mt-1">{umkm.deskripsi}</p>
                  <p className="text-sm font-bold text-primary mt-2">{formatRupiah(umkm.harga_min)} - {formatRupiah(umkm.harga_max)}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    {umkm.jam_buka} - {umkm.jam_tutup}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 rounded-lg border border-outline-variant/30 hover:bg-primary/10 disabled:opacity-40">Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`px-4 py-2 rounded-lg ${currentPage === p ? 'bg-primary text-white' : 'border border-outline-variant/30 hover:bg-primary/10'}`}>{p}</button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 rounded-lg border border-outline-variant/30 hover:bg-primary/10 disabled:opacity-40">Next</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UmkmPage;
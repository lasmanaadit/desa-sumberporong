// src/pages/UmkmPage.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

const PER_PAGE_CLIENT = 6;              // 6 per halaman di FE
const ASSUMED_BACKEND_PER_PAGE = 12;    // sesuai ->paginate(12)
const MAX_PAGES = 50;

const UmkmPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [allUmkm, setAllUmkm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /*
  |--------------------------------------------------------------------------
  | FETCH SEMUA HALAMAN
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      setError('');

      try {
        const collected = [];
        let page = 1;

        while (page <= MAX_PAGES) {
          const res = await api.get('/umkm', { params: { page } });
          if (cancelled) return;

          const payload = res.data?.data;

          let items = [];
          let meta = null;

          if (Array.isArray(payload)) {
            items = payload;
          } else if (payload && Array.isArray(payload.data)) {
            items = payload.data;
            meta = payload.meta || null;
          }

          if (items.length === 0) break;

          collected.push(...items);

          if (meta?.last_page) {
            if (page >= Number(meta.last_page)) break;
          } else {
            if (items.length < ASSUMED_BACKEND_PER_PAGE) break;
          }

          page += 1;
        }

        if (!cancelled) {
          setAllUmkm(collected);
          setCurrentPage(1);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Gagal mengambil UMKM:', err);
        setError(err.response?.data?.message || 'Gagal memuat data UMKM.');
        setAllUmkm([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SORT + FILTER + PAGINATION (CLIENT)
  |--------------------------------------------------------------------------
  */
  const sortedUmkm = useMemo(() => {
    const getTime = (item) => {
      const v = item?.created_at || item?.updated_at;
      if (!v) return 0;
      const t = new Date(v).getTime();
      return Number.isNaN(t) ? 0 : t;
    };
    return [...allUmkm].sort((a, b) => getTime(b) - getTime(a));
  }, [allUmkm]);

  const categories = useMemo(() => {
    const names = sortedUmkm.map((item) => item.kategori?.nama).filter(Boolean);
    return ['Semua', ...new Set(names)];
  }, [sortedUmkm]);

  const filteredUmkm = useMemo(() => {
    if (selectedCategory === 'Semua') return sortedUmkm;
    return sortedUmkm.filter((item) => item.kategori?.nama === selectedCategory);
  }, [sortedUmkm, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredUmkm.length / PER_PAGE_CLIENT));
  const startIndex = (currentPage - 1) * PER_PAGE_CLIENT;
  const currentItems = filteredUmkm.slice(startIndex, startIndex + PER_PAGE_CLIENT);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */
  const formatRupiah = (value) => {
    const number = Number(value);
    if (Number.isNaN(number)) return 'Rp0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const getPrimaryPhoto = (umkm) => {
    if (!Array.isArray(umkm?.foto)) return null;
    const photos = [...umkm.foto].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
    return photos[0]?.url || null;
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const total = totalPages;
    const current = currentPage;
    const pages = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (current > 3) pages.push('...');
    const s = Math.max(2, current - 1);
    const e = Math.min(total - 1, current + 1);
    for (let i = s; i <= e; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */
  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-7xl mx-auto">
            <div className="h-10 w-72 max-w-full bg-surface-container-low rounded-lg animate-pulse" />
            <div className="h-5 w-96 max-w-full bg-surface-container-low rounded-lg mt-4 animate-pulse" />

            <div className="flex flex-wrap gap-2 mt-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-9 w-24 bg-surface-container-low rounded-full animate-pulse" />
              ))}
            </div>

            <div className="h-4 w-40 bg-surface-container-low rounded mt-4 animate-pulse" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {Array.from({ length: PER_PAGE_CLIENT }).map((_, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20">
                  <div className="h-48 bg-surface-container-low animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-24 bg-surface-container-low rounded-full animate-pulse" />
                    <div className="h-6 w-48 bg-surface-container-low rounded animate-pulse" />
                    <div className="h-10 w-full bg-surface-container-low rounded animate-pulse" />
                    <div className="h-5 w-36 bg-surface-container-low rounded animate-pulse" />
                    <div className="h-4 w-44 bg-surface-container-low rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN RENDER
  |--------------------------------------------------------------------------
  */
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-7xl mx-auto">
          <div>
            <h1 className="font-headline-md text-3xl md:text-4xl font-bold text-primary">
              UMKM Desa Sumberporong
            </h1>
            <p className="mt-4 max-w-2xl text-on-surface-variant leading-relaxed">
              Temukan berbagai usaha lokal yang siap melayani Anda.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <div className="flex items-start gap-3 text-red-700">
                <span className="material-symbols-outlined shrink-0">error</span>
                <p className="text-sm wrap-break-word">{error}</p>
              </div>
            </div>
          )}

          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/20 hover:bg-primary/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          <p className="text-sm text-on-surface-variant mt-4">
            Menampilkan{' '}
            <span className="font-semibold text-on-surface">{filteredUmkm.length}</span> UMKM
            {selectedCategory !== 'Semua' && (
              <> dalam kategori <span className="font-semibold text-primary">{selectedCategory}</span></>
            )}
          </p>

          {currentItems.length === 0 ? (
            <div className="mt-8 w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-6 py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-4xl">storefront</span>
              </div>
              <h2 className="font-headline-md text-xl text-on-surface mt-5">Belum ada UMKM</h2>
              <p className="mx-auto mt-3 text-sm text-on-surface-variant leading-relaxed"
                style={{ width: '100%', maxWidth: '520px' }}>
                Belum ada UMKM aktif yang tersedia pada kategori ini.
              </p>
              {selectedCategory !== 'Semua' && (
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('Semua'); setCurrentPage(1); }}
                  className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">filter_alt_off</span>
                  Tampilkan Semua UMKM
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {currentItems.map((umkm) => {
                const primaryPhoto = getPrimaryPhoto(umkm);
                return (
                  <Link
                    key={umkm.id}
                    to={`/umkm/${umkm.id}`}
                    className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden bg-surface-container-high">
                      {primaryPhoto ? (
                        <img
                          src={primaryPhoto}
                          alt={umkm.nama_umkm || 'Foto UMKM'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">image</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-xs font-semibold text-primary bg-primary/10 inline-flex items-center px-2 py-1 rounded-full w-fit">
                        {umkm.kategori?.nama || 'Tanpa kategori'}
                      </span>

                      <h2 className="font-headline-md text-lg font-bold text-on-surface mt-2 line-clamp-1">
                        {umkm.nama_umkm || 'Tanpa nama'}
                      </h2>

                      <p className="text-sm text-on-surface-variant line-clamp-2 mt-1 flex-1 leading-relaxed">
                        {umkm.deskripsi_umkm || '-'}
                      </p>

                      <p className="text-sm font-bold text-primary mt-3">
                        {formatRupiah(umkm.harga_min)} - {formatRupiah(umkm.harga_max)}
                      </p>

                      <div className="flex items-start gap-2 mt-3 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-base shrink-0">schedule</span>
                        <span>
                          {umkm.jam_buka_mulai && umkm.jam_buka_selesai
                            ? `${umkm.jam_buka_mulai} - ${umkm.jam_buka_selesai}`
                            : 'Jam operasional tidak tersedia'}
                        </span>
                      </div>

                      {umkm.alamat && (
                        <div className="flex items-start gap-2 mt-2 text-xs text-on-surface-variant">
                          <span className="material-symbols-outlined text-base shrink-0">location_on</span>
                          <span className="line-clamp-2">{umkm.alamat}</span>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-outline-variant/10">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:underline">
                          Lihat Detail
                          <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                            arrow_forward
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/30 text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                aria-label="Halaman sebelumnya"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              {getPageNumbers().map((page, index) =>
                page === '...' ? (
                  <span key={`e-${index}`} className="px-2 text-on-surface-variant select-none">…</span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'border border-outline-variant/30 text-primary hover:bg-primary/10'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/30 text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                aria-label="Halaman berikutnya"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UmkmPage;
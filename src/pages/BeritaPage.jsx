// src/pages/BeritaPage.jsx

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

const PER_PAGE_CLIENT = 8;               // 8 per halaman di FE
const ASSUMED_BACKEND_PER_PAGE = 12;     // sesuai ->paginate(12) di backend
const MAX_PAGES = 50;                    // safety

const BeritaPage = () => {
  const [allBerita, setAllBerita] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /*
  |--------------------------------------------------------------------------
  | FETCH SEMUA HALAMAN
  |--------------------------------------------------------------------------
  |
  | Karena backend tidak kirim meta.last_page, kita probe:
  | - Ambil halaman 1, 2, 3, ... sampai response kosong
  |   atau jumlah item < 12 (artinya sudah halaman terakhir)
  |
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
          const res = await api.get('/berita', { params: { page } });
          if (cancelled) return;

          const payload = res.data?.data;

          // Handle 2 bentuk: array langsung, atau { data: [...], meta: {...} }
          let items = [];
          let meta = null;

          if (Array.isArray(payload)) {
            items = payload;
          } else if (payload && Array.isArray(payload.data)) {
            items = payload.data;
            meta = payload.meta || null;
          }

          if (items.length === 0) break; // sudah tidak ada data

          collected.push(...items);

          // Kalau backend kirim meta, pakai itu untuk stop
          if (meta?.last_page) {
            if (page >= Number(meta.last_page)) break;
          } else {
            // Kalau tidak ada meta, stop kalau halaman kurang dari 12
            if (items.length < ASSUMED_BACKEND_PER_PAGE) break;
          }

          page += 1;
        }

        if (!cancelled) {
          setAllBerita(collected);
          setCurrentPage(1);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Gagal mengambil berita:', err);
        setError(err.response?.data?.message || 'Gagal memuat berita.');
        setAllBerita([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SORT + PAGINATION (CLIENT)
  |--------------------------------------------------------------------------
  */

  const sortedBerita = useMemo(() => {
    const getTime = (item) => {
      const v = item?.published_at || item?.created_at;
      if (!v) return 0;
      const t = new Date(v).getTime();
      return Number.isNaN(t) ? 0 : t;
    };
    return [...allBerita].sort((a, b) => getTime(b) - getTime(a));
  }, [allBerita]);

  const totalPages = Math.max(1, Math.ceil(sortedBerita.length / PER_PAGE_CLIENT));
  const start = (currentPage - 1) * PER_PAGE_CLIENT;
  const paginatedBerita = sortedBerita.slice(start, start + PER_PAGE_CLIENT);

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleImageError = (event) => {
    const image = event.currentTarget;
    image.style.display = 'none';
    const fallback = image.parentElement?.querySelector('[data-thumbnail-fallback]');
    if (fallback) {
      fallback.classList.remove('hidden');
      fallback.classList.add('flex');
    }
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

  const startItem = sortedBerita.length === 0 ? 0 : start + 1;
  const endItem = Math.min(start + PER_PAGE_CLIENT, sortedBerita.length);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="bg-background text-on-surface font-body-md antialiased pt-18">
      <Navbar />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="mb-10">
            <h1 className="font-headline-md text-3xl font-bold text-primary">
              Berita Terkini
            </h1>
            <p className="mt-2 text-on-surface-variant">
              Informasi dan kegiatan terbaru Desa Sumberporong
            </p>
          </div>

          {error && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: PER_PAGE_CLIENT }).map((_, index) => (
                <article
                  key={index}
                  className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm"
                >
                  <div className="aspect-16/10 bg-surface-container-high animate-pulse" />
                  <div className="p-5">
                    <div className="h-4 w-32 bg-surface-container-high rounded animate-pulse mb-4" />
                    <div className="h-5 w-full bg-surface-container-high rounded animate-pulse mb-2" />
                    <div className="h-5 w-4/5 bg-surface-container-high rounded animate-pulse mb-4" />
                    <div className="h-4 w-full bg-surface-container-high rounded animate-pulse mb-2" />
                    <div className="h-4 w-3/4 bg-surface-container-high rounded animate-pulse" />
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && sortedBerita.length === 0 && (
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
                newspaper
              </span>
              <h2 className="font-headline-md text-xl font-semibold text-on-surface mt-4">
                Belum ada berita
              </h2>
              <p className="text-sm text-on-surface-variant mt-2">
                Belum ada berita yang dipublikasikan.
              </p>
            </div>
          )}

          {!loading && !error && paginatedBerita.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedBerita.map((berita) => (
                <article
                  key={berita.id}
                  className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="aspect-16/10 overflow-hidden bg-surface-container-high relative">
                    {berita.thumbnail ? (
                      <>
                        <img
                          src={berita.thumbnail}
                          alt={berita.judul}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                          onError={handleImageError}
                        />
                        <div
                          data-thumbnail-fallback
                          className="hidden absolute inset-0 items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
                            broken_image
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
                          image
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-3">
                      <span className="material-symbols-outlined text-base">
                        calendar_today
                      </span>
                      <span>{formatDate(berita.published_at || berita.created_at)}</span>
                    </div>

                    <h2 className="font-headline-md text-lg font-bold text-primary line-clamp-2 mb-3">
                      {berita.judul}
                    </h2>

                    <p className="text-sm text-on-surface-variant line-clamp-3 mb-5 flex-1 whitespace-pre-line">
                      {berita.isi}
                    </p>

                    <a
                      href={`/berita/${berita.slug}`}
                      className="flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all mt-auto"
                    >
                      Baca Selengkapnya
                      <span className="material-symbols-outlined text-base">
                        arrow_forward
                      </span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && sortedBerita.length > 0 && (
            <div className="mt-8 text-center text-sm text-on-surface-variant">
              Menampilkan{' '}
              <span className="font-semibold text-on-surface">{startItem}</span>
              –
              <span className="font-semibold text-on-surface">{endItem}</span>{' '}
              dari{' '}
              <span className="font-semibold text-on-surface">{sortedBerita.length}</span>{' '}
              berita
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
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
                  <span
                    key={`e-${index}`}
                    className="px-2 text-on-surface-variant select-none"
                  >
                    …
                  </span>
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
      </section>

      <Footer />
    </div>
  );
};

export default BeritaPage;
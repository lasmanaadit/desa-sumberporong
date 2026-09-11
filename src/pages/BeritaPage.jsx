// src/pages/BeritaPage.jsx

import React, {
  useEffect,
  useState,
} from 'react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import api from '../api/axios';

const BERITA_PER_PAGE = 8;

const BeritaPage = () => {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    beritaList,
    setBeritaList,
  ] = useState([]);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    lastPage,
    setLastPage,
  ] = useState(1);

  const [
    total,
    setTotal,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  /*
  |--------------------------------------------------------------------------
  | FETCH BERITA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    const fetchBerita = async () => {
      setLoading(true);
      setError('');

      try {
        const response =
          await api.get(
            '/berita',
            {
              params: {
                page: currentPage,
              },
            }
          );

        if (cancelled) {
          return;
        }

        const responseData =
          response.data?.data;

        /*
        |--------------------------------------------------------------------------
        | Support beberapa format response
        |--------------------------------------------------------------------------
        |
        | Format paginate Laravel biasanya:
        |
        | data: {
        |     current_page,
        |     data: [...]
        |     last_page,
        |     total
        | }
        |
        | Tetapi tetap kita handle kalau backend mengembalikan array.
        |
        */

        if (
          Array.isArray(
            responseData
          )
        ) {
          setBeritaList(
            responseData
          );

          setLastPage(
            1
          );

          setTotal(
            responseData.length
          );

          return;
        }

        const items =
          Array.isArray(
            responseData?.data
          )
            ? responseData.data
            : [];

        setBeritaList(
          items
        );

        setLastPage(
          Number(
            responseData?.last_page ||
            1
          )
        );

        setTotal(
          Number(
            responseData?.total ||
            items.length
          )
        );

        /*
        |--------------------------------------------------------------------------
        | Sinkronkan halaman dengan response backend
        |--------------------------------------------------------------------------
        */

        const backendPage =
          Number(
            responseData?.current_page ||
            currentPage
          );

        if (
          backendPage !==
          currentPage
        ) {
          setCurrentPage(
            backendPage
          );
        }
      } catch (
        err
      ) {
        if (cancelled) {
          return;
        }

        console.error(
          'Gagal mengambil berita:',
          err
        );

        setError(
          err.response?.data
            ?.message ||
          'Gagal mengambil daftar berita.'
        );

        setBeritaList(
          []
        );
      } finally {
        if (!cancelled) {
          setLoading(
            false
          );
        }
      }
    };

    fetchBerita();

    return () => {
      cancelled = true;
    };
  }, [
    currentPage,
  ]);

  /*
  |--------------------------------------------------------------------------
  | FORMAT TANGGAL
  |--------------------------------------------------------------------------
  */

  const formatDate = (
    value
  ) => {
    if (!value) {
      return '-';
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | THUMBNAIL ERROR
  |--------------------------------------------------------------------------
  */

  const handleImageError = (
    event
  ) => {
    const image =
      event.currentTarget;

    image.style.display =
      'none';

    const fallback =
      image.parentElement
        ?.querySelector(
          '[data-thumbnail-fallback]'
        );

    if (fallback) {
      fallback.classList.remove(
        'hidden'
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PAGE CHANGE
  |--------------------------------------------------------------------------
  */

  const goToPage = (
    page
  ) => {
    if (
      page < 1 ||
      page > lastPage ||
      page === currentPage
    ) {
      return;
    }

    setCurrentPage(
      page
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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

          {/* =========================================================
              HEADER
          ========================================================== */}

          <div className="mb-10">

            <h1 className="font-headline-md text-3xl font-bold text-primary">
              Berita Terkini
            </h1>

            <p className="mt-2 text-on-surface-variant">
              Informasi dan kegiatan terbaru
              Desa Sumberporong
            </p>

          </div>

          {/* =========================================================
              ERROR
          ========================================================== */}

          {error && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">

              <div className="flex items-start gap-3">

                <span className="material-symbols-outlined">
                  error
                </span>

                <span>
                  {error}
                </span>

              </div>

            </div>
          )}

          {/* =========================================================
              LOADING
          ========================================================== */}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {Array.from({
                length:
                  BERITA_PER_PAGE,
              }).map(
                (
                  _,
                  index
                ) => (
                  <article
                    key={
                      index
                    }
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
                )
              )}

            </div>
          )}

          {/* =========================================================
              EMPTY
          ========================================================== */}

          {!loading &&
            !error &&
            beritaList.length ===
              0 && (
              <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-12 text-center">

                <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
                  newspaper
                </span>

                <h2 className="font-headline-md text-xl font-semibold text-on-surface mt-4">
                  Belum ada berita
                </h2>

                <p className="text-sm text-on-surface-variant mt-2">
                  Belum ada berita yang
                  dipublikasikan.
                </p>

              </div>
            )}

          {/* =========================================================
              GRID BERITA
          ========================================================== */}

          {!loading &&
            !error &&
            beritaList.length >
              0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {beritaList.map(
                  (
                    berita
                  ) => (
                    <article
                      key={
                        berita.id
                      }
                      className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                    >

                      {/* =================================================
                          THUMBNAIL
                      ================================================== */}

                      <div className="aspect-16/10 overflow-hidden bg-surface-container-high relative">

                        {berita.thumbnail ? (
                          <>
                            <img
                              src={
                                berita.thumbnail
                              }
                              alt={
                                berita.judul
                              }
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              loading="lazy"
                              onError={
                                handleImageError
                              }
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

                      {/* =================================================
                          CONTENT
                      ================================================== */}

                      <div className="p-5 flex flex-col flex-1">

                        {/* DATE */}

                        <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-3">

                          <span className="material-symbols-outlined text-base">
                            calendar_today
                          </span>

                          <span>
                            {formatDate(
                              berita.published_at
                            )}
                          </span>

                        </div>

                        {/* TITLE */}

                        <h2 className="font-headline-md text-lg font-bold text-primary line-clamp-2 mb-3">
                          {
                            berita.judul
                          }
                        </h2>

                        {/* CONTENT */}

                        <p className="text-sm text-on-surface-variant line-clamp-3 mb-5 flex-1 whitespace-pre-line">
                          {
                            berita.isi
                          }
                        </p>

                        {/* =================================================
                            DETAIL
                            PENTING: SLUG
                        ================================================== */}

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
                  )
                )}

              </div>
            )}

          {/* =========================================================
              INFO TOTAL
          ========================================================== */}

          {!loading &&
            !error &&
            beritaList.length >
              0 && (
              <div className="mt-8 text-center text-sm text-on-surface-variant">

                Menampilkan{' '}

                <span className="font-semibold text-on-surface">
                  {beritaList.length}
                </span>{' '}

                berita

                {total > 0 && (
                  <>
                    {' '}dari{' '}

                    <span className="font-semibold text-on-surface">
                      {total}
                    </span>
                  </>
                )}

              </div>
            )}

          {/* =========================================================
              PAGINATION
          ========================================================== */}

          {!loading &&
            !error &&
            lastPage > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">

                {/* PREVIOUS */}

                <button
                  type="button"
                  onClick={() =>
                    goToPage(
                      currentPage -
                        1
                    )
                  }
                  disabled={
                    currentPage ===
                    1
                  }
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/30 text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                  aria-label="Halaman sebelumnya"
                >

                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>

                </button>

                {/* PAGE NUMBERS */}

                {Array.from(
                  {
                    length:
                      lastPage,
                  },
                  (
                    _,
                    index
                  ) =>
                    index + 1
                ).map(
                  (
                    page
                  ) => (
                    <button
                      key={
                        page
                      }
                      type="button"
                      onClick={() =>
                        goToPage(
                          page
                        )
                      }
                      className={`w-10 h-10 rounded-lg font-semibold transition ${
                        currentPage ===
                        page
                          ? 'bg-primary text-white'
                          : 'border border-outline-variant/30 text-primary hover:bg-primary/10'
                      }`}
                    >
                      {
                        page
                      }
                    </button>
                  )
                )}

                {/* NEXT */}

                <button
                  type="button"
                  onClick={() =>
                    goToPage(
                      currentPage +
                        1
                    )
                  }
                  disabled={
                    currentPage ===
                    lastPage
                  }
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/30 text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                  aria-label="Halaman berikutnya"
                >

                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>

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
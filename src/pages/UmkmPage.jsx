// src/pages/UmkmPage.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

const ITEMS_PER_PAGE = 6;

const UmkmPage = () => {
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('Semua');

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    umkmList,
    setUmkmList,
  ] = useState([]);

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
  | Fetch UMKM Public
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const fetchUmkm = async () => {
      setLoading(true);
      setError('');

      try {
        const response =
          await api.get('/umkm');

        if (!mounted) {
          return;
        }

        const responseData =
          response.data?.data;

        let data = [];

        /*
        |--------------------------------------------------------------------------
        | Laravel Resource Collection
        |--------------------------------------------------------------------------
        */

        if (
          Array.isArray(responseData)
        ) {
          data = responseData;
        } else {
          data =
            responseData?.data || [];
        }

        setUmkmList(data);
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err.response?.data?.message ||
            'Gagal mengambil data UMKM.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUmkm();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const categories = useMemo(() => {
    const names = umkmList
      .map(
        (item) =>
          item.kategori?.nama
      )
      .filter(Boolean);

    return [
      'Semua',
      ...new Set(names),
    ];
  }, [umkmList]);

  /*
  |--------------------------------------------------------------------------
  | Filter UMKM
  |--------------------------------------------------------------------------
  */

  const filteredUmkm = useMemo(() => {
    if (
      selectedCategory === 'Semua'
    ) {
      return umkmList;
    }

    return umkmList.filter(
      (item) =>
        item.kategori?.nama ===
        selectedCategory
    );
  }, [
    umkmList,
    selectedCategory,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredUmkm.length /
        ITEMS_PER_PAGE
    )
  );

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const currentItems =
    filteredUmkm.slice(
      startIndex,
      startIndex +
        ITEMS_PER_PAGE
    );

  /*
  |--------------------------------------------------------------------------
  | Reset Page
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(1);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const formatRupiah = (
    value
  ) => {
    const number =
      Number(value);

    if (
      Number.isNaN(number)
    ) {
      return 'Rp0';
    }

    return new Intl.NumberFormat(
      'id-ID',
      {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    ).format(number);
  };

  const getPrimaryPhoto = (
    umkm
  ) => {
    if (
      !Array.isArray(
        umkm?.foto
      )
    ) {
      return null;
    }

    const photos = [
      ...umkm.foto,
    ].sort(
      (
        first,
        second
      ) =>
        (first.urutan || 0) -
        (second.urutan || 0)
    );

    return (
      photos[0]?.url ||
      null
    );
  };

  const getPageNumbers = () => {
    if (
      totalPages <= 5
    ) {
      return Array.from(
        {
          length:
            totalPages,
        },
        (_, index) =>
          index + 1
      );
    }

    const pages = [1];

    if (
      currentPage > 3
    ) {
      pages.push('...');
    }

    const start =
      Math.max(
        2,
        currentPage - 1
      );

    const end =
      Math.min(
        totalPages - 1,
        currentPage + 1
      );

    for (
      let page = start;
      page <= end;
      page += 1
    ) {
      pages.push(page);
    }

    if (
      currentPage <
      totalPages - 2
    ) {
      pages.push('...');
    }

    pages.push(
      totalPages
    );

    return pages;
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">

        <Navbar />

        <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop">

          <div className="max-w-7xl mx-auto">

            {/* Header Skeleton */}

            <div className="h-10 w-72 max-w-full bg-surface-container-low rounded-lg animate-pulse" />

            <div className="h-5 w-96 max-w-full bg-surface-container-low rounded-lg mt-4 animate-pulse" />

            {/* Category Skeleton */}

            <div className="flex flex-wrap gap-2 mt-6">

              {Array.from({
                length: 5,
              }).map(
                (
                  _,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="h-9 w-24 bg-surface-container-low rounded-full animate-pulse"
                  />
                )
              )}

            </div>

            {/* Count Skeleton */}

            <div className="h-4 w-40 bg-surface-container-low rounded mt-4 animate-pulse" />

            {/* Card Skeleton */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

              {Array.from({
                length: 6,
              }).map(
                (
                  _,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20"
                  >

                    <div className="h-48 bg-surface-container-low animate-pulse" />

                    <div className="p-4 space-y-3">

                      <div className="h-5 w-24 bg-surface-container-low rounded-full animate-pulse" />

                      <div className="h-6 w-48 bg-surface-container-low rounded animate-pulse" />

                      <div className="h-10 w-full bg-surface-container-low rounded animate-pulse" />

                      <div className="h-5 w-36 bg-surface-container-low rounded animate-pulse" />

                      <div className="h-4 w-44 bg-surface-container-low rounded animate-pulse" />

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

        </main>

        <Footer />

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-surface">

      <Navbar />

      <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop">

        <div className="max-w-7xl mx-auto">

          {/* ======================================================
              HEADER
          ======================================================= */}

          <div>

            <h1 className="font-headline-md text-3xl md:text-4xl font-bold text-primary">
              UMKM Desa Sumberporong
            </h1>

            <p className="mt-4 max-w-2xl text-on-surface-variant leading-relaxed">
              Temukan berbagai usaha lokal
              yang siap melayani Anda.
            </p>

          </div>

          {/* ======================================================
              ERROR
          ======================================================= */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

              <div className="flex items-start gap-3 text-red-700">

                <span className="material-symbols-outlined shrink-0">
                  error
                </span>

                <p className="text-sm wrap-break-word">
                  {error}
                </p>

              </div>

            </div>
          )}

          {/* ======================================================
              CATEGORY
          ======================================================= */}

          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-6">

              {categories.map(
                (
                  category
                ) => (
                  <button
                    key={
                      category
                    }
                    type="button"
                    onClick={() => {
                      setSelectedCategory(
                        category
                      );
                      setCurrentPage(
                        1
                      );
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedCategory ===
                      category
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/20 hover:bg-primary/10'
                    }`}
                  >
                    {
                      category
                    }
                  </button>
                )
              )}

            </div>
          )}

          {/* ======================================================
              COUNT
          ======================================================= */}

          <p className="text-sm text-on-surface-variant mt-4">
            Menampilkan{' '}

            <span className="font-semibold text-on-surface">
              {
                filteredUmkm.length
              }
            </span>{' '}

            UMKM

            {selectedCategory !==
              'Semua' && (
              <>
                {' '}
                dalam kategori{' '}

                <span className="font-semibold text-primary">
                  {
                    selectedCategory
                  }
                </span>
              </>
            )}
          </p>

          {/* ======================================================
              EMPTY STATE
          ======================================================= */}

          {currentItems.length ===
          0 ? (
            <div className="mt-8 w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-6 py-16 text-center">

              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">

                <span className="material-symbols-outlined text-4xl">
                  storefront
                </span>

              </div>

              <h2 className="font-headline-md text-xl text-on-surface mt-5">
                Belum ada UMKM
              </h2>

              <p
                className="mx-auto mt-3 text-sm text-on-surface-variant leading-relaxed text-center"
                style={{
                  width: '100%',
                  maxWidth: '520px',
                }}
              >
                Belum ada UMKM aktif yang
                tersedia pada kategori ini.
              </p>

              {selectedCategory !==
                'Semua' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(
                      'Semua'
                    );

                    setCurrentPage(
                      1
                    );
                  }}
                  className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container transition-colors"
                >

                  <span className="material-symbols-outlined text-lg">
                    filter_alt_off
                  </span>

                  Tampilkan Semua UMKM

                </button>
              )}

            </div>
          ) : (

            /* ====================================================
               GRID
            ===================================================== */

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

              {currentItems.map(
                (
                  umkm
                ) => {

                  const primaryPhoto =
                    getPrimaryPhoto(
                      umkm
                    );

                  return (
                    <Link
                      key={
                        umkm.id
                      }
                      to={`/umkm/${umkm.id}`}
                      className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col"
                    >

                      {/* ==================================================
                          FOTO
                      =================================================== */}

                      <div className="relative h-48 overflow-hidden bg-surface-container-high">

                        {primaryPhoto ? (
                          <img
                            src={
                              primaryPhoto
                            }
                            alt={
                              umkm.nama_umkm ||
                              'Foto UMKM'
                            }
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">

                            <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">
                              image
                            </span>

                          </div>
                        )}

                      </div>

                      {/* ==================================================
                          CONTENT
                      =================================================== */}

                      <div className="p-4 flex flex-col flex-1">

                        {/* KATEGORI */}

                        <span className="text-xs font-semibold text-primary bg-primary/10 inline-flex items-center px-2 py-1 rounded-full w-fit">
                          {
                            umkm.kategori
                              ?.nama ||
                            'Tanpa kategori'
                          }
                        </span>

                        {/* NAMA */}

                        <h2 className="font-headline-md text-lg font-bold text-on-surface mt-2 line-clamp-1">
                          {
                            umkm.nama_umkm ||
                            'Tanpa nama'
                          }
                        </h2>

                        {/* DESKRIPSI */}

                        <p className="text-sm text-on-surface-variant line-clamp-2 mt-1 flex-1 leading-relaxed">
                          {
                            umkm.deskripsi_umkm ||
                            '-'
                          }
                        </p>

                        {/* HARGA */}

                        <p className="text-sm font-bold text-primary mt-3">
                          {
                            formatRupiah(
                              umkm.harga_min
                            )
                          }{' '}
                          -{' '}
                          {
                            formatRupiah(
                              umkm.harga_max
                            )
                          }
                        </p>

                        {/* JAM */}

                        <div className="flex items-start gap-2 mt-3 text-xs text-on-surface-variant">

                          <span className="material-symbols-outlined text-base shrink-0">
                            schedule
                          </span>

                          <span>
                            {umkm.jam_buka_mulai &&
                            umkm.jam_buka_selesai
                              ? `${umkm.jam_buka_mulai} - ${umkm.jam_buka_selesai}`
                              : 'Jam operasional tidak tersedia'}
                          </span>

                        </div>

                        {/* ALAMAT */}

                        {umkm.alamat && (
                          <div className="flex items-start gap-2 mt-2 text-xs text-on-surface-variant">

                            <span className="material-symbols-outlined text-base shrink-0">
                              location_on
                            </span>

                            <span className="line-clamp-2">
                              {
                                umkm.alamat
                              }
                            </span>

                          </div>
                        )}

                        {/* DETAIL */}

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
                }
              )}

            </div>
          )}

          {/* ======================================================
              PAGINATION
          ======================================================= */}

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">

              <button
                type="button"
                disabled={
                  currentPage ===
                  1
                }
                onClick={() =>
                  setCurrentPage(
                    (
                      page
                    ) =>
                      page - 1
                  )
                }
                className="px-4 py-2 rounded-lg border border-outline-variant/30 text-sm hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>

              {getPageNumbers().map(
                (
                  page,
                  index
                ) =>
                  page ===
                  '...' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-on-surface-variant"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={
                        page
                      }
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                      className={`min-w-10 px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentPage ===
                        page
                          ? 'bg-primary text-white'
                          : 'border border-outline-variant/30 hover:bg-primary/10'
                      }`}
                    >
                      {
                        page
                      }
                    </button>
                  )
              )}

              <button
                type="button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (
                      page
                    ) =>
                      page + 1
                  )
                }
                className="px-4 py-2 rounded-lg border border-outline-variant/30 text-sm hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Berikutnya
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
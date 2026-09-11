// src/components/Berita.jsx

import React, {
  useEffect,
  useState,
} from 'react';

import {
  FaArrowRight,
} from 'react-icons/fa';

import api from '../api/axios';

const Berita = () => {
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
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  /*
  |--------------------------------------------------------------------------
  | FETCH BERITA PUBLIC
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
            '/berita'
          );

        if (cancelled) {
          return;
        }

        const responseData =
          response.data?.data;

        let data = [];

        /*
        |--------------------------------------------------------------------------
        | Support:
        |
        | 1. data langsung array
        | 2. Laravel pagination:
        |    data: {
        |      data: [...]
        |    }
        |--------------------------------------------------------------------------
        */

        if (
          Array.isArray(
            responseData
          )
        ) {
          data =
            responseData;
        } else {
          data =
            Array.isArray(
              responseData?.data
            )
              ? responseData.data
              : [];
        }

        /*
        |--------------------------------------------------------------------------
        | Ambil maksimal 4 berita
        |--------------------------------------------------------------------------
        */

        setBeritaList(
          data.slice(
            0,
            4
          )
        );
      } catch (
        err
      ) {
        if (cancelled) {
          return;
        }

        console.error(
          'Gagal mengambil berita public:',
          err
        );

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            'Gagal mengambil berita.'
        );

        setBeritaList([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBerita();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FORMAT DATE
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
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section className="py-xl bg-surface-container-low">

      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">

        {/* =========================================================
            HEADER
        ========================================================== */}

        <div className="text-center mb-xl">

          <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
            Berita Terkini
          </h2>

          <div className="w-16 h-1 bg-primary rounded-full mx-auto" />

        </div>

        {/* =========================================================
            LOADING
        ========================================================== */}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {Array.from({
              length: 4,
            }).map(
              (
                _,
                index
              ) => (
                <article
                  key={
                    index
                  }
                  className="bg-surface rounded-xl overflow-hidden shadow-sm border border-outline-variant/20"
                >

                  <div className="h-56 bg-surface-container-high animate-pulse" />

                  <div className="p-md space-y-3">

                    <div className="h-4 w-32 rounded bg-surface-container-high animate-pulse" />

                    <div className="h-6 w-full rounded bg-surface-container-high animate-pulse" />

                    <div className="h-4 w-full rounded bg-surface-container-high animate-pulse" />

                    <div className="h-4 w-3/4 rounded bg-surface-container-high animate-pulse" />

                  </div>

                </article>
              )
            )}

          </div>
        )}

        {/* =========================================================
            ERROR
        ========================================================== */}

        {!loading &&
          error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center text-red-600">

              {error}

            </div>
          )}

        {/* =========================================================
            EMPTY
        ========================================================== */}

        {!loading &&
          !error &&
          beritaList.length ===
            0 && (
            <div className="rounded-xl bg-surface p-10 text-center border border-outline-variant/20">

              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
                newspaper
              </span>

              <h3 className="font-headline-md text-xl text-on-surface mt-4">
                Belum ada berita
              </h3>

              <p className="text-on-surface-variant mt-2">
                Belum ada berita
                yang dipublikasikan.
              </p>

            </div>
          )}

        {/* =========================================================
            GRID
        ========================================================== */}

        {!loading &&
          !error &&
          beritaList.length >
            0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {beritaList.map(
                (
                  berita
                ) => {

                  /*
                  |--------------------------------------------------------------------------
                  | Backend sudah mengirim URL thumbnail.
                  |
                  | Contoh:
                  | http://127.0.0.1:8000/api/files/public/berita/1
                  |--------------------------------------------------------------------------
                  */

                  const thumbnailUrl =
                    berita?.thumbnail ||
                    '';

                  return (
                    <article
                      key={
                        berita.id
                      }
                      className="bg-surface rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 transition-all hover:shadow-md hover:-translate-y-1 duration-300 flex flex-col h-full"
                    >

                      {/* =================================================
                          IMAGE
                      ================================================== */}

                      <div className="h-56 overflow-hidden bg-surface-container-high relative">

                        {thumbnailUrl ? (
                          <img
                            src={
                              thumbnailUrl
                            }
                            alt={
                              berita.judul
                            }
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                            onError={(
                              event
                            ) => {
                              console.error(
                                'Thumbnail public berita gagal dimuat:',
                                {
                                  id: berita.id,
                                  url: thumbnailUrl,
                                }
                              );

                              event.currentTarget.style.display =
                                'none';

                              const fallback =
                                event.currentTarget.parentElement?.querySelector(
                                  '[data-thumbnail-fallback]'
                                );

                              if (
                                fallback
                              ) {
                                fallback.classList.remove(
                                  'hidden'
                                );

                                fallback.classList.add(
                                  'flex'
                                );
                              }
                            }}
                          />
                        ) : null}

                        {/* FALLBACK */}

                        <div
                          data-thumbnail-fallback
                          className={`absolute inset-0 items-center justify-center ${
                            thumbnailUrl
                              ? 'hidden'
                              : 'flex'
                          }`}
                        >

                          <div className="text-center">

                            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">
                              {
                                thumbnailUrl
                                  ? 'broken_image'
                                  : 'image'
                              }
                            </span>

                            {thumbnailUrl && (
                              <p className="text-xs text-on-surface-variant mt-2">
                                Thumbnail tidak tersedia
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* =================================================
                          CONTENT
                      ================================================== */}

                      <div className="p-md flex flex-col flex-1">

                        {/* DATE */}

                        <div className="flex items-center gap-sm text-label-sm text-primary mb-xs">

                          <span className="material-symbols-outlined text-[16px]">
                            calendar_today
                          </span>

                          {formatDate(
                            berita.published_at ||
                            berita.created_at
                          )}

                        </div>

                        {/* TITLE */}

                        <h3 className="font-headline-md text-headline-md text-on-surface mb-sm line-clamp-2">

                          {
                            berita.judul
                          }

                        </h3>

                        {/* CONTENT */}

                        <p className="font-body-md text-body-md text-on-surface-variant flex-1 line-clamp-3">

                          {
                            berita.isi
                          }

                        </p>

                        {/* =================================================
                            DETAIL
                            PAKAI SLUG
                        ================================================== */}

                        <a
                          href={`/berita/${berita.slug}`}
                          className="font-label-md text-label-md text-primary hover:text-primary-container mt-sm inline-flex items-center gap-xs transition-colors"
                        >

                          Baca Selengkapnya

                          <FaArrowRight className="text-sm" />

                        </a>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        {/* =========================================================
            LIHAT SEMUA
        ========================================================== */}

        {!loading &&
          !error &&
          beritaList.length >
            0 && (
            <div className="text-right mt-lg">

              <a
                href="/berita"
                className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-lg transition-colors inline-flex items-center gap-2"
              >

                Lihat Semua Berita

                <FaArrowRight className="text-sm" />

              </a>

            </div>
          )}

      </div>

    </section>
  );
};

export default Berita;
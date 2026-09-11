// src/pages/GaleriPage.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import api from '../api/axios';

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
*/

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000/api';

/*
|--------------------------------------------------------------------------
| HELPER FOTO
|--------------------------------------------------------------------------
*/

const getFotoUrl = (
  item
) => {
  if (
    !item?.id
  ) {
    return '';
  }

  /*
  |--------------------------------------------------------------------------
  | URL lengkap
  |--------------------------------------------------------------------------
  */

  if (
    typeof item.foto === 'string' &&
    /^https?:\/\//i.test(
      item.foto
    )
  ) {
    return item.foto;
  }

  /*
  |--------------------------------------------------------------------------
  | URL /api/...
  |--------------------------------------------------------------------------
  */

  if (
    typeof item.foto === 'string' &&
    item.foto.startsWith(
      '/api/'
    )
  ) {
    const base =
      API_BASE_URL.replace(
        /\/api$/,
        ''
      );

    return (
      base +
      item.foto
    );
  }

  /*
  |--------------------------------------------------------------------------
  | URL relatif
  |--------------------------------------------------------------------------
  */

  if (
    typeof item.foto === 'string' &&
    item.foto.startsWith(
      '/'
    )
  ) {
    return (
      API_BASE_URL +
      item.foto
    );
  }

  /*
  |--------------------------------------------------------------------------
  | FALLBACK PUBLIC
  |--------------------------------------------------------------------------
  */

  return (
    API_BASE_URL +
    '/files/public/galeri/' +
    item.id
  );
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const GaleriPage = () => {
  const [
    galeriList,
    setGaleriList,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(null);

  const [
    imageErrors,
    setImageErrors,
  ] = useState({});

  /*
  |--------------------------------------------------------------------------
  | FETCH
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled =
      false;

    const fetchGaleri =
      async () => {
        setLoading(true);
        setError('');

        try {
          const response =
            await api.get(
              '/galeri'
            );

          if (
            cancelled
          ) {
            return;
          }

          const responseData =
            response.data?.data;

          const items =
            Array.isArray(
              responseData
            )
              ? responseData
              : [];

          setGaleriList(
            items
          );

          setImageErrors(
            {}
          );
        } catch (
          err
        ) {
          if (
            cancelled
          ) {
            return;
          }

          console.error(
            'Gagal mengambil galeri:',
            err
          );

          setGaleriList(
            []
          );

          setError(
            err.response?.data
              ?.message ||
              'Gagal mengambil data galeri desa.'
          );
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false
            );
          }
        }
      };

    fetchGaleri();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SORT
  |--------------------------------------------------------------------------
  */

  const sortedGaleri =
    useMemo(() => {
      return [
        ...galeriList,
      ].sort(
        (
          a,
          b
        ) => {
          const dateA =
            new Date(
              a.created_at ||
                0
            ).getTime();

          const dateB =
            new Date(
              b.created_at ||
                0
            ).getTime();

          return (
            dateB -
            dateA
          );
        }
      );
    }, [
      galeriList,
    ]);

  /*
  |--------------------------------------------------------------------------
  | IMAGE ERROR
  |--------------------------------------------------------------------------
  */

  const handleImageError =
    (
      id
    ) => {
      setImageErrors(
        (
          previous
        ) => ({
          ...previous,

          [id]:
            true,
        })
      );
    };

  /*
  |--------------------------------------------------------------------------
  | ANIMATION
  |--------------------------------------------------------------------------
  */

  const containerVariants =
    {
      hidden: {
        opacity: 0,
      },

      visible: {
        opacity: 1,

        transition: {
          staggerChildren:
            0.05,
        },
      },
    };

  const itemVariants =
    {
      hidden: {
        opacity: 0,
        scale: 0.94,
      },

      visible: {
        opacity: 1,
        scale: 1,

        transition: {
          type: 'spring',
          stiffness: 220,
          damping: 20,
        },
      },

      exit: {
        opacity: 0,
        scale: 0.88,

        transition: {
          duration: 0.2,
        },
      },
    };

  const modalVariants =
    {
      hidden: {
        opacity: 0,
        scale: 0.9,
        y: 20,
      },

      visible: {
        opacity: 1,
        scale: 1,
        y: 0,

        transition: {
          type: 'spring',
          stiffness: 280,
          damping: 25,
        },
      },

      exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,

        transition: {
          duration: 0.2,
        },
      },
    };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col">

      <Navbar />

      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="relative py-xl bg-primary/5">

        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">

          <motion.h1
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="font-display-lg text-display-lg text-primary mb-md"
          >
            Galeri Desa Sumberporong
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.2,
              duration: 0.6,
            }}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto"
          >
            Dokumentasi kegiatan dan berbagai momen Desa Sumberporong dalam bingkai gambar.
          </motion.p>

        </div>

      </section>

      {/* =========================================================
          MAIN
      ========================================================== */}

      <main className="grow py-xl bg-surface-container-low">

        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">

          {/* =======================================================
              ERROR
          ======================================================== */}

          {!loading &&
            error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="max-w-2xl mx-auto mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-5"
              >

                <div className="flex flex-col items-center text-center">

                  <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center">

                    <span className="material-symbols-outlined text-3xl">
                      error
                    </span>

                  </div>

                  <h2 className="font-headline-md text-lg text-red-700 mt-4">
                    Gagal memuat galeri
                  </h2>

                  <p className="text-sm text-red-600 mt-2">
                    {
                      error
                    }
                  </p>

                </div>

              </motion.div>
            )}

          {/* =======================================================
              LOADING
          ======================================================== */}

          {loading && (
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
              style={{
                gridAutoRows:
                  '180px',
              }}
            >

              {Array.from(
                {
                  length: 8,
                }
              ).map(
                (
                  _,
                  index
                ) => {

                  let spanClass =
                    'col-span-1 row-span-1';

                  if (
                    index ===
                      0 ||
                    index ===
                      5
                  ) {
                    spanClass =
                      'col-span-2 row-span-2';
                  }

                  return (
                    <div
                      key={
                        index
                      }
                      className={`${spanClass} rounded-2xl overflow-hidden bg-surface-container-high animate-pulse`}
                    />
                  );
                }
              )}

            </div>
          )}

          {/* =======================================================
              EMPTY
          ======================================================== */}

          {!loading &&
            !error &&
            sortedGaleri.length ===
              0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="max-w-2xl mx-auto rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-6 py-14 text-center"
              >

                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                  <span className="material-symbols-outlined text-4xl">
                    photo_library
                  </span>

                </div>

                <h2 className="font-headline-md text-2xl font-bold text-on-surface mt-5">
                  Galeri belum tersedia
                </h2>

                <p className="text-sm text-on-surface-variant mt-2">
                  Belum ada dokumentasi foto yang ditambahkan oleh pemerintah desa.
                </p>

              </motion.div>
            )}

          {/* =======================================================
              GALERI
          ======================================================== */}

          {!loading &&
            !error &&
            sortedGaleri.length >
              0 && (
              <AnimatePresence mode="wait">

                <motion.div
                  variants={
                    containerVariants
                  }
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
                  style={{
                    gridAutoRows:
                      '180px',
                  }}
                >

                  {sortedGaleri.map(
                    (
                      item,
                      index
                    ) => {

                      const imageUrl =
                        getFotoUrl(
                          item
                        );

                      const hasError =
                        Boolean(
                          imageErrors[
                            item.id
                          ]
                        );

                      /*
                      |----------------------------------------------------
                      | LAYOUT
                      |----------------------------------------------------
                      */

                      let spanClass =
                        'col-span-1 row-span-1';

                      if (
                        index ===
                        0
                      ) {
                        spanClass =
                          'col-span-2 row-span-2';
                      }

                      if (
                        index ===
                        3
                      ) {
                        spanClass =
                          'col-span-1 row-span-2';
                      }

                      if (
                        index ===
                        5
                      ) {
                        spanClass =
                          'col-span-2 row-span-2';
                      }

                      if (
                        index ===
                        7
                      ) {
                        spanClass =
                          'col-span-1 row-span-2';
                      }

                      return (
                        <motion.button
                          key={
                            item.id
                          }
                          variants={
                            itemVariants
                          }
                          type="button"
                          disabled={
                            hasError ||
                            !imageUrl
                          }
                          onClick={() => {
                            if (
                              hasError ||
                              !imageUrl
                            ) {
                              return;
                            }

                            setSelectedImage(
                              {
                                ...item,
                                imageUrl,
                              }
                            );
                          }}
                          className={`${spanClass} relative min-w-0 min-h-0 overflow-hidden rounded-2xl bg-surface shadow-sm border border-outline-variant/10 group text-left cursor-pointer disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-primary/30`}
                        >

                          {/* =================================================
                              IMAGE
                          ================================================== */}

                          {hasError ||
                          !imageUrl ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-low text-on-surface-variant">

                              <span className="material-symbols-outlined text-5xl opacity-30">
                                broken_image
                              </span>

                              <span className="text-xs mt-2 opacity-60">
                                Foto tidak tersedia
                              </span>

                            </div>
                          ) : (
                            <img
                              src={
                                imageUrl
                              }
                              alt={`Galeri Desa ${item.id}`}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading={
                                index <
                                4
                                  ? 'eager'
                                  : 'lazy'
                              }
                              onError={() =>
                                handleImageError(
                                  item.id
                                )
                              }
                            />
                          )}

                          {/* =================================================
                              OVERLAY
                          ================================================== */}

                          {!hasError &&
                            imageUrl && (
                              <>
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">

                                  <p className="text-xs text-white/80">
                                    Klik untuk melihat
                                  </p>

                                  <p className="text-sm text-white font-semibold mt-1">
                                    Dokumentasi Desa
                                  </p>

                                </div>
                              </>
                            )}

                        </motion.button>
                      );
                    }
                  )}

                </motion.div>

              </AnimatePresence>
            )}

        </div>

      </main>

      {/* =========================================================
          MODAL
      ========================================================== */}

      <AnimatePresence>

        {selectedImage && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() =>
              setSelectedImage(
                null
              )
            }
          >

            <motion.div
              variants={
                modalVariants
              }
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-5xl max-h-screen bg-surface rounded-3xl overflow-hidden shadow-2xl"
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
            >

              {/* =================================================
                  IMAGE
              ================================================== */}

              <div className="relative flex items-center justify-center bg-black min-h-80">

                <img
                  src={
                    selectedImage.imageUrl
                  }
                  alt={`Galeri Desa ${selectedImage.id}`}
                  className="w-full max-h-[70vh] object-contain"
                />

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage(
                      null
                    )
                  }
                  aria-label="Tutup gambar"
                  title="Tutup"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                >

                  <span className="material-symbols-outlined">
                    close
                  </span>

                </button>

              </div>

              {/* =================================================
                  INFO
              ================================================== */}

              <div className="px-5 py-4">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                  <div>

                    <p className="font-semibold text-on-surface">
                      Dokumentasi Desa Sumberporong
                    </p>

                    <p className="text-xs text-on-surface-variant mt-1">
                      Foto #
                      {
                        selectedImage.id
                      }
                    </p>

                  </div>

                  {selectedImage.created_at && (
                    <p className="text-xs text-on-surface-variant">

                      {new Date(
                        selectedImage.created_at
                      ).toLocaleDateString(
                        'id-ID',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }
                      )}

                    </p>
                  )}

                </div>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

      <Footer />

    </div>
  );
};

export default GaleriPage;
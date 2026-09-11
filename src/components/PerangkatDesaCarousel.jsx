// src/components/PerangkatDesaCarousel.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import api from '../api/axios';

/*
|--------------------------------------------------------------------------
| CONFIG
|--------------------------------------------------------------------------
*/

const AUTO_SLIDE_INTERVAL = 4000;

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000/api';

/*
|--------------------------------------------------------------------------
| HELPER FOTO
|--------------------------------------------------------------------------
|
| Backend public:
|
| GET /api/files/public/perangkat-desa/{id}
|
*/

const getFotoUrl = (item) => {
  if (!item?.id) {
    return '';
  }

  /*
  |--------------------------------------------------------------------------
  | URL lengkap
  |--------------------------------------------------------------------------
  */

  if (
    typeof item.foto === 'string' &&
    /^https?:\/\//i.test(item.foto)
  ) {
    return item.foto;
  }

  /*
  |--------------------------------------------------------------------------
  | Backend mengirim /api/...
  |--------------------------------------------------------------------------
  */

  if (
    typeof item.foto === 'string' &&
    item.foto.startsWith('/api/')
  ) {
    const baseUrl =
      API_BASE_URL.replace(
        /\/api$/,
        ''
      );

    return `${baseUrl}${item.foto}`;
  }

  /*
  |--------------------------------------------------------------------------
  | Backend mengirim path absolut
  |--------------------------------------------------------------------------
  */

  if (
    typeof item.foto === 'string' &&
    item.foto.startsWith('/')
  ) {
    return `${API_BASE_URL}${item.foto}`;
  }

  /*
  |--------------------------------------------------------------------------
  | DEFAULT
  |--------------------------------------------------------------------------
  */

  return `${API_BASE_URL}/files/public/perangkat-desa/${item.id}`;
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const PerangkatDesaCarousel = () => {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    perangkatDesa,
    setPerangkatDesa,
  ] = useState([]);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    direction,
    setDirection,
  ] = useState(1);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    imageErrors,
    setImageErrors,
  ] = useState({});

  /*
  |--------------------------------------------------------------------------
  | FETCH PUBLIC
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    const fetchPerangkat = async () => {
      setLoading(true);
      setError('');

      try {
        const response =
          await api.get(
            '/perangkat-desa'
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

        /*
        |--------------------------------------------------------------------------
        | Hanya data aktif
        |--------------------------------------------------------------------------
        */

        const activeItems =
          items.filter(
            (item) =>
              item.is_active === true ||
              item.is_active === 1 ||
              item.is_active === '1'
          );

        /*
        |--------------------------------------------------------------------------
        | Urutkan berdasarkan urutan
        |--------------------------------------------------------------------------
        */

        activeItems.sort(
          (a, b) =>
            Number(
              a.urutan ?? 0
            ) -
            Number(
              b.urutan ?? 0
            )
        );

        setPerangkatDesa(
          activeItems
        );

        setCurrentIndex(0);
        setImageErrors({});
      } catch (err) {
        if (
          cancelled
        ) {
          return;
        }

        console.error(
          'Gagal mengambil perangkat desa:',
          err
        );

        setPerangkatDesa([]);

        setError(
          err.response?.data?.message ||
            'Gagal mengambil data perangkat desa.'
        );
      } finally {
        if (
          !cancelled
        ) {
          setLoading(false);
        }
      }
    };

    fetchPerangkat();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | TOTAL
  |--------------------------------------------------------------------------
  */

  const total =
    perangkatDesa.length;

  /*
  |--------------------------------------------------------------------------
  | AUTO SLIDE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      loading ||
      total <= 1
    ) {
      return undefined;
    }

    const interval =
      window.setInterval(() => {
        setDirection(1);

        setCurrentIndex(
          (previous) =>
            (
              previous + 1
            ) % total
        );
      }, AUTO_SLIDE_INTERVAL);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    loading,
    total,
  ]);

  /*
  |--------------------------------------------------------------------------
  | NEXT
  |--------------------------------------------------------------------------
  */

  const nextSlide = () => {
    if (
      total <= 1
    ) {
      return;
    }

    setDirection(1);

    setCurrentIndex(
      (previous) =>
        (
          previous + 1
        ) % total
    );
  };

  /*
  |--------------------------------------------------------------------------
  | PREVIOUS
  |--------------------------------------------------------------------------
  */

  const prevSlide = () => {
    if (
      total <= 1
    ) {
      return;
    }

    setDirection(-1);

    setCurrentIndex(
      (previous) =>
        (
          previous -
          1 +
          total
        ) % total
    );
  };

  /*
  |--------------------------------------------------------------------------
  | GO TO SLIDE
  |--------------------------------------------------------------------------
  */

  const goToSlide = (
    index
  ) => {
    if (
      index ===
      currentIndex
    ) {
      return;
    }

    setDirection(
      index >
        currentIndex
        ? 1
        : -1
    );

    setCurrentIndex(
      index
    );
  };

  /*
  |--------------------------------------------------------------------------
  | VISIBLE ITEMS
  |--------------------------------------------------------------------------
  */

  const visibleItems =
    useMemo(() => {
      if (
        total === 0
      ) {
        return [];
      }

      /*
      |--------------------------------------------------------------------------
      | 1 DATA
      |--------------------------------------------------------------------------
      */

      if (
        total === 1
      ) {
        return [
          {
            ...perangkatDesa[0],
            position: 0,
          },
        ];
      }

      /*
      |--------------------------------------------------------------------------
      | 2 DATA
      |--------------------------------------------------------------------------
      */

      if (
        total === 2
      ) {
        const previousIndex =
          (
            currentIndex -
            1 +
            total
          ) % total;

        const nextIndex =
          (
            currentIndex +
            1
          ) % total;

        return [
          {
            ...perangkatDesa[
              previousIndex
            ],
            position: -1,
          },

          {
            ...perangkatDesa[
              currentIndex
            ],
            position: 0,
          },

          {
            ...perangkatDesa[
              nextIndex
            ],
            position: 1,
          },
        ];
      }

      /*
      |--------------------------------------------------------------------------
      | 3+ DATA
      |--------------------------------------------------------------------------
      */

      return [
        -1,
        0,
        1,
      ].map(
        (position) => {
          const index =
            (
              currentIndex +
              position +
              total
            ) % total;

          return {
            ...perangkatDesa[
              index
            ],
            position,
          };
        }
      );
    }, [
      perangkatDesa,
      currentIndex,
      total,
    ]);

  /*
  |--------------------------------------------------------------------------
  | ANIMATION
  |--------------------------------------------------------------------------
  */

  const slideVariants = {
    enter: (
      slideDirection
    ) => ({
      x:
        slideDirection >
        0
          ? 100
          : -100,

      opacity: 0,
    }),

    center: {
      x: 0,
      opacity: 1,

      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },

    exit: (
      slideDirection
    ) => ({
      x:
        slideDirection >
        0
          ? -100
          : 100,

      opacity: 0,

      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    }),
  };

  /*
  |--------------------------------------------------------------------------
  | IMAGE ERROR
  |--------------------------------------------------------------------------
  */

  const handleImageError = (
    id
  ) => {
    setImageErrors(
      (previous) => ({
        ...previous,
        [id]: true,
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section className="py-xl bg-surface">

      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">

        {/* =========================================================
            HEADER
        ========================================================== */}

        <div className="text-center mb-xl">

          <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
            Perangkat Desa Sumberporong
          </h2>

          <div className="w-16 h-1 bg-primary rounded-full mx-auto" />

          <p className="font-body-md text-body-md text-on-surface-variant mt-md max-w-2xl mx-auto">
            Berikut adalah jajaran perangkat desa yang siap melayani masyarakat dengan sepenuh hati.
          </p>

        </div>

        {/* =========================================================
            LOADING
        ========================================================== */}

        {loading && (
          <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-6">

            {[1, 2, 3].map(
              (item) => (
                <div
                  key={
                    item
                  }
                  className="w-full md:w-80 shrink-0 bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm"
                >

                  <div className="w-full h-96 bg-surface-container-high animate-pulse" />

                  <div className="p-5">

                    <div className="h-5 w-3/4 mx-auto rounded bg-surface-container-high animate-pulse" />

                    <div className="h-4 w-1/2 mx-auto rounded bg-surface-container-high animate-pulse mt-3" />

                  </div>

                </div>
              )
            )}

          </div>
        )}

        {/* =========================================================
            ERROR
        ========================================================== */}

        {!loading &&
          error && (
            <div className="max-w-2xl mx-auto rounded-2xl border border-red-200 bg-red-50 px-5 py-5 text-center">

              <span className="material-symbols-outlined text-red-500 text-4xl">
                error
              </span>

              <p className="text-sm text-red-700 mt-2">
                {error}
              </p>

            </div>
          )}

        {/* =========================================================
            EMPTY
        ========================================================== */}

        {!loading &&
          !error &&
          total === 0 && (
            <div className="max-w-2xl mx-auto rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-6 py-10 text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                <span className="material-symbols-outlined text-3xl">
                  groups
                </span>

              </div>

              <h3 className="font-headline-md text-lg text-on-surface mt-4">
                Perangkat desa belum tersedia
              </h3>

              <p className="text-sm text-on-surface-variant mt-2">
                Data perangkat desa sedang diperbarui oleh pemerintah desa.
              </p>

            </div>
          )}

        {/* =========================================================
            CAROUSEL
        ========================================================== */}

        {!loading &&
          !error &&
          total > 0 && (
            <div className="relative w-full">

              {/* =====================================================
                  VIEWPORT
              ====================================================== */}

              <div className="w-full overflow-hidden">

                <AnimatePresence
                  initial={
                    false
                  }
                  custom={
                    direction
                  }
                  mode="wait"
                >

                  <motion.div
                    key={
                      currentIndex
                    }
                    custom={
                      direction
                    }
                    variants={
                      slideVariants
                    }
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full"
                  >

                    {/* =================================================
                        CARDS
                    ================================================== */}

                    <div
                      className={`
                        w-full
                        flex
                        justify-center
                        items-stretch
                        gap-6
                        px-4
                        md:px-12
                      `}
                    >

                      {visibleItems.map(
                        (
                          item
                        ) => {
                          const isCenter =
                            item.position ===
                            0;

                          const fotoUrl =
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
                          |--------------------------------------------------------------------------
                          | CARD
                          |--------------------------------------------------------------------------
                          */

                          return (
                            <motion.article
                              key={`${item.id}-${item.position}`}
                              animate={{
                                scale:
                                  isCenter
                                    ? 1
                                    : 0.92,

                                opacity:
                                  isCenter
                                    ? 1
                                    : 0.55,
                              }}
                              transition={{
                                duration: 0.3,
                              }}
                              className={`
                                shrink-0
                                w-72
                                md:w-80
                                bg-surface-container-lowest
                                rounded-2xl
                                overflow-hidden
                                border
                                shadow-sm
                                flex
                                flex-col
                                ${
                                  isCenter
                                    ? 'border-primary/30 ring-2 ring-primary/10 shadow-lg'
                                    : 'border-outline-variant/20'
                                }
                              `}
                            >

                              {/* =================================================
                                  FOTO
                              ================================================== */}

                              <div className="relative w-full h-96 overflow-hidden bg-surface-container-low">

                                {!hasError &&
                                fotoUrl ? (
                                  <img
                                    src={
                                      fotoUrl
                                    }
                                    alt={
                                      item.nama ||
                                      'Perangkat Desa'
                                    }
                                    className="absolute inset-0 w-full h-full object-cover"
                                    loading={
                                      isCenter
                                        ? 'eager'
                                        : 'lazy'
                                    }
                                    onError={() =>
                                      handleImageError(
                                        item.id
                                      )
                                    }
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">

                                    <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center">

                                      <span className="material-symbols-outlined text-5xl">
                                        person
                                      </span>

                                    </div>

                                    <p className="text-xs text-on-surface-variant mt-3">
                                      Foto tidak tersedia
                                    </p>

                                  </div>
                                )}

                              </div>

                              {/* =================================================
                                  CONTENT
                              ================================================== */}

                              <div className="w-full p-5 text-center">

                                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-base md:text-lg line-clamp-2">

                                  {
                                    item.nama ||
                                    '-'
                                  }

                                </h3>

                                <p className="font-label-md text-label-md text-primary font-medium mt-2">

                                  {
                                    item.jabatan ||
                                    '-'
                                  }

                                </p>

                              </div>

                            </motion.article>
                          );
                        }
                      )}

                    </div>

                  </motion.div>

                </AnimatePresence>

              </div>

              {/* =====================================================
                  PREVIOUS BUTTON
              ====================================================== */}

              {total > 1 && (
                <button
                  type="button"
                  onClick={
                    prevSlide
                  }
                  aria-label="Perangkat desa sebelumnya"
                  title="Sebelumnya"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-primary shadow-md flex items-center justify-center transition-all duration-200 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >

                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>

                </button>
              )}

              {/* =====================================================
                  NEXT BUTTON
              ====================================================== */}

              {total > 1 && (
                <button
                  type="button"
                  onClick={
                    nextSlide
                  }
                  aria-label="Perangkat desa berikutnya"
                  title="Berikutnya"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-primary shadow-md flex items-center justify-center transition-all duration-200 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >

                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>

                </button>
              )}

            </div>
          )}

        {/* =========================================================
            DOTS
        ========================================================== */}

        {!loading &&
          !error &&
          total > 1 && (
            <div className="flex items-center justify-center gap-2 mt-7">

              {perangkatDesa.map(
                (
                  item,
                  index
                ) => (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    onClick={() =>
                      goToSlide(
                        index
                      )
                    }
                    aria-label={`Tampilkan ${item.nama}`}
                    title={
                      item.nama
                    }
                    className={`
                      h-2.5
                      rounded-full
                      transition-all
                      duration-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-primary/20
                      ${
                        index ===
                        currentIndex
                          ? 'w-8 bg-primary'
                          : 'w-2.5 bg-outline-variant/50 hover:bg-primary/40'
                      }
                    `}
                  />
                )
              )}

            </div>
          )}

        {/* =========================================================
            COUNTER
        ========================================================== */}

        {!loading &&
          !error &&
          total > 1 && (
            <div className="mt-4 text-center">

              <span className="text-xs font-medium text-on-surface-variant">

                {currentIndex + 1}{' '}
                /{' '}
                {total}

              </span>

            </div>
          )}

      </div>

    </section>
  );
};

export default PerangkatDesaCarousel;
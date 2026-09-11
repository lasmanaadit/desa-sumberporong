// src/components/Galeri.jsx

import React, {
  useEffect,
  useState,
} from 'react';

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
  | Kalau backend mengirim URL lengkap
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
  | Kalau backend mengirim /api/...
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
  | Kalau backend mengirim path relatif
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
  | FALLBACK
  |--------------------------------------------------------------------------
  |
  | Backend:
  | GET /api/files/public/galeri/{galeri}
  |
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

const Galeri = () => {
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
    imageErrors,
    setImageErrors,
  ] = useState({});

  /*
  |--------------------------------------------------------------------------
  | FETCH GALERI
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

          /*
          |--------------------------------------------------------------------------
          | Urutkan terbaru
          |--------------------------------------------------------------------------
          */

          items.sort(
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

          /*
          |--------------------------------------------------------------------------
          | Homepage hanya ambil 4 foto terbaru
          |--------------------------------------------------------------------------
          */

          setGaleriList(
            items.slice(
              0,
              4
            )
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
              'Gagal mengambil galeri desa.'
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
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section className="py-xl bg-surface-container-low">

      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">

        {/* =========================================================
            HEADER
        ========================================================== */}

        <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
          Galeri Desa
        </h2>

        <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-xl" />

        {/* =========================================================
            LOADING
        ========================================================== */}

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md">

            {[
              1,
              2,
              3,
              4,
            ].map(
              (
                item
              ) => (
                <div
                  key={
                    item
                  }
                  className="aspect-square rounded-xl overflow-hidden bg-surface-container-high animate-pulse"
                />
              )
            )}

          </div>
        )}

        {/* =========================================================
            ERROR
        ========================================================== */}

        {!loading &&
          error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6">

              <div className="flex flex-col items-center">

                <span className="material-symbols-outlined text-red-500 text-4xl">
                  error
                </span>

                <p className="text-sm text-red-700 mt-2">
                  {error}
                </p>

              </div>

            </div>
          )}

        {/* =========================================================
            EMPTY
        ========================================================== */}

        {!loading &&
          !error &&
          galeriList.length ===
            0 && (
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-6 py-10">

              <div className="flex flex-col items-center">

                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                  <span className="material-symbols-outlined text-3xl">
                    photo_library
                  </span>

                </div>

                <p className="text-sm text-on-surface-variant mt-3">
                  Belum ada foto galeri desa.
                </p>

              </div>

            </div>
          )}

        {/* =========================================================
            GALERI
        ========================================================== */}

        {!loading &&
          !error &&
          galeriList.length >
            0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md">

              {galeriList.map(
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

                  return (
                    <div
                      key={
                        item.id
                      }
                      className="group aspect-square rounded-xl overflow-hidden bg-surface border border-outline-variant/10 shadow-sm"
                    >

                      {hasError ||
                      !imageUrl ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-low text-on-surface-variant">

                          <span className="material-symbols-outlined text-4xl opacity-30">
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
                          alt={`Galeri Desa ${
                            index +
                            1
                          }`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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

                    </div>
                  );
                }
              )}

            </div>
          )}

        {/* =========================================================
            BUTTON
        ========================================================== */}

        <div className="mt-lg">

          <a
            href="/galeri"
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-lg transition-colors inline-flex items-center gap-2"
          >

            Lihat Semua Galeri

            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>

          </a>

        </div>

      </div>

    </section>
  );
};

export default Galeri;
// src/components/AdministrasiPenduduk.jsx

import React, {
  useEffect,
  useState,
} from 'react';

import api from '../api/axios';

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const AdministrasiPenduduk = () => {
  const [
    statistik,
    setStatistik,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | FETCH STATISTIK
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    const fetchStatistik =
      async () => {
        setLoading(true);

        try {
          const response =
            await api.get(
              '/statistik',
              {
                params: {
                  tahun:
                    new Date().getFullYear(),
                },
              }
            );

          if (
            cancelled
          ) {
            return;
          }

          setStatistik(
            response.data?.data ||
              null
          );
        } catch (
          error
        ) {
          if (
            cancelled
          ) {
            return;
          }

          console.error(
            'Gagal mengambil statistik penduduk:',
            error
          );

          setStatistik(
            null
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

    fetchStatistik();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FORMAT NUMBER
  |--------------------------------------------------------------------------
  */

  const formatNumber = (
    value
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '-';
    }

    const number =
      Number(value);

    if (
      Number.isNaN(number)
    ) {
      return '-';
    }

    return number.toLocaleString(
      'id-ID'
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
          Administrasi Penduduk
        </h2>

        <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-xl" />

        {/* =========================================================
            LOADING
        ========================================================== */}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">

            {[1, 2].map(
              (
                item
              ) => (
                <div
                  key={
                    item
                  }
                  className="bg-surface-container-lowest border border-outline-variant/30 p-xl rounded-xl flex flex-col items-center justify-center gap-md shadow-sm"
                >

                  <div className="w-16 h-16 rounded-full bg-surface-container-high animate-pulse" />

                  <div className="flex flex-col items-center gap-2">

                    <div className="h-10 w-32 rounded-lg bg-surface-container-high animate-pulse" />

                    <div className="h-5 w-40 rounded-lg bg-surface-container-high animate-pulse" />

                  </div>

                </div>
              )
            )}

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">

            {/* =====================================================
                TOTAL PENDUDUK
            ====================================================== */}

            <div className="bg-surface-container-lowest border border-outline-variant/30 p-xl rounded-xl flex flex-col items-center justify-center gap-md shadow-sm">

              <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">

                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize:
                      '32px',
                  }}
                >
                  group
                </span>

              </div>

              <div className="text-center">

                <div className="font-display-lg text-display-lg text-primary mb-xs">

                  {formatNumber(
                    statistik?.total_penduduk
                  )}

                </div>

                <div className="font-headline-md text-headline-md text-on-surface-variant">
                  Total Penduduk
                </div>

              </div>

            </div>

            {/* =====================================================
                TOTAL KK
            ====================================================== */}

            <div className="bg-surface-container-lowest border border-outline-variant/30 p-xl rounded-xl flex flex-col items-center justify-center gap-md shadow-sm">

              <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">

                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize:
                      '32px',
                  }}
                >
                  home_work
                </span>

              </div>

              <div className="text-center">

                <div className="font-display-lg text-display-lg text-primary mb-xs">

                  {formatNumber(
                    statistik?.total_kk
                  )}

                </div>

                <div className="font-headline-md text-headline-md text-on-surface-variant">
                  Kepala Keluarga (KK)
                </div>

              </div>

            </div>

          </div>
        )}

        {/* =========================================================
            TAHUN
        ========================================================== */}

        {!loading &&
          statistik && (
            <p className="text-xs text-on-surface-variant mt-5">
              Data statistik tahun{' '}
              <span className="font-semibold text-on-surface">
                {
                  statistik.tahun
                }
              </span>
            </p>
          )}

      </div>

    </section>
  );
};

export default AdministrasiPenduduk;
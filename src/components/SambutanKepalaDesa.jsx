import React, { useEffect, useState } from 'react';
import api, {BACKEND_URL} from '../api/axios';


const SambutanKepalaDesa = () => {
  const [sambutan, setSambutan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fotoError, setFotoError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSambutan = async () => {
      try {
        setLoading(true);

        const response = await api.get('/sambutan');

        if (isMounted) {
          setSambutan(response.data?.sambutan ?? null);
        }
      } catch (error) {
        console.error('Gagal mengambil data sambutan:', error);

        if (isMounted) {
          setSambutan(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSambutan();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
   |--------------------------------------------------------------------------
   | Loading
   |--------------------------------------------------------------------------
   */

  if (loading) {
    return (
      <section className="py-xl bg-surface">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-xl rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-xl shadow-sm md:grid-cols-12">
            <div className="flex flex-col items-center md:col-span-4">
              <div className="h-64 w-64 animate-pulse rounded-full bg-surface-container-high md:h-80 md:w-80" />
            </div>

            <div className="flex flex-col justify-center md:col-span-8">
              <div className="mb-md h-8 w-72 animate-pulse rounded-lg bg-surface-container-high" />

              <div className="mb-lg h-1 w-16 animate-pulse rounded-full bg-surface-container-high" />

              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-surface-container-high" />
                <div className="h-4 w-full animate-pulse rounded bg-surface-container-high" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-surface-container-high" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-surface-container-high" />
              </div>

              <div className="mt-xl">
                <div className="mb-2 h-6 w-64 animate-pulse rounded bg-surface-container-high" />
                <div className="h-4 w-48 animate-pulse rounded bg-surface-container-high" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /*
   |--------------------------------------------------------------------------
   | Tidak Ada Data
   |--------------------------------------------------------------------------
   */

  if (!sambutan) {
    return null;
  }

  /*
   |--------------------------------------------------------------------------
   | URL Foto
   |--------------------------------------------------------------------------
   |
   | Foto berasal dari private/local storage backend.
   | Akses dilakukan melalui endpoint public.
   |
   */

  const fotoUrl = sambutan.id
    ? `${BACKEND_URL}/api/files/public/sambutan/${sambutan.id}`
    : null;

  return (
    <section className="py-xl bg-surface">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 gap-xl rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-xl shadow-sm md:grid-cols-12">
          {/* Foto Kepala Desa */}
          <div className="flex flex-col items-center md:col-span-4">
            <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-surface shadow-md md:h-80 md:w-80">
              {fotoUrl && !fotoError ? (
                <img
                  src={fotoUrl}
                  alt={sambutan.nama || 'Kepala Desa Sumberporong'}
                  className="h-full w-full object-cover"
                  onError={() => setFotoError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-container-high text-center text-on-surface-variant">
                  <div className="px-6">
                    <span
                      className="material-symbols-outlined mb-2"
                      style={{ fontSize: '48px' }}
                    >
                      person
                    </span>

                    <p className="font-label-md">
                      Foto tidak tersedia
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Isi Sambutan */}
          <div className="flex flex-col justify-center md:col-span-8">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
              Sambutan Kepala Desa
            </h2>

            <div className="mb-lg h-1 w-16 rounded-full bg-primary"></div>

            <p className="font-body-md text-body-md mb-lg leading-relaxed italic text-on-surface-variant">
              "{sambutan.text}"
            </p>

            <div className="mb-xl">
              <div className="font-headline-md text-headline-md text-on-surface">
                {sambutan.nama}
              </div>

              <div className="font-label-md text-label-md mt-xs text-primary">
                {sambutan.jabatan}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SambutanKepalaDesa;
// src/components/ProdukUMKM.jsx

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import api from '../api/axios';

const ProdukUMKM = () => {
  const [
    unggulan,
    setUnggulan,
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
          await api.get(
            '/umkm'
          );

        if (!mounted) {
          return;
        }

        const responseData =
          response.data?.data;

        let data = [];

        /*
        |--------------------------------------------------------------------------
        | Laravel Resource Collection + Pagination
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
            responseData?.data ||
            [];
        }

        /*
        |--------------------------------------------------------------------------
        | Ambil 4 UMKM
        |--------------------------------------------------------------------------
        */

        setUnggulan(
          data.slice(
            0,
            4
          )
        );
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

    const sortedPhotos =
      [
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
      sortedPhotos[0]?.url ||
      null
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <section className="py-xl bg-surface">

      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">

        {/* ==========================================================
            HEADER
        =========================================================== */}

        <div className="text-center mb-xl">

          <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
            Produk UMKM Unggulan
          </h2>

          <div className="w-16 h-1 bg-primary rounded-full mx-auto" />

          <p className="font-body-md text-body-md text-on-surface-variant mt-md max-w-2xl mx-auto">
            Produk-produk berkualitas dari
            warga Desa Sumberporong yang siap
            mendukung perekonomian lokal dan
            kebanggaan desa.
          </p>

        </div>

        {/* ==========================================================
            ERROR
        =========================================================== */}

        {error && (
          <div className="mb-lg max-w-2xl mx-auto rounded-xl border border-red-200 bg-red-50 px-4 py-3">

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

        {/* ==========================================================
            LOADING
        =========================================================== */}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">

            {Array.from({
              length: 4,
            }).map(
              (
                _,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/20"
                >

                  <div className="h-48 bg-surface-container-low animate-pulse" />

                  <div className="p-md space-y-3">

                    <div className="h-4 w-20 rounded bg-surface-container-low animate-pulse" />

                    <div className="h-6 w-36 rounded bg-surface-container-low animate-pulse" />

                    <div className="h-10 w-full rounded bg-surface-container-low animate-pulse" />

                    <div className="h-6 w-32 rounded bg-surface-container-low animate-pulse" />

                  </div>

                </div>
              )
            )}

          </div>
        ) : unggulan.length ===
          0 ? (

          /* ========================================================
             EMPTY STATE
          ========================================================= */

          <div className="py-xl text-center">

            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">

              <span className="material-symbols-outlined text-4xl">
                storefront
              </span>

            </div>

            <h3 className="font-headline-md text-xl text-on-surface mt-5">
              Belum ada UMKM aktif
            </h3>

            <Link
              to="/umkm"
              className="inline-flex items-center gap-2 mt-6 bg-primary hover:bg-primary-container text-on-primary font-label-md py-sm px-md rounded-lg transition-colors"
            >
              Lihat Daftar UMKM

              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>

          </div>

        ) : (

          /* ========================================================
             PRODUCT GRID
          ========================================================= */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">

            {unggulan.map(
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
                    className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 transition-all hover:shadow-md hover:-translate-y-1 duration-300 flex flex-col group"
                  >

                    {/* FOTO */}

                    <div className="relative h-48 overflow-hidden bg-surface-container-high">

                      {primaryPhoto ? (
                        <img
                          alt={
                            umkm.nama_umkm ||
                            'Foto UMKM'
                          }
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src={
                            primaryPhoto
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">

                          <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">
                            image
                          </span>

                        </div>
                      )}

                    </div>

                    {/* CONTENT */}

                    <div className="p-md flex flex-col flex-1">

                      {/* KATEGORI */}

                      <span className="text-label-sm text-primary mb-xs">
                        {
                          umkm.kategori
                            ?.nama ||
                          'Tanpa kategori'
                        }
                      </span>

                      {/* NAMA */}

                      <h3 className="font-headline-md text-headline-md text-on-surface mb-sm text-lg line-clamp-1">
                        {
                          umkm.nama_umkm
                        }
                      </h3>

                      {/* DESKRIPSI */}

                      <p className="font-body-md text-body-md text-on-surface-variant text-sm flex-1 line-clamp-2">
                        {
                          umkm.deskripsi_umkm ||
                          '-'
                        }
                      </p>

                      {/* HARGA */}

                      <div className="mt-sm">

                        <span className="font-headline-md text-headline-md text-primary text-sm sm:text-base">

                          {
                            formatRupiah(
                              umkm.harga_min
                            )
                          }

                          {' - '}

                          {
                            formatRupiah(
                              umkm.harga_max
                            )
                          }

                        </span>

                      </div>

                      {/* ACTION */}

                      <div className="mt-sm">

                        <span className="bg-primary group-hover:bg-primary-container text-on-primary font-label-sm py-xs px-sm rounded-lg transition-colors inline-flex items-center gap-xs">

                          <span className="material-symbols-outlined text-[16px]">
                            store
                          </span>

                          Lihat UMKM

                        </span>

                      </div>

                    </div>

                  </Link>
                );
              }
            )}

          </div>

        )}

        {/* ==========================================================
            SEE ALL
        =========================================================== */}

        <div className="text-center mt-lg">

          <Link
            to="/umkm"
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md py-sm px-md rounded-lg transition-colors inline-flex items-center gap-sm"
          >
            Lihat Semua UMKM

            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>

          </Link>

        </div>

      </div>

    </section>
  );
};

export default ProdukUMKM;
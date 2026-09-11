// src/pages/UmkmDetailPage.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useParams,
} from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

import {
  FaStore,
  FaWhatsapp,
} from 'react-icons/fa';

const UmkmDetailPage = () => {
  const { id } = useParams();

  const [umkm, setUmkm] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [currentSlide, setCurrentSlide] =
    useState(0);

  /*
  |--------------------------------------------------------------------------
  | Fetch Detail UMKM
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
            `/umkm/${id}`
          );

        if (!mounted) {
          return;
        }

        const data =
          response.data?.data;

        if (!data) {
          throw new Error(
            'UMKM tidak ditemukan.'
          );
        }

        setUmkm(data);
        setCurrentSlide(0);
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err.response?.status === 404
            ? 'UMKM tidak ditemukan atau sudah tidak aktif.'
            : err.response?.data?.message ||
              'Gagal mengambil detail UMKM.'
        );

        setUmkm(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchUmkm();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

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

  const allPhotos = useMemo(() => {
    if (
      !Array.isArray(
        umkm?.foto
      )
    ) {
      return [];
    }

    return [
      ...umkm.foto,
    ].sort(
      (
        first,
        second
      ) =>
        (first.urutan || 0) -
        (second.urutan || 0)
    );
  }, [umkm]);

  const nextSlide = () => {
    if (
      allPhotos.length <= 1
    ) {
      return;
    }

    setCurrentSlide(
      (previous) =>
        (
          previous + 1
        ) %
        allPhotos.length
    );
  };

  const prevSlide = () => {
    if (
      allPhotos.length <= 1
    ) {
      return;
    }

    setCurrentSlide(
      (previous) =>
        (
          previous -
          1 +
          allPhotos.length
        ) %
        allPhotos.length
    );
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

          <div className="max-w-4xl mx-auto">

            <div className="h-5 w-32 bg-surface-container-low rounded animate-pulse" />

            <div className="mt-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">

              <div className="h-80 md:h-96 bg-surface-container-low animate-pulse" />

              <div className="p-6 md:p-8 space-y-4">

                <div className="h-6 w-28 bg-surface-container-low rounded-full animate-pulse" />

                <div className="h-10 w-72 max-w-full bg-surface-container-low rounded animate-pulse" />

                <div className="h-20 w-full bg-surface-container-low rounded animate-pulse" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">

                  <div className="h-16 bg-surface-container-low rounded-xl animate-pulse" />
                  <div className="h-16 bg-surface-container-low rounded-xl animate-pulse" />
                  <div className="h-16 bg-surface-container-low rounded-xl animate-pulse" />
                  <div className="h-16 bg-surface-container-low rounded-xl animate-pulse" />

                </div>

              </div>

            </div>

          </div>

        </main>

        <Footer />

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error / Not Found
  |--------------------------------------------------------------------------
  */

  if (!umkm) {
    return (
      <div className="min-h-screen bg-surface">

        <Navbar />

        <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop">

          <div className="max-w-2xl mx-auto text-center">

            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">

              <span className="material-symbols-outlined text-4xl">
                storefront
              </span>

            </div>

            <h1 className="font-headline-md text-2xl text-on-surface mt-5">
              UMKM Tidak Ditemukan
            </h1>

            <p className="font-body-lg text-on-surface-variant mt-2">
              {error ||
                'Data UMKM yang Anda cari tidak tersedia.'}
            </p>

            <Link
              to="/umkm"
              className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container transition-colors"
            >

              <span className="material-symbols-outlined text-lg">
                arrow_back
              </span>

              Kembali ke Daftar UMKM

            </Link>

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

        <div className="max-w-4xl mx-auto">

          {/* BACK */}

          <Link
            to="/umkm"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
          >

            <span className="material-symbols-outlined">
              arrow_back
            </span>

            Kembali ke UMKM

          </Link>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">

            {/* ====================================================
                CAROUSEL GAMBAR
            ===================================================== */}

            <div className="relative h-80 md:h-96 bg-surface-container-high">

              {allPhotos.length >
              0 ? (
                <>

                  <img
                    src={
                      allPhotos[
                        currentSlide
                      ]?.url
                    }
                    alt={`${umkm.nama_umkm} - Foto ${
                      currentSlide + 1
                    }`}
                    className="w-full h-full object-cover"
                  />

                  {allPhotos.length >
                    1 && (
                    <>

                      {/* PREV */}

                      <button
                        type="button"
                        onClick={
                          prevSlide
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                        aria-label="Foto sebelumnya"
                      >

                        <span className="material-symbols-outlined">
                          chevron_left
                        </span>

                      </button>

                      {/* NEXT */}

                      <button
                        type="button"
                        onClick={
                          nextSlide
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                        aria-label="Foto berikutnya"
                      >

                        <span className="material-symbols-outlined">
                          chevron_right
                        </span>

                      </button>

                      {/* INDICATOR */}

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">

                        {allPhotos.map(
                          (
                            photo,
                            index
                          ) => (
                            <button
                              key={
                                photo.id ??
                                index
                              }
                              type="button"
                              onClick={() =>
                                setCurrentSlide(
                                  index
                                )
                              }
                              className={`h-2 rounded-full transition-all ${
                                index ===
                                currentSlide
                                  ? 'w-5 bg-white'
                                  : 'w-2 bg-white/50'
                              }`}
                              aria-label={`Tampilkan foto ${
                                index + 1
                              }`}
                            />
                          )
                        )}

                      </div>

                    </>
                  )}

                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">

                  <div className="text-center text-on-surface-variant">

                    <span className="material-symbols-outlined text-7xl opacity-20">
                      image
                    </span>

                    <p className="mt-2 text-sm">
                      Foto UMKM tidak tersedia.
                    </p>

                  </div>

                </div>
              )}

            </div>

            {/* ====================================================
                CONTENT
            ===================================================== */}

            <div className="p-6 md:p-8 space-y-6">

              {/* KATEGORI */}

              <div>

                <span className="text-sm font-semibold text-primary bg-primary/10 inline-block px-3 py-1 rounded-full">
                  {
                    umkm.kategori
                      ?.nama ||
                    'Tanpa kategori'
                  }
                </span>

              </div>

              {/* NAMA */}

              <div>

                <h1 className="font-headline-lg text-3xl md:text-4xl text-primary wrap-break-word">
                  {
                    umkm.nama_umkm
                  }
                </h1>

                <p className="font-body-md text-on-surface-variant mt-3 whitespace-pre-line wrap-break-word">
                  {
                    umkm.deskripsi_umkm ||
                    '-'
                  }
                </p>

              </div>

              {/* INFORMASI */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-outline-variant/20">

                {/* HARGA */}

                <div className="rounded-xl bg-surface-container-low p-4">

                  <div className="flex items-start gap-3">

                    <span className="material-symbols-outlined text-primary">
                      payments
                    </span>

                    <div>

                      <span className="font-label-sm text-on-surface-variant">
                        Harga
                      </span>

                      <p className="font-body-md font-bold text-primary mt-1">
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

                    </div>

                  </div>

                </div>

                {/* ALAMAT */}

                <div className="rounded-xl bg-surface-container-low p-4">

                  <div className="flex items-start gap-3">

                    <span className="material-symbols-outlined text-primary">
                      location_on
                    </span>

                    <div className="min-w-0">

                      <span className="font-label-sm text-on-surface-variant">
                        Alamat
                      </span>

                      <p className="font-body-md text-on-surface mt-1 whitespace-pre-line wrap-break-word">
                        {
                          umkm.alamat ||
                          '-'
                        }
                      </p>

                    </div>

                  </div>

                </div>

                {/* JAM OPERASIONAL */}

                <div className="rounded-xl bg-surface-container-low p-4">

                  <div className="flex items-start gap-3">

                    <span className="material-symbols-outlined text-primary">
                      schedule
                    </span>

                    <div>

                      <span className="font-label-sm text-on-surface-variant">
                        Jam Operasional
                      </span>

                      <p className="font-body-md text-on-surface mt-1">
                        {umkm.jam_buka_mulai &&
                        umkm.jam_buka_selesai
                          ? `${umkm.jam_buka_mulai} - ${umkm.jam_buka_selesai}`
                          : 'Tidak tersedia'}
                      </p>

                    </div>

                  </div>

                </div>

                {/* WHATSAPP */}

                <div className="rounded-xl bg-surface-container-low p-4">

                  <div className="flex items-start gap-3">

                    <FaWhatsapp className="text-xl text-green-600 mt-0.5" />

                    <div>

                      <span className="font-label-sm text-on-surface-variant">
                        WhatsApp
                      </span>

                      <p className="font-body-md text-on-surface mt-1 wrap-break-word">
                        {
                          umkm.nomor_wa ||
                          '-'
                        }
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  KONTAK
              =================================================== */}

              <div className="pt-5 border-t border-outline-variant/20">

                <h2 className="font-headline-md text-lg text-on-surface">
                  Hubungi UMKM
                </h2>

                <div className="flex flex-wrap gap-3 mt-4">

                  {umkm.nomor_wa && (
                    <a
                      href={`https://wa.me/${String(
                        umkm.nomor_wa
                      ).replace(
                        /\D/g,
                        ''
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors font-semibold"
                    >

                      <FaWhatsapp className="text-lg" />

                      Hubungi via WhatsApp

                    </a>
                  )}

                  {umkm.link_ecommerce && (
                    <a
                      href={
                        umkm.link_ecommerce
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold"
                    >

                      <FaStore className="text-lg" />

                      E-Commerce

                      <span className="material-symbols-outlined text-base">
                        open_in_new
                      </span>

                    </a>
                  )}

                </div>

                {!umkm.nomor_wa &&
                  !umkm.link_ecommerce && (
                    <p className="text-sm text-on-surface-variant mt-3">
                      Informasi kontak belum tersedia.
                    </p>
                  )}

              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
};

export default UmkmDetailPage;
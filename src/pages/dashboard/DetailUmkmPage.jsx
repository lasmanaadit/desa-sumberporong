// src/pages/dashboard/DetailUmkmPage.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';


import api from '../../api/axios';
import { FaWhatsapp } from 'react-icons/fa';

const STATUS_LABELS = {
  menunggu_verifikasi:
    'Menunggu Verifikasi',

  diproses:
    'Diproses',

  disetujui:
    'Disetujui',

  ditolak:
    'Ditolak',
};

const STATUS_STYLES = {
  menunggu_verifikasi: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    icon: 'schedule',
  },

  diproses: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: 'pending',
  },

  disetujui: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: 'check_circle',
  },

  ditolak: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: 'cancel',
  },
};

const DetailUmkmPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [
    umkm,
    setUmkm,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    selectedPhoto,
    setSelectedPhoto,
  ] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Blob Photo URLs
  |--------------------------------------------------------------------------
  |
  | {
  |   [photoId]: blob:http://...
  | }
  |
  */

  const [
    photoUrls,
    setPhotoUrls,
  ] = useState({});

  const [
    photoLoading,
    setPhotoLoading,
  ] = useState({});

  /*
  |--------------------------------------------------------------------------
  | Fetch Detail
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const fetchDetail = async () => {
      setLoading(true);
      setError('');

      try {
        const response =
          await api.get(
            `/pengajuan/umkm/${id}`
          );

        if (!mounted) {
          return;
        }

        const data =
          response.data?.data ||
          null;

        if (!data) {
          navigate(
            '/dashboard/umkm',
            {
              replace: true,
            }
          );

          return;
        }

        setUmkm(data);
      } catch (err) {
        if (!mounted) {
          return;
        }

        const status =
          err.response?.status;

        const message =
          err.response?.data
            ?.message ||
          'Gagal mengambil detail UMKM.';

        if (
          status === 403 ||
          status === 404
        ) {
          navigate(
            '/dashboard/umkm',
            {
              replace: true,
            }
          );

          return;
        }

        setError(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchDetail();
    }

    return () => {
      mounted = false;
    };
  }, [id, navigate]);

  /*
  |--------------------------------------------------------------------------
  | Photos
  |--------------------------------------------------------------------------
  */

  const photos = useMemo(() => {
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

  /*
  |--------------------------------------------------------------------------
  | Load One Private Photo
  |--------------------------------------------------------------------------
  */

  const loadPhoto = async (
    photo
  ) => {
    if (
      !photo?.id
    ) {
      return null;
    }

    if (
      photoUrls[
        photo.id
      ]
    ) {
      return photoUrls[
        photo.id
      ];
    }

    if (
      photoLoading[
        photo.id
      ]
    ) {
      return null;
    }

    setPhotoLoading(
      (previous) => ({
        ...previous,
        [photo.id]: true,
      })
    );

    try {
      const response =
        await api.get(
          `/files/umkm/${photo.id}`,
          {
            responseType:
              'blob',
          }
        );

      const blobUrl =
        URL.createObjectURL(
          response.data
        );

      setPhotoUrls(
        (previous) => ({
          ...previous,
          [photo.id]:
            blobUrl,
        })
      );

      return blobUrl;
    } catch (err) {
      console.error(
        `Gagal memuat foto UMKM #${photo.id}:`,
        err
      );

      setPhotoUrls(
        (previous) => ({
          ...previous,
          [photo.id]:
            null,
        })
      );

      return null;
    } finally {
      setPhotoLoading(
        (previous) => ({
          ...previous,
          [photo.id]:
            false,
        })
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load Semua Foto
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      photos.length ===
      0
    ) {
      return;
    }

    photos.forEach(
      (
        photo
      ) => {
        loadPhoto(photo);
      }
    );
  }, [photos]);

  /*
  |--------------------------------------------------------------------------
  | Cleanup Blob URL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      Object.values(
        photoUrls
      ).forEach(
        (url) => {
          if (url) {
            URL.revokeObjectURL(
              url
            );
          }
        }
      );
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
      return 'Rp 0';
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

  const formatTanggal = (
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

  const formatJam = (
    value
  ) => {
    if (!value) {
      return null;
    }

    return String(value).slice(
      0,
      5
    );
  };

  const getStatusStyle = (
    status
  ) => {
    return (
      STATUS_STYLES[
        status
      ] || {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        icon: 'help',
      }
    );
  };

  const getStatusLabel = (
    status
  ) => {
    return (
      STATUS_LABELS[
        status
      ] ||
      status ||
      '-'
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Open Photo
  |--------------------------------------------------------------------------
  */

  const handleOpenPhoto = async (
    photo
  ) => {
    if (!photo?.id) {
      return;
    }

    const url =
      await loadPhoto(
        photo
      );

    if (url) {
      setSelectedPhoto({
        id: photo.id,
        url,
      });
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Close Photo Preview
  |--------------------------------------------------------------------------
  */

  const closePhotoPreview = () => {
    setSelectedPhoto(
      null
    );
  };

  /*
  |--------------------------------------------------------------------------
  | WhatsApp
  |--------------------------------------------------------------------------
  */

  const whatsappNumber =
    umkm?.nomor_wa
      ? String(
          umkm.nomor_wa
        ).replace(
          /\D/g,
          ''
        )
      : '';

  const whatsappUrl =
    whatsappNumber
      ? `https://wa.me/${whatsappNumber}`
      : null;

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-background">

        <div className="min-w-0">

          <main className="p-4 sm:p-6 lg:p-8">

            <div className="max-w-5xl mx-auto">

              <div className="h-5 w-40 bg-surface-container-low rounded animate-pulse mb-6" />

              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">

                <div className="h-72 md:h-96 bg-surface-container-low animate-pulse" />

                <div className="p-6 md:p-8 space-y-5">

                  <div className="h-4 w-24 bg-surface-container-low rounded animate-pulse" />

                  <div className="h-8 w-64 bg-surface-container-low rounded animate-pulse" />

                  <div className="h-6 w-48 bg-surface-container-low rounded animate-pulse" />

                  <div className="h-24 bg-surface-container-low rounded animate-pulse" />

                </div>

              </div>

            </div>

          </main>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error Page
  |--------------------------------------------------------------------------
  */

  if (
    error &&
    !umkm
  ) {
    return (
      <div className="min-h-screen bg-background">

        <div className="min-w-0">

          <main className="p-4 sm:p-6 lg:p-8">

            <div className="max-w-3xl mx-auto">

              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                <div className="flex items-start gap-3">

                  <span className="material-symbols-outlined text-red-600">
                    error
                  </span>

                  <div>

                    <h2 className="font-label-md font-semibold text-red-800">
                      Gagal memuat UMKM
                    </h2>

                    <p className="text-sm text-red-700 mt-1 wrap-break-word">
                      {error}
                    </p>

                  </div>

                </div>

                <Link
                  to="/dashboard/umkm"
                  className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold"
                >
                  <span className="material-symbols-outlined">
                    arrow_back
                  </span>

                  Kembali ke UMKM Saya
                </Link>

              </div>

            </div>

          </main>

        </div>

      </div>
    );
  }

  if (!umkm) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Derived Data
  |--------------------------------------------------------------------------
  */

  const status =
    getStatusStyle(
      umkm.status
    );

  const jamMulai =
    formatJam(
      umkm.jam_buka_mulai
    );

  const jamSelesai =
    formatJam(
      umkm.jam_buka_selesai
    );

  const mainPhoto =
    photos[0] || null;

  const mainPhotoUrl =
    mainPhoto?.id
      ? photoUrls[
          mainPhoto.id
        ]
      : null;

  const mainPhotoLoading =
    mainPhoto?.id
      ? Boolean(
          photoLoading[
            mainPhoto.id
          ]
        )
      : false;

  return (
    <div className="min-h-screen bg-background">

      <div className="min-w-0">

        <main className="p-4 sm:p-6 lg:p-8">

          <div className="max-w-5xl mx-auto min-w-0">

            {/* ==================================================
                BACK
            =================================================== */}

            <Link
              to="/dashboard/umkm"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-container transition-colors mb-6"
            >
              <span className="material-symbols-outlined">
                arrow_back
              </span>

              Kembali ke UMKM Saya
            </Link>

            {/* ==================================================
                ERROR
            =================================================== */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                <div className="flex items-start gap-3">

                  <span className="material-symbols-outlined shrink-0">
                    error
                  </span>

                  <span className="wrap-break-word">
                    {error}
                  </span>

                </div>

              </div>
            )}

            {/* ==================================================
                CARD
            =================================================== */}

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">

              {/* =================================================
                  HERO FOTO
              ================================================== */}

              <div className="relative">

                <div className="h-72 md:h-420px bg-surface-container-low">

                  {mainPhotoUrl ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPhoto({
                          id:
                            mainPhoto.id,
                          url:
                            mainPhotoUrl,
                        })
                      }
                      className="block w-full h-full cursor-zoom-in"
                    >
                      <img
                        src={
                          mainPhotoUrl
                        }
                        alt={
                          umkm.nama_umkm ||
                          'Foto UMKM'
                        }
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ) : mainPhotoLoading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">

                      <span className="material-symbols-outlined animate-spin text-primary text-5xl">
                        progress_activity
                      </span>

                      <p className="text-sm text-on-surface-variant mt-2">
                        Memuat foto...
                      </p>

                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">

                      <span className="material-symbols-outlined text-7xl text-on-surface-variant/20">
                        image
                      </span>

                      <p className="text-sm text-on-surface-variant mt-2">
                        Foto UMKM tidak tersedia.
                      </p>

                    </div>
                  )}

                </div>

                {/* STATUS */}

                <div className="absolute top-4 right-4">

                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.text} text-sm font-semibold shadow-sm`}
                  >

                    <span className="material-symbols-outlined">
                      {
                        status.icon
                      }
                    </span>

                    {
                      getStatusLabel(
                        umkm.status
                      )
                    }

                  </span>

                </div>

                {/* PUBLIC */}

                {umkm.is_active && (
                  <div className="absolute bottom-4 left-4">

                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">

                      <span className="w-2 h-2 rounded-full bg-green-400" />

                      Aktif di Publik

                    </span>

                  </div>
                )}

              </div>

              {/* =================================================
                  THUMBNAILS
              ================================================== */}

              {photos.length >
                1 && (
                <div className="px-6 md:px-8 pt-5">

                  <div className="flex gap-3 overflow-x-auto pb-1">

                    {photos.map(
                      (
                        photo,
                        index
                      ) => {

                        const thumbnailUrl =
                          photo.id
                            ? photoUrls[
                                photo.id
                              ]
                            : null;

                        const isLoading =
                          photo.id
                            ? Boolean(
                                photoLoading[
                                  photo.id
                                ]
                              )
                            : false;

                        return (
                          <button
                            key={
                              photo.id ||
                              index
                            }
                            type="button"
                            onClick={() =>
                              handleOpenPhoto(
                                photo
                              )
                            }
                            disabled={
                              isLoading
                            }
                            className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-outline-variant/30 hover:border-primary transition-colors disabled:cursor-wait disabled:opacity-70"
                          >

                            {thumbnailUrl ? (
                              <img
                                src={
                                  thumbnailUrl
                                }
                                alt={`Foto UMKM ${
                                  photo.urutan ||
                                  index +
                                    1
                                }`}
                                className="w-full h-full object-cover"
                              />
                            ) : isLoading ? (
                              <div className="w-full h-full flex items-center justify-center bg-surface-container-low">

                                <span className="material-symbols-outlined animate-spin text-primary">
                                  progress_activity
                                </span>

                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-surface-container-low">

                                <span className="material-symbols-outlined text-2xl text-on-surface-variant/30">
                                  image
                                </span>

                              </div>
                            )}

                          </button>
                        );
                      }
                    )}

                  </div>

                </div>
              )}

              {/* =================================================
                  CONTENT
              ================================================== */}

              <div className="p-6 md:p-8">

                {/* CATEGORY */}

                <p className="font-label-sm text-primary">
                  {
                    umkm.kategori
                      ?.nama ||
                    'Tanpa kategori'
                  }
                </p>

                {/* TITLE */}

                <h1 className="font-headline-lg text-on-surface mt-2 wrap-break-word">
                  {
                    umkm.nama_umkm ||
                    'Tanpa nama'
                  }
                </h1>

                {/* PRICE */}

                <div className="flex flex-wrap items-baseline gap-2 mt-4">

                  <p className="text-3xl font-bold text-primary">
                    {formatRupiah(
                      umkm.harga_min
                    )}
                  </p>

                  <span className="text-on-surface-variant">
                    -
                  </span>

                  <p className="text-3xl font-bold text-primary">
                    {formatRupiah(
                      umkm.harga_max
                    )}
                  </p>

                </div>

                {/* BASIC INFO */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                  <div className="rounded-xl bg-surface-container-low px-4 py-4">

                    <p className="text-xs text-on-surface-variant">
                      Diajukan
                    </p>

                    <p className="font-label-md font-semibold text-on-surface mt-1">
                      {formatTanggal(
                        umkm.created_at
                      )}
                    </p>

                  </div>

                  <div className="rounded-xl bg-surface-container-low px-4 py-4">

                    <p className="text-xs text-on-surface-variant">
                      Disetujui
                    </p>

                    <p className="font-label-md font-semibold text-on-surface mt-1">
                      {umkm.approved_at
                        ? formatTanggal(
                            umkm.approved_at
                          )
                        : '-'}
                    </p>

                  </div>

                </div>

                {/* CATATAN ADMIN */}

                {umkm.catatan_admin && (
                  <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

                    <div className="flex items-start gap-3">

                      <span className="material-symbols-outlined text-yellow-700 shrink-0">
                        info
                      </span>

                      <div className="min-w-0">

                        <h3 className="font-label-md font-semibold text-yellow-900">
                          Catatan Admin
                        </h3>

                        <p className="text-sm text-yellow-800 mt-1 whitespace-pre-line wrap-break-word">
                          {
                            umkm.catatan_admin
                          }
                        </p>

                      </div>

                    </div>

                  </div>
                )}

                {/* DESKRIPSI */}

                <section className="mt-8">

                  <h2 className="font-headline-md text-on-surface text-lg">
                    Deskripsi UMKM
                  </h2>

                  <p className="font-body-md text-on-surface-variant mt-2 leading-relaxed whitespace-pre-line wrap-break-word">
                    {
                      umkm.deskripsi_umkm ||
                      '-'
                    }
                  </p>

                </section>

                {/* ALAMAT */}

                <section className="mt-8">

                  <h2 className="font-headline-md text-on-surface text-lg">
                    Alamat
                  </h2>

                  <div className="flex items-start gap-3 mt-3 rounded-xl bg-surface-container-low p-4">

                    <span className="material-symbols-outlined text-primary shrink-0">
                      location_on
                    </span>

                    <p className="font-body-md text-on-surface wrap-break-word">
                      {
                        umkm.alamat ||
                        '-'
                      }
                    </p>

                  </div>

                </section>

                {/* JAM */}

                <section className="mt-8">

                  <h2 className="font-headline-md text-on-surface text-lg">
                    Jam Operasional
                  </h2>

                  <div className="flex items-center gap-3 mt-3 rounded-xl bg-surface-container-low p-4">

                    <span className="material-symbols-outlined text-primary">
                      schedule
                    </span>

                    <p className="font-body-md text-on-surface">

                      {jamMulai &&
                      jamSelesai
                        ? `${jamMulai} - ${jamSelesai}`
                        : 'Jam operasional belum diatur.'}

                    </p>

                  </div>

                </section>

                {/* KONTAK */}

                <section className="mt-8">

                  <h2 className="font-headline-md text-on-surface text-lg">
                    Kontak & Link
                  </h2>

                  <div className="flex flex-wrap gap-3 mt-3">

                    {whatsappUrl && (
                      <a
                        href={
                          whatsappUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
                      >

                        <FaWhatsapp className="text-lg" />

                        WhatsApp

                      </a>
                    )}

                    {umkm.link_ecommerce && (
                      <a
                        href={
                          umkm.link_ecommerce
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
                      >

                        <span className="material-symbols-outlined text-base">
                          shopping_bag
                        </span>

                        E-Commerce

                      </a>
                    )}

                    {!whatsappUrl &&
                      !umkm.link_ecommerce && (
                        <p className="text-sm text-on-surface-variant">
                          Informasi kontak belum tersedia.
                        </p>
                      )}

                  </div>

                </section>

                {/* RIWAYAT */}

                <section className="mt-8">

                  <h2 className="font-headline-md text-on-surface text-lg mb-4">
                    Riwayat Pengajuan
                  </h2>

                  {Array.isArray(
                    umkm.riwayat
                  ) &&
                  umkm.riwayat.length >
                    0 ? (
                    <div className="space-y-4">

                      {umkm.riwayat.map(
                        (
                          history,
                          index
                        ) => {

                          const historyStatus =
                            getStatusStyle(
                              history.status
                            );

                          const isLast =
                            index ===
                            umkm.riwayat
                              .length -
                              1;

                          return (
                            <div
                              key={
                                history.id ||
                                index
                              }
                              className="relative flex gap-4"
                            >

                              {!isLast && (
                                <div className="absolute left-2.5 top-7 bottom-0 w-px bg-outline-variant/30" />
                              )}

                              <div
                                className={`relative z-10 w-5 h-5 rounded-full ${historyStatus.bg} shrink-0 mt-1`}
                              />

                              <div className="flex-1 min-w-0 pb-2">

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                                  <span
                                    className={`inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full ${historyStatus.bg} ${historyStatus.text} text-xs font-semibold`}
                                  >

                                    <span className="material-symbols-outlined text-sm">
                                      {
                                        historyStatus.icon
                                      }
                                    </span>

                                    {
                                      getStatusLabel(
                                        history.status
                                      )
                                    }

                                  </span>

                                  <span className="text-xs text-on-surface-variant whitespace-nowrap">
                                    {formatTanggal(
                                      history.created_at
                                    )}
                                  </span>

                                </div>

                                {history.catatan && (
                                  <p className="text-sm text-on-surface-variant mt-2 whitespace-pre-line wrap-break-word">
                                    {
                                      history.catatan
                                    }
                                  </p>
                                )}

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>
                  ) : (
                    <div className="rounded-xl bg-surface-container-low px-4 py-4 text-sm text-on-surface-variant">
                      Belum ada riwayat pengajuan.
                    </div>
                  )}

                </section>

                {/* ACTIONS */}

                <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-outline-variant/20">

                  {umkm.is_active && (
                    <a
                      href={`/umkm/${umkm.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-primary/30 text-primary hover:bg-primary/5 transition-colors font-label-md"
                    >
                      <span className="material-symbols-outlined">
                        open_in_new
                      </span>

                      Lihat di Publik
                    </a>
                  )}

                  <Link
                    to={`/dashboard/umkm/edit/${umkm.id}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white hover:bg-primary-container transition-colors font-label-md"
                  >
                    <span className="material-symbols-outlined">
                      edit
                    </span>

                    Edit UMKM
                  </Link>

                  <Link
                    to="/dashboard/umkm"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors font-label-md"
                  >
                    <span className="material-symbols-outlined">
                      arrow_back
                    </span>

                    Kembali
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

      {/* ============================================================
          PHOTO PREVIEW
      ============================================================= */}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-110 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={
            closePhotoPreview
          }
        >

          <div
            className="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            <img
              src={
                selectedPhoto.url
              }
              alt={
                umkm.nama_umkm ||
                'Foto UMKM'
              }
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />

            <button
              type="button"
              onClick={
                closePhotoPreview
              }
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Tutup preview"
            >
              <span className="material-symbols-outlined">
                close
              </span>
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default DetailUmkmPage;
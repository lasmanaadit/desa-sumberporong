// src/pages/dashboard/UmkmSayaPage.jsx

import React, {
  useEffect,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import api from '../../api/axios';

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

const UmkmSayaPage = () => {

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

  const [
    actionLoading,
    setActionLoading,
  ] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Foto Private
  |--------------------------------------------------------------------------
  |
  | Menyimpan object URL:
  |
  | {
  |   [fotoId]: "blob:http://..."
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
  | Fetch UMKM
  |--------------------------------------------------------------------------
  */

  const fetchUmkm = async () => {
    setLoading(true);
    setError('');

    try {
      const response =
        await api.get(
          '/pengajuan/umkm'
        );

      const responseData =
        response.data?.data;

      let data = [];

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

      setUmkmList(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Gagal mengambil data UMKM.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUmkm();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Cleanup Semua Blob URL Saat Unmount
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

    const photos =
      [...umkm.foto].sort(
        (
          first,
          second
        ) =>
          (first.urutan || 0) -
          (second.urutan || 0)
      );

    return (
      photos[0] || null
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Load Private Photo
  |--------------------------------------------------------------------------
  */

  const loadPrivatePhoto = async (
    photo
  ) => {
    if (
      !photo?.id
    ) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Sudah pernah dimuat
    |--------------------------------------------------------------------------
    */

    if (
      photoUrls[photo.id]
    ) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Sedang dimuat
    |--------------------------------------------------------------------------
    */

    if (
      photoLoading[photo.id]
    ) {
      return;
    }

    setPhotoLoading(
      (previous) => ({
        ...previous,
        [photo.id]: true,
      })
    );

    try {
      /*
      |--------------------------------------------------------------------------
      | Endpoint private user
      |--------------------------------------------------------------------------
      |
      | GET /api/files/umkm/{foto}
      |
      | api.js otomatis menambahkan:
      |
      | Authorization: Bearer {token}
      |
      */

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
    } catch (err) {
      console.error(
        'Gagal memuat foto UMKM:',
        err
      );

      setPhotoUrls(
        (previous) => ({
          ...previous,
          [photo.id]:
            null,
        })
      );
    } finally {
      setPhotoLoading(
        (previous) => ({
          ...previous,
          [photo.id]: false,
        })
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load Foto Ketika UMKM Berubah
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !Array.isArray(
        umkmList
      )
    ) {
      return;
    }

    umkmList.forEach(
      (umkm) => {
        const primaryPhoto =
          getPrimaryPhoto(
            umkm
          );

        if (
          primaryPhoto
        ) {
          loadPrivatePhoto(
            primaryPhoto
          );
        }
      }
    );
  }, [umkmList]);

  /*
  |--------------------------------------------------------------------------
  | Toggle Active
  |--------------------------------------------------------------------------
  */

  const handleToggleActive = async (
    umkm
  ) => {
    if (
      !umkm?.id
    ) {
      return;
    }

    if (
      umkm.status !==
      'disetujui'
    ) {
      setError(
        'UMKM hanya dapat diaktifkan atau dinonaktifkan setelah disetujui admin.'
      );

      return;
    }

    const nextState =
      !Boolean(
        umkm.is_active
      );

    const confirmationMessage =
      nextState
        ? `Aktifkan "${umkm.nama_umkm}" agar kembali tampil di publik?`
        : `Nonaktifkan "${umkm.nama_umkm}" dari publik?`;

    if (
      !window.confirm(
        confirmationMessage
      )
    ) {
      return;
    }

    setError('');

    setActionLoading(
      `active-${umkm.id}`
    );

    try {
      const response =
        await api.patch(
          `/pengajuan/umkm/${umkm.id}/active`
        );

      const updated =
        response.data?.data;

      setUmkmList(
        (
          previous
        ) =>
          previous.map(
            (
              item
            ) =>
              item.id ===
              umkm.id
                ? updated || {
                    ...item,
                    is_active:
                      nextState,
                  }
                : item
          )
      );
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
          'Status aktif UMKM gagal diperbarui.'
      );
    } finally {
      setActionLoading(
        null
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Soft Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (
    umkm
  ) => {
    if (
      !umkm?.id
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Apakah Anda yakin ingin menghapus UMKM "${umkm.nama_umkm}"?\n\nUMKM akan dihapus dari daftar Anda.`
      );

    if (!confirmed) {
      return;
    }

    setError('');

    setActionLoading(
      `delete-${umkm.id}`
    );

    try {
      await api.delete(
        `/pengajuan/umkm/${umkm.id}`
      );

      setUmkmList(
        (
          previous
        ) =>
          previous.filter(
            (
              item
            ) =>
              item.id !==
              umkm.id
          )
      );

      /*
      |--------------------------------------------------------------------------
      | Hapus Blob URL Foto
      |--------------------------------------------------------------------------
      */

      const primaryPhoto =
        getPrimaryPhoto(
          umkm
        );

      if (
        primaryPhoto?.id &&
        photoUrls[
          primaryPhoto.id
        ]
      ) {
        URL.revokeObjectURL(
          photoUrls[
            primaryPhoto.id
          ]
        );

        setPhotoUrls(
          (
            previous
          ) => {
            const next = {
              ...previous,
            };

            delete next[
              primaryPhoto.id
            ];

            return next;
          }
        );
      }
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
          'UMKM gagal dihapus.'
      );
    } finally {
      setActionLoading(
        null
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading Page
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-background">

        <div className="min-w-0">


          <main className="p-4 sm:p-6 lg:p-8">

            <div className="max-w-7xl mx-auto">

              <div className="mb-8">

                <div className="h-8 w-48 bg-surface-container-low rounded-lg animate-pulse" />

                <div className="h-4 w-72 max-w-full bg-surface-container-low rounded-lg mt-3" />

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {Array.from({
                  length: 3,
                }).map(
                  (
                    _,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden"
                    >

                      <div className="h-48 bg-surface-container-low animate-pulse" />

                      <div className="p-5 space-y-3">

                        <div className="h-4 w-24 bg-surface-container-low rounded animate-pulse" />

                        <div className="h-6 w-48 bg-surface-container-low rounded animate-pulse" />

                        <div className="h-12 w-full bg-surface-container-low rounded animate-pulse" />

                        <div className="h-6 w-40 bg-surface-container-low rounded animate-pulse" />

                        <div className="flex gap-2 pt-2">

                          <div className="h-10 flex-1 bg-surface-container-low rounded-xl animate-pulse" />

                          <div className="h-10 w-20 bg-surface-container-low rounded-xl animate-pulse" />

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          </main>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-background">

      <div className="min-w-0">

        <main className="p-4 sm:p-6 lg:p-8">

          <div className="max-w-7xl mx-auto min-w-0">

            {/* ======================================================
                HEADER
            ======================================================= */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

              <div className="min-w-0">

                <h1 className="font-headline-lg text-primary">
                  UMKM Saya
                </h1>

                <p
                  className="text-on-surface-variant mt-2"
                  style={{
                    width: '100%',
                    maxWidth: '720px',
                    lineHeight: '1.6',
                  }}
                >
                  Kelola dan pantau
                  pengajuan UMKM Anda.
                </p>

              </div>

              <Link
                to="/dashboard/umkm/tambah"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-label-md hover:bg-primary-container transition-colors"
              >

                <span className="material-symbols-outlined">
                  add
                </span>

                Ajukan UMKM

              </Link>

            </div>

            {/* ======================================================
                ERROR
            ======================================================= */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                <div className="flex items-start gap-3 text-red-700">

                  <span className="material-symbols-outlined shrink-0">
                    error
                  </span>

                  <p
                    className="text-sm"
                    style={{
                      width: '100%',
                      lineHeight: '1.5',
                    }}
                  >
                    {error}
                  </p>

                </div>

              </div>
            )}

            {/* ======================================================
                EMPTY
            ======================================================= */}

            {umkmList.length ===
            0 ? (
              <div className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-6 py-16 text-center">

                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">

                  <span className="material-symbols-outlined text-4xl">
                    storefront
                  </span>

                </div>

                <h2 className="font-headline-md text-xl text-on-surface mt-5">
                  Belum ada UMKM
                </h2>

                <div className="w-full flex justify-center mt-3">

                  <p
                    className="text-sm text-on-surface-variant text-center"
                    style={{
                      width: '100%',
                      maxWidth: '560px',
                      lineHeight: '1.6',
                    }}
                  >
                    Anda belum memiliki
                    pengajuan UMKM.
                    Ajukan UMKM Anda
                    untuk ditampilkan
                    setelah melalui
                    proses verifikasi.
                  </p>

                </div>

                <Link
                  to="/dashboard/umkm/tambah"
                  className="inline-flex items-center justify-center gap-2 mt-6 px-5 py-3 rounded-xl bg-primary text-white font-label-md font-semibold hover:bg-primary-container transition-colors"
                >

                  <span className="material-symbols-outlined">
                    add
                  </span>

                  Ajukan UMKM

                </Link>

              </div>
            ) : (

              /* ====================================================
                 LIST
              ===================================================== */

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {umkmList.map(
                  (
                    umkm
                  ) => {

                    const status =
                      getStatusStyle(
                        umkm.status
                      );

                    const primaryPhoto =
                      getPrimaryPhoto(
                        umkm
                      );

                    const primaryPhotoUrl =
                      primaryPhoto?.id
                        ? photoUrls[
                            primaryPhoto.id
                          ]
                        : null;

                    const primaryPhotoLoading =
                      primaryPhoto?.id
                        ? photoLoading[
                            primaryPhoto.id
                          ]
                        : false;

                    const isApproved =
                      umkm.status ===
                      'disetujui';

                    const toggleLoading =
                      actionLoading ===
                      `active-${umkm.id}`;

                    const deleteLoading =
                      actionLoading ===
                      `delete-${umkm.id}`;

                    const anyActionLoading =
                      toggleLoading ||
                      deleteLoading;

                    return (
                      <div
                        key={
                          umkm.id
                        }
                        className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col min-w-0"
                      >

                        {/* ==================================================
                            FOTO
                        =================================================== */}

                        <div className="relative h-48 bg-surface-container-low">

                          {primaryPhotoUrl ? (
                            <img
                              src={
                                primaryPhotoUrl
                              }
                              alt={
                                umkm.nama_umkm ||
                                'Foto UMKM'
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : primaryPhotoLoading ? (
                            <div className="w-full h-full flex flex-col items-center justify-center">

                              <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                                progress_activity
                              </span>

                              <span className="text-xs text-on-surface-variant mt-2">
                                Memuat foto...
                              </span>

                            </div>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">

                              <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">
                                image
                              </span>

                              <span className="text-xs text-on-surface-variant/50 mt-1">
                                Foto tidak tersedia
                              </span>

                            </div>
                          )}

                          {/* STATUS */}

                          <span
                            className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                          >

                            <span className="material-symbols-outlined text-base">
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

                          {/* PUBLIC STATUS */}

                          {isApproved &&
                            umkm.is_active && (
                              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-semibold">

                                <span className="w-2 h-2 rounded-full bg-green-400" />

                                Aktif di Publik

                              </span>
                            )}

                          {isApproved &&
                            !umkm.is_active && (
                              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-semibold">

                                <span className="w-2 h-2 rounded-full bg-gray-300" />

                                Tidak Aktif

                              </span>
                            )}

                        </div>

                        {/* ==================================================
                            CONTENT
                        =================================================== */}

                        <div className="p-5 flex flex-col flex-1 min-w-0">

                          {/* KATEGORI */}

                          <p className="font-label-sm text-primary">
                            {
                              umkm.kategori
                                ?.nama ||
                              'Tanpa kategori'
                            }
                          </p>

                          {/* NAMA */}

                          <h2 className="font-headline-md text-lg text-on-surface mt-1 line-clamp-2 wrap-break-word">
                            {
                              umkm.nama_umkm ||
                              'Tanpa nama'
                            }
                          </h2>

                          {/* DESKRIPSI */}

                          <p className="text-sm text-on-surface-variant line-clamp-3 mt-2 flex-1 leading-relaxed wrap-break-word">
                            {
                              umkm.deskripsi_umkm ||
                              '-'
                            }
                          </p>

                          {/* HARGA */}

                          <p className="text-lg font-bold text-primary mt-4">
                            {
                              formatRupiah(
                                umkm.harga_min
                              )}{' '}
                            -{' '}
                            {
                              formatRupiah(
                                umkm.harga_max
                              )
                            }
                          </p>

                          {/* CATATAN ADMIN */}

                          {umkm.catatan_admin && (
                            <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-100 p-3">

                              <p className="text-xs font-semibold text-yellow-800">
                                Catatan Admin
                              </p>

                              <p className="text-sm text-yellow-700 mt-1 whitespace-pre-line wrap-break-word">
                                {
                                  umkm.catatan_admin
                                }
                              </p>

                            </div>
                          )}

                          {/* =================================================
                              ACTIONS
                          ================================================== */}

                          <div className="flex flex-wrap gap-2 mt-5">

                            {/* DETAIL */}

                            <Link
                              to={`/dashboard/umkm/detail/${umkm.id}`}
                              className="flex-1 min-w-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container transition-colors text-sm font-semibold"
                            >

                              <span className="material-symbols-outlined text-lg">
                                visibility
                              </span>

                              Detail

                            </Link>

                            {/* EDIT */}

                            <Link
                              to={`/dashboard/umkm/edit/${umkm.id}`}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-colors text-sm"
                            >

                              <span className="material-symbols-outlined text-lg">
                                edit
                              </span>

                              Edit

                            </Link>

                            {/* TOGGLE */}

                            {isApproved && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleActive(
                                    umkm
                                  )
                                }
                                disabled={
                                  anyActionLoading
                                }
                                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-colors disabled:opacity-50 disabled:cursor-wait ${
                                  umkm.is_active
                                    ? 'border-orange-300 text-orange-600 hover:bg-orange-50'
                                    : 'border-green-300 text-green-600 hover:bg-green-50'
                                }`}
                              >

                                <span className="material-symbols-outlined text-lg">
                                  {toggleLoading
                                    ? 'progress_activity'
                                    : umkm.is_active
                                      ? 'pause_circle'
                                      : 'play_circle'}
                                </span>

                                {toggleLoading
                                  ? 'Memproses...'
                                  : umkm.is_active
                                    ? 'Nonaktifkan'
                                    : 'Aktifkan'}

                              </button>
                            )}

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  umkm
                                )
                              }
                              disabled={
                                anyActionLoading
                              }
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-wait"
                            >

                              <span className="material-symbols-outlined text-lg">
                                {deleteLoading
                                  ? 'progress_activity'
                                  : 'delete'}
                              </span>

                              {deleteLoading
                                ? 'Menghapus...'
                                : 'Hapus'}

                            </button>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </main>

      </div>

    </div>
  );
};

export default UmkmSayaPage;
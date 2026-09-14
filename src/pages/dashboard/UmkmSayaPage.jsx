// src/pages/dashboard/UmkmSayaPage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const ASSUMED_BACKEND_PER_PAGE = 10;
const MAX_PAGES = 50;
const PAGE_SIZE = 10;

const STATUS_LABELS = {
  menunggu_verifikasi: 'Menunggu Verifikasi',
  diproses: 'Diproses',
  disetujui: 'Disetujui',
  ditolak: 'Ditolak',
};

const STATUS_STYLES = {
  menunggu_verifikasi: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'schedule' },
  diproses: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'pending' },
  disetujui: { bg: 'bg-green-100', text: 'text-green-700', icon: 'check_circle' },
  ditolak: { bg: 'bg-red-100', text: 'text-red-700', icon: 'cancel' },
};

const UmkmSayaPage = () => {
  const [allUmkm, setAllUmkm] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const [photoUrls, setPhotoUrls] = useState({});
  const [photoLoading, setPhotoLoading] = useState({});

  /*
  |--------------------------------------------------------------------------
  | FETCH SEMUA HALAMAN (LOOP)
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      setError('');

      try {
        const collected = [];
        let page = 1;
        let lastPage = 1;

        while (page <= MAX_PAGES) {
          const res = await api.get('/pengajuan/umkm', { params: { page } });
          if (cancelled) return;

          const root = res.data || {};
          const payload = root.data;
          const topMeta = root.meta;

          let items = [];
          let detectedLastPage = null;

          if (Array.isArray(payload)) {
            // Format: { data: [...], meta: {...} }
            items = payload;
            detectedLastPage = topMeta?.last_page ?? null;
          } else if (payload && Array.isArray(payload.data)) {
            // Format: { data: { data: [...], meta: {...} } }
            items = payload.data;
            detectedLastPage =
              payload.meta?.last_page ??
              topMeta?.last_page ??
              null;
          }

          if (items.length === 0) break;

          collected.push(...items);

          if (detectedLastPage != null) {
            lastPage = Number(detectedLastPage) || 1;
            if (page >= lastPage) break;
          } else {
            // Tidak ada meta → stop kalau halaman tidak penuh
            if (items.length < ASSUMED_BACKEND_PER_PAGE) break;
          }

          page += 1;
        }

        if (!cancelled) {
          setAllUmkm(collected);
          setCurrentPage(1);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Gagal mengambil data UMKM:', err);
        setError(err.response?.data?.message || 'Gagal mengambil data UMKM.');
        setAllUmkm([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CLEANUP BLOB URL
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    return () => {
      Object.values(photoUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
  |--------------------------------------------------------------------------
  | PAGINATION (CLIENT-SIDE)
  |--------------------------------------------------------------------------
  */
  const totalPages = Math.max(1, Math.ceil(allUmkm.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedUmkm = allUmkm.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */
  const formatRupiah = (value) => {
    const number = Number(value);
    if (Number.isNaN(number)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const getStatusStyle = (status) =>
    STATUS_STYLES[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'help' };

  const getStatusLabel = (status) => STATUS_LABELS[status] || status || '-';

  const getPrimaryPhoto = (umkm) => {
    if (!Array.isArray(umkm?.foto)) return null;
    const photos = [...umkm.foto].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
    return photos[0] || null;
  };

  const loadPrivatePhoto = async (photo) => {
    if (!photo?.id) return;
    if (photoUrls[photo.id]) return;
    if (photoLoading[photo.id]) return;

    setPhotoLoading((prev) => ({ ...prev, [photo.id]: true }));

    try {
      const response = await api.get(`/files/umkm/${photo.id}`, {
        responseType: 'blob',
      });
      const blobUrl = URL.createObjectURL(response.data);
      setPhotoUrls((prev) => ({ ...prev, [photo.id]: blobUrl }));
    } catch (err) {
      console.error('Gagal memuat foto UMKM:', err);
      setPhotoUrls((prev) => ({ ...prev, [photo.id]: null }));
    } finally {
      setPhotoLoading((prev) => ({ ...prev, [photo.id]: false }));
    }
  };

  useEffect(() => {
    if (!Array.isArray(paginatedUmkm)) return;
    paginatedUmkm.forEach((umkm) => {
      const primaryPhoto = getPrimaryPhoto(umkm);
      if (primaryPhoto) loadPrivatePhoto(primaryPhoto);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedUmkm]);

  /*
  |--------------------------------------------------------------------------
  | TOGGLE ACTIVE
  |--------------------------------------------------------------------------
  */
  const handleToggleActive = async (umkm) => {
    if (!umkm?.id) return;

    if (umkm.status !== 'disetujui') {
      setError('UMKM hanya dapat diaktifkan atau dinonaktifkan setelah disetujui admin.');
      return;
    }

    const nextState = !Boolean(umkm.is_active);

    const confirmationMessage = nextState
      ? `Aktifkan "${umkm.nama_umkm}" agar kembali tampil di publik?`
      : `Nonaktifkan "${umkm.nama_umkm}" dari publik?`;

    if (!window.confirm(confirmationMessage)) return;

    setError('');
    setActionLoading(`active-${umkm.id}`);

    try {
      const response = await api.patch(`/pengajuan/umkm/${umkm.id}/active`);
      const updated = response.data?.data;

      setAllUmkm((prev) =>
        prev.map((item) =>
          item.id === umkm.id
            ? updated || { ...item, is_active: nextState }
            : item
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Status aktif UMKM gagal diperbarui.');
    } finally {
      setActionLoading(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SOFT DELETE
  |--------------------------------------------------------------------------
  */
  const handleDelete = async (umkm) => {
    if (!umkm?.id) return;

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus UMKM "${umkm.nama_umkm}"?\n\nUMKM akan dihapus dari daftar Anda.`
    );

    if (!confirmed) return;

    setError('');
    setActionLoading(`delete-${umkm.id}`);

    try {
      await api.delete(`/pengajuan/umkm/${umkm.id}`);

      const newList = allUmkm.filter((item) => item.id !== umkm.id);
      setAllUmkm(newList);

      // Kalau halaman ini kosong dan bukan page 1 → mundur
      const newTotalPages = Math.max(1, Math.ceil(newList.length / PAGE_SIZE));
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);

      const primaryPhoto = getPrimaryPhoto(umkm);
      if (primaryPhoto?.id && photoUrls[primaryPhoto.id]) {
        URL.revokeObjectURL(photoUrls[primaryPhoto.id]);
        setPhotoUrls((prev) => {
          const next = { ...prev };
          delete next[primaryPhoto.id];
          return next;
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'UMKM gagal dihapus.');
    } finally {
      setActionLoading(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PAGE NAVIGATION
  |--------------------------------------------------------------------------
  */
  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING PAGE
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
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden"
                  >
                    <div className="h-48 bg-surface-container-low animate-pulse" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 w-24 bg-surface-container-low rounded animate-pulse" />
                      <div className="h-6 w-48 bg-surface-container-low rounded animate-pulse" />
                      <div className="h-12 w-full bg-surface-container-low rounded animate-pulse" />
                      <div className="h-6 w-40 bg-surface-container-low rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN
  |--------------------------------------------------------------------------
  */
  return (
    <div className="min-h-screen bg-background">
      <div className="min-w-0">
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto min-w-0">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="min-w-0">
                <h1 className="font-headline-lg text-primary">UMKM Saya</h1>
                <p className="text-on-surface-variant mt-2" style={{ maxWidth: '720px', lineHeight: '1.6' }}>
                  Kelola dan pantau pengajuan UMKM Anda.
                </p>
              </div>

              <Link
                to="/dashboard/umkm/tambah"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-label-md hover:bg-primary-container transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                Ajukan UMKM
              </Link>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <div className="flex items-start gap-3 text-red-700">
                  <span className="material-symbols-outlined shrink-0">error</span>
                  <p className="text-sm" style={{ lineHeight: '1.5' }}>{error}</p>
                </div>
              </div>
            )}

            {/* EMPTY */}
            {allUmkm.length === 0 ? (
              <div className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-6 py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-4xl">storefront</span>
                </div>

                <h2 className="font-headline-md text-xl text-on-surface mt-5">
                  Belum ada UMKM
                </h2>

                <p
                  className="text-sm text-on-surface-variant mt-3 mx-auto text-center"
                  style={{ maxWidth: '560px', lineHeight: '1.6' }}
                >
                  Anda belum memiliki pengajuan UMKM. Ajukan UMKM Anda untuk ditampilkan setelah melalui proses verifikasi.
                </p>

                <Link
                  to="/dashboard/umkm/tambah"
                  className="inline-flex items-center justify-center gap-2 mt-6 px-5 py-3 rounded-xl bg-primary text-white font-label-md font-semibold hover:bg-primary-container transition-colors"
                >
                  <span className="material-symbols-outlined">add</span>
                  Ajukan UMKM
                </Link>
              </div>
            ) : (
              <>
                {/* LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedUmkm.map((umkm) => {
                    const status = getStatusStyle(umkm.status);
                    const primaryPhoto = getPrimaryPhoto(umkm);
                    const primaryPhotoUrl = primaryPhoto?.id ? photoUrls[primaryPhoto.id] : null;
                    const primaryPhotoLoading = primaryPhoto?.id ? photoLoading[primaryPhoto.id] : false;
                    const isApproved = umkm.status === 'disetujui';
                    const toggleLoading = actionLoading === `active-${umkm.id}`;
                    const deleteLoading = actionLoading === `delete-${umkm.id}`;
                    const anyActionLoading = toggleLoading || deleteLoading;

                    return (
                      <div
                        key={umkm.id}
                        className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col min-w-0"
                      >
                        {/* FOTO */}
                        <div className="relative h-48 bg-surface-container-low">
                          {primaryPhotoUrl ? (
                            <img
                              src={primaryPhotoUrl}
                              alt={umkm.nama_umkm || 'Foto UMKM'}
                              className="w-full h-full object-cover"
                            />
                          ) : primaryPhotoLoading ? (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                                progress_activity
                              </span>
                              <span className="text-xs text-on-surface-variant mt-2">Memuat foto...</span>
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

                          <span
                            className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                          >
                            <span className="material-symbols-outlined text-base">{status.icon}</span>
                            {getStatusLabel(umkm.status)}
                          </span>

                          {isApproved && umkm.is_active && (
                            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-semibold">
                              <span className="w-2 h-2 rounded-full bg-green-400" />
                              Aktif di Publik
                            </span>
                          )}

                          {isApproved && !umkm.is_active && (
                            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-semibold">
                              <span className="w-2 h-2 rounded-full bg-gray-300" />
                              Tidak Aktif
                            </span>
                          )}
                        </div>

                        {/* CONTENT */}
                        <div className="p-5 flex flex-col flex-1 min-w-0">
                          <p className="font-label-sm text-primary">
                            {umkm.kategori?.nama || 'Tanpa kategori'}
                          </p>

                          <h2 className="font-headline-md text-lg text-on-surface mt-1 line-clamp-2 wrap-break-word">
                            {umkm.nama_umkm || 'Tanpa nama'}
                          </h2>

                          <p className="text-sm text-on-surface-variant line-clamp-3 mt-2 flex-1 leading-relaxed wrap-break-word">
                            {umkm.deskripsi_umkm || '-'}
                          </p>

                          <p className="text-lg font-bold text-primary mt-4">
                            {formatRupiah(umkm.harga_min)} - {formatRupiah(umkm.harga_max)}
                          </p>

                          {umkm.catatan_admin && (
                            <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-100 p-3">
                              <p className="text-xs font-semibold text-yellow-800">Catatan Admin</p>
                              <p className="text-sm text-yellow-700 mt-1 whitespace-pre-line wrap-break-word">
                                {umkm.catatan_admin}
                              </p>
                            </div>
                          )}

                          {/* ACTIONS */}
                          <div className="flex flex-wrap gap-2 mt-5">
                            <Link
                              to={`/dashboard/umkm/detail/${umkm.id}`}
                              className="flex-1 min-w-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container transition-colors text-sm font-semibold"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                              Detail
                            </Link>

                            <Link
                              to={`/dashboard/umkm/edit/${umkm.id}`}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-colors text-sm"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                              Edit
                            </Link>

                            {isApproved && (
                              <button
                                type="button"
                                onClick={() => handleToggleActive(umkm)}
                                disabled={anyActionLoading}
                                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-colors disabled:opacity-50 disabled:cursor-wait ${
                                  umkm.is_active
                                    ? 'border-orange-300 text-orange-600 hover:bg-orange-50'
                                    : 'border-green-300 text-green-600 hover:bg-green-50'
                                }`}
                              >
                                <span className="material-symbols-outlined text-lg">
                                  {toggleLoading ? 'progress_activity' : umkm.is_active ? 'pause_circle' : 'play_circle'}
                                </span>
                                {toggleLoading ? 'Memproses...' : umkm.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDelete(umkm)}
                              disabled={anyActionLoading}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-wait"
                            >
                              <span className="material-symbols-outlined text-lg">
                                {deleteLoading ? 'progress_activity' : 'delete'}
                              </span>
                              {deleteLoading ? 'Menghapus...' : 'Hapus'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/30 text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                      aria-label="Halaman sebelumnya"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition ${
                          currentPage === page
                            ? 'bg-primary text-white'
                            : 'border border-outline-variant/30 text-primary hover:bg-primary/10'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/30 text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                      aria-label="Halaman berikutnya"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                )}

                {/* INFO TOTAL */}
                <div className="mt-6 text-center text-sm text-on-surface-variant">
                  Menampilkan{' '}
                  <span className="font-semibold text-on-surface">
                    {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, allUmkm.length)}
                  </span>{' '}
                  dari <span className="font-semibold text-on-surface">{allUmkm.length}</span> UMKM
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UmkmSayaPage;
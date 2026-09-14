import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
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

const TABS = [
  { value: 'menunggu', label: 'Menunggu' },
  { value: 'disetujui', label: 'Disetujui' },
  { value: 'ditolak', label: 'Ditolak' },
];

const SuperAdminUmkmApproval = () => {
  const [allUmkm, setAllUmkm] = useState([]);
  const [activeTab, setActiveTab] = useState('menunggu');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [rejectError, setRejectError] = useState('');

  const [currentSlide, setCurrentSlide] = useState(0);
  const [photoUrls, setPhotoUrls] = useState({});
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  /*
  |--------------------------------------------------------------------------
  | FETCH SEMUA UMKM (LOOP SEMUA HALAMAN)
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

        while (page <= MAX_PAGES) {
          const res = await api.get('/admin/pengajuan/umkm', { params: { page } });
          if (cancelled) return;

          const payload = res.data?.data;

          let items = [];
          let meta = null;

          if (Array.isArray(payload)) {
            items = payload;
          } else if (payload && Array.isArray(payload.data)) {
            items = payload.data;
            meta = payload.meta || null;
          }

          if (items.length === 0) break;

          collected.push(...items);

          if (meta?.last_page) {
            if (page >= Number(meta.last_page)) break;
          } else {
            if (items.length < ASSUMED_BACKEND_PER_PAGE) break;
          }

          page += 1;
        }

        if (!cancelled) setAllUmkm(collected);
      } catch (err) {
        if (cancelled) return;
        console.error('Gagal mengambil daftar pengajuan UMKM:', err);
        setError(err.response?.data?.message || 'Gagal mengambil daftar pengajuan UMKM.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | RESET PAGE SAAT TAB / SEARCH BERUBAH
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  /*
  |--------------------------------------------------------------------------
  | TAB COUNTS
  |--------------------------------------------------------------------------
  */
  const countMenunggu = useMemo(
    () => allUmkm.filter((i) => ['menunggu_verifikasi', 'diproses'].includes(i.status)).length,
    [allUmkm]
  );
  const countDisetujui = useMemo(
    () => allUmkm.filter((i) => i.status === 'disetujui').length,
    [allUmkm]
  );
  const countDitolak = useMemo(
    () => allUmkm.filter((i) => i.status === 'ditolak').length,
    [allUmkm]
  );

  const tabCounts = {
    menunggu: countMenunggu,
    disetujui: countDisetujui,
    ditolak: countDitolak,
  };

  /*
  |--------------------------------------------------------------------------
  | FILTER BY TAB
  |--------------------------------------------------------------------------
  */
  const tabData = useMemo(() => {
    if (activeTab === 'menunggu') {
      return allUmkm.filter((i) =>
        ['menunggu_verifikasi', 'diproses'].includes(i.status)
      );
    }
    if (activeTab === 'disetujui') {
      return allUmkm.filter((i) => i.status === 'disetujui');
    }
    if (activeTab === 'ditolak') {
      return allUmkm.filter((i) => i.status === 'ditolak');
    }
    return allUmkm;
  }, [allUmkm, activeTab]);

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */
  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) return tabData;
    const q = searchQuery.toLowerCase();
    return tabData.filter((item) =>
      item.nama_umkm?.toLowerCase().includes(q) ||
      item.user?.name?.toLowerCase().includes(q) ||
      item.user?.email?.toLowerCase().includes(q) ||
      item.kategori?.nama?.toLowerCase().includes(q) ||
      item.alamat?.toLowerCase().includes(q) ||
      String(item.id).includes(q)
    );
  }, [tabData, searchQuery]);

  /*
  |--------------------------------------------------------------------------
  | CLIENT-SIDE PAGINATION
  |--------------------------------------------------------------------------
  */
  const totalPages = Math.max(1, Math.ceil(searchedData.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedData = searchedData.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  /*
  |--------------------------------------------------------------------------
  | FORMATTERS
  |--------------------------------------------------------------------------
  */
  const formatRupiah = (v) => {
    const n = Number(v);
    if (Number.isNaN(n)) return 'Rp0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(n);
  };

  const formatDate = (v) => {
    if (!v) return '-';
    const d = new Date(v);
    return Number.isNaN(d.getTime())
      ? v
      : d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const getStatusStyle = (s) =>
    STATUS_STYLES[s] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'help' };
  const getStatusLabel = (s) => STATUS_LABELS[s] || s || '-';

  const getPhotos = (umkm) => {
    if (!Array.isArray(umkm?.foto)) return [];
    return [...umkm.foto].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
  };
  const selectedPhotos = useMemo(() => getPhotos(selected), [selected]);

  /*
  |--------------------------------------------------------------------------
  | LOAD PHOTOS
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    let mounted = true;
    const objectUrls = [];

    const loadPhotos = async () => {
      if (selectedPhotos.length === 0) {
        setPhotoUrls({}); setPhotoError(''); setPhotosLoading(false);
        return;
      }
      setPhotosLoading(true); setPhotoError(''); setPhotoUrls({});
      try {
        const entries = await Promise.all(
          selectedPhotos.map(async (photo) => {
            if (!photo?.id) return [photo?.id, null];
            try {
              const response = await api.get(`/admin/files/umkm/${photo.id}`, {
                responseType: 'blob',
              });
              const contentType = response.headers?.['content-type'] || '';
              if (!contentType.startsWith('image/')) return [photo.id, null];
              const objectUrl = URL.createObjectURL(response.data);
              objectUrls.push(objectUrl);
              return [photo.id, objectUrl];
            } catch {
              return [photo.id, null];
            }
          })
        );
        if (!mounted) return;
        setPhotoUrls(Object.fromEntries(entries));
        if (entries.filter(([, url]) => !url).length > 0) {
          setPhotoError('Sebagian foto UMKM tidak dapat dimuat.');
        }
      } catch {
        if (mounted) setPhotoError('Foto UMKM gagal dimuat.');
      } finally {
        if (mounted) setPhotosLoading(false);
      }
    };

    loadPhotos();

    return () => {
      mounted = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedPhotos]);

  /*
  |--------------------------------------------------------------------------
  | DETAIL
  |--------------------------------------------------------------------------
  */
  const handleOpenDetail = async (item) => {
    if (!item?.id) return;
    setSelected(null);
    setCurrentSlide(0);
    setPhotoUrls({});
    setPhotoError('');
    setPhotosLoading(false);
    setDetailLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.get(`/admin/pengajuan/umkm/${item.id}`);
      const data = response.data?.data;
      if (!data) throw new Error('Detail UMKM tidak ditemukan.');
      setSelected(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Detail UMKM gagal diambil.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    if (actionLoading || detailLoading) return;
    setSelected(null);
    setCurrentSlide(0);
    setPhotoUrls({});
    setPhotoError('');
    setPhotosLoading(false);
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE STATUS (Local + Server)
  |--------------------------------------------------------------------------
  */
  const handleUpdateStatus = async (item, status) => {
    if (!item?.id || !status) return;
    setError('');
    setSuccess('');
    setActionLoading(`${status}-${item.id}`);

    try {
      const response = await api.patch(
        `/admin/pengajuan/umkm/${item.id}/status`,
        { status }
      );
      const updated = response.data?.data;

      setAllUmkm((prev) =>
        prev.map((c) =>
          c.id === item.id
            ? updated || { ...c, status, is_active: status === 'disetujui' }
            : c
        )
      );

      if (selected?.id === item.id) {
        setSelected(updated || { ...selected, status, is_active: status === 'disetujui' });
      }

      setSuccess(response.data?.message || 'Status pengajuan UMKM berhasil diperbarui.');
    } catch (err) {
      setError(err.response?.data?.message || 'Status pengajuan UMKM gagal diperbarui.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleProcess = (item) => {
    if (item.status !== 'menunggu_verifikasi') return;
    if (!window.confirm(`Teruskan pengajuan "${item.nama_umkm}" ke tahap Diproses?`)) return;
    handleUpdateStatus(item, 'diproses');
  };

  const handleApprove = (item) => {
    if (!['menunggu_verifikasi', 'diproses'].includes(item.status)) return;
    if (
      !window.confirm(
        `Setujui UMKM "${item.nama_umkm}"?\n\nSetelah disetujui, UMKM akan aktif di publik.`
      )
    )
      return;
    handleUpdateStatus(item, 'disetujui');
  };

  const handleOpenReject = (item) => {
    if (!['menunggu_verifikasi', 'diproses'].includes(item.status)) return;
    setRejectTarget(item);
    setRejectNote('');
    setRejectError('');
    setShowRejectModal(true);
  };

  const handleSubmitReject = async () => {
    if (!rejectTarget?.id) return;
    const note = rejectNote.trim();
    if (!note) {
      setRejectError('Catatan penolakan wajib diisi.');
      return;
    }
    if (note.length > 5000) {
      setRejectError('Catatan penolakan maksimal 5000 karakter.');
      return;
    }
    setRejectError('');
    setError('');
    setSuccess('');
    setActionLoading(`ditolak-${rejectTarget.id}`);

    try {
      const response = await api.patch(
        `/admin/pengajuan/umkm/${rejectTarget.id}/status`,
        { status: 'ditolak', catatan_admin: note }
      );
      const updated = response.data?.data;

      setAllUmkm((prev) =>
        prev.map((c) =>
          c.id === rejectTarget.id
            ? updated || {
                ...c,
                status: 'ditolak',
                is_active: false,
                catatan_admin: note,
              }
            : c
        )
      );

      if (selected?.id === rejectTarget.id) {
        setSelected(
          updated || {
            ...selected,
            status: 'ditolak',
            is_active: false,
            catatan_admin: note,
          }
        );
      }

      setShowRejectModal(false);
      setRejectTarget(null);
      setRejectNote('');
      setSuccess(response.data?.message || 'Pengajuan UMKM berhasil ditolak.');
    } catch (err) {
      const data = err.response?.data;
      setRejectError(
        data?.errors?.catatan_admin?.[0] || data?.message || 'Pengajuan UMKM gagal ditolak.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseReject = () => {
    if (actionLoading) return;
    setShowRejectModal(false);
    setRejectTarget(null);
    setRejectNote('');
    setRejectError('');
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */
  if (loading && allUmkm.length === 0) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-headline-lg text-on-background">UMKM Approval</h1>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-primary text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                Super Admin
              </span>
            </div>
            <p className="font-body-md text-on-surface-variant mt-1">
              Kelola dan verifikasi pengajuan UMKM masyarakat.
            </p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden">
          <div className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 bg-surface-container-low rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */
  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-headline-lg text-on-background">UMKM Approval</h1>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-primary text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              Super Admin
            </span>
          </div>
          <p className="font-body-md text-on-surface-variant mt-1">
            Kelola dan verifikasi pengajuan UMKM masyarakat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari UMKM, pemilik, kategori..."
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface border border-outline-variant/40 text-sm outline-none focus:border-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                aria-label="Hapus"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined shrink-0">error</span>
            <span className="wrap-break-word whitespace-pre-line">{error}</span>
          </div>
        </div>
      )}
      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined shrink-0">check_circle</span>
            <span className="wrap-break-word">{success}</span>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-2 border-b border-outline-variant/20 pb-2 mb-5 overflow-x-auto">
        {TABS.map((tab) => {
          const count = tabCounts[tab.value] || 0;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-xl font-label-md whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-on-surface-variant hover:bg-primary/10'
              }`}
            >
              {tab.label}
              <span className="ml-1 opacity-80">({count})</span>
            </button>
          );
        })}
      </div>

      {/* TABLE / EMPTY */}
      {paginatedData.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-4xl">storefront</span>
          </div>
          <h2 className="font-headline-md text-xl text-on-surface mt-5">
            {searchQuery
              ? `Tidak ada hasil untuk "${searchQuery}"`
              : `Belum ada pengajuan UMKM ${
                  activeTab === 'menunggu'
                    ? 'yang menunggu verifikasi'
                    : activeTab === 'disetujui'
                    ? 'yang disetujui'
                    : 'yang ditolak'
                }`}
          </h2>
          <p className="font-body-md text-on-surface-variant mt-2">
            {searchQuery
              ? 'Coba kata kunci lain.'
              : 'Data akan muncul di sini setelah ada pengajuan.'}
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-surface-container-low border-b border-outline-variant/20">
                <tr>
                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">ID</th>
                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Nama UMKM</th>
                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Pemilik</th>
                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Kategori</th>
                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Harga</th>
                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Status</th>
                  <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => {
                  const status = getStatusStyle(item.status);
                  const processLoading = actionLoading === `diproses-${item.id}`;
                  const approveLoading = actionLoading === `disetujui-${item.id}`;
                  const rejectLoading = actionLoading === `ditolak-${item.id}`;
                  const canProcess = item.status === 'menunggu_verifikasi';
                  const canApprove = ['menunggu_verifikasi', 'diproses'].includes(item.status);
                  const canReject = ['menunggu_verifikasi', 'diproses'].includes(item.status);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <span className="font-label-md font-semibold text-primary">
                          #{item.id}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-label-md font-semibold text-on-surface wrap-break-word">
                          {item.nama_umkm || '-'}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 wrap-break-word">
                          {item.alamat || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-label-md text-on-surface wrap-break-word">
                          {item.user?.name || '-'}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1 wrap-break-word">
                          {item.user?.email || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-label-sm text-primary">
                          {item.kategori?.nama || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <p className="font-label-sm text-on-surface">
                          {formatRupiah(item.harga_min)}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1">
                          s/d {formatRupiah(item.harga_max)}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-sm whitespace-nowrap ${status.bg} ${status.text}`}
                        >
                          <span className="material-symbols-outlined text-base">{status.icon}</span>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            className="px-3 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors text-sm"
                          >
                            Detail
                          </button>
                          {canProcess && (
                            <button
                              type="button"
                              onClick={() => handleProcess(item)}
                              disabled={processLoading}
                              className="px-3 py-2 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors text-sm disabled:opacity-50"
                            >
                              {processLoading ? 'Memproses...' : 'Proses'}
                            </button>
                          )}
                          {canApprove && (
                            <button
                              type="button"
                              onClick={() => handleApprove(item)}
                              disabled={approveLoading}
                              className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                            >
                              {approveLoading ? 'Menyetujui...' : 'Setujui'}
                            </button>
                          )}
                          {canReject && (
                            <button
                              type="button"
                              onClick={() => handleOpenReject(item)}
                              disabled={rejectLoading}
                              className="px-3 py-2 rounded-lg bg-error text-white hover:bg-error/90 transition-colors text-sm disabled:opacity-50"
                            >
                              Tolak
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-4 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-on-surface-variant">
                Halaman{' '}
                <span className="font-semibold text-on-surface">{currentPage}</span>{' '}
                dari{' '}
                <span className="font-semibold text-on-surface">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-outline-variant/30 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/5"
                >
                  Sebelumnya
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`min-w-10 px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'border border-outline-variant/30 hover:bg-primary/5'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-outline-variant/30 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/5"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL */}
      {(selected || detailLoading) && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCloseDetail}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-5xl max-h-[92vh] bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs text-primary">
                    {selected ? `#${selected.id}` : 'Detail'}
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-primary text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-sm">
                      admin_panel_settings
                    </span>
                    Super Admin
                  </span>
                </div>
                <h2 className="font-headline-md text-xl text-on-surface mt-1">
                  Detail Pengajuan UMKM
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseDetail}
                disabled={Boolean(actionLoading) || detailLoading}
                className="w-9 h-9 rounded-full hover:bg-primary/10 text-on-surface-variant hover:text-primary flex items-center justify-center disabled:opacity-50"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {detailLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-primary text-5xl">
                  progress_activity
                </span>
                <p className="mt-3">Memuat detail UMKM...</p>
              </div>
            ) : (
              selected && (
                <>
                  <div className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* FOTO */}
                      <section>
                        {selectedPhotos.length > 0 ? (
                          <div>
                            {photoError && (
                              <div className="mb-3 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
                                {photoError}
                              </div>
                            )}
                            <div className="relative rounded-2xl overflow-hidden bg-surface-container-low">
                              {photosLoading ? (
                                <div className="w-full h-72 md:h-96 flex flex-col items-center justify-center bg-surface-container-high">
                                  <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                                    progress_activity
                                  </span>
                                  <p className="mt-2 text-sm text-on-surface-variant">
                                    Memuat foto...
                                  </p>
                                </div>
                              ) : photoUrls[selectedPhotos[currentSlide]?.id] ? (
                                <img
                                  src={photoUrls[selectedPhotos[currentSlide].id]}
                                  alt={`Foto ${currentSlide + 1}`}
                                  className="w-full h-72 md:h-96 object-contain bg-surface-container-high"
                                />
                              ) : (
                                <div className="w-full h-72 md:h-96 flex flex-col items-center justify-center bg-surface-container-high text-on-surface-variant">
                                  <span className="material-symbols-outlined text-6xl opacity-30">
                                    broken_image
                                  </span>
                                  <p className="mt-2 text-sm">Foto tidak dapat dimuat.</p>
                                </div>
                              )}
                              {selectedPhotos.length > 1 && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCurrentSlide(
                                        (p) => (p - 1 + selectedPhotos.length) % selectedPhotos.length
                                      )
                                    }
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center"
                                  >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setCurrentSlide((p) => (p + 1) % selectedPhotos.length)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center"
                                  >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                  </button>
                                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                                    {selectedPhotos.map((_, i) => (
                                      <button
                                        key={i}
                                        type="button"
                                        onClick={() => setCurrentSlide(i)}
                                        className={`h-2 rounded-full transition-all ${
                                          currentSlide === i ? 'w-5 bg-white' : 'w-2 bg-white/50'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="grid grid-cols-5 gap-2 mt-3">
                              {selectedPhotos.map((photo, i) => (
                                <button
                                  key={photo.id ?? i}
                                  type="button"
                                  onClick={() => setCurrentSlide(i)}
                                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                                    currentSlide === i ? 'border-primary' : 'border-transparent'
                                  } bg-surface-container-high`}
                                >
                                  {photoUrls[photo.id] ? (
                                    <img
                                      src={photoUrls[photo.id]}
                                      alt={`Thumb ${i + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="material-symbols-outlined text-on-surface-variant/40">
                                        image
                                      </span>
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="h-72 md:h-96 rounded-2xl bg-surface-container-low flex items-center justify-center">
                            <div className="text-center text-on-surface-variant">
                              <span className="material-symbols-outlined text-6xl opacity-30">
                                image
                              </span>
                              <p className="mt-2 text-sm">Tidak ada foto UMKM.</p>
                            </div>
                          </div>
                        )}
                      </section>

                      {/* DETAIL */}
                      <section>
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-primary">
                              {selected.kategori?.nama || 'Tanpa kategori'}
                            </p>
                            <h3 className="font-headline-lg text-2xl text-on-surface mt-1 wrap-break-word">
                              {selected.nama_umkm}
                            </h3>
                          </div>
                          {(() => {
                            const s = getStatusStyle(selected.status);
                            return (
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 ${s.bg} ${s.text}`}
                              >
                                <span className="material-symbols-outlined text-base">
                                  {s.icon}
                                </span>
                                {getStatusLabel(selected.status)}
                              </span>
                            );
                          })()}
                        </div>

                        <div className="mt-5 space-y-4">
                          <div>
                            <p className="text-xs text-on-surface-variant">Pemilik</p>
                            <p className="font-label-md font-semibold text-on-surface mt-1">
                              {selected.user?.name || '-'}
                            </p>
                            <p className="text-sm text-on-surface-variant mt-0.5 wrap-break-word">
                              {selected.user?.email || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-on-surface-variant">Deskripsi</p>
                            <p className="text-sm text-on-surface mt-1 whitespace-pre-line wrap-break-word">
                              {selected.deskripsi_umkm || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-on-surface-variant">Harga</p>
                            <p className="font-label-md font-semibold text-primary mt-1">
                              {formatRupiah(selected.harga_min)} - {formatRupiah(selected.harga_max)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-on-surface-variant">Alamat</p>
                            <p className="text-sm text-on-surface mt-1 whitespace-pre-line wrap-break-word">
                              {selected.alamat || '-'}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-on-surface-variant">Jam Buka</p>
                              <p className="text-sm font-semibold text-on-surface mt-1">
                                {selected.jam_buka_mulai || '-'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-on-surface-variant">Jam Tutup</p>
                              <p className="text-sm font-semibold text-on-surface mt-1">
                                {selected.jam_buka_selesai || '-'}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-on-surface-variant">WhatsApp</p>
                            <p className="text-sm font-semibold text-on-surface mt-1 wrap-break-word">
                              {selected.nomor_wa || '-'}
                            </p>
                          </div>
                          {selected.link_ecommerce && (
                            <div>
                              <p className="text-xs text-on-surface-variant">E-Commerce</p>
                              <a
                                href={selected.link_ecommerce}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-1 wrap-break-word"
                              >
                                <span className="min-w-0 wrap-break-word">
                                  {selected.link_ecommerce}
                                </span>
                                <span className="material-symbols-outlined text-base shrink-0">
                                  open_in_new
                                </span>
                              </a>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-on-surface-variant">Diajukan</p>
                            <p className="text-sm text-on-surface mt-1">
                              {formatDate(selected.created_at)}
                            </p>
                          </div>
                        </div>

                        {selected.catatan_admin && (
                          <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                            <p className="text-xs font-semibold text-yellow-800">Catatan Admin</p>
                            <p className="text-sm text-yellow-700 mt-1 whitespace-pre-line wrap-break-word">
                              {selected.catatan_admin}
                            </p>
                          </div>
                        )}
                      </section>
                    </div>

                    {Array.isArray(selected.riwayat) && selected.riwayat.length > 0 && (
                      <section>
                        <h3 className="font-label-md font-semibold text-primary mb-4">
                          Riwayat Status
                        </h3>
                        <div className="space-y-4">
                          {selected.riwayat.map((h, i) => {
                            const s = getStatusStyle(h.status);
                            const isLast = i === selected.riwayat.length - 1;
                            return (
                              <div key={h.id} className="relative flex gap-4">
                                {!isLast && (
                                  <div className="absolute left-2 top-7 bottom-0 w-px bg-outline-variant/30" />
                                )}
                                <div className="relative z-10 w-5 h-5 mt-1 rounded-full shrink-0 bg-surface-container-low flex items-center justify-center">
                                  <div
                                    className={`w-2 h-2 rounded-full ${s.text.replace(
                                      'text-',
                                      'bg-'
                                    )}`}
                                  />
                                </div>
                                <div className="min-w-0 flex-1 pb-2">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <span
                                      className={`inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}
                                    >
                                      <span className="material-symbols-outlined text-base">
                                        {s.icon}
                                      </span>
                                      {getStatusLabel(h.status)}
                                    </span>
                                    <span className="text-xs text-on-surface-variant">
                                      {formatDate(h.created_at)}
                                    </span>
                                  </div>
                                  {h.catatan && (
                                    <p className="text-sm text-on-surface-variant mt-2 whitespace-pre-line wrap-break-word">
                                      {h.catatan}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}
                  </div>

                  <div className="px-6 py-4 border-t border-outline-variant/20 flex flex-wrap justify-end gap-2">
                    {selected.status === 'menunggu_verifikasi' && (
                      <button
                        type="button"
                        onClick={() => handleProcess(selected)}
                        disabled={Boolean(actionLoading)}
                        className="px-4 py-2.5 rounded-xl border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors text-sm disabled:opacity-50"
                      >
                        Proses
                      </button>
                    )}
                    {['menunggu_verifikasi', 'diproses'].includes(selected.status) && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenReject(selected)}
                          disabled={Boolean(actionLoading)}
                          className="px-4 py-2.5 rounded-xl bg-error text-white hover:bg-error/90 transition-colors text-sm disabled:opacity-50"
                        >
                          Tolak
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(selected)}
                          disabled={Boolean(actionLoading)}
                          className="px-4 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                        >
                          Setujui
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={handleCloseDetail}
                      disabled={Boolean(actionLoading)}
                      className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors text-sm disabled:opacity-50"
                    >
                      Tutup
                    </button>
                  </div>
                </>
              )
            )}
          </motion.div>
        </div>
      )}

      {/* REJECT MODAL */}
      {showRejectModal && rejectTarget && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-primary font-semibold">
                    Tolak Pengajuan #{rejectTarget.id}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary text-[10px] font-semibold">
                    Super Admin
                  </span>
                </div>
                <h2 className="font-headline-md text-xl text-on-surface mt-1">
                  Tolak Pengajuan UMKM
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseReject}
                disabled={Boolean(actionLoading)}
                className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center text-on-surface-variant disabled:opacity-50"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              <div className="rounded-xl bg-surface-container-low p-4 mb-5">
                <p className="text-xs text-on-surface-variant">UMKM</p>
                <p className="font-label-md font-semibold text-on-surface mt-1 wrap-break-word">
                  {rejectTarget.nama_umkm}
                </p>
              </div>
              <label className="block font-label-md font-semibold text-on-surface mb-2">
                Catatan Penolakan <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => {
                  setRejectNote(e.target.value);
                  if (rejectError) setRejectError('');
                }}
                rows={6}
                maxLength={5000}
                placeholder="Jelaskan alasan pengajuan UMKM ditolak..."
                disabled={Boolean(actionLoading)}
                className={`w-full px-4 py-3 rounded-xl border bg-surface outline-none resize-none transition-colors ${
                  rejectError
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-outline-variant/40 focus:border-primary'
                }`}
              />
              <div className="flex items-center justify-between gap-3 mt-1.5">
                {rejectError ? (
                  <p className="text-xs text-red-600 wrap-break-word">{rejectError}</p>
                ) : (
                  <span className="text-xs text-on-surface-variant">
                    Catatan akan dilihat oleh pemilik UMKM.
                  </span>
                )}
                <span className="text-xs text-on-surface-variant shrink-0">
                  {rejectNote.length}/5000
                </span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-outline-variant/20 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseReject}
                disabled={Boolean(actionLoading)}
                className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors text-sm disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmitReject}
                disabled={Boolean(actionLoading)}
                className="px-4 py-2.5 rounded-xl bg-error text-white hover:bg-error/90 transition-colors text-sm disabled:opacity-50"
              >
                {actionLoading === `ditolak-${rejectTarget.id}` ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-base">
                      progress_activity
                    </span>
                    Menolak...
                  </span>
                ) : (
                  'Tolak Pengajuan'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminUmkmApproval;
// src/pages/UserDashboard.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';

import api from '../api/axios';

/*
|--------------------------------------------------------------------------
| CONSTANT
|--------------------------------------------------------------------------
*/

const MAX_RECENT_SUBMISSIONS = 5;

/*
|--------------------------------------------------------------------------
| HELPER - PAGINATION DATA
|--------------------------------------------------------------------------
*/

const extractCollection = (response) => {
  const payload = response?.data?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

/*
|--------------------------------------------------------------------------
| HELPER - NORMALIZE STATUS
|--------------------------------------------------------------------------
*/

const normalizeStatus = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim().toLowerCase().replace(/\s+/g, '_');
};

/*
|--------------------------------------------------------------------------
| HELPER - FORMAT STATUS
|--------------------------------------------------------------------------
*/

const getStatusConfig = (status) => {
  const normalized = normalizeStatus(status);

  if (['pending', 'diajukan', 'diajukan_user', 'menunggu', 'menunggu_proses', 'baru'].includes(normalized)) {
    return { label: 'Menunggu', icon: 'schedule', className: 'bg-amber-100 text-amber-700' };
  }

  if (['diproses', 'processing', 'proses', 'sedang_diproses', 'ditinjau', 'review'].includes(normalized)) {
    return { label: 'Diproses', icon: 'pending', className: 'bg-blue-100 text-blue-700' };
  }

  if (['disetujui', 'approved', 'approve', 'selesai', 'completed', 'complete', 'diterima', 'aktif', 'active'].includes(normalized)) {
    return { label: 'Selesai', icon: 'task_alt', className: 'bg-green-100 text-green-700' };
  }

  if (['ditolak', 'rejected', 'reject', 'gagal', 'failed', 'cancelled', 'canceled'].includes(normalized)) {
    return { label: 'Ditolak', icon: 'cancel', className: 'bg-red-100 text-red-700' };
  }

  return { label: status || 'Belum diketahui', icon: 'info', className: 'bg-surface-container text-on-surface-variant' };
};

/*
|--------------------------------------------------------------------------
| HELPER - FORMAT DATE
|--------------------------------------------------------------------------
*/

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
};

/*
|--------------------------------------------------------------------------
| HELPER - GET ITEM DATE
|--------------------------------------------------------------------------
*/

const getItemDate = (item) => {
  return item?.created_at || item?.tanggal_pengajuan || item?.updated_at || null;
};

/*
|--------------------------------------------------------------------------
| HELPER - GET ITEM ID
|--------------------------------------------------------------------------
*/

const getItemId = (item) => {
  return item?.id || item?.pengajuan_ktp_id || item?.pengajuan_sku_id || item?.pengajuan_umkm_id || item?.pengaduan_id || null;
};

/*
|--------------------------------------------------------------------------
| HELPER - GET STATUS FIELD
|--------------------------------------------------------------------------
*/

const getItemStatus = (item) => {
  return item?.status || item?.status_pengajuan || item?.status_pendaftaran || item?.status_pengaduan || '';
};

/*
|--------------------------------------------------------------------------
| HELPER - GET USER NAME
|--------------------------------------------------------------------------
*/

const getUserNameFromResponse = (response) => {
  return response?.data?.user?.name || response?.data?.data?.name || response?.data?.name || null;
};

/*
|--------------------------------------------------------------------------
| HELPER - BUILD RECENT ITEM
|--------------------------------------------------------------------------
*/

const buildRecentItem = (item, type, label, icon, route) => {
  const status = getItemStatus(item);
  return {
    id: `${type}-${getItemId(item) || Math.random()}`,
    type,
    label,
    icon,
    route,
    title:
      item?.judul ||
      item?.nama_usaha ||
      item?.nama_produk ||
      item?.nama ||
      item?.jenis_layanan ||
      item?.subjek ||
      `${label} #${getItemId(item) || '-'}`,
    description:
      item?.deskripsi ||
      item?.keterangan ||
      item?.keperluan ||
      item?.alamat ||
      item?.nama_usaha ||
      '',
    status,
    date: getItemDate(item),
  };
};

/*
|--------------------------------------------------------------------------
| COMPONENT - RECENT SUBMISSION
|--------------------------------------------------------------------------
*/

const RecentSubmissionPanel = ({ submissions, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined">history</span>
          </div>
          <div>
            <h2 className="font-headline-md text-xl text-on-background">Pengajuan Terbaru</h2>
            <p className="text-sm text-on-surface-variant">Aktivitas pengajuan terbaru Anda.</p>
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 w-full animate-pulse rounded-xl bg-surface-container-low" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined">history</span>
          </div>
          <div>
            <h2 className="font-headline-md text-xl text-on-background">Pengajuan Terbaru</h2>
            <p className="text-sm text-on-surface-variant">Aktivitas pengajuan terbaru Anda.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/dashboard/riwayat')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:opacity-80"
        >
          Lihat Semua
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="flex min-h-56 w-full flex-col items-center justify-center rounded-xl bg-surface-container-low px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-3xl">description</span>
          </div>
          <h3 className="mt-4 font-headline-md text-lg text-on-surface">Belum ada pengajuan</h3>
          <button
            type="button"
            onClick={() => navigate('/dashboard/pengajuan')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <span className="material-symbols-outlined text-base">post_add</span>
            Buat Pengajuan
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission) => {
            const status = getStatusConfig(submission.status);
            return (
              <button
                key={submission.id}
                type="button"
                onClick={() => navigate(submission.route)}
                className="group flex w-full flex-col gap-3 rounded-xl border border-outline-variant/15 bg-surface-container-low p-4 text-left transition hover:border-primary/25 hover:bg-primary/5 sm:flex-row sm:items-center"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest text-primary">
                  <span className="material-symbols-outlined">{submission.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    <p className="font-label-md font-semibold text-on-surface">{submission.label}</p>
                    <span className="hidden text-on-surface-variant sm:inline">•</span>
                    <p className="text-xs text-on-surface-variant">{formatDate(submission.date)}</p>
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold text-on-surface">{submission.title}</p>
                  {submission.description && (
                    <p className="mt-1 truncate text-xs text-on-surface-variant">{submission.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}>
                    <span className="material-symbols-outlined text-sm">{status.icon}</span>
                    {status.label}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant transition group-hover:translate-x-0.5 group-hover:text-primary">
                    chevron_right
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

/*
|--------------------------------------------------------------------------
| MAIN DASHBOARD
|--------------------------------------------------------------------------
*/

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // State user
  const [user, setUser] = useState(null);

  // State data
  const [ktpData, setKtpData] = useState([]);
  const [skuData, setSkuData] = useState([]);
  const [umkmData, setUmkmData] = useState([]);
  const [pengaduanData, setPengaduanData] = useState([]);

  // Loading & error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load dashboard data
  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      let localUser = null;
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          localUser = JSON.parse(storedUser);
        } catch {
          localUser = null;
        }
      }

      if (mounted && localUser) {
        setUser(localUser);
      }

      const results = await Promise.allSettled([
        api.get('/user'),
        api.get('/pengajuan/ktp'),
        api.get('/pengajuan/sku'),
        api.get('/pengajuan/umkm'),
        api.get('/pengaduan'),
      ]);

      if (!mounted) return;

      const userResult = results[0];
      if (userResult.status === 'fulfilled') {
        const apiUser = getUserNameFromResponse(userResult.value);
        const userPayload = userResult.value?.data?.data || userResult.value?.data?.user || userResult.value?.data || null;
        if (userPayload && typeof userPayload === 'object') {
          setUser(userPayload);
          localStorage.setItem('user', JSON.stringify(userPayload));
        } else if (apiUser) {
          setUser((previous) => ({ ...previous, name: apiUser }));
        }
      }

      const ktpResult = results[1];
      if (ktpResult.status === 'fulfilled') {
        setKtpData(extractCollection(ktpResult.value));
      }

      const skuResult = results[2];
      if (skuResult.status === 'fulfilled') {
        setSkuData(extractCollection(skuResult.value));
      }

      const umkmResult = results[3];
      if (umkmResult.status === 'fulfilled') {
        setUmkmData(extractCollection(umkmResult.value));
      }

      const pengaduanResult = results[4];
      if (pengaduanResult.status === 'fulfilled') {
        setPengaduanData(extractCollection(pengaduanResult.value));
      }

      const failedResults = results.filter((result) => result.status === 'rejected');
      if (failedResults.length === results.length) {
        setError('Data dashboard gagal dimuat. Silakan coba lagi.');
      } else if (failedResults.length > 0) {
        console.warn('Sebagian data dashboard gagal dimuat:', failedResults);
      }

      setLoading(false);
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  // Total pengajuan (KTP + SKU + UMKM)
  const totalPengajuan = useMemo(() => ktpData.length + skuData.length + umkmData.length, [ktpData, skuData, umkmData]);

  // Sedang diproses
  const sedangDiproses = useMemo(() => {
    const allItems = [...ktpData, ...skuData, ...umkmData];
    return allItems.filter((item) => {
      const status = normalizeStatus(getItemStatus(item));
      return ['pending', 'diajukan', 'diajukan_user', 'menunggu', 'menunggu_proses', 'diproses', 'processing', 'proses', 'sedang_diproses', 'ditinjau', 'review'].includes(status);
    }).length;
  }, [ktpData, skuData, umkmData]);

  // Selesai
  const pengajuanSelesai = useMemo(() => {
    const allItems = [...ktpData, ...skuData, ...umkmData];
    return allItems.filter((item) => {
      const status = normalizeStatus(getItemStatus(item));
      return ['disetujui', 'approved', 'approve', 'selesai', 'completed', 'complete', 'diterima'].includes(status);
    }).length;
  }, [ktpData, skuData, umkmData]);

  // Total produk UMKM
  const totalProdukUmkm = umkmData.length;

  // Recent submissions
  const recentSubmissions = useMemo(() => {
    const items = [];
    ktpData.forEach((item) => items.push(buildRecentItem(item, 'ktp', 'Pengajuan KTP', 'badge', '/dashboard/pengajuan/ktp')));
    skuData.forEach((item) => items.push(buildRecentItem(item, 'sku', 'Pengajuan SKU', 'storefront', '/dashboard/pengajuan/sku')));
    umkmData.forEach((item) => items.push(buildRecentItem(item, 'umkm', 'Produk UMKM', 'storefront', '/dashboard/umkm')));
    pengaduanData.forEach((item) => items.push(buildRecentItem(item, 'pengaduan', 'Pengaduan', 'campaign', '/dashboard/pengaduan')));

    return items
      .sort((first, second) => {
        const firstDate = first.date ? new Date(first.date).getTime() : 0;
        const secondDate = second.date ? new Date(second.date).getTime() : 0;
        return secondDate - firstDate;
      })
      .slice(0, MAX_RECENT_SUBMISSIONS);
  }, [ktpData, skuData, umkmData, pengaduanData]);

  const displayName = user?.name || 'Pengguna';

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="mx-auto w-full max-w-7xl min-w-0">
      {/* Welcome */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-8"
      >
        <h1 className="font-headline-lg text-on-background">
          Selamat datang, {user?.name || 'Pengguna'} 👋
        </h1>
        <p className="mt-2 font-body-md text-on-surface-variant">
          Kelola pengajuan administrasi dan produk UMKM Anda dengan lebih mudah.
        </p>
      </motion.section>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
        >
          <span className="material-symbols-outlined shrink-0">error</span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 font-semibold underline underline-offset-2"
            >
              Muat ulang dashboard
            </button>
          </div>
        </motion.div>
      )}

      <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Pengajuan" value={loading ? '...' : ktpData.length + skuData.length + umkmData.length} description="KTP, SKU, dan UMKM" icon="description" />
        <StatCard title="Sedang Diproses" value={loading ? '...' : '...'} description="Menunggu proses" icon="pending" iconBg="bg-blue-100" iconColor="text-blue-600" />
        <StatCard title="Pengajuan Selesai" value={loading ? '...' : '...'} description="Berhasil diselesaikan" icon="task_alt" iconBg="bg-green-100" iconColor="text-green-600" />
        <StatCard title="Produk UMKM" value={loading ? '...' : umkmData.length} description="Produk yang diajukan" icon="storefront" iconBg="bg-orange-100" iconColor="text-orange-600" />
      </section>

      <RecentSubmissionPanel submissions={recentSubmissions} loading={loading} />

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6"
      >
        <h2 className="font-headline-md text-on-background text-xl mb-4">Akses Cepat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button onClick={() => navigate('/dashboard/pengajuan')} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontSize: '23px' }}>post_add</span>
                </div>
                <div>
                  <p className="font-label-md font-semibold text-on-surface">Buat Pengajuan</p>
                  <p className="font-label-sm text-on-surface-variant mt-1">Ajukan administrasi desa</p>
                </div>
              </button>
              <button onClick={() => navigate('/dashboard/umkm/tambah')} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all">
                <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontSize: '23px' }}>add_business</span>
                </div>
                <div>
                  <p className="font-label-md font-semibold text-on-surface">Tambah Produk UMKM</p>
                  <p className="font-label-sm text-on-surface-variant mt-1">Promosikan produk Anda</p>
                </div>
              </button>
              <button onClick={() => navigate('/dashboard/riwayat')} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all">
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontSize: '23px' }}>history</span>
                </div>
                <div>
                  <p className="font-label-md font-semibold text-on-surface">Riwayat Pengajuan</p>
                  <p className="font-label-sm text-on-surface-variant mt-1">Lihat semua pengajuan</p>
                </div>
              </button>
            </div>
      </motion.section>
    </div>
  );
};

export default UserDashboard;
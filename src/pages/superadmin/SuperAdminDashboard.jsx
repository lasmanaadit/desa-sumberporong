// src/pages/superadmin/SuperAdminDashboard.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  motion,
} from 'framer-motion';

import {
  useNavigate,
} from 'react-router-dom';

import StatCard from '../../components/dashboard/StatCard';

import api from '../../api/axios';

/*
|--------------------------------------------------------------------------
| DASHBOARD SUPER ADMIN
|--------------------------------------------------------------------------
|
| Dashboard ini mengambil data secara realtime dari:
|
| GET /api/superadmin/dashboard
|
| Semua angka yang ditampilkan berasal dari backend.
|
| Selain menampilkan statistik, setiap bagian dashboard dapat diklik
| untuk langsung menuju halaman pengelolaan terkait.
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

const SuperAdminDashboard = () => {
  // ============================================================
  // NAVIGATION
  // ============================================================

  const navigate =
    useNavigate();

  // ============================================================
  // STATE
  // ============================================================

  const [
    dashboard,
    setDashboard,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  // ============================================================
  // FETCH DASHBOARD
  // ============================================================

  useEffect(() => {
    let cancelled =
      false;

    const fetchDashboard =
      async () => {
        try {
          setLoading(true);
          setError('');

          const response =
            await api.get(
              '/superadmin/dashboard'
            );

          if (
            !cancelled
          ) {
            setDashboard(
              response.data?.data ||
                {}
            );
          }
        } catch (
          err
        ) {
          console.error(
            'Gagal mengambil dashboard Super Admin:',
            err
          );

          if (
            !cancelled
          ) {
            setError(
              err.response?.data
                ?.message ||
                'Gagal mengambil data dashboard Super Admin.'
            );
          }
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

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // DATA DEFAULT
  // ============================================================
  //
  // Semua object diberikan default agar dashboard tetap aman
  // meskipun salah satu bagian response backend kosong.
  //
  // ============================================================

  const users =
    dashboard?.users ||
    {};

  const roles =
    dashboard?.roles ||
    {};

  const ktp =
    dashboard?.ktp ||
    {};

  const sku =
    dashboard?.sku ||
    {};

  const umkm =
    dashboard?.umkm ||
    {};

  const pengaduan =
    dashboard?.pengaduan ||
    {};

  // ============================================================
  // STATISTICS UTAMA
  // ============================================================
  //
  // Semua angka bersifat dinamis dari backend.
  //
  // Setiap card memiliki:
  // - title
  // - value
  // - description
  // - icon
  // - route
  //
  // ============================================================

  const stats = useMemo(
    () => [
      {
        title: 'Total User',
        value: String(
          users.total ?? 0
        ),
        description:
          'Semua akun',
        icon: 'group',
        iconBg:
          'bg-primary/10',
        iconColor:
          'text-primary',
        onClick:
          () =>
            navigate(
              '/superadmin/users'
            ),
      },

      {
        title: 'User Aktif',
        value: String(
          users.aktif ?? 0
        ),
        description:
          'Akun aktif',
        icon: 'person',
        iconBg:
          'bg-green-100',
        iconColor:
          'text-green-600',
        onClick:
          () =>
            navigate(
              '/superadmin/users'
            ),
      },

      {
        title:
          'Pengajuan KTP',
        value: String(
          ktp.total ?? 0
        ),
        description:
          'Semua pengajuan',
        icon: 'badge',
        iconBg:
          'bg-blue-100',
        iconColor:
          'text-blue-600',
        onClick:
          () =>
            navigate(
              '/superadmin/pengajuan/ktp'
            ),
      },

      {
        title:
          'Pengajuan SKU',
        value: String(
          sku.total ?? 0
        ),
        description:
          'Semua pengajuan',
        icon: 'storefront',
        iconBg:
          'bg-orange-100',
        iconColor:
          'text-orange-600',
        onClick:
          () =>
            navigate(
              '/superadmin/pengajuan/sku'
            ),
      },

      {
        title: 'Pengaduan',
        value: String(
          pengaduan.total ?? 0
        ),
        description:
          'Semua pengaduan',
        icon: 'report',
        iconBg:
          'bg-red-100',
        iconColor:
          'text-red-600',
        onClick:
          () =>
            navigate(
              '/superadmin/pengajuan/pengaduan'
            ),
      },
    ],
    [
      users.total,
      users.aktif,
      ktp.total,
      sku.total,
      pengaduan.total,
      navigate,
    ]
  );

  // ============================================================
  // LOADING
  // ============================================================

  if (
    loading
  ) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">

          <span
            className="material-symbols-outlined animate-spin text-primary"
            style={{
              fontSize:
                '36px',
            }}
          >
            progress_activity
          </span>

          <p className="text-on-surface-variant">
            Memuat dashboard...
          </p>

        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (
    error
  ) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

        <div className="flex items-start gap-3">

          <span className="material-symbols-outlined shrink-0 text-red-600">
            error
          </span>

          <div>
            <p className="font-semibold text-red-700">
              Gagal memuat dashboard
            </p>

            <p className="mt-2 text-sm leading-6 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <span className="material-symbols-outlined text-base">
                refresh
              </span>

              Muat Ulang
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="w-full">

      {/* =======================================================
          WELCOME
      ======================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration:
            0.45,
        }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-center gap-3">

          <h1 className="font-headline-lg text-on-background">
            Dashboard Super Admin
          </h1>

          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">

            <span className="material-symbols-outlined text-sm">
              admin_panel_settings
            </span>

            Super Admin

          </span>

        </div>

        <p className="mt-2 font-body-md text-on-surface-variant">
          Kelola seluruh sistem desa, pantau pengguna,
          pengajuan, UMKM, pengaduan, dan aktivitas layanan.
        </p>
      </motion.section>

      {/* =======================================================
          STATISTICS UTAMA
      ======================================================== */}

      <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

        {stats.map(
          (
            stat,
            index
          ) => (
            <motion.div
              key={
                stat.title
              }
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration:
                  0.35,
                delay:
                  index *
                  0.05,
              }}
              className="cursor-pointer"
              onClick={
                stat.onClick
              }
            >
              <div className="transition-transform duration-200 hover:-translate-y-1">
                <StatCard
                  {...stat}
                />
              </div>
            </motion.div>
          )
        )}

      </section>

      {/* =======================================================
          USER / KTP / SKU
      ======================================================== */}

      <section className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* =====================================================
            PENGGUNA
        ====================================================== */}

        <DashboardCard
          title="Pengguna"
          description="Ringkasan pengguna sistem"
          icon="group"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          onClick={() =>
            navigate(
              '/superadmin/users'
            )
          }
        >

          <div className="grid grid-cols-2 gap-4">

            <Metric
              label="Masyarakat"
              value={
                users.masyarakat
              }
              onClick={() =>
                navigate(
                  '/superadmin/users'
                )
              }
            />

            <Metric
              label="Admin"
              value={
                users.admin
              }
              onClick={() =>
                navigate(
                  '/superadmin/users'
                )
              }
            />

            <Metric
              label="Super Admin"
              value={
                users.superadmin
              }
              onClick={() =>
                navigate(
                  '/superadmin/users'
                )
              }
            />

            <Metric
              label="Role"
              value={
                roles.total
              }
              onClick={() =>
                navigate(
                  '/superadmin/roles'
                )
              }
            />

          </div>

        </DashboardCard>

        {/* =====================================================
            KTP
        ====================================================== */}

        <DashboardCard
          title="KTP"
          description="Status pengajuan KTP"
          icon="badge"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          onClick={() =>
            navigate(
              '/superadmin/pengajuan/ktp'
            )
          }
        >

          <div className="grid grid-cols-2 gap-4">

            <Metric
              label="Menunggu"
              value={
                ktp.menunggu_verifikasi
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/ktp'
                )
              }
            />

            <Metric
              label="Diproses"
              value={
                ktp.diproses
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/ktp'
                )
              }
            />

            <Metric
              label="Disetujui"
              value={
                ktp.disetujui
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/ktp'
                )
              }
            />

            <Metric
              label="Ditolak"
              value={
                ktp.ditolak
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/ktp'
                )
              }
            />

          </div>

        </DashboardCard>

        {/* =====================================================
            SKU
        ====================================================== */}

        <DashboardCard
          title="SKU"
          description="Status pengajuan SKU"
          icon="storefront"
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          onClick={() =>
            navigate(
              '/superadmin/pengajuan/sku'
            )
          }
        >

          <div className="grid grid-cols-2 gap-4">

            <Metric
              label="Menunggu"
              value={
                sku.menunggu_verifikasi
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/sku'
                )
              }
            />

            <Metric
              label="Diproses"
              value={
                sku.diproses
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/sku'
                )
              }
            />

            <Metric
              label="Disetujui"
              value={
                sku.disetujui
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/sku'
                )
              }
            />

            <Metric
              label="Ditolak"
              value={
                sku.ditolak
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/sku'
                )
              }
            />

          </div>

        </DashboardCard>

      </section>

      {/* =======================================================
          UMKM + PENGADUAN
      ======================================================== */}

      <section className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* =====================================================
            UMKM
        ====================================================== */}

        <DashboardCard
          title="UMKM"
          description="Status pengajuan dan aktivitas UMKM"
          icon="storefront"
          iconBg="bg-green-100"
          iconColor="text-green-600"
          onClick={() =>
            navigate(
              '/superadmin/pengajuan/umkm'
            )
          }
        >

          <div className="grid grid-cols-2 gap-4">

            <Metric
              label="Menunggu"
              value={
                umkm.menunggu_verifikasi
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/umkm'
                )
              }
            />

            <Metric
              label="Diproses"
              value={
                umkm.diproses
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/umkm'
                )
              }
            />

            <Metric
              label="Disetujui"
              value={
                umkm.disetujui
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/umkm'
                )
              }
            />

            <Metric
              label="Ditolak"
              value={
                umkm.ditolak
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/umkm'
                )
              }
            />

            <Metric
              label="Aktif"
              value={
                umkm.aktif
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/umkm'
                )
              }
            />

            <Metric
              label="Nonaktif"
              value={
                umkm.nonaktif
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/umkm'
                )
              }
            />

          </div>

        </DashboardCard>

        {/* =====================================================
            PENGADUAN
        ====================================================== */}

        <DashboardCard
          title="Pengaduan"
          description="Status pengaduan masyarakat"
          icon="report"
          iconBg="bg-red-100"
          iconColor="text-red-600"
          onClick={() =>
            navigate(
              '/superadmin/pengajuan/pengaduan'
            )
          }
        >

          <div className="grid grid-cols-2 gap-4">

            <Metric
              label="Total"
              value={
                pengaduan.total
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/pengaduan'
                )
              }
            />

            <Metric
              label="Terkirim"
              value={
                pengaduan.terkirim
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/pengaduan'
                )
              }
            />

            <Metric
              label="Diteruskan"
              value={
                pengaduan.diteruskan
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/pengaduan'
                )
              }
            />

            <Metric
              label="Selesai"
              value={
                pengaduan.selesai
              }
              onClick={() =>
                navigate(
                  '/superadmin/pengajuan/pengaduan'
                )
              }
            />

          </div>

        </DashboardCard>

      </section>

      {/* =======================================================
          QUICK ACTION
      ======================================================== */}

      <section className="mt-6">

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">

          <div>
            <h2 className="font-headline-md text-xl text-on-background">
              Aksi Cepat
            </h2>

            <p className="mt-1 text-sm text-on-surface-variant">
              Akses langsung ke halaman administrasi utama.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <QuickAction
            icon="manage_accounts"
            title="Manajemen User"
            description="Kelola akun pengguna"
            onClick={() =>
              navigate(
                '/superadmin/users'
              )
            }
            iconBg="bg-primary/10"
            iconColor="text-primary"
          />

          <QuickAction
            icon="admin_panel_settings"
            title="Role Management"
            description="Kelola role pengguna"
            onClick={() =>
              navigate(
                '/superadmin/roles'
              )
            }
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />

          <QuickAction
            icon="history"
            title="Audit Log"
            description="Lihat aktivitas sistem"
            onClick={() =>
              navigate(
                '/superadmin/audit-logs'
              )
            }
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />

          <QuickAction
            icon="badge"
            title="Verifikasi KTP"
            description="Proses pengajuan KTP"
            onClick={() =>
              navigate(
                '/superadmin/pengajuan/ktp'
              )
            }
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

        </div>

      </section>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| DASHBOARD CARD
|--------------------------------------------------------------------------
*/

const DashboardCard = ({
  title,
  description,
  icon,
  iconBg,
  iconColor,
  onClick,
  children,
}) => {
  return (
    <motion.section
      whileHover={{
        y: -2,
      }}
      transition={{
        duration:
          0.2,
      }}
      onClick={
        onClick
      }
      className={`
        rounded-2xl
        border border-outline-variant/20
        bg-surface-container-lowest
        p-6
        shadow-sm
        transition-shadow
        ${
          onClick
            ? 'cursor-pointer hover:border-primary/30 hover:shadow-md'
            : ''
        }
      `}
    >

      {/* =====================================================
          HEADER CARD
      ====================================================== */}

      <div className="mb-5 flex items-center gap-3">

        <div
          className={`
            flex h-11 w-11 items-center justify-center
            rounded-xl
            ${iconBg}
            ${iconColor}
          `}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize:
                '23px',
            }}
          >
            {icon}
          </span>
        </div>

        <div className="min-w-0">

          <h2 className="font-headline-md text-lg text-on-surface">
            {title}
          </h2>

          <p className="mt-1 font-label-sm tracking-normal text-on-surface-variant">
            {description}
          </p>

        </div>

        {onClick && (
          <span className="material-symbols-outlined ml-auto text-on-surface-variant">
            arrow_forward
          </span>
        )}

      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
      >
        {children}
      </div>

    </motion.section>
  );
};

/*
|--------------------------------------------------------------------------
| METRIC
|--------------------------------------------------------------------------
*/

const Metric = ({
  label,
  value,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="
        group
        w-full
        rounded-xl
        bg-surface-container-low
        px-4
        py-3
        text-left
        transition-all
        hover:bg-primary/10
        hover:ring-1
        hover:ring-primary/20
      "
    >

      <div className="flex items-center justify-between gap-2">

        <p className="font-label-sm tracking-normal text-on-surface-variant">
          {label}
        </p>

        <span className="material-symbols-outlined text-sm text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100">
          arrow_forward
        </span>

      </div>

      <p className="mt-1 font-headline-md text-xl text-on-surface">
        {value ?? 0}
      </p>

    </button>
  );
};

/*
|--------------------------------------------------------------------------
| QUICK ACTION
|--------------------------------------------------------------------------
*/

const QuickAction = ({
  icon,
  title,
  description,
  onClick,
  iconBg,
  iconColor,
}) => {
  return (
    <motion.button
      type="button"
      whileHover={{
        y: -2,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={
        onClick
      }
      className="
        flex
        items-center
        gap-4
        rounded-xl
        border
        border-outline-variant/20
        bg-surface-container-lowest
        p-5
        text-left
        transition-all
        hover:border-primary/30
        hover:shadow-md
      "
    >

      <div
        className={`
          flex h-11 w-11 shrink-0
          items-center justify-center
          rounded-xl
          ${iconBg}
          ${iconColor}
        `}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize:
              '23px',
          }}
        >
          {icon}
        </span>
      </div>

      <div className="min-w-0">

        <p className="font-label-md font-semibold text-on-surface">
          {title}
        </p>

        <p className="mt-1 font-label-sm tracking-normal text-on-surface-variant">
          {description}
        </p>

      </div>

      <span className="material-symbols-outlined ml-auto shrink-0 text-on-surface-variant">
        arrow_forward
      </span>

    </motion.button>
  );
};

export default SuperAdminDashboard;
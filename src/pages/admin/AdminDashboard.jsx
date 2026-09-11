// src/pages/admin/AdminDashboard.jsx

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
| DASHBOARD ADMIN
|--------------------------------------------------------------------------
|
| Dashboard mengambil data secara dinamis dari backend.
|
| Endpoint utama:
|
| GET /api/admin/dashboard
|
| Endpoint pengajuan terbaru:
|
| GET /api/admin/pengajuan/ktp
| GET /api/admin/pengajuan/sku
| GET /api/admin/pengaduan
| GET /api/admin/pengajuan/umkm
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| HELPER
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Ambil array data dari berbagai bentuk response Laravel
|--------------------------------------------------------------------------
|
| Mendukung:
|
| 1. response.data.data = []
|
| 2. response.data.data.data = []
|    untuk Laravel pagination.
|
|--------------------------------------------------------------------------
*/

const extractArray = (
  response
) => {
  const data =
    response?.data?.data;

  if (
    Array.isArray(
      data
    )
  ) {
    return data;
  }

  if (
    Array.isArray(
      data?.data
    )
  ) {
    return data.data;
  }

  return [];
};

/*
|--------------------------------------------------------------------------
| FORMAT TANGGAL
|--------------------------------------------------------------------------
*/

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
    return '-';
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

/*
|--------------------------------------------------------------------------
| AMBIL TANGGAL ITEM
|--------------------------------------------------------------------------
|
| Beberapa endpoint bisa memiliki nama field tanggal berbeda.
|
|--------------------------------------------------------------------------
*/

const getItemDate = (
  item
) => {
  return (
    item?.created_at ||
    item?.tanggal_pengajuan ||
    item?.tanggal ||
    item?.updated_at ||
    null
  );
};

/*
|--------------------------------------------------------------------------
| NORMALISASI STATUS
|--------------------------------------------------------------------------
*/

const normalizeStatus = (
  status
) => {
  if (!status) {
    return 'Baru';
  }

  const statusMap = {
    menunggu_verifikasi:
      'Menunggu',
    diproses:
      'Diproses',
    disetujui:
      'Disetujui',
    ditolak:
      'Ditolak',
    terkirim:
      'Terkirim',
    diteruskan:
      'Diteruskan',
    selesai:
      'Selesai',
  };

  return (
    statusMap[
      status
    ] ||
    status
  );
};

/*
|--------------------------------------------------------------------------
| STATUS STYLE
|--------------------------------------------------------------------------
*/

const getStatusClass = (
  status
) => {
  switch (
    status
  ) {
    case 'menunggu_verifikasi':
      return 'bg-orange-100 text-orange-700';

    case 'diproses':
      return 'bg-blue-100 text-blue-700';

    case 'disetujui':
      return 'bg-green-100 text-green-700';

    case 'ditolak':
      return 'bg-red-100 text-red-700';

    case 'terkirim':
      return 'bg-sky-100 text-sky-700';

    case 'diteruskan':
      return 'bg-purple-100 text-purple-700';

    case 'selesai':
      return 'bg-green-100 text-green-700';

    default:
      return 'bg-surface-container text-on-surface-variant';
  }
};

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

const AdminDashboard = () => {
  const navigate =
    useNavigate();

  // ============================================================
  // STATE DASHBOARD
  // ============================================================

  const [
    dashboard,
    setDashboard,
  ] = useState(null);

  // ============================================================
  // STATE PENGAJUAN TERBARU
  // ============================================================

  const [
    recentSubmissions,
    setRecentSubmissions,
  ] = useState([]);

  // ============================================================
  // STATE LOADING
  // ============================================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadingRecent,
    setLoadingRecent,
  ] = useState(true);

  // ============================================================
  // STATE ERROR
  // ============================================================

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
              '/admin/dashboard'
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
            'Gagal mengambil dashboard admin:',
            err
          );

          if (
            !cancelled
          ) {
            setDashboard(
              {}
            );

            setError(
              err.response?.data
                ?.message ||
                err.message ||
                'Gagal mengambil data dashboard admin.'
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
  // FETCH PENGAJUAN TERBARU
  // ============================================================

  useEffect(() => {
    let cancelled =
      false;

    const fetchRecentSubmissions =
      async () => {
        try {
          setLoadingRecent(
            true
          );

          const [
            ktpResponse,
            skuResponse,
            pengaduanResponse,
            umkmResponse,
          ] =
            await Promise.allSettled(
              [
                api.get(
                  '/admin/pengajuan/ktp?page=1'
                ),

                api.get(
                  '/admin/pengajuan/sku?page=1&per_page=10'
                ),

                api.get(
                  '/admin/pengaduan?page=1'
                ),

                api.get(
                  '/admin/pengajuan/umkm?page=1'
                ),
              ]
            );

          if (
            cancelled
          ) {
            return;
          }

          const ktpData =
            ktpResponse.status ===
            'fulfilled'
              ? extractArray(
                  ktpResponse.value
                )
              : [];

          const skuData =
            skuResponse.status ===
            'fulfilled'
              ? extractArray(
                  skuResponse.value
                )
              : [];

          const pengaduanData =
            pengaduanResponse.status ===
            'fulfilled'
              ? extractArray(
                  pengaduanResponse.value
                )
              : [];

          const umkmData =
            umkmResponse.status ===
            'fulfilled'
              ? extractArray(
                  umkmResponse.value
                )
              : [];

          // --------------------------------------------------------
          // KTP
          // --------------------------------------------------------

          const normalizedKtp =
            ktpData.map(
              (
                item
              ) => ({
                id:
                  `ktp-${item.id}`,

                originalId:
                  item.id,

                jenis:
                  'Pengajuan KTP',

                pemohon:
                  item.nama ||
                  item.nama_pemohon ||
                  item.user?.name ||
                  item.user?.nama ||
                  'Pemohon',

                tanggal:
                  getItemDate(
                    item
                  ),

                status:
                  item.status ||
                  'menunggu_verifikasi',

                route:
                  '/admin/pengajuan/ktp',
              })
            );

          // --------------------------------------------------------
          // SKU
          // --------------------------------------------------------

          const normalizedSku =
            skuData.map(
              (
                item
              ) => ({
                id:
                  `sku-${item.id}`,

                originalId:
                  item.id,

                jenis:
                  'Pengajuan SKU',

                pemohon:
                  item.nama ||
                  item.nama_pemohon ||
                  item.user?.name ||
                  item.user?.nama ||
                  'Pemohon',

                tanggal:
                  getItemDate(
                    item
                  ),

                status:
                  item.status ||
                  'menunggu_verifikasi',

                route:
                  '/admin/pengajuan/sku',
              })
            );

          // --------------------------------------------------------
          // PENGADUAN
          // --------------------------------------------------------

          const normalizedPengaduan =
            pengaduanData.map(
              (
                item
              ) => ({
                id:
                  `pengaduan-${item.id}`,

                originalId:
                  item.id,

                jenis:
                  'Pengaduan',

                pemohon:
                  item.nama ||
                  item.nama_pelapor ||
                  item.user?.name ||
                  item.user?.nama ||
                  'Masyarakat',

                tanggal:
                  getItemDate(
                    item
                  ),

                status:
                  item.status ||
                  'terkirim',

                route:
                  '/admin/pengaduan',
              })
            );

          // --------------------------------------------------------
          // UMKM
          // --------------------------------------------------------

          const normalizedUmkm =
            umkmData.map(
              (
                item
              ) => ({
                id:
                  `umkm-${item.id}`,

                originalId:
                  item.id,

                jenis:
                  'Pengajuan UMKM',

                pemohon:
                  item.nama_pemilik ||
                  item.nama ||
                  item.user?.name ||
                  item.user?.nama ||
                  'Pemohon',

                tanggal:
                  getItemDate(
                    item
                  ),

                status:
                  item.status ||
                  'menunggu_verifikasi',

                route:
                  '/admin/umkm',
              })
            );

          // --------------------------------------------------------
          // GABUNGKAN SEMUA
          // --------------------------------------------------------

          const combined =
            [
              ...normalizedKtp,
              ...normalizedSku,
              ...normalizedPengaduan,
              ...normalizedUmkm,
            ];

          // --------------------------------------------------------
          // SORT TERBARU
          // --------------------------------------------------------

          combined.sort(
            (
              a,
              b
            ) => {
              const dateA =
                new Date(
                  a.tanggal ||
                    0
                ).getTime();

              const dateB =
                new Date(
                  b.tanggal ||
                    0
                ).getTime();

              return (
                dateB -
                dateA
              );
            }
          );

          // --------------------------------------------------------
          // AMBIL 5 TERBARU
          // --------------------------------------------------------

          setRecentSubmissions(
            combined.slice(
              0,
              5
            )
          );
        } catch (
          err
        ) {
          console.error(
            'Gagal mengambil pengajuan terbaru:',
            err
          );

          if (
            !cancelled
          ) {
            setRecentSubmissions(
              []
            );
          }
        } finally {
          if (
            !cancelled
          ) {
            setLoadingRecent(
              false
            );
          }
        }
      };

    fetchRecentSubmissions();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // DATA DASHBOARD
  // ============================================================

  const users =
    dashboard?.users ||
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
  // TOTAL PENGAJUAN
  // ============================================================

  const totalPengajuan =
    useMemo(
      () => {
        if (
          dashboard?.total_pengajuan !==
          undefined
        ) {
          return Number(
            dashboard.total_pengajuan
          );
        }

        return (
          Number(
            ktp.total ??
              0
          ) +
          Number(
            sku.total ??
              0
          ) +
          Number(
            umkm.total ??
              0
          ) +
          Number(
            pengaduan.total ??
              0
          )
        );
      },
      [
        dashboard?.total_pengajuan,
        ktp.total,
        sku.total,
        umkm.total,
        pengaduan.total,
      ]
    );

  // ============================================================
  // STATISTICS
  // ============================================================

  const stats = useMemo(
    () => [
      {
        title:
          'Total Pengajuan',
        value:
          String(
            totalPengajuan
          ),
        description:
          'Semua jenis',
        icon:
          'description',
        onClick:
          () =>
            navigate(
              '/admin/pengajuan/ktp'
            ),
      },

      {
        title:
          'Pengajuan KTP',
        value:
          String(
            ktp.total ??
              0
          ),
        description:
          'Semua pengajuan',
        icon:
          'badge',
        iconBg:
          'bg-blue-100',
        iconColor:
          'text-blue-600',
        onClick:
          () =>
            navigate(
              '/admin/pengajuan/ktp'
            ),
      },

      {
        title:
          'Pengajuan SKU',
        value:
          String(
            sku.total ??
              0
          ),
        description:
          'Semua pengajuan',
        icon:
          'storefront',
        iconBg:
          'bg-orange-100',
        iconColor:
          'text-orange-600',
        onClick:
          () =>
            navigate(
              '/admin/pengajuan/sku'
            ),
      },

      {
        title:
          'Pengaduan',
        value:
          String(
            pengaduan.total ??
              0
          ),
        description:
          'Semua pengaduan',
        icon:
          'report',
        iconBg:
          'bg-red-100',
        iconColor:
          'text-red-600',
        onClick:
          () =>
            navigate(
              '/admin/pengaduan'
            ),
      },

      {
        title:
          'UMKM Menunggu',
        value:
          String(
            umkm.menunggu_verifikasi ??
              0
          ),
        description:
          'Persetujuan',
        icon:
          'storefront',
        iconBg:
          'bg-green-100',
        iconColor:
          'text-green-600',
        onClick:
          () =>
            navigate(
              '/admin/umkm'
            ),
      },
    ],
    [
      totalPengajuan,
      ktp.total,
      sku.total,
      pengaduan.total,
      umkm.menunggu_verifikasi,
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
            Dashboard Admin
          </h1>

          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">

            <span className="material-symbols-outlined text-sm">
              admin_panel_settings
            </span>

            Admin

          </span>

        </div>

        <p className="mt-2 font-body-md text-on-surface-variant">
          Kelola konten desa, pantau pengajuan,
          dan validasi data masyarakat.
        </p>

      </motion.section>

      {/* =======================================================
          STATISTICS
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
              onClick={
                stat.onClick
              }
              className="cursor-pointer transition-transform duration-200 hover:-translate-y-1"
            >
              <StatCard
                {...stat}
              />
            </motion.div>
          )
        )}

      </section>

      {/* =======================================================
          RECENT SUBMISSIONS
      ======================================================== */}

      <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="font-headline-md text-lg text-on-surface">
              Pengajuan Terbaru
            </h2>

            <p className="mt-1 text-sm text-on-surface-variant">
              Data terbaru dari pengajuan masyarakat.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                '/admin/pengajuan/ktp'
              )
            }
            className="w-fit text-primary font-label-md hover:underline"
          >
            Lihat semua
          </button>

        </div>

        {/* =====================================================
            LOADING RECENT
        ====================================================== */}

        {loadingRecent ? (
          <div className="space-y-3">

            {Array.from({
              length: 5,
            }).map(
              (
                _,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="h-16 w-full animate-pulse rounded-xl bg-surface-container-low"
                />
              )
            )}

          </div>
        ) : recentSubmissions.length ===
          0 ? (

          <div className="rounded-xl bg-surface-container-low px-5 py-10 text-center">

            <span className="material-symbols-outlined text-4xl text-on-surface-variant">
              inbox
            </span>

            <p className="mt-3 font-semibold text-on-surface">
              Belum ada pengajuan terbaru
            </p>

            <p className="mt-1 text-sm text-on-surface-variant">
              Data pengajuan masyarakat akan muncul di sini.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-outline-variant/20">

            {recentSubmissions.map(
              (
                item
              ) => (
                <button
                  key={
                    item.id
                  }
                  type="button"
                  onClick={() =>
                    navigate(
                      item.route
                    )
                  }
                  className="group flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:bg-primary/5"
                >

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="font-label-md font-semibold text-on-surface">
                        {
                          item.jenis
                        }
                      </span>

                      <span className="material-symbols-outlined text-base text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100">
                        arrow_forward
                      </span>

                    </div>

                    <p className="mt-1 wrap-break-word font-label-sm tracking-normal text-on-surface-variant">

                      {
                        item.pemohon
                      }

                      {' • '}

                      {
                        formatTanggal(
                          item.tanggal
                        )
                      }

                    </p>

                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 font-label-sm tracking-normal ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {
                      normalizeStatus(
                        item.status
                      )
                    }
                  </span>

                </button>
              )
            )}

          </div>

        )}

      </section>

      {/* =======================================================
          QUICK ACTIONS
      ======================================================== */}

      <section className="mt-6">

        <div className="mb-4">

          <h2 className="font-headline-md text-xl text-on-background">
            Aksi Cepat
          </h2>

          <p className="mt-1 text-sm text-on-surface-variant">
            Akses langsung ke halaman administrasi.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* ===================================================
              TAMBAH BERITA
          ==================================================== */}

          <QuickAction
            icon="post_add"
            title="Tambah Berita"
            description="Posting berita terbaru"
            onClick={() =>
              navigate(
                '/admin/berita'
              )
            }
            iconBg="bg-primary/10"
            iconColor="text-primary"
          />

          {/* ===================================================
              VERIFIKASI KTP
          ==================================================== */}

          <QuickAction
            icon="badge"
            title="Verifikasi KTP"
            description="Proses pengajuan KTP"
            onClick={() =>
              navigate(
                '/admin/pengajuan/ktp'
              )
            }
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          {/* ===================================================
              APPROVAL UMKM
          ==================================================== */}

          <QuickAction
            icon="storefront"
            title="Approval UMKM"
            description="Setujui UMKM baru"
            onClick={() =>
              navigate(
                '/admin/umkm'
              )
            }
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />

        </div>

      </section>

    </div>
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
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
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

export default AdminDashboard;
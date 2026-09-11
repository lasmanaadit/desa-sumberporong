import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const STATUS_LABELS = {
  menunggu_verifikasi: 'Menunggu Verifikasi',
  diproses: 'Diproses',
  disetujui: 'Disetujui',
  ditolak: 'Ditolak',
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
    icon: 'sync',
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

const TYPE_LABELS = {
  ktp: 'Pengajuan KTP',
  sku: 'Surat Keterangan Usaha',
};

const FILTERS = [
  {
    value: 'semua',
    label: 'Semua',
  },

  {
    value: 'ktp',
    label: 'KTP',
  },

  {
    value: 'sku',
    label: 'SKU',
  },
];

const STATUS_FILTERS = [
  {
    value: 'semua',
    label: 'Semua',
  },

  {
    value: 'menunggu_verifikasi',
    label: 'Menunggu',
  },

  {
    value: 'diproses',
    label: 'Diproses',
  },

  {
    value: 'disetujui',
    label: 'Disetujui',
  },

  {
    value: 'ditolak',
    label: 'Ditolak',
  },
];

const PAGE_SIZE = 10;

const RiwayatPengajuan = () => {
  const navigate = useNavigate();

  const [
    pengajuanData,
    setPengajuanData,
  ] = useState([]);

  const [
    serviceFilter,
    setServiceFilter,
  ] = useState('semua');

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('semua');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    detailLoading,
    setDetailLoading,
  ] = useState(false);

  const [
    documentLoading,
    setDocumentLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const [
    success,
    setSuccess,
  ] = useState('');

  const [
    selectedPengajuan,
    setSelectedPengajuan,
  ] = useState(null);

  const [
    selectedDocument,
    setSelectedDocument,
  ] = useState(null);

  const [
    documentPreviewUrl,
    setDocumentPreviewUrl,
  ] = useState('');

  const [
    documentPreviewType,
    setDocumentPreviewType,
  ] = useState('');

  const [
    documentPreviewName,
    setDocumentPreviewName,
  ] = useState('');

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | Fetch Semua Pengajuan
  |--------------------------------------------------------------------------
  */

  const fetchAllPages = async (
    endpoint
  ) => {
    const allData = [];

    let page = 1;
    let lastPage = 1;

    do {
      const response =
        await api.get(
          endpoint,
          {
            params: {
              page,
            },
          }
        );

      const responseData =
        response.data?.data;

      let data = [];
      let metaLastPage = 1;

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

        metaLastPage =
          responseData?.last_page ||
          1;
      }

      allData.push(
        ...data
      );

      lastPage =
        metaLastPage;

      page += 1;
    } while (
      page <= lastPage
    );

    return allData;
  };

  const normalizeKtp = (
    item
  ) => ({
    ...item,

    service_type: 'ktp',

    service_label:
      TYPE_LABELS.ktp,
  });

  const normalizeSku = (
    item
  ) => ({
    ...item,

    service_type: 'sku',

    service_label:
      TYPE_LABELS.sku,
  });

  const fetchPengajuan = async () => {
    setLoading(true);
    setError('');

    try {
      const [
        ktpData,
        skuData,
      ] = await Promise.all([
        fetchAllPages(
          '/pengajuan/ktp'
        ),

        fetchAllPages(
          '/pengajuan/sku'
        ),
      ]);

      const combined = [
        ...ktpData.map(
          normalizeKtp
        ),

        ...skuData.map(
          normalizeSku
        ),
      ];

      combined.sort(
        (a, b) =>
          new Date(
            b.created_at || 0
          ).getTime() -
          new Date(
            a.created_at || 0
          ).getTime()
      );

      setPengajuanData(
        combined
      );

      setCurrentPage(1);
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
        'Gagal mengambil riwayat pengajuan.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengajuan();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Cleanup Preview
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (
        documentPreviewUrl
      ) {
        window.URL.revokeObjectURL(
          documentPreviewUrl
        );
      }
    };
  }, [
    documentPreviewUrl,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Filter
  |--------------------------------------------------------------------------
  */

  const filteredData =
    useMemo(() => {
      return pengajuanData.filter(
        (item) => {
          const matchesService =
            serviceFilter ===
              'semua' ||
            item.service_type ===
              serviceFilter;

          const matchesStatus =
            statusFilter ===
              'semua' ||
            item.status ===
              statusFilter;

          return (
            matchesService &&
            matchesStatus
          );
        }
      );
    }, [
      pengajuanData,
      serviceFilter,
      statusFilter,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length /
        PAGE_SIZE
    )
  );

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const paginatedData =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        PAGE_SIZE;

      return filteredData.slice(
        start,
        start + PAGE_SIZE
      );
    }, [
      filteredData,
      currentPage,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Detail
  |--------------------------------------------------------------------------
  */

  const handleViewDetail = async (
    item
  ) => {
    if (!item?.id) {
      return;
    }

    setDetailLoading(true);
    setError('');
    setSuccess('');
    setSelectedPengajuan(null);

    try {
      const endpoint =
        item.service_type ===
        'sku'
          ? `/pengajuan/sku/${item.id}`
          : `/pengajuan/ktp/${item.id}`;

      const response =
        await api.get(
          endpoint
        );

      const data =
        response.data?.data ||
        null;

      if (data) {
        setSelectedPengajuan({
          ...data,

          service_type:
            item.service_type,

          service_label:
            item.service_label,
        });
      }
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
        'Detail pengajuan gagal diambil.'
      );
    } finally {
      setDetailLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Preview Dokumen
  |--------------------------------------------------------------------------
  */

  const handleOpenDocument =
    async (
      document
    ) => {
      if (!document?.url) {
        setError(
          'URL dokumen tidak tersedia.'
        );

        return;
      }

      setDocumentLoading(
        true
      );

      setError('');
      setSuccess('');

      if (
        documentPreviewUrl
      ) {
        window.URL.revokeObjectURL(
          documentPreviewUrl
        );
      }

      setSelectedDocument(
        document
      );

      setDocumentPreviewUrl('');
      setDocumentPreviewType('');

      setDocumentPreviewName(
        document.nama_file ||
        'Dokumen'
      );

      try {
        const response =
          await api.get(
            document.url,
            {
              responseType:
                'blob',
            }
          );

        const contentType =
          response.headers?.[
            'content-type'
          ] ||
          response.data?.type ||
          'application/octet-stream';

        if (
          contentType.includes(
            'application/json'
          )
        ) {
          const text =
            await response.data.text();

          let message =
            'Dokumen gagal dibuka.';

          try {
            const json =
              JSON.parse(text);

            message =
              json?.message ||
              message;
          } catch {
            // Response bukan JSON valid.
          }

          throw new Error(
            message
          );
        }

        const blob =
          new Blob(
            [
              response.data,
            ],
            {
              type: contentType,
            }
          );

        const blobUrl =
          window.URL.createObjectURL(
            blob
          );

        setDocumentPreviewUrl(
          blobUrl
        );

        setDocumentPreviewType(
          contentType
        );
      } catch (err) {
        setSelectedDocument(null);
        setDocumentPreviewUrl('');
        setDocumentPreviewType('');
        setDocumentPreviewName('');

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          'Dokumen gagal dibuka.'
        );
      } finally {
        setDocumentLoading(false);
      }
    };

  const handleCloseDocumentPreview =
    () => {
      if (
        documentPreviewUrl
      ) {
        window.URL.revokeObjectURL(
          documentPreviewUrl
        );
      }

      setSelectedDocument(null);
      setDocumentPreviewUrl('');
      setDocumentPreviewType('');
      setDocumentPreviewName('');
      setDocumentLoading(false);
    };

  /*
  |--------------------------------------------------------------------------
  | Download
  |--------------------------------------------------------------------------
  */

  const handleDownloadDocument =
    () => {
      if (
        !documentPreviewUrl ||
        !selectedDocument
      ) {
        return;
      }

      const anchor =
        window.document.createElement(
          'a'
        );

      anchor.href =
        documentPreviewUrl;

      anchor.download =
        selectedDocument.nama_file ||
        'dokumen';

      window.document.body.appendChild(
        anchor
      );

      anchor.click();

      window.document.body.removeChild(
        anchor
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

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

  const getJenisKtpLabel = (
    jenis
  ) => {
    const labels = {
      baru: 'KTP Baru',
      perpanjangan:
        'Perpanjangan KTP',
      hilang: 'KTP Hilang',
    };

    return (
      labels[jenis] ||
      jenis ||
      '-'
    );
  };

  const getServiceLabel = (
    item
  ) => {
    if (
      item?.service_type ===
      'sku'
    ) {
      return TYPE_LABELS.sku;
    }

    return TYPE_LABELS.ktp;
  };

  const formatDate = (
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

    return date.toLocaleString(
      'id-ID',
      {
        dateStyle:
          'medium',
        timeStyle:
          'short',
      }
    );
  };

  const formatDateOnly = (
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
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    );
  };

  const getGenderLabel = (
    value
  ) => {
    if (value === 'L') {
      return 'Laki-laki';
    }

    if (value === 'P') {
      return 'Perempuan';
    }

    return value || '-';
  };

  const getDocumentLabel = (
    jenis
  ) => {
    const labels = {
      kk:
        'Kartu Keluarga',

      akta_kelahiran:
        'Akta Kelahiran',

      ijazah:
        'Ijazah',

      ktp:
        'Kartu Tanda Penduduk',

      ktp_lama:
        'KTP Lama',

      pengantar_rt_rw:
        'Pengantar RT/RW',

      surat_kehilangan_polsek:
        'Surat Kehilangan Polsek',

      foto_tempat_usaha:
        'Foto Tempat Usaha',
    };

    return (
      labels[jenis] ||
      jenis ||
      '-'
    );
  };

  const getItemTitle = (
    item
  ) => {
    if (
      item.service_type ===
      'sku'
    ) {
      return (
        item.nama_usaha ||
        'Surat Keterangan Usaha'
      );
    }

    return getJenisKtpLabel(
      item.jenis_permohonan
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Expired Helper
  |--------------------------------------------------------------------------
  */

  const checkExpired = (
    item
  ) => {
    if (
      item?.status !==
      'disetujui'
    ) {
      return false;
    }

    if (
      item?.is_expired ===
      true
    ) {
      return true;
    }

    if (
      item?.eligibility ===
      'expired'
    ) {
      return true;
    }

    if (
      item?.expired_at
    ) {
      const expiredTime =
        new Date(
          item.expired_at
        ).getTime();

      if (
        !Number.isNaN(
          expiredTime
        )
      ) {
        return (
          expiredTime <
          Date.now()
        );
      }
    }

    return false;
  };

  const isApproved =
    selectedPengajuan
      ?.status ===
    'disetujui';

  const isExpired =
    checkExpired(
      selectedPengajuan
    );

  const totalKtp =
    pengajuanData.filter(
      (item) =>
        item.service_type ===
        'ktp'
    ).length;

  const totalSku =
    pengajuanData.filter(
      (item) =>
        item.service_type ===
        'sku'
    ).length;

  const totalDiproses =
    pengajuanData.filter(
      (item) =>
        item.status ===
          'menunggu_verifikasi' ||
        item.status ===
          'diproses'
    ).length;

  const totalDisetujui =
    pengajuanData.filter(
      (item) =>
        item.status ===
        'disetujui'
    ).length;

  const handleFilterChange = (
    value
  ) => {
    setServiceFilter(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange =
    (
      value
    ) => {
      setStatusFilter(value);
      setCurrentPage(1);
    };

  const handlePageChange = (
    page
  ) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    setCurrentPage(page);
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-background flex">

      <div className="flex-1 min-w-0">

        <main className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
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
              duration: 0.45,
            }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="font-headline-lg text-on-background">
                  Riwayat Pengajuan
                </h1>

                <p className="font-body-md text-on-surface-variant mt-2">
                  Lihat status dan riwayat seluruh pengajuan administrasi Anda.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/dashboard/pengajuan/ktp'
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-label-md font-semibold hover:bg-primary-container transition-colors"
                >
                  <span className="material-symbols-outlined">
                    badge
                  </span>

                  Pengajuan KTP
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/dashboard/pengajuan/sku'
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-primary/30 text-primary font-label-md font-semibold hover:bg-primary/5 transition-colors"
                >
                  <span className="material-symbols-outlined">
                    storefront
                  </span>

                  Pengajuan SKU
                </button>
              </div>
            </div>
          </motion.section>

          {/* Error */}
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined shrink-0">
                  error
                </span>

                <span className="wrap-break-word">
                  {error}
                </span>
              </div>
            </motion.div>
          )}

          {/* Success */}
          {success && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined">
                  check_circle
                </span>

                <span>
                  {success}
                </span>
              </div>
            </motion.div>
          )}

          {/* Summary */}
          {!loading &&
            pengajuanData.length >
              0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <SummaryCard
                  icon="description"
                  label="Total Pengajuan"
                  value={
                    pengajuanData.length
                  }
                />

                <SummaryCard
                  icon="badge"
                  label="Pengajuan KTP"
                  value={totalKtp}
                />

                <SummaryCard
                  icon="storefront"
                  label="Pengajuan SKU"
                  value={totalSku}
                />

                <SummaryCard
                  icon="pending_actions"
                  label="Sedang Diproses"
                  value={
                    totalDiproses
                  }
                />
              </div>
            )}

          {/* Filter */}
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
              duration: 0.45,
              delay: 0.1,
            }}
            className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 mb-6"
          >
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-on-surface text-lg">
                  Daftar Pengajuan
                </h2>

                <p className="font-label-sm text-on-surface-variant mt-1">
                  {
                    filteredData.length
                  }{' '}
                  pengajuan ditampilkan
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {FILTERS.map(
                  (item) => (
                    <button
                      key={
                        item.value
                      }
                      type="button"
                      onClick={() =>
                        handleFilterChange(
                          item.value
                        )
                      }
                      className={`px-4 py-2 rounded-xl font-label-md transition-all ${
                        serviceFilter ===
                        item.value
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                )}
              </div>

              <select
                value={
                  statusFilter
                }
                onChange={(
                  event
                ) =>
                  handleStatusFilterChange(
                    event.target.value
                  )
                }
                className="h-11 px-4 rounded-xl bg-surface border border-outline-variant/40 text-sm outline-none focus:border-primary"
              >
                {STATUS_FILTERS.map(
                  (item) => (
                    <option
                      key={
                        item.value
                      }
                      value={
                        item.value
                      }
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </div>
          </motion.section>

          {/* Table */}
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
              duration: 0.5,
              delay: 0.15,
            }}
            className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden"
          >
            {/* Desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-900px">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20">
                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                      ID
                    </th>

                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                      Jenis Pengajuan
                    </th>

                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                      Detail
                    </th>

                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                      Tanggal
                    </th>

                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                      Status
                    </th>

                    <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    Array.from({
                      length: 5,
                    }).map(
                      (
                        _,
                        index
                      ) => (
                        <tr
                          key={
                            index
                          }
                          className="border-b border-outline-variant/10"
                        >
                          <td
                            colSpan="6"
                            className="px-6 py-5"
                          >
                            <div className="h-5 bg-surface-container-low rounded animate-pulse" />
                          </td>
                        </tr>
                      )
                    )
                  ) : paginatedData.length ===
                    0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-16 text-center"
                      >
                        <EmptyState />
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map(
                      (
                        item,
                        index
                      ) => {
                        const status =
                          getStatusStyle(
                            item.status
                          );

                        const rowExpired =
                          checkExpired(
                            item
                          );

                        return (
                          <motion.tr
                            key={`${item.service_type}-${item.id}`}
                            initial={{
                              opacity: 0,
                              y: 8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              duration:
                                0.3,
                              delay:
                                index *
                                0.04,
                            }}
                            className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors"
                          >
                            <td className="px-6 py-5">
                              <span className="font-label-md font-semibold text-primary">
                                #
                                {
                                  item.id
                                }
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                  <span className="material-symbols-outlined">
                                    {
                                      item.service_type ===
                                      'sku'
                                        ? 'storefront'
                                        : 'badge'
                                    }
                                  </span>
                                </div>

                                <div>
                                  <p className="font-label-md font-semibold text-on-surface">
                                    {getServiceLabel(
                                      item
                                    )}
                                  </p>

                                  <p className="font-label-sm text-on-surface-variant mt-1">
                                    {
                                      item.service_type ===
                                      'sku'
                                        ? 'Surat Keterangan Usaha'
                                        : 'Administrasi KTP'
                                    }
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div>
                                <p className="font-label-md font-semibold text-on-surface">
                                  {getItemTitle(
                                    item
                                  )}
                                </p>

                                {item.service_type ===
                                  'sku' &&
                                  item.nama_usaha && (
                                    <p className="font-label-sm text-on-surface-variant mt-1">
                                      {
                                        item.nama_usaha
                                      }
                                    </p>
                                  )}

                                {item.no_antrian && (
                                  <p className="text-xs text-primary font-semibold mt-1 break-all">
                                    Antrean:{' '}
                                    {
                                      item.no_antrian
                                    }
                                  </p>
                                )}

                                {item.visit_date && (
                                  <p className="text-xs text-on-surface-variant mt-1">
                                    Kunjungan:{' '}
                                    {
                                      item.visit_date_label ||
                                      formatDateOnly(
                                        item.visit_date
                                      )
                                    }
                                  </p>
                                )}

                                {rowExpired &&
                                  item.expired_date && (
                                    <p className="text-xs text-red-600 font-semibold mt-1">
                                      Berlaku sampai:{' '}
                                      {
                                        item.expired_date
                                      }
                                    </p>
                                  )}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2 text-on-surface-variant">
                                <span className="material-symbols-outlined">
                                  calendar_today
                                </span>

                                <span className="font-label-md">
                                  {formatDate(
                                    item.created_at
                                  )}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex flex-col items-start gap-2">
                                <span
                                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${status.bg} ${status.text} font-label-sm`}
                                >
                                  <span className="material-symbols-outlined">
                                    {
                                      status.icon
                                    }
                                  </span>

                                  {getStatusLabel(
                                    item.status
                                  )}
                                </span>

                                {rowExpired && (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                                    <span className="material-symbols-outlined text-sm">
                                      event_busy
                                    </span>

                                    Kedaluwarsa
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleViewDetail(
                                      item
                                    )
                                  }
                                  className="px-4 py-2 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all font-label-md"
                                >
                                  Detail
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      }
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="lg:hidden p-4 space-y-4">
              {loading ? (
                Array.from({
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
                      className="border border-outline-variant/20 rounded-xl p-5"
                    >
                      <div className="h-5 bg-surface-container-low rounded animate-pulse" />

                      <div className="h-4 bg-surface-container-low rounded animate-pulse mt-3" />

                      <div className="h-10 bg-surface-container-low rounded animate-pulse mt-4" />
                    </div>
                  )
                )
              ) : paginatedData.length ===
                0 ? (
                <EmptyState />
              ) : (
                paginatedData.map(
                  (
                    item,
                    index
                  ) => {
                    const status =
                      getStatusStyle(
                        item.status
                      );

                    const rowExpired =
                      checkExpired(
                        item
                      );

                    return (
                      <motion.div
                        key={`${item.service_type}-${item.id}`}
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration:
                            0.3,
                          delay:
                            index *
                            0.04,
                        }}
                        className="border border-outline-variant/20 rounded-xl p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-label-sm text-primary">
                              {getServiceLabel(
                                item
                              )}
                            </p>

                            <h3 className="font-label-md font-semibold text-on-surface mt-1 wrap-break-word">
                              {getItemTitle(
                                item
                              )}
                            </h3>

                            {item.no_antrian && (
                              <p className="text-xs text-primary font-semibold mt-1 break-all">
                                Antrean:{' '}
                                {
                                  item.no_antrian
                                }
                              </p>
                            )}

                            {item.visit_date && (
                              <p className="text-xs text-on-surface-variant mt-1">
                                Kunjungan:{' '}
                                {
                                  item.visit_date_label ||
                                  formatDateOnly(
                                    item.visit_date
                                  )
                                }
                              </p>
                            )}
                          </div>

                          <span
                            className={`px-3 py-1.5 rounded-full ${status.bg} ${status.text} font-label-sm whitespace-nowrap`}
                          >
                            {getStatusLabel(
                              item.status
                            )}
                          </span>
                        </div>

                        {rowExpired && (
                          <div className="mt-3">
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
                              <span className="material-symbols-outlined">
                                event_busy
                              </span>

                              Pengajuan kedaluwarsa
                            </div>

                            {item.expired_date && (
                              <p className="text-xs text-red-600 mt-1">
                                Berlaku sampai:{' '}
                                {
                                  item.expired_date
                                }
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-4 text-on-surface-variant">
                          <span className="material-symbols-outlined">
                            calendar_today
                          </span>

                          <span className="font-label-sm">
                            {formatDate(
                              item.created_at
                            )}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleViewDetail(
                              item
                            )
                          }
                          className="w-full mt-4 py-2.5 rounded-xl border border-outline-variant/30 font-label-md text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all"
                        >
                          Lihat Detail
                        </button>
                      </motion.div>
                    );
                  }
                )
              )}
            </div>

            {/* Pagination */}
            {!loading &&
              totalPages > 1 && (
                <div className="px-6 py-4 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="font-label-sm text-on-surface-variant">
                    Halaman{' '}
                    {
                      currentPage
                    }{' '}
                    dari{' '}
                    {totalPages}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={
                        currentPage ===
                        1
                      }
                      onClick={() =>
                        handlePageChange(
                          currentPage -
                            1
                        )
                      }
                      className="px-4 py-2 rounded-lg border border-outline-variant/40 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sebelumnya
                    </button>

                    <button
                      type="button"
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      onClick={() =>
                        handlePageChange(
                          currentPage +
                            1
                        )
                      }
                      className="px-4 py-2 rounded-lg border border-outline-variant/40 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
              )}
          </motion.section>
        </main>
      </div>

      {/* ============================================================= */}
      {/* DETAIL MODAL                                                  */}
      {/* ============================================================= */}

      {(selectedPengajuan ||
        detailLoading) && (
        <div
          className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            if (
              !detailLoading &&
              !documentLoading
            ) {
              setSelectedPengajuan(
                null
              );
            }
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="w-full max-w-5xl bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between">
              <div>
                <p className="font-label-sm text-primary">
                  {selectedPengajuan
                    ? `#${selectedPengajuan.id}`
                    : 'Detail'}
                </p>

                <h2 className="font-headline-md text-xl text-on-surface mt-1">
                  {selectedPengajuan
                    ? selectedPengajuan.service_type ===
                      'sku'
                      ? 'Detail Surat Keterangan Usaha'
                      : 'Detail Pengajuan KTP'
                    : 'Detail Pengajuan'}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPengajuan(
                    null
                  )
                }
                disabled={
                  detailLoading ||
                  documentLoading
                }
                className="w-9 h-9 rounded-full hover:bg-primary/10 text-on-surface-variant hover:text-primary flex items-center justify-center disabled:opacity-50"
                aria-label="Tutup"
              >
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>
            </div>

            {detailLoading ? (
              <div className="p-10 text-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                  progress_activity
                </span>

                <p className="mt-3">
                  Memuat detail pengajuan...
                </p>
              </div>
            ) : (
              selectedPengajuan && (
                <>
                  <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
                    {/* STATUS */}
                    <section
                      className={`rounded-2xl p-5 border ${
                        isExpired
                          ? 'bg-red-50 border-red-200'
                          : isApproved
                            ? 'bg-green-50 border-green-200'
                            : 'bg-primary/5 border-primary/10'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="text-xs text-on-surface-variant">
                            Status saat ini
                          </p>

                          {(() => {
                            const status =
                              getStatusStyle(
                                selectedPengajuan.status
                              );

                            return (
                              <span
                                className={`mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-full ${status.bg} ${status.text} font-label-sm`}
                              >
                                <span className="material-symbols-outlined">
                                  {
                                    status.icon
                                  }
                                </span>

                                {getStatusLabel(
                                  selectedPengajuan.status
                                )}
                              </span>
                            );
                          })()}
                        </div>

                        <div className="sm:text-right">
                          <p className="text-xs text-on-surface-variant">
                            Tanggal Pengajuan
                          </p>

                          <p className="font-label-md font-semibold text-on-surface mt-1">
                            {formatDate(
                              selectedPengajuan.created_at
                            )}
                          </p>
                        </div>
                      </div>

                      {isExpired && (
                        <div className="mt-4 pt-4 border-t border-red-200">
                          <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-600">
                              event_busy
                            </span>

                            <div>
                              <p className="font-label-md font-semibold text-red-700">
                                Pengajuan kedaluwarsa
                              </p>

                              <p className="text-sm text-red-700/80 mt-1">
                                Masa berlaku{' '}
                                {selectedPengajuan.service_type ===
                                'sku'
                                  ? 'pengajuan SKU'
                                  : 'pengajuan KTP'}{' '}
                                telah berakhir.
                              </p>

                              {selectedPengajuan.expired_date && (
                                <p className="text-xs text-red-700/80 mt-1">
                                  Berlaku sampai:{' '}
                                  {
                                    selectedPengajuan.expired_date
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </section>

                    {/* ANTREAN */}
                    {isApproved &&
                      selectedPengajuan.no_antrian && (
                        <section
                          className={`rounded-2xl border p-6 ${
                            isExpired
                              ? 'bg-slate-50 border-slate-200'
                              : 'bg-green-50 border-green-200'
                          }`}
                        >
                          <div className="text-center">
                            <p className="text-xs font-semibold tracking-[0.18em] text-on-surface-variant uppercase">
                              Nomor Antrean
                            </p>

                            <p
                              className={`mt-3 text-4xl sm:text-5xl font-extrabold tracking-wider font-mono break-all ${
                                isExpired
                                  ? 'text-slate-500'
                                  : 'text-green-700'
                              }`}
                            >
                              {
                                selectedPengajuan.no_antrian
                              }
                            </p>

                            <p className="text-sm text-on-surface-variant mt-2">
                              Gunakan nomor ini saat pelayanan di kantor desa.
                            </p>
                          </div>

                          {(
                            selectedPengajuan.visit_date ||
                            selectedPengajuan.service_hours ||
                            selectedPengajuan.expired_at
                          ) && (
                            <div className="mt-6 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedPengajuan.visit_date && (
                                  <div
                                    className={`rounded-xl bg-white/70 border px-4 py-4 ${
                                      isExpired
                                        ? 'border-slate-200'
                                        : 'border-green-200'
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <span
                                        className={`material-symbols-outlined ${
                                          isExpired
                                            ? 'text-slate-500'
                                            : 'text-green-700'
                                        }`}
                                      >
                                        event
                                      </span>

                                      <div>
                                        <p className="text-xs text-on-surface-variant">
                                          Tanggal Kunjungan
                                        </p>

                                        <p className="font-label-md font-bold text-on-surface mt-1">
                                          {
                                            selectedPengajuan
                                              .visit_date_label ||
                                            formatDateOnly(
                                              selectedPengajuan.visit_date
                                            )
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {selectedPengajuan.service_hours && (
                                  <div
                                    className={`rounded-xl bg-white/70 border px-4 py-4 ${
                                      isExpired
                                        ? 'border-slate-200'
                                        : 'border-green-200'
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <span
                                        className={`material-symbols-outlined ${
                                          isExpired
                                            ? 'text-slate-500'
                                            : 'text-green-700'
                                        }`}
                                      >
                                        schedule
                                      </span>

                                      <div>
                                        <p className="text-xs text-on-surface-variant">
                                          Jam Pelayanan
                                        </p>

                                        <p className="font-label-md font-bold text-on-surface mt-1">
                                          {
                                            selectedPengajuan
                                              .service_hours
                                              .label
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {selectedPengajuan.expired_date && (
                                <div
                                  className={`rounded-xl bg-white/70 border px-4 py-4 ${
                                    isExpired
                                      ? 'border-slate-200'
                                      : 'border-green-200'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <span
                                      className={`material-symbols-outlined ${
                                        isExpired
                                          ? 'text-slate-500'
                                          : 'text-green-700'
                                      }`}
                                    >
                                      calendar_month
                                    </span>

                                    <div>
                                      <p className="text-xs text-on-surface-variant">
                                        Berlaku Sampai
                                      </p>

                                      <p className="font-label-md font-semibold text-on-surface mt-1">
                                        {
                                          selectedPengajuan.expired_date
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </section>
                      )}

                    {/* DATA PEMOHON */}
                    <section>
                      <h3 className="font-label-md font-semibold text-primary mb-3">
                        Data Pemohon
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoRow
                          label="Nama Lengkap"
                          value={
                            selectedPengajuan.nama_lengkap
                          }
                        />

                        <InfoRow
                          label="NIK"
                          value={
                            selectedPengajuan.nik
                          }
                          mono
                        />

                        <InfoRow
                          label="Nomor KK"
                          value={
                            selectedPengajuan.nomor_kk
                          }
                          mono
                        />

                        <InfoRow
                          label="Tempat Lahir"
                          value={
                            selectedPengajuan.tempat_lahir
                          }
                        />

                        <InfoRow
                          label="Tanggal Lahir"
                          value={formatDateOnly(
                            selectedPengajuan.tanggal_lahir
                          )}
                        />

                        <InfoRow
                          label="Jenis Kelamin"
                          value={getGenderLabel(
                            selectedPengajuan.jenis_kelamin
                          )}
                        />

                        {selectedPengajuan.service_type ===
                          'ktp' && (
                          <InfoRow
                            label="Jenis Permohonan"
                            value={getJenisKtpLabel(
                              selectedPengajuan.jenis_permohonan
                            )}
                          />
                        )}

                        <InfoRow
                          label="Kode Pos"
                          value={
                            selectedPengajuan.kode_pos
                          }
                        />

                        <div className="md:col-span-2">
                          <InfoRow
                            label="Alamat"
                            value={`${selectedPengajuan.alamat || '-'} RT ${
                              selectedPengajuan.rt ||
                              '-'
                            } / RW ${
                              selectedPengajuan.rw ||
                              '-'
                            }`}
                          />
                        </div>
                      </div>
                    </section>

                    {/* DATA USAHA */}
                    {selectedPengajuan.service_type ===
                      'sku' && (
                      <section>
                        <h3 className="font-label-md font-semibold text-primary mb-3">
                          Data Usaha
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InfoRow
                            label="Nama Usaha"
                            value={
                              selectedPengajuan.nama_usaha
                            }
                          />

                          <InfoRow
                            label="Jenis Usaha"
                            value={
                              selectedPengajuan.jenis_usaha
                            }
                          />

                          <InfoRow
                            label="Lama Menjalankan Usaha"
                            value={
                              selectedPengajuan.lama_menjalankan_usaha !==
                              null
                                ? `${selectedPengajuan.lama_menjalankan_usaha} tahun`
                                : '-'
                            }
                          />

                          <InfoRow
                            label="Perkiraan Penghasilan"
                            value={
                              selectedPengajuan.perkiraan_penghasilan_per_bulan
                            }
                          />

                          <div className="md:col-span-2">
                            <InfoRow
                              label="Deskripsi Usaha"
                              value={
                                selectedPengajuan.deskripsi_usaha
                              }
                            />
                          </div>

                          <div className="md:col-span-2">
                            <InfoRow
                              label="Alamat Usaha"
                              value={`${selectedPengajuan.alamat_usaha || '-'} RT ${
                                selectedPengajuan.rt_usaha ||
                                '-'
                              } / RW ${
                                selectedPengajuan.rw_usaha ||
                                '-'
                              }`}
                            />
                          </div>
                        </div>
                      </section>
                    )}

                    {/* APPROVAL */}
                    {(
                      selectedPengajuan.approved_at ||
                      selectedPengajuan.no_antrian ||
                      selectedPengajuan.visit_date ||
                      selectedPengajuan.expired_at
                    ) && (
                      <section>
                        <h3 className="font-label-md font-semibold text-primary mb-3">
                          Informasi Persetujuan
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedPengajuan.approved_at && (
                            <InfoRow
                              label="Disetujui Pada"
                              value={formatDate(
                                selectedPengajuan.approved_at
                              )}
                            />
                          )}

                          {selectedPengajuan.no_antrian && (
                            <InfoRow
                              label="Nomor Antrean"
                              value={
                                selectedPengajuan.no_antrian
                              }
                              mono
                            />
                          )}

                          {selectedPengajuan.visit_date && (
                            <InfoRow
                              label="Tanggal Kunjungan"
                              value={
                                selectedPengajuan
                                  .visit_date_label ||
                                formatDateOnly(
                                  selectedPengajuan.visit_date
                                )
                              }
                            />
                          )}

                          {selectedPengajuan.expired_date && (
                            <InfoRow
                              label="Berlaku Sampai"
                              value={
                                selectedPengajuan.expired_date
                              }
                            />
                          )}

                          {selectedPengajuan.service_hours?.label && (
                            <InfoRow
                              label="Jam Pelayanan"
                              value={
                                selectedPengajuan
                                  .service_hours
                                  .label
                              }
                            />
                          )}
                        </div>
                      </section>
                    )}

                    {/* CATATAN */}
                    {selectedPengajuan.catatan_admin && (
                      <section>
                        <h3 className="font-label-md font-semibold text-primary mb-3">
                          Catatan Admin
                        </h3>

                        <div className="bg-primary/5 rounded-xl p-4">
                          <div className="flex gap-3">
                            <span className="material-symbols-outlined text-primary shrink-0">
                              info
                            </span>

                            <p className="font-body-md text-on-surface-variant whitespace-pre-line wrap-break-word">
                              {
                                selectedPengajuan.catatan_admin
                              }
                            </p>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* DOKUMEN */}
                    <section>
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <h3 className="font-label-md font-semibold text-primary">
                          Dokumen
                        </h3>

                        {documentLoading && (
                          <span className="inline-flex items-center gap-2 text-xs text-primary">
                            <span className="material-symbols-outlined animate-spin">
                              progress_activity
                            </span>

                            Membuka dokumen...
                          </span>
                        )}
                      </div>

                      {selectedPengajuan.dokumen
                        ?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedPengajuan.dokumen.map(
                            (
                              document
                            ) => (
                              <button
                                key={
                                  document.id
                                }
                                type="button"
                                onClick={() =>
                                  handleOpenDocument(
                                    document
                                  )
                                }
                                disabled={
                                  documentLoading
                                }
                                className="w-full flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 hover:border-primary/30 hover:bg-primary/5 transition-colors min-w-0 text-left disabled:opacity-60 disabled:cursor-wait"
                              >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined">
                                    description
                                  </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="font-label-md font-semibold text-on-surface truncate">
                                    {getDocumentLabel(
                                      document.jenis_dokumen
                                    )}
                                  </p>

                                  <p className="font-label-sm text-on-surface-variant truncate mt-0.5">
                                    {
                                      document.nama_file
                                    }
                                  </p>
                                </div>

                                <span className="material-symbols-outlined text-primary shrink-0">
                                  open_in_new
                                </span>
                              </button>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="rounded-xl bg-surface-container-low px-4 py-4 text-sm text-on-surface-variant">
                          Belum ada dokumen.
                        </div>
                      )}
                    </section>

                    {/* RIWAYAT */}
                    <section>
                      <h3 className="font-label-md font-semibold text-primary mb-4">
                        Riwayat Status
                      </h3>

                      {selectedPengajuan.riwayat
                        ?.length > 0 ? (
                        <div className="space-y-4">
                          {selectedPengajuan.riwayat.map(
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
                                selectedPengajuan
                                  .riwayat
                                  .length -
                                  1;

                              return (
                                <div
                                  key={
                                    history.id
                                  }
                                  className="relative flex gap-4"
                                >
                                  {!isLast && (
                                    <div className="absolute left-2.5 top-7 bottom-0 w-px bg-outline-variant/30" />
                                  )}

                                  <div className="relative z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  </div>

                                  <div className="flex-1 pb-2 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                      <span
                                        className={`inline-flex w-fit items-center gap-1 px-3 py-1 rounded-full ${historyStatus.bg} ${historyStatus.text} font-label-sm`}
                                      >
                                        <span className="material-symbols-outlined">
                                          {
                                            historyStatus.icon
                                          }
                                        </span>

                                        {getStatusLabel(
                                          history.status
                                        )}
                                      </span>

                                      <span className="text-xs text-on-surface-variant">
                                        {formatDate(
                                          history.created_at
                                        )}
                                      </span>
                                    </div>

                                    {history.catatan && (
                                      <p className="text-sm text-on-surface-variant mt-2 wrap-break-word">
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
                          Belum ada riwayat status.
                        </div>
                      )}
                    </section>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      {isExpired &&
                        selectedPengajuan.service_type ===
                          'ktp' && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                '/dashboard/pengajuan/ktp'
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-container transition-colors"
                          >
                            <span className="material-symbols-outlined">
                              refresh
                            </span>

                            Ajukan KTP Kembali
                          </button>
                        )}

                      {isExpired &&
                        selectedPengajuan.service_type ===
                          'sku' && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                '/dashboard/pengajuan/sku'
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-container transition-colors"
                          >
                            <span className="material-symbols-outlined">
                              refresh
                            </span>

                            Ajukan SKU Kembali
                          </button>
                        )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPengajuan(
                          null
                        )
                      }
                      disabled={
                        documentLoading
                      }
                      className="sm:ml-auto px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
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

      {/* ============================================================= */}
      {/* DOCUMENT PREVIEW MODAL                                        */}
      {/* ============================================================= */}

      {selectedDocument && (
        <div
          className="fixed inset-0 z-110 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={
            handleCloseDocumentPreview
          }
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="w-full max-w-6xl h-[90vh] bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            {/* Preview Header */}
            <div className="px-5 py-4 border-b border-outline-variant/20 flex items-center justify-between gap-4 shrink-0">
              <div className="min-w-0">
                <p className="text-xs text-on-surface-variant">
                  Preview Dokumen
                </p>

                <h2 className="font-label-md font-semibold text-on-surface truncate mt-1">
                  {
                    documentPreviewName
                  }
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={
                    handleDownloadDocument
                  }
                  disabled={
                    !documentPreviewUrl ||
                    documentLoading
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-label-md hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">
                    download
                  </span>

                  Download
                </button>

                <button
                  type="button"
                  onClick={
                    handleCloseDocumentPreview
                  }
                  className="w-9 h-9 rounded-full hover:bg-primary/10 text-on-surface-variant hover:text-primary flex items-center justify-center"
                  aria-label="Tutup preview"
                >
                  <span className="material-symbols-outlined">
                    close
                  </span>
                </button>
              </div>
            </div>

            {/* Preview Body */}
            <div className="flex-1 min-h-0 bg-neutral-200 p-3">
              {documentLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                    progress_activity
                  </span>

                  <p className="mt-3 text-sm">
                    Membuka dokumen...
                  </p>
                </div>
              ) : documentPreviewUrl ? (
                documentPreviewType.startsWith(
                  'image/'
                ) ? (
                  <div className="w-full h-full flex items-center justify-center overflow-auto">
                    <img
                      src={
                        documentPreviewUrl
                      }
                      alt={
                        documentPreviewName
                      }
                      className="max-w-full max-h-full object-contain rounded-xl bg-white shadow-sm"
                    />
                  </div>
                ) : (
                  <iframe
                    title={
                      documentPreviewName ||
                      'Preview dokumen'
                    }
                    src={
                      documentPreviewUrl
                    }
                    className="w-full h-full rounded-xl border border-outline-variant/20 bg-white"
                  />
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-red-500 text-4xl">
                    error
                  </span>

                  <p className="mt-3">
                    Dokumen tidak dapat ditampilkan.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined">
            {icon}
          </span>
        </div>

        <div>
          <p className="text-xs text-on-surface-variant">
            {label}
          </p>

          <p className="text-xl font-bold text-on-surface mt-0.5">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  mono = false,
}) => {
  return (
    <div className="rounded-xl bg-surface-container-low px-4 py-3 min-w-0">
      <p className="text-xs text-on-surface-variant">
        {label}
      </p>

      <p
        className={`font-label-md font-semibold text-on-surface mt-1 wrap-break-word ${
          mono
            ? 'font-mono tracking-wide'
            : ''
        }`}
      >
        {value || '-'}
      </p>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-outlined">
          inbox
        </span>
      </div>

      <h3 className="font-headline-md text-lg text-on-surface">
        Belum ada pengajuan
      </h3>

      <p className="font-body-md text-on-surface-variant mt-2">
        Tidak ada pengajuan dengan filter tersebut.
      </p>
    </div>
  );
};

export default RiwayatPengajuan;
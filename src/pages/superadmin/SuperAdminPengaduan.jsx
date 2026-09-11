import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { motion } from 'framer-motion';

import api from '../../api/axios';

/*
|--------------------------------------------------------------------------
| CONSTANT
|--------------------------------------------------------------------------
*/

const STATUS_LABELS = {
  terkirim: 'Terkirim',
  diteruskan: 'Diteruskan',
  selesai: 'Selesai',
};

const STATUS_STYLES = {
  terkirim: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    icon: 'send',
  },

  diteruskan: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: 'forward',
  },

  selesai: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: 'check_circle',
  },
};

const STATUS_FILTERS = [
  {
    value: 'semua',
    label: 'Semua',
  },

  {
    value: 'terkirim',
    label: 'Terkirim',
  },

  {
    value: 'diteruskan',
    label: 'Diteruskan',
  },

  {
    value: 'selesai',
    label: 'Selesai',
  },
];

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

const SuperAdminPengaduan = () => {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    pengaduanList,
    setPengaduanList,
  ] = useState([]);

  const [
    pagination,
    setPagination,
  ] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('semua');

  const [
    selectedPengaduan,
    setSelectedPengaduan,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    detailLoading,
    setDetailLoading,
  ] = useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    responseLoading,
    setResponseLoading,
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
    responseText,
    setResponseText,
  ] = useState('');

  /*
  |--------------------------------------------------------------------------
  | IMAGE PREVIEW
  |--------------------------------------------------------------------------
  */

  const [
    imagePreviewUrl,
    setImagePreviewUrl,
  ] = useState('');

  const [
    imagePreviewLoading,
    setImagePreviewLoading,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | DOCUMENT PREVIEW
  |--------------------------------------------------------------------------
  */

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
    documentPreviewLoading,
    setDocumentPreviewLoading,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | FETCH PENGADUAN
  |--------------------------------------------------------------------------
  */

  const fetchPengaduan =
    async (
      page = 1
    ) => {
      setLoading(true);
      setError('');

      try {
        const response =
          await api.get(
            '/admin/pengaduan',
            {
              params: {
                page,
              },
            }
          );

        const responseData =
          response.data?.data;

        let data = [];

        let meta = {
          currentPage:
            page,

          lastPage: 1,

          total: 0,
        };

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

          meta = {
            currentPage:
              responseData?.current_page ||
              page,

            lastPage:
              responseData?.last_page ||
              1,

            total:
              responseData?.total ||
              0,
          };
        }

        setPengaduanList(
          data
        );

        setPagination(
          meta
        );
      } catch (
        err
      ) {
        setError(
          err.response?.data
            ?.message ||
            'Gagal mengambil daftar pengaduan.'
        );
      } finally {
        setLoading(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | LOAD AWAL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchPengaduan(
      currentPage
    );
  }, [
    currentPage,
  ]);

  /*
  |--------------------------------------------------------------------------
  | CLEANUP PREVIEW URL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (
        imagePreviewUrl
      ) {
        window.URL.revokeObjectURL(
          imagePreviewUrl
        );
      }

      if (
        documentPreviewUrl
      ) {
        window.URL.revokeObjectURL(
          documentPreviewUrl
        );
      }
    };
  }, [
    imagePreviewUrl,
    documentPreviewUrl,
  ]);

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredData =
    useMemo(
      () => {
        if (
          statusFilter ===
          'semua'
        ) {
          return pengaduanList;
        }

        return pengaduanList.filter(
          (item) =>
            item.status ===
            statusFilter
        );
      },
      [
        pengaduanList,
        statusFilter,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | OPEN DETAIL
  |--------------------------------------------------------------------------
  */

  const handleOpenDetail =
    async (
      item
    ) => {
      if (
        !item?.id
      ) {
        return;
      }

      setDetailLoading(
        true
      );

      setError('');
      setSuccess('');
      setResponseText('');

      /*
      |----------------------------------------------------------------------
      | Tutup preview sebelumnya
      |----------------------------------------------------------------------
      */

      handleCloseImage();
      handleCloseDocument();

      try {
        const response =
          await api.get(
            `/admin/pengaduan/${item.id}`
          );

        const detail =
          response.data
            ?.data;

        if (!detail) {
          throw new Error(
            'Detail pengaduan tidak ditemukan.'
          );
        }

        setSelectedPengaduan(
          detail
        );
      } catch (
        err
      ) {
        setError(
          err.response?.data
            ?.message ||
          err.message ||
          'Detail pengaduan gagal diambil.'
        );
      } finally {
        setDetailLoading(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | CLOSE DETAIL
  |--------------------------------------------------------------------------
  */

  const handleCloseDetail =
    () => {
      if (
        actionLoading ||
        responseLoading
      ) {
        return;
      }

      setSelectedPengaduan(
        null
      );

      setResponseText(
        ''
      );
    };

  /*
  |--------------------------------------------------------------------------
  | UPDATE STATUS
  |--------------------------------------------------------------------------
  */

  const handleUpdateStatus =
    async (
      status
    ) => {
      if (
        !selectedPengaduan?.id ||
        actionLoading
      ) {
        return;
      }

      const statusLama =
        selectedPengaduan.status;

      if (
        statusLama ===
        status
      ) {
        return;
      }

      setActionLoading(
        true
      );

      setError('');
      setSuccess('');

      try {
        const response =
          await api.patch(
            `/admin/pengaduan/${selectedPengaduan.id}/status`,
            {
              status,
            }
          );

        const updated =
          response.data?.data;

        if (updated) {
          setSelectedPengaduan(
            updated
          );

          setPengaduanList(
            (
              previous
            ) =>
              previous.map(
                (
                  item
                ) =>
                  item.id ===
                  selectedPengaduan.id
                    ? updated
                    : item
              )
          );
        }

        setSuccess(
          response.data
            ?.message ||
            'Status pengaduan berhasil diperbarui.'
        );
      } catch (
        err
      ) {
        setError(
          err.response?.data
            ?.message ||
          'Status pengaduan gagal diperbarui.'
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | STORE RESPONSE
  |--------------------------------------------------------------------------
  */

  const handleSubmitResponse =
    async (
      event
    ) => {
      event.preventDefault();

      if (
        !selectedPengaduan?.id ||
        responseLoading
      ) {
        return;
      }

      const trimmed =
        responseText.trim();

      if (!trimmed) {
        setError(
          'Respons petugas wajib diisi.'
        );

        return;
      }

      setResponseLoading(
        true
      );

      setError('');
      setSuccess('');

      try {
        const response =
          await api.post(
            `/admin/pengaduan/${selectedPengaduan.id}/respon`,
            {
              respon:
                trimmed,
            }
          );

        setResponseText(
          ''
        );

        setSuccess(
          response.data
            ?.message ||
            'Respons petugas berhasil ditambahkan.'
        );

        /*
        |----------------------------------------------------------------------
        | Reload detail
        |----------------------------------------------------------------------
        */

        const detailResponse =
          await api.get(
            `/admin/pengaduan/${selectedPengaduan.id}`
          );

        const detail =
          detailResponse.data
            ?.data;

        if (detail) {
          setSelectedPengaduan(
            detail
          );
        }
      } catch (
        err
      ) {
        setError(
          err.response?.data
            ?.message ||
          'Respons petugas gagal ditambahkan.'
        );
      } finally {
        setResponseLoading(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | OPEN IMAGE
  |--------------------------------------------------------------------------
  */

  const handleOpenImage =
    async (
      url
    ) => {
      if (!url) {
        setError(
          'URL foto bukti tidak tersedia.'
        );

        return;
      }

      setImagePreviewLoading(
        true
      );

      setError('');
      setSuccess('');

      if (
        imagePreviewUrl
      ) {
        window.URL.revokeObjectURL(
          imagePreviewUrl
        );
      }

      setImagePreviewUrl(
        ''
      );

      try {
        const response =
          await api.get(
            url,
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

        /*
        |----------------------------------------------------------------------
        | Response JSON = error
        |----------------------------------------------------------------------
        */

        if (
          contentType.includes(
            'application/json'
          )
        ) {
          const text =
            await response.data.text();

          let message =
            'Foto bukti tidak dapat diakses.';

          try {
            const json =
              JSON.parse(
                text
              );

            message =
              json?.message ||
              message;
          } catch {
            // Abaikan.
          }

          throw new Error(
            message
          );
        }

        /*
        |----------------------------------------------------------------------
        | Pastikan gambar
        |----------------------------------------------------------------------
        */

        if (
          !contentType.startsWith(
            'image/'
          )
        ) {
          throw new Error(
            'File foto bukti tidak valid.'
          );
        }

        const blob =
          new Blob(
            [
              response.data,
            ],
            {
              type:
                contentType,
            }
          );

        const blobUrl =
          window.URL.createObjectURL(
            blob
          );

        setImagePreviewUrl(
          blobUrl
        );
      } catch (
        err
      ) {
        setError(
          err.response?.data
            ?.message ||
          err.message ||
          'Foto bukti gagal dibuka.'
        );
      } finally {
        setImagePreviewLoading(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | CLOSE IMAGE
  |--------------------------------------------------------------------------
  */

  const handleCloseImage =
    () => {
      if (
        imagePreviewUrl
      ) {
        window.URL.revokeObjectURL(
          imagePreviewUrl
        );
      }

      setImagePreviewUrl(
        ''
      );

      setImagePreviewLoading(
        false
      );
    };

  /*
  |--------------------------------------------------------------------------
  | OPEN DOCUMENT
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

      setDocumentPreviewLoading(
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

      setDocumentPreviewUrl(
        ''
      );

      setDocumentPreviewType(
        ''
      );

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

        /*
        |----------------------------------------------------------------------
        | Cek JSON error
        |----------------------------------------------------------------------
        */

        if (
          contentType.includes(
            'application/json'
          )
        ) {
          const text =
            await response.data.text();

          let message =
            'Dokumen tidak dapat dibuka.';

          try {
            const json =
              JSON.parse(
                text
              );

            message =
              json?.message ||
              message;
          } catch {
            // Abaikan.
          }

          throw new Error(
            message
          );
        }

        /*
        |----------------------------------------------------------------------
        | Validasi format
        |----------------------------------------------------------------------
        */

        const allowedTypes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/webp',
        ];

        const isAllowed =
          allowedTypes.some(
            (
              allowedType
            ) =>
              contentType.startsWith(
                allowedType
              )
          );

        if (
          !isAllowed
        ) {
          throw new Error(
            'Format dokumen tidak dapat ditampilkan di browser.'
          );
        }

        const blob =
          new Blob(
            [
              response.data,
            ],
            {
              type:
                contentType,
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
      } catch (
        err
      ) {
        setDocumentPreviewUrl(
          ''
        );

        setDocumentPreviewType(
          ''
        );

        setDocumentPreviewName(
          ''
        );

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          'Dokumen gagal dibuka.'
        );
      } finally {
        setDocumentPreviewLoading(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | CLOSE DOCUMENT
  |--------------------------------------------------------------------------
  */

  const handleCloseDocument =
    () => {
      if (
        documentPreviewUrl
      ) {
        window.URL.revokeObjectURL(
          documentPreviewUrl
        );
      }

      setDocumentPreviewUrl(
        ''
      );

      setDocumentPreviewType(
        ''
      );

      setDocumentPreviewName(
        ''
      );

      setDocumentPreviewLoading(
        false
      );
    };

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const getStatusLabel =
    (
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

  const getStatusStyle =
    (
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

  const formatDate =
    (
      value
    ) => {
      if (!value) {
        return '-';
      }

      const date =
        new Date(
          value
        );

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

  const getPageNumbers =
    () => {
      const total =
        pagination.lastPage;

      const current =
        pagination.currentPage;

      const pages = [];

      if (
        total <= 5
      ) {
        for (
          let page = 1;
          page <= total;
          page += 1
        ) {
          pages.push(
            page
          );
        }

        return pages;
      }

      pages.push(1);

      if (
        current > 3
      ) {
        pages.push(
          '...'
        );
      }

      const start =
        Math.max(
          2,
          current - 1
        );

      const end =
        Math.min(
          total - 1,
          current + 1
        );

      for (
        let page = start;
        page <= end;
        page += 1
      ) {
        pages.push(
          page
        );
      }

      if (
        current <
        total - 2
      ) {
        pages.push(
          '...'
        );
      }

      pages.push(
        total
      );

      return pages;
    };

  const handlePageChange =
    (
      page
    ) => {
      if (
        page < 1 ||
        page >
          pagination.lastPage ||
        page ===
          pagination.currentPage
      ) {
        return;
      }

      setCurrentPage(
        page
      );
    };

  /*
  |--------------------------------------------------------------------------
  | STATUS COUNTS
  |--------------------------------------------------------------------------
  */

  const totalSemua =
    pagination.total;

  const totalTerkirim =
    pengaduanList.filter(
      (item) =>
        item.status ===
        'terkirim'
    ).length;

  const totalDiteruskan =
    pengaduanList.filter(
      (item) =>
        item.status ===
        'diteruskan'
    ).length;

  const totalSelesai =
    pengaduanList.filter(
      (item) =>
        item.status ===
        'selesai'
    ).length;

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="w-full">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="mb-8"
      >

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="font-headline-lg text-on-background">
                Pengaduan Masyarakat
              </h1>

              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-primary text-xs font-semibold">

                <span className="material-symbols-outlined text-sm">
                  admin_panel_settings
                </span>

                Super Admin

              </span>

            </div>

            <p className="font-body-md text-on-surface-variant mt-1">
              Kelola laporan pengaduan dari warga dan tindak lanjuti sesuai alur pelayanan.
            </p>

          </div>

        </div>

      </motion.div>

      {/* =========================================================
          ERROR
      ========================================================== */}

      {error && (
        <motion.div
          initial={{
            opacity: 0,
            y: -8,
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

      {/* =========================================================
          SUCCESS
      ========================================================== */}

      {success && (
        <motion.div
          initial={{
            opacity: 0,
            y: -8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >

          <div className="flex items-start gap-3">

            <span className="material-symbols-outlined shrink-0">
              check_circle
            </span>

            <span className="wrap-break-word">
              {success}
            </span>

          </div>

        </motion.div>
      )}

      {/* =========================================================
          SUMMARY
      ========================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

        <SummaryCard
          icon="description"
          label="Total"
          value={
            totalSemua
          }
        />

        <SummaryCard
          icon="send"
          label="Terkirim"
          value={
            totalTerkirim
          }
        />

        <SummaryCard
          icon="forward"
          label="Diteruskan"
          value={
            totalDiteruskan
          }
        />

        <SummaryCard
          icon="check_circle"
          label="Selesai"
          value={
            totalSelesai
          }
        />

      </div>

      {/* =========================================================
          FILTER
      ========================================================== */}

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 mb-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <h2 className="font-headline-md text-lg text-on-surface">
              Daftar Pengaduan
            </h2>

            <p className="font-label-sm text-on-surface-variant mt-1">
              Kelola dan perbarui status pengaduan warga.
            </p>

          </div>

          <select
            value={
              statusFilter
            }
            onChange={(
              event
            ) => {
              setStatusFilter(
                event.target.value
              );

              setCurrentPage(
                1
              );
            }}
            className="h-11 w-full lg:w-56 px-4 rounded-xl bg-surface border border-outline-variant/40 text-sm outline-none focus:border-primary"
          >

            {STATUS_FILTERS.map(
              (
                item
              ) => (
                <option
                  key={
                    item.value
                  }
                  value={
                    item.value
                  }
                >
                  {
                    item.label
                  }
                </option>
              )
            )}

          </select>

        </div>

      </div>

      {/* =========================================================
          TABLE
      ========================================================== */}

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-950px">

            <thead>

              <tr className="bg-surface-container-low border-b border-outline-variant/20">

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant whitespace-nowrap">
                  ID
                </th>

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                  Pengaduan
                </th>

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                  Pelapor
                </th>

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                  Lokasi
                </th>

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant whitespace-nowrap">
                  Tanggal
                </th>

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant whitespace-nowrap">
                  Status
                </th>

                <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant whitespace-nowrap">
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
                        colSpan="7"
                        className="px-6 py-5"
                      >

                        <div className="h-5 bg-surface-container-low rounded animate-pulse" />

                      </td>

                    </tr>
                  )
                )
              ) : filteredData.length ===
                0 ? (
                <tr>

                  <td
                    colSpan="7"
                    className="py-16 text-center"
                  >

                    <EmptyState />

                  </td>

                </tr>
              ) : (
                filteredData.map(
                  (
                    item,
                    index
                  ) => {

                    const status =
                      getStatusStyle(
                        item.status
                      );

                    return (
                      <motion.tr
                        key={
                          item.id
                        }
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
                            0.25,
                          delay:
                            index *
                            0.03,
                        }}
                        className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors align-top"
                      >

                        <td className="px-6 py-5">

                          <span className="font-label-md font-semibold text-primary whitespace-nowrap">
                            #
                            {
                              item.id
                            }
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <div className="max-w-300px">

                            <p className="font-label-md font-semibold text-on-surface wrap-break-word">
                              {
                                item.subjek ||
                                '-'
                              }
                            </p>

                            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 wrap-break-word">
                              {
                                item.keterangan ||
                                '-'
                              }
                            </p>

                          </div>

                        </td>

                        <td className="px-6 py-5">

                          <div className="max-w-180px">

                            <p className="font-label-md text-on-surface wrap-break-word">
                              {
                                item.nama ||
                                '-'
                              }
                            </p>

                            <p className="text-xs text-on-surface-variant mt-1 whitespace-nowrap">
                              {
                                item.nomor ||
                                '-'
                              }
                            </p>

                          </div>

                        </td>

                        <td className="px-6 py-5">

                          <div className="max-w-220px">

                            <p className="font-label-sm text-on-surface wrap-break-word">
                              {
                                item.lokasi ||
                                '-'
                              }
                            </p>

                            <p className="text-xs text-on-surface-variant mt-1 whitespace-nowrap">
                              RT{' '}
                              {
                                item.rt ||
                                '-'
                              }{' '}
                              / RW{' '}
                              {
                                item.rw ||
                                '-'
                              }
                            </p>

                          </div>

                        </td>

                        <td className="px-6 py-5 whitespace-nowrap">

                          <div className="flex items-center gap-2 text-on-surface-variant">

                            <span className="material-symbols-outlined shrink-0">
                              calendar_today
                            </span>

                            <span className="text-sm">
                              {
                                formatDate(
                                  item.created_at
                                )
                              }
                            </span>

                          </div>

                        </td>

                        <td className="px-6 py-5 whitespace-nowrap">

                          <span
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${status.bg} ${status.text} font-label-sm`}
                          >

                            <span className="material-symbols-outlined">
                              {
                                status.icon
                              }
                            </span>

                            {
                              getStatusLabel(
                                item.status
                              )
                            }

                          </span>

                        </td>

                        <td className="px-6 py-5 whitespace-nowrap">

                          <div className="flex justify-end">

                            <button
                              type="button"
                              onClick={() =>
                                handleOpenDetail(
                                  item
                                )
                              }
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all font-label-md"
                            >

                              <span className="material-symbols-outlined">
                                visibility
                              </span>

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

        {/* =======================================================
            PAGINATION
        ======================================================== */}

        {!loading &&
          pagination.lastPage >
            1 && (
          <div className="px-5 py-4 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <p className="font-label-sm text-on-surface-variant">

              Halaman{' '}

              {
                pagination.currentPage
              }

              {' '}dari{' '}

              {
                pagination.lastPage
              }

            </p>

            <div className="flex items-center gap-2 flex-wrap">

              <button
                type="button"
                disabled={
                  pagination.currentPage ===
                  1
                }
                onClick={() =>
                  handlePageChange(
                    pagination.currentPage -
                      1
                  )
                }
                className="px-4 py-2 rounded-lg border border-outline-variant/40 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10"
              >
                Sebelumnya
              </button>

              {getPageNumbers().map(
                (
                  page,
                  index
                ) =>
                  page ===
                  '...' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-on-surface-variant"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={
                        page
                      }
                      type="button"
                      onClick={() =>
                        handlePageChange(
                          page
                        )
                      }
                      className={`min-w-10 px-3 py-2 rounded-lg text-sm ${
                        pagination.currentPage ===
                        page
                          ? 'bg-primary text-white'
                          : 'border border-outline-variant/40 hover:bg-primary/10'
                      }`}
                    >
                      {
                        page
                      }
                    </button>
                  )
              )}

              <button
                type="button"
                disabled={
                  pagination.currentPage ===
                  pagination.lastPage
                }
                onClick={() =>
                  handlePageChange(
                    pagination.currentPage +
                      1
                  )
                }
                className="px-4 py-2 rounded-lg border border-outline-variant/40 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10"
              >
                Berikutnya
              </button>

            </div>

          </div>
        )}

      </div>

      {/* =========================================================
          DETAIL MODAL
      ========================================================== */}

      {(selectedPengaduan ||
        detailLoading) && (
        <div
          className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            if (
              !actionLoading &&
              !responseLoading &&
              !imagePreviewLoading &&
              !documentPreviewLoading
            ) {
              handleCloseDetail();
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
            transition={{
              duration: 0.25,
            }}
            className="w-full max-w-5xl max-h-[92vh] bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between gap-4">

              <div className="min-w-0">

                <p className="text-xs font-semibold text-primary">

                  {selectedPengaduan
                    ? `#${selectedPengaduan.id}`
                    : 'Detail'}

                </p>

                <h2 className="font-headline-md text-xl text-on-surface mt-1">
                  Detail Pengaduan
                </h2>

              </div>

              <button
                type="button"
                onClick={
                  handleCloseDetail
                }
                disabled={
                  actionLoading ||
                  responseLoading ||
                  imagePreviewLoading ||
                  documentPreviewLoading
                }
                className="w-10 h-10 rounded-full hover:bg-primary/10 flex items-center justify-center text-on-surface-variant hover:text-primary disabled:opacity-50"
                aria-label="Tutup"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </div>

            {detailLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-on-surface-variant">

                <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                  progress_activity
                </span>

                <p className="mt-3">
                  Memuat detail pengaduan...
                </p>

              </div>
            ) : (
              selectedPengaduan && (
                <>

                  <div className="overflow-y-auto max-h-[calc(92vh-150px)] p-6 space-y-6">

                    {/* STATUS */}

                    <section className="rounded-2xl border border-primary/10 bg-primary/5 p-5">

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>

                          <p className="text-xs text-on-surface-variant">
                            Status Pengaduan
                          </p>

                          {(() => {

                            const status =
                              getStatusStyle(
                                selectedPengaduan.status
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

                                {
                                  getStatusLabel(
                                    selectedPengaduan.status
                                  )
                                }

                              </span>
                            );

                          })()}

                        </div>

                        <div className="sm:text-right">

                          <p className="text-xs text-on-surface-variant">
                            Dibuat
                          </p>

                          <p className="font-label-md font-semibold text-on-surface mt-1">
                            {
                              formatDate(
                                selectedPengaduan.created_at
                              )
                            }
                          </p>

                        </div>

                      </div>

                    </section>

                    {/* INFORMASI PENGADUAN */}

                    <section>

                      <h3 className="font-label-md font-semibold text-primary mb-4">
                        Informasi Pengaduan
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <InfoRow
                          label="Subjek"
                          value={
                            selectedPengaduan.subjek
                          }
                        />

                        <InfoRow
                          label="Lokasi"
                          value={
                            selectedPengaduan.lokasi
                          }
                        />

                        <InfoRow
                          label="RT"
                          value={
                            selectedPengaduan.rt
                          }
                        />

                        <InfoRow
                          label="RW"
                          value={
                            selectedPengaduan.rw
                          }
                        />

                        <div className="md:col-span-2">

                          <InfoRow
                            label="Keterangan"
                            value={
                              selectedPengaduan.keterangan
                            }
                          />

                        </div>

                      </div>

                    </section>

                    {/* DATA PELAPOR */}

                    <section>

                      <h3 className="font-label-md font-semibold text-primary mb-4">
                        Data Pelapor
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <InfoRow
                          label="Nama"
                          value={
                            selectedPengaduan.nama
                          }
                        />

                        <InfoRow
                          label="Nomor Telepon"
                          value={
                            selectedPengaduan.nomor
                          }
                          mono
                        />

                      </div>

                      {selectedPengaduan.user && (
                        <div className="mt-4 rounded-xl bg-surface-container-low px-4 py-3">

                          <p className="text-xs text-on-surface-variant">
                            Akun Pengguna
                          </p>

                          <p className="font-label-md font-semibold text-on-surface mt-1">
                            {
                              selectedPengaduan
                                .user
                                .name
                            }
                          </p>

                          <p className="text-xs text-on-surface-variant mt-1">
                            {
                              selectedPengaduan
                                .user
                                .email
                            }
                          </p>

                        </div>
                      )}

                    </section>

                    {/* FOTO BUKTI */}

                    {selectedPengaduan
                      .foto_bukti
                      ?.url && (
                      <section>

                        <h3 className="font-label-md font-semibold text-primary mb-4">
                          Foto Bukti
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenImage(
                              selectedPengaduan
                                .foto_bukti
                                .url
                            )
                          }
                          disabled={
                            imagePreviewLoading ||
                            documentPreviewLoading
                          }
                          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-outline-variant/30 hover:bg-primary/5 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >

                          <span className="material-symbols-outlined">

                            {imagePreviewLoading
                              ? 'progress_activity'
                              : 'image'}

                          </span>

                          {imagePreviewLoading
                            ? 'Membuka Foto...'
                            : 'Lihat Foto Bukti'}

                        </button>

                      </section>
                    )}

                    {/* DOKUMEN PENDUKUNG */}

                    <section>

                      <div className="flex items-center justify-between gap-4 mb-4">

                        <h3 className="font-label-md font-semibold text-primary">
                          Dokumen Pendukung
                        </h3>

                        {documentPreviewLoading && (
                          <span className="inline-flex items-center gap-2 text-xs text-primary shrink-0">

                            <span className="material-symbols-outlined animate-spin">
                              progress_activity
                            </span>

                            Membuka dokumen...

                          </span>
                        )}

                      </div>

                      {selectedPengaduan
                        .dokumen
                        ?.length >
                      0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                          {selectedPengaduan.dokumen.map(
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
                                  documentPreviewLoading ||
                                  imagePreviewLoading
                                }
                                className="w-full flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 hover:border-primary/30 hover:bg-primary/5 transition-colors text-left disabled:opacity-60 disabled:cursor-wait"
                              >

                                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">

                                  <span className="material-symbols-outlined">
                                    {
                                      documentPreviewLoading
                                        ? 'progress_activity'
                                        : 'description'
                                    }
                                  </span>

                                </div>

                                <div className="min-w-0 flex-1">

                                  <p className="font-label-md font-semibold text-on-surface truncate">
                                    {
                                      document.nama_file ||
                                      'Dokumen'
                                    }
                                  </p>

                                  <p className="text-xs text-on-surface-variant mt-1">
                                    Klik untuk membuka
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
                          Tidak ada dokumen pendukung.
                        </div>
                      )}

                    </section>

                    {/* RIWAYAT */}

                    <section>

                      <h3 className="font-label-md font-semibold text-primary mb-4">
                        Riwayat Status
                      </h3>

                      {selectedPengaduan
                        .riwayat
                        ?.length >
                      0 ? (
                        <div className="space-y-4">

                          {selectedPengaduan.riwayat.map(
                            (
                              history,
                              index
                            ) => {

                              const status =
                                getStatusStyle(
                                  history.status
                                );

                              const isLast =
                                index ===
                                selectedPengaduan
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

                                  <div
                                    className={`relative z-10 w-5 h-5 rounded-full ${status.bg} ${status.text} flex items-center justify-center shrink-0 mt-1`}
                                  >

                                    <div className="w-2 h-2 rounded-full bg-current opacity-70" />

                                  </div>

                                  <div className="flex-1 min-w-0">

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                                      <span
                                        className={`inline-flex w-fit items-center gap-1 px-3 py-1 rounded-full ${status.bg} ${status.text} font-label-sm`}
                                      >

                                        <span className="material-symbols-outlined">
                                          {
                                            status.icon
                                          }
                                        </span>

                                        {
                                          getStatusLabel(
                                            history.status
                                          )
                                        }

                                      </span>

                                      <span className="text-xs text-on-surface-variant whitespace-nowrap">
                                        {
                                          formatDate(
                                            history.created_at
                                          )
                                        }
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
                          Belum ada riwayat status.
                        </div>
                      )}

                    </section>

                    {/* RESPONS PETUGAS */}

                    <section>

                      <h3 className="font-label-md font-semibold text-primary mb-4">
                        Respons Petugas
                      </h3>

                      {selectedPengaduan
                        .respon
                        ?.length >
                      0 ? (
                        <div className="space-y-3">

                          {selectedPengaduan.respon.map(
                            (
                              response
                            ) => (
                              <div
                                key={
                                  response.id
                                }
                                className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4"
                              >

                                <p className="text-sm text-on-surface whitespace-pre-line wrap-break-word">
                                  {
                                    response.respon
                                  }
                                </p>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-3">

                                  {response.user && (
                                    <span className="text-xs font-medium text-primary">
                                      {
                                        response
                                          .user
                                          .name
                                      }
                                    </span>
                                  )}

                                  <span className="text-xs text-on-surface-variant">
                                    {
                                      formatDate(
                                        response.created_at
                                      )
                                    }
                                  </span>

                                </div>

                              </div>
                            )
                          )}

                        </div>
                      ) : (
                        <div className="rounded-xl bg-surface-container-low px-4 py-4 text-sm text-on-surface-variant">
                          Belum ada respons petugas.
                        </div>
                      )}

                    </section>

                    {/* TAMBAH RESPONS */}

                    {selectedPengaduan.status !==
                      'selesai' && (
                      <section className="rounded-2xl border border-primary/10 bg-primary/5 p-5">

                        <h3 className="font-label-md font-semibold text-primary mb-3">
                          Tambahkan Respons Petugas
                        </h3>

                        <form
                          onSubmit={
                            handleSubmitResponse
                          }
                        >

                          <textarea
                            value={
                              responseText
                            }
                            onChange={(
                              event
                            ) =>
                              setResponseText(
                                event
                                  .target
                                  .value
                              )
                            }
                            rows="4"
                            maxLength={
                              5000
                            }
                            placeholder="Tulis respons atau informasi tindak lanjut untuk warga..."
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none"
                            disabled={
                              responseLoading
                            }
                          />

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">

                            <p className="text-xs text-on-surface-variant">
                              Maksimal 5000 karakter.
                            </p>

                            <button
                              type="submit"
                              disabled={
                                responseLoading ||
                                !responseText.trim()
                              }
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-label-md font-semibold hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                              {responseLoading ? (
                                <>

                                  <span className="material-symbols-outlined animate-spin">
                                    progress_activity
                                  </span>

                                  Menyimpan...

                                </>
                              ) : (
                                <>

                                  <span className="material-symbols-outlined">
                                    send
                                  </span>

                                  Kirim Respons

                                </>
                              )}

                            </button>

                          </div>

                        </form>

                      </section>
                    )}

                  </div>

                  {/* FOOTER */}

                  <div className="px-6 py-4 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div className="flex flex-wrap gap-2">

                      {selectedPengaduan.status ===
                        'terkirim' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStatus(
                              'diteruskan'
                            )
                          }
                          disabled={
                            actionLoading
                          }
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-label-md font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
                        >

                          {actionLoading ? (
                            <span className="material-symbols-outlined animate-spin">
                              progress_activity
                            </span>
                          ) : (
                            <span className="material-symbols-outlined">
                              forward
                            </span>
                          )}

                          Teruskan

                        </button>
                      )}

                      {selectedPengaduan.status ===
                        'diteruskan' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStatus(
                              'selesai'
                            )
                          }
                          disabled={
                            actionLoading
                          }
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-label-md font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >

                          {actionLoading ? (
                            <span className="material-symbols-outlined animate-spin">
                              progress_activity
                            </span>
                          ) : (
                            <span className="material-symbols-outlined">
                              check_circle
                            </span>
                          )}

                          Selesaikan

                        </button>
                      )}

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleCloseDetail
                      }
                      disabled={
                        actionLoading ||
                        responseLoading ||
                        imagePreviewLoading ||
                        documentPreviewLoading
                      }
                      className="px-5 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
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

      {/* =========================================================
          FOTO BUKTI PREVIEW
      ========================================================== */}

      {imagePreviewUrl && (
        <div
          className="fixed inset-0 z-110 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={
            handleCloseImage
          }
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="relative max-w-5xl max-h-[90vh]"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            <img
              src={
                imagePreviewUrl
              }
              alt="Bukti Pengaduan"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl bg-white"
            />

            <button
              type="button"
              onClick={
                handleCloseImage
              }
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center"
              aria-label="Tutup foto"
            >

              <span className="material-symbols-outlined">
                close
              </span>

            </button>

          </motion.div>

        </div>
      )}

      {/* =========================================================
          DOKUMEN PREVIEW
      ========================================================== */}

      {documentPreviewUrl && (
        <div
          className="fixed inset-0 z-120 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={
            handleCloseDocument
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
            className="relative w-full max-w-6xl h-[90vh] bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

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

              <button
                type="button"
                onClick={
                  handleCloseDocument
                }
                className="w-9 h-9 rounded-full hover:bg-primary/10 text-on-surface-variant hover:text-primary flex items-center justify-center shrink-0"
                aria-label="Tutup preview dokumen"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </div>

            {/* BODY */}

            <div className="flex-1 min-h-0 bg-neutral-200 p-3">

              {documentPreviewLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant">

                  <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                    progress_activity
                  </span>

                  <p className="mt-3 text-sm">
                    Membuka dokumen...
                  </p>

                </div>
              ) : documentPreviewType.startsWith(
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
              ) : documentPreviewType ===
                'application/pdf' ? (
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

/*
|--------------------------------------------------------------------------
| SUMMARY CARD
|--------------------------------------------------------------------------
*/

const SummaryCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-5 py-4">

      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">

          <span className="material-symbols-outlined">
            {icon}
          </span>

        </div>

        <div className="min-w-0">

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

/*
|--------------------------------------------------------------------------
| INFO ROW
|--------------------------------------------------------------------------
*/

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
        className={`font-label-md font-semibold text-on-surface mt-1 whitespace-pre-line wrap-break-word ${
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

/*
|--------------------------------------------------------------------------
| EMPTY STATE
|--------------------------------------------------------------------------
*/

const EmptyState = () => {
  return (
    <div className="py-12 text-center px-4">

      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">

        <span className="material-symbols-outlined">
          campaign
        </span>

      </div>

      <h3 className="font-headline-md text-lg text-on-surface">
        Belum ada pengaduan
      </h3>

      <p className="font-body-md text-on-surface-variant mt-2">
        Belum ada laporan pengaduan yang sesuai dengan filter.
      </p>

    </div>
  );
};

export default SuperAdminPengaduan;
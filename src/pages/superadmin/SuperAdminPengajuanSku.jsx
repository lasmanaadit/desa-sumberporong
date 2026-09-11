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
    bg: 'bg-amber-100',
    text: 'text-amber-700',
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

const TABS = [
  {
    value: 'diproses',
    label: 'Diproses',
  },

  {
    value: 'selesai',
    label: 'Selesai',
  },
];

const PAGE_SIZE = 20;

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

const SuperAdminPengajuanSku =
  () => {
    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [
      skuList,
      setSkuList,
    ] = useState([]);

    const [
      selected,
      setSelected,
    ] = useState(null);

    const [
      activeTab,
      setActiveTab,
    ] = useState('diproses');

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
      actionLoading,
      setActionLoading,
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
      pagination,
      setPagination,
    ] = useState({
      current_page: 1,
      last_page: 1,
      per_page: PAGE_SIZE,
      total: 0,
    });

    const [
      currentPage,
      setCurrentPage,
    ] = useState(1);

    const [
      statusModal,
      setStatusModal,
    ] = useState(null);

    const [
      catatanAdmin,
      setCatatanAdmin,
    ] = useState('');

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

    /*
    |--------------------------------------------------------------------------
    | FETCH LIST
    |--------------------------------------------------------------------------
    */

    const fetchSku =
      async (
        page = 1
      ) => {
        setLoading(true);
        setError('');

        try {
          const response =
            await api.get(
              '/admin/pengajuan/sku',
              {
                params: {
                  page,
                  per_page:
                    PAGE_SIZE,
                },
              }
            );

          const paginator =
            response.data?.data;

          const data =
            Array.isArray(
              paginator
            )
              ? paginator
              : paginator?.data ||
                [];

          setSkuList(
            data
          );

          setPagination({
            current_page:
              paginator?.current_page ||
              page,

            last_page:
              paginator?.last_page ||
              1,

            per_page:
              paginator?.per_page ||
              PAGE_SIZE,

            total:
              paginator?.total ||
              data.length ||
              0,
          });

          setCurrentPage(
            paginator?.current_page ||
              page
          );
        } catch (
          err
        ) {
          setError(
            err.response?.data
              ?.message ||
              'Gagal mengambil pengajuan SKU.'
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
      fetchSku();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | CLEANUP PREVIEW
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
    | DERIVED DATA
    |--------------------------------------------------------------------------
    */

    const processedData =
      useMemo(
        () => {
          return skuList.filter(
            (item) =>
              item.status ===
                'menunggu_verifikasi' ||
              item.status ===
                'diproses'
          );
        },
        [
          skuList,
        ]
      );

    const completedData =
      useMemo(
        () => {
          return skuList.filter(
            (item) =>
              item.status ===
                'disetujui' ||
              item.status ===
                'ditolak'
          );
        },
        [
          skuList,
        ]
      );

    const activeData =
      activeTab ===
      'diproses'
        ? processedData
        : completedData;

    const filteredData =
      statusFilter ===
      'semua'
        ? activeData
        : activeData.filter(
            (item) =>
              item.status ===
              statusFilter
          );

    /*
    |--------------------------------------------------------------------------
    | DETAIL
    |--------------------------------------------------------------------------
    */

    const handleViewDetail =
      async (
        id
      ) => {
        setDetailLoading(
          true
        );

        setError('');
        setSuccess('');
        setSelected(null);

        try {
          const response =
            await api.get(
              `/admin/pengajuan/sku/${id}`
            );

          setSelected(
            response.data?.data ||
              null
          );
        } catch (
          err
        ) {
          setError(
            err.response?.data
              ?.message ||
              'Detail pengajuan SKU gagal diambil.'
          );
        } finally {
          setDetailLoading(
            false
          );
        }
      };

    /*
    |--------------------------------------------------------------------------
    | STATUS MODAL
    |--------------------------------------------------------------------------
    */

    const openStatusModal =
      (
        item,
        status
      ) => {
        setStatusModal({
          id: item.id,
          status,
          nama:
            item.nama_lengkap ||
            '-',
        });

        setCatatanAdmin(
          status ===
            'ditolak'
            ? ''
            : item.catatan_admin ||
                ''
        );

        setError('');
        setSuccess('');
      };

    const closeStatusModal =
      () => {
        if (
          actionLoading
        ) {
          return;
        }

        setStatusModal(
          null
        );

        setCatatanAdmin(
          ''
        );
      };

    /*
    |--------------------------------------------------------------------------
    | UPDATE STATUS
    |--------------------------------------------------------------------------
    */

    const handleUpdateStatus =
      async () => {
        if (
          !statusModal
        ) {
          return;
        }

        if (
          statusModal.status ===
            'ditolak' &&
          !catatanAdmin.trim()
        ) {
          setError(
            'Catatan wajib diisi ketika pengajuan ditolak.'
          );

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
              `/admin/pengajuan/sku/${statusModal.id}/status`,
              {
                status:
                  statusModal.status,

                catatan_admin:
                  catatanAdmin.trim() ||
                  null,
              }
            );

          const updated =
            response.data?.data ||
            null;

          setSuccess(
            response.data?.message ||
              'Status pengajuan SKU berhasil diperbarui.'
          );

          setStatusModal(
            null
          );

          setCatatanAdmin(
            ''
          );

          if (
            updated &&
            selected?.id ===
              updated.id
          ) {
            setSelected(
              updated
            );
          }

          await fetchSku(
            currentPage
          );
        } catch (
          err
        ) {
          const validationErrors =
            err.response?.data
              ?.errors;

          if (
            validationErrors
          ) {
            const firstError =
              Object.values(
                validationErrors
              )
                .flat()
                .find(
                  Boolean
                );

            setError(
              firstError ||
                err.response?.data
                  ?.message ||
                'Data status tidak valid.'
            );
          } else {
            setError(
              err.response?.data
                ?.message ||
                'Status pengajuan SKU gagal diperbarui.'
            );
          }
        } finally {
          setActionLoading(
            false
          );
        }
      };

    /*
    |--------------------------------------------------------------------------
    | DOCUMENT
    |--------------------------------------------------------------------------
    */

    const handleOpenDocument =
      async (
        document
      ) => {
        if (
          !document?.url
        ) {
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
          | CEK JSON ERROR
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
              'Dokumen gagal dibuka.';

            try {
              const json =
                JSON.parse(
                  text
                );

              message =
                json?.message ||
                message;
            } catch {
              // Bukan JSON valid.
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
          setSelectedDocument(
            null
          );

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
          setDocumentLoading(
            false
          );
        }
      };

    const closeDocumentPreview =
      () => {
        if (
          documentPreviewUrl
        ) {
          window.URL.revokeObjectURL(
            documentPreviewUrl
          );
        }

        setSelectedDocument(
          null
        );

        setDocumentPreviewUrl(
          ''
        );

        setDocumentPreviewType(
          ''
        );

        setDocumentPreviewName(
          ''
        );

        setDocumentLoading(
          false
        );
      };

    /*
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    */

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

    const getDocumentLabel =
      (
        jenis
      ) => {
        const labels = {
          ktp:
            'Kartu Tanda Penduduk',

          kk:
            'Kartu Keluarga',

          foto_tempat_usaha:
            'Foto Tempat Usaha',
        };

        return (
          labels[jenis] ||
          jenis ||
          '-'
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

    const formatDateOnly =
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

        return date.toLocaleDateString(
          'id-ID',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }
        );
      };

    const getGenderLabel =
      (
        value
      ) => {
        if (
          value ===
          'L'
        ) {
          return 'Laki-laki';
        }

        if (
          value ===
          'P'
        ) {
          return 'Perempuan';
        }

        return (
          value ||
          '-'
        );
      };

    const isExpired =
      (
        item
      ) => {
        return (
          item?.status ===
            'disetujui' &&
          (
            item?.is_expired ===
              true ||
            item?.eligibility ===
              'expired'
          )
        );
      };

    const handlePageChange =
      (
        page
      ) => {
        if (
          page < 1 ||
          page >
            pagination.last_page ||
          page ===
            pagination.current_page
        ) {
          return;
        }

        fetchSku(
          page
        );
      };

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
      <div>

        {/* =========================================================
            HEADER
        ========================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="font-headline-lg text-on-background">
                Pengajuan SKU
              </h1>

              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-primary text-xs font-semibold">

                <span className="material-symbols-outlined text-sm">
                  admin_panel_settings
                </span>

                Super Admin

              </span>

            </div>

            <p className="font-body-md text-on-surface-variant mt-1">
              Kelola pengajuan Surat Keterangan Usaha dan verifikasi dokumen masyarakat.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              fetchSku(
                pagination.current_page
              )
            }
            disabled={
              loading
            }
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors disabled:opacity-50"
          >

            <span className="material-symbols-outlined">
              refresh
            </span>

            Refresh

          </button>

        </motion.div>

        {/* =========================================================
            MESSAGES
        ========================================================== */}

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
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >

            <div className="flex items-start gap-3">

              <span className="material-symbols-outlined">
                error
              </span>

              <span className="wrap-break-word">
                {error}
              </span>

            </div>

          </motion.div>
        )}

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
            className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
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

        {/* =========================================================
            TABS
        ========================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

          <div className="flex gap-2 border-b border-outline-variant/20 pb-2">

            {TABS.map(
              (
                tab
              ) => {
                const count =
                  tab.value ===
                  'diproses'
                    ? processedData.length
                    : completedData.length;

                return (
                  <button
                    key={
                      tab.value
                    }
                    type="button"
                    onClick={() => {
                      setActiveTab(
                        tab.value
                      );

                      setStatusFilter(
                        'semua'
                      );
                    }}
                    className={`px-4 py-2 rounded-xl font-label-md transition-all ${
                      activeTab ===
                      tab.value
                        ? 'bg-primary text-white'
                        : 'text-on-surface-variant hover:bg-primary/10'
                    }`}
                  >

                    {tab.label}

                    <span className="ml-1 opacity-80">
                      (
                      {
                        count
                      }
                      )
                    </span>

                  </button>
                );
              }
            )}

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
            }}
            className="h-11 px-4 rounded-xl bg-surface border border-outline-variant/40 text-sm outline-none focus:border-primary"
          >

            <option value="semua">
              Semua Status
            </option>

            {activeTab ===
            'diproses' ? (
              <>
                <option value="menunggu_verifikasi">
                  Menunggu Verifikasi
                </option>

                <option value="diproses">
                  Diproses
                </option>
              </>
            ) : (
              <>
                <option value="disetujui">
                  Disetujui
                </option>

                <option value="ditolak">
                  Ditolak
                </option>
              </>
            )}

          </select>

        </div>

        {/* =========================================================
            TABLE
        ========================================================== */}

        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-1000px">

              <thead className="bg-surface-container-low border-b border-outline-variant/20">

                <tr>

                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                    ID
                  </th>

                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                    Pemohon
                  </th>

                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                    Nama Usaha
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
                    length: 6,
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
                ) : filteredData.length ===
                  0 ? (
                  <tr>

                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-on-surface-variant"
                    >
                      Belum ada pengajuan SKU pada kategori ini.
                    </td>

                  </tr>
                ) : (
                  filteredData.map(
                    (
                      item
                    ) => {
                      const status =
                        getStatusStyle(
                          item.status
                        );

                      const expired =
                        isExpired(
                          item
                        );

                      return (
                        <tr
                          key={
                            item.id
                          }
                          className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors"
                        >

                          <td className="px-6 py-4">

                            <span className="font-label-md font-semibold text-primary">
                              #
                              {
                                item.id
                              }
                            </span>

                          </td>

                          <td className="px-6 py-4">

                            <div>

                              <p className="font-label-md font-semibold text-on-surface">
                                {
                                  item.nama_lengkap
                                }
                              </p>

                              <p className="font-label-sm text-on-surface-variant mt-1">
                                {
                                  item.user
                                    ?.email
                                }
                              </p>

                            </div>

                          </td>

                          <td className="px-6 py-4">

                            <div>

                              <p className="font-label-md font-semibold text-on-surface">
                                {
                                  item.nama_usaha
                                }
                              </p>

                              <p className="font-label-sm text-on-surface-variant mt-1">
                                {
                                  item.jenis_usaha ||
                                  '-'
                                }
                              </p>

                            </div>

                          </td>

                          <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">
                            {
                              formatDate(
                                item.created_at
                              )
                            }
                          </td>

                          <td className="px-6 py-4">

                            <div className="flex flex-col items-start gap-2">

                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} ${status.text} font-label-sm`}
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

                              {expired && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">

                                  <span className="material-symbols-outlined text-sm">
                                    event_busy
                                  </span>

                                  Kedaluwarsa

                                </span>
                              )}

                            </div>

                          </td>

                          <td className="px-6 py-4 text-right">

                            <div className="flex items-center justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleViewDetail(
                                    item.id
                                  )
                                }
                                className="px-3 py-2 rounded-lg border border-outline-variant/30 text-primary hover:bg-primary/5 text-sm"
                              >
                                Detail
                              </button>

                              {activeTab ===
                                'diproses' &&
                                item.status ===
                                  'menunggu_verifikasi' && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openStatusModal(
                                        item,
                                        'diproses'
                                      )
                                    }
                                    className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                                  >
                                    Proses
                                  </button>
                                )}

                              {activeTab ===
                                'diproses' &&
                                (
                                  item.status ===
                                    'diproses' ||
                                  item.status ===
                                    'menunggu_verifikasi'
                                ) && (
                                  <>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        openStatusModal(
                                          item,
                                          'disetujui'
                                        )
                                      }
                                      className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm"
                                    >
                                      Setujui
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        openStatusModal(
                                          item,
                                          'ditolak'
                                        )
                                      }
                                      className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
                                    >
                                      Tolak
                                    </button>

                                  </>
                                )}

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}

          {!loading &&
            pagination.last_page >
              1 && (
              <div className="px-6 py-4 border-t border-outline-variant/20 flex items-center justify-between gap-4">

                <p className="text-sm text-on-surface-variant">

                  Halaman{' '}

                  {
                    pagination.current_page
                  }

                  {' '}dari{' '}

                  {
                    pagination.last_page
                  }

                </p>

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    disabled={
                      pagination.current_page ===
                      1
                    }
                    onClick={() =>
                      handlePageChange(
                        pagination.current_page -
                          1
                      )
                    }
                    className="px-3 py-2 rounded-lg border border-outline-variant/40 text-sm disabled:opacity-40"
                  >
                    Sebelumnya
                  </button>

                  <button
                    type="button"
                    disabled={
                      pagination.current_page ===
                      pagination.last_page
                    }
                    onClick={() =>
                      handlePageChange(
                        pagination.current_page +
                          1
                      )
                    }
                    className="px-3 py-2 rounded-lg border border-outline-variant/40 text-sm disabled:opacity-40"
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

        {(selected ||
          detailLoading) && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              if (
                !detailLoading &&
                !documentLoading
              ) {
                setSelected(
                  null
                );
              }
            }}
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
              className="w-[min(94vw,64rem)] bg-surface-container-lowest rounded-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
            >

              {/* HEADER MODAL */}

              <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between shrink-0">

                <div>

                  <p className="font-label-sm text-primary">
                    {selected
                      ? `#${selected.id}`
                      : 'Detail'}
                  </p>

                  <h2 className="font-headline-md text-on-surface mt-1">
                    Detail Pengajuan SKU
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelected(
                      null
                    )
                  }
                  disabled={
                    detailLoading ||
                    documentLoading
                  }
                  className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center disabled:opacity-50"
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
                    Memuat detail...
                  </p>

                </div>
              ) : (
                selected && (
                  <>

                    <div className="p-6 overflow-y-auto min-h-0 space-y-6">

                      {/* STATUS */}

                      <section className="rounded-2xl bg-primary/5 border border-primary/10 p-5">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                          <div>

                            <p className="text-xs text-on-surface-variant">
                              Status
                            </p>

                            {(() => {
                              const status =
                                getStatusStyle(
                                  selected.status
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
                                      selected.status
                                    )
                                  }

                                </span>
                              );
                            })()}

                          </div>

                          <div className="sm:text-right">

                            <p className="text-xs text-on-surface-variant">
                              Tanggal Pengajuan
                            </p>

                            <p className="font-label-md font-semibold text-on-surface mt-1">
                              {
                                formatDate(
                                  selected.created_at
                                )
                              }
                            </p>

                          </div>

                        </div>

                        {isExpired(
                          selected
                        ) && (
                          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                            <div className="flex items-start gap-3">

                              <span className="material-symbols-outlined text-red-600">
                                event_busy
                              </span>

                              <div>

                                <p className="font-label-md font-semibold text-red-700">
                                  Pengajuan SKU kedaluwarsa
                                </p>

                                <p className="text-sm text-red-700/80 mt-1">
                                  Masa berlaku pengajuan ini telah berakhir.
                                </p>

                              </div>

                            </div>

                          </div>
                        )}

                      </section>

                      {/* ANTREAN */}

                      {selected.status ===
                        'disetujui' &&
                        selected.no_antrian && (
                          <section
                            className={`rounded-2xl border p-6 ${
                              isExpired(
                                selected
                              )
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
                                  isExpired(
                                    selected
                                  )
                                    ? 'text-slate-500'
                                    : 'text-green-700'
                                }`}
                              >
                                {
                                  selected.no_antrian
                                }
                              </p>

                              <p className="text-sm text-on-surface-variant mt-2">
                                Antrean pelayanan Surat Keterangan Usaha.
                              </p>

                            </div>

                            <div className="mt-6 space-y-4">

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {selected.visit_date && (
                                  <div
                                    className={`rounded-xl bg-white/70 border px-4 py-4 ${
                                      isExpired(
                                        selected
                                      )
                                        ? 'border-slate-200'
                                        : 'border-green-200'
                                    }`}
                                  >

                                    <div className="flex items-start gap-3">

                                      <span
                                        className={`material-symbols-outlined ${
                                          isExpired(
                                            selected
                                          )
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
                                          {selected.visit_date_label ||
                                            formatDateOnly(
                                              selected.visit_date
                                            )}
                                        </p>

                                      </div>

                                    </div>

                                  </div>
                                )}

                                {selected.service_hours && (
                                  <div
                                    className={`rounded-xl bg-white/70 border px-4 py-4 ${
                                      isExpired(
                                        selected
                                      )
                                        ? 'border-slate-200'
                                        : 'border-green-200'
                                    }`}
                                  >

                                    <div className="flex items-start gap-3">

                                      <span
                                        className={`material-symbols-outlined ${
                                          isExpired(
                                            selected
                                          )
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
                                            selected
                                              .service_hours
                                              .label
                                          }
                                        </p>

                                      </div>

                                    </div>

                                  </div>
                                )}

                              </div>

                              {selected.expired_date && (
                                <div
                                  className={`rounded-xl bg-white/70 border px-4 py-4 ${
                                    isExpired(
                                      selected
                                    )
                                      ? 'border-slate-200'
                                      : 'border-green-200'
                                  }`}
                                >

                                  <div className="flex items-start gap-3">

                                    <span
                                      className={`material-symbols-outlined ${
                                        isExpired(
                                          selected
                                        )
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
                                          selected.expired_date
                                        }
                                      </p>

                                    </div>

                                  </div>

                                </div>
                              )}

                            </div>

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
                              selected.nama_lengkap
                            }
                          />

                          <InfoRow
                            label="Email"
                            value={
                              selected.user
                                ?.email
                            }
                          />

                          <InfoRow
                            label="NIK"
                            value={
                              selected.nik
                            }
                            mono
                          />

                          <InfoRow
                            label="Nomor KK"
                            value={
                              selected.nomor_kk
                            }
                            mono
                          />

                          <InfoRow
                            label="Tempat Lahir"
                            value={
                              selected.tempat_lahir
                            }
                          />

                          <InfoRow
                            label="Tanggal Lahir"
                            value={formatDateOnly(
                              selected.tanggal_lahir
                            )}
                          />

                          <InfoRow
                            label="Jenis Kelamin"
                            value={getGenderLabel(
                              selected.jenis_kelamin
                            )}
                          />

                          <InfoRow
                            label="Kode Pos"
                            value={
                              selected.kode_pos
                            }
                          />

                          <div className="md:col-span-2">

                            <InfoRow
                              label="Alamat"
                              value={`${selected.alamat || '-'} RT ${selected.rt || '-'} / RW ${selected.rw || '-'}`}
                            />

                          </div>

                        </div>

                      </section>

                      {/* DATA USAHA */}

                      <section>

                        <h3 className="font-label-md font-semibold text-primary mb-3">
                          Data Usaha
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          <InfoRow
                            label="Nama Usaha"
                            value={
                              selected.nama_usaha
                            }
                          />

                          <InfoRow
                            label="Jenis Usaha"
                            value={
                              selected.jenis_usaha
                            }
                          />

                          <InfoRow
                            label="Lama Menjalankan Usaha"
                            value={
                              selected.lama_menjalankan_usaha !==
                              null
                                ? `${selected.lama_menjalankan_usaha} tahun`
                                : '-'
                            }
                          />

                          <InfoRow
                            label="Perkiraan Penghasilan"
                            value={
                              selected.perkiraan_penghasilan_per_bulan
                            }
                          />

                          <div className="md:col-span-2">

                            <InfoRow
                              label="Deskripsi Usaha"
                              value={
                                selected.deskripsi_usaha
                              }
                            />

                          </div>

                          <div className="md:col-span-2">

                            <InfoRow
                              label="Alamat Usaha"
                              value={`${selected.alamat_usaha || '-'} RT ${selected.rt_usaha || '-'} / RW ${selected.rw_usaha || '-'}`}
                            />

                          </div>

                        </div>

                      </section>

                      {/* APPROVAL */}

                      {(selected.approved_at ||
                        selected.no_antrian) && (
                        <section>

                          <h3 className="font-label-md font-semibold text-primary mb-3">
                            Informasi Persetujuan
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {selected.approved_at && (
                              <InfoRow
                                label="Disetujui Pada"
                                value={formatDate(
                                  selected.approved_at
                                )}
                              />
                            )}

                            {selected.no_antrian && (
                              <InfoRow
                                label="Nomor Antrean"
                                value={
                                  selected.no_antrian
                                }
                                mono
                              />
                            )}

                            {selected.visit_date && (
                              <InfoRow
                                label="Tanggal Kunjungan"
                                value={
                                  selected.visit_date_label ||
                                  formatDateOnly(
                                    selected.visit_date
                                  )
                                }
                              />
                            )}

                            {selected.expired_date && (
                              <InfoRow
                                label="Berlaku Sampai"
                                value={
                                  selected.expired_date
                                }
                              />
                            )}

                          </div>

                        </section>
                      )}

                      {/* CATATAN ADMIN */}

                      {selected.catatan_admin && (
                        <section>

                          <h3 className="font-label-md font-semibold text-primary mb-3">
                            Catatan Admin
                          </h3>

                          <div className="rounded-xl bg-surface-container-low p-4">

                            <p className="text-sm text-on-surface whitespace-pre-line wrap-break-word">
                              {
                                selected.catatan_admin
                              }
                            </p>

                          </div>

                        </section>
                      )}

                      {/* DOKUMEN */}

                      <section>

                        <div className="flex items-center justify-between gap-4 mb-3">

                          <h3 className="font-label-md font-semibold text-primary">
                            Dokumen Pendukung
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

                        {selected.dokumen?.length >
                        0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            {selected.dokumen.map(
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
                                      {
                                        getDocumentLabel(
                                          document.jenis_dokumen
                                        )
                                      }
                                    </p>

                                    <p className="text-xs text-on-surface-variant truncate mt-1">
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

                        {selected.riwayat?.length >
                        0 ? (
                          <div className="space-y-4">

                            {selected.riwayat.map(
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
                                  selected
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
                                          className={`inline-flex w-fit items-center gap-1 px-3 py-1 rounded-full ${status.bg} ${status.text} text-xs font-semibold`}
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

                                        <span className="text-xs text-on-surface-variant">
                                          {
                                            formatDate(
                                              history.created_at
                                            )
                                          }
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
                          <div className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
                            Belum ada riwayat status.
                          </div>
                        )}

                      </section>

                    </div>

                    {/* FOOTER */}

                    <div className="px-6 py-4 border-t border-outline-variant/20 flex flex-wrap justify-end gap-3 shrink-0">

                      {(
                        selected.status ===
                          'menunggu_verifikasi' ||
                        selected.status ===
                          'diproses'
                      ) && (
                        <>

                          {selected.status ===
                            'menunggu_verifikasi' && (
                            <button
                              type="button"
                              onClick={() =>
                                openStatusModal(
                                  selected,
                                  'diproses'
                                )
                              }
                              disabled={
                                actionLoading
                              }
                              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              Tandai Diproses
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              openStatusModal(
                                selected,
                                'disetujui'
                              )
                            }
                            disabled={
                              actionLoading
                            }
                            className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Setujui
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openStatusModal(
                                selected,
                                'ditolak'
                              )
                            }
                            disabled={
                              actionLoading
                            }
                            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            Tolak
                          </button>

                        </>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setSelected(
                            null
                          )
                        }
                        disabled={
                          documentLoading
                        }
                        className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
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
            STATUS MODAL
        ========================================================== */}

        {statusModal && (
          <div
            className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              if (
                !actionLoading
              ) {
                closeStatusModal();
              }
            }}
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
              className="w-[min(92vw,32rem)] bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden"
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="px-6 py-5 border-b border-outline-variant/20">

                <h2 className="font-headline-md text-on-surface">

                  {statusModal.status ===
                  'diproses'
                    ? 'Proses Pengajuan'
                    : statusModal.status ===
                        'disetujui'
                      ? 'Setujui Pengajuan'
                      : 'Tolak Pengajuan'}

                </h2>

                <p className="text-sm text-on-surface-variant mt-1 wrap-break-word">

                  Pengajuan #
                  {
                    statusModal.id
                  }{' '}
                  atas nama{' '}

                  <strong>
                    {
                      statusModal.nama
                    }
                  </strong>

                </p>

              </div>

              {/* BODY */}

              <div className="p-6">

                <label
                  htmlFor="catatanAdminSku"
                  className="block font-label-md font-semibold text-on-surface mb-2"
                >

                  Catatan Admin

                  {statusModal.status ===
                    'ditolak' && (
                    <span className="text-red-600">
                      {' '}
                      *
                    </span>
                  )}

                </label>

                <textarea
                  id="catatanAdminSku"
                  value={
                    catatanAdmin
                  }
                  onChange={(
                    event
                  ) =>
                    setCatatanAdmin(
                      event.target
                        .value
                    )
                  }
                  rows={5}
                  maxLength={5000}
                  disabled={
                    actionLoading
                  }
                  placeholder={
                    statusModal.status ===
                    'ditolak'
                      ? 'Jelaskan alasan pengajuan ditolak...'
                      : 'Tambahkan catatan untuk pemohon (opsional)...'
                  }
                  className="block w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none"
                />

                <div className="flex justify-end mt-1">

                  <span className="text-xs text-on-surface-variant">

                    {
                      catatanAdmin.length
                    }
                    /5000

                  </span>

                </div>

              </div>

              {/* FOOTER */}

              <div className="px-6 py-4 border-t border-outline-variant/20 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

                <button
                  type="button"
                  onClick={
                    closeStatusModal
                  }
                  disabled={
                    actionLoading
                  }
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={
                    handleUpdateStatus
                  }
                  disabled={
                    actionLoading
                  }
                  className={`w-full sm:w-auto px-5 py-3 rounded-xl text-white font-semibold disabled:opacity-50 ${
                    statusModal.status ===
                    'ditolak'
                      ? 'bg-red-600 hover:bg-red-700'
                      : statusModal.status ===
                          'disetujui'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >

                  {actionLoading
                    ? 'Memproses...'
                    : statusModal.status ===
                        'ditolak'
                      ? 'Tolak Pengajuan'
                      : statusModal.status ===
                          'disetujui'
                        ? 'Setujui Pengajuan'
                        : 'Tandai Diproses'}

                </button>

              </div>

            </motion.div>

          </div>
        )}

        {/* =========================================================
            DOCUMENT PREVIEW
        ========================================================== */}

        {selectedDocument && (
          <div
            className="fixed inset-0 z-70 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={
              closeDocumentPreview
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

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        !documentPreviewUrl
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
                        documentPreviewName ||
                        'dokumen';

                      window.document.body.appendChild(
                        anchor
                      );

                      anchor.click();

                      window.document.body.removeChild(
                        anchor
                      );
                    }}
                    disabled={
                      !documentPreviewUrl
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-container disabled:opacity-50"
                  >

                    <span className="material-symbols-outlined">
                      download
                    </span>

                    Download

                  </button>

                  <button
                    type="button"
                    onClick={
                      closeDocumentPreview
                    }
                    className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center"
                    aria-label="Tutup preview"
                  >

                    <span className="material-symbols-outlined">
                      close
                    </span>

                  </button>

                </div>

              </div>

              {/* BODY */}

              <div className="flex-1 min-h-0 bg-neutral-200 p-3">

                {documentLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-on-surface-variant">

                    <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                      progress_activity
                    </span>

                    <p className="mt-3">
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

export default SuperAdminPengajuanSku;
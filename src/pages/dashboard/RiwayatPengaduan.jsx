import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


import api from '../../api/axios';

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

const RiwayatPengaduanPage = () => {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Layout
  |--------------------------------------------------------------------------
  */

  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const [
    pengaduanData,
    setPengaduanData,
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
    statusFilter,
    setStatusFilter,
  ] = useState('semua');

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

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
    fotoBuktiLoading,
    setFotoBuktiLoading,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Message
  |--------------------------------------------------------------------------
  */

  const [
    error,
    setError,
  ] = useState('');

  const [
    success,
    setSuccess,
  ] = useState('');

  /*
  |--------------------------------------------------------------------------
  | Selected Pengaduan
  |--------------------------------------------------------------------------
  */

  const [
    selectedPengaduan,
    setSelectedPengaduan,
  ] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Document Preview
  |--------------------------------------------------------------------------
  */

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
    previewLoading,
    setPreviewLoading,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Foto Bukti Preview
  |--------------------------------------------------------------------------
  */

  const [
    fotoBuktiPreviewUrl,
    setFotoBuktiPreviewUrl,
  ] = useState('');

  const [
    showFotoBuktiPreview,
    setShowFotoBuktiPreview,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Fetch Pengaduan
  |--------------------------------------------------------------------------
  */

  const fetchPengaduan = async (
    page = 1
  ) => {
    setLoading(true);
    setError('');

    try {
      const response =
        await api.get(
          '/pengaduan',
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
        currentPage: page,
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

      setPengaduanData(
        data
      );

      setPagination(
        meta
      );

      setCurrentPage(
        meta.currentPage
      );
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
          'Gagal mengambil riwayat pengaduan.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengaduan(
      currentPage
    );
  }, [
    currentPage,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Cleanup Document Preview
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
  | Cleanup Foto Bukti Preview
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (
        fotoBuktiPreviewUrl
      ) {
        window.URL.revokeObjectURL(
          fotoBuktiPreviewUrl
        );
      }
    };
  }, [
    fotoBuktiPreviewUrl,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Filter
  |--------------------------------------------------------------------------
  */

  const filteredData =
    useMemo(() => {
      if (
        statusFilter ===
        'semua'
      ) {
        return pengaduanData;
      }

      return pengaduanData.filter(
        (item) =>
          item.status ===
          statusFilter
      );
    }, [
      pengaduanData,
      statusFilter,
    ]);

  /*
  |--------------------------------------------------------------------------
  | View Detail
  |--------------------------------------------------------------------------
  */

  const handleViewDetail = async (
    item
  ) => {
    if (!item?.id) {
      return;
    }

    setDetailLoading(
      true
    );

    setError('');
    setSuccess('');

    setSelectedPengaduan(
      null
    );

    /*
    |--------------------------------------------------------------------------
    | Tutup Preview Foto Lama
    |--------------------------------------------------------------------------
    */

    if (
      fotoBuktiPreviewUrl
    ) {
      window.URL.revokeObjectURL(
        fotoBuktiPreviewUrl
      );
    }

    setFotoBuktiPreviewUrl(
      ''
    );

    setShowFotoBuktiPreview(
      false
    );

    try {
      const response =
        await api.get(
          `/pengaduan/${item.id}`
        );

      const data =
        response.data?.data ||
        null;

      if (data) {
        setSelectedPengaduan(
          data
        );
      }
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
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
  | Open Foto Bukti
  |--------------------------------------------------------------------------
  |
  | Jangan menggunakan <a href> langsung karena endpoint foto private
  | membutuhkan Authorization Bearer Token.
  |
  */

  const handleOpenFotoBukti =
    async () => {
      const fotoUrl =
        selectedPengaduan
          ?.foto_bukti
          ?.url;

      if (!fotoUrl) {
        setError(
          'URL foto bukti tidak tersedia.'
        );

        return;
      }

      setFotoBuktiLoading(
        true
      );

      setError('');
      setSuccess('');

      /*
      |--------------------------------------------------------------------------
      | Hapus Blob URL Lama
      |--------------------------------------------------------------------------
      */

      if (
        fotoBuktiPreviewUrl
      ) {
        window.URL.revokeObjectURL(
          fotoBuktiPreviewUrl
        );
      }

      setFotoBuktiPreviewUrl(
        ''
      );

      try {
        /*
        |--------------------------------------------------------------------------
        | Request Private File
        |--------------------------------------------------------------------------
        |
        | Axios interceptor akan otomatis menambahkan:
        | Authorization: Bearer <token>
        |
        */

        const response =
          await api.get(
            fotoUrl,
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
        |--------------------------------------------------------------------------
        | Kemungkinan Response JSON Error
        |--------------------------------------------------------------------------
        */

        if (
          contentType.includes(
            'application/json'
          )
        ) {
          const text =
            await response.data.text();

          let message =
            'Foto bukti gagal dibuka.';

          try {
            const json =
              JSON.parse(
                text
              );

            message =
              json?.message ||
              message;
          } catch {
            // Abaikan apabila response bukan JSON valid.
          }

          throw new Error(
            message
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Pastikan File adalah Gambar
        |--------------------------------------------------------------------------
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

        /*
        |--------------------------------------------------------------------------
        | Buat Blob URL
        |--------------------------------------------------------------------------
        */

        const blob =
          new Blob(
            [
              response.data,
            ],
            {
              type: contentType,
            }
          );

        const objectUrl =
          window.URL.createObjectURL(
            blob
          );

        setFotoBuktiPreviewUrl(
          objectUrl
        );

        setShowFotoBuktiPreview(
          true
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            err.message ||
            'Foto bukti gagal dibuka.'
        );
      } finally {
        setFotoBuktiLoading(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Close Foto Bukti
  |--------------------------------------------------------------------------
  */

  const handleCloseFotoBukti =
    () => {
      if (
        fotoBuktiPreviewUrl
      ) {
        window.URL.revokeObjectURL(
          fotoBuktiPreviewUrl
        );
      }

      setShowFotoBuktiPreview(
        false
      );

      setFotoBuktiPreviewUrl(
        ''
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Document Preview
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

      setPreviewLoading(
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
            // Abaikan jika response bukan JSON.
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

        setPreviewLoading(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Close Document Preview
  |--------------------------------------------------------------------------
  */

  const handleCloseDocumentPreview =
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

      setPreviewLoading(
        false
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Download Document
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

  const getPageNumbers = () => {
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

  const handlePageChange = (
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

  const totalTerkirim =
    pengaduanData.filter(
      (item) =>
        item.status ===
        'terkirim'
    ).length;

  const totalDiteruskan =
    pengaduanData.filter(
      (item) =>
        item.status ===
        'diteruskan'
    ).length;

  const totalSelesai =
    pengaduanData.filter(
      (item) =>
        item.status ===
        'selesai'
    ).length;

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-background">



      <div className="min-w-0">

        <main className="p-4 sm:p-6 lg:p-8">

          <div className="max-w-7xl mx-auto min-w-0">

            {/* =====================================================
                HEADER
            ====================================================== */}

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

              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                <div className="min-w-0">

                  <div className="flex items-center gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        navigate(-1)
                      }
                      className="w-10 h-10 shrink-0 rounded-xl border border-outline-variant/30 hover:bg-primary/10 flex items-center justify-center text-on-surface-variant transition-colors"
                    >

                      <span className="material-symbols-outlined">
                        arrow_back
                      </span>

                    </button>

                    <div className="min-w-0">

                      <h1 className="font-headline-lg text-on-background">
                        Riwayat Pengaduan
                      </h1>

                      <p className="font-body-md text-on-surface-variant mt-2">
                        Pantau status,
                        respons petugas,
                        dan riwayat
                        pengaduan Anda.
                      </p>

                    </div>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/dashboard/pengaduan'
                    )
                  }
                  className="w-full xl:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-label-md font-semibold hover:bg-primary-container transition-colors shrink-0"
                >

                  <span className="material-symbols-outlined">
                    add
                  </span>

                  Buat Pengaduan

                </button>

              </div>

            </motion.section>

            {/* =====================================================
                ERROR
            ====================================================== */}

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

                  <span className="wrap-break-word min-w-0">
                    {error}
                  </span>

                </div>

              </motion.div>
            )}

            {/* =====================================================
                SUCCESS
            ====================================================== */}

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

            {/* =====================================================
                SUMMARY
            ====================================================== */}

            {!loading &&
              pengaduanData.length >
                0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

                  <SummaryCard
                    icon="description"
                    label="Total"
                    value={
                      pagination.total
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
              )}

            {/* =====================================================
                FILTER
            ====================================================== */}

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

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div className="min-w-0">

                  <h2 className="font-headline-md text-on-surface text-lg">
                    Daftar Pengaduan
                  </h2>

                  <p className="font-label-sm text-on-surface-variant mt-1">
                    Menampilkan{' '}
                    {
                      filteredData.length
                    }{' '}
                    pengaduan pada
                    halaman ini.
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
                  className="h-11 px-4 rounded-xl bg-surface border border-outline-variant/40 text-sm outline-none focus:border-primary w-full lg:w-52"
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

            </motion.section>

            {/* =====================================================
                TABLE
            ====================================================== */}

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

              <div className="hidden lg:block overflow-x-auto">

                <table className="w-full min-w-275 table-fixed">

                  <colgroup>
                    <col className="w-20" />
                    <col className="w-[28%]" />
                    <col className="w-[24%]" />
                    <col className="w-[20%]" />
                    <col className="w-[15%]" />
                    <col className="w-32" />
                  </colgroup>

                  <thead>

                    <tr className="bg-surface-container-low border-b border-outline-variant/20">

                      <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant whitespace-nowrap">
                        ID
                      </th>

                      <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                        Pengaduan
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
                          className="py-16"
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
                                  0.3,
                                delay:
                                  index *
                                  0.04,
                              }}
                              className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors align-top"
                            >

                              <td className="px-6 py-5 align-top">

                                <span className="font-label-md font-semibold text-primary whitespace-nowrap">

                                  #

                                  {
                                    item.id
                                  }

                                </span>

                              </td>

                              <td className="px-6 py-5 align-top">

                                <div className="min-w-0">

                                  <p className="font-label-md font-semibold text-on-surface wrap-break-word">

                                    {
                                      item.subjek ||
                                      'Pengaduan'
                                    }

                                  </p>

                                  <p className="font-label-sm text-on-surface-variant mt-1 wrap-break-word line-clamp-3">

                                    {
                                      item.keterangan ||
                                      '-'
                                    }

                                  </p>

                                </div>

                              </td>

                              <td className="px-6 py-5 align-top">

                                <div className="min-w-0">

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

                              <td className="px-6 py-5 align-top whitespace-nowrap">

                                <div className="flex items-center gap-2 text-on-surface-variant">

                                  <span className="material-symbols-outlined shrink-0">
                                    calendar_today
                                  </span>

                                  <span className="font-label-md">
                                    {formatDate(
                                      item.created_at
                                    )}
                                  </span>

                                </div>

                              </td>

                              <td className="px-6 py-5 align-top whitespace-nowrap">

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

                              <td className="px-6 py-5 align-top whitespace-nowrap">

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

              {/* =====================================================
                  MOBILE
              ====================================================== */}

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
                ) : filteredData.length ===
                  0 ? (
                  <EmptyState />
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
                        <motion.div
                          key={
                            item.id
                          }
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

                              <p className="text-xs font-semibold text-primary">
                                #
                                {
                                  item.id
                                }
                              </p>

                              <h3 className="font-label-md font-semibold text-on-surface mt-1 wrap-break-word">
                                {
                                  item.subjek ||
                                  'Pengaduan'
                                }
                              </h3>

                            </div>

                            <span
                              className={`px-3 py-1.5 rounded-full ${status.bg} ${status.text} font-label-sm whitespace-nowrap shrink-0`}
                            >
                              {
                                getStatusLabel(
                                  item.status
                                )
                              }
                            </span>

                          </div>

                          <p className="text-sm text-on-surface-variant mt-3 line-clamp-3 wrap-break-word">
                            {
                              item.keterangan ||
                              '-'
                            }
                          </p>

                          <div className="flex items-start gap-2 mt-4 text-on-surface-variant">

                            <span className="material-symbols-outlined text-lg shrink-0">
                              location_on
                            </span>

                            <div className="min-w-0">

                              <p className="text-sm wrap-break-word">
                                {
                                  item.lokasi ||
                                  '-'
                                }
                              </p>

                              <p className="text-xs mt-1 whitespace-nowrap">
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

                          </div>

                          <div className="flex items-center gap-2 mt-4 text-on-surface-variant">

                            <span className="material-symbols-outlined">
                              calendar_today
                            </span>

                            <span className="text-xs whitespace-nowrap">
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

              {/* =====================================================
                  PAGINATION
              ====================================================== */}

              {!loading &&
                pagination.lastPage >
                  1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <p className="font-label-sm text-on-surface-variant">

                    Halaman{' '}

                    {
                      pagination.currentPage
                    }{' '}

                    dari{' '}

                    {
                      pagination.lastPage
                    }

                  </p>

                  <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">

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
                      className="px-4 py-2 rounded-lg border border-outline-variant/40 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="px-4 py-2 rounded-lg border border-outline-variant/40 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Berikutnya
                    </button>

                  </div>

                </div>
              )}

            </motion.section>

          </div>

        </main>

      </div>

      {/* ==================================================================
          DETAIL MODAL
      ================================================================== */}

      {(selectedPengaduan ||
        detailLoading) && (
        <div
          className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            if (
              !detailLoading &&
              !documentLoading &&
              !fotoBuktiLoading
            ) {
              setSelectedPengaduan(
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
            className="w-full max-w-5xl max-h-[92vh] bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between gap-4">

              <div className="min-w-0">

                <p className="font-label-sm text-primary">

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
                onClick={() =>
                  setSelectedPengaduan(
                    null
                  )
                }
                disabled={
                  detailLoading ||
                  documentLoading ||
                  fotoBuktiLoading
                }
                className="w-9 h-9 rounded-full hover:bg-primary/10 text-on-surface-variant hover:text-primary flex items-center justify-center disabled:opacity-50 shrink-0"
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
                  Memuat detail
                  pengaduan...
                </p>

              </div>
            ) : (
              selectedPengaduan && (
                <>

                  <div className="p-6 overflow-y-auto max-h-[calc(92vh-145px)] space-y-6">

                    {/* =================================================
                        STATUS
                    ================================================== */}

                    <section className="rounded-2xl border border-primary/10 bg-primary/5 p-5">

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>

                          <p className="text-xs text-on-surface-variant">
                            Status Saat Ini
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
                            Tanggal Pengaduan
                          </p>

                          <p className="font-label-md font-semibold text-on-surface mt-1">
                            {formatDate(
                              selectedPengaduan.created_at
                            )}
                          </p>

                        </div>

                      </div>

                    </section>

                    {/* =================================================
                        DETAIL PENGADUAN
                    ================================================== */}

                    <section>

                      <h3 className="font-label-md font-semibold text-primary mb-3">
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

                    {/* =================================================
                        DATA PELAPOR
                    ================================================== */}

                    <section>

                      <h3 className="font-label-md font-semibold text-primary mb-3">
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

                    </section>

                    {/* =================================================
                        FOTO BUKTI
                    ================================================== */}

                    {selectedPengaduan
                      .foto_bukti
                      ?.url && (
                      <section>

                        <h3 className="font-label-md font-semibold text-primary mb-3">
                          Foto Bukti
                        </h3>

                        <button
                          type="button"
                          onClick={
                            handleOpenFotoBukti
                          }
                          disabled={
                            fotoBuktiLoading
                          }
                          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-outline-variant/30 hover:bg-primary/5 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >

                          <span className="material-symbols-outlined">

                            {fotoBuktiLoading
                              ? 'progress_activity'
                              : 'image'}

                          </span>

                          {fotoBuktiLoading
                            ? 'Membuka Foto...'
                            : 'Buka Foto Bukti'}

                        </button>

                      </section>
                    )}

                    {/* =================================================
                        DOKUMEN
                    ================================================== */}

                    <section>

                      <div className="flex items-center justify-between gap-4 mb-3">

                        <h3 className="font-label-md font-semibold text-primary">
                          Dokumen Pendukung
                        </h3>

                        {documentLoading && (
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
                                  documentLoading ||
                                  fotoBuktiLoading
                                }
                                className="w-full flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 hover:border-primary/30 hover:bg-primary/5 transition-colors text-left disabled:opacity-60 disabled:cursor-wait"
                              >

                                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">

                                  <span className="material-symbols-outlined">
                                    description
                                  </span>

                                </div>

                                <div className="min-w-0 flex-1">

                                  <p className="font-label-md font-semibold text-on-surface truncate">
                                    {
                                      document.nama_file
                                    }
                                  </p>

                                  <p className="text-xs text-on-surface-variant mt-0.5">
                                    Klik untuk
                                    membuka
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
                          Tidak ada
                          dokumen pendukung.
                        </div>
                      )}

                    </section>

                    {/* =================================================
                        RESPONS
                    ================================================== */}

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

                                <p className="text-xs text-on-surface-variant mt-3">
                                  {
                                    formatDate(
                                      response.created_at
                                    )
                                  }
                                </p>

                              </div>
                            )
                          )}

                        </div>
                      ) : (
                        <div className="rounded-xl bg-surface-container-low px-4 py-4 text-sm text-on-surface-variant">
                          Belum ada
                          respons petugas.
                        </div>
                      )}

                    </section>

                    {/* =================================================
                        RIWAYAT
                    ================================================== */}

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

                                  <div className="flex-1 pb-2 min-w-0">

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
                                        {formatDate(
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
                          Belum ada riwayat
                          status.
                        </div>
                      )}

                    </section>

                  </div>

                  {/* FOOTER */}

                  <div className="px-6 py-4 border-t border-outline-variant/20 flex justify-end">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPengaduan(
                          null
                        )
                      }
                      disabled={
                        documentLoading ||
                        fotoBuktiLoading
                      }
                      className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
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

      {/* ==================================================================
          FOTO BUKTI PREVIEW MODAL
      ================================================================== */}

      {showFotoBuktiPreview &&
        fotoBuktiPreviewUrl && (
          <div
            className="fixed inset-0 z-120 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={
              handleCloseFotoBukti
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
              className="relative w-full max-w-6xl max-h-[90vh] flex items-center justify-center"
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
            >

              <img
                src={
                  fotoBuktiPreviewUrl
                }
                alt="Foto bukti pengaduan"
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl bg-white"
              />

              <button
                type="button"
                onClick={
                  handleCloseFotoBukti
                }
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                aria-label="Tutup foto bukti"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </motion.div>

          </div>
        )}

      {/* ==================================================================
          DOCUMENT PREVIEW MODAL
      ================================================================== */}

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
                  aria-label="Tutup preview dokumen"
                >

                  <span className="material-symbols-outlined">
                    close
                  </span>

                </button>

              </div>

            </div>

            {/* BODY */}

            <div className="flex-1 min-h-0 bg-neutral-200 p-3">

              {previewLoading ? (
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
                    Dokumen tidak dapat
                    ditampilkan.
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
| Summary Card
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

        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">

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
| Info Row
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
| Empty State
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
        Belum ada pengaduan yang
        sesuai dengan filter.
      </p>

    </div>
  );
};

export default RiwayatPengaduanPage;
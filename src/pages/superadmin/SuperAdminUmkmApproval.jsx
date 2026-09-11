import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { motion } from 'framer-motion';

import api from '../../api/axios';

/*
|--------------------------------------------------------------------------
| STATUS
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

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

const SuperAdminUmkmApproval = () => {
  /*
  |--------------------------------------------------------------------------
  | DATA
  |--------------------------------------------------------------------------
  */

  const [
    umkmList,
    setUmkmList,
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

  /*
  |--------------------------------------------------------------------------
  | UI STATE
  |--------------------------------------------------------------------------
  */

  const [
    selected,
    setSelected,
  ] = useState(null);

  const [
    detailLoading,
    setDetailLoading,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(null);

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
  | REJECT MODAL
  |--------------------------------------------------------------------------
  */

  const [
    showRejectModal,
    setShowRejectModal,
  ] = useState(false);

  const [
    rejectTarget,
    setRejectTarget,
  ] = useState(null);

  const [
    rejectNote,
    setRejectNote,
  ] = useState('');

  const [
    rejectError,
    setRejectError,
  ] = useState('');

  /*
  |--------------------------------------------------------------------------
  | PHOTO CAROUSEL
  |--------------------------------------------------------------------------
  */

  const [
    currentSlide,
    setCurrentSlide,
  ] = useState(0);

  const [
    photoUrls,
    setPhotoUrls,
  ] = useState({});

  const [
    photosLoading,
    setPhotosLoading,
  ] = useState(false);

  const [
    photoError,
    setPhotoError,
  ] = useState('');

  /*
  |--------------------------------------------------------------------------
  | FETCH DATA
  |--------------------------------------------------------------------------
  */

  const fetchUmkm = async (
    page = 1
  ) => {
    setLoading(true);
    setError('');

    try {
      const response =
        await api.get(
          '/admin/pengajuan/umkm',
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

      /*
      |----------------------------------------------------------------------
      | Laravel Resource Collection
      |----------------------------------------------------------------------
      */

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

      setUmkmList(
        data
      );

      setPagination(
        meta
      );

      setCurrentPage(
        meta.currentPage
      );
    } catch (
      err
    ) {
      setError(
        err.response?.data
          ?.message ||
          'Gagal mengambil daftar pengajuan UMKM.'
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
    fetchUmkm(
      currentPage
    );
  }, [
    currentPage,
  ]);

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const formatRupiah = (
    value
  ) => {
    const number =
      Number(value);

    if (
      Number.isNaN(
        number
      )
    ) {
      return 'Rp0';
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

  const getPhotos = (
    umkm
  ) => {
    if (
      !Array.isArray(
        umkm?.foto
      )
    ) {
      return [];
    }

    return [
      ...umkm.foto,
    ].sort(
      (
        a,
        b
      ) =>
        (
          a.urutan ||
          0
        ) -
        (
          b.urutan ||
          0
        )
    );
  };

  const selectedPhotos =
    useMemo(
      () =>
        getPhotos(
          selected
        ),
      [
        selected,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | LOAD PRIVATE UMKM PHOTOS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted =
      true;

    const objectUrls =
      [];

    const loadPhotos =
      async () => {
        if (
          selectedPhotos.length ===
          0
        ) {
          setPhotoUrls({});
          setPhotoError('');
          setPhotosLoading(
            false
          );

          return;
        }

        setPhotosLoading(
          true
        );

        setPhotoError('');
        setPhotoUrls({});

        try {
          const photoEntries =
            await Promise.all(
              selectedPhotos.map(
                async (
                  photo
                ) => {
                  if (
                    !photo?.id
                  ) {
                    return [
                      photo?.id,
                      null,
                    ];
                  }

                  try {
                    const response =
                      await api.get(
                        `/admin/files/umkm/${photo.id}`,
                        {
                          responseType:
                            'blob',
                        }
                      );

                    const contentType =
                      response
                        .headers
                        ?.[
                          'content-type'
                        ] ||
                      '';

                    if (
                      !contentType.startsWith(
                        'image/'
                      )
                    ) {
                      console.error(
                        `Response foto #${photo.id} bukan image:`,
                        contentType
                      );

                      return [
                        photo.id,
                        null,
                      ];
                    }

                    const objectUrl =
                      URL.createObjectURL(
                        response.data
                      );

                    objectUrls.push(
                      objectUrl
                    );

                    return [
                      photo.id,
                      objectUrl,
                    ];
                  } catch (
                    err
                  ) {
                    console.error(
                      `Gagal memuat foto UMKM #${photo.id}:`,
                      err
                    );

                    return [
                      photo.id,
                      null,
                    ];
                  }
                }
              )
            );

          if (!mounted) {
            return;
          }

          const mappedUrls =
            Object.fromEntries(
              photoEntries
            );

          setPhotoUrls(
            mappedUrls
          );

          const failedPhotos =
            photoEntries.filter(
              (
                [
                  ,
                  url,
                ]
              ) =>
                !url
            );

          if (
            failedPhotos.length >
            0
          ) {
            setPhotoError(
              'Sebagian foto UMKM tidak dapat dimuat.'
            );
          }
        } catch (
          err
        ) {
          if (
            mounted
          ) {
            setPhotoError(
              'Foto UMKM gagal dimuat.'
            );
          }
        } finally {
          if (
            mounted
          ) {
            setPhotosLoading(
              false
            );
          }
        }
      };

    loadPhotos();

    return () => {
      mounted = false;

      objectUrls.forEach(
        (
          objectUrl
        ) => {
          URL.revokeObjectURL(
            objectUrl
          );
        }
      );
    };
  }, [
    selectedPhotos,
  ]);

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

      setSelected(null);
      setCurrentSlide(0);
      setPhotoUrls({});
      setPhotoError('');
      setPhotosLoading(
        false
      );

      setDetailLoading(
        true
      );

      setError('');
      setSuccess('');

      try {
        const response =
          await api.get(
            `/admin/pengajuan/umkm/${item.id}`
          );

        const data =
          response.data
            ?.data;

        if (!data) {
          throw new Error(
            'Detail UMKM tidak ditemukan.'
          );
        }

        setSelected(
          data
        );
      } catch (
        err
      ) {
        setError(
          err.response?.data
            ?.message ||
            err.message ||
            'Detail UMKM gagal diambil.'
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
        detailLoading
      ) {
        return;
      }

      setSelected(
        null
      );

      setCurrentSlide(
        0
      );

      setPhotoUrls({});
      setPhotoError('');
      setPhotosLoading(
        false
      );
    };

  /*
  |--------------------------------------------------------------------------
  | UPDATE STATUS
  |--------------------------------------------------------------------------
  */

  const handleUpdateStatus =
    async (
      item,
      status
    ) => {
      if (
        !item?.id ||
        !status
      ) {
        return;
      }

      setError('');
      setSuccess('');

      setActionLoading(
        `${status}-${item.id}`
      );

      try {
        const response =
          await api.patch(
            `/admin/pengajuan/umkm/${item.id}/status`,
            {
              status,
            }
          );

        const updated =
          response.data
            ?.data;

        setUmkmList(
          (
            previous
          ) =>
            previous.map(
              (
                current
              ) =>
                current.id ===
                item.id
                  ? updated ||
                    {
                      ...current,
                      status,
                      is_active:
                        status ===
                        'disetujui',
                    }
                  : current
            )
        );

        if (
          selected?.id ===
          item.id
        ) {
          setSelected(
            updated ||
            {
              ...selected,
              status,
              is_active:
                status ===
                'disetujui',
            }
          );
        }

        setSuccess(
          response.data
            ?.message ||
            'Status pengajuan UMKM berhasil diperbarui.'
        );
      } catch (
        err
      ) {
        setError(
          err.response?.data
            ?.message ||
            'Status pengajuan UMKM gagal diperbarui.'
        );
      } finally {
        setActionLoading(
          null
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | PROCESS
  |--------------------------------------------------------------------------
  */

  const handleProcess =
    (
      item
    ) => {
      if (
        item.status !==
        'menunggu_verifikasi'
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Teruskan pengajuan "${item.nama_umkm}" ke tahap Diproses?`
        );

      if (
        !confirmed
      ) {
        return;
      }

      handleUpdateStatus(
        item,
        'diproses'
      );
    };

  /*
  |--------------------------------------------------------------------------
  | APPROVE
  |--------------------------------------------------------------------------
  */

  const handleApprove =
    (
      item
    ) => {
      if (
        ![
          'menunggu_verifikasi',
          'diproses',
        ].includes(
          item.status
        )
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Setujui UMKM "${item.nama_umkm}"?\n\nSetelah disetujui, UMKM akan aktif di publik.`
        );

      if (
        !confirmed
      ) {
        return;
      }

      handleUpdateStatus(
        item,
        'disetujui'
      );
    };

  /*
  |--------------------------------------------------------------------------
  | OPEN REJECT
  |--------------------------------------------------------------------------
  */

  const handleOpenReject =
    (
      item
    ) => {
      if (
        ![
          'menunggu_verifikasi',
          'diproses',
        ].includes(
          item.status
        )
      ) {
        return;
      }

      setRejectTarget(
        item
      );

      setRejectNote(
        ''
      );

      setRejectError(
        ''
      );

      setShowRejectModal(
        true
      );
    };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT REJECT
  |--------------------------------------------------------------------------
  */

  const handleSubmitReject =
    async () => {
      if (
        !rejectTarget?.id
      ) {
        return;
      }

      const note =
        rejectNote.trim();

      if (!note) {
        setRejectError(
          'Catatan penolakan wajib diisi.'
        );

        return;
      }

      if (
        note.length >
        5000
      ) {
        setRejectError(
          'Catatan penolakan maksimal 5000 karakter.'
        );

        return;
      }

      setRejectError('');
      setError('');
      setSuccess('');

      setActionLoading(
        `ditolak-${rejectTarget.id}`
      );

      try {
        const response =
          await api.patch(
            `/admin/pengajuan/umkm/${rejectTarget.id}/status`,
            {
              status:
                'ditolak',

              catatan_admin:
                note,
            }
          );

        const updated =
          response.data
            ?.data;

        setUmkmList(
          (
            previous
          ) =>
            previous.map(
              (
                current
              ) =>
                current.id ===
                rejectTarget.id
                  ? updated ||
                    {
                      ...current,
                      status:
                        'ditolak',
                      is_active:
                        false,
                      catatan_admin:
                        note,
                    }
                  : current
            )
        );

        if (
          selected?.id ===
          rejectTarget.id
        ) {
          setSelected(
            updated ||
            {
              ...selected,
              status:
                'ditolak',
              is_active:
                false,
              catatan_admin:
                note,
            }
          );
        }

        setShowRejectModal(
          false
        );

        setRejectTarget(
          null
        );

        setRejectNote(
          ''
        );

        setSuccess(
          response.data
            ?.message ||
            'Pengajuan UMKM berhasil ditolak.'
        );
      } catch (
        err
      ) {
        const responseData =
          err.response?.data;

        setRejectError(
          responseData
            ?.errors
            ?.catatan_admin?.[0] ||
            responseData
              ?.message ||
            'Pengajuan UMKM gagal ditolak.'
        );
      } finally {
        setActionLoading(
          null
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | CLOSE REJECT
  |--------------------------------------------------------------------------
  */

  const handleCloseReject =
    () => {
      if (
        actionLoading
      ) {
        return;
      }

      setShowRejectModal(
        false
      );

      setRejectTarget(
        null
      );

      setRejectNote(
        ''
      );

      setRejectError(
        ''
      );
    };

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const goToPage =
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

  const getPageNumbers =
    () => {
      const total =
        pagination.lastPage;

      const current =
        pagination.currentPage;

      if (
        total <= 5
      ) {
        return Array.from(
          {
            length:
              total,
          },
          (
            _,
            index
          ) =>
            index + 1
        );
      }

      const pages =
        [1];

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

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOADING
  |--------------------------------------------------------------------------
  */

  if (
    loading &&
    umkmList.length ===
      0
  ) {
    return (
      <div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="font-headline-lg text-on-background">
                UMKM Approval
              </h1>

              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-primary text-xs font-semibold">

                <span className="material-symbols-outlined text-sm">
                  admin_panel_settings
                </span>

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

            {Array.from({
              length: 6,
            }).map(
              (
                _,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="h-14 bg-surface-container-low rounded-xl animate-pulse"
                />
              )
            )}

          </div>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div>

      {/* =========================================================
          HEADER
      ========================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="font-headline-lg text-on-background">
              UMKM Approval
            </h1>

            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-primary text-xs font-semibold">

              <span className="material-symbols-outlined text-sm">
                admin_panel_settings
              </span>

              Super Admin

            </span>

          </div>

          <p className="font-body-md text-on-surface-variant mt-1">
            Kelola dan verifikasi pengajuan UMKM masyarakat.
          </p>

        </div>

        {pagination.total >
          0 && (
          <div className="text-sm text-on-surface-variant">

            Total{' '}

            <span className="font-semibold text-on-surface">
              {
                pagination.total
              }
            </span>{' '}

            pengajuan

          </div>
        )}

      </div>

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
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >

          <div className="flex items-start gap-3">

            <span className="material-symbols-outlined shrink-0">
              error
            </span>

            <span className="wrap-break-word whitespace-pre-line">
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
          className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
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
          TABLE
      ========================================================== */}

      {umkmList.length ===
      0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-6 py-16 text-center">

          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">

            <span className="material-symbols-outlined text-4xl">
              storefront
            </span>

          </div>

          <h2 className="font-headline-md text-xl text-on-surface mt-5">
            Belum ada pengajuan UMKM
          </h2>

          <p className="font-body-md text-on-surface-variant mt-2">
            Belum ada data pengajuan UMKM yang dapat diproses.
          </p>

        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-1000px">

              <thead className="bg-surface-container-low border-b border-outline-variant/20">

                <tr>

                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                    ID
                  </th>

                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                    Nama UMKM
                  </th>

                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                    Pemilik
                  </th>

                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                    Kategori
                  </th>

                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                    Harga
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

                {umkmList.map(
                  (
                    item
                  ) => {

                    const status =
                      getStatusStyle(
                        item.status
                      );

                    const processLoading =
                      actionLoading ===
                      `diproses-${item.id}`;

                    const approveLoading =
                      actionLoading ===
                      `disetujui-${item.id}`;

                    const rejectLoading =
                      actionLoading ===
                      `ditolak-${item.id}`;

                    const canProcess =
                      item.status ===
                      'menunggu_verifikasi';

                    const canApprove =
                      [
                        'menunggu_verifikasi',
                        'diproses',
                      ].includes(
                        item.status
                      );

                    const canReject =
                      [
                        'menunggu_verifikasi',
                        'diproses',
                      ].includes(
                        item.status
                      );

                    return (
                      <motion.tr
                        key={
                          item.id
                        }
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors align-top"
                      >

                        {/* ID */}

                        <td className="px-6 py-5">

                          <span className="font-label-md font-semibold text-primary">
                            #
                            {
                              item.id
                            }
                          </span>

                        </td>

                        {/* NAMA */}

                        <td className="px-6 py-5">

                          <div className="min-w-220px">

                            <p className="font-label-md font-semibold text-on-surface wrap-break-word">
                              {
                                item.nama_umkm ||
                                '-'
                              }
                            </p>

                            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 wrap-break-word">
                              {
                                item.alamat ||
                                '-'
                              }
                            </p>

                          </div>

                        </td>

                        {/* PEMILIK */}

                        <td className="px-6 py-5">

                          <div className="min-w-170px">

                            <p className="font-label-md text-on-surface wrap-break-word">
                              {
                                item.user
                                  ?.name ||
                                '-'
                              }
                            </p>

                            <p className="text-xs text-on-surface-variant mt-1 wrap-break-word">
                              {
                                item.user
                                  ?.email ||
                                '-'
                              }
                            </p>

                          </div>

                        </td>

                        {/* KATEGORI */}

                        <td className="px-6 py-5">

                          <span className="font-label-sm text-primary">
                            {
                              item.kategori
                                ?.nama ||
                              '-'
                            }
                          </span>

                        </td>

                        {/* HARGA */}

                        <td className="px-6 py-5 whitespace-nowrap">

                          <p className="font-label-sm text-on-surface">
                            {
                              formatRupiah(
                                item.harga_min
                              )
                            }
                          </p>

                          <p className="text-xs text-on-surface-variant mt-1">
                            s/d{' '}
                            {
                              formatRupiah(
                                item.harga_max
                              )
                            }
                          </p>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-sm whitespace-nowrap ${status.bg} ${status.text}`}
                          >

                            <span className="material-symbols-outlined text-base">
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

                          {item.status ===
                            'disetujui' &&
                            item.is_active && (
                            <p className="text-xs text-green-600 mt-2">
                              Aktif di publik
                            </p>
                          )}

                          {item.status ===
                            'disetujui' &&
                            !item.is_active && (
                            <p className="text-xs text-gray-500 mt-2">
                              Tidak aktif di publik
                            </p>
                          )}

                        </td>

                        {/* AKSI */}

                        <td className="px-6 py-5">

                          <div className="flex items-center justify-end gap-2 flex-wrap">

                            <button
                              type="button"
                              onClick={() =>
                                handleOpenDetail(
                                  item
                                )
                              }
                              className="px-3 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors text-sm"
                            >
                              Detail
                            </button>

                            {canProcess && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleProcess(
                                    item
                                  )
                                }
                                disabled={
                                  processLoading
                                }
                                className="px-3 py-2 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors text-sm disabled:opacity-50"
                              >

                                {
                                  processLoading
                                    ? 'Memproses...'
                                    : 'Proses'
                                }

                              </button>
                            )}

                            {canApprove && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleApprove(
                                    item
                                  )
                                }
                                disabled={
                                  approveLoading
                                }
                                className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                              >

                                {
                                  approveLoading
                                    ? 'Menyetujui...'
                                    : 'Setujui'
                                }

                              </button>
                            )}

                            {canReject && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenReject(
                                    item
                                  )
                                }
                                disabled={
                                  rejectLoading
                                }
                                className="px-3 py-2 rounded-lg bg-error text-white hover:bg-error/90 transition-colors text-sm disabled:opacity-50"
                              >
                                Tolak
                              </button>
                            )}

                          </div>

                        </td>

                      </motion.tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

          {/* =======================================================
              PAGINATION
          ======================================================== */}

          {pagination.lastPage >
            1 && (
            <div className="px-4 sm:px-6 py-4 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <p className="text-sm text-on-surface-variant">

                Halaman{' '}

                <span className="font-semibold text-on-surface">
                  {
                    pagination.currentPage
                  }
                </span>{' '}

                dari{' '}

                <span className="font-semibold text-on-surface">
                  {
                    pagination.lastPage
                  }
                </span>

              </p>

              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    goToPage(
                      pagination.currentPage -
                        1
                    )
                  }
                  disabled={
                    pagination.currentPage ===
                    1
                  }
                  className="px-3 py-2 rounded-lg border border-outline-variant/30 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/5"
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
                          goToPage(
                            page
                          )
                        }
                        className={`min-w-10 px-3 py-2 rounded-lg text-sm transition-colors ${
                          pagination.currentPage ===
                          page
                            ? 'bg-primary text-white'
                            : 'border border-outline-variant/30 hover:bg-primary/5'
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
                  onClick={() =>
                    goToPage(
                      pagination.currentPage +
                        1
                    )
                  }
                  disabled={
                    pagination.currentPage ===
                    pagination.lastPage
                  }
                  className="px-3 py-2 rounded-lg border border-outline-variant/30 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/5"
                >
                  Berikutnya
                </button>

              </div>

            </div>
          )}

        </div>
      )}

      {/* =========================================================
          DETAIL MODAL
      ========================================================== */}

      {(selected ||
        detailLoading) && (
        <div
          className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={
            handleCloseDetail
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
            className="w-full max-w-5xl max-h-[92vh] bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between gap-4">

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <p className="text-xs text-primary">

                    {selected
                      ? `#${selected.id}`
                      : 'Detail'}

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
                onClick={
                  handleCloseDetail
                }
                disabled={
                  Boolean(
                    actionLoading
                  ) ||
                  detailLoading
                }
                className="w-9 h-9 rounded-full hover:bg-primary/10 text-on-surface-variant hover:text-primary flex items-center justify-center disabled:opacity-50"
                aria-label="Tutup"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </div>

            {/* DETAIL LOADING */}

            {detailLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-on-surface-variant">

                <span className="material-symbols-outlined animate-spin text-primary text-5xl">
                  progress_activity
                </span>

                <p className="mt-3">
                  Memuat detail UMKM...
                </p>

              </div>
            ) : (
              selected && (
                <>

                  <div className="p-6 overflow-y-auto space-y-6">

                    {/* TOP */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* FOTO */}

                      <section>

                        {selectedPhotos.length >
                        0 ? (
                          <div>

                            {photoError && (
                              <div className="mb-3 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
                                {
                                  photoError
                                }
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
                              ) : photoUrls[
                                  selectedPhotos[
                                    currentSlide
                                  ]?.id
                                ] ? (
                                <img
                                  src={
                                    photoUrls[
                                      selectedPhotos[
                                        currentSlide
                                      ].id
                                    ]
                                  }
                                  alt={`Foto UMKM ${
                                    currentSlide +
                                    1
                                  }`}
                                  className="w-full h-72 md:h-96 object-contain bg-surface-container-high"
                                />
                              ) : (
                                <div className="w-full h-72 md:h-96 flex flex-col items-center justify-center bg-surface-container-high text-on-surface-variant">

                                  <span className="material-symbols-outlined text-6xl opacity-30">
                                    broken_image
                                  </span>

                                  <p className="mt-2 text-sm">
                                    Foto tidak dapat dimuat.
                                  </p>

                                </div>
                              )}

                              {selectedPhotos.length >
                                1 && (
                                <>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCurrentSlide(
                                        (
                                          previous
                                        ) =>
                                          (
                                            previous -
                                            1 +
                                            selectedPhotos.length
                                          ) %
                                          selectedPhotos.length
                                      )
                                    }
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center"
                                    aria-label="Foto sebelumnya"
                                  >

                                    <span className="material-symbols-outlined">
                                      chevron_left
                                    </span>

                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCurrentSlide(
                                        (
                                          previous
                                        ) =>
                                          (
                                            previous +
                                            1
                                          ) %
                                          selectedPhotos.length
                                      )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center"
                                    aria-label="Foto berikutnya"
                                  >

                                    <span className="material-symbols-outlined">
                                      chevron_right
                                    </span>

                                  </button>

                                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">

                                    {selectedPhotos.map(
                                      (
                                        photo,
                                        index
                                      ) => (
                                        <button
                                          key={
                                            photo.id ??
                                            index
                                          }
                                          type="button"
                                          onClick={() =>
                                            setCurrentSlide(
                                              index
                                            )
                                          }
                                          className={`h-2 rounded-full transition-all ${
                                            currentSlide ===
                                            index
                                              ? 'w-5 bg-white'
                                              : 'w-2 bg-white/50'
                                          }`}
                                          aria-label={`Foto ${
                                            index +
                                            1
                                          }`}
                                        />
                                      )
                                    )}

                                  </div>

                                </>
                              )}

                            </div>

                            {/* THUMBNAILS */}

                            <div className="grid grid-cols-5 gap-2 mt-3">

                              {selectedPhotos.map(
                                (
                                  photo,
                                  index
                                ) => (
                                  <button
                                    key={
                                      photo.id ??
                                      index
                                    }
                                    type="button"
                                    onClick={() =>
                                      setCurrentSlide(
                                        index
                                      )
                                    }
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                                      currentSlide ===
                                      index
                                        ? 'border-primary'
                                        : 'border-transparent'
                                    } bg-surface-container-high`}
                                  >

                                    {photoUrls[
                                      photo.id
                                    ] ? (
                                      <img
                                        src={
                                          photoUrls[
                                            photo.id
                                          ]
                                        }
                                        alt={`Thumbnail ${
                                          index +
                                          1
                                        }`}
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
                                )
                              )}

                            </div>

                          </div>
                        ) : (
                          <div className="h-72 md:h-96 rounded-2xl bg-surface-container-low flex items-center justify-center">

                            <div className="text-center text-on-surface-variant">

                              <span className="material-symbols-outlined text-6xl opacity-30">
                                image
                              </span>

                              <p className="mt-2 text-sm">
                                Tidak ada foto UMKM.
                              </p>

                            </div>

                          </div>
                        )}

                      </section>

                      {/* DETAIL */}

                      <section>

                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">

                            <p className="text-sm font-semibold text-primary">
                              {
                                selected.kategori
                                  ?.nama ||
                                'Tanpa kategori'
                              }
                            </p>

                            <h3 className="font-headline-lg text-2xl text-on-surface mt-1 wrap-break-word">
                              {
                                selected.nama_umkm
                              }
                            </h3>

                          </div>

                          {(() => {

                            const currentStatus =
                              getStatusStyle(
                                selected.status
                              );

                            return (
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 ${currentStatus.bg} ${currentStatus.text}`}
                              >

                                <span className="material-symbols-outlined text-base">
                                  {
                                    currentStatus.icon
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

                        <div className="mt-5 space-y-4">

                          {/* PEMILIK */}

                          <div>

                            <p className="text-xs text-on-surface-variant">
                              Pemilik
                            </p>

                            <p className="font-label-md font-semibold text-on-surface mt-1">
                              {
                                selected.user
                                  ?.name ||
                                '-'
                              }
                            </p>

                            <p className="text-sm text-on-surface-variant mt-0.5 wrap-break-word">
                              {
                                selected.user
                                  ?.email ||
                                '-'
                              }
                            </p>

                          </div>

                          {/* DESKRIPSI */}

                          <div>

                            <p className="text-xs text-on-surface-variant">
                              Deskripsi
                            </p>

                            <p className="text-sm text-on-surface mt-1 whitespace-pre-line wrap-break-word">
                              {
                                selected.deskripsi_umkm ||
                                '-'
                              }
                            </p>

                          </div>

                          {/* HARGA */}

                          <div>

                            <p className="text-xs text-on-surface-variant">
                              Harga
                            </p>

                            <p className="font-label-md font-semibold text-primary mt-1">
                              {
                                formatRupiah(
                                  selected.harga_min
                                )
                              }{' '}
                              -{' '}
                              {
                                formatRupiah(
                                  selected.harga_max
                                )
                              }
                            </p>

                          </div>

                          {/* ALAMAT */}

                          <div>

                            <p className="text-xs text-on-surface-variant">
                              Alamat
                            </p>

                            <p className="text-sm text-on-surface mt-1 whitespace-pre-line wrap-break-word">
                              {
                                selected.alamat ||
                                '-'
                              }
                            </p>

                          </div>

                          {/* JAM */}

                          <div className="grid grid-cols-2 gap-4">

                            <div>

                              <p className="text-xs text-on-surface-variant">
                                Jam Buka
                              </p>

                              <p className="text-sm font-semibold text-on-surface mt-1">
                                {
                                  selected.jam_buka_mulai ||
                                  '-'
                                }
                              </p>

                            </div>

                            <div>

                              <p className="text-xs text-on-surface-variant">
                                Jam Tutup
                              </p>

                              <p className="text-sm font-semibold text-on-surface mt-1">
                                {
                                  selected.jam_buka_selesai ||
                                  '-'
                                }
                              </p>

                            </div>

                          </div>

                          {/* WHATSAPP */}

                          <div>

                            <p className="text-xs text-on-surface-variant">
                              WhatsApp
                            </p>

                            <p className="text-sm font-semibold text-on-surface mt-1 wrap-break-word">
                              {
                                selected.nomor_wa ||
                                '-'
                              }
                            </p>

                          </div>

                          {/* E-COMMERCE */}

                          {selected.link_ecommerce && (
                            <div>

                              <p className="text-xs text-on-surface-variant">
                                E-Commerce
                              </p>

                              <a
                                href={
                                  selected.link_ecommerce
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-1 wrap-break-word"
                              >

                                <span className="min-w-0 wrap-break-word">
                                  {
                                    selected.link_ecommerce
                                  }
                                </span>

                                <span className="material-symbols-outlined text-base shrink-0">
                                  open_in_new
                                </span>

                              </a>

                            </div>
                          )}

                          {/* DIAJUKAN */}

                          <div>

                            <p className="text-xs text-on-surface-variant">
                              Diajukan
                            </p>

                            <p className="text-sm text-on-surface mt-1">
                              {
                                formatDate(
                                  selected.created_at
                                )
                              }
                            </p>

                          </div>

                        </div>

                        {/* CATATAN ADMIN */}

                        {selected.catatan_admin && (
                          <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4">

                            <p className="text-xs font-semibold text-yellow-800">
                              Catatan Admin
                            </p>

                            <p className="text-sm text-yellow-700 mt-1 whitespace-pre-line wrap-break-word">
                              {
                                selected.catatan_admin
                              }
                            </p>

                          </div>
                        )}

                      </section>

                    </div>

                    {/* RIWAYAT */}

                    <section>

                      <h3 className="font-label-md font-semibold text-primary mb-4">
                        Riwayat Status
                      </h3>

                      {Array.isArray(
                        selected.riwayat
                      ) &&
                      selected.riwayat.length >
                        0 ? (
                        <div className="space-y-4">

                          {selected.riwayat.map(
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
                                    <div className="absolute left-2 top-7 bottom-0 w-px bg-outline-variant/30" />
                                  )}

                                  <div className="relative z-10 w-5 h-5 mt-1 rounded-full shrink-0 bg-surface-container-low flex items-center justify-center">

                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        historyStatus.text.replace(
                                          'text-',
                                          'bg-'
                                        )
                                      }`}
                                    />

                                  </div>

                                  <div className="min-w-0 flex-1 pb-2">

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                                      <span
                                        className={`inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${historyStatus.bg} ${historyStatus.text}`}
                                      >

                                        <span className="material-symbols-outlined text-base">
                                          {
                                            historyStatus.icon
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
                        <div className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
                          Belum ada riwayat status.
                        </div>
                      )}

                    </section>

                  </div>

                  {/* FOOTER */}

                  <div className="px-6 py-4 border-t border-outline-variant/20 flex flex-wrap justify-end gap-2">

                    {selected.status ===
                      'menunggu_verifikasi' && (
                      <button
                        type="button"
                        onClick={() =>
                          handleProcess(
                            selected
                          )
                        }
                        disabled={
                          Boolean(
                            actionLoading
                          )
                        }
                        className="px-4 py-2.5 rounded-xl border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors text-sm disabled:opacity-50"
                      >
                        Proses
                      </button>
                    )}

                    {[
                      'menunggu_verifikasi',
                      'diproses',
                    ].includes(
                      selected.status
                    ) && (
                      <>

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenReject(
                              selected
                            )
                          }
                          disabled={
                            Boolean(
                              actionLoading
                            )
                          }
                          className="px-4 py-2.5 rounded-xl bg-error text-white hover:bg-error/90 transition-colors text-sm disabled:opacity-50"
                        >
                          Tolak
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleApprove(
                              selected
                            )
                          }
                          disabled={
                            Boolean(
                              actionLoading
                            )
                          }
                          className="px-4 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                        >
                          Setujui
                        </button>

                      </>
                    )}

                    <button
                      type="button"
                      onClick={
                        handleCloseDetail
                      }
                      disabled={
                        Boolean(
                          actionLoading
                        )
                      }
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

      {/* =========================================================
          REJECT MODAL
      ========================================================== */}

      {showRejectModal &&
        rejectTarget && (
          <div className="fixed inset-0 z-120 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

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
              className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden"
            >

              {/* HEADER */}

              <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between gap-4">

                <div>

                  <div className="flex items-center gap-2">

                    <p className="text-xs text-primary font-semibold">
                      Tolak Pengajuan #
                      {
                        rejectTarget.id
                      }
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
                  onClick={
                    handleCloseReject
                  }
                  disabled={
                    Boolean(
                      actionLoading
                    )
                  }
                  className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center text-on-surface-variant disabled:opacity-50"
                >

                  <span className="material-symbols-outlined">
                    close
                  </span>

                </button>

              </div>

              {/* BODY */}

              <div className="p-6">

                <div className="rounded-xl bg-surface-container-low p-4 mb-5">

                  <p className="text-xs text-on-surface-variant">
                    UMKM
                  </p>

                  <p className="font-label-md font-semibold text-on-surface mt-1 wrap-break-word">
                    {
                      rejectTarget.nama_umkm
                    }
                  </p>

                </div>

                <label className="block font-label-md font-semibold text-on-surface mb-2">

                  Catatan Penolakan

                  <span className="text-red-500 ml-1">
                    *
                  </span>

                </label>

                <textarea
                  value={
                    rejectNote
                  }
                  onChange={(
                    event
                  ) => {
                    setRejectNote(
                      event.target
                        .value
                    );

                    if (
                      rejectError
                    ) {
                      setRejectError(
                        ''
                      );
                    }
                  }}
                  rows={
                    6
                  }
                  maxLength={
                    5000
                  }
                  placeholder="Jelaskan alasan pengajuan UMKM ditolak..."
                  disabled={
                    Boolean(
                      actionLoading
                    )
                  }
                  className={`w-full px-4 py-3 rounded-xl border bg-surface outline-none resize-none transition-colors ${
                    rejectError
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-outline-variant/40 focus:border-primary'
                  }`}
                />

                <div className="flex items-center justify-between gap-3 mt-1.5">

                  {rejectError ? (
                    <p className="text-xs text-red-600 wrap-break-word">
                      {
                        rejectError
                      }
                    </p>
                  ) : (
                    <span className="text-xs text-on-surface-variant">
                      Catatan akan dilihat oleh pemilik UMKM.
                    </span>
                  )}

                  <span className="text-xs text-on-surface-variant shrink-0">
                    {
                      rejectNote.length
                    }
                    /5000
                  </span>

                </div>

              </div>

              {/* FOOTER */}

              <div className="px-6 py-4 border-t border-outline-variant/20 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={
                    handleCloseReject
                  }
                  disabled={
                    Boolean(
                      actionLoading
                    )
                  }
                  className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors text-sm disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={
                    handleSubmitReject
                  }
                  disabled={
                    Boolean(
                      actionLoading
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-error text-white hover:bg-error/90 transition-colors text-sm disabled:opacity-50"
                >

                  {actionLoading ===
                  `ditolak-${rejectTarget.id}` ? (
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
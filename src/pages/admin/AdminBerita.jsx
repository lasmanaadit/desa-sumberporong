// src/pages/admin/AdminBerita.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  FaFacebook,
  FaInstagram,
  FaLink,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
} from 'react-icons/fa';

import { motion } from 'framer-motion';

import api from '../../api/axios';

const STATUS_LABELS = {
  draft: 'Draft',
  published: 'Published',
};

const STATUS_STYLES = {
  draft: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    icon: 'edit_note',
  },

  published: {
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
    value: 'draft',
    label: 'Draft',
  },

  {
    value: 'published',
    label: 'Published',
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const EMPTY_FORM = {
  judul: '',
  isi: '',
  status: 'draft',
  thumbnail: null,
};

const AdminBerita = () => {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [beritaList, setBeritaList] =
    useState([]);

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      lastPage: 1,
      total: 0,
    });

  const [currentPage, setCurrentPage] =
    useState(1);

  const [statusFilter, setStatusFilter] =
    useState('semua');

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [currentId, setCurrentId] =
    useState(null);

  const [form, setForm] =
    useState({
      ...EMPTY_FORM,
    });

  const [thumbnailPreview, setThumbnailPreview] =
    useState('');

  const [existingThumbnail, setExistingThumbnail] =
    useState('');

  const [thumbnailUrls, setThumbnailUrls] =
    useState({});

  const [thumbnailLoading, setThumbnailLoading] =
    useState({});

  const [thumbnailErrors, setThumbnailErrors] =
    useState({});

  const [validationErrors, setValidationErrors] =
    useState({});

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const [previewBerita, setPreviewBerita] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | REFS
  |--------------------------------------------------------------------------
  */

  const thumbnailUrlsRef =
    useRef({});

  const thumbnailLoadingRef =
    useRef({});

  const thumbnailErrorRef =
    useRef({});

  const thumbnailPreviewRef =
    useRef('');

  /*
  |--------------------------------------------------------------------------
  | BLOB ERROR HELPER
  |--------------------------------------------------------------------------
  */

  const getBlobErrorMessage =
    async (err) => {
      const responseData =
        err?.response?.data;

      if (
        responseData instanceof Blob
      ) {
        try {
          const text =
            await responseData.text();

          if (text) {
            try {
              const json =
                JSON.parse(text);

              return (
                json?.message ||
                'Thumbnail berita gagal dimuat.'
              );
            } catch {
              if (
                text.length < 500
              ) {
                return text;
              }
            }
          }
        } catch {
          // ignore
        }
      }

      return (
        err?.response?.data?.message ||
        err?.message ||
        'Thumbnail berita gagal dimuat.'
      );
    };

  /*
  |--------------------------------------------------------------------------
  | LOAD THUMBNAIL ADMIN
  |--------------------------------------------------------------------------
  |
  | Endpoint:
  |
  | GET /api/admin/files/berita/{id}
  |
  | Axios akan membawa:
  | Authorization: Bearer {token}
  |
  */

  const loadAdminThumbnail =
    useCallback(
      async (beritaId) => {
        if (!beritaId) {
          return '';
        }

        /*
        |----------------------------------------------------------------------
        | Cache
        |----------------------------------------------------------------------
        */

        const cachedUrl =
          thumbnailUrlsRef.current[
            beritaId
          ];

        if (cachedUrl) {
          return cachedUrl;
        }

        /*
        |----------------------------------------------------------------------
        | Jangan request dua kali
        |----------------------------------------------------------------------
        */

        if (
          thumbnailLoadingRef.current[
            beritaId
          ]
        ) {
          return '';
        }

        thumbnailLoadingRef.current[
          beritaId
        ] = true;

        thumbnailErrorRef.current[
          beritaId
        ] = '';

        setThumbnailLoading(
          (previous) => ({
            ...previous,
            [beritaId]: true,
          })
        );

        setThumbnailErrors(
          (previous) => {
            const next = {
              ...previous,
            };

            delete next[
              beritaId
            ];

            return next;
          }
        );

        try {
          const response =
            await api.get(
              `/admin/files/berita/${beritaId}`,
              {
                responseType: 'blob',

                headers: {
                  Accept:
                    'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                },

                /*
                |----------------------------------------------------------------
                | Pastikan tidak terkena cache browser
                |----------------------------------------------------------------
                */

                params: {
                  t: Date.now(),
                },
              }
            );

          const blob =
            response.data;

          if (
            !(blob instanceof Blob)
          ) {
            throw new Error(
              'Response thumbnail bukan Blob.'
            );
          }

          /*
          |----------------------------------------------------------------------
          | Content Type
          |----------------------------------------------------------------------
          */

          const contentType = (
            response.headers?.[
              'content-type'
            ] ||
            blob.type ||
            ''
          ).toLowerCase();

          /*
          |----------------------------------------------------------------------
          | Response error Laravel yang berbentuk JSON
          |----------------------------------------------------------------------
          */

          if (
            contentType.includes(
              'application/json'
            )
          ) {
            let message =
              'Thumbnail berita tidak dapat diakses.';

            try {
              const text =
                await blob.text();

              if (text) {
                const json =
                  JSON.parse(text);

                message =
                  json?.message ||
                  message;
              }
            } catch {
              // ignore
            }

            throw new Error(
              message
            );
          }

          /*
          |----------------------------------------------------------------------
          | Harus berupa image
          |----------------------------------------------------------------------
          */

          if (
            !contentType.startsWith(
              'image/'
            )
          ) {
            throw new Error(
              `Server mengembalikan "${
                contentType ||
                'content-type tidak diketahui'
              }", bukan gambar.`
            );
          }

          /*
          |----------------------------------------------------------------------
          | Ukuran
          |----------------------------------------------------------------------
          */

          if (
            blob.size <= 0
          ) {
            throw new Error(
              'File thumbnail kosong.'
            );
          }

          /*
          |----------------------------------------------------------------------
          | Buat Blob URL
          |----------------------------------------------------------------------
          */

          const blobUrl =
            window.URL.createObjectURL(
              blob
            );

          /*
          |----------------------------------------------------------------------
          | Simpan cache
          |----------------------------------------------------------------------
          */

          thumbnailUrlsRef.current[
            beritaId
          ] = blobUrl;

          setThumbnailUrls(
            (previous) => ({
              ...previous,
              [beritaId]:
                blobUrl,
            })
          );

          return blobUrl;
        } catch (err) {
          const message =
            await getBlobErrorMessage(
              err
            );

          console.error(
            'Gagal mengambil thumbnail admin:',
            {
              beritaId,
              message,
              status:
                err?.response?.status,
              response:
                err?.response,
            }
          );

          thumbnailErrorRef.current[
            beritaId
          ] = message;

          setThumbnailErrors(
            (previous) => ({
              ...previous,
              [beritaId]:
                message,
            })
          );

          return '';
        } finally {
          thumbnailLoadingRef.current[
            beritaId
          ] = false;

          setThumbnailLoading(
            (previous) => ({
              ...previous,
              [beritaId]: false,
            })
          );
        }
      },
      []
    );

  /*
  |--------------------------------------------------------------------------
  | LOAD THUMBNAIL DARI DATA ADMIN
  |--------------------------------------------------------------------------
  |
  | PENTING:
  | Backend AdminBeritaResource mengirim:
  |
  | admin_thumbnail
  |
  | bukan:
  |
  | thumbnail
  |
  */

  useEffect(() => {
    if (
      beritaList.length === 0
    ) {
      return;
    }

    beritaList.forEach(
      (berita) => {
        if (
          !berita?.id ||
          !berita?.admin_thumbnail
        ) {
          return;
        }

        if (
          thumbnailUrlsRef.current[
            berita.id
          ]
        ) {
          return;
        }

        if (
          thumbnailLoadingRef.current[
            berita.id
          ]
        ) {
          return;
        }

        loadAdminThumbnail(
          berita.id
        );
      }
    );
  }, [
    beritaList,
    loadAdminThumbnail,
  ]);

  /*
  |--------------------------------------------------------------------------
  | CLEANUP THUMBNAIL BLOB
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      Object.values(
        thumbnailUrlsRef.current
      ).forEach(
        (url) => {
          if (url) {
            window.URL.revokeObjectURL(
              url
            );
          }
        }
      );

      thumbnailUrlsRef.current =
        {};

      thumbnailLoadingRef.current =
        {};

      thumbnailErrorRef.current =
        {};
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CLEANUP PREVIEW FILE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    thumbnailPreviewRef.current =
      thumbnailPreview;

    return () => {
      const current =
        thumbnailPreviewRef.current;

      if (current) {
        window.URL.revokeObjectURL(
          current
        );

        thumbnailPreviewRef.current =
          '';
      }
    };
  }, [
    thumbnailPreview,
  ]);

  /*
  |--------------------------------------------------------------------------
  | FETCH BERITA
  |--------------------------------------------------------------------------
  */

  const fetchBerita =
    async (page = 1) => {
      setLoading(true);
      setError('');

      try {
        const response =
          await api.get(
            '/admin/berita',
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
        | Format collection biasa
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
          /*
          |--------------------------------------------------------------------
          | Kalau Laravel mengembalikan pagination resource
          |--------------------------------------------------------------------
          */

          data =
            responseData?.data ||
            [];

          meta = {
            currentPage:
              responseData
                ?.current_page ||
              page,

            lastPage:
              responseData
                ?.last_page ||
              1,

            total:
              responseData
                ?.total ||
              0,
          };
        }

        setBeritaList(
          data
        );

        setPagination(
          meta
        );

        if (
          meta.currentPage !==
          currentPage
        ) {
          setCurrentPage(
            meta.currentPage
          );
        }
      } catch (
        err
      ) {
        setError(
          err.response?.data
            ?.message ||
          'Gagal mengambil daftar berita.'
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchBerita(
      currentPage
    );
  }, [
    currentPage,
  ]);

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredBerita =
    useMemo(
      () => {
        if (
          statusFilter ===
          'semua'
        ) {
          return beritaList;
        }

        return beritaList.filter(
          (item) =>
            item.status ===
            statusFilter
        );
      },
      [
        beritaList,
        statusFilter,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | RESET FORM
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);

    setForm({
      ...EMPTY_FORM,
    });

    setThumbnailPreview('');
    setExistingThumbnail('');
    setValidationErrors({});
  };

  /*
  |--------------------------------------------------------------------------
  | ADD
  |--------------------------------------------------------------------------
  */

  const handleAdd = () => {
    setError('');
    setSuccess('');
    setValidationErrors({});

    setIsEditing(true);
    setCurrentId(null);

    setForm({
      ...EMPTY_FORM,
    });

    setThumbnailPreview('');
    setExistingThumbnail('');
  };

  /*
  |--------------------------------------------------------------------------
  | EDIT
  |--------------------------------------------------------------------------
  */

  const handleEdit = async (
    item
  ) => {
    if (!item?.id) {
      return;
    }

    setError('');
    setSuccess('');
    setValidationErrors({});
    setDetailLoading(true);

    try {
      const response =
        await api.get(
          `/admin/berita/${item.id}`
        );

      const data =
        response.data?.data;

      if (!data) {
        throw new Error(
          'Data berita tidak ditemukan.'
        );
      }

      setCurrentId(
        data.id
      );

      setForm({
        judul:
          data.judul || '',

        isi:
          data.isi || '',

        status:
          data.status ||
          'draft',

        thumbnail:
          null,
      });

      setThumbnailPreview('');
      setExistingThumbnail('');

      /*
      |----------------------------------------------------------------------
      | Admin thumbnail
      |----------------------------------------------------------------------
      */

      if (
        data.admin_thumbnail
      ) {
        const url =
          await loadAdminThumbnail(
            data.id
          );

        if (url) {
          setExistingThumbnail(
            url
          );
        }
      }

      setIsEditing(true);
    } catch (
      err
    ) {
      setError(
        err.response?.data
          ?.message ||
        err.message ||
        'Gagal mengambil detail berita.'
      );
    } finally {
      setDetailLoading(
        false
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FORM CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]:
          value,
      })
    );

    setValidationErrors(
      (previous) => ({
        ...previous,
        [name]:
          undefined,
      })
    );

    setError('');
    setSuccess('');
  };

  /*
  |--------------------------------------------------------------------------
  | THUMBNAIL CHANGE
  |--------------------------------------------------------------------------
  */

  const handleThumbnailChange =
    (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      setError('');
      setSuccess('');

      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
      ];

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        setValidationErrors(
          (previous) => ({
            ...previous,
            thumbnail:
              'Thumbnail harus berupa JPG, JPEG, PNG, atau WEBP.',
          })
        );

        event.target.value = '';

        return;
      }

      if (
        file.size >
        MAX_FILE_SIZE
      ) {
        setValidationErrors(
          (previous) => ({
            ...previous,
            thumbnail:
              'Ukuran thumbnail maksimal 5 MB.',
          })
        );

        event.target.value = '';

        return;
      }

      if (
        thumbnailPreview
      ) {
        window.URL.revokeObjectURL(
          thumbnailPreview
        );
      }

      const previewUrl =
        window.URL.createObjectURL(
          file
        );

      setForm(
        (previous) => ({
          ...previous,
          thumbnail:
            file,
        })
      );

      setThumbnailPreview(
        previewUrl
      );

      setValidationErrors(
        (previous) => ({
          ...previous,
          thumbnail:
            undefined,
        })
      );

      event.target.value = '';
    };

  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    const errors = {};

    if (
      !form.judul.trim()
    ) {
      errors.judul =
        'Judul berita wajib diisi.';
    }

    if (
      !form.isi.trim()
    ) {
      errors.isi =
        'Isi berita wajib diisi.';
    }

    if (
      !form.status
    ) {
      errors.status =
        'Status berita wajib dipilih.';
    }

    setValidationErrors(
      errors
    );

    return (
      Object.keys(
        errors
      ).length === 0
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      setError('');
      setSuccess('');

      if (
        !validateForm()
      ) {
        return;
      }

      setSubmitting(true);

      const editingId =
        currentId;

      try {
        const formData =
          new FormData();

        formData.append(
          'judul',
          form.judul.trim()
        );

        formData.append(
          'isi',
          form.isi.trim()
        );

        formData.append(
          'status',
          form.status
        );

        if (
          form.thumbnail instanceof
          File
        ) {
          formData.append(
            'thumbnail',
            form.thumbnail
          );
        }

        let response;

        /*
        |----------------------------------------------------------------------
        | CREATE
        |----------------------------------------------------------------------
        */

        if (!editingId) {
          response =
            await api.post(
              '/admin/berita',
              formData
            );
        }

        /*
        |----------------------------------------------------------------------
        | UPDATE
        |----------------------------------------------------------------------
        |
        | Backend:
        |
        | POST /api/admin/berita/{berita}
        |
        */

        if (editingId) {
          response =
            await api.post(
              `/admin/berita/${editingId}`,
              formData
            );
        }

        setSuccess(
          response.data?.message ||
          (
            editingId
              ? 'Berita berhasil diperbarui.'
              : 'Berita berhasil dibuat.'
          )
        );

        if (
          thumbnailPreview
        ) {
          window.URL.revokeObjectURL(
            thumbnailPreview
          );
        }

        setThumbnailPreview('');

        setIsEditing(false);
        setCurrentId(null);

        setForm({
          ...EMPTY_FORM,
        });

        setExistingThumbnail('');
        setValidationErrors({});

        /*
        |----------------------------------------------------------------------
        | Setelah update thumbnail:
        | Hapus blob lama supaya list mengambil thumbnail terbaru.
        |----------------------------------------------------------------------
        */

        if (editingId) {
          const oldBlobUrl =
            thumbnailUrlsRef.current[
              editingId
            ];

          if (oldBlobUrl) {
            window.URL.revokeObjectURL(
              oldBlobUrl
            );

            delete thumbnailUrlsRef.current[
              editingId
            ];

            setThumbnailUrls(
              (previous) => {
                const next = {
                  ...previous,
                };

                delete next[
                  editingId
                ];

                return next;
              }
            );
          }

          delete thumbnailErrors[
            editingId
          ];

          delete thumbnailErrorRef.current[
            editingId
          ];

          delete thumbnailLoadingRef.current[
            editingId
          ];
        }

        await fetchBerita(
          currentPage
        );
      } catch (
        err
      ) {
        const responseData =
          err.response?.data;

        setError(
          responseData?.message ||
          'Berita gagal diproses.'
        );

        if (
          responseData?.errors
        ) {
          setValidationErrors(
            responseData.errors
          );
        }
      } finally {
        setSubmitting(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (
    item
  ) => {
    if (
      !item?.id ||
      actionLoading
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Apakah Anda yakin ingin menghapus berita "${item.judul}"?`
      );

    if (!confirmed) {
      return;
    }

    setError('');
    setSuccess('');

    setActionLoading(
      `delete-${item.id}`
    );

    try {
      const response =
        await api.delete(
          `/admin/berita/${item.id}`
        );

      setSuccess(
        response.data?.message ||
        'Berita berhasil dihapus.'
      );

      const blobUrl =
        thumbnailUrlsRef.current[
          item.id
        ];

      if (blobUrl) {
        window.URL.revokeObjectURL(
          blobUrl
        );

        delete thumbnailUrlsRef.current[
          item.id
        ];
      }

      delete thumbnailLoadingRef.current[
        item.id
      ];

      delete thumbnailErrorRef.current[
        item.id
      ];

      setThumbnailUrls(
        (previous) => {
          const next = {
            ...previous,
          };

          delete next[
            item.id
          ];

          return next;
        }
      );

      setThumbnailLoading(
        (previous) => {
          const next = {
            ...previous,
          };

          delete next[
            item.id
          ];

          return next;
        }
      );

      setThumbnailErrors(
        (previous) => {
          const next = {
            ...previous,
          };

          delete next[
            item.id
          ];

          return next;
        }
      );

      if (
        beritaList.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage(
          (page) =>
            page - 1
        );
      } else {
        await fetchBerita(
          currentPage
        );
      }
    } catch (
      err
    ) {
      setError(
        err.response?.data
          ?.message ||
        'Berita gagal dihapus.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PUBLISH
  |--------------------------------------------------------------------------
  */

  const handlePublish =
    async (
      item
    ) => {
      if (
        !item?.id ||
        actionLoading
      ) {
        return;
      }

      setError('');
      setSuccess('');

      setActionLoading(
        `publish-${item.id}`
      );

      try {
        const response =
          await api.patch(
            `/admin/berita/${item.id}/publish`
          );

        setSuccess(
          response.data?.message ||
          'Berita berhasil dipublikasikan.'
        );

        await fetchBerita(
          currentPage
        );
      } catch (
        err
      ) {
        setError(
          err.response?.data
            ?.message ||
          'Berita gagal dipublikasikan.'
        );
      } finally {
        setActionLoading(null);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | UNPUBLISH
  |--------------------------------------------------------------------------
  */

  const handleUnpublish =
    async (
      item
    ) => {
      if (
        !item?.id ||
        actionLoading
      ) {
        return;
      }

      setError('');
      setSuccess('');

      setActionLoading(
        `unpublish-${item.id}`
      );

      try {
        const response =
          await api.patch(
            `/admin/berita/${item.id}/unpublish`
          );

        setSuccess(
          response.data?.message ||
          'Berita berhasil dikembalikan menjadi draft.'
        );

        await fetchBerita(
          currentPage
        );
      } catch (
        err
      ) {
        setError(
          err.response?.data
            ?.message ||
          'Berita gagal dikembalikan menjadi draft.'
        );
      } finally {
        setActionLoading(null);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | PREVIEW
  |--------------------------------------------------------------------------
  */

  const handlePreview =
    async (
      item
    ) => {
      if (
        !item?.id
      ) {
        return;
      }

      setError('');
      setSuccess('');
      setDetailLoading(true);

      try {
        const response =
          await api.get(
            `/admin/berita/${item.id}`
          );

        const data =
          response.data?.data;

        if (!data) {
          throw new Error(
            'Detail berita tidak ditemukan.'
          );
        }

        /*
        |----------------------------------------------------------------------
        | Gunakan admin_thumbnail
        |----------------------------------------------------------------------
        */

        if (
          data.admin_thumbnail
        ) {
          await loadAdminThumbnail(
            data.id
          );
        }

        setPreviewBerita(
          data
        );
      } catch (
        err
      ) {
        setError(
          err.response?.data
            ?.message ||
          err.message ||
          'Gagal mengambil detail berita.'
        );
      } finally {
        setDetailLoading(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | CLOSE PREVIEW
  |--------------------------------------------------------------------------
  */

  const closePreview = () => {
    setPreviewBerita(null);
  };

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const getStatusStyle =
    (status) => {
      return (
        STATUS_STYLES[
          status
        ] || {
          bg:
            'bg-gray-100',
          text:
            'text-gray-700',
          icon:
            'help',
        }
      );
    };

  const getStatusLabel =
    (status) => {
      return (
        STATUS_LABELS[
          status
        ] ||
        status ||
        '-'
      );
    };

  const formatDate =
    (value) => {
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
        pages.push(page);
      }

      if (
        current <
        total - 2
      ) {
        pages.push(
          '...'
        );
      }

      pages.push(total);

      return pages;
    };

  const handlePageChange =
    (page) => {
      if (
        typeof page !==
        'number'
      ) {
        return;
      }

      if (
        page < 1 ||
        page >
          pagination.lastPage ||
        page ===
          pagination.currentPage
      ) {
        return;
      }

      setCurrentPage(page);
    };

  const getPublicUrl =
    (berita) => {
      if (
        !berita?.slug
      ) {
        return '';
      }

      return `${window.location.origin}/berita/${berita.slug}`;
    };

  const copyLink =
    async (url) => {
      if (!url) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          url
        );

        setSuccess(
          'Link berita berhasil disalin.'
        );
      } catch {
        setError(
          'Link berita gagal disalin.'
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="w-full">

      {/* HEADER */}

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

          <div className="min-w-0">

            <h1 className="font-headline-lg text-on-background">
              Berita Desa
            </h1>

            <p className="font-body-md text-on-surface-variant mt-1">
              Kelola berita Desa Sumberporong,
              mulai dari draft hingga publikasi.
            </p>

          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="w-full xl:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-label-md font-semibold hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined">
              add
            </span>

            Tambah Berita
          </button>

        </div>
      </motion.div>

      {/* ERROR */}

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

            <span className="wrap-break-word min-w-0">
              {error}
            </span>

          </div>
        </motion.div>
      )}

      {/* SUCCESS */}

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

      {/* FORM */}

      {isEditing && (
        <motion.section
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 mb-6"
        >

          <div className="flex items-center justify-between gap-4 mb-6">

            <div className="min-w-0">

              <h2 className="font-headline-md text-xl text-on-surface">
                {currentId
                  ? 'Edit Berita'
                  : 'Tambah Berita'}
              </h2>

              <p className="text-sm text-on-surface-variant mt-1">
                Isi informasi berita
                dan tentukan status publikasinya.
              </p>

            </div>

            <button
              type="button"
              onClick={
                resetForm
              }
              disabled={
                submitting
              }
              className="w-9 h-9 rounded-full hover:bg-primary/10 text-on-surface-variant hover:text-primary flex items-center justify-center disabled:opacity-50"
              aria-label="Tutup form"
            >
              <span className="material-symbols-outlined">
                close
              </span>
            </button>

          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5"
          >

            {/* THUMBNAIL */}

            <div>

              <label className="block font-label-md font-semibold mb-2">
                Thumbnail
                <span className="font-normal text-on-surface-variant ml-2">
                  (Opsional)
                </span>
              </label>

              <div className="flex flex-col sm:flex-row gap-5">

                <div className="w-full sm:w-64">

                  {thumbnailPreview ||
                  existingThumbnail ? (
                    <div className="aspect-video rounded-xl overflow-hidden border border-outline-variant/30 bg-surface">

                      <img
                        src={
                          thumbnailPreview ||
                          existingThumbnail
                        }
                        alt="Thumbnail berita"
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          console.error(
                            'Thumbnail form gagal ditampilkan:',
                            event.currentTarget.src
                          );
                        }}
                      />

                    </div>
                  ) : (
                    <div className="aspect-video rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface/30 flex flex-col items-center justify-center text-on-surface-variant">

                      <span className="material-symbols-outlined text-4xl">
                        image
                      </span>

                      <span className="text-xs mt-2">
                        Belum ada thumbnail
                      </span>

                    </div>
                  )}

                </div>

                <div>

                  <label className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-label-md font-semibold cursor-pointer hover:bg-primary-container transition-colors">

                    <span className="material-symbols-outlined">
                      upload
                    </span>

                    Pilih Thumbnail

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={
                        submitting
                      }
                      onChange={
                        handleThumbnailChange
                      }
                    />

                  </label>

                  <p className="text-xs text-on-surface-variant mt-3">
                    JPG, JPEG, PNG,
                    atau WEBP.
                    Maksimal 5 MB.
                  </p>

                </div>

              </div>

              {getFieldError(
                validationErrors,
                'thumbnail'
              ) && (
                <p className="text-xs text-red-600 mt-2">
                  {getFieldError(
                    validationErrors,
                    'thumbnail'
                  )}
                </p>
              )}

            </div>

            {/* JUDUL */}

            <div>

              <label className="block font-label-md font-semibold mb-2">
                Judul Berita
              </label>

              <input
                type="text"
                name="judul"
                value={
                  form.judul
                }
                onChange={
                  handleChange
                }
                maxLength={200}
                disabled={
                  submitting
                }
                placeholder="Masukkan judul berita..."
                className={getInputClass(
                  validationErrors,
                  'judul'
                )}
              />

              {getFieldError(
                validationErrors,
                'judul'
              ) && (
                <p className="text-xs text-red-600 mt-1.5">
                  {getFieldError(
                    validationErrors,
                    'judul'
                  )}
                </p>
              )}

              <p className="text-xs text-on-surface-variant mt-1.5">
                {form.judul.length}/200
              </p>

            </div>

            {/* ISI */}

            <div>

              <label className="block font-label-md font-semibold mb-2">
                Isi Berita
              </label>

              <textarea
                name="isi"
                value={
                  form.isi
                }
                onChange={
                  handleChange
                }
                rows={12}
                disabled={
                  submitting
                }
                placeholder="Tulis isi berita di sini..."
                className={`${getInputClass(
                  validationErrors,
                  'isi'
                )} resize-none`}
              />

              {getFieldError(
                validationErrors,
                'isi'
              ) && (
                <p className="text-xs text-red-600 mt-1.5">
                  {getFieldError(
                    validationErrors,
                    'isi'
                  )}
                </p>
              )}

            </div>

            {/* STATUS */}

            <div>

              <label className="block font-label-md font-semibold mb-2">
                Status
              </label>

              <select
                name="status"
                value={
                  form.status
                }
                onChange={
                  handleChange
                }
                disabled={
                  submitting
                }
                className={getInputClass(
                  validationErrors,
                  'status'
                )}
              >

                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>

              </select>

              {getFieldError(
                validationErrors,
                'status'
              ) && (
                <p className="text-xs text-red-600 mt-1.5">
                  {getFieldError(
                    validationErrors,
                    'status'
                  )}
                </p>
              )}

            </div>

            {/* BUTTON */}

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-outline-variant/20">

              <button
                type="button"
                onClick={
                  resetForm
                }
                disabled={
                  submitting
                }
                className="flex-1 px-5 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
              >

                {submitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>

                    Menyimpan...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">
                      save
                    </span>

                    {currentId
                      ? 'Simpan Perubahan'
                      : 'Simpan Berita'}
                  </>
                )}

              </button>

            </div>

          </form>

        </motion.section>
      )}

      {/* FILTER */}

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 mb-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <h2 className="font-headline-md text-lg text-on-surface">
              Daftar Berita
            </h2>

            <p className="text-sm text-on-surface-variant mt-1">

              Menampilkan{' '}

              <span className="font-semibold text-on-surface">
                {
                  filteredBerita.length
                }
              </span>{' '}

              berita pada halaman ini.

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

              setCurrentPage(1);
            }}
            className="h-11 w-full lg:w-52 px-4 rounded-xl bg-surface border border-outline-variant/40 text-sm outline-none focus:border-primary"
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
                  {
                    item.label
                  }
                </option>
              )
            )}

          </select>

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-1100px">

            <thead>

              <tr className="bg-surface-container-low border-b border-outline-variant/20">

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                  Thumbnail
                </th>

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                  Judul
                </th>

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                  Status
                </th>

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                  Publikasi
                </th>

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                  Dibuat Oleh
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
                  (_, index) => (
                    <tr
                      key={index}
                      className="border-b border-outline-variant/10"
                    >

                      <td
                        colSpan="6"
                        className="px-6 py-5"
                      >

                        <div className="h-16 bg-surface-container-low rounded-xl animate-pulse" />

                      </td>

                    </tr>
                  )
                )
              ) : filteredBerita.length ===
                0 ? (
                <tr>

                  <td
                    colSpan="6"
                    className="py-16 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                        <span className="material-symbols-outlined text-3xl">
                          newspaper
                        </span>

                      </div>

                      <h3 className="font-headline-md text-lg text-on-surface mt-4">
                        Belum ada berita
                      </h3>

                      <p className="text-sm text-on-surface-variant mt-2">
                        Belum ada berita
                        sesuai filter.
                      </p>

                    </div>

                  </td>

                </tr>
              ) : (
                filteredBerita.map(
                  (
                    berita,
                    index
                  ) => {

                    const status =
                      getStatusStyle(
                        berita.status
                      );

                    const deleteLoading =
                      actionLoading ===
                      `delete-${berita.id}`;

                    const publishLoading =
                      actionLoading ===
                      `publish-${berita.id}`;

                    const unpublishLoading =
                      actionLoading ===
                      `unpublish-${berita.id}`;

                    /*
                    |--------------------------------------------------------
                    | ADMIN THUMBNAIL
                    |--------------------------------------------------------
                    |
                    | Backend:
                    | admin_thumbnail
                    |
                    */

                    const adminThumbnail =
                      thumbnailUrls[
                        berita.id
                      ];

                    const isThumbnailLoading =
                      Boolean(
                        thumbnailLoading[
                          berita.id
                        ]
                      );

                    const thumbnailError =
                      thumbnailErrors[
                        berita.id
                      ];

                    return (
                      <motion.tr
                        key={
                          berita.id
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

                        {/* THUMBNAIL */}

                        <td className="px-6 py-5">

                          <div className="w-28 h-16 rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/20">

                            {adminThumbnail ? (

                              <img
                                src={
                                  adminThumbnail
                                }
                                alt={
                                  berita.judul
                                }
                                className="w-full h-full object-cover"
                                onError={(
                                  event
                                ) => {

                                  console.error(
                                    'Blob URL thumbnail gagal ditampilkan:',
                                    {
                                      id:
                                        berita.id,

                                      src:
                                        adminThumbnail,
                                    }
                                  );

                                  setThumbnailErrors(
                                    (
                                      previous
                                    ) => ({
                                      ...previous,
                                      [berita.id]:
                                        'Blob URL thumbnail tidak bisa ditampilkan.',
                                    })
                                  );

                                  event
                                    .currentTarget
                                    .style
                                    .display =
                                    'none';
                                }}
                              />

                            ) : isThumbnailLoading ? (

                              <div className="w-full h-full flex flex-col items-center justify-center">

                                <span className="material-symbols-outlined animate-spin text-primary">
                                  progress_activity
                                </span>

                                <span className="text-[10px] text-on-surface-variant mt-1">
                                  Memuat...
                                </span>

                              </div>

                            ) : thumbnailError ? (

                              <div className="w-full h-full flex flex-col items-center justify-center text-center px-2">

                                <span className="material-symbols-outlined text-red-400 text-xl">
                                  broken_image
                                </span>

                                <span className="text-[9px] text-red-500 leading-tight mt-1">
                                  Gagal memuat
                                </span>

                              </div>

                            ) : berita.admin_thumbnail ? (

                              <div className="w-full h-full flex items-center justify-center text-center px-2">

                                <span className="text-[9px] text-on-surface-variant">
                                  Menyiapkan thumbnail...
                                </span>

                              </div>

                            ) : (

                              <div className="w-full h-full flex items-center justify-center">

                                <span className="material-symbols-outlined text-2xl text-on-surface-variant/40">
                                  image
                                </span>

                              </div>

                            )}

                          </div>

                        </td>

                        {/* JUDUL */}

                        <td className="px-6 py-5">

                          <div className="max-w-320px">

                            <p className="font-label-md font-semibold text-on-surface line-clamp-2 wrap-break-word">
                              {
                                berita.judul
                              }
                            </p>

                            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                              {
                                berita.slug
                              }
                            </p>

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${status.bg} ${status.text} font-label-sm whitespace-nowrap`}
                          >

                            <span className="material-symbols-outlined text-base">
                              {
                                status.icon
                              }
                            </span>

                            {
                              getStatusLabel(
                                berita.status
                              )
                            }

                          </span>

                        </td>

                        {/* PUBLIKASI */}

                        <td className="px-6 py-5 whitespace-nowrap">

                          <div className="flex items-center gap-2 text-on-surface-variant">

                            <span className="material-symbols-outlined">
                              calendar_today
                            </span>

                            <span className="text-sm">
                              {
                                formatDate(
                                  berita.published_at
                                )
                              }
                            </span>

                          </div>

                        </td>

                        {/* CREATOR */}

                        <td className="px-6 py-5">

                          <p className="text-sm font-semibold text-on-surface wrap-break-word">
                            {
                              berita
                                .created_by
                                ?.name ||
                              '-'
                            }
                          </p>

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5">

                          <div className="flex items-center justify-end gap-2 flex-wrap">

                            {/* PREVIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                handlePreview(
                                  berita
                                )
                              }
                              disabled={
                                detailLoading ||
                                actionLoading
                              }
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-colors text-sm disabled:opacity-50"
                            >

                              <span className="material-symbols-outlined text-base">
                                visibility
                              </span>

                              Preview

                            </button>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  berita
                                )
                              }
                              disabled={
                                detailLoading ||
                                actionLoading
                              }
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-colors text-sm disabled:opacity-50"
                            >

                              <span className="material-symbols-outlined text-base">
                                edit
                              </span>

                              Edit

                            </button>

                            {/* PUBLISH */}

                            {berita.status ===
                              'draft' && (
                              <button
                                type="button"
                                onClick={() =>
                                  handlePublish(
                                    berita
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                              >

                                <span className="material-symbols-outlined text-base">
                                  {publishLoading
                                    ? 'progress_activity'
                                    : 'publish'}
                                </span>

                                {publishLoading
                                  ? 'Memproses...'
                                  : 'Publish'}

                              </button>
                            )}

                            {/* UNPUBLISH */}

                            {berita.status ===
                              'published' && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleUnpublish(
                                    berita
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 transition-colors text-sm disabled:opacity-50"
                              >

                                <span className="material-symbols-outlined text-base">
                                  {unpublishLoading
                                    ? 'progress_activity'
                                    : 'unpublished'}
                                </span>

                                {unpublishLoading
                                  ? 'Memproses...'
                                  : 'Draft'}

                              </button>
                            )}

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  berita
                                )
                              }
                              disabled={
                                actionLoading
                              }
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
                            >

                              <span className="material-symbols-outlined text-base">
                                {deleteLoading
                                  ? 'progress_activity'
                                  : 'delete'}
                              </span>

                              {deleteLoading
                                ? 'Menghapus...'
                                : 'Hapus'}

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

        {/* PAGINATION */}

        {!loading &&
          pagination.lastPage >
            1 && (
          <div className="px-5 py-4 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

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
                      key={page}
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

      {/* PREVIEW MODAL */}

      {previewBerita && (
        <div
          className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={
            closePreview
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
            transition={{
              duration: 0.25,
            }}
            className="w-full max-w-4xl max-h-[92vh] bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between gap-4">

              <div className="min-w-0">

                <p className="text-xs font-semibold text-primary">
                  Preview Berita
                </p>

                <h2 className="font-headline-md text-xl text-on-surface mt-1 truncate">
                  {
                    previewBerita.judul
                  }
                </h2>

              </div>

              <button
                type="button"
                onClick={
                  closePreview
                }
                className="w-10 h-10 rounded-full hover:bg-primary/10 text-on-surface-variant hover:text-primary flex items-center justify-center"
                aria-label="Tutup preview"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </div>

            {/* BODY */}

            <div className="p-6 overflow-y-auto">

              {thumbnailUrls[
                previewBerita.id
              ] ? (

                <div className="rounded-2xl overflow-hidden mb-6 bg-surface-container-high">

                  <img
                    src={
                      thumbnailUrls[
                        previewBerita.id
                      ]
                    }
                    alt={
                      previewBerita.judul
                    }
                    className="w-full max-h-420px object-cover"
                  />

                </div>

              ) : previewBerita.admin_thumbnail ? (

                <div className="rounded-2xl overflow-hidden mb-6 bg-surface-container-low h-48 flex flex-col items-center justify-center">

                  {thumbnailLoading[
                    previewBerita.id
                  ] ? (

                    <>

                      <span className="material-symbols-outlined animate-spin text-primary text-3xl">
                        progress_activity
                      </span>

                      <span className="text-xs text-on-surface-variant mt-2">
                        Memuat thumbnail...
                      </span>

                    </>

                  ) : (

                    <>

                      <span className="material-symbols-outlined text-red-400 text-3xl">
                        broken_image
                      </span>

                      <span className="text-xs text-red-500 mt-2 text-center px-4">
                        {
                          thumbnailErrors[
                            previewBerita.id
                          ] ||
                          'Thumbnail gagal dimuat.'
                        }
                      </span>

                    </>

                  )}

                </div>

              ) : null}

              <div className="flex flex-wrap items-center gap-3">

                <span
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${
                    getStatusStyle(
                      previewBerita.status
                    ).bg
                  } ${
                    getStatusStyle(
                      previewBerita.status
                    ).text
                  } text-xs font-semibold`}
                >

                  <span className="material-symbols-outlined text-base">
                    {
                      getStatusStyle(
                        previewBerita.status
                      ).icon
                    }
                  </span>

                  {
                    getStatusLabel(
                      previewBerita.status
                    )
                  }

                </span>

                <span className="text-sm text-on-surface-variant">

                  {
                    previewBerita.published_at
                      ? formatDate(
                          previewBerita.published_at
                        )
                      : formatDate(
                          previewBerita.created_at
                        )
                  }

                </span>

              </div>

              <h1 className="font-headline-lg text-3xl md:text-4xl text-primary mt-5 wrap-break-word">
                {
                  previewBerita.judul
                }
              </h1>

              <div className="mt-6 text-on-surface whitespace-pre-line leading-relaxed wrap-break-word">
                {
                  previewBerita.isi ||
                  '-'
                }
              </div>

              {previewBerita.status ===
                'published' && (
                <div className="mt-8 pt-6 border-t border-outline-variant/20">

                  <p className="font-label-md font-semibold text-on-surface mb-3">
                    Bagikan berita ini
                  </p>

                  <div className="flex flex-wrap gap-2">

                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        previewBerita.judul
                      )}&url=${encodeURIComponent(
                        getPublicUrl(
                          previewBerita
                        )
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1DA1F2] text-white text-sm font-semibold"
                    >
                      <FaTwitter />
                      Twitter
                    </a>

                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        getPublicUrl(
                          previewBerita
                        )
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2] text-white text-sm font-semibold"
                    >
                      <FaFacebook />
                      Facebook
                    </a>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `${previewBerita.judul} ${getPublicUrl(
                          previewBerita
                        )}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold"
                    >
                      <FaWhatsapp />
                      WhatsApp
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        copyLink(
                          getPublicUrl(
                            previewBerita
                          )
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E4405F] text-white text-sm font-semibold"
                    >
                      <FaInstagram />
                      Instagram
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        copyLink(
                          getPublicUrl(
                            previewBerita
                          )
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold"
                    >
                      <FaTiktok />
                      TikTok
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        copyLink(
                          getPublicUrl(
                            previewBerita
                          )
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
                    >
                      <FaLink />
                      Salin Link
                    </button>

                  </div>

                </div>
              )}

            </div>

            {/* FOOTER */}

            <div className="px-6 py-4 border-t border-outline-variant/20 flex justify-end">

              <button
                type="button"
                onClick={
                  closePreview
                }
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container transition-colors"
              >
                Tutup
              </button>

            </div>

          </motion.div>

        </div>
      )}

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const getFieldError = (
  validationErrors,
  field
) => {
  const value =
    validationErrors?.[
      field
    ];

  if (
    Array.isArray(value)
  ) {
    return (
      value[0] ||
      ''
    );
  }

  return value || '';
};

const getInputClass = (
  validationErrors,
  field
) => {
  const hasError =
    Boolean(
      getFieldError(
        validationErrors,
        field
      )
    );

  return [
    'w-full',
    'px-4',
    'py-3',
    'rounded-xl',
    'border',
    'bg-surface',
    'outline-none',
    'transition-colors',

    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
      : 'border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10',
  ].join(' ');
};

export default AdminBerita;
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


// ============================================================================
// CONSTANT
// ============================================================================

const STATUS_LABELS = {
  draft:
    'Draft',

  published:
    'Published',
};


const STATUS_STYLES = {
  draft: {
    bg:
      'bg-yellow-100',

    text:
      'text-yellow-700',

    icon:
      'edit_note',
  },

  published: {
    bg:
      'bg-green-100',

    text:
      'text-green-700',

    icon:
      'check_circle',
  },
};


const STATUS_FILTERS = [
  {
    value:
      'semua',

    label:
      'Semua',
  },

  {
    value:
      'draft',

    label:
      'Draft',
  },

  {
    value:
      'published',

    label:
      'Published',
  },
];


const MAX_FILE_SIZE =
  5 * 1024 * 1024;


const EMPTY_FORM = {
  judul:
    '',

  isi:
    '',

  status:
    'draft',

  thumbnail:
    null,
};


// ============================================================================
// COMPONENT
// ============================================================================

const SuperAdminBerita = () => {

  // ==========================================================================
  // STATE DATA
  // ==========================================================================

  const [
    beritaList,
    setBeritaList,
  ] =
    useState([]);


  const [
    pagination,
    setPagination,
  ] =
    useState({
      currentPage:
        1,

      lastPage:
        1,

      total:
        0,
    });


  const [
    currentPage,
    setCurrentPage,
  ] =
    useState(1);


  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState('semua');


  // ==========================================================================
  // STATE LOADING
  // ==========================================================================

  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);


  const [
    actionLoading,
    setActionLoading,
  ] =
    useState(null);


  const [
    detailLoading,
    setDetailLoading,
  ] =
    useState(false);


  // ==========================================================================
  // STATE FORM
  // ==========================================================================

  const [
    isEditing,
    setIsEditing,
  ] =
    useState(false);


  const [
    currentId,
    setCurrentId,
  ] =
    useState(null);


  const [
    form,
    setForm,
  ] =
    useState({
      ...EMPTY_FORM,
    });


  // ==========================================================================
  // STATE THUMBNAIL
  // ==========================================================================

  const [
    thumbnailPreview,
    setThumbnailPreview,
  ] =
    useState('');


  const [
    existingThumbnail,
    setExistingThumbnail,
  ] =
    useState('');


  const [
    thumbnailUrls,
    setThumbnailUrls,
  ] =
    useState({});


  const [
    thumbnailLoading,
    setThumbnailLoading,
  ] =
    useState({});


  const [
    thumbnailErrors,
    setThumbnailErrors,
  ] =
    useState({});


  // ==========================================================================
  // STATE VALIDATION
  // ==========================================================================

  const [
    validationErrors,
    setValidationErrors,
  ] =
    useState({});


  // ==========================================================================
  // STATE MESSAGE
  // ==========================================================================

  const [
    error,
    setError,
  ] =
    useState('');


  const [
    success,
    setSuccess,
  ] =
    useState('');


  // ==========================================================================
  // STATE PREVIEW
  // ==========================================================================

  const [
    previewBerita,
    setPreviewBerita,
  ] =
    useState(null);


  // ==========================================================================
  // REFS
  // ==========================================================================

  const thumbnailUrlsRef =
    useRef({});


  const thumbnailLoadingRef =
    useRef({});


  const thumbnailErrorRef =
    useRef({});


  const thumbnailPreviewRef =
    useRef('');


  // ==========================================================================
  // BLOB ERROR HELPER
  // ==========================================================================

  const getBlobErrorMessage =
    useCallback(
      async (
        err
      ) => {

        const responseData =
          err?.response?.data;


        if (
          responseData instanceof
          Blob
        ) {

          try {

            const text =
              await responseData.text();


            if (text) {

              try {

                const json =
                  JSON.parse(
                    text
                  );


                return (
                  json?.message ||
                  'Thumbnail berita gagal dimuat.'
                );

              } catch {

                if (
                  text.length <
                  500
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
          err?.response?.data
            ?.message ||
          err?.message ||
          'Thumbnail berita gagal dimuat.'
        );

      },
      []
    );


  // ==========================================================================
  // LOAD THUMBNAIL ADMIN
  // ==========================================================================

  const loadAdminThumbnail =
    useCallback(
      async (
        beritaId
      ) => {

        if (
          !beritaId
        ) {

          return '';

        }


        // --------------------------------------------------------------------
        // Cache
        // --------------------------------------------------------------------

        const cachedUrl =
          thumbnailUrlsRef.current[
            beritaId
          ];


        if (
          cachedUrl
        ) {

          return cachedUrl;

        }


        // --------------------------------------------------------------------
        // Jangan request dua kali
        // --------------------------------------------------------------------

        if (
          thumbnailLoadingRef.current[
            beritaId
          ]
        ) {

          return '';

        }


        thumbnailLoadingRef.current[
          beritaId
        ] =
          true;


        thumbnailErrorRef.current[
          beritaId
        ] =
          '';


        setThumbnailLoading(
          (
            previous
          ) => ({
            ...previous,

            [beritaId]:
              true,
          })
        );


        setThumbnailErrors(
          (
            previous
          ) => {

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
                responseType:
                  'blob',

                headers: {
                  Accept:
                    'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                },

                params: {
                  t:
                    Date.now(),
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


          // ------------------------------------------------------------------
          // Content Type
          // ------------------------------------------------------------------

          const contentType = (
            response.headers?.[
              'content-type'
            ] ||
            blob.type ||
            ''
          ).toLowerCase();


          // ------------------------------------------------------------------
          // Response JSON dari Laravel
          // ------------------------------------------------------------------

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
                  JSON.parse(
                    text
                  );


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


          // ------------------------------------------------------------------
          // Harus berupa image
          // ------------------------------------------------------------------

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


          // ------------------------------------------------------------------
          // File tidak boleh kosong
          // ------------------------------------------------------------------

          if (
            blob.size <= 0
          ) {

            throw new Error(
              'File thumbnail kosong.'
            );

          }


          // ------------------------------------------------------------------
          // Buat Blob URL
          // ------------------------------------------------------------------

          const blobUrl =
            window.URL.createObjectURL(
              blob
            );


          // ------------------------------------------------------------------
          // Simpan cache
          // ------------------------------------------------------------------

          thumbnailUrlsRef.current[
            beritaId
          ] =
            blobUrl;


          setThumbnailUrls(
            (
              previous
            ) => ({
              ...previous,

              [beritaId]:
                blobUrl,
            })
          );


          return blobUrl;

        } catch (
          err
        ) {

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
                err?.response
                  ?.status,
              response:
                err?.response,
            }
          );


          thumbnailErrorRef.current[
            beritaId
          ] =
            message;


          setThumbnailErrors(
            (
              previous
            ) => ({
              ...previous,

              [beritaId]:
                message,
            })
          );


          return '';

        } finally {

          thumbnailLoadingRef.current[
            beritaId
          ] =
            false;


          setThumbnailLoading(
            (
              previous
            ) => ({
              ...previous,

              [beritaId]:
                false,
            })
          );

        }

      },
      [
        getBlobErrorMessage,
      ]
    );


  // ==========================================================================
  // LOAD THUMBNAIL DARI DATA BERITA
  // ==========================================================================

  useEffect(() => {

    if (
      beritaList.length ===
      0
    ) {

      return;

    }


    beritaList.forEach(
      (
        berita
      ) => {

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


  // ==========================================================================
  // CLEANUP THUMBNAIL BLOB
  // ==========================================================================

  useEffect(() => {

    return () => {

      Object.values(
        thumbnailUrlsRef.current
      ).forEach(
        (
          url
        ) => {

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


  // ==========================================================================
  // CLEANUP PREVIEW FILE
  // ==========================================================================

  useEffect(() => {

    thumbnailPreviewRef.current =
      thumbnailPreview;


    return () => {

      const current =
        thumbnailPreviewRef.current;


      if (
        current
      ) {

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


  // ==========================================================================
  // FETCH BERITA
  // ==========================================================================

  const fetchBerita =
    useCallback(
      async (
        page = 1
      ) => {

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
            currentPage:
              page,

            lastPage:
              1,

            total:
              0,
          };


          // ------------------------------------------------------------------
          // Collection biasa
          // ------------------------------------------------------------------

          if (
            Array.isArray(
              responseData
            )
          ) {

            data =
              responseData;

          } else {

            // ----------------------------------------------------------------
            // Laravel pagination
            // ----------------------------------------------------------------

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


          // ------------------------------------------------------------------
          // Urutkan data terbaru
          // ------------------------------------------------------------------

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

          console.error(
            'Gagal mengambil daftar berita:',
            err
          );


          setError(
            err.response?.data
              ?.message ||
            'Gagal mengambil daftar berita.'
          );

        } finally {

          setLoading(false);

        }

      },
      [
        currentPage,
      ]
    );


  // ==========================================================================
  // FETCH BERITA SAAT PAGE BERUBAH
  // ==========================================================================

  useEffect(() => {

    fetchBerita(
      currentPage
    );

  }, [
    currentPage,
    fetchBerita,
  ]);


  // ==========================================================================
  // FILTER
  // ==========================================================================

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
          (
            item
          ) =>
            item.status ===
            statusFilter
        );

      },
      [
        beritaList,
        statusFilter,
      ]
    );


  // ==========================================================================
  // RESET FORM
  // ==========================================================================

  const resetForm = () => {

    setIsEditing(false);

    setCurrentId(null);


    setForm({
      ...EMPTY_FORM,
    });


    if (
      thumbnailPreview
    ) {

      window.URL.revokeObjectURL(
        thumbnailPreview
      );

    }


    setThumbnailPreview('');

    setExistingThumbnail('');

    setValidationErrors({});


  };


  // ==========================================================================
  // ADD
  // ==========================================================================

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


  // ==========================================================================
  // EDIT
  // ==========================================================================

  const handleEdit = async (
    item
  ) => {

    if (
      !item?.id
    ) {

      return;

    }


    setError('');

    setSuccess('');

    setValidationErrors('');

    setDetailLoading(true);


    try {

      const response =
        await api.get(
          `/admin/berita/${item.id}`
        );


      const data =
        response.data?.data;


      if (
        !data
      ) {

        throw new Error(
          'Data berita tidak ditemukan.'
        );

      }


      setCurrentId(
        data.id
      );


      setForm({

        judul:
          data.judul ||
          '',

        isi:
          data.isi ||
          '',

        status:
          data.status ||
          'draft',

        thumbnail:
          null,

      });


      setThumbnailPreview('');

      setExistingThumbnail('');


      // ----------------------------------------------------------------------
      // Admin thumbnail
      // ----------------------------------------------------------------------

      if (
        data.admin_thumbnail
      ) {

        const url =
          await loadAdminThumbnail(
            data.id
          );


        if (
          url
        ) {

          setExistingThumbnail(
            url
          );

        }

      }


      setIsEditing(true);

    } catch (
      err
    ) {

      console.error(
        'Gagal mengambil detail berita:',
        err
      );


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


  // ==========================================================================
  // FORM CHANGE
  // ==========================================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } =
      event.target;


    setForm(
      (
        previous
      ) => ({
        ...previous,

        [name]:
          value,

      })
    );


    setValidationErrors(
      (
        previous
      ) => {

        const next = {
          ...previous,
        };


        delete next[
          name
        ];


        return next;

      }
    );


    setError('');

    setSuccess('');

  };


  // ==========================================================================
  // THUMBNAIL CHANGE
  // ==========================================================================

  const handleThumbnailChange =
    (
      event
    ) => {

      const file =
        event.target
          .files?.[0];


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


      // ----------------------------------------------------------------------
      // Validasi tipe
      // ----------------------------------------------------------------------

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {

        setValidationErrors(
          (
            previous
          ) => ({
            ...previous,

            thumbnail:
              'Thumbnail harus berupa JPG, JPEG, PNG, atau WEBP.',

          })
        );


        event.target.value =
          '';


        return;

      }


      // ----------------------------------------------------------------------
      // Validasi ukuran
      // ----------------------------------------------------------------------

      if (
        file.size >
        MAX_FILE_SIZE
      ) {

        setValidationErrors(
          (
            previous
          ) => ({
            ...previous,

            thumbnail:
              'Ukuran thumbnail maksimal 5 MB.',

          })
        );


        event.target.value =
          '';


        return;

      }


      // ----------------------------------------------------------------------
      // Hapus preview lama
      // ----------------------------------------------------------------------

      if (
        thumbnailPreview
      ) {

        window.URL.revokeObjectURL(
          thumbnailPreview
        );

      }


      // ----------------------------------------------------------------------
      // Buat preview
      // ----------------------------------------------------------------------

      const previewUrl =
        window.URL.createObjectURL(
          file
        );


      setForm(
        (
          previous
        ) => ({
          ...previous,

          thumbnail:
            file,

        })
      );


      setThumbnailPreview(
        previewUrl
      );


      setValidationErrors(
        (
          previous
        ) => {

          const next = {
            ...previous,
          };


          delete next[
            'thumbnail'
          ];


          return next;

        }
      );


      event.target.value =
        '';

    };


  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  const validateForm = () => {

    const errors = {};


    // ------------------------------------------------------------------------
    // Judul
    // ------------------------------------------------------------------------

    if (
      !form.judul.trim()
    ) {

      errors.judul =
        'Judul berita wajib diisi.';

    }


    // ------------------------------------------------------------------------
    // Isi
    // ------------------------------------------------------------------------

    if (
      !form.isi.trim()
    ) {

      errors.isi =
        'Isi berita wajib diisi.';

    }


    // ------------------------------------------------------------------------
    // Status
    // ------------------------------------------------------------------------

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


  // ==========================================================================
  // SUBMIT
  // ==========================================================================

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


        // --------------------------------------------------------------------
        // Judul
        // --------------------------------------------------------------------

        formData.append(
          'judul',
          form.judul.trim()
        );


        // --------------------------------------------------------------------
        // Isi
        // --------------------------------------------------------------------

        formData.append(
          'isi',
          form.isi.trim()
        );


        // --------------------------------------------------------------------
        // Status
        // --------------------------------------------------------------------

        formData.append(
          'status',
          form.status
        );


        // --------------------------------------------------------------------
        // Thumbnail
        // --------------------------------------------------------------------

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


        // --------------------------------------------------------------------
        // CREATE
        // --------------------------------------------------------------------

        if (
          !editingId
        ) {

          response =
            await api.post(
              '/admin/berita',
              formData
            );

        }


        // --------------------------------------------------------------------
        // UPDATE
        // --------------------------------------------------------------------

        if (
          editingId
        ) {

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


        // --------------------------------------------------------------------
        // Cleanup preview
        // --------------------------------------------------------------------

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


        // --------------------------------------------------------------------
        // Bersihkan cache thumbnail ketika update
        // --------------------------------------------------------------------

        if (
          editingId
        ) {

          const oldBlobUrl =
            thumbnailUrlsRef.current[
              editingId
            ];


          if (
            oldBlobUrl
          ) {

            window.URL.revokeObjectURL(
              oldBlobUrl
            );


            delete thumbnailUrlsRef.current[
              editingId
            ];


            setThumbnailUrls(
              (
                previous
              ) => {

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

        console.error(
          'Gagal menyimpan berita:',
          err
        );


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


  // ==========================================================================
  // DELETE
  // ==========================================================================

  const handleDelete =
    async (
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


        // --------------------------------------------------------------------
        // Bersihkan blob thumbnail
        // --------------------------------------------------------------------

        const blobUrl =
          thumbnailUrlsRef.current[
            item.id
          ];


        if (
          blobUrl
        ) {

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
          (
            previous
          ) => {

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
          (
            previous
          ) => {

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
          (
            previous
          ) => {

            const next = {
              ...previous,
            };


            delete next[
              item.id
            ];


            return next;

          }
        );


        // --------------------------------------------------------------------
        // Jika halaman terakhir menjadi kosong
        // --------------------------------------------------------------------

        if (
          beritaList.length ===
            1 &&
          currentPage > 1
        ) {

          setCurrentPage(
            (
              page
            ) =>
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

        console.error(
          'Gagal menghapus berita:',
          err
        );


        setError(
          err.response?.data
            ?.message ||
          'Berita gagal dihapus.'
        );

      } finally {

        setActionLoading(
          null
        );

      }

    };


  // ==========================================================================
  // PUBLISH
  // ==========================================================================

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

        console.error(
          'Gagal mempublikasikan berita:',
          err
        );


        setError(
          err.response?.data
            ?.message ||
          'Berita gagal dipublikasikan.'
        );

      } finally {

        setActionLoading(
          null
        );

      }

    };


  // ==========================================================================
  // UNPUBLISH
  // ==========================================================================

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

        console.error(
          'Gagal mengubah berita menjadi draft:',
          err
        );


        setError(
          err.response?.data
            ?.message ||
          'Berita gagal dikembalikan menjadi draft.'
        );

      } finally {

        setActionLoading(
          null
        );

      }

    };


  // ==========================================================================
  // PREVIEW
  // ==========================================================================

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


        if (
          !data
        ) {

          throw new Error(
            'Detail berita tidak ditemukan.'
          );

        }


        // --------------------------------------------------------------------
        // Load admin thumbnail
        // --------------------------------------------------------------------

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

        console.error(
          'Gagal mengambil preview berita:',
          err
        );


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


  // ==========================================================================
  // CLOSE PREVIEW
  // ==========================================================================

  const closePreview = () => {

    setPreviewBerita(
      null
    );

  };


  // ==========================================================================
  // STATUS HELPER
  // ==========================================================================

  const getStatusStyle =
    (
      status
    ) => {

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


  // ==========================================================================
  // STATUS LABEL HELPER
  // ==========================================================================

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


  // ==========================================================================
  // DATE FORMAT
  // ==========================================================================

  const formatDate =
    (
      value
    ) => {

      if (
        !value
      ) {

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


  // ==========================================================================
  // PAGE NUMBERS
  // ==========================================================================

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


      pages.push(
        1
      );


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


  // ==========================================================================
  // PAGE CHANGE
  // ==========================================================================

  const handlePageChange =
    (
      page
    ) => {

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


      setCurrentPage(
        page
      );

    };


  // ==========================================================================
  // PUBLIC URL
  // ==========================================================================

  const getPublicUrl =
    (
      berita
    ) => {

      if (
        !berita?.slug
      ) {

        return '';

      }


      return `${window.location.origin}/berita/${berita.slug}`;

    };


  // ==========================================================================
  // COPY LINK
  // ==========================================================================

  const copyLink =
    async (
      url
    ) => {

      if (
        !url
      ) {

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


  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (

    <div className="w-full">

      {/* ====================================================================
          HEADER
      ==================================================================== */}

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
          duration:
            0.4,
        }}
        className="mb-8"
      >

        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          <div className="min-w-0">

            <div className="mb-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-label-sm text-primary">
              Super Admin
            </div>


            <h1 className="font-headline-lg text-on-background">
              Berita Desa
            </h1>


            <p className="mt-1 font-body-md text-on-surface-variant">
              Kelola berita Desa Sumberporong,
              mulai dari draft hingga publikasi.
            </p>

          </div>


          <button
            type="button"
            onClick={
              handleAdd
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-label-md font-semibold text-white transition-colors hover:bg-primary-container xl:w-auto"
          >

            <span className="material-symbols-outlined">
              add
            </span>


            Tambah Berita

          </button>

        </div>

      </motion.div>


      {/* ====================================================================
          ERROR
      ==================================================================== */}

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


            <span className="min-w-0 wrap-break-word">
              {
                error
              }
            </span>

          </div>

        </motion.div>

      )}


      {/* ====================================================================
          SUCCESS
      ==================================================================== */}

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
              {
                success
              }
            </span>

          </div>

        </motion.div>

      )}


      {/* ====================================================================
          FORM
      ==================================================================== */}

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
          className="mb-6 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6"
        >

          {/* ==================================================================
              FORM HEADER
          ================================================================== */}

          <div className="mb-6 flex items-center justify-between gap-4">

            <div className="min-w-0">

              <h2 className="font-headline-md text-xl text-on-surface">

                {currentId
                  ? 'Edit Berita'
                  : 'Tambah Berita'}

              </h2>


              <p className="mt-1 text-sm text-on-surface-variant">
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
              className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary disabled:opacity-50"
              aria-label="Tutup form"
            >

              <span className="material-symbols-outlined">
                close
              </span>

            </button>

          </div>


          {/* ==================================================================
              FORM BODY
          ================================================================== */}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5"
          >

            {/* ================================================================
                THUMBNAIL
            ================================================================ */}

            <div>

              <label className="mb-2 block font-label-md font-semibold">

                Thumbnail

                <span className="ml-2 font-normal text-on-surface-variant">
                  (Opsional)
                </span>

              </label>


              <div className="flex flex-col gap-5 sm:flex-row">

                <div className="w-full sm:w-64">

                  {thumbnailPreview ||
                  existingThumbnail ? (

                    <div className="aspect-video overflow-hidden rounded-xl border border-outline-variant/30 bg-surface">

                      <img
                        src={
                          thumbnailPreview ||
                          existingThumbnail
                        }
                        alt="Thumbnail berita"
                        className="h-full w-full object-cover"
                      />

                    </div>

                  ) : (

                    <div className="flex aspect-video flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface/30 text-on-surface-variant">

                      <span className="material-symbols-outlined text-4xl">
                        image
                      </span>


                      <span className="mt-2 text-xs">
                        Belum ada thumbnail
                      </span>

                    </div>

                  )}

                </div>


                <div>

                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-3 font-label-md font-semibold text-white transition-colors hover:bg-primary-container">

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


                  <p className="mt-3 text-xs text-on-surface-variant">
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

                <p className="mt-2 text-xs text-red-600">
                  {
                    getFieldError(
                      validationErrors,
                      'thumbnail'
                    )
                  }
                </p>

              )}

            </div>


            {/* ================================================================
                JUDUL
            ================================================================ */}

            <div>

              <label className="mb-2 block font-label-md font-semibold">
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
                className={
                  getInputClass(
                    validationErrors,
                    'judul'
                  )
                }
              />


              {getFieldError(
                validationErrors,
                'judul'
              ) && (

                <p className="mt-1.5 text-xs text-red-600">
                  {
                    getFieldError(
                      validationErrors,
                      'judul'
                    )
                  }
                </p>

              )}


              <p className="mt-1.5 text-xs text-on-surface-variant">
                {
                  form.judul.length
                }
                /200
              </p>

            </div>


            {/* ================================================================
                ISI
            ================================================================ */}

            <div>

              <label className="mb-2 block font-label-md font-semibold">
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

                <p className="mt-1.5 text-xs text-red-600">
                  {
                    getFieldError(
                      validationErrors,
                      'isi'
                    )
                  }
                </p>

              )}

            </div>


            {/* ================================================================
                STATUS
            ================================================================ */}

            <div>

              <label className="mb-2 block font-label-md font-semibold">
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
                className={
                  getInputClass(
                    validationErrors,
                    'status'
                  )
                }
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

                <p className="mt-1.5 text-xs text-red-600">
                  {
                    getFieldError(
                      validationErrors,
                      'status'
                    )
                  }
                </p>

              )}

            </div>


            {/* ================================================================
                FORM BUTTON
            ================================================================ */}

            <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/20 pt-4 sm:flex-row">

              <button
                type="button"
                onClick={
                  resetForm
                }
                disabled={
                  submitting
                }
                className="flex-1 rounded-xl border border-outline-variant px-5 py-3 text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-50"
              >
                Batal
              </button>


              <button
                type="submit"
                disabled={
                  submitting
                }
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-container disabled:opacity-50"
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


      {/* ====================================================================
          FILTER
      ==================================================================== */}

      <div className="mb-6 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="font-headline-md text-lg text-on-surface">
              Daftar Berita
            </h2>


            <p className="mt-1 text-sm text-on-surface-variant">

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


              setCurrentPage(
                1
              );

            }}
            className="h-11 w-full rounded-xl border border-outline-variant/40 bg-surface px-4 text-sm outline-none focus:border-primary lg:w-52"
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


      {/* ====================================================================
          TABLE
      ==================================================================== */}

      <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">

        <div className="overflow-x-auto">

          <table className="w-full min-w-1100px">

            <thead>

              <tr className="border-b border-outline-variant/20 bg-surface-container-low">

                <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant">
                  Thumbnail
                </th>


                <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant">
                  Judul
                </th>


                <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant">
                  Status
                </th>


                <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant">
                  Publikasi
                </th>


                <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant">
                  Dibuat Oleh
                </th>


                <th className="px-6 py-4 text-right font-label-sm text-on-surface-variant">
                  Aksi
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                Array.from({
                  length:
                    5,
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

                        <div className="h-16 animate-pulse rounded-xl bg-surface-container-low" />

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

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">

                        <span className="material-symbols-outlined text-3xl">
                          newspaper
                        </span>

                      </div>


                      <h3 className="mt-4 font-headline-md text-lg text-on-surface">
                        Belum ada berita
                      </h3>


                      <p className="mt-2 text-sm text-on-surface-variant">
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
                          opacity:
                            0,
                          y:
                            8,
                        }}
                        animate={{
                          opacity:
                            1,
                          y:
                            0,
                        }}
                        transition={{
                          duration:
                            0.25,

                          delay:
                            index *
                            0.03,
                        }}
                        className="align-top border-b border-outline-variant/10 transition-colors hover:bg-primary/5"
                      >

                        {/* ==================================================
                            THUMBNAIL
                        ================================================== */}

                        <td className="px-6 py-5">

                          <div className="h-16 w-28 overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low">

                            {adminThumbnail ? (

                              <img
                                src={
                                  adminThumbnail
                                }
                                alt={
                                  berita.judul
                                }
                                className="h-full w-full object-cover"
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

                              <div className="flex h-full w-full flex-col items-center justify-center">

                                <span className="material-symbols-outlined animate-spin text-primary">
                                  progress_activity
                                </span>


                                <span className="mt-1 text-[10px] text-on-surface-variant">
                                  Memuat...
                                </span>

                              </div>

                            ) : thumbnailError ? (

                              <div className="flex h-full w-full flex-col items-center justify-center px-2 text-center">

                                <span className="material-symbols-outlined text-xl text-red-400">
                                  broken_image
                                </span>


                                <span className="mt-1 text-[9px] leading-tight text-red-500">
                                  Gagal memuat
                                </span>

                              </div>

                            ) : berita.admin_thumbnail ? (

                              <div className="flex h-full w-full items-center justify-center px-2 text-center">

                                <span className="text-[9px] text-on-surface-variant">
                                  Menyiapkan thumbnail...
                                </span>

                              </div>

                            ) : (

                              <div className="flex h-full w-full items-center justify-center">

                                <span className="material-symbols-outlined text-2xl text-on-surface-variant/40">
                                  image
                                </span>

                              </div>

                            )}

                          </div>

                        </td>


                        {/* ==================================================
                            JUDUL
                        ================================================== */}

                        <td className="px-6 py-5">

                          <div className="max-w-320px">

                            <p className="line-clamp-2 wrap-break-word font-label-md font-semibold text-on-surface">
                              {
                                berita.judul
                              }
                            </p>


                            <p className="mt-1 line-clamp-2 text-xs text-on-surface-variant">
                              {
                                berita.slug
                              }
                            </p>

                          </div>

                        </td>


                        {/* ==================================================
                            STATUS
                        ================================================== */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 ${status.bg} ${status.text} font-label-sm`}
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


                        {/* ==================================================
                            PUBLIKASI
                        ================================================== */}

                        <td className="whitespace-nowrap px-6 py-5">

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


                        {/* ==================================================
                            CREATOR
                        ================================================== */}

                        <td className="px-6 py-5">

                          <p className="wrap-break-word text-sm font-semibold text-on-surface">
                            {
                              berita
                                .created_by
                                ?.name ||
                              '-'
                            }
                          </p>

                        </td>


                        {/* ==================================================
                            ACTION
                        ================================================== */}

                        <td className="px-6 py-5">

                          <div className="flex flex-wrap items-center justify-end gap-2">

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
                              className="inline-flex items-center gap-2 rounded-xl border border-outline-variant/30 px-3 py-2 text-sm text-on-surface-variant transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
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
                              className="inline-flex items-center gap-2 rounded-xl border border-outline-variant/30 px-3 py-2 text-sm text-on-surface-variant transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
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
                                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700 disabled:opacity-50"
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
                                className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-3 py-2 text-sm text-white transition-colors hover:bg-yellow-600 disabled:opacity-50"
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
                              className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
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


        {/* ==================================================================
            PAGINATION
        ================================================================== */}

        {!loading &&
          pagination.lastPage >
            1 && (

          <div className="flex flex-col gap-4 border-t border-outline-variant/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

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


            <div className="flex flex-wrap items-center gap-2">

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
                className="rounded-lg border border-outline-variant/40 px-4 py-2 text-sm transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
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
                      className={`min-w-10 rounded-lg px-3 py-2 text-sm ${
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
                className="rounded-lg border border-outline-variant/40 px-4 py-2 text-sm transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Berikutnya
              </button>

            </div>

          </div>

        )}

      </div>


      {/* ====================================================================
          PREVIEW MODAL
      ==================================================================== */}

      {previewBerita && (

        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={
            closePreview
          }
        >

          <motion.div
            initial={{
              opacity:
                0,

              scale:
                0.96,

              y:
                10,
            }}
            animate={{
              opacity:
                1,

              scale:
                1,

              y:
                0,
            }}
            transition={{
              duration:
                0.25,
            }}
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            {/* ==================================================================
                MODAL HEADER
            ================================================================== */}

            <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 px-6 py-5">

              <div className="min-w-0">

                <p className="text-xs font-semibold text-primary">
                  Preview Berita
                </p>


                <h2 className="mt-1 truncate font-headline-md text-xl text-on-surface">
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
                className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary"
                aria-label="Tutup preview"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </div>


            {/* ==================================================================
                MODAL BODY
            ================================================================== */}

            <div className="overflow-y-auto p-6">

              {/* ================================================================
                  THUMBNAIL
              ================================================================ */}

              {thumbnailUrls[
                previewBerita.id
              ] ? (

                <div className="mb-6 overflow-hidden rounded-2xl bg-surface-container-high">

                  <img
                    src={
                      thumbnailUrls[
                        previewBerita.id
                      ]
                    }
                    alt={
                      previewBerita.judul
                    }
                    className="max-h-420px w-full object-cover"
                  />

                </div>

              ) : previewBerita.admin_thumbnail ? (

                <div className="mb-6 flex h-48 flex-col items-center justify-center overflow-hidden rounded-2xl bg-surface-container-low">

                  {thumbnailLoading[
                    previewBerita.id
                  ] ? (

                    <>

                      <span className="material-symbols-outlined animate-spin text-3xl text-primary">
                        progress_activity
                      </span>


                      <span className="mt-2 text-xs text-on-surface-variant">
                        Memuat thumbnail...
                      </span>

                    </>

                  ) : (

                    <>

                      <span className="material-symbols-outlined text-3xl text-red-400">
                        broken_image
                      </span>


                      <span className="mt-2 px-4 text-center text-xs text-red-500">
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


              {/* ================================================================
                  META
              ================================================================ */}

              <div className="flex flex-wrap items-center gap-3">

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                    getStatusStyle(
                      previewBerita.status
                    ).bg
                  } ${
                    getStatusStyle(
                      previewBerita.status
                    ).text
                  }`}
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


              {/* ================================================================
                  TITLE
              ================================================================ */}

              <h1 className="mt-5 wrap-break-word font-headline-lg text-3xl text-primary md:text-4xl">
                {
                  previewBerita.judul
                }
              </h1>


              {/* ================================================================
                  CONTENT
              ================================================================ */}

              <div className="mt-6 wrap-break-word whitespace-pre-line leading-relaxed text-on-surface">
                {
                  previewBerita.isi ||
                  '-'
                }
              </div>


              {/* ================================================================
                  SHARE
              ================================================================ */}

              {previewBerita.status ===
                'published' && (

                <div className="mt-8 border-t border-outline-variant/20 pt-6">

                  <p className="mb-3 font-label-md font-semibold text-on-surface">
                    Bagikan berita ini
                  </p>


                  <div className="flex flex-wrap gap-2">

                    {/* TWITTER */}

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
                      className="inline-flex items-center gap-2 rounded-lg bg-[#1DA1F2] px-4 py-2 text-sm font-semibold text-white"
                    >

                      <FaTwitter />

                      Twitter

                    </a>


                    {/* FACEBOOK */}

                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        getPublicUrl(
                          previewBerita
                        )
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white"
                    >

                      <FaFacebook />

                      Facebook

                    </a>


                    {/* WHATSAPP */}

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `${previewBerita.judul} ${getPublicUrl(
                          previewBerita
                        )}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                    >

                      <FaWhatsapp />

                      WhatsApp

                    </a>


                    {/* INSTAGRAM */}

                    <button
                      type="button"
                      onClick={() =>
                        copyLink(
                          getPublicUrl(
                            previewBerita
                          )
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-[#E4405F] px-4 py-2 text-sm font-semibold text-white"
                    >

                      <FaInstagram />

                      Instagram

                    </button>


                    {/* TIKTOK */}

                    <button
                      type="button"
                      onClick={() =>
                        copyLink(
                          getPublicUrl(
                            previewBerita
                          )
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
                    >

                      <FaTiktok />

                      TikTok

                    </button>


                    {/* COPY LINK */}

                    <button
                      type="button"
                      onClick={() =>
                        copyLink(
                          getPublicUrl(
                            previewBerita
                          )
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >

                      <FaLink />

                      Salin Link

                    </button>

                  </div>

                </div>

              )}

            </div>


            {/* ==================================================================
                MODAL FOOTER
            ================================================================== */}

            <div className="flex justify-end border-t border-outline-variant/20 px-6 py-4">

              <button
                type="button"
                onClick={
                  closePreview
                }
                className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary-container"
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


// ============================================================================
// HELPERS
// ============================================================================

const getFieldError = (
  validationErrors,
  field
) => {

  const value =
    validationErrors?.[
      field
    ];


  if (
    Array.isArray(
      value
    )
  ) {

    return (
      value[0] ||
      ''
    );

  }


  return value ||
    '';

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


// ============================================================================
// EXPORT
// ============================================================================

export default SuperAdminBerita;
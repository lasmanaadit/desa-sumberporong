import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import api from '../../api/axios';

/*
|--------------------------------------------------------------------------
| CONFIG
|--------------------------------------------------------------------------
*/

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const SuperAdminGaleri = () => {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    galeriList,
    setGaleriList,
  ] = useState([]);

  const [
    fotoUrls,
    setFotoUrls,
  ] = useState({});

  const [
    previewFiles,
    setPreviewFiles,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState('');

  const [
    success,
    setSuccess,
  ] = useState('');

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(null);

  const [
    validationErrors,
    setValidationErrors,
  ] = useState([]);

  /*
  |--------------------------------------------------------------------------
  | REFS
  |--------------------------------------------------------------------------
  */

  const fileInputRef =
    useRef(null);

  const previewUrlsRef =
    useRef([]);

  const serverFotoUrlsRef =
    useRef({});

  /*
  |--------------------------------------------------------------------------
  | CLEANUP PREVIEW URL
  |--------------------------------------------------------------------------
  */

  const revokePreviewUrls =
    useCallback(
      () => {
        previewUrlsRef.current.forEach(
          (url) => {
            URL.revokeObjectURL(
              url
            );
          }
        );

        previewUrlsRef.current =
          [];

        setPreviewFiles([]);
      },
      []
    );

  /*
  |--------------------------------------------------------------------------
  | CLEANUP SERVER URL
  |--------------------------------------------------------------------------
  */

  const revokeServerFotoUrls =
    useCallback(
      () => {
        Object.values(
          serverFotoUrlsRef.current
        ).forEach(
          (url) => {
            if (url) {
              URL.revokeObjectURL(
                url
              );
            }
          }
        );

        serverFotoUrlsRef.current =
          {};

        setFotoUrls({});
      },
      []
    );

  /*
  |--------------------------------------------------------------------------
  | CLEANUP COMPONENT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      revokePreviewUrls();
      revokeServerFotoUrls();
    };
  }, [
    revokePreviewUrls,
    revokeServerFotoUrls,
  ]);

  /*
  |--------------------------------------------------------------------------
  | LOAD PHOTO
  |--------------------------------------------------------------------------
  |
  | Endpoint admin membutuhkan Sanctum.
  | Karena itu foto diambil sebagai blob menggunakan Axios.
  |
  */

  const loadFotoUrl =
    useCallback(
      async (
        item
      ) => {
        if (
          !item?.id
        ) {
          return null;
        }

        /*
        |----------------------------------------------------------------------
        | Endpoint foto private
        |----------------------------------------------------------------------
        */

        const endpoint =
        `/admin/files/galeri/${item.id}`;

        try {
          const response =
            await api.get(
              endpoint,
              {
                responseType:
                  'blob',
              }
            );

          const blob =
            response.data;

          if (
            !blob ||
            blob.size === 0
          ) {
            return null;
          }

          const objectUrl =
            URL.createObjectURL(
              blob
            );

          serverFotoUrlsRef.current[
            item.id
          ] =
            objectUrl;

          return objectUrl;
        } catch (
          err
        ) {
          console.error(
            `Gagal mengambil gambar galeri ID ${item.id}:`,
            err
          );

          return null;
        }
      },
      []
    );

  /*
  |--------------------------------------------------------------------------
  | FETCH GALERI
  |--------------------------------------------------------------------------
  */

  const fetchGaleri =
    useCallback(
      async () => {
        setLoading(true);
        setError('');

        revokeServerFotoUrls();

        try {
          const response =
            await api.get(
              '/admin/galeri'
            );

          const responseData =
            response.data?.data;

          const items =
            Array.isArray(
              responseData
            )
              ? responseData
              : [];

          setGaleriList(
            items
          );

          /*
          |--------------------------------------------------------------------
          | Load seluruh gambar private
          |--------------------------------------------------------------------
          */

          const results =
            await Promise.all(
              items.map(
                async (
                  item
                ) => {
                  const url =
                    await loadFotoUrl(
                      item
                    );

                  return {
                    id:
                      item.id,
                    url,
                  };
                }
              )
            );

          const urls =
            {};

          results.forEach(
            (
              result
            ) => {
              if (
                result.url
              ) {
                urls[
                  result.id
                ] =
                  result.url;
              }
            }
          );

          setFotoUrls(
            urls
          );
        } catch (
          err
        ) {
          console.error(
            'Gagal mengambil galeri:',
            err
          );

          setGaleriList(
            []
          );

          setError(
            err.response?.data
              ?.message ||
              'Gagal mengambil daftar galeri.'
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        loadFotoUrl,
        revokeServerFotoUrls,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchGaleri();
  }, [
    fetchGaleri,
  ]);

  /*
  |--------------------------------------------------------------------------
  | OPEN FILE PICKER
  |--------------------------------------------------------------------------
  */

  const handleOpenFilePicker =
    () => {
      if (
        uploading
      ) {
        return;
      }

      fileInputRef.current?.click();
    };

  /*
  |--------------------------------------------------------------------------
  | FILE CHANGE
  |--------------------------------------------------------------------------
  */

  const handleFileChange =
    (
      event
    ) => {
      const files =
        Array.from(
          event.target.files ||
            []
        );

      if (
        files.length ===
        0
      ) {
        return;
      }

      setError('');
      setSuccess('');
      setValidationErrors(
        []
      );

      /*
      |----------------------------------------------------------------------
      | Bersihkan preview sebelumnya
      |----------------------------------------------------------------------
      */

      revokePreviewUrls();

      const validFiles =
        [];

      const errors =
        [];

      files.forEach(
        (
          file
        ) => {
          /*
          |------------------------------------------------------------------
          | VALIDASI TYPE
          |------------------------------------------------------------------
          */

          if (
            !ALLOWED_TYPES.includes(
              file.type
            )
          ) {
            errors.push(
              `${file.name}: format harus JPG, JPEG, PNG, atau WEBP.`
            );

            return;
          }

          /*
          |------------------------------------------------------------------
          | VALIDASI SIZE
          |------------------------------------------------------------------
          */

          if (
            file.size >
            MAX_FILE_SIZE
          ) {
            errors.push(
              `${file.name}: ukuran maksimal 5 MB.`
            );

            return;
          }

          validFiles.push(
            file
          );
        }
      );

      /*
      |----------------------------------------------------------------------
      | Simpan validation error
      |----------------------------------------------------------------------
      */

      if (
        errors.length >
        0
      ) {
        setValidationErrors(
          errors
        );
      }

      /*
      |----------------------------------------------------------------------
      | Buat preview gambar
      |----------------------------------------------------------------------
      */

      const previews =
        validFiles.map(
          (
            file
          ) => {
            const url =
              URL.createObjectURL(
                file
              );

            previewUrlsRef.current.push(
              url
            );

            return {
              file,
              url,
            };
          }
        );

      setPreviewFiles(
        previews
      );
    };

  /*
  |--------------------------------------------------------------------------
  | UPLOAD
  |--------------------------------------------------------------------------
  */

  const handleUpload =
    async () => {
      if (
        uploading
      ) {
        return;
      }

      if (
        previewFiles.length ===
        0
      ) {
        setError(
          'Pilih minimal satu gambar terlebih dahulu.'
        );

        return;
      }

      setUploading(true);
      setError('');
      setSuccess('');

      try {
        const formData =
          new FormData();

        previewFiles.forEach(
          (
            item
          ) => {
            formData.append(
              'foto[]',
              item.file
            );
          }
        );

        const response =
          await api.post(
            '/admin/galeri',
            formData
          );

        setSuccess(
          response.data
            ?.message ||
            'Gambar galeri berhasil diunggah.'
        );

        /*
        |----------------------------------------------------------------------
        | Reset preview
        |----------------------------------------------------------------------
        */

        revokePreviewUrls();

        setValidationErrors(
          []
        );

        if (
          fileInputRef.current
        ) {
          fileInputRef.current.value =
            '';
        }

        /*
        |----------------------------------------------------------------------
        | Refresh data
        |----------------------------------------------------------------------
        */

        await fetchGaleri();
      } catch (
        err
      ) {
        console.error(
          'Gagal upload galeri:',
          err
        );

        const responseData =
          err.response?.data;

        setError(
          responseData
            ?.message ||
            'Gagal mengunggah gambar galeri.'
        );

        /*
        |----------------------------------------------------------------------
        | Laravel validation error
        |----------------------------------------------------------------------
        */

        if (
          responseData?.errors
        ) {
          const collected =
            [];

          Object.values(
            responseData.errors
          ).forEach(
            (
              messages
            ) => {
              if (
                Array.isArray(
                  messages
                )
              ) {
                messages.forEach(
                  (
                    message
                  ) => {
                    collected.push(
                      message
                    );
                  }
                );
              }
            }
          );

          setValidationErrors(
            collected
          );
        }
      } finally {
        setUploading(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | CANCEL PREVIEW
  |--------------------------------------------------------------------------
  */

  const handleCancelUpload =
    () => {
      if (
        uploading
      ) {
        return;
      }

      revokePreviewUrls();

      setValidationErrors(
        []
      );

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          '';
      }
    };

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDelete =
    async (
      item
    ) => {
      if (
        !item?.id ||
        deletingId
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          'Apakah Anda yakin ingin menghapus gambar galeri ini?'
        );

      if (
        !confirmed
      ) {
        return;
      }

      setDeletingId(
        item.id
      );

      setError('');
      setSuccess('');

      try {
        const response =
          await api.delete(
            `/admin/galeri/${item.id}`
          );

        /*
        |----------------------------------------------------------------------
        | Tutup modal jika gambar sedang dibuka
        |----------------------------------------------------------------------
        */

        if (
          selectedImage?.id ===
          item.id
        ) {
          setSelectedImage(
            null
          );
        }

        setSuccess(
          response.data
            ?.message ||
            'Gambar galeri berhasil dihapus.'
        );

        await fetchGaleri();
      } catch (
        err
      ) {
        console.error(
          'Gagal menghapus galeri:',
          err
        );

        setError(
          err.response?.data
            ?.message ||
            'Gambar galeri gagal dihapus.'
        );
      } finally {
        setDeletingId(
          null
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | FORMAT DATE
  |--------------------------------------------------------------------------
  */

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
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="w-full">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="font-headline-lg text-on-background">
              Galeri Desa
            </h1>

            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">
                admin_panel_settings
              </span>

              Super Admin
            </span>

          </div>

          <p className="font-body-md text-on-surface-variant mt-1">
            Kelola dokumentasi kegiatan Desa Sumberporong.
          </p>

        </div>

        <div>

          <input
            ref={
              fileInputRef
            }
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={
              handleFileChange
            }
            className="hidden"
            disabled={
              uploading
            }
          />

          <button
            type="button"
            onClick={
              handleOpenFilePicker
            }
            disabled={
              uploading
            }
            className="px-5 py-3 bg-primary text-white rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
          >

            <span className="material-symbols-outlined">
              add_photo_alternate
            </span>

            Tambah Foto

          </button>

        </div>

      </div>

      {/* =========================================================
          ERROR
      ========================================================== */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <div className="flex items-start gap-2">

            <span className="material-symbols-outlined shrink-0">
              error
            </span>

            <span className="wrap-break-word">
              {error}
            </span>

          </div>

        </div>
      )}

      {/* =========================================================
          SUCCESS
      ========================================================== */}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

          <div className="flex items-start gap-2">

            <span className="material-symbols-outlined shrink-0">
              check_circle
            </span>

            <span className="wrap-break-word">
              {success}
            </span>

          </div>

        </div>
      )}

      {/* =========================================================
          VALIDATION ERRORS
      ========================================================== */}

      {validationErrors.length >
        0 && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">

          <div className="flex items-start gap-2">

            <span className="material-symbols-outlined shrink-0">
              warning
            </span>

            <div className="space-y-1">

              {validationErrors.map(
                (
                  message,
                  index
                ) => (
                  <p
                    key={
                      index
                    }
                  >
                    {message}
                  </p>
                )
              )}

            </div>

          </div>

        </div>
      )}

      {/* =========================================================
          UPLOAD PREVIEW
      ========================================================== */}

      {previewFiles.length >
        0 && (
        <motion.section
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-surface-container-lowest border border-primary/20 rounded-2xl p-6 mb-6"
        >

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

            <div>

              <h2 className="font-headline-md text-lg text-on-surface">
                Foto yang dipilih
              </h2>

              <p className="text-sm text-on-surface-variant mt-1">
                {previewFiles.length}{' '}
                gambar siap diunggah.
              </p>

            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={
                  handleCancelUpload
                }
                disabled={
                  uploading
                }
                className="px-4 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={
                  handleUpload
                }
                disabled={
                  uploading
                }
                className="px-4 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >

                {uploading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>

                    Mengunggah...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">
                      cloud_upload
                    </span>

                    Upload Semua
                  </>
                )}

              </button>

            </div>

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

            {previewFiles.map(
              (
                item,
                index
              ) => (
                <div
                  key={`${item.file.name}-${index}`}
                  className="rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/20"
                >

                  <div className="aspect-square overflow-hidden">

                    <img
                      src={
                        item.url
                      }
                      alt={
                        item.file.name
                      }
                      className="w-full h-full object-cover"
                    />

                  </div>

                  <div className="p-2">

                    <p className="text-xs text-on-surface truncate">
                      {
                        item.file.name
                      }
                    </p>

                    <p className="text-[11px] text-on-surface-variant mt-1">
                      {(
                        item.file.size /
                        1024 /
                        1024
                      ).toFixed(2)}{' '}
                      MB
                    </p>

                  </div>

                </div>
              )
            )}

          </div>

        </motion.section>
      )}

      {/* =========================================================
          GALERI
      ========================================================== */}

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 md:p-6">

        <div className="flex items-center justify-between gap-4 mb-6">

          <div>

            <h2 className="font-headline-md text-lg text-on-surface">
              Semua Foto
            </h2>

            <p className="text-sm text-on-surface-variant mt-1">
              {galeriList.length}{' '}
              foto tersimpan.
            </p>

          </div>

          {!loading &&
            galeriList.length >
              0 && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">

              <span className="material-symbols-outlined text-sm">
                photo_library
              </span>

              Galeri

            </span>
          )}

        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {Array.from({
              length: 8,
            }).map(
              (
                _,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="aspect-square rounded-xl bg-surface-container-high animate-pulse"
                />
              )
            )}

          </div>
        ) : galeriList.length ===
          0 ? (
          <div className="py-16 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

              <span className="material-symbols-outlined text-4xl">
                photo_library
              </span>

            </div>

            <h3 className="font-headline-md text-lg text-on-surface mt-5">
              Belum ada foto galeri
            </h3>

            <p className="text-sm text-on-surface-variant mt-2">
              Tambahkan dokumentasi kegiatan desa melalui tombol Tambah Foto.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

            {galeriList.map(
              (
                item
              ) => {
                const imageUrl =
                  fotoUrls[
                    item.id
                  ];

                return (
                  <motion.div
                    key={
                      item.id
                    }
                    initial={{
                      opacity: 0,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-container-low"
                  >

                    {imageUrl ? (
                      <img
                        src={
                          imageUrl
                        }
                        alt={`Galeri ${item.id}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onClick={() =>
                          setSelectedImage(
                            {
                              ...item,
                              imageUrl,
                            }
                          )
                        }
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          loadFotoUrl(
                            item
                          ).then(
                            (
                              url
                            ) => {
                              if (
                                url
                              ) {
                                setFotoUrls(
                                  (
                                    previous
                                  ) => ({
                                    ...previous,
                                    [item.id]:
                                      url,
                                  })
                                );
                              }
                            }
                          )
                        }
                        className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant"
                      >

                        <span className="material-symbols-outlined text-4xl">
                          image
                        </span>

                        <span className="text-xs mt-2">
                          Muat gambar
                        </span>

                      </button>
                    )}

                    {/* =================================================
                        OVERLAY
                    ================================================== */}

                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* =================================================
                        INFO
                    ================================================== */}

                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">

                      <p className="text-xs">
                        Diunggah{' '}
                        {formatDate(
                          item.created_at
                        )}
                      </p>

                    </div>

                    {/* =================================================
                        DELETE
                    ================================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          item
                        )
                      }
                      disabled={
                        deletingId ===
                        item.id
                      }
                      className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
                      aria-label="Hapus gambar"
                      title="Hapus gambar"
                    >

                      {deletingId ===
                      item.id ? (
                        <span className="material-symbols-outlined text-lg animate-spin">
                          progress_activity
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                      )}

                    </button>

                  </motion.div>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* =========================================================
          MODAL PREVIEW
      ========================================================== */}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() =>
              setSelectedImage(
                null
              )
            }
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 25,
              }}
              className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
            >

              <img
                src={
                  selectedImage.imageUrl
                }
                alt={`Galeri ${selectedImage.id}`}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />

              <button
                type="button"
                onClick={() =>
                  setSelectedImage(
                    null
                  )
                }
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                aria-label="Tutup"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SuperAdminGaleri;
// src/pages/dashboard/EditUmkmPage.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';


import api from '../../api/axios';

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const EMPTY_FORM = {
  nama_umkm: '',
  kategori_id: '',
  deskripsi_umkm: '',
  harga_min: '',
  harga_max: '',
  alamat: '',
  jam_buka_mulai: '',
  jam_buka_selesai: '',
  nomor_wa: '',
  link_ecommerce: '',
};

const EditUmkmPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState({
    ...EMPTY_FORM,
  });

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    existingFoto,
    setExistingFoto,
  ] = useState([]);

  const [
    fotoFiles,
    setFotoFiles,
  ] = useState([]);

  const [
    fotoPreviews,
    setFotoPreviews,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);

  const [
    existingPhotosLoading,
    setExistingPhotosLoading,
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
    validationErrors,
    setValidationErrors,
  ] = useState({});

  /*
  |--------------------------------------------------------------------------
  | Fetch Data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setCategoriesLoading(true);
      setError('');

      try {
        const [
          umkmResponse,
          categoryResponse,
        ] = await Promise.all([
          api.get(
            `/pengajuan/umkm/${id}`
          ),
          api.get(
            '/kategori-umkm'
          ),
        ]);

        if (!mounted) {
          return;
        }

        const umkm =
          umkmResponse.data?.data;

        const categoryData =
          categoryResponse.data?.data;

        if (!umkm) {
          throw new Error(
            'Data UMKM tidak ditemukan.'
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Form
        |--------------------------------------------------------------------------
        */

        setForm({
          nama_umkm:
            umkm.nama_umkm || '',

          kategori_id:
            umkm.kategori?.id
              ? String(
                  umkm.kategori.id
                )
              : '',

          deskripsi_umkm:
            umkm.deskripsi_umkm ||
            '',

          harga_min:
            umkm.harga_min ?? '',

          harga_max:
            umkm.harga_max ?? '',

          alamat:
            umkm.alamat || '',

          jam_buka_mulai:
            umkm.jam_buka_mulai ||
            '',

          jam_buka_selesai:
            umkm.jam_buka_selesai ||
            '',

          nomor_wa:
            umkm.nomor_wa || '',

          link_ecommerce:
            umkm.link_ecommerce ||
            '',
        });

        /*
        |--------------------------------------------------------------------------
        | Existing Photos
        |--------------------------------------------------------------------------
        */

        const sortedPhotos =
          Array.isArray(
            umkm.foto
          )
            ? [...umkm.foto].sort(
                (
                  first,
                  second
                ) =>
                  (first.urutan || 0) -
                  (second.urutan || 0)
              )
            : [];

        setExistingFoto(
          sortedPhotos.map(
            (photo) => ({
              id: photo.id,
              urutan:
                photo.urutan,
              originalUrl:
                photo.url || null,
              displayUrl:
                null,
              loading: true,
              error: false,
            })
          )
        );

        /*
        |--------------------------------------------------------------------------
        | Categories
        |--------------------------------------------------------------------------
        */

        setCategories(
          Array.isArray(
            categoryData
          )
            ? categoryData
            : []
        );
      } catch (err) {
        if (!mounted) {
          return;
        }

        const status =
          err.response?.status;

        if (
          status === 403 ||
          status === 404
        ) {
          setError(
            'UMKM tidak ditemukan atau Anda tidak memiliki akses ke data ini.'
          );

          return;
        }

        setError(
          err.response?.data?.message ||
            err.message ||
            'Gagal memuat data UMKM.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
          setCategoriesLoading(false);
        }
      }
    };

    if (id) {
      fetchData();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Fetch Existing Private Photos
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const fetchExistingPhotos = async () => {
      if (
        existingFoto.length ===
        0
      ) {
        setExistingPhotosLoading(false);
        return;
      }

      setExistingPhotosLoading(true);

      const results =
        await Promise.all(
          existingFoto.map(
            async (photo) => {
              try {
                const response =
                  await api.get(
                    `/files/umkm/${photo.id}`,
                    {
                      responseType:
                        'blob',
                    }
                  );

                if (
                  !response.data ||
                  response.data.size ===
                    0
                ) {
                  throw new Error(
                    'File kosong.'
                  );
                }

                const displayUrl =
                  URL.createObjectURL(
                    response.data
                  );

                return {
                  ...photo,
                  displayUrl,
                  loading: false,
                  error: false,
                };
              } catch {
                return {
                  ...photo,
                  displayUrl:
                    null,
                  loading: false,
                  error: true,
                };
              }
            }
          )
        );

      if (!mounted) {
        results.forEach(
          (photo) => {
            if (
              photo.displayUrl
            ) {
              URL.revokeObjectURL(
                photo.displayUrl
              );
            }
          }
        );

        return;
      }

      setExistingFoto(
        results
      );

      setExistingPhotosLoading(
        false
      );
    };

    if (
      existingFoto.some(
        (photo) =>
          photo.loading
      )
    ) {
      fetchExistingPhotos();
    }

    return () => {
      mounted = false;
    };
  }, [existingFoto]);

  /*
  |--------------------------------------------------------------------------
  | Cleanup Existing Photo Blob URLs
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      existingFoto.forEach(
        (photo) => {
          if (
            photo.displayUrl
          ) {
            URL.revokeObjectURL(
              photo.displayUrl
            );
          }
        }
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Cleanup New Photo URLs
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      fotoPreviews.forEach(
        (url) => {
          if (url) {
            URL.revokeObjectURL(
              url
            );
          }
        }
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Change Handler
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
        [name]: value,
      })
    );

    setValidationErrors(
      (previous) => ({
        ...previous,
        [name]: undefined,
      })
    );

    setError('');
    setSuccess('');
  };

  /*
  |--------------------------------------------------------------------------
  | Remove Existing Photo
  |--------------------------------------------------------------------------
  */

  const removeExistingFoto = (
    photoId
  ) => {
    setExistingFoto(
      (previous) => {
        const photo =
          previous.find(
            (item) =>
              item.id ===
              photoId
          );

        if (
          photo?.displayUrl
        ) {
          URL.revokeObjectURL(
            photo.displayUrl
          );
        }

        return previous.filter(
          (item) =>
            item.id !== photoId
        );
      }
    );

    setValidationErrors(
      (previous) => ({
        ...previous,
        foto: undefined,
      })
    );

    setError('');
    setSuccess('');
  };

  /*
  |--------------------------------------------------------------------------
  | New Photo Upload
  |--------------------------------------------------------------------------
  */

  const handleFotoChange = (
    event
  ) => {
    const files =
      Array.from(
        event.target.files || []
      );

    event.target.value = '';

    if (
      files.length ===
      0
    ) {
      return;
    }

    setError('');
    setSuccess('');

    /*
    |--------------------------------------------------------------------------
    | Validasi Jumlah
    |--------------------------------------------------------------------------
    */

    const totalAfterUpload =
      existingFoto.length +
      fotoFiles.length +
      files.length;

    if (
      totalAfterUpload >
      MAX_PHOTOS
    ) {
      setError(
        `Maksimal ${MAX_PHOTOS} foto UMKM.`
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Validasi File
    |--------------------------------------------------------------------------
    */

    const allowedTypes = [
      'image/jpeg',
      'image/png',
    ];

    for (
      const file of files
    ) {
      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        setError(
          'Foto harus berupa JPG, JPEG, atau PNG.'
        );

        return;
      }

      if (
        file.size >
        MAX_FILE_SIZE
      ) {
        setError(
          'Ukuran setiap foto maksimal 5 MB.'
        );

        return;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Preview
    |--------------------------------------------------------------------------
    */

    const previews =
      files.map(
        (file) =>
          URL.createObjectURL(
            file
          )
      );

    setFotoFiles(
      (previous) => [
        ...previous,
        ...files,
      ]
    );

    setFotoPreviews(
      (previous) => [
        ...previous,
        ...previews,
      ]
    );

    setValidationErrors(
      (previous) => ({
        ...previous,
        foto: undefined,
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Remove New Photo
  |--------------------------------------------------------------------------
  */

  const removeNewFoto = (
    index
  ) => {
    const preview =
      fotoPreviews[index];

    if (preview) {
      URL.revokeObjectURL(
        preview
      );
    }

    setFotoFiles(
      (previous) =>
        previous.filter(
          (
            _,
            currentIndex
          ) =>
            currentIndex !==
            index
        )
    );

    setFotoPreviews(
      (previous) =>
        previous.filter(
          (
            _,
            currentIndex
          ) =>
            currentIndex !==
            index
        )
    );

    setValidationErrors(
      (previous) => ({
        ...previous,
        foto: undefined,
      })
    );

    setError('');
    setSuccess('');
  };

  /*
  |--------------------------------------------------------------------------
  | Total Photos
  |--------------------------------------------------------------------------
  */

  const totalPhotos =
    useMemo(
      () =>
        existingFoto.length +
        fotoFiles.length,
      [
        existingFoto.length,
        fotoFiles.length,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | Client Validation
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    const errors = {};

    if (
      !form.nama_umkm.trim()
    ) {
      errors.nama_umkm =
        'Nama UMKM wajib diisi.';
    }

    if (
      !form.kategori_id
    ) {
      errors.kategori_id =
        'Kategori UMKM wajib dipilih.';
    }

    if (
      !form.deskripsi_umkm.trim()
    ) {
      errors.deskripsi_umkm =
        'Deskripsi UMKM wajib diisi.';
    }

    if (
      form.harga_min === ''
    ) {
      errors.harga_min =
        'Harga minimum wajib diisi.';
    }

    if (
      form.harga_max === ''
    ) {
      errors.harga_max =
        'Harga maksimum wajib diisi.';
    }

    if (
      form.harga_min !== '' &&
      form.harga_max !== '' &&
      Number(
        form.harga_min
      ) >
        Number(
          form.harga_max
        )
    ) {
      errors.harga_max =
        'Harga maksimum tidak boleh lebih kecil dari harga minimum.';
    }

    if (
      !form.alamat.trim()
    ) {
      errors.alamat =
        'Alamat UMKM wajib diisi.';
    }

    /*
    |--------------------------------------------------------------------------
    | Jam
    |--------------------------------------------------------------------------
    |
    | Boleh melewati tengah malam.
    |
    | 07:00 -> 18:00 ✅
    | 15:00 -> 01:00 ✅
    | 22:00 -> 02:00 ✅
    |
    | Hanya jam yang sama yang ditolak.
    |
    */

    if (
      form.jam_buka_mulai &&
      form.jam_buka_selesai &&
      form.jam_buka_mulai ===
        form.jam_buka_selesai
    ) {
      errors.jam_buka_selesai =
        'Jam tutup tidak boleh sama dengan jam buka.';
    }

    if (
      !form.nomor_wa.trim()
    ) {
      errors.nomor_wa =
        'Nomor WhatsApp wajib diisi.';
    }

    if (
      totalPhotos < 1
    ) {
      errors.foto =
        'Minimal 1 foto UMKM harus tersedia.';
    }

    if (
      totalPhotos >
      MAX_PHOTOS
    ) {
      errors.foto =
        'Maksimal 5 foto UMKM.';
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
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');
    setValidationErrors({});

    if (
      !validateForm()
    ) {
      return;
    }

    setSubmitting(true);

    try {
      const formData =
        new FormData();

      /*
      |--------------------------------------------------------------------------
      | Laravel Method Spoofing
      |--------------------------------------------------------------------------
      */

      formData.append(
        '_method',
        'PATCH'
      );

      /*
      |--------------------------------------------------------------------------
      | Data UMKM
      |--------------------------------------------------------------------------
      */

      formData.append(
        'nama_umkm',
        form.nama_umkm.trim()
      );

      formData.append(
        'kategori_id',
        form.kategori_id
      );

      formData.append(
        'deskripsi_umkm',
        form.deskripsi_umkm.trim()
      );

      formData.append(
        'harga_min',
        form.harga_min
      );

      formData.append(
        'harga_max',
        form.harga_max
      );

      formData.append(
        'alamat',
        form.alamat.trim()
      );

      /*
      |--------------------------------------------------------------------------
      | Jam
      |--------------------------------------------------------------------------
      */

      if (
        form.jam_buka_mulai
      ) {
        formData.append(
          'jam_buka_mulai',
          form.jam_buka_mulai
        );
      } else {
        formData.append(
          'jam_buka_mulai',
          ''
        );
      }

      if (
        form.jam_buka_selesai
      ) {
        formData.append(
          'jam_buka_selesai',
          form.jam_buka_selesai
        );
      } else {
        formData.append(
          'jam_buka_selesai',
          ''
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Kontak
      |--------------------------------------------------------------------------
      */

      formData.append(
        'nomor_wa',
        form.nomor_wa.trim()
      );

      if (
        form.link_ecommerce.trim()
      ) {
        formData.append(
          'link_ecommerce',
          form.link_ecommerce.trim()
        );
      } else {
        formData.append(
          'link_ecommerce',
          ''
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Foto Lama
      |--------------------------------------------------------------------------
      |
      | Hanya ID foto yang masih dipertahankan.
      |
      */

      existingFoto.forEach(
        (photo) => {
          formData.append(
            'existing_foto_ids[]',
            String(photo.id)
          );
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Foto Baru
      |--------------------------------------------------------------------------
      */

      fotoFiles.forEach(
        (file) => {
          formData.append(
            'foto[]',
            file
          );
        }
      );

      /*
      |--------------------------------------------------------------------------
      | API
      |--------------------------------------------------------------------------
      */

      const response =
        await api.post(
          `/pengajuan/umkm/${id}`,
          formData
        );

      setSuccess(
        response.data?.message ||
          'UMKM berhasil diperbarui.'
      );

      /*
      |--------------------------------------------------------------------------
      | Cleanup New Photo Preview
      |--------------------------------------------------------------------------
      */

      fotoPreviews.forEach(
        (url) => {
          if (url) {
            URL.revokeObjectURL(
              url
            );
          }
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Redirect
      |--------------------------------------------------------------------------
      */

      window.setTimeout(
        () => {
          navigate(
            '/dashboard/umkm'
          );
        },
        1000
      );
    } catch (err) {
      const responseData =
        err.response?.data;

      setError(
        responseData?.message ||
          'Data UMKM gagal diperbarui.'
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
  | Field Error
  |--------------------------------------------------------------------------
  */

  const getFieldError = (
    field
  ) => {
    const value =
      validationErrors[
        field
      ];

    if (
      Array.isArray(value)
    ) {
      return value[0];
    }

    return value || '';
  };

  /*
  |--------------------------------------------------------------------------
  | Input Class
  |--------------------------------------------------------------------------
  */

  const getInputClass = (
    field
  ) => {
    const hasError =
      Boolean(
        getFieldError(field)
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
        : 'border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/10',
    ].join(' ');
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-background">

        <Sidebar
          isOpen={
            isSidebarOpen
          }
          setIsOpen={
            setIsSidebarOpen
          }
        />

        <div className="min-w-0">

          <Topbar
            setIsOpen={
              setIsSidebarOpen
            }
          />

          <main className="min-h-[80vh] flex items-center justify-center p-6">

            <div className="text-center">

              <span className="material-symbols-outlined animate-spin text-primary text-5xl">
                progress_activity
              </span>

              <p className="mt-4 text-on-surface-variant">
                Memuat data UMKM...
              </p>

            </div>

          </main>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error Page
  |--------------------------------------------------------------------------
  */

  if (
    error &&
    !form.nama_umkm
  ) {
    return (
      <div className="min-h-screen bg-background">

        <Sidebar
          isOpen={
            isSidebarOpen
          }
          setIsOpen={
            setIsSidebarOpen
          }
        />

        <div className="min-w-0">

          <Topbar
            setIsOpen={
              setIsSidebarOpen
            }
          />

          <main className="min-h-[80vh] flex items-center justify-center p-6">

            <div className="text-center max-w-md">

              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">

                <span className="material-symbols-outlined text-3xl">
                  error
                </span>

              </div>

              <h2 className="font-headline-md text-xl text-on-surface mt-4">
                Gagal Memuat UMKM
              </h2>

              <p
                className="text-on-surface-variant mt-2"
                style={{
                  width: '100%',
                  lineHeight: '1.6',
                }}
              >
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/dashboard/umkm'
                  )
                }
                className="mt-6 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container transition-colors"
              >
                Kembali ke UMKM Saya
              </button>

            </div>

          </main>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-background">

      <Sidebar
        isOpen={
          isSidebarOpen
        }
        setIsOpen={
          setIsSidebarOpen
        }
      />

      <div className="min-w-0">

        <Topbar
          setIsOpen={
            setIsSidebarOpen
          }
        />

        <main className="p-4 sm:p-6 lg:p-8">

          <div className="max-w-4xl mx-auto min-w-0">

            {/* HEADER */}

            <div className="mb-8">

              <Link
                to="/dashboard/umkm"
                className="inline-flex items-center gap-2 text-primary font-label-md hover:underline mb-5"
              >
                <span className="material-symbols-outlined">
                  arrow_back
                </span>

                Kembali ke UMKM Saya
              </Link>

              <h1 className="font-headline-lg text-primary">
                Edit UMKM
              </h1>

              <p
                className="text-on-surface-variant mt-2"
                style={{
                  width: '100%',
                  lineHeight: '1.6',
                }}
              >
                Perbarui informasi UMKM Anda.
                Setelah perubahan disimpan,
                UMKM akan masuk ke proses
                verifikasi ulang.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                <div className="flex items-start gap-3 text-red-700">

                  <span className="material-symbols-outlined shrink-0">
                    error
                  </span>

                  <span
                    className="text-sm whitespace-pre-line"
                    style={{
                      width: '100%',
                      lineHeight: '1.5',
                    }}
                  >
                    {error}
                  </span>

                </div>

              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                <div className="flex items-start gap-3 text-green-700">

                  <span className="material-symbols-outlined shrink-0">
                    check_circle
                  </span>

                  <span
                    className="text-sm"
                    style={{
                      width: '100%',
                      lineHeight: '1.5',
                    }}
                  >
                    {success}
                  </span>

                </div>

              </div>
            )}

            <form
              onSubmit={
                handleSubmit
              }
              encType="multipart/form-data"
              className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 sm:p-8 space-y-8"
            >

              {/* INFORMASI UMKM */}

              <section>

                <div className="mb-5">

                  <h2 className="font-headline-md text-lg text-on-surface">
                    Informasi UMKM
                  </h2>

                  <p
                    className="text-on-surface-variant mt-1"
                    style={{
                      width: '100%',
                      lineHeight: '1.6',
                    }}
                  >
                    Data utama usaha Anda.
                  </p>

                </div>

                <div className="space-y-5">

                  {/* NAMA */}

                  <div>

                    <label className="block font-label-md font-semibold mb-2">
                      Nama UMKM
                    </label>

                    <input
                      type="text"
                      name="nama_umkm"
                      value={
                        form.nama_umkm
                      }
                      onChange={
                        handleChange
                      }
                      maxLength={150}
                      disabled={
                        submitting
                      }
                      placeholder="Contoh: Warung Makan Sumber Rejeki"
                      className={getInputClass(
                        'nama_umkm'
                      )}
                    />

                    {getFieldError(
                      'nama_umkm'
                    ) && (
                      <p className="text-xs text-red-600 mt-1.5">
                        {getFieldError(
                          'nama_umkm'
                        )}
                      </p>
                    )}

                  </div>

                  {/* KATEGORI */}

                  <div>

                    <label className="block font-label-md font-semibold mb-2">
                      Kategori
                    </label>

                    <select
                      name="kategori_id"
                      value={
                        form.kategori_id
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        submitting ||
                        categoriesLoading
                      }
                      className={getInputClass(
                        'kategori_id'
                      )}
                    >

                      <option value="">
                        {categoriesLoading
                          ? 'Memuat kategori...'
                          : 'Pilih kategori'}
                      </option>

                      {categories.map(
                        (
                          category
                        ) => (
                          <option
                            key={
                              category.id
                            }
                            value={
                              category.id
                            }
                          >
                            {
                              category.nama
                            }
                          </option>
                        )
                      )}

                    </select>

                    {getFieldError(
                      'kategori_id'
                    ) && (
                      <p className="text-xs text-red-600 mt-1.5">
                        {getFieldError(
                          'kategori_id'
                        )}
                      </p>
                    )}

                  </div>

                  {/* DESKRIPSI */}

                  <div>

                    <label className="block font-label-md font-semibold mb-2">
                      Deskripsi UMKM
                    </label>

                    <textarea
                      name="deskripsi_umkm"
                      value={
                        form.deskripsi_umkm
                      }
                      onChange={
                        handleChange
                      }
                      rows={5}
                      maxLength={5000}
                      disabled={
                        submitting
                      }
                      placeholder="Jelaskan usaha, produk, atau jasa yang Anda tawarkan..."
                      className={[
                        getInputClass(
                          'deskripsi_umkm'
                        ),
                        'resize-none',
                      ].join(' ')}
                    />

                    <div className="flex items-center justify-between gap-3 mt-1.5">

                      {getFieldError(
                        'deskripsi_umkm'
                      ) ? (
                        <p className="text-xs text-red-600">
                          {getFieldError(
                            'deskripsi_umkm'
                          )}
                        </p>
                      ) : (
                        <span />
                      )}

                      <span className="text-xs text-on-surface-variant">
                        {
                          form.deskripsi_umkm
                            .length
                        }
                        /5000
                      </span>

                    </div>

                  </div>

                  {/* ALAMAT */}

                  <div>

                    <label className="block font-label-md font-semibold mb-2">
                      Alamat UMKM
                    </label>

                    <textarea
                      name="alamat"
                      value={
                        form.alamat
                      }
                      onChange={
                        handleChange
                      }
                      rows={3}
                      maxLength={2000}
                      disabled={
                        submitting
                      }
                      placeholder="Contoh: Jl. Pasar No. 12, Sumberporong"
                      className={[
                        getInputClass(
                          'alamat'
                        ),
                        'resize-none',
                      ].join(' ')}
                    />

                    {getFieldError(
                      'alamat'
                    ) && (
                      <p className="text-xs text-red-600 mt-1.5">
                        {getFieldError(
                          'alamat'
                        )}
                      </p>
                    )}

                  </div>

                </div>

              </section>

              {/* HARGA */}

              <section className="border-t border-outline-variant/20 pt-8">

                <div className="mb-5">

                  <h2 className="font-headline-md text-lg text-on-surface">
                    Harga
                  </h2>

                  <p
                    className="text-on-surface-variant mt-1"
                    style={{
                      width: '100%',
                      lineHeight: '1.6',
                    }}
                  >
                    Kisaran harga produk
                    atau jasa.
                  </p>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* MINIMUM */}

                  <div>

                    <label className="block font-label-md font-semibold mb-2">
                      Harga Minimum
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                        Rp
                      </span>

                      <input
                        type="number"
                        name="harga_min"
                        value={
                          form.harga_min
                        }
                        onChange={
                          handleChange
                        }
                        min="0"
                        step="0.01"
                        disabled={
                          submitting
                        }
                        className={[
                          getInputClass(
                            'harga_min'
                          ),
                          'pl-11',
                        ].join(' ')}
                      />

                    </div>

                    {getFieldError(
                      'harga_min'
                    ) && (
                      <p className="text-xs text-red-600 mt-1.5">
                        {getFieldError(
                          'harga_min'
                        )}
                      </p>
                    )}

                  </div>

                  {/* MAXIMUM */}

                  <div>

                    <label className="block font-label-md font-semibold mb-2">
                      Harga Maksimum
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                        Rp
                      </span>

                      <input
                        type="number"
                        name="harga_max"
                        value={
                          form.harga_max
                        }
                        onChange={
                          handleChange
                        }
                        min="0"
                        step="0.01"
                        disabled={
                          submitting
                        }
                        className={[
                          getInputClass(
                            'harga_max'
                          ),
                          'pl-11',
                        ].join(' ')}
                      />

                    </div>

                    {getFieldError(
                      'harga_max'
                    ) && (
                      <p className="text-xs text-red-600 mt-1.5">
                        {getFieldError(
                          'harga_max'
                        )}
                      </p>
                    )}

                  </div>

                </div>

              </section>

              {/* JAM OPERASIONAL */}

              <section className="border-t border-outline-variant/20 pt-8">

                <div className="mb-5">

                  <h2 className="font-headline-md text-lg text-on-surface">
                    Jam Operasional
                  </h2>

                  <p
                    className="text-on-surface-variant mt-1"
                    style={{
                      width: '100%',
                      lineHeight: '1.6',
                    }}
                  >
                    Jam operasional bersifat
                    opsional. Usaha yang buka
                    sampai dini hari tetap dapat
                    menggunakan waktu melewati
                    tengah malam.
                  </p>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* JAM BUKA */}

                  <div>

                    <label className="block font-label-md font-semibold mb-2">
                      Jam Buka
                    </label>

                    <input
                      type="time"
                      name="jam_buka_mulai"
                      value={
                        form.jam_buka_mulai
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        submitting
                      }
                      className={getInputClass(
                        'jam_buka_mulai'
                      )}
                    />

                    {getFieldError(
                      'jam_buka_mulai'
                    ) && (
                      <p className="text-xs text-red-600 mt-1.5">
                        {getFieldError(
                          'jam_buka_mulai'
                        )}
                      </p>
                    )}

                  </div>

                  {/* JAM TUTUP */}

                  <div>

                    <label className="block font-label-md font-semibold mb-2">
                      Jam Tutup
                    </label>

                    <input
                      type="time"
                      name="jam_buka_selesai"
                      value={
                        form.jam_buka_selesai
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        submitting
                      }
                      className={getInputClass(
                        'jam_buka_selesai'
                      )}
                    />

                    {getFieldError(
                      'jam_buka_selesai'
                    ) && (
                      <p className="text-xs text-red-600 mt-1.5">
                        {getFieldError(
                          'jam_buka_selesai'
                        )}
                      </p>
                    )}

                  </div>

                </div>

              </section>

              {/* KONTAK */}

              <section className="border-t border-outline-variant/20 pt-8">

                <div className="mb-5">

                  <h2 className="font-headline-md text-lg text-on-surface">
                    Kontak
                  </h2>

                  <p
                    className="text-on-surface-variant mt-1"
                    style={{
                      width: '100%',
                      lineHeight: '1.6',
                    }}
                  >
                    Informasi yang dapat
                    digunakan pelanggan.
                  </p>

                </div>

                <div className="space-y-5">

                  {/* WHATSAPP */}

                  <div>

                    <label className="block font-label-md font-semibold mb-2">
                      Nomor WhatsApp
                    </label>

                    <input
                      type="tel"
                      name="nomor_wa"
                      value={
                        form.nomor_wa
                      }
                      onChange={
                        handleChange
                      }
                      maxLength={20}
                      placeholder="08xxxxxxxxxx"
                      disabled={
                        submitting
                      }
                      className={getInputClass(
                        'nomor_wa'
                      )}
                    />

                    {getFieldError(
                      'nomor_wa'
                    ) && (
                      <p className="text-xs text-red-600 mt-1.5">
                        {getFieldError(
                          'nomor_wa'
                        )}
                      </p>
                    )}

                  </div>

                  {/* E-COMMERCE */}

                  <div>

                    <label className="block font-label-md font-semibold mb-2">
                      Link E-Commerce
                      <span className="font-normal text-on-surface-variant ml-2">
                        (Opsional)
                      </span>
                    </label>

                    <input
                      type="url"
                      name="link_ecommerce"
                      value={
                        form.link_ecommerce
                      }
                      onChange={
                        handleChange
                      }
                      maxLength={255}
                      placeholder="https://tokopedia.com/..."
                      disabled={
                        submitting
                      }
                      className={getInputClass(
                        'link_ecommerce'
                      )}
                    />

                    {getFieldError(
                      'link_ecommerce'
                    ) && (
                      <p className="text-xs text-red-600 mt-1.5">
                        {getFieldError(
                          'link_ecommerce'
                        )}
                      </p>
                    )}

                  </div>

                </div>

              </section>

              {/* FOTO */}

              <section className="border-t border-outline-variant/20 pt-8">

                <div className="mb-5">

                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">

                    <div>

                      <h2 className="font-headline-md text-lg text-on-surface">
                        Foto UMKM
                      </h2>

                      <p
                        className="text-on-surface-variant mt-1"
                        style={{
                          width: '100%',
                          lineHeight: '1.6',
                        }}
                      >
                        Pertahankan foto lama
                        atau tambahkan foto baru.
                      </p>

                    </div>

                    <span className="text-sm font-semibold text-primary shrink-0">
                      {totalPhotos}/
                      {MAX_PHOTOS}{' '}
                      foto
                    </span>

                  </div>

                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">

                  {/* FOTO LAMA */}

                  {existingFoto.map(
                    (
                      photo,
                      index
                    ) => (
                      <div
                        key={
                          `existing-${photo.id}`
                        }
                        className="relative aspect-square rounded-xl overflow-hidden border border-outline-variant/30 bg-surface"
                      >

                        {photo.loading ? (
                          <div className="w-full h-full flex items-center justify-center bg-surface-container-low">

                            <span className="material-symbols-outlined animate-spin text-primary text-3xl">
                              progress_activity
                            </span>

                          </div>
                        ) : photo.displayUrl ? (
                          <img
                            src={
                              photo.displayUrl
                            }
                            alt={`Foto lama ${
                              index + 1
                            }`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center px-2 text-center">

                            <span className="material-symbols-outlined text-4xl text-red-300">
                              broken_image
                            </span>

                            <span className="text-[10px] text-on-surface-variant mt-1">
                              Foto gagal dimuat
                            </span>

                          </div>
                        )}

                        <div className="absolute left-2 bottom-2 px-2 py-1 rounded-lg bg-black/55 text-white text-[10px]">
                          Foto Lama
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeExistingFoto(
                              photo.id
                            )
                          }
                          disabled={
                            submitting ||
                            existingPhotosLoading
                          }
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-error text-white flex items-center justify-center hover:bg-error/80 transition-colors disabled:opacity-50"
                          aria-label={`Hapus foto ${
                            index + 1
                          }`}
                        >

                          <span className="material-symbols-outlined text-base">
                            close
                          </span>

                        </button>

                      </div>
                    )
                  )}

                  {/* FOTO BARU */}

                  {fotoPreviews.map(
                    (
                      preview,
                      index
                    ) => (
                      <div
                        key={
                          `new-${index}`
                        }
                        className="relative aspect-square rounded-xl overflow-hidden border border-primary/30 bg-surface"
                      >

                        <img
                          src={
                            preview
                          }
                          alt={`Foto baru ${
                            index + 1
                          }`}
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute left-2 bottom-2 px-2 py-1 rounded-lg bg-primary/80 text-white text-[10px]">
                          Foto Baru
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeNewFoto(
                              index
                            )
                          }
                          disabled={
                            submitting
                          }
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-error text-white flex items-center justify-center hover:bg-error/80 transition-colors disabled:opacity-50"
                          aria-label={`Hapus foto baru ${
                            index + 1
                          }`}
                        >

                          <span className="material-symbols-outlined text-base">
                            close
                          </span>

                        </button>

                      </div>
                    )
                  )}

                  {/* TAMBAH FOTO */}

                  {totalPhotos <
                    MAX_PHOTOS && (
                    <label className="relative aspect-square rounded-xl border-2 border-dashed border-outline-variant/40 hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center bg-surface/20 hover:bg-primary/5">

                      <span className="material-symbols-outlined text-3xl text-on-surface-variant/50">
                        add_photo_alternate
                      </span>

                      <span className="text-xs text-on-surface-variant/70 mt-2">
                        Tambah Foto
                      </span>

                      <span className="text-[10px] text-on-surface-variant/50 mt-0.5">
                        {totalPhotos +
                          1}
                      </span>

                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        multiple
                        disabled={
                          submitting
                        }
                        onChange={
                          handleFotoChange
                        }
                        className="hidden"
                      />

                    </label>
                  )}

                </div>

                {getFieldError(
                  'foto'
                ) && (
                  <p className="text-xs text-red-600 mt-2">
                    {getFieldError(
                      'foto'
                    )}
                  </p>
                )}

                <p
                  className="text-xs text-on-surface-variant mt-2"
                  style={{
                    width: '100%',
                    lineHeight: '1.5',
                  }}
                >
                  JPG, JPEG, atau PNG.
                  Maksimal 5 MB per foto.
                  Minimal 1 foto harus tetap
                  tersedia.
                </p>

              </section>

              {/* INFO RE-VERIFICATION */}

              <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-4">

                <div className="flex items-start gap-3">

                  <span className="material-symbols-outlined text-yellow-700 shrink-0">
                    info
                  </span>

                  <div>

                    <p className="text-sm font-semibold text-yellow-800">
                      Perubahan perlu
                      diverifikasi ulang
                    </p>

                    <p
                      className="text-sm text-yellow-700 mt-1"
                      style={{
                        width: '100%',
                        lineHeight: '1.6',
                      }}
                    >
                      Setelah Anda menyimpan
                      perubahan, status UMKM akan
                      kembali menjadi Menunggu
                      Verifikasi dan tidak langsung
                      tampil aktif di publik.
                    </p>

                  </div>

                </div>

              </div>

              {/* BUTTON */}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-outline-variant/20">

                <Link
                  to="/dashboard/umkm"
                  className={[
                    'flex-1',
                    'flex',
                    'items-center',
                    'justify-center',
                    'px-5',
                    'py-3',
                    'rounded-xl',
                    'border',
                    'border-outline-variant',
                    'text-on-surface-variant',
                    'hover:bg-surface-container',
                    'transition-colors',
                    submitting
                      ? 'pointer-events-none opacity-50'
                      : '',
                  ].join(' ')}
                >
                  Batal
                </Link>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    categoriesLoading ||
                    existingPhotosLoading
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                      Simpan Perubahan
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </main>

      </div>

    </div>
  );
};

export default EditUmkmPage;
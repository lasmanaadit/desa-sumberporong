// src/pages/dashboard/AjukanUmkmPage.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
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

const createEmptyPhotoSlots = () =>
  Array.from(
    { length: MAX_PHOTOS },
    () => ({
      file: null,
      preview: null,
    })
  );

const AjukanUmkmPage = () => {
  const navigate = useNavigate();

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
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);

  const [
    categoriesError,
    setCategoriesError,
  ] = useState('');

  const [
    fotoSlots,
    setFotoSlots,
  ] = useState(
    createEmptyPhotoSlots
  );

  const [
    loading,
    setLoading,
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
  | Fetch Kategori
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError('');

      try {
        const response =
          await api.get(
            '/kategori-umkm'
          );

        const data =
          response.data?.data;

        if (!mounted) {
          return;
        }

        setCategories(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        if (!mounted) {
          return;
        }

        setCategoriesError(
          err.response?.data?.message ||
            'Gagal mengambil kategori UMKM.'
        );
      } finally {
        if (mounted) {
          setCategoriesLoading(
            false
          );
        }
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Form Change
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
  | Photo Upload
  |--------------------------------------------------------------------------
  */

  const handleSlotUpload = (
    index,
    file
  ) => {
    if (!file) {
      return;
    }

    setError('');
    setSuccess('');

    /*
    |--------------------------------------------------------------------------
    | Validasi Format
    |--------------------------------------------------------------------------
    */

    const allowedTypes = [
      'image/jpeg',
      'image/png',
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setValidationErrors(
        (previous) => ({
          ...previous,
          foto:
            'Foto harus berupa JPG, JPEG, atau PNG.',
        })
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Validasi Ukuran
    |--------------------------------------------------------------------------
    */

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      setValidationErrors(
        (previous) => ({
          ...previous,
          foto:
            'Ukuran setiap foto maksimal 5 MB.',
        })
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Buat Preview
    |--------------------------------------------------------------------------
    */

    const preview =
      URL.createObjectURL(
        file
      );

    /*
    |--------------------------------------------------------------------------
    | Hapus Object URL Lama
    |--------------------------------------------------------------------------
    */

    const oldPreview =
      fotoSlots[index]?.preview;

    if (oldPreview) {
      URL.revokeObjectURL(
        oldPreview
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Simpan Ke Slot
    |--------------------------------------------------------------------------
    */

    setFotoSlots(
      (previous) => {
        const next = [
          ...previous,
        ];

        next[index] = {
          file,
          preview,
        };

        return next;
      }
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
  | Remove Photo
  |--------------------------------------------------------------------------
  */

  const removeSlot = (
    index
  ) => {
    const current =
      fotoSlots[index];

    if (current?.preview) {
      URL.revokeObjectURL(
        current.preview
      );
    }

    setFotoSlots(
      (previous) => {
        const next = [
          ...previous,
        ];

        next[index] = {
          file: null,
          preview: null,
        };

        return next;
      }
    );

    setError('');
    setSuccess('');
  };

  /*
  |--------------------------------------------------------------------------
  | Uploaded Files
  |--------------------------------------------------------------------------
  */

  const uploadedFiles =
    useMemo(
      () =>
        fotoSlots
          .filter(
            (slot) =>
              slot.file instanceof File
          )
          .map(
            (slot) =>
              slot.file
          ),
      [fotoSlots]
    );

  /*
  |--------------------------------------------------------------------------
  | Client Validation
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    const errors = {};

    /*
    |--------------------------------------------------------------------------
    | Nama
    |--------------------------------------------------------------------------
    */

    if (
      !form.nama_umkm.trim()
    ) {
      errors.nama_umkm =
        'Nama UMKM wajib diisi.';
    }

    /*
    |--------------------------------------------------------------------------
    | Kategori
    |--------------------------------------------------------------------------
    */

    if (
      !form.kategori_id
    ) {
      errors.kategori_id =
        'Kategori UMKM wajib dipilih.';
    }

    /*
    |--------------------------------------------------------------------------
    | Deskripsi
    |--------------------------------------------------------------------------
    */

    if (
      !form.deskripsi_umkm.trim()
    ) {
      errors.deskripsi_umkm =
        'Deskripsi UMKM wajib diisi.';
    }

    /*
    |--------------------------------------------------------------------------
    | Harga
    |--------------------------------------------------------------------------
    */

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
      Number(form.harga_min) >
        Number(form.harga_max)
    ) {
      errors.harga_max =
        'Harga maksimum tidak boleh lebih kecil dari harga minimum.';
    }

    /*
    |--------------------------------------------------------------------------
    | Alamat
    |--------------------------------------------------------------------------
    */

    if (
      !form.alamat.trim()
    ) {
      errors.alamat =
        'Alamat UMKM wajib diisi.';
    }

    /*
    |--------------------------------------------------------------------------
    | Jam Operasional
    |--------------------------------------------------------------------------
    |
    | Boleh melewati tengah malam.
    |
    | 07:00 -> 18:00 ✅
    | 15:00 -> 01:00 ✅
    | 22:00 -> 02:00 ✅
    |
    | Hanya jam yang sama yang tidak diperbolehkan.
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

    /*
    |--------------------------------------------------------------------------
    | WhatsApp
    |--------------------------------------------------------------------------
    */

    if (
      !form.nomor_wa.trim()
    ) {
      errors.nomor_wa =
        'Nomor WhatsApp wajib diisi.';
    }

    /*
    |--------------------------------------------------------------------------
    | Foto
    |--------------------------------------------------------------------------
    */

    if (
      uploadedFiles.length <
      1
    ) {
      errors.foto =
        'Minimal 1 foto UMKM wajib diunggah.';
    }

    if (
      uploadedFiles.length >
      MAX_PHOTOS
    ) {
      errors.foto =
        'Maksimal 5 foto UMKM dapat diunggah.';
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

    setLoading(true);

    try {
      const formData =
        new FormData();

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

      if (
        form.jam_buka_mulai
      ) {
        formData.append(
          'jam_buka_mulai',
          form.jam_buka_mulai
        );
      }

      if (
        form.jam_buka_selesai
      ) {
        formData.append(
          'jam_buka_selesai',
          form.jam_buka_selesai
        );
      }

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
      }

      uploadedFiles.forEach(
        (
          file
        ) => {
          formData.append(
            'foto[]',
            file
          );
        }
      );

      const response =
        await api.post(
          '/pengajuan/umkm',
          formData
        );

      setSuccess(
        response.data?.message ||
          'Pengajuan UMKM berhasil dikirim.'
      );

      /*
      |--------------------------------------------------------------------------
      | Cleanup Preview URL
      |--------------------------------------------------------------------------
      */

      fotoSlots.forEach(
        (slot) => {
          if (slot.preview) {
            URL.revokeObjectURL(
              slot.preview
            );
          }
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Reset
      |--------------------------------------------------------------------------
      */

      setForm({
        ...EMPTY_FORM,
      });

      setFotoSlots(
        createEmptyPhotoSlots()
      );

      setValidationErrors({});

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
        900
      );
    } catch (err) {
      const responseData =
        err.response?.data;

      setError(
        responseData?.message ||
          'Pengajuan UMKM gagal diproses.'
      );

      if (
        responseData?.errors
      ) {
        setValidationErrors(
          responseData.errors
        );
      }
    } finally {
      setLoading(false);
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
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-background">

      <div className="min-w-0">

        <main className="p-4 sm:p-6 lg:p-8">

          <div className="max-w-4xl mx-auto min-w-0">

            {/* ======================================================
                HEADER
            ======================================================= */}

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
                Ajukan UMKM
              </h1>

              <p
                className="text-on-surface-variant mt-2"
                style={{
                  width: '100%',
                  lineHeight: '1.6',
                }}
              >
                Lengkapi data UMKM Anda
                untuk diajukan dan
                ditampilkan di website
                Desa Sumberporong.
              </p>

            </div>

            {/* ======================================================
                ERROR
            ======================================================= */}

            {(error ||
              categoriesError) && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                <div className="flex items-start gap-3 text-red-700">

                  <span className="material-symbols-outlined shrink-0">
                    error
                  </span>

                  <span
                    className="text-sm"
                    style={{
                      width: '100%',
                      lineHeight: '1.5',
                    }}
                  >
                    {error ||
                      categoriesError}
                  </span>

                </div>

              </div>
            )}

            {/* ======================================================
                SUCCESS
            ======================================================= */}

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

            {/* ======================================================
                FORM
            ======================================================= */}

            <form
              onSubmit={
                handleSubmit
              }
              encType="multipart/form-data"
              className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 sm:p-8 space-y-8"
            >

              {/* ====================================================
                  INFORMASI UMKM
              ===================================================== */}

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
                    Masukkan informasi
                    utama usaha Anda.
                  </p>

                </div>

                <div className="space-y-5">

                  {/* Nama */}

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
                      placeholder="Contoh: Warung Makan Sumber Rejeki"
                      maxLength={150}
                      disabled={loading}
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

                  {/* Kategori */}

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
                        loading ||
                        categoriesLoading ||
                        categories.length ===
                          0
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

                    {!categoriesLoading &&
                      categories.length ===
                        0 &&
                      !categoriesError && (
                        <p
                          className="text-xs text-on-surface-variant mt-1.5"
                          style={{
                            width: '100%',
                          }}
                        >
                          Belum ada kategori
                          UMKM yang aktif.
                        </p>
                      )}

                  </div>

                  {/* Deskripsi */}

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
                      placeholder="Jelaskan usaha, produk, atau jasa yang Anda tawarkan..."
                      disabled={loading}
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

                  {/* Alamat */}

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
                      placeholder="Contoh: Jl. Pasar No. 12, Sumberporong"
                      disabled={loading}
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

              {/* ====================================================
                  HARGA
              ===================================================== */}

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
                    Masukkan kisaran harga
                    produk atau jasa.
                  </p>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Harga Minimum */}

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
                        placeholder="10000"
                        disabled={loading}
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

                  {/* Harga Maksimum */}

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
                        placeholder="50000"
                        disabled={loading}
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

              {/* ====================================================
                  JAM OPERASIONAL
              ===================================================== */}

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
                    opsional. Usaha boleh
                    memiliki jam tutup setelah
                    tengah malam.
                  </p>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Jam Buka */}

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
                      disabled={loading}
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

                  {/* Jam Tutup */}

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
                      disabled={loading}
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

              {/* ====================================================
                  KONTAK
              ===================================================== */}

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

                  {/* WhatsApp */}

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
                      placeholder="08xxxxxxxxxx"
                      maxLength={20}
                      disabled={loading}
                      className={getInputClass(
                        'nomor_wa'
                      )}
                    />

                    <p
                      className="text-xs text-on-surface-variant mt-1.5"
                      style={{
                        width: '100%',
                      }}
                    >
                      Nomor ini dapat
                      digunakan pembeli
                      untuk menghubungi Anda.
                    </p>

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

                  {/* E-Commerce */}

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
                      placeholder="https://tokopedia.com/..."
                      maxLength={255}
                      disabled={loading}
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

              {/* ====================================================
                  FOTO
              ===================================================== */}

              <section className="border-t border-outline-variant/20 pt-8">

                <div className="mb-5">

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
                    Upload minimal 1 dan
                    maksimal 5 foto.
                  </p>

                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">

                  {fotoSlots.map(
                    (
                      slot,
                      index
                    ) => (
                      <div
                        key={index}
                        className={[
                          'relative',
                          'aspect-square',
                          'rounded-xl',
                          'border-2',
                          'border-dashed',
                          'overflow-hidden',
                          'bg-surface/20',
                          'transition-colors',
                          'hover:border-primary/50',
                          getFieldError(
                            'foto'
                          )
                            ? 'border-red-300'
                            : 'border-outline-variant/40',
                        ].join(' ')}
                      >

                        {slot.preview ? (
                          <>

                            <img
                              src={
                                slot.preview
                              }
                              alt={`Foto UMKM ${
                                index + 1
                              }`}
                              className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-x-0 bottom-0 bg-black/45 px-2 py-1.5">

                              <p className="text-[11px] text-white truncate">
                                Foto{' '}
                                {index + 1}
                              </p>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeSlot(
                                  index
                                )
                              }
                              disabled={loading}
                              className="absolute top-2 right-2 w-7 h-7 bg-error text-white rounded-full flex items-center justify-center hover:bg-error/80 transition-colors disabled:opacity-50"
                              aria-label={`Hapus foto ${
                                index + 1
                              }`}
                            >

                              <span className="material-symbols-outlined text-base">
                                close
                              </span>

                            </button>

                          </>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">

                            <span className="material-symbols-outlined text-on-surface-variant/50 text-3xl">
                              add_photo_alternate
                            </span>

                            <span className="text-xs text-on-surface-variant/60 mt-1">
                              Tambah
                            </span>

                            <span className="text-[10px] text-on-surface-variant/50 mt-0.5">
                              {index + 1}
                            </span>

                            <input
                              type="file"
                              accept="image/jpeg,image/png"
                              className="hidden"
                              disabled={loading}
                              onChange={(
                                event
                              ) => {
                                const file =
                                  event
                                    .target
                                    .files?.[0];

                                if (file) {
                                  handleSlotUpload(
                                    index,
                                    file
                                  );
                                }

                                event.target.value =
                                  '';
                              }}
                            />

                          </label>
                        )}

                      </div>
                    )
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
                  }}
                >
                  Format JPG, JPEG, atau PNG.
                  Maksimal 5 MB per foto.
                </p>

              </section>

              {/* ====================================================
                  BUTTON
              ===================================================== */}

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
                    loading
                      ? 'pointer-events-none opacity-50'
                      : '',
                  ].join(' ')}
                >
                  Batal
                </Link>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    categoriesLoading ||
                    categories.length ===
                      0
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">
                        progress_activity
                      </span>

                      Mengirim...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">
                        send
                      </span>

                      Ajukan UMKM
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

export default AjukanUmkmPage;
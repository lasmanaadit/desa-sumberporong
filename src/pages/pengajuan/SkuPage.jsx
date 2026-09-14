import React, {
  useRef,
  useState,
} from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TataCara from '../../components/dashboard/TataCaraSku';
import api from '../../api/axios';

const INITIAL_FORM = {
  // DATA PEMOHON
  namaLengkap: '',
  nik: '',
  nomorKK: '',
  jenisKelamin: '',
  tempatLahir: '',
  tanggalLahir: '',
  alamat: '',
  rt: '',
  rw: '',
  kodePos: '',

  // DATA USAHA
  namaUsaha: '',
  jenisUsaha: '',
  deskripsiUsaha: '',
  alamatUsaha: '',
  rtUsaha: '',
  rwUsaha: '',
  lamaUsaha: '',
  penghasilan: '',

  // DOKUMEN
  dokumenKtp: null,
  dokumenKK: null,
  fotoUsaha: null,
};

const INITIAL_ERRORS = {};

const FILE_RULES = {
  dokumenKtp: {
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ],
    maxSize: 5 * 1024 * 1024,
    label: 'KTP',
  },

  dokumenKK: {
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ],
    maxSize: 5 * 1024 * 1024,
    label: 'KK',
  },

  fotoUsaha: {
    allowedTypes: [
      'image/jpeg',
      'image/png',
    ],
    maxSize: 5 * 1024 * 1024,
    label: 'foto tempat usaha',
  },
};

/*
|--------------------------------------------------------------------------
| HELPER: Tanggal hari ini (YYYY-MM-DD)
|--------------------------------------------------------------------------
*/

const getTodayIso = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    today.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/*
|--------------------------------------------------------------------------
| HELPER: dd/mm/yyyy → YYYY-MM-DD
|--------------------------------------------------------------------------
*/

const displayToIso = (display) => {
  if (!display) {
    return '';
  }

  const digits = String(
    display
  ).replace(/\D/g, '');

  if (digits.length !== 8) {
    return '';
  }

  const day = Number(
    digits.slice(0, 2)
  );

  const month = Number(
    digits.slice(2, 4)
  );

  const year = Number(
    digits.slice(4, 8)
  );

  if (!day || !month || !year) {
    return '';
  }

  const date = new Date(
    year,
    month - 1,
    day
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return '';
  }

  return `${year}-${String(
    month
  ).padStart(2, '0')}-${String(
    day
  ).padStart(2, '0')}`;
};

/*
|--------------------------------------------------------------------------
| HELPER: YYYY-MM-DD → dd/mm/yyyy
|--------------------------------------------------------------------------
*/

const isoToDisplay = (iso) => {
  if (!iso) {
    return '';
  }

  const [
    year,
    month,
    day,
  ] = String(iso).split('-');

  if (!year || !month || !day) {
    return '';
  }

  return `${day}/${month}/${year}`;
};

const SkuPage = () => {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | DATE PICKER REF
  |--------------------------------------------------------------------------
  */

  const datePickerRef =
    useRef(null);

  const [form, setForm] =
    useState(INITIAL_FORM);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [fieldErrors, setFieldErrors] =
    useState(INITIAL_ERRORS);

  const [success, setSuccess] =
    useState('');

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const clearFieldError = (
    key
  ) => {
    setFieldErrors((prev) => {
      if (!prev[key]) {
        return prev;
      }

      const next = {
        ...prev,
      };

      delete next[key];

      return next;
    });
  };

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearMessages();
    clearFieldError(
      name
    );
  };

  const handleNumericChange = (
    event,
    field,
    maxLength,
    backendKey = field
  ) => {
    const value =
      event.target.value
        .replace(/\D/g, '')
        .slice(0, maxLength);

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    clearMessages();
    clearFieldError(
      backendKey
    );
  };

  /*
  |--------------------------------------------------------------------------
  | TANGGAL LAHIR — Text input handler
  |--------------------------------------------------------------------------
  |
  | Strip semua non-digit, rebuild dengan slash.
  | Backspace jadi normal.
  |
  */

  const handleTanggalLahirChange = (
    event
  ) => {
    const raw = event.target.value
      .replace(/\D/g, '')
      .slice(0, 8);

    let formatted = '';

    if (raw.length <= 2) {
      formatted = raw;
    } else if (raw.length <= 4) {
      formatted =
        raw.slice(0, 2) +
        '/' +
        raw.slice(2);
    } else {
      formatted =
        raw.slice(0, 2) +
        '/' +
        raw.slice(2, 4) +
        '/' +
        raw.slice(4);
    }

    setForm((prev) => ({
      ...prev,
      tanggalLahir: formatted,
    }));

    clearMessages();
    clearFieldError(
      'tanggal_lahir'
    );
  };

  /*
  |--------------------------------------------------------------------------
  | TANGGAL LAHIR — Native date picker handler
  |--------------------------------------------------------------------------
  */

  const handleDatePickerChange = (
    event
  ) => {
    const iso = event.target.value;

    setForm((prev) => ({
      ...prev,
      tanggalLahir:
        isoToDisplay(iso),
    }));

    clearMessages();
    clearFieldError(
      'tanggal_lahir'
    );
  };

  /*
  |--------------------------------------------------------------------------
  | TANGGAL LAHIR — Buka native date picker
  |--------------------------------------------------------------------------
  */

  const openDatePicker = () => {
    const el =
      datePickerRef.current;

    if (!el) {
      return;
    }

    if (
      typeof el.showPicker ===
      'function'
    ) {
      try {
        el.showPicker();

        return;
      } catch (e) {
        // fallback
      }
    }

    el.click();
  };

  /*
  |--------------------------------------------------------------------------
  | File
  |--------------------------------------------------------------------------
  */

  const validateFile = (
    file,
    rule
  ) => {
    if (!file) {
      return null;
    }

    if (
      !rule.allowedTypes.includes(
        file.type
      )
    ) {
      return `${rule.label} harus berupa PDF, JPG, JPEG, atau PNG.`;
    }

    if (
      file.size >
      rule.maxSize
    ) {
      return `Ukuran ${rule.label} maksimal 5 MB.`;
    }

    return null;
  };

  const handleFileChange = (
    event
  ) => {
    const {
      name,
      files,
    } = event.target;

    const file =
      files?.[0] || null;

    if (!file) {
      return;
    }

    const rule =
      FILE_RULES[name];

    if (!rule) {
      return;
    }

    const fileError =
      validateFile(
        file,
        rule
      );

    if (fileError) {
      setFieldErrors(
        (prev) => ({
          ...prev,
          [`dokumen.${getBackendDocumentKey(name)}`]:
            fileError,
        })
      );

      event.target.value =
        '';

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: file,
    }));

    clearMessages();

    clearFieldError(
      `dokumen.${getBackendDocumentKey(name)}`
    );
  };

  const getBackendDocumentKey = (
    frontendKey
  ) => {
    const map = {
      dokumenKtp:
        'ktp',
      dokumenKK:
        'kk',
      fotoUsaha:
        'foto_tempat_usaha',
    };

    return (
      map[frontendKey] ||
      frontendKey
    );
  };

  const clearFile = (
    field
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: null,
    }));

    clearFieldError(
      `dokumen.${getBackendDocumentKey(field)}`
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    const errors = {};

    if (
      !form.namaLengkap.trim()
    ) {
      errors.nama_lengkap =
        'Nama lengkap wajib diisi.';
    }

    if (
      !/^\d{16}$/.test(
        form.nik
      )
    ) {
      errors.nik =
        'NIK harus terdiri dari 16 digit.';
    }

    if (
      !/^\d{16}$/.test(
        form.nomorKK
      )
    ) {
      errors.nomor_kk =
        'Nomor KK harus terdiri dari 16 digit.';
    }

    if (
      !form.jenisKelamin
    ) {
      errors.jenis_kelamin =
        'Jenis kelamin wajib dipilih.';
    }

    if (
      !form.tempatLahir.trim()
    ) {
      errors.tempat_lahir =
        'Tempat lahir wajib diisi.';
    }

    const tanggalLahirApi =
      displayToIso(
        form.tanggalLahir
      );

    if (!tanggalLahirApi) {
      errors.tanggal_lahir =
        'Tanggal lahir harus valid dengan format dd/mm/yyyy.';
    } else if (
      new Date(
        `${tanggalLahirApi}T00:00:00`
      ) > new Date()
    ) {
      errors.tanggal_lahir =
        'Tanggal lahir tidak boleh melebihi hari ini.';
    }

    if (
      !form.alamat.trim()
    ) {
      errors.alamat =
        'Alamat tempat tinggal wajib diisi.';
    }

    if (!form.rt.trim()) {
      errors.rt =
        'RT wajib diisi.';
    }

    if (!form.rw.trim()) {
      errors.rw =
        'RW wajib diisi.';
    }

    if (
      !/^\d{5}$/.test(
        form.kodePos
      )
    ) {
      errors.kode_pos =
        'Kode pos harus terdiri dari 5 digit.';
    }

    if (
      !form.namaUsaha.trim()
    ) {
      errors.nama_usaha =
        'Nama usaha wajib diisi.';
    }

    if (
      !form.jenisUsaha
    ) {
      errors.jenis_usaha =
        'Jenis usaha wajib dipilih.';
    }

    if (
      !form.deskripsiUsaha.trim()
    ) {
      errors.deskripsi_usaha =
        'Deskripsi usaha wajib diisi.';
    }

    if (
      !form.alamatUsaha.trim()
    ) {
      errors.alamat_usaha =
        'Alamat usaha wajib diisi.';
    }

    if (
      !form.rtUsaha.trim()
    ) {
      errors.rt_usaha =
        'RT tempat usaha wajib diisi.';
    }

    if (
      !form.rwUsaha.trim()
    ) {
      errors.rw_usaha =
        'RW tempat usaha wajib diisi.';
    }

    if (
      form.lamaUsaha === '' ||
      Number.isNaN(
        Number(
          form.lamaUsaha
        )
      ) ||
      Number(form.lamaUsaha) <
        0 ||
      Number(form.lamaUsaha) >
        999
    ) {
      errors.lama_menjalankan_usaha =
        'Lama menjalankan usaha harus antara 0 sampai 999 tahun.';
    }

    if (
      !form.penghasilan
    ) {
      errors.perkiraan_penghasilan_per_bulan =
        'Perkiraan penghasilan per bulan wajib dipilih.';
    }

    /*
    |--------------------------------------------------------------------------
    | Dokumen
    |--------------------------------------------------------------------------
    */

    if (!form.dokumenKtp) {
      errors['dokumen.ktp'] =
        'KTP wajib diunggah.';
    }

    if (!form.dokumenKK) {
      errors['dokumen.kk'] =
        'KK wajib diunggah.';
    }

    if (!form.fotoUsaha) {
      errors[
        'dokumen.foto_tempat_usaha'
      ] =
        'Foto tempat usaha wajib diunggah.';
    }

    return {
      errors,
      tanggalLahirApi,
    };
  };

  /*
  |--------------------------------------------------------------------------
  | Normalize Laravel Errors
  |--------------------------------------------------------------------------
  */

  const normalizeValidationErrors =
    (errors) => {
      const normalized = {};

      Object.entries(
        errors || {}
      ).forEach(
        ([
          key,
          messages,
        ]) => {
          normalized[key] =
            Array.isArray(messages)
              ? messages[0]
              : String(messages);
        }
      );

      return normalized;
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

    if (loading) {
      return;
    }

    clearMessages();
    setFieldErrors(
      {}
    );

    const {
      errors,
      tanggalLahirApi,
    } = validateForm();

    if (
      Object.keys(errors)
        .length > 0
    ) {
      setFieldErrors(
        errors
      );

      const firstError =
        Object.values(
          errors
        ).find(Boolean);

      setError(
        firstError ||
          'Periksa kembali data pengajuan Anda.'
      );

      return;
    }

    const formData =
      new FormData();

    formData.append(
      'nik',
      form.nik
    );

    formData.append(
      'nama_lengkap',
      form.namaLengkap.trim()
    );

    formData.append(
      'nomor_kk',
      form.nomorKK
    );

    formData.append(
      'tempat_lahir',
      form.tempatLahir.trim()
    );

    formData.append(
      'tanggal_lahir',
      tanggalLahirApi
    );

    formData.append(
      'jenis_kelamin',
      form.jenisKelamin
    );

    formData.append(
      'alamat',
      form.alamat.trim()
    );

    formData.append(
      'rt',
      form.rt.trim()
    );

    formData.append(
      'rw',
      form.rw.trim()
    );

    formData.append(
      'kode_pos',
      form.kodePos.trim()
    );

    formData.append(
      'nama_usaha',
      form.namaUsaha.trim()
    );

    formData.append(
      'jenis_usaha',
      form.jenisUsaha
    );

    formData.append(
      'deskripsi_usaha',
      form.deskripsiUsaha.trim()
    );

    formData.append(
      'alamat_usaha',
      form.alamatUsaha.trim()
    );

    formData.append(
      'rt_usaha',
      form.rtUsaha.trim()
    );

    formData.append(
      'rw_usaha',
      form.rwUsaha.trim()
    );

    formData.append(
      'lama_menjalankan_usaha',
      form.lamaUsaha
    );

    formData.append(
      'perkiraan_penghasilan_per_bulan',
      form.penghasilan
    );

    formData.append(
      'dokumen[ktp]',
      form.dokumenKtp
    );

    formData.append(
      'dokumen[kk]',
      form.dokumenKK
    );

    formData.append(
      'dokumen[foto_tempat_usaha]',
      form.fotoUsaha
    );

    setLoading(true);

    try {
      const response =
        await api.post(
          '/pengajuan/sku',
          formData
        );

      setSuccess(
        response.data?.message ||
          'Pengajuan SKU berhasil dikirim.'
      );

      setForm(
        INITIAL_FORM
      );

      window.setTimeout(() => {
        navigate(
          '/dashboard/riwayat',
          {
            replace: true,
          }
        );
      }, 1200);
    } catch (err) {
      const responseData =
        err.response?.data;

      const validationErrors =
        responseData?.errors;

      if (
        validationErrors
      ) {
        const normalizedErrors =
          normalizeValidationErrors(
            validationErrors
          );

        setFieldErrors(
          normalizedErrors
        );

        const firstError =
          Object.values(
            normalizedErrors
          ).find(Boolean);

        setError(
          firstError ||
            responseData?.message ||
            'Periksa kembali data pengajuan Anda.'
        );

        return;
      }

      setError(
        responseData?.message ||
          'Pengajuan SKU gagal diproses. Silakan coba lagi.'
      );
    } finally {
      setLoading(
        false
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render Helpers
  |--------------------------------------------------------------------------
  */

  const inputClass = (
    errorKey
  ) => {
    return `w-full h-12 px-4 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all ${
      fieldErrors[errorKey]
        ? 'border-red-400'
        : 'border-outline-variant/40'
    }`;
  };

  const textareaClass = (
    errorKey
  ) => {
    return `w-full px-4 py-3 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none ${
      fieldErrors[errorKey]
        ? 'border-red-400'
        : 'border-outline-variant/40'
    }`;
  };

  return (
    <div className="min-h-screen bg-background">

      <div className="min-w-0">

        <main className="p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* HEADER */}
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
                duration: 0.4,
              }}
              className="mb-8"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate(-1)
                  }
                  disabled={
                    loading
                  }
                  className="w-10 h-10 shrink-0 rounded-xl border border-outline-variant/30 hover:bg-primary/10 flex items-center justify-center text-on-surface-variant transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">
                    arrow_back
                  </span>
                </button>

                <div>
                  <h1 className="font-headline-lg text-on-background">
                    Surat Keterangan Usaha
                  </h1>

                  <p className="font-body-md text-on-surface-variant mt-1">
                    Isi formulir berikut
                    untuk mengajukan
                    Surat Keterangan Usaha.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* ERROR */}
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

                  <span>
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
                  y: -10,
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

                  <span>
                    {success}
                  </span>
                </div>
              </motion.div>
            )}

            {/* INFORMATION */}
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
                delay: 0.05,
              }}
              className="w-full bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary shrink-0">
                  info
                </span>

                <div>
                  <p className="font-label-md font-semibold text-primary">
                    Perhatian
                  </p>

                  <p className="font-body-md text-on-surface-variant mt-1">
                    Pastikan data
                    pemohon dan data usaha
                    yang dimasukkan sudah
                    benar dan sesuai dengan
                    kondisi sebenarnya.
                  </p>
                </div>
              </div>
            </motion.div>

            <TataCara
              jenisSurat="surat pengantar SKU"
            />

            {/* FORM */}
            <form
              onSubmit={
                handleSubmit
              }
              noValidate
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                }}
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 lg:p-8"
              >
                {/* DATA PEMOHON */}
                <section>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined">
                        person
                      </span>
                    </div>

                    <div>
                      <h2 className="font-headline-md text-xl text-on-background">
                        Data Pemohon
                      </h2>

                      <p className="font-label-sm text-on-surface-variant">
                        Data diri pemohon
                        surat keterangan
                        usaha.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    {/* Nama */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Nama Lengkap
                      </label>

                      <input
                        type="text"
                        name="namaLengkap"
                        value={
                          form.namaLengkap
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Masukkan nama lengkap"
                        disabled={
                          loading
                        }
                        className={inputClass(
                          'nama_lengkap'
                        )}
                        required
                      />

                      {fieldErrors.nama_lengkap && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.nama_lengkap
                          }
                        </p>
                      )}
                    </div>

                    {/* NIK & KK */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="font-label-md text-on-surface block mb-2">
                          NIK
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          value={
                            form.nik
                          }
                          onChange={(
                            event
                          ) =>
                            handleNumericChange(
                              event,
                              'nik',
                              16,
                              'nik'
                            )
                          }
                          placeholder="Masukkan NIK"
                          maxLength={16}
                          disabled={
                            loading
                          }
                          className={inputClass(
                            'nik'
                          )}
                          required
                        />

                        {fieldErrors.nik && (
                          <p className="text-xs text-red-600 mt-1.5">
                            {
                              fieldErrors.nik
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="font-label-md text-on-surface block mb-2">
                          Nomor Kartu Keluarga
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          value={
                            form.nomorKK
                          }
                          onChange={(
                            event
                          ) =>
                            handleNumericChange(
                              event,
                              'nomorKK',
                              16,
                              'nomor_kk'
                            )
                          }
                          placeholder="Masukkan nomor KK"
                          maxLength={16}
                          disabled={
                            loading
                          }
                          className={inputClass(
                            'nomor_kk'
                          )}
                          required
                        />

                        {fieldErrors.nomor_kk && (
                          <p className="text-xs text-red-600 mt-1.5">
                            {
                              fieldErrors.nomor_kk
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Jenis Kelamin
                      </label>

                      <select
                        name="jenisKelamin"
                        value={
                          form.jenisKelamin
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          loading
                        }
                        className={inputClass(
                          'jenis_kelamin'
                        )}
                        required
                      >
                        <option value="">
                          Pilih jenis kelamin
                        </option>

                        <option value="L">
                          Laki-laki
                        </option>

                        <option value="P">
                          Perempuan
                        </option>
                      </select>

                      {fieldErrors.jenis_kelamin && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.jenis_kelamin
                          }
                        </p>
                      )}
                    </div>

                    {/* Tempat & tanggal lahir */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="font-label-md text-on-surface block mb-2">
                          Tempat Lahir
                        </label>

                        <input
                          type="text"
                          name="tempatLahir"
                          value={
                            form.tempatLahir
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Contoh: Malang"
                          disabled={
                            loading
                          }
                          className={inputClass(
                            'tempat_lahir'
                          )}
                          required
                        />

                        {fieldErrors.tempat_lahir && (
                          <p className="text-xs text-red-600 mt-1.5">
                            {
                              fieldErrors.tempat_lahir
                            }
                          </p>
                        )}
                      </div>

                      {/* =========================================================
                          TANGGAL LAHIR — Text input + Calendar button
                      ========================================================= */}

                      <div>
                        <label
                          htmlFor="tanggalLahir"
                          className="font-label-md text-on-surface block mb-2"
                        >
                          Tanggal Lahir
                        </label>

                        <div className="relative">

                          <input
                            id="tanggalLahir"
                            type="text"
                            name="tanggalLahir"
                            inputMode="numeric"
                            value={
                              form.tanggalLahir
                            }
                            onChange={
                              handleTanggalLahirChange
                            }
                            placeholder="dd/mm/yyyy"
                            maxLength={10}
                            disabled={
                              loading
                            }
                            className={`${inputClass(
                              'tanggal_lahir'
                            )} pr-12`}
                            required
                          />

                          <button
                            type="button"
                            onClick={
                              openDatePicker
                            }
                            disabled={
                              loading
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
                            aria-label="Buka kalender"
                          >

                            <span className="material-symbols-outlined">
                              calendar_month
                            </span>

                          </button>

                          {/* Hidden native date input — only for picker */}

                          <input
                            ref={
                              datePickerRef
                            }
                            type="date"
                            tabIndex={-1}
                            aria-hidden="true"
                            value={
                              displayToIso(
                                form.tanggalLahir
                              ) || ''
                            }
                            onChange={
                              handleDatePickerChange
                            }
                            max={
                              getTodayIso()
                            }
                            className="absolute opacity-0 pointer-events-none"
                            style={{
                              width: 0,
                              height: 0,
                              padding: 0,
                              border: 0,
                            }}
                          />

                        </div>

                        {fieldErrors.tanggal_lahir && (
                          <p className="text-xs text-red-600 mt-1.5">
                            {
                              fieldErrors.tanggal_lahir
                            }
                          </p>
                        )}

                        <p className="text-xs text-on-surface-variant mt-1.5">
                          Ketik tanggal atau klik ikon kalender untuk memilih.
                        </p>
                      </div>
                    </div>

                    {/* Alamat */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Alamat Tempat
                        Tinggal
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
                        placeholder="Masukkan alamat lengkap"
                        disabled={
                          loading
                        }
                        className={textareaClass(
                          'alamat'
                        )}
                        required
                      />

                      {fieldErrors.alamat && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.alamat
                          }
                        </p>
                      )}
                    </div>

                    {/* RT RW Kode Pos */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="font-label-md text-on-surface block mb-2">
                          RT
                        </label>

                        <input
                          type="text"
                          name="rt"
                          value={form.rt}
                          onChange={
                            handleChange
                          }
                          placeholder="001"
                          maxLength={5}
                          disabled={
                            loading
                          }
                          className={inputClass(
                            'rt'
                          )}
                          required
                        />

                        {fieldErrors.rt && (
                          <p className="text-xs text-red-600 mt-1.5">
                            {
                              fieldErrors.rt
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="font-label-md text-on-surface block mb-2">
                          RW
                        </label>

                        <input
                          type="text"
                          name="rw"
                          value={form.rw}
                          onChange={
                            handleChange
                          }
                          placeholder="002"
                          maxLength={5}
                          disabled={
                            loading
                          }
                          className={inputClass(
                            'rw'
                          )}
                          required
                        />

                        {fieldErrors.rw && (
                          <p className="text-xs text-red-600 mt-1.5">
                            {
                              fieldErrors.rw
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="font-label-md text-on-surface block mb-2">
                          Kode Pos
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          value={
                            form.kodePos
                          }
                          onChange={(
                            event
                          ) =>
                            handleNumericChange(
                              event,
                              'kodePos',
                              5,
                              'kode_pos'
                            )
                          }
                          placeholder="65176"
                          maxLength={5}
                          disabled={
                            loading
                          }
                          className={inputClass(
                            'kode_pos'
                          )}
                          required
                        />

                        {fieldErrors.kode_pos && (
                          <p className="text-xs text-red-600 mt-1.5">
                            {
                              fieldErrors.kode_pos
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* DATA USAHA */}
                <section className="border-t border-outline-variant/20 pt-8 mt-8">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">
                        storefront
                      </span>
                    </div>

                    <div>
                      <h2 className="font-headline-md text-xl text-on-background">
                        Data Usaha
                      </h2>

                      <p className="font-label-sm text-on-surface-variant">
                        Informasi mengenai
                        usaha yang dimiliki.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    {/* Nama usaha */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Nama Usaha
                      </label>

                      <input
                        type="text"
                        name="namaUsaha"
                        value={
                          form.namaUsaha
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Contoh: Warung Sumber Rejeki"
                        disabled={
                          loading
                        }
                        className={inputClass(
                          'nama_usaha'
                        )}
                        required
                      />

                      {fieldErrors.nama_usaha && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.nama_usaha
                          }
                        </p>
                      )}
                    </div>

                    {/* Jenis usaha */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Jenis Usaha
                      </label>

                      <select
                        name="jenisUsaha"
                        value={
                          form.jenisUsaha
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          loading
                        }
                        className={inputClass(
                          'jenis_usaha'
                        )}
                        required
                      >
                        <option value="">
                          Pilih jenis usaha
                        </option>

                        <option value="perdagangan">
                          Perdagangan
                        </option>

                        <option value="makanan_minuman">
                          Makanan & Minuman
                        </option>

                        <option value="jasa">
                          Jasa
                        </option>

                        <option value="kerajinan">
                          Kerajinan
                        </option>

                        <option value="pertanian">
                          Pertanian
                        </option>

                        <option value="peternakan">
                          Peternakan
                        </option>

                        <option value="lainnya">
                          Lainnya
                        </option>
                      </select>

                      {fieldErrors.jenis_usaha && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.jenis_usaha
                          }
                        </p>
                      )}
                    </div>

                    {/* Deskripsi */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Deskripsi Usaha
                      </label>

                      <textarea
                        name="deskripsiUsaha"
                        value={
                          form.deskripsiUsaha
                        }
                        onChange={
                          handleChange
                        }
                        rows={4}
                        placeholder="Jelaskan secara singkat usaha yang dijalankan..."
                        disabled={
                          loading
                        }
                        className={textareaClass(
                          'deskripsi_usaha'
                        )}
                        required
                      />

                      {fieldErrors.deskripsi_usaha && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.deskripsi_usaha
                          }
                        </p>
                      )}
                    </div>

                    {/* Alamat usaha */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Alamat Usaha
                      </label>

                      <textarea
                        name="alamatUsaha"
                        value={
                          form.alamatUsaha
                        }
                        onChange={
                          handleChange
                        }
                        rows={3}
                        placeholder="Masukkan alamat tempat usaha"
                        disabled={
                          loading
                        }
                        className={textareaClass(
                          'alamat_usaha'
                        )}
                        required
                      />

                      {fieldErrors.alamat_usaha && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.alamat_usaha
                          }
                        </p>
                      )}
                    </div>

                    {/* RT RW usaha */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="font-label-md text-on-surface block mb-2">
                          RT Tempat Usaha
                        </label>

                        <input
                          type="text"
                          name="rtUsaha"
                          value={
                            form.rtUsaha
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="001"
                          maxLength={5}
                          disabled={
                            loading
                          }
                          className={inputClass(
                            'rt_usaha'
                          )}
                          required
                        />

                        {fieldErrors.rt_usaha && (
                          <p className="text-xs text-red-600 mt-1.5">
                            {
                              fieldErrors.rt_usaha
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="font-label-md text-on-surface block mb-2">
                          RW Tempat Usaha
                        </label>

                        <input
                          type="text"
                          name="rwUsaha"
                          value={
                            form.rwUsaha
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="002"
                          maxLength={5}
                          disabled={
                            loading
                          }
                          className={inputClass(
                            'rw_usaha'
                          )}
                          required
                        />

                        {fieldErrors.rw_usaha && (
                          <p className="text-xs text-red-600 mt-1.5">
                            {
                              fieldErrors.rw_usaha
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Lama usaha & penghasilan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="font-label-md text-on-surface block mb-2">
                          Lama Menjalankan
                          Usaha
                        </label>

                        <div className="flex gap-3">
                          <input
                            type="number"
                            name="lamaUsaha"
                            value={
                              form.lamaUsaha
                            }
                            onChange={
                              handleChange
                            }
                            min="0"
                            max="999"
                            placeholder="Contoh: 3"
                            disabled={
                              loading
                            }
                            className={inputClass(
                              'lama_menjalankan_usaha'
                            )}
                            required
                          />

                          <div className="h-12 px-4 rounded-xl bg-surface-container flex items-center text-on-surface-variant font-label-md">
                            Tahun
                          </div>
                        </div>

                        {fieldErrors.lama_menjalankan_usaha && (
                          <p className="text-xs text-red-600 mt-1.5">
                            {
                              fieldErrors.lama_menjalankan_usaha
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="font-label-md text-on-surface block mb-2">
                          Perkiraan
                          Penghasilan per
                          Bulan
                        </label>

                        <select
                          name="penghasilan"
                          value={
                            form.penghasilan
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            loading
                          }
                          className={inputClass(
                            'perkiraan_penghasilan_per_bulan'
                          )}
                          required
                        >
                          <option value="">
                            Pilih kisaran
                            penghasilan
                          </option>

                          <option value="dibawah-1-juta">
                            Di bawah
                            Rp1.000.000
                          </option>

                          <option value="1-5-juta">
                            Rp1.000.000 -
                            Rp5.000.000
                          </option>

                          <option value="5-10-juta">
                            Rp5.000.000 -
                            Rp10.000.000
                          </option>

                          <option value="diatas-10-juta">
                            Di atas
                            Rp10.000.000
                          </option>
                        </select>

                        {fieldErrors.perkiraan_penghasilan_per_bulan && (
                          <p className="text-xs text-red-600 mt-1.5">
                            {
                              fieldErrors.perkiraan_penghasilan_per_bulan
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* DOKUMEN */}
                <section className="border-t border-outline-variant/20 pt-8 mt-8">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">
                        upload_file
                      </span>
                    </div>

                    <div>
                      <h2 className="font-headline-md text-xl text-on-background">
                        Dokumen Pendukung
                      </h2>

                      <p className="font-label-sm text-on-surface-variant">
                        Upload dokumen untuk
                        melengkapi pengajuan.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* KTP */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Kartu Tanda
                        Penduduk (KTP)
                      </label>

                      <input
                        type="file"
                        name="dokumenKtp"
                        onChange={
                          handleFileChange
                        }
                        accept=".jpg,.jpeg,.png,.pdf"
                        disabled={
                          loading
                        }
                        className={`w-full p-3 rounded-xl border bg-surface ${
                          fieldErrors[
                            'dokumen.ktp'
                          ]
                            ? 'border-red-400'
                            : 'border-outline-variant/40'
                        }`}
                      />

                      <p className="font-label-sm text-on-surface-variant mt-2">
                        PDF, JPG, JPEG, PNG
                        — maksimal 5 MB.
                      </p>

                      {form.dokumenKtp && (
                        <div className="flex items-center justify-between gap-3 mt-2 rounded-lg bg-primary/5 px-3 py-2">
                          <p className="text-xs text-primary break-all">
                            {
                              form
                                .dokumenKtp
                                .name
                            }
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              clearFile(
                                'dokumenKtp'
                              )
                            }
                            disabled={
                              loading
                            }
                            className="text-xs text-red-600 hover:underline shrink-0"
                          >
                            Hapus
                          </button>
                        </div>
                      )}

                      {fieldErrors[
                        'dokumen.ktp'
                      ] && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors[
                              'dokumen.ktp'
                            ]
                          }
                        </p>
                      )}
                    </div>

                    {/* KK */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Kartu Keluarga
                        (KK)
                      </label>

                      <input
                        type="file"
                        name="dokumenKK"
                        onChange={
                          handleFileChange
                        }
                        accept=".jpg,.jpeg,.png,.pdf"
                        disabled={
                          loading
                        }
                        className={`w-full p-3 rounded-xl border bg-surface ${
                          fieldErrors[
                            'dokumen.kk'
                          ]
                            ? 'border-red-400'
                            : 'border-outline-variant/40'
                        }`}
                      />

                      <p className="font-label-sm text-on-surface-variant mt-2">
                        PDF, JPG, JPEG, PNG
                        — maksimal 5 MB.
                      </p>

                      {form.dokumenKK && (
                        <div className="flex items-center justify-between gap-3 mt-2 rounded-lg bg-primary/5 px-3 py-2">
                          <p className="text-xs text-primary break-all">
                            {
                              form
                                .dokumenKK
                                .name
                            }
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              clearFile(
                                'dokumenKK'
                              )
                            }
                            disabled={
                              loading
                            }
                            className="text-xs text-red-600 hover:underline shrink-0"
                          >
                            Hapus
                          </button>
                        </div>
                      )}

                      {fieldErrors[
                        'dokumen.kk'
                      ] && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors[
                              'dokumen.kk'
                            ]
                          }
                        </p>
                      )}
                    </div>

                    {/* FOTO USAHA */}
                    <div className="md:col-span-2">
                      <label className="font-label-md text-on-surface block mb-2">
                        Foto Tempat /
                        Kegiatan Usaha
                      </label>

                      <input
                        type="file"
                        name="fotoUsaha"
                        onChange={
                          handleFileChange
                        }
                        accept=".jpg,.jpeg,.png"
                        disabled={
                          loading
                        }
                        className={`w-full p-3 rounded-xl border bg-surface ${
                          fieldErrors[
                            'dokumen.foto_tempat_usaha'
                          ]
                            ? 'border-red-400'
                            : 'border-outline-variant/40'
                        }`}
                      />

                      <p className="font-label-sm text-on-surface-variant mt-2">
                        JPG, JPEG, PNG —
                        maksimal 5 MB.
                      </p>

                      {form.fotoUsaha && (
                        <div className="flex items-center justify-between gap-3 mt-2 rounded-lg bg-primary/5 px-3 py-2">
                          <p className="text-xs text-primary break-all">
                            {
                              form
                                .fotoUsaha
                                .name
                            }
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              clearFile(
                                'fotoUsaha'
                              )
                            }
                            disabled={
                              loading
                            }
                            className="text-xs text-red-600 hover:underline shrink-0"
                          >
                            Hapus
                          </button>
                        </div>
                      )}

                      {fieldErrors[
                        'dokumen.foto_tempat_usaha'
                      ] && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors[
                              'dokumen.foto_tempat_usaha'
                            ]
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* SUBMIT */}
                <div className="border-t border-outline-variant/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="font-label-sm text-on-surface-variant">
                    Pastikan seluruh data
                    yang diisi sudah benar.
                  </p>

                  <button
                    type="submit"
                    disabled={
                      loading
                    }
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-white font-label-md font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">
                      {loading
                        ? 'progress_activity'
                        : 'send'}
                    </span>

                    {loading
                      ? 'Mengirim Pengajuan...'
                      : 'Kirim Pengajuan'}
                  </button>
                </div>
              </motion.div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SkuPage;
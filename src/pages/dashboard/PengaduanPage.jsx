import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const INITIAL_FORM = {
  subjek: '',
  keterangan: '',
  lokasi: '',
  rt: '',
  rw: '',
  nama: '',
  nomor: '',
};

const INITIAL_FILES = {
  fotoBukti: null,
  dokumen: [],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const FOTO_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
];

const DOKUMEN_ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
];

const PengaduanPage = () => {
  const navigate = useNavigate();

  const [
    form,
    setForm,
  ] = useState(
    INITIAL_FORM
  );

  const [
    files,
    setFiles,
  ] = useState(
    INITIAL_FILES
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
    fieldErrors,
    setFieldErrors,
  ] = useState({});

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

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearMessages();
    clearFieldError(name);
  };

  /*
  |--------------------------------------------------------------------------
  | File Validation
  |--------------------------------------------------------------------------
  */

  const validateFile = (
    file,
    allowedTypes,
    label
  ) => {
    if (!file) {
      return null;
    }

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      return `${label} harus berupa PDF, JPG, JPEG, atau PNG.`;
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return `Ukuran ${label} maksimal 5 MB.`;
    }

    return null;
  };

  /*
  |--------------------------------------------------------------------------
  | Foto Bukti
  |--------------------------------------------------------------------------
  */

  const handleFotoBuktiChange = (
    event
  ) => {
    const file =
      event.target.files?.[0] ||
      null;

    if (!file) {
      return;
    }

    const fileError =
      validateFile(
        file,
        FOTO_ALLOWED_TYPES,
        'foto bukti'
      );

    if (fileError) {
      setFieldErrors((prev) => ({
        ...prev,
        foto_bukti: fileError,
      }));

      event.target.value = '';

      return;
    }

    setFiles((prev) => ({
      ...prev,
      fotoBukti: file,
    }));

    clearMessages();
    clearFieldError(
      'foto_bukti'
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Dokumen Pendukung
  |--------------------------------------------------------------------------
  */

  const handleDokumenChange = (
    event
  ) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (
      selectedFiles.length ===
      0
    ) {
      return;
    }

    if (
      selectedFiles.length >
      5
    ) {
      setFieldErrors((prev) => ({
        ...prev,
        dokumen:
          'Maksimal 5 dokumen pendukung.',
      }));

      event.target.value = '';

      return;
    }

    for (
      const file of selectedFiles
    ) {
      const fileError =
        validateFile(
          file,
          DOKUMEN_ALLOWED_TYPES,
          `dokumen "${file.name}"`
        );

      if (fileError) {
        setFieldErrors((prev) => ({
          ...prev,
          dokumen: fileError,
        }));

        event.target.value = '';

        return;
      }
    }

    setFiles((prev) => ({
      ...prev,
      dokumen: selectedFiles,
    }));

    clearMessages();
    clearFieldError(
      'dokumen'
    );
  };

  const removeFotoBukti = () => {
    setFiles((prev) => ({
      ...prev,
      fotoBukti: null,
    }));

    clearFieldError(
      'foto_bukti'
    );
  };

  const removeDokumen = (
    index
  ) => {
    setFiles((prev) => ({
      ...prev,
      dokumen:
        prev.dokumen.filter(
          (_, fileIndex) =>
            fileIndex !== index
        ),
    }));

    clearFieldError(
      'dokumen'
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Validation Form
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    const errors = {};

    if (
      !form.subjek.trim()
    ) {
      errors.subjek =
        'Subjek pengaduan wajib diisi.';
    }

    if (
      !form.keterangan.trim()
    ) {
      errors.keterangan =
        'Deskripsi masalah wajib diisi.';
    }

    if (
      !form.lokasi.trim()
    ) {
      errors.lokasi =
        'Lokasi kejadian wajib diisi.';
    }

    if (
      !form.rt.trim()
    ) {
      errors.rt =
        'RT wajib diisi.';
    }

    if (
      !form.rw.trim()
    ) {
      errors.rw =
        'RW wajib diisi.';
    }

    if (
      !form.nama.trim()
    ) {
      errors.nama =
        'Nama lengkap wajib diisi.';
    }

    if (
      !form.nomor.trim()
    ) {
      errors.nomor =
        'Nomor telepon wajib diisi.';
    }

    return errors;
  };

  /*
  |--------------------------------------------------------------------------
  | Normalize Laravel Validation Errors
  |--------------------------------------------------------------------------
  */

  const normalizeValidationErrors = (
    errors
  ) => {
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
    setFieldErrors({});

    const validationErrors =
      validateForm();

    if (
      Object.keys(
        validationErrors
      ).length > 0
    ) {
      setFieldErrors(
        validationErrors
      );

      const firstError =
        Object.values(
          validationErrors
        ).find(Boolean);

      setError(
        firstError ||
          'Periksa kembali data pengaduan Anda.'
      );

      return;
    }

    const formData =
      new FormData();

    /*
    |--------------------------------------------------------------------------
    | Data Pengaduan
    |--------------------------------------------------------------------------
    */

    formData.append(
      'subjek',
      form.subjek.trim()
    );

    formData.append(
      'keterangan',
      form.keterangan.trim()
    );

    formData.append(
      'lokasi',
      form.lokasi.trim()
    );

    formData.append(
      'rt',
      form.rt.trim()
    );

    formData.append(
      'rw',
      form.rw.trim()
    );

    /*
    |--------------------------------------------------------------------------
    | Data Pelapor
    |--------------------------------------------------------------------------
    */

    formData.append(
      'nama',
      form.nama.trim()
    );

    formData.append(
      'nomor',
      form.nomor.trim()
    );

    /*
    |--------------------------------------------------------------------------
    | Foto Bukti
    |--------------------------------------------------------------------------
    */

    if (
      files.fotoBukti
    ) {
      formData.append(
        'foto_bukti',
        files.fotoBukti
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Dokumen Pendukung
    |--------------------------------------------------------------------------
    |
    | Laravel menerima:
    | dokumen[]
    |
    */

    files.dokumen.forEach(
      (file) => {
        formData.append(
          'dokumen[]',
          file
        );
      }
    );

    setLoading(true);

    try {
      const response =
        await api.post(
          '/pengaduan',
          formData
        );

      setSuccess(
        response.data?.message ||
          'Pengaduan berhasil dikirim.'
      );

      setForm(
        INITIAL_FORM
      );

      setFiles(
        INITIAL_FILES
      );

      window.setTimeout(() => {
        navigate(
          '/dashboard/pengaduan/riwayat',
          {
            replace: true,
          }
        );
      }, 1000);
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
            'Periksa kembali data pengaduan Anda.'
        );

        return;
      }

      setError(
        responseData?.message ||
          'Pengaduan gagal diproses. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Styling Helpers
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
    return `w-full px-4 py-3 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none transition-all ${
      fieldErrors[errorKey]
        ? 'border-red-400'
        : 'border-outline-variant/40'
    }`;
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-background">

      <div className="min-w-0">

        <main className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">

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
              <div className="flex items-center gap-3 mb-3">
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
                    Pengaduan Masyarakat
                  </h1>

                  <p className="font-body-md text-on-surface-variant mt-1">
                    Laporkan masalah atau keluhan
                    untuk ditindaklanjuti oleh
                    pemerintah desa.
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

                  <span className="wrap-break-word">
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
              className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6"
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
                    Pastikan data pengaduan
                    yang Anda masukkan benar.
                    Sertakan bukti pendukung
                    apabila tersedia.
                  </p>
                </div>
              </div>
            </motion.div>

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
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 lg:p-8 space-y-8"
              >

                {/* DATA PENGADUAN */}
                <section>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined">
                        report_problem
                      </span>
                    </div>

                    <div>
                      <h2 className="font-headline-md text-xl text-on-background">
                        Data Pengaduan
                      </h2>

                      <p className="font-label-sm text-on-surface-variant">
                        Isi detail pengaduan
                        dengan jelas.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">

                    {/* SUBJEK */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Subjek Pengaduan
                      </label>

                      <input
                        type="text"
                        name="subjek"
                        value={
                          form.subjek
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Contoh: Jalan rusak di RT 03"
                        disabled={
                          loading
                        }
                        maxLength={150}
                        className={inputClass(
                          'subjek'
                        )}
                      />

                      {fieldErrors.subjek && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.subjek
                          }
                        </p>
                      )}
                    </div>

                    {/* KETERANGAN */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Deskripsi Masalah
                      </label>

                      <textarea
                        name="keterangan"
                        value={
                          form.keterangan
                        }
                        onChange={
                          handleChange
                        }
                        rows={5}
                        placeholder="Jelaskan secara detail masalah yang terjadi..."
                        disabled={
                          loading
                        }
                        className={textareaClass(
                          'keterangan'
                        )}
                      />

                      {fieldErrors.keterangan && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.keterangan
                          }
                        </p>
                      )}
                    </div>

                    {/* LOKASI */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Lokasi Kejadian
                      </label>

                      <textarea
                        name="lokasi"
                        value={
                          form.lokasi
                        }
                        onChange={
                          handleChange
                        }
                        rows={3}
                        placeholder="Contoh: Jalan Raya Sumberporong No. 25"
                        disabled={
                          loading
                        }
                        className={textareaClass(
                          'lokasi'
                        )}
                      />

                      {fieldErrors.lokasi && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.lokasi
                          }
                        </p>
                      )}
                    </div>

                    {/* RT RW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="font-label-md text-on-surface block mb-2">
                          RT
                        </label>

                        <input
                          type="text"
                          name="rt"
                          value={
                            form.rt
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Contoh: 003"
                          maxLength={5}
                          disabled={
                            loading
                          }
                          className={inputClass(
                            'rt'
                          )}
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
                          value={
                            form.rw
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Contoh: 002"
                          maxLength={5}
                          disabled={
                            loading
                          }
                          className={inputClass(
                            'rw'
                          )}
                        />

                        {fieldErrors.rw && (
                          <p className="text-xs text-red-600 mt-1.5">
                            {
                              fieldErrors.rw
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* DATA PELAPOR */}
                <section className="border-t border-outline-variant/20 pt-8">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined">
                        person
                      </span>
                    </div>

                    <div>
                      <h2 className="font-headline-md text-xl text-on-background">
                        Data Pelapor
                      </h2>

                      <p className="font-label-sm text-on-surface-variant">
                        Data diri pelapor untuk
                        memudahkan tindak lanjut.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* NAMA */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Nama Lengkap
                      </label>

                      <input
                        type="text"
                        name="nama"
                        value={
                          form.nama
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Masukkan nama lengkap"
                        maxLength={100}
                        disabled={
                          loading
                        }
                        className={inputClass(
                          'nama'
                        )}
                      />

                      {fieldErrors.nama && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.nama
                          }
                        </p>
                      )}
                    </div>

                    {/* NOMOR */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">
                        Nomor Telepon
                      </label>

                      <input
                        type="tel"
                        name="nomor"
                        value={
                          form.nomor
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="08xxxxxxxxxx"
                        maxLength={20}
                        disabled={
                          loading
                        }
                        className={inputClass(
                          'nomor'
                        )}
                      />

                      {fieldErrors.nomor && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.nomor
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* UPLOAD */}
                <section className="border-t border-outline-variant/20 pt-8">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">
                        upload_file
                      </span>
                    </div>

                    <div>
                      <h2 className="font-headline-md text-xl text-on-background">
                        Bukti Pendukung
                        <span className="text-on-surface-variant text-sm font-normal">
                          {' '}(
                          opsional)
                        </span>
                      </h2>

                      <p className="font-label-sm text-on-surface-variant">
                        Upload bukti jika tersedia.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">

                    {/* FOTO BUKTI */}
                    <div className="rounded-xl border border-outline-variant/20 bg-surface/50 p-4">
                      <label className="font-label-md text-on-surface block mb-2">
                        Foto Bukti
                      </label>

                      <input
                        type="file"
                        name="foto_bukti"
                        accept=".jpg,.jpeg,.png"
                        onChange={
                          handleFotoBuktiChange
                        }
                        disabled={
                          loading
                        }
                        className={`w-full p-3 rounded-xl border bg-surface ${
                          fieldErrors.foto_bukti
                            ? 'border-red-400'
                            : 'border-outline-variant/40'
                        }`}
                      />

                      <p className="font-label-sm text-on-surface-variant mt-2">
                        JPG, JPEG, PNG —
                        maksimal 5 MB.
                      </p>

                      {files.fotoBukti && (
                        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-primary/5 px-3 py-2">
                          <span className="text-xs text-primary break-all">
                            {
                              files
                                .fotoBukti
                                .name
                            }
                          </span>

                          <button
                            type="button"
                            onClick={
                              removeFotoBukti
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

                      {fieldErrors.foto_bukti && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.foto_bukti
                          }
                        </p>
                      )}
                    </div>

                    {/* DOKUMEN */}
                    <div className="rounded-xl border border-outline-variant/20 bg-surface/50 p-4">
                      <label className="font-label-md text-on-surface block mb-2">
                        Dokumen Pendukung
                      </label>

                      <input
                        type="file"
                        name="dokumen"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        onChange={
                          handleDokumenChange
                        }
                        disabled={
                          loading
                        }
                        className={`w-full p-3 rounded-xl border bg-surface ${
                          fieldErrors.dokumen
                            ? 'border-red-400'
                            : 'border-outline-variant/40'
                        }`}
                      />

                      <p className="font-label-sm text-on-surface-variant mt-2">
                        PDF, JPG, JPEG, PNG —
                        maksimal 5 MB per file,
                        maksimal 5 file.
                      </p>

                      {files.dokumen.length >
                        0 && (
                        <div className="mt-3 space-y-2">
                          {files.dokumen.map(
                            (
                              file,
                              index
                            ) => (
                              <div
                                key={`${file.name}-${file.size}-${index}`}
                                className="flex items-center justify-between gap-3 rounded-lg bg-primary/5 px-3 py-2"
                              >
                                <span className="text-xs text-primary break-all">
                                  {file.name}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeDokumen(
                                      index
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
                            )
                          )}
                        </div>
                      )}

                      {fieldErrors.dokumen && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {
                            fieldErrors.dokumen
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* SUBMIT */}
                <div className="border-t border-outline-variant/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="font-label-sm text-on-surface-variant">
                    Pastikan seluruh informasi
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
                      ? 'Mengirim Pengaduan...'
                      : 'Kirim Pengaduan'}
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

export default PengaduanPage;

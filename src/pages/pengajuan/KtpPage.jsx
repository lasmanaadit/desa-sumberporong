import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TataCara from '../../components/dashboard/TataCaraKtp';
import api from '../../api/axios';

const INITIAL_FORM = {
  jenisPermohonan: '',
  namaLengkap: '',
  nomorKK: '',
  nik: '',
  tempatLahir: '',
  tanggalLahir: '',
  jenisKelamin: '',
  alamat: '',
  rt: '',
  rw: '',
  kodePos: '',
  keperluan: '',
};

const INITIAL_FILES = {
  kk: null,
  akta_kelahiran: null,
  ijazah: null,
  ktp_lama: null,
  pengantar_rt_rw: null,
  surat_kehilangan_polsek: null,
};

const SYARAT_DOKUMEN = {
  baru: [
    {
      id: 'kk',
      label: 'Kartu Keluarga (KK)',
      description:
        'Upload KK yang masih jelas dan terbaca.',
      required: true,
    },
    {
      id: 'akta_atau_ijazah',
      label: 'Akta Kelahiran atau Ijazah',
      description:
        'Pilih salah satu dokumen. Salah satunya wajib diunggah.',
      alternative: true,
      required: true,
    },
  ],

  perpanjangan: [
    {
      id: 'ktp_lama',
      label: 'KTP-el Pemohon',
      description:
        'Upload KTP lama yang masih dapat dibaca.',
      required: true,
    },
    {
      id: 'kk',
      label: 'Kartu Keluarga (KK)',
      description:
        'Upload KK yang masih jelas dan terbaca.',
      required: true,
    },
    {
      id: 'pengantar_rt_rw',
      label: 'Surat Pengantar RT/RW',
      description:
        'Upload surat pengantar dari RT/RW.',
      required: true,
    },
  ],

  hilang: [
    {
      id: 'kk',
      label: 'Kartu Keluarga (KK)',
      description:
        'Upload KK yang masih jelas dan terbaca.',
      required: true,
    },
    {
      id: 'surat_kehilangan_polsek',
      label: 'Surat Kehilangan dari Polsek',
      description:
        'Upload surat kehilangan dari kepolisian.',
      required: true,
    },
    {
      id: 'pengantar_rt_rw',
      label: 'Pengantar RT/RW',
      description:
        'Upload pengantar dari RT/RW setempat.',
      required: true,
    },
  ],
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
|
| Menerima:
| - "12/05/2000"
| - "12052000"
| - "12-05-2000"
|
| Mengembalikan:
| - "2000-05-12" kalau valid
| - "" kalau tidak valid
|
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

const KtpPage = () => {
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

  const [files, setFiles] =
    useState(INITIAL_FILES);

  const [showNik, setShowNik] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [fieldErrors, setFieldErrors] =
    useState({});

  const [success, setSuccess] =
    useState('');

  const clearMessages = () => {
    setError('');
    setFieldErrors({});
    setSuccess('');
  };

  const clearFieldError = (key) => {
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

  const getBackendFieldKey = (field) => {
    const map = {
      jenisPermohonan:
        'jenis_permohonan',
      namaLengkap:
        'nama_lengkap',
      nomorKK:
        'nomor_kk',
      tempatLahir:
        'tempat_lahir',
      tanggalLahir:
        'tanggal_lahir',
      jenisKelamin:
        'jenis_kelamin',
      kodePos:
        'kode_pos',
    };

    return map[field] || field;
  };

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    const backendKey =
      getBackendFieldKey(name);

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');

    clearFieldError(
      backendKey
    );

    if (
      name === 'jenisPermohonan'
    ) {
      setFiles(INITIAL_FILES);

      setFieldErrors((prev) => {
        const next = {
          ...prev,
        };

        Object.keys(next)
          .filter((key) =>
            key.startsWith('dokumen.')
          )
          .forEach((key) => {
            delete next[key];
          });

        return next;
      });
    }
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

    setError('');
    clearFieldError(backendKey);
  };

  /*
  |--------------------------------------------------------------------------
  | TANGGAL LAHIR — Text input handler
  |--------------------------------------------------------------------------
  |
  | Strategi: strip semua non-digit, lalu rebuild dengan slash.
  | Backspace jadi normal karena tiap change di-rebuild dari digit murni.
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

    setError('');
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

    setError('');
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
  | HITUNG UMUR
  |--------------------------------------------------------------------------
  */

  const hitungUmur = (
    tanggalLahir
  ) => {
    const iso =
      displayToIso(
        tanggalLahir
      );

    if (!iso) {
      return null;
    }

    const birthDate = new Date(
      `${iso}T00:00:00`
    );

    if (
      Number.isNaN(
        birthDate.getTime()
      )
    ) {
      return null;
    }

    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDiff =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (
        monthDiff === 0 &&
        today.getDate() <
          birthDate.getDate()
      )
    ) {
      age -= 1;
    }

    return age;
  };

  const validateFile = (
    file
  ) => {
    if (!file) {
      return null;
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ];

    const maxSize =
      5 * 1024 * 1024;

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      return 'File harus berupa PDF, JPG, JPEG, atau PNG.';
    }

    if (
      file.size > maxSize
    ) {
      return 'Ukuran file maksimal 5 MB.';
    }

    return null;
  };

  const setDocumentFile = (
    key,
    file
  ) => {
    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));

    setError('');

    clearFieldError(
      `dokumen.${key}`
    );

    clearFieldError(
      'dokumen.akta_kelahiran'
    );

    clearFieldError(
      'dokumen.ijazah'
    );
  };

  const clearDocumentFile = (
    key
  ) => {
    setFiles((prev) => ({
      ...prev,
      [key]: null,
    }));

    clearFieldError(
      `dokumen.${key}`
    );

    clearFieldError(
      'dokumen.akta_kelahiran'
    );

    clearFieldError(
      'dokumen.ijazah'
    );
  };

  const handleFileChange = (
    event,
    docId
  ) => {
    const file =
      event.target.files?.[0] ||
      null;

    if (!file) {
      return;
    }

    const fileError =
      validateFile(file);

    if (fileError) {
      setFieldErrors((prev) => ({
        ...prev,
        [`dokumen.${docId}`]:
          fileError,
      }));

      event.target.value = '';
      return;
    }

    setDocumentFile(
      docId,
      file
    );
  };

  const handleAlternativeFileChange =
    (
      event,
      selectedKey
    ) => {
      const file =
        event.target.files?.[0] ||
        null;

      if (!file) {
        return;
      }

      const fileError =
        validateFile(file);

      if (fileError) {
        setFieldErrors((prev) => ({
          ...prev,
          [`dokumen.${selectedKey}`]:
            fileError,
        }));

        event.target.value = '';
        return;
      }

      const otherKey =
        selectedKey ===
        'akta_kelahiran'
          ? 'ijazah'
          : 'akta_kelahiran';

      setFiles((prev) => ({
        ...prev,
        [selectedKey]: file,
        [otherKey]: null,
      }));

      setError('');

      clearFieldError(
        'dokumen.akta_kelahiran'
      );

      clearFieldError(
        'dokumen.ijazah'
      );
    };

  const validateRequiredDocuments =
    () => {
      const errors = {};

      if (
        form.jenisPermohonan ===
        'baru'
      ) {
        if (!files.kk) {
          errors[
            'dokumen.kk'
          ] =
            'Dokumen KK wajib diunggah.';
        }

        if (
          !files.akta_kelahiran &&
          !files.ijazah
        ) {
          errors[
            'dokumen.akta_kelahiran'
          ] =
            'Akta kelahiran atau ijazah wajib diunggah.';
        }
      }

      if (
        form.jenisPermohonan ===
        'perpanjangan'
      ) {
        if (!files.ktp_lama) {
          errors[
            'dokumen.ktp_lama'
          ] =
            'KTP lama wajib diunggah.';
        }

        if (!files.kk) {
          errors[
            'dokumen.kk'
          ] =
            'Dokumen KK wajib diunggah.';
        }

        if (
          !files.pengantar_rt_rw
        ) {
          errors[
            'dokumen.pengantar_rt_rw'
          ] =
            'Pengantar RT/RW wajib diunggah.';
        }
      }

      if (
        form.jenisPermohonan ===
        'hilang'
      ) {
        if (!files.kk) {
          errors[
            'dokumen.kk'
          ] =
            'Dokumen KK wajib diunggah.';
        }

        if (
          !files.surat_kehilangan_polsek
        ) {
          errors[
            'dokumen.surat_kehilangan_polsek'
          ] =
            'Surat kehilangan Polsek wajib diunggah.';
        }

        if (
          !files.pengantar_rt_rw
        ) {
          errors[
            'dokumen.pengantar_rt_rw'
          ] =
            'Pengantar RT/RW wajib diunggah.';
        }
      }

      return errors;
    };

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

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    clearMessages();

    if (!form.jenisPermohonan) {
      setError(
        'Pilih jenis permohonan terlebih dahulu.'
      );
      return;
    }

    if (
      !/^\d{16}$/.test(
        form.nik
      )
    ) {
      setFieldErrors({
        nik:
          'NIK harus terdiri dari 16 digit.',
      });

      return;
    }

    if (
      !/^\d{16}$/.test(
        form.nomorKK
      )
    ) {
      setFieldErrors({
        nomor_kk:
          'Nomor KK harus terdiri dari 16 digit.',
      });

      return;
    }

    if (
      !form.namaLengkap.trim()
    ) {
      setFieldErrors({
        nama_lengkap:
          'Nama lengkap wajib diisi.',
      });

      return;
    }

    if (
      !form.tempatLahir.trim()
    ) {
      setFieldErrors({
        tempat_lahir:
          'Tempat lahir wajib diisi.',
      });

      return;
    }

    if (!form.alamat.trim()) {
      setFieldErrors({
        alamat:
          'Alamat wajib diisi.',
      });

      return;
    }

    if (!form.rt.trim()) {
      setFieldErrors({
        rt:
          'RT wajib diisi.',
      });

      return;
    }

    if (!form.rw.trim()) {
      setFieldErrors({
        rw:
          'RW wajib diisi.',
      });

      return;
    }

    if (!/^\d{5}$/.test(form.kodePos)) {
      setFieldErrors({
        kode_pos:
          'Kode pos harus terdiri dari 5 digit.',
      });

      return;
    }

    if (!form.jenisKelamin) {
      setFieldErrors({
        jenis_kelamin:
          'Jenis kelamin wajib dipilih.',
      });

      return;
    }

    if (!form.keperluan.trim()) {
      setFieldErrors({
        keperluan:
          'Keperluan wajib diisi.',
      });

      return;
    }

    if (
      form.keperluan.trim().length >
      150
    ) {
      setFieldErrors({
        keperluan:
          'Keperluan maksimal 150 karakter.',
      });

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDASI TANGGAL LAHIR
    |--------------------------------------------------------------------------
    */

    if (!form.tanggalLahir) {
      setFieldErrors({
        tanggal_lahir:
          'Tanggal lahir wajib diisi.',
      });

      return;
    }

    const tanggalLahirIso =
      displayToIso(
        form.tanggalLahir
      );

    if (!tanggalLahirIso) {
      setFieldErrors({
        tanggal_lahir:
          'Format tanggal harus dd/mm/yyyy dan valid.',
      });

      return;
    }

    const birthDate = new Date(
      `${tanggalLahirIso}T00:00:00`
    );

    if (
      Number.isNaN(
        birthDate.getTime()
      )
    ) {
      setFieldErrors({
        tanggal_lahir:
          'Tanggal lahir tidak valid.',
      });

      return;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (birthDate > today) {
      setFieldErrors({
        tanggal_lahir:
          'Tanggal lahir tidak boleh melebihi hari ini.',
      });

      return;
    }

    const umur =
      hitungUmur(
        form.tanggalLahir
      );

    if (umur === null) {
      setFieldErrors({
        tanggal_lahir:
          'Tanggal lahir tidak valid.',
      });

      return;
    }

    if (umur < 17) {
      setFieldErrors({
        tanggal_lahir:
          'Pemohon harus sudah berusia minimal 17 tahun.',
      });

      return;
    }

    const documentErrors =
      validateRequiredDocuments();

    if (
      Object.keys(
        documentErrors
      ).length > 0
    ) {
      setFieldErrors(
        documentErrors
      );

      setError(
        'Lengkapi dokumen wajib sebelum mengirim pengajuan.'
      );

      return;
    }

    const formData =
      new FormData();

    formData.append(
      'jenis_permohonan',
      form.jenisPermohonan
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
      'nik',
      form.nik
    );

    formData.append(
      'tempat_lahir',
      form.tempatLahir.trim()
    );

    formData.append(
      'tanggal_lahir',
      tanggalLahirIso
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
      'keperluan',
      form.keperluan.trim()
    );

    Object.entries(
      files
    ).forEach(
      ([
        key,
        file,
      ]) => {
        if (file) {
          formData.append(
            `dokumen[${key}]`,
            file
          );
        }
      }
    );

    setLoading(true);

    try {
      const response =
        await api.post(
          '/pengajuan/ktp',
          formData
        );

      setSuccess(
        response.data?.message ||
          'Pengajuan KTP berhasil dikirim.'
      );

      setForm({
        ...INITIAL_FORM,
      });

      setFiles({
        ...INITIAL_FILES,
      });

      setShowNik(false);

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
          'Pengajuan KTP gagal diproses. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getDokumenList = () => {
    if (
      !form.jenisPermohonan
    ) {
      return [];
    }

    return (
      SYARAT_DOKUMEN[
        form.jenisPermohonan
      ] || []
    );
  };

  const renderSingleDocument = (
    document
  ) => {
    const file =
      files[document.id];

    const errorKey =
      `dokumen.${document.id}`;

    const documentError =
      fieldErrors[errorKey];

    return (
      <div
        key={document.id}
        className={`p-4 border rounded-xl bg-surface/50 ${
          documentError
            ? 'border-red-300'
            : 'border-outline-variant/20'
        }`}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-label-md font-semibold text-on-surface">
                {document.label}
              </p>

              <p className="text-xs text-on-surface-variant mt-1">
                {document.description}
              </p>
            </div>

            {document.required && (
              <span className="text-xs font-medium text-error">
                Wajib
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(event) =>
                handleFileChange(
                  event,
                  document.id
                )
              }
              disabled={
                loading
              }
              className="block w-full sm:flex-1 text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />

            {file && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-primary font-medium max-w-64 break-all">
                  <span
                    className="material-symbols-outlined shrink-0"
                    style={{
                      fontSize: '16px',
                    }}
                  >
                    check_circle
                  </span>

                  {file.name}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    clearDocumentFile(
                      document.id
                    )
                  }
                  disabled={
                    loading
                  }
                  className="text-xs text-red-600 hover:underline disabled:opacity-50"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>

          {documentError && (
            <p className="text-xs text-red-600">
              {documentError}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderAlternativeDocument =
    () => {
      const selectedFile =
        files.akta_kelahiran
          ? {
              key: 'akta_kelahiran',
              label: 'Akta Kelahiran',
              file:
                files.akta_kelahiran,
            }
          : files.ijazah
            ? {
                key: 'ijazah',
                label: 'Ijazah',
                file:
                  files.ijazah,
              }
            : null;

      const documentError =
        fieldErrors[
          'dokumen.akta_kelahiran'
        ] ||
        fieldErrors[
          'dokumen.ijazah'
        ];

      return (
        <div
          className={`p-4 border rounded-xl bg-surface/50 ${
            documentError
              ? 'border-red-300'
              : 'border-outline-variant/20'
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-label-md font-semibold text-on-surface">
                  Akta Kelahiran atau Ijazah
                </p>

                <p className="text-xs text-on-surface-variant mt-1">
                  {selectedFile
                    ? `Dipilih: ${selectedFile.label}`
                    : 'Pilih salah satu dokumen berikut.'}
                </p>
              </div>

              <span className="text-xs font-medium text-error">
                Wajib
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="border border-outline-variant/30 rounded-xl p-3 cursor-pointer hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-label-sm font-semibold text-on-surface">
                    Akta Kelahiran
                  </span>

                  {files.akta_kelahiran && (
                    <span className="text-xs text-primary font-medium">
                      Terpilih
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(event) =>
                    handleAlternativeFileChange(
                      event,
                      'akta_kelahiran'
                    )
                  }
                  disabled={
                    loading
                  }
                  className="block w-full text-xs text-on-surface-variant"
                />
              </label>

              <label className="border border-outline-variant/30 rounded-xl p-3 cursor-pointer hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-label-sm font-semibold text-on-surface">
                    Ijazah
                  </span>

                  {files.ijazah && (
                    <span className="text-xs text-primary font-medium">
                      Terpilih
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(event) =>
                    handleAlternativeFileChange(
                      event,
                      'ijazah'
                    )
                  }
                  disabled={
                    loading
                  }
                  className="block w-full text-xs text-on-surface-variant"
                />
              </label>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-primary/5 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-xs text-primary font-semibold">
                    {selectedFile.label}
                  </p>

                  <p className="text-xs text-on-surface-variant mt-1 break-all">
                    {selectedFile.file.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    clearDocumentFile(
                      selectedFile.key
                    )
                  }
                  disabled={
                    loading
                  }
                  className="shrink-0 text-xs text-red-600 hover:underline disabled:opacity-50"
                >
                  Hapus
                </button>
              </div>
            )}

            {documentError && (
              <p className="text-xs text-red-600">
                {documentError}
              </p>
            )}
          </div>
        </div>
      );
    };

  return (
    <div className="min-h-screen bg-background">

      <div className="min-w-0">

        <main className="p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
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
                  className="w-10 h-10 rounded-xl border border-outline-variant/30 hover:bg-primary/10 flex items-center justify-center text-on-surface-variant disabled:opacity-50"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '22px',
                    }}
                  >
                    arrow_back
                  </span>
                </button>

                <div>
                  <h1 className="font-headline-lg text-on-background">
                    Pengajuan KTP
                  </h1>

                  <p className="font-body-md text-on-surface-variant mt-1">
                    Formulir pengajuan surat pengantar KTP.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Informasi */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-primary shrink-0"
                  style={{
                    fontSize: '22px',
                  }}
                >
                  info
                </span>

                <div>
                  <p className="font-label-md font-semibold text-primary">
                    Perhatian
                  </p>

                  <p className="font-body-md text-on-surface-variant mt-1">
                    Pastikan data yang Anda masukkan sesuai
                    dengan dokumen kependudukan yang dimiliki.
                  </p>
                </div>
              </div>
            </div>

            <TataCara
              jenisSurat="surat pengantar KTP"
            />

            {/* Error */}
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
                  <span
                    className="material-symbols-outlined shrink-0"
                    style={{
                      fontSize: '20px',
                    }}
                  >
                    error
                  </span>

                  <span>
                    {error}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Success */}
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
                  <span
                    className="material-symbols-outlined shrink-0"
                    style={{
                      fontSize: '20px',
                    }}
                  >
                    check_circle
                  </span>

                  <span>
                    {success}
                  </span>
                </div>
              </motion.div>
            )}

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
                {/* Jenis Permohonan */}
                <div className="mb-8">
                  <h2 className="font-headline-md text-xl text-on-background">
                    Jenis Permohonan
                  </h2>

                  <p className="font-body-md text-on-surface-variant mt-1 mb-5">
                    Pilih jenis permohonan KTP yang akan diajukan.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        value: 'baru',
                        label: 'A. Baru',
                      },
                      {
                        value:
                          'perpanjangan',
                        label:
                          'B. Perpanjangan',
                      },
                      {
                        value:
                          'hilang',
                        label: 'C. Hilang',
                      },
                    ].map(
                      (item) => (
                        <label
                          key={
                            item.value
                          }
                          className={`cursor-pointer border rounded-xl p-4 transition-all ${
                            form.jenisPermohonan ===
                            item.value
                              ? 'border-primary bg-primary/5'
                              : 'border-outline-variant/30 hover:border-primary/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="jenisPermohonan"
                            value={
                              item.value
                            }
                            checked={
                              form.jenisPermohonan ===
                              item.value
                            }
                            onChange={
                              handleChange
                            }
                            disabled={
                              loading
                            }
                            className="sr-only"
                          />

                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                form.jenisPermohonan ===
                                item.value
                                  ? 'border-primary'
                                  : 'border-outline'
                              }`}
                            >
                              {form.jenisPermohonan ===
                                item.value && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                              )}
                            </div>

                            <span className="font-label-md">
                              {item.label}
                            </span>
                          </div>
                        </label>
                      )
                    )}
                  </div>

                  {fieldErrors.jenis_permohonan && (
                    <p className="text-xs text-red-600 mt-2">
                      {
                        fieldErrors.jenis_permohonan
                      }
                    </p>
                  )}
                </div>

                {/* Data Pemohon */}
                <div className="border-t border-outline-variant/20 pt-8">
                  <h2 className="font-headline-md text-xl text-on-background">
                    Data Pemohon
                  </h2>

                  <p className="font-body-md text-on-surface-variant mt-1 mb-5">
                    Masukkan data sesuai dokumen kependudukan.
                  </p>

                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label
                        htmlFor="namaLengkap"
                        className="font-label-md text-on-surface block mb-2"
                      >
                        Nama Lengkap
                      </label>

                      <input
                        id="namaLengkap"
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
                        className={`w-full h-12 px-4 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none ${
                          fieldErrors.nama_lengkap
                            ? 'border-red-400'
                            : 'border-outline-variant/40'
                        }`}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="nomorKK"
                          className="font-label-md text-on-surface block mb-2"
                        >
                          Nomor Kartu Keluarga
                        </label>

                        <input
                          id="nomorKK"
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
                          className={`w-full h-12 px-4 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none ${
                            fieldErrors.nomor_kk
                              ? 'border-red-400'
                              : 'border-outline-variant/40'
                          }`}
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

                      <div>
                        <label
                          htmlFor="nik"
                          className="font-label-md text-on-surface block mb-2"
                        >
                          NIK
                        </label>

                        <div className="relative">
                          <input
                            id="nik"
                            type={
                              showNik
                                ? 'text'
                                : 'password'
                            }
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
                            className={`w-full h-12 px-4 pr-10 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none ${
                              fieldErrors.nik
                                ? 'border-red-400'
                                : 'border-outline-variant/40'
                            }`}
                            required
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowNik(
                                (
                                  prev
                                ) =>
                                  !prev
                              )
                            }
                            disabled={
                              loading
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
                            aria-label={
                              showNik
                                ? 'Sembunyikan NIK'
                                : 'Tampilkan NIK'
                            }
                          >
                            <span className="material-symbols-outlined">
                              {showNik
                                ? 'visibility'
                                : 'visibility_off'}
                            </span>
                          </button>
                        </div>

                        {fieldErrors.nik && (
                          <p className="text-xs text-red-600 mt-1.5">
                            {
                              fieldErrors.nik
                            }
                          </p>
                        )}

                        <p className="text-xs text-on-surface-variant mt-1.5">
                          NIK merupakan data pribadi sensitif.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="tempatLahir"
                          className="font-label-md text-on-surface block mb-2"
                        >
                          Tempat Lahir
                        </label>

                        <input
                          id="tempatLahir"
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
                          className={`w-full h-12 px-4 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none ${
                            fieldErrors.tempat_lahir
                              ? 'border-red-400'
                              : 'border-outline-variant/40'
                          }`}
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
                            className={`w-full h-12 pl-4 pr-12 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none ${
                              fieldErrors.tanggal_lahir
                                ? 'border-red-400'
                                : 'border-outline-variant/40'
                            }`}
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

                    <div>
                      <label
                        htmlFor="jenisKelamin"
                        className="font-label-md text-on-surface block mb-2"
                      >
                        Jenis Kelamin
                      </label>

                      <select
                        id="jenisKelamin"
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
                        className={`w-full h-12 px-4 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none ${
                          fieldErrors.jenis_kelamin
                            ? 'border-red-400'
                            : 'border-outline-variant/40'
                        }`}
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

                    <div>
                      <label
                        htmlFor="alamat"
                        className="font-label-md text-on-surface block mb-2"
                      >
                        Alamat
                      </label>

                      <textarea
                        id="alamat"
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
                        className={`w-full px-4 py-3 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none ${
                          fieldErrors.alamat
                            ? 'border-red-400'
                            : 'border-outline-variant/40'
                        }`}
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

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label
                          htmlFor="rt"
                          className="font-label-md text-on-surface block mb-2"
                        >
                          RT
                        </label>

                        <input
                          id="rt"
                          type="text"
                          name="rt"
                          value={
                            form.rt
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="001"
                          maxLength={5}
                          disabled={
                            loading
                          }
                          className={`w-full h-12 px-4 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none ${
                            fieldErrors.rt
                              ? 'border-red-400'
                              : 'border-outline-variant/40'
                          }`}
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
                        <label
                          htmlFor="rw"
                          className="font-label-md text-on-surface block mb-2"
                        >
                          RW
                        </label>

                        <input
                          id="rw"
                          type="text"
                          name="rw"
                          value={
                            form.rw
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="002"
                          maxLength={5}
                          disabled={
                            loading
                          }
                          className={`w-full h-12 px-4 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none ${
                            fieldErrors.rw
                              ? 'border-red-400'
                              : 'border-outline-variant/40'
                          }`}
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
                        <label
                          htmlFor="kodePos"
                          className="font-label-md text-on-surface block mb-2"
                        >
                          Kode Pos
                        </label>

                        <input
                          id="kodePos"
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
                          className={`w-full h-12 px-4 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none ${
                            fieldErrors.kode_pos
                              ? 'border-red-400'
                              : 'border-outline-variant/40'
                          }`}
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

                    <div>
                      <label
                        htmlFor="keperluan"
                        className="font-label-md text-on-surface block mb-2"
                      >
                        Keperluan
                      </label>

                      <textarea
                        id="keperluan"
                        name="keperluan"
                        value={
                          form.keperluan
                        }
                        onChange={
                          handleChange
                        }
                        rows={3}
                        maxLength={150}
                        placeholder="Jelaskan keperluan pengajuan KTP"
                        disabled={
                          loading
                        }
                        className={`w-full px-4 py-3 rounded-xl bg-surface border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none ${
                          fieldErrors.keperluan
                            ? 'border-red-400'
                            : 'border-outline-variant/40'
                        }`}
                        required
                      />

                      <div className="flex justify-between mt-1.5">
                        {fieldErrors.keperluan ? (
                          <p className="text-xs text-red-600">
                            {
                              fieldErrors.keperluan
                            }
                          </p>
                        ) : (
                          <span />
                        )}

                        <span className="text-xs text-on-surface-variant">
                          {
                            form.keperluan
                              .length
                          }
                          /150
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Dokumen */}
                {form.jenisPermohonan && (
                  <div className="border-t border-outline-variant/20 pt-8 mt-8">
                    <h2 className="font-headline-md text-xl text-on-background">
                      Upload Dokumen
                    </h2>

                    <p className="font-body-md text-on-surface-variant mt-1 mb-5">
                      Upload semua dokumen yang diwajibkan
                      untuk jenis permohonan ini.
                    </p>

                    <div className="space-y-4">
                      {getDokumenList().map(
                        (document) =>
                          document.alternative
                            ? renderAlternativeDocument()
                            : renderSingleDocument(
                                document
                              )
                      )}
                    </div>

                    <p className="text-xs text-on-surface-variant mt-4">
                      Format yang diperbolehkan: PDF, JPG,
                      JPEG, PNG. Maksimal 5 MB per file.
                    </p>
                  </div>
                )}

                {/* Submit */}
                <div className="border-t border-outline-variant/20 mt-8 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(-1)
                    }
                    disabled={
                      loading
                    }
                    className="px-5 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label-md hover:bg-surface-container-low transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={
                      loading
                    }
                    className="px-6 py-3 rounded-xl bg-primary text-white font-label-md font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '20px',
                      }}
                    >
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

export default KtpPage;
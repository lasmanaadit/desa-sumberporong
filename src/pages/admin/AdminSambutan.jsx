// src/pages/admin/AdminSambutan.jsx

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const AdminSambutan = () => {
  /*
  |--------------------------------------------------------------------------
  | State Data Sambutan
  |--------------------------------------------------------------------------
  */

  const [sambutan, setSambutan] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | State Form
  |--------------------------------------------------------------------------
  */

  const [form, setForm] = useState({
    nama: '',
    jabatan: '',
    text: '',
    foto: null,
  });

  /*
  |--------------------------------------------------------------------------
  | State UI
  |--------------------------------------------------------------------------
  */

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /*
  |--------------------------------------------------------------------------
  | Preview Foto
  |--------------------------------------------------------------------------
  |
  | Preview dapat berupa:
  | - Object URL dari file lokal
  | - Object URL dari blob API
  |
  */

  const [fotoPreview, setFotoPreview] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Input File Reference
  |--------------------------------------------------------------------------
  */

  const fileInputRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Simpan Object URL Aktif
  |--------------------------------------------------------------------------
  |
  | Digunakan agar URL blob dapat dibersihkan ketika sudah tidak
  | digunakan lagi.
  |
  */

  const fotoObjectUrlRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Bersihkan Object URL
  |--------------------------------------------------------------------------
  */

  const revokeFotoObjectUrl = () => {
    if (fotoObjectUrlRef.current) {
      URL.revokeObjectURL(
        fotoObjectUrlRef.current
      );

      fotoObjectUrlRef.current = null;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Ambil Foto dari Private Storage
  |--------------------------------------------------------------------------
  |
  | Endpoint file membutuhkan Bearer token, sehingga tidak boleh
  | langsung digunakan sebagai src pada <img>.
  |
  | Axios akan membawa Authorization header melalui interceptor.
  |
  */

  const loadFotoPreview = async (id) => {
    if (!id) {
      return;
    }

    try {
      revokeFotoObjectUrl();

      const response = await api.get(
        `/admin/files/sambutan/${id}`,
        {
          responseType: 'blob',
        }
      );

      const objectUrl = URL.createObjectURL(
        response.data
      );

      fotoObjectUrlRef.current = objectUrl;

      setFotoPreview(objectUrl);
    } catch (err) {
      setFotoPreview(null);

      /*
      |--------------------------------------------------------------------------
      | Tampilkan Error Hanya Jika Bukan Unauthorized
      |--------------------------------------------------------------------------
      |
      | Interceptor axios akan menangani 401.
      |
      */

      if (err.response?.status !== 401) {
        setError(
          err.response?.data?.message ||
            'Foto sambutan gagal dimuat.'
        );
      }
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Ambil Data Sambutan
  |--------------------------------------------------------------------------
  */

  const fetchSambutan = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(
        '/admin/sambutan'
      );

      const data =
        response.data?.sambutan ||
        response.data?.data ||
        null;

      setSambutan(data);

      /*
      |--------------------------------------------------------------------------
      | Jika Data Ada
      |--------------------------------------------------------------------------
      */

      if (data) {
        setForm({
          nama: data.nama || '',
          jabatan: data.jabatan || '',
          text: data.text || '',
          foto: null,
        });

        await loadFotoPreview(data.id);
      } else {
        revokeFotoObjectUrl();
        setFotoPreview(null);

        setForm({
          nama: '',
          jabatan: '',
          text: '',
          foto: null,
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Gagal mengambil data sambutan.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load Data Saat Halaman Dibuka
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchSambutan();

    /*
    |--------------------------------------------------------------------------
    | Cleanup
    |--------------------------------------------------------------------------
    */

    return () => {
      revokeFotoObjectUrl();
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Reset Form
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setForm({
      nama: '',
      jabatan: '',
      text: '',
      foto: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Buka Form Tambah
  |--------------------------------------------------------------------------
  */

  const handleAdd = () => {
    resetForm();

    revokeFotoObjectUrl();
    setFotoPreview(null);

    setError('');
    setSuccess('');
    setIsEditing(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Buka Form Edit
  |--------------------------------------------------------------------------
  */

  const handleEdit = async () => {
    if (!sambutan) {
      return;
    }

    setForm({
      nama: sambutan.nama || '',
      jabatan: sambutan.jabatan || '',
      text: sambutan.text || '',
      foto: null,
    });

    setError('');
    setSuccess('');
    setIsEditing(true);

    /*
    |--------------------------------------------------------------------------
    | Muat Foto Lama
    |--------------------------------------------------------------------------
    */

    await loadFotoPreview(sambutan.id);
  };

  /*
  |--------------------------------------------------------------------------
  | Handle Perubahan Input Text
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
    setSuccess('');
  };

  /*
  |--------------------------------------------------------------------------
  | Handle Perubahan Foto
  |--------------------------------------------------------------------------
  */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Validasi Tipe File
    |--------------------------------------------------------------------------
    */

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        'Format foto harus JPG, JPEG, PNG, atau WEBP.'
      );

      e.target.value = '';

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Validasi Ukuran
    |--------------------------------------------------------------------------
    |
    | Maksimal 5 MB.
    |
    */

    if (file.size > 5 * 1024 * 1024) {
      setError(
        'Ukuran foto maksimal 5 MB.'
      );

      e.target.value = '';

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Simpan File ke Form
    |--------------------------------------------------------------------------
    */

    setForm((prev) => ({
      ...prev,
      foto: file,
    }));

    /*
    |--------------------------------------------------------------------------
    | Bersihkan Preview Lama
    |--------------------------------------------------------------------------
    */

    revokeFotoObjectUrl();

    /*
    |--------------------------------------------------------------------------
    | Preview Foto Baru
    |--------------------------------------------------------------------------
    */

    const localPreviewUrl =
      URL.createObjectURL(file);

    fotoObjectUrlRef.current =
      localPreviewUrl;

    setFotoPreview(localPreviewUrl);

    setError('');
    setSuccess('');
  };

  /*
  |--------------------------------------------------------------------------
  | Buka File Picker
  |--------------------------------------------------------------------------
  */

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  /*
  |--------------------------------------------------------------------------
  | Validasi Form
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    /*
    |--------------------------------------------------------------------------
    | Nama
    |--------------------------------------------------------------------------
    */

    if (!form.nama.trim()) {
      return 'Nama kepala desa wajib diisi.';
    }

    /*
    |--------------------------------------------------------------------------
    | Jabatan
    |--------------------------------------------------------------------------
    */

    if (!form.jabatan.trim()) {
      return 'Jabatan wajib diisi.';
    }

    /*
    |--------------------------------------------------------------------------
    | Teks Sambutan
    |--------------------------------------------------------------------------
    */

    if (!form.text.trim()) {
      return 'Teks sambutan wajib diisi.';
    }

    /*
    |--------------------------------------------------------------------------
    | Foto Saat Tambah
    |--------------------------------------------------------------------------
    */

    if (!sambutan && !form.foto) {
      return 'Foto kepala desa wajib diupload.';
    }

    return null;
  };

  /*
  |--------------------------------------------------------------------------
  | Simpan Sambutan
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
    |--------------------------------------------------------------------------
    | Validasi
    |--------------------------------------------------------------------------
    */

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    setSaving(true);
    setError('');
    setSuccess('');

    /*
    |--------------------------------------------------------------------------
    | Multipart Form Data
    |--------------------------------------------------------------------------
    */

    const formData = new FormData();

    formData.append(
      'nama',
      form.nama.trim()
    );

    formData.append(
      'jabatan',
      form.jabatan.trim()
    );

    formData.append(
      'text',
      form.text.trim()
    );

    /*
    |--------------------------------------------------------------------------
    | Tambahkan Foto Jika Ada
    |--------------------------------------------------------------------------
    */

    if (form.foto) {
      formData.append(
        'foto',
        form.foto
      );
    }

    try {
      let response;

      /*
      |--------------------------------------------------------------------------
      | Tambah Sambutan
      |--------------------------------------------------------------------------
      */

      if (!sambutan) {
        response = await api.post(
          '/admin/sambutan',
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );
      } else {
        /*
        |--------------------------------------------------------------------------
        | Update Sambutan
        |--------------------------------------------------------------------------
        |
        | Laravel menerima multipart melalui POST + _method=PATCH.
        |
        */

        formData.append(
          '_method',
          'PATCH'
        );

        response = await api.post(
          `/admin/sambutan/${sambutan.id}`,
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Ambil Data Response
      |--------------------------------------------------------------------------
      */

      const data =
        response.data?.sambutan ||
        response.data?.data ||
        null;

      if (data) {
        setSambutan(data);

        setForm({
          nama: data.nama || '',
          jabatan: data.jabatan || '',
          text: data.text || '',
          foto: null,
        });

        /*
        |--------------------------------------------------------------------------
        | Muat Foto dari Private Storage
        |--------------------------------------------------------------------------
        */

        await loadFotoPreview(data.id);
      }

      /*
      |--------------------------------------------------------------------------
      | Tutup Form
      |--------------------------------------------------------------------------
      */

      setIsEditing(false);

      /*
      |--------------------------------------------------------------------------
      | Pesan Berhasil
      |--------------------------------------------------------------------------
      */

      setSuccess(
        response.data?.message ||
          (
            sambutan
              ? 'Sambutan berhasil diperbarui.'
              : 'Sambutan berhasil ditambahkan.'
          )
      );

      /*
      |--------------------------------------------------------------------------
      | Reset File Input
      |--------------------------------------------------------------------------
      */

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      /*
      |--------------------------------------------------------------------------
      | Error Validasi Laravel
      |--------------------------------------------------------------------------
      */

      const validationErrors =
        err.response?.data?.errors;

      if (validationErrors) {
        const firstError =
          Object.values(
            validationErrors
          )
            .flat()
            .find(Boolean);

        setError(
          firstError ||
            err.response?.data?.message ||
            'Gagal menyimpan sambutan.'
        );
      } else {
        setError(
          err.response?.data?.message ||
            'Gagal menyimpan sambutan.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Hapus Sambutan
  |--------------------------------------------------------------------------
  */

  const handleDelete = async () => {
    if (!sambutan) {
      return;
    }

    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus sambutan kepala desa?'
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.delete(
        `/admin/sambutan/${sambutan.id}`
      );

      /*
      |--------------------------------------------------------------------------
      | Reset Data
      |--------------------------------------------------------------------------
      */

      setSambutan(null);
      setIsEditing(false);

      resetForm();

      revokeFotoObjectUrl();
      setFotoPreview(null);

      /*
      |--------------------------------------------------------------------------
      | Pesan Berhasil
      |--------------------------------------------------------------------------
      */

      setSuccess(
        response.data?.message ||
          'Sambutan berhasil dihapus.'
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Gagal menghapus sambutan.'
      );
    } finally {
      setDeleting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Batal Edit
  |--------------------------------------------------------------------------
  */

  const handleCancel = async () => {
    setIsEditing(false);
    setError('');
    setSuccess('');

    /*
    |--------------------------------------------------------------------------
    | Reset Form
    |--------------------------------------------------------------------------
    */

    if (sambutan) {
      setForm({
        nama: sambutan.nama || '',
        jabatan: sambutan.jabatan || '',
        text: sambutan.text || '',
        foto: null,
      });

      await loadFotoPreview(
        sambutan.id
      );
    } else {
      resetForm();

      revokeFotoObjectUrl();
      setFotoPreview(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="h-8 w-72 rounded-lg bg-surface-container animate-pulse" />

            <div className="h-5 w-96 max-w-full rounded-lg bg-surface-container mt-2 animate-pulse" />
          </div>

          <div className="h-11 w-44 rounded-xl bg-surface-container animate-pulse" />
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 h-72 rounded-xl bg-surface-container animate-pulse" />

            <div className="flex-1 space-y-4">
              <div className="h-7 w-64 rounded bg-surface-container animate-pulse" />

              <div className="h-5 w-full rounded bg-surface-container animate-pulse" />

              <div className="h-5 w-5/6 rounded bg-surface-container animate-pulse" />

              <div className="h-5 w-4/6 rounded bg-surface-container animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="w-full">
      {/*
      |--------------------------------------------------------------------------
      | Header
      |--------------------------------------------------------------------------
      */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">
            Sambutan Kepala Desa
          </h1>

          <p className="font-body-md text-on-surface-variant mt-1">
            Kelola sambutan kepala desa (maksimal 1).
          </p>
        </div>

        {/*
        |--------------------------------------------------------------------------
        | Tombol Header
        |--------------------------------------------------------------------------
        */}

        {!sambutan && !isEditing ? (
          <button
            type="button"
            onClick={handleAdd}
            disabled={saving || deleting}
            className="px-4 py-2 bg-primary text-white rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">
              add
            </span>

            Tambah Sambutan
          </button>
        ) : sambutan && !isEditing ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleEdit}
              disabled={saving || deleting}
              className="px-4 py-2 bg-primary text-white rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">
                edit
              </span>

              Edit
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || deleting}
              className="px-4 py-2 bg-error text-white rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span
                className={
                  deleting
                    ? 'material-symbols-outlined animate-spin'
                    : 'material-symbols-outlined'
                }
              >
                {deleting
                  ? 'progress_activity'
                  : 'delete'}
              </span>

              {deleting
                ? 'Menghapus...'
                : 'Hapus'}
            </button>
          </div>
        ) : null}
      </div>

      {/*
      |--------------------------------------------------------------------------
      | Error Message
      |--------------------------------------------------------------------------
      */}

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
          {error}
        </motion.div>
      )}

      {/*
      |--------------------------------------------------------------------------
      | Success Message
      |--------------------------------------------------------------------------
      */}

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
          {success}
        </motion.div>
      )}

      {/*
      |--------------------------------------------------------------------------
      | Form Sambutan
      |--------------------------------------------------------------------------
      */}

      {isEditing && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 mb-6"
        >
          <h2 className="font-headline-md text-on-surface mb-4">
            {sambutan
              ? 'Edit Sambutan'
              : 'Form Sambutan'}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/*
            |--------------------------------------------------------------------------
            | Foto Kepala Desa
            |--------------------------------------------------------------------------
            */}

            <div>
              <label className="block font-label-md mb-2">
                Foto Kepala Desa
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                disabled={saving}
              />

              <button
                type="button"
                onClick={handleChooseFile}
                disabled={saving}
                className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">
                  upload
                </span>

                {sambutan
                  ? 'Ganti Foto'
                  : 'Pilih Foto'}
              </button>

              {fotoPreview && (
                <div className="mt-4">
                  <p className="font-label-md text-on-surface-variant mb-2">
                    Preview Foto
                  </p>

                  <img
                    src={fotoPreview}
                    alt="Preview kepala desa"
                    className="h-48 max-w-full object-contain rounded-xl border border-outline-variant/30 bg-surface"
                  />
                </div>
              )}
            </div>

            {/*
            |--------------------------------------------------------------------------
            | Nama Kepala Desa
            |--------------------------------------------------------------------------
            */}

            <div>
              <label className="block font-label-md mb-1">
                Nama Kepala Desa
              </label>

              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none"
                disabled={saving}
                required
              />
            </div>

            {/*
            |--------------------------------------------------------------------------
            | Jabatan
            |--------------------------------------------------------------------------
            */}

            <div>
              <label className="block font-label-md mb-1">
                Jabatan
              </label>

              <input
                type="text"
                name="jabatan"
                value={form.jabatan}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none"
                disabled={saving}
                required
              />
            </div>

            {/*
            |--------------------------------------------------------------------------
            | Teks Sambutan
            |--------------------------------------------------------------------------
            */}

            <div>
              <label className="block font-label-md mb-1">
                Teks Sambutan
              </label>

              <textarea
                name="text"
                rows="6"
                value={form.text}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none resize-none"
                disabled={saving}
                required
              />
            </div>

            {/*
            |--------------------------------------------------------------------------
            | Tombol Form
            |--------------------------------------------------------------------------
            */}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-white rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
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

                    Simpan
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 border border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/*
      |--------------------------------------------------------------------------
      | Preview Sambutan
      |--------------------------------------------------------------------------
      */}

      {sambutan && !isEditing && (
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/*
            |--------------------------------------------------------------------------
            | Foto
            |--------------------------------------------------------------------------
            */}

            <div className="md:w-1/3">
              {fotoPreview ? (
                <img
                  src={fotoPreview}
                  alt={`Kepala Desa ${sambutan.nama}`}
                  className="w-full h-auto max-h-105 object-contain rounded-xl shadow-sm bg-surface"
                />
              ) : (
                <div className="w-full h-72 rounded-xl bg-surface-container flex flex-col items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl">
                    image
                  </span>

                  <span className="font-body-md mt-2">
                    Foto tidak tersedia
                  </span>
                </div>
              )}
            </div>

            {/*
            |--------------------------------------------------------------------------
            | Informasi Sambutan
            |--------------------------------------------------------------------------
            */}

            <div className="md:w-2/3">
              <h3 className="font-headline-md text-primary mb-2">
                Sambutan Kepala Desa
              </h3>

              <p className="font-body-md text-on-surface-variant italic leading-relaxed whitespace-pre-line">
                {sambutan.text}
              </p>

              <div className="mt-4">
                <p className="font-headline-md text-on-surface">
                  {sambutan.nama}
                </p>

                <p className="font-label-md text-primary">
                  {sambutan.jabatan}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/*
      |--------------------------------------------------------------------------
      | Tidak Ada Sambutan
      |--------------------------------------------------------------------------
      */}

      {!sambutan && !isEditing && (
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-10 text-center"
        >
          <span className="material-symbols-outlined text-5xl text-on-surface-variant">
            campaign
          </span>

          <h3 className="font-headline-md text-on-surface mt-4">
            Belum Ada Sambutan
          </h3>

          <p className="font-body-md text-on-surface-variant mt-2">
            Tambahkan sambutan kepala desa untuk
            ditampilkan di halaman publik.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AdminSambutan;
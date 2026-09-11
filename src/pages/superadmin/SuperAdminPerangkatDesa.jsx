// src/pages/superadmin/SuperAdminPerangkatDesa.jsx
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { motion } from 'framer-motion';

import api, { BACKEND_URL } from '../../api/axios';

// ============================================================================
// CONSTANT
// ============================================================================

const MAX_FILE_SIZE = 5 * 1024 * 1024;

// ============================================================================
// EMPTY FORM
// ============================================================================

const EMPTY_FORM = {
  nama: '',
  jabatan: '',
  foto: null,
  urutan: 0,
  is_active: true,
};

// ============================================================================
// HELPER: URL FOTO PUBLIK
// ============================================================================

const getFotoUrl = (item) => {
  if (!item?.id || !item?.foto) return null;
  return `${BACKEND_URL}/api/files/public/perangkat-desa/${item.id}`;
};

// ============================================================================
// COMPONENT
// ============================================================================

const SuperAdminPerangkatDesa = () => {
  // ==========================================================================
  // STATE DATA
  // ==========================================================================

  const [perangkatList, setPerangkatList] = useState([]);

  // ==========================================================================
  // STATE FORM
  // ==========================================================================

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [fotoPreview, setFotoPreview] = useState('');

  // ==========================================================================
  // STATE LOADING
  // ==========================================================================

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // ==========================================================================
  // STATE MESSAGE
  // ==========================================================================

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // ==========================================================================
  // REFS
  // ==========================================================================

  const fileInputRef = useRef(null);
  const localPreviewRef = useRef('');

  // ==========================================================================
  // REVOKE LOCAL PREVIEW
  // ==========================================================================

  const revokeLocalPreview = useCallback(() => {
    if (localPreviewRef.current) {
      URL.revokeObjectURL(localPreviewRef.current);
      localPreviewRef.current = '';
    }
  }, []);

  // ==========================================================================
  // CLEANUP
  // ==========================================================================

  useEffect(() => {
    return () => {
      revokeLocalPreview();
    };
  }, [revokeLocalPreview]);

  // ==========================================================================
  // FETCH DATA
  // ==========================================================================

  const fetchPerangkat = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/admin/perangkat-desa');
      const responseData = response.data?.data;
      const items = Array.isArray(responseData) ? responseData : [];

      // Urutkan berdasarkan urutan
      items.sort(
        (a, b) => Number(a?.urutan ?? 0) - Number(b?.urutan ?? 0)
      );

      setPerangkatList(items);
    } catch (err) {
      console.error('Gagal mengambil perangkat desa:', err);
      setPerangkatList([]);
      setError(
        err.response?.data?.message ||
          'Gagal mengambil daftar perangkat desa.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================================
  // LOAD AWAL
  // ==========================================================================

  useEffect(() => {
    fetchPerangkat();
  }, [fetchPerangkat]);

  // ==========================================================================
  // OPEN ADD
  // ==========================================================================

  const handleAdd = () => {
    revokeLocalPreview();
    setError('');
    setSuccess('');
    setValidationErrors({});
    setIsEditing(true);
    setCurrentId(null);
    setForm({ ...EMPTY_FORM });
    setFotoPreview('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ==========================================================================
  // OPEN EDIT
  // ==========================================================================

  const handleEdit = (item) => {
    if (!item?.id) return;

    revokeLocalPreview();
    setError('');
    setSuccess('');
    setValidationErrors({});
    setIsEditing(true);
    setCurrentId(item.id);

    setForm({
      nama: item.nama || '',
      jabatan: item.jabatan || '',
      foto: null,
      urutan: item.urutan ?? 0,
      is_active: item.is_active ?? true,
    });

    setFotoPreview(getFotoUrl(item) || '');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ==========================================================================
  // CLOSE FORM
  // ==========================================================================

  const handleCancel = () => {
    revokeLocalPreview();
    setIsEditing(false);
    setCurrentId(null);
    setForm({ ...EMPTY_FORM });
    setFotoPreview('');
    setValidationErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ==========================================================================
  // FORM CHANGE
  // ==========================================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setValidationErrors((previous) => {
      const next = { ...previous };
      delete next[name];
      return next;
    });

    setError('');
    setSuccess('');
  };

  // ==========================================================================
  // FILE CHANGE
  // ==========================================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setValidationErrors((previous) => ({
        ...previous,
        foto: 'Foto harus berupa JPG, JPEG, PNG, atau WEBP.',
      }));
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setValidationErrors((previous) => ({
        ...previous,
        foto: 'Ukuran foto maksimal 5 MB.',
      }));
      event.target.value = '';
      return;
    }

    revokeLocalPreview();

    const previewUrl = URL.createObjectURL(file);
    localPreviewRef.current = previewUrl;

    setForm((previous) => ({ ...previous, foto: file }));
    setFotoPreview(previewUrl);

    setValidationErrors((previous) => {
      const next = { ...previous };
      delete next.foto;
      return next;
    });
  };

  // ==========================================================================
  // VALIDATE FORM
  // ==========================================================================

  const validateForm = () => {
    const errors = {};

    if (!form.nama?.trim()) {
      errors.nama = 'Nama perangkat desa wajib diisi.';
    }

    if (!form.jabatan?.trim()) {
      errors.jabatan = 'Jabatan wajib diisi.';
    }

    if (!currentId && !form.foto) {
      errors.foto = 'Foto perangkat desa wajib diunggah.';
    }

    if (
      form.urutan === '' ||
      form.urutan === null ||
      Number(form.urutan) < 0
    ) {
      errors.urutan = 'Urutan tidak valid.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==========================================================================
  // SUBMIT
  // ==========================================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append('nama', form.nama.trim());
      formData.append('jabatan', form.jabatan.trim());
      formData.append('urutan', String(Number(form.urutan)));
      formData.append('is_active', form.is_active ? '1' : '0');

      if (form.foto instanceof File) {
        formData.append('foto', form.foto);
      }

      let response;

      if (!currentId) {
        response = await api.post('/admin/perangkat-desa', formData);
      } else {
        response = await api.post(
          `/admin/perangkat-desa/${currentId}`,
          formData
        );
      }

      setSuccess(
        response.data?.message ||
          (currentId
            ? 'Perangkat desa berhasil diperbarui.'
            : 'Perangkat desa berhasil ditambahkan.')
      );

      revokeLocalPreview();
      setIsEditing(false);
      setCurrentId(null);
      setForm({ ...EMPTY_FORM });
      setFotoPreview('');
      setValidationErrors({});

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      await fetchPerangkat();
    } catch (err) {
      console.error('Gagal menyimpan perangkat desa:', err);

      const responseData = err.response?.data;
      setError(
        responseData?.message || 'Perangkat desa gagal disimpan.'
      );

      if (responseData?.errors) {
        setValidationErrors(responseData.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================================
  // DELETE
  // ==========================================================================

  const handleDelete = async (item) => {
    if (!item?.id || deletingId) return;

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus perangkat desa "${item.nama}"?`
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');
    setDeletingId(item.id);

    try {
      const response = await api.delete(
        `/admin/perangkat-desa/${item.id}`
      );

      setSuccess(
        response.data?.message || 'Perangkat desa berhasil dihapus.'
      );

      if (currentId === item.id) {
        handleCancel();
      }

      await fetchPerangkat();
    } catch (err) {
      console.error('Gagal menghapus perangkat desa:', err);
      setError(
        err.response?.data?.message ||
          'Perangkat desa gagal dihapus.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================================================
  // TOGGLE ACTIVE
  // ==========================================================================

  const handleToggleActive = async (item) => {
    if (!item?.id || togglingId) return;

    setError('');
    setSuccess('');
    setTogglingId(item.id);

    try {
      const response = await api.patch(
        `/admin/perangkat-desa/${item.id}/active`
      );

      setSuccess(
        response.data?.message ||
          'Status perangkat desa berhasil diperbarui.'
      );

      await fetchPerangkat();
    } catch (err) {
      console.error('Gagal mengubah status perangkat desa:', err);
      setError(
        err.response?.data?.message ||
          'Status perangkat desa gagal diperbarui.'
      );
    } finally {
      setTogglingId(null);
    }
  };

  // ==========================================================================
  // FIELD ERROR
  // ==========================================================================

  const getFieldError = (field) => {
    const value = validationErrors?.[field];
    if (Array.isArray(value)) return value[0] || '';
    return value || '';
  };

  // ==========================================================================
  // INPUT CLASS
  // ==========================================================================

  const getInputClass = (field) => {
    const hasError = Boolean(getFieldError(field));

    return [
      'w-full',
      'h-12',
      'px-4',
      'rounded-xl',
      'bg-surface',
      'border',
      'outline-none',
      'transition-colors',
      hasError
        ? 'border-red-400 focus:border-red-500'
        : 'border-outline-variant/40 focus:border-primary',
    ].join(' ');
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-label-sm text-primary">
            Super Admin
          </div>
          <h1 className="font-headline-lg text-on-background">
            Perangkat Desa
          </h1>
          <p className="mt-1 font-body-md text-on-surface-variant">
            Kelola daftar perangkat Desa Sumberporong.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleAdd}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-container hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">
              add
            </span>
            Tambah Perangkat
          </button>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined shrink-0">
              error
            </span>
            <span className="wrap-break-word">{error}</span>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined shrink-0">
              check_circle
            </span>
            <span className="wrap-break-word">{success}</span>
          </div>
        </div>
      )}

      {/* FORM */}
      {isEditing && (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-headline-md text-xl text-on-surface">
                {currentId ? 'Edit Perangkat Desa' : 'Tambah Perangkat Desa'}
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                {currentId
                  ? 'Foto lama tetap digunakan apabila Anda tidak memilih foto baru.'
                  : 'Lengkapi identitas perangkat desa dan foto.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              aria-label="Tutup form"
              title="Tutup"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface text-on-surface-variant transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* FOTO */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-on-surface">
                Foto
                <span className="ml-2 font-normal text-on-surface-variant">
                  {currentId ? '(Opsional saat edit)' : '(Wajib)'}
                </span>
              </label>

              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-low">
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="Preview foto perangkat desa"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
                      person
                    </span>
                  )}
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={submitting}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/40 bg-surface px-4 py-3 text-sm font-semibold text-on-surface transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      upload
                    </span>
                    Pilih Foto
                  </button>

                  <p className="mt-3 text-xs text-on-surface-variant">
                    JPG, JPEG, PNG, atau WEBP. Maksimal 5 MB.
                  </p>
                </div>
              </div>

              {getFieldError('foto') && (
                <p className="mt-2 text-xs text-red-600">
                  {getFieldError('foto')}
                </p>
              )}
            </div>

            {/* NAMA */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-on-surface">
                Nama
              </label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                maxLength={150}
                disabled={submitting}
                placeholder="Contoh: Budi Santoso"
                className={getInputClass('nama')}
              />
              {getFieldError('nama') && (
                <p className="mt-1.5 text-xs text-red-600">
                  {getFieldError('nama')}
                </p>
              )}
            </div>

            {/* JABATAN */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-on-surface">
                Jabatan
              </label>
              <input
                type="text"
                name="jabatan"
                value={form.jabatan}
                onChange={handleChange}
                maxLength={150}
                disabled={submitting}
                placeholder="Contoh: Kepala Desa"
                className={getInputClass('jabatan')}
              />
              {getFieldError('jabatan') && (
                <p className="mt-1.5 text-xs text-red-600">
                  {getFieldError('jabatan')}
                </p>
              )}
            </div>

            {/* URUTAN */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-on-surface">
                Urutan Tampilan
              </label>
              <input
                type="number"
                name="urutan"
                value={form.urutan}
                onChange={handleChange}
                min="0"
                disabled={submitting}
                className={getInputClass('urutan')}
              />
              <p className="mt-1.5 text-xs text-on-surface-variant">
                Angka lebih kecil akan tampil lebih dahulu.
              </p>
              {getFieldError('urutan') && (
                <p className="mt-1.5 text-xs text-red-600">
                  {getFieldError('urutan')}
                </p>
              )}
            </div>

            {/* STATUS */}
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={Boolean(form.is_active)}
                  onChange={handleChange}
                  disabled={submitting}
                  className="h-5 w-5 accent-primary"
                />
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Tampilkan ke publik
                  </p>
                  <p className="mt-0.5 text-xs text-on-surface-variant">
                    Perangkat aktif akan tampil di halaman publik.
                  </p>
                </div>
              </label>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/20 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/40 bg-surface px-5 py-3 text-sm font-semibold text-on-surface-variant transition-all duration-200 hover:bg-surface-container-low hover:text-on-surface active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-outline-variant/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
                Batal
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-container hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">
                      progress_activity
                    </span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">
                      save
                    </span>
                    {currentId ? 'Simpan Perubahan' : 'Tambah Perangkat'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.section>
      )}

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190">
            <thead className="border-b border-outline-variant/20 bg-surface-container-low">
              <tr>
                <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant">
                  Foto
                </th>
                <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant">
                  Nama
                </th>
                <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant">
                  Jabatan
                </th>
                <th className="px-6 py-4 text-center font-label-sm text-on-surface-variant">
                  Status
                </th>
                <th className="px-6 py-4 text-center font-label-sm text-on-surface-variant">
                  Urutan
                </th>
                <th className="px-6 py-4 text-right font-label-sm text-on-surface-variant">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-outline-variant/10">
                    <td colSpan="6" className="px-6 py-5">
                      <div className="h-14 animate-pulse rounded-xl bg-surface-container-low" />
                    </td>
                  </tr>
                ))
              ) : perangkatList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-3xl">
                          groups
                        </span>
                      </div>
                      <h3 className="mt-4 font-headline-md text-lg text-on-surface">
                        Belum ada perangkat desa
                      </h3>
                      <p className="mt-2 text-sm text-on-surface-variant">
                        Tambahkan perangkat desa melalui tombol di atas.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                perangkatList.map((item) => {
                  const fotoUrl = getFotoUrl(item);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-outline-variant/10 transition-colors hover:bg-primary/5"
                    >
                      {/* FOTO */}
                      <td className="px-6 py-4">
                        <div className="h-12 w-12 overflow-hidden rounded-full border border-outline-variant/20 bg-surface-container-low">
                          {fotoUrl ? (
                            <img
                              src={fotoUrl}
                              alt={item.nama}
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="material-symbols-outlined text-on-surface-variant/40">
                                person
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* NAMA */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-on-surface">
                          {item.nama}
                        </p>
                      </td>

                      {/* JABATAN */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-on-surface-variant">
                          {item.jabatan}
                        </p>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          disabled={Boolean(togglingId) || Boolean(deletingId)}
                          title={
                            item.is_active
                              ? 'Klik untuk menonaktifkan'
                              : 'Klik untuk mengaktifkan'
                          }
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 active:scale-[0.97] focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                            item.is_active
                              ? 'border border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100 focus:ring-green-200'
                              : 'border border-gray-200 bg-gray-50 text-gray-600 hover:border-green-200 hover:bg-green-50 hover:text-green-700 focus:ring-green-200'
                          }`}
                        >
                          {togglingId === item.id ? (
                            <span className="material-symbols-outlined animate-spin text-[16px]">
                              progress_activity
                            </span>
                          ) : (
                            <span
                              className={`h-2 w-2 rounded-full ${
                                item.is_active ? 'bg-green-500' : 'bg-gray-400'
                              }`}
                            />
                          )}
                          {item.is_active ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>

                      {/* URUTAN */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-surface-container-low px-2 text-sm font-semibold text-on-surface">
                          {item.urutan ?? 0}
                        </span>
                      </td>

                      {/* AKSI */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            disabled={
                              Boolean(deletingId) || Boolean(togglingId)
                            }
                            title={`Edit ${item.nama}`}
                            aria-label={`Edit ${item.nama}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant/30 bg-surface text-primary transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={
                              deletingId === item.id || Boolean(togglingId)
                            }
                            title={`Hapus ${item.nama}`}
                            aria-label={`Hapus ${item.nama}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === item.id ? (
                              <span className="material-symbols-outlined animate-spin text-[18px]">
                                progress_activity
                              </span>
                            ) : (
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPerangkatDesa;
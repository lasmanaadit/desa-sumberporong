import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { motion } from 'framer-motion';

import api from '../../api/axios';


// ============================================================================
// COMPONENT
// ============================================================================

const SuperAdminHero = () => {

  // ==========================================================================
  // STATE DATA
  // ==========================================================================

  const [
    heroList,
    setHeroList,
  ] = useState([]);

  const [
    beritaList,
    setBeritaList,
  ] = useState([]);


  // ==========================================================================
  // STATE FORM
  // ==========================================================================

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    currentId,
    setCurrentId,
  ] = useState(null);

  const [
    title,
    setTitle,
  ] = useState('');

  const [
    subtitle,
    setSubtitle,
  ] = useState('');

  const [
    beritaId,
    setBeritaId,
  ] = useState('');

  const [
    urutan,
    setUrutan,
  ] = useState('');

  const [
    isActive,
    setIsActive,
  ] = useState(true);


  // ==========================================================================
  // STATE IMAGE
  // ==========================================================================

  const [
    imagePreview,
    setImagePreview,
  ] = useState(null);

  const [
    file,
    setFile,
  ] = useState(null);


  // ==========================================================================
  // STATE LOADING
  // ==========================================================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadingBerita,
    setLoadingBerita,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);


  // ==========================================================================
  // STATE MESSAGE
  // ==========================================================================

  const [
    error,
    setError,
  ] = useState('');

  const [
    success,
    setSuccess,
  ] = useState('');


  // ==========================================================================
  // FETCH HERO
  // ==========================================================================

  const fetchHero = async () => {

    try {

      setLoading(true);

      setError('');


      const response =
        await api.get(
          '/admin/hero'
        );


      const responseData =
        response.data?.data;


      let data = [];


      // ------------------------------------------------------------------------
      // Support:
      // 1. data langsung array
      // 2. Laravel pagination
      // ------------------------------------------------------------------------

      if (
        Array.isArray(
          responseData
        )
      ) {

        data =
          responseData;

      } else {

        data =
          Array.isArray(
            responseData?.data
          )
            ? responseData.data
            : [];

      }


      // ------------------------------------------------------------------------
      // Urutkan berdasarkan urutan
      // ------------------------------------------------------------------------

      data.sort(
        (a, b) =>
          Number(
            a?.urutan ?? 0
          ) -
          Number(
            b?.urutan ?? 0
          )
      );


      setHeroList(
        data
      );

    } catch (
      err
    ) {

      console.error(
        'Gagal mengambil data hero:',
        err
      );


      setError(
        err.response?.data
          ?.message ||
        err.message ||
        'Gagal mengambil data hero.'
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================================================
  // FETCH BERITA
  // ==========================================================================

  const fetchBerita = async () => {

    try {

      setLoadingBerita(
        true
      );


      const response =
        await api.get(
          '/admin/berita'
        );


      const responseData =
        response.data?.data;


      let data = [];


      // ------------------------------------------------------------------------
      // Support:
      // 1. data langsung array
      // 2. Laravel pagination
      // ------------------------------------------------------------------------

      if (
        Array.isArray(
          responseData
        )
      ) {

        data =
          responseData;

      } else {

        data =
          Array.isArray(
            responseData?.data
          )
            ? responseData.data
            : [];

      }


      // ------------------------------------------------------------------------
      // Hanya berita published
      // ------------------------------------------------------------------------

      const published =
        data.filter(
          (berita) =>
            berita?.status ===
            'published'
        );


      setBeritaList(
        published
      );

    } catch (
      err
    ) {

      console.error(
        'Gagal mengambil data berita:',
        err
      );


      setError(
        err.response?.data
          ?.message ||
        err.message ||
        'Gagal mengambil daftar berita.'
      );

    } finally {

      setLoadingBerita(
        false
      );

    }

  };


  // ==========================================================================
  // INITIAL FETCH
  // ==========================================================================

  useEffect(() => {

    fetchHero();

    fetchBerita();

  }, []);


  // ==========================================================================
  // BERITA YANG BELUM DIPAKAI HERO LAIN
  // ==========================================================================

  const availableBerita =
    useMemo(() => {

      return beritaList.filter(
        (berita) => {

          const usedByAnotherHero =
            heroList.some(
              (hero) =>
                Number(
                  hero?.berita_id
                ) ===
                  Number(
                    berita?.id
                  ) &&
                Number(
                  hero?.id
                ) !==
                  Number(
                    currentId
                  )
            );


          return !usedByAnotherHero;

        }
      );

    }, [
      beritaList,
      heroList,
      currentId,
    ]);


  // ==========================================================================
  // RESET FORM
  // ==========================================================================

  const resetForm = () => {

    setIsEditing(false);

    setCurrentId(null);

    setTitle('');

    setSubtitle('');

    setBeritaId('');

    setUrutan('');

    setIsActive(true);


    // ------------------------------------------------------------------------
    // Hapus object URL preview
    // ------------------------------------------------------------------------

    if (
      imagePreview &&
      imagePreview.startsWith(
        'blob:'
      )
    ) {

      URL.revokeObjectURL(
        imagePreview
      );

    }


    setImagePreview(null);

    setFile(null);

    setError('');

  };


  // ==========================================================================
  // TAMBAH HERO
  // ==========================================================================

  const handleAdd = () => {

    setIsEditing(true);

    setCurrentId(null);

    setTitle('');

    setSubtitle('');

    setBeritaId('');


    // ------------------------------------------------------------------------
    // Cari urutan berikutnya
    // ------------------------------------------------------------------------

    const nextOrder =
      heroList.length > 0
        ? Math.max(
            ...heroList.map(
              (hero) =>
                Number(
                  hero?.urutan
                ) || 0
            )
          ) + 1
        : 1;


    setUrutan(
      String(
        nextOrder
      )
    );


    setIsActive(true);

    setImagePreview(null);

    setFile(null);

    setError('');

    setSuccess('');


    // ------------------------------------------------------------------------
    // Scroll ke atas
    // ------------------------------------------------------------------------

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  };


  // ==========================================================================
  // EDIT HERO
  // ==========================================================================

  const handleEdit = async (
    item
  ) => {

    setIsEditing(true);

    setCurrentId(
      item.id
    );


    setTitle(
      item?.title ?? ''
    );


    setSubtitle(
      item?.subtitle ?? ''
    );


    setBeritaId(
      item?.berita_id
        ? String(
            item.berita_id
          )
        : ''
    );


    setUrutan(
      item?.urutan !==
        undefined &&
      item?.urutan !==
        null
        ? String(
            item.urutan
          )
        : ''
    );


    // ------------------------------------------------------------------------
    // Welcome selalu aktif
    // ------------------------------------------------------------------------

    setIsActive(
      Number(
        item?.urutan
      ) === 1
        ? true
        : Boolean(
            item?.is_active
          )
    );


    // ------------------------------------------------------------------------
    // Welcome tidak boleh memiliki berita
    // ------------------------------------------------------------------------

    if (
      Number(
        item?.urutan
      ) === 1
    ) {

      setBeritaId('');

    }


    setFile(null);


    // ------------------------------------------------------------------------
    // Hapus preview lama
    // ------------------------------------------------------------------------

    if (
      imagePreview &&
      imagePreview.startsWith(
        'blob:'
      )
    ) {

      URL.revokeObjectURL(
        imagePreview
      );

    }


    setImagePreview(null);

    setError('');

    setSuccess('');


    // ------------------------------------------------------------------------
    // Ambil gambar private
    // ------------------------------------------------------------------------

    try {

      const response =
        await api.get(
          `/admin/files/hero/${item.id}`,
          {
            responseType:
              'blob',
          }
        );


      const blobUrl =
        URL.createObjectURL(
          response.data
        );


      setImagePreview(
        blobUrl
      );

    } catch (
      err
    ) {

      console.error(
        'Gagal mengambil gambar hero:',
        err
      );


      setImagePreview(null);

    }


    // ------------------------------------------------------------------------
    // Scroll ke atas
    // ------------------------------------------------------------------------

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  };


  // ==========================================================================
  // DELETE HERO
  // ==========================================================================

  const handleDelete = async (
    id
  ) => {

    // ------------------------------------------------------------------------
    // Cari data hero
    // ------------------------------------------------------------------------

    const hero =
      heroList.find(
        (item) =>
          Number(
            item?.id
          ) ===
          Number(
            id
          )
      );


    // ------------------------------------------------------------------------
    // Proteksi Welcome
    // ------------------------------------------------------------------------

    if (
      Number(
        hero?.urutan
      ) === 1
    ) {

      setError(
        'Slide Welcome tidak boleh dihapus.'
      );

      return;

    }


    const confirmed =
      window.confirm(
        'Hapus hero ini? Gambar hero yang tersimpan juga akan dihapus.'
      );


    if (!confirmed) {

      return;

    }


    try {

      setDeletingId(
        id
      );

      setError('');

      setSuccess('');


      await api.delete(
        `/admin/hero/${id}`
      );


      setSuccess(
        'Hero berhasil dihapus.'
      );


      // ----------------------------------------------------------------------
      // Jika hero sedang diedit dihapus
      // ----------------------------------------------------------------------

      if (
        Number(
          currentId
        ) ===
        Number(
          id
        )
      ) {

        resetForm();

      }


      await fetchHero();

      await fetchBerita();

    } catch (
      err
    ) {

      console.error(
        'Gagal menghapus hero:',
        err
      );


      setError(
        err.response?.data
          ?.message ||
        err.message ||
        'Gagal menghapus hero.'
      );

    } finally {

      setDeletingId(
        null
      );

    }

  };


  // ==========================================================================
  // HANDLE FILE
  // ==========================================================================

  const handleFileChange = (
    event
  ) => {

    const selectedFile =
      event.target.files?.[0];


    if (!selectedFile) {

      return;

    }


    setFile(
      selectedFile
    );


    // ------------------------------------------------------------------------
    // Hapus preview lama
    // ------------------------------------------------------------------------

    if (
      imagePreview &&
      imagePreview.startsWith(
        'blob:'
      )
    ) {

      URL.revokeObjectURL(
        imagePreview
      );

    }


    // ------------------------------------------------------------------------
    // Preview gambar baru
    // ------------------------------------------------------------------------

    const previewUrl =
      URL.createObjectURL(
        selectedFile
      );


    setImagePreview(
      previewUrl
    );

  };


  // ==========================================================================
  // SUBMIT
  // ==========================================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError('');

    setSuccess('');


    // ==========================================================================
    // VALIDASI JUDUL
    // ==========================================================================

    if (
      !title.trim()
    ) {

      setError(
        'Judul hero wajib diisi.'
      );

      return;

    }


    // ==========================================================================
    // VALIDASI URUTAN
    // ==========================================================================

    const orderNumber =
      Number(
        urutan
      );


    if (
      !Number.isInteger(
        orderNumber
      ) ||
      orderNumber < 1
    ) {

      setError(
        'Urutan harus berupa angka minimal 1.'
      );

      return;

    }


    // ==========================================================================
    // SLIDE 1 = WELCOME
    // ==========================================================================

    const isWelcome =
      orderNumber === 1;


    const selectedBeritaId =
      isWelcome
        ? ''
        : beritaId;


    // ==========================================================================
    // SLIDE 2+ = BERITA
    // ==========================================================================

    if (
      orderNumber >= 2 &&
      !selectedBeritaId
    ) {

      setError(
        'Slide 2 dan seterusnya wajib memilih berita.'
      );

      return;

    }


    // ==========================================================================
    // CREATE WAJIB ADA GAMBAR
    // ==========================================================================

    if (
      !currentId &&
      !file
    ) {

      setError(
        'Pilih gambar hero terlebih dahulu.'
      );

      return;

    }


    // ==========================================================================
    // FORM DATA
    // ==========================================================================

    const formData =
      new FormData();


    formData.append(
      'title',
      title.trim()
    );


    formData.append(
      'subtitle',
      subtitle.trim()
    );


    formData.append(
      'urutan',
      String(
        orderNumber
      )
    );


    // ------------------------------------------------------------------------
    // Welcome selalu aktif
    // ------------------------------------------------------------------------

    formData.append(
      'is_active',
      isWelcome
        ? '1'
        : isActive
          ? '1'
          : '0'
    );


    // ==========================================================================
    // BERITA
    // ==========================================================================

    if (
      selectedBeritaId
    ) {

      formData.append(
        'berita_id',
        String(
          selectedBeritaId
        )
      );

    } else {

      formData.append(
        'berita_id',
        ''
      );

    }


    // ==========================================================================
    // IMAGE
    // ==========================================================================

    if (file) {

      formData.append(
        'image',
        file
      );

    }


    // ==========================================================================
    // SAVE
    // ==========================================================================

    try {

      setSaving(true);


      // ------------------------------------------------------------------------
      // UPDATE
      // ------------------------------------------------------------------------

      if (currentId) {

        await api.post(
          `/admin/hero/${currentId}`,
          formData
        );


        setSuccess(
          'Hero berhasil diperbarui.'
        );

      }


      // ------------------------------------------------------------------------
      // CREATE
      // ------------------------------------------------------------------------

      else {

        await api.post(
          '/admin/hero',
          formData
        );


        setSuccess(
          'Hero berhasil ditambahkan.'
        );

      }


      // ------------------------------------------------------------------------
      // Reset form
      // ------------------------------------------------------------------------

      resetForm();


      // ------------------------------------------------------------------------
      // Refresh data
      // ------------------------------------------------------------------------

      await fetchHero();

      await fetchBerita();

    } catch (
      err
    ) {

      console.error(
        'Gagal menyimpan hero:',
        err
      );


      const validationErrors =
        err.response?.data
          ?.errors;


      if (
        validationErrors
      ) {

        const firstError =
          Object.values(
            validationErrors
          )?.[0]?.[0];


        setError(
          firstError ||
          'Data hero tidak valid.'
        );

      } else {

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          'Gagal menyimpan hero.'
        );

      }

    } finally {

      setSaving(false);

    }

  };


  // ==========================================================================
  // TOGGLE ACTIVE
  // ==========================================================================

  const handleToggleActive =
    async (
      item
    ) => {

      // ------------------------------------------------------------------------
      // Welcome tidak boleh dinonaktifkan
      // ------------------------------------------------------------------------

      if (
        Number(
          item?.urutan
        ) === 1
      ) {

        setError(
          'Slide Welcome harus tetap aktif.'
        );

        return;

      }


      const formData =
        new FormData();


      formData.append(
        'title',
        item.title
      );


      formData.append(
        'subtitle',
        item.subtitle ?? ''
      );


      formData.append(
        'urutan',
        String(
          item.urutan
        )
      );


      formData.append(
        'berita_id',
        item.berita_id
          ? String(
              item.berita_id
            )
          : ''
      );


      formData.append(
        'is_active',
        item.is_active
          ? '0'
          : '1'
      );


      try {

        setError('');

        setSuccess('');


        await api.post(
          `/admin/hero/${item.id}`,
          formData
        );


        setSuccess(
          item.is_active
            ? 'Hero berhasil dinonaktifkan.'
            : 'Hero berhasil diaktifkan.'
        );


        await fetchHero();

      } catch (
        err
      ) {

        console.error(
          'Gagal mengubah status hero:',
          err
        );


        setError(
          err.response?.data
            ?.message ||
          err.message ||
          'Gagal mengubah status hero.'
        );

      }

    };


  // ==========================================================================
  // CLEANUP OBJECT URL
  // ==========================================================================

  useEffect(() => {

    return () => {

      if (
        imagePreview &&
        imagePreview.startsWith(
          'blob:'
        )
      ) {

        URL.revokeObjectURL(
          imagePreview
        );

      }

    };

  }, [
    imagePreview,
  ]);


  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (

    <div>

      {/* ====================================================================
          HEADER
      ==================================================================== */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <div className="mb-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-label-sm text-primary">
            Super Admin
          </div>


          <h1 className="font-headline-lg text-on-background">
            Hero Slider
          </h1>


          <p className="mt-1 font-body-md text-on-surface-variant">
            Kelola hero halaman utama.
            Slide pertama untuk sambutan,
            slide berikutnya menampilkan berita desa.
          </p>

        </div>


        <button
          type="button"
          onClick={
            handleAdd
          }
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white transition hover:opacity-90"
        >

          <span className="material-symbols-outlined">
            add
          </span>


          Tambah Hero

        </button>

      </div>


      {/* ====================================================================
          SUCCESS MESSAGE
      ==================================================================== */}

      {success && (

        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-body-md text-primary">
          {success}
        </div>

      )}


      {/* ====================================================================
          ERROR MESSAGE
      ==================================================================== */}

      {error && (

        <div className="mb-6 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-body-md text-error">
          {error}
        </div>

      )}


      {/* ====================================================================
          FORM
      ==================================================================== */}

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
          className="mb-6 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6"
        >

          {/* ==================================================================
              FORM HEADER
          ================================================================== */}

          <div className="mb-5 flex items-start justify-between gap-4">

            <div>

              <h2 className="font-headline-md text-on-surface">

                {currentId
                  ? 'Edit Hero'
                  : 'Tambah Hero'}

              </h2>


              <p className="mt-1 font-body-sm text-on-surface-variant">
                Urutan 1 adalah Welcome.
                Urutan 2 dan seterusnya adalah Berita.
              </p>

            </div>


            <button
              type="button"
              onClick={
                resetForm
              }
              className="rounded-xl border border-outline-variant px-4 py-2 text-on-surface-variant transition hover:bg-surface-container-low"
            >
              Tutup
            </button>

          </div>


          {/* ==================================================================
              FORM
          ================================================================== */}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5"
          >

            {/* ================================================================
                IMAGE
            ================================================================ */}

            <div>

              <label
                htmlFor="superAdminHeroFileInput"
                className="mb-1 block font-label-md text-on-surface"
              >
                Upload Gambar
              </label>


              <input
                id="superAdminHeroFileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleFileChange
                }
                className="hidden"
              />


              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById(
                      'superAdminHeroFileInput'
                    )
                    ?.click()
                }
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white transition hover:opacity-90"
              >

                <span className="material-symbols-outlined">
                  upload
                </span>


                Pilih Gambar

              </button>


              <p className="mt-1 text-body-sm text-on-surface-variant">
                JPG, JPEG, PNG, atau WEBP.
                Maksimal 5 MB.
              </p>


              {/* ==============================================================
                  PREVIEW
              ============================================================== */}

              {imagePreview && (

                <div className="mt-4 overflow-hidden rounded-xl border border-outline-variant/20">

                  <div className="aspect-video w-full bg-surface-container">

                    <img
                      src={
                        imagePreview
                      }
                      alt="Preview Hero"
                      className="h-full w-full object-cover"
                    />

                  </div>

                </div>

              )}

            </div>


            {/* ================================================================
                TITLE
            ================================================================ */}

            <div>

              <label className="mb-1 block font-label-md text-on-surface">
                Judul
              </label>


              <input
                type="text"
                value={
                  title
                }
                onChange={(
                  event
                ) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Masukkan judul hero"
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface outline-none transition focus:border-primary"
              />

            </div>


            {/* ================================================================
                SUBTITLE
            ================================================================ */}

            <div>

              <label className="mb-1 block font-label-md text-on-surface">
                Subtitle
              </label>


              <textarea
                value={
                  subtitle
                }
                onChange={(
                  event
                ) =>
                  setSubtitle(
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Masukkan subtitle hero"
                className="w-full resize-none rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface outline-none transition focus:border-primary"
              />

            </div>


            {/* ================================================================
                URUTAN + BERITA
            ================================================================ */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* ==============================================================
                  URUTAN
              ============================================================== */}

              <div>

                <label className="mb-1 block font-label-md text-on-surface">
                  Urutan Slide
                </label>


                <input
                  type="number"
                  min="1"
                  value={
                    urutan
                  }
                  onChange={(
                    event
                  ) =>
                    setUrutan(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface outline-none transition focus:border-primary"
                />


                <p className="mt-1 text-body-sm text-on-surface-variant">
                  Urutan 1 = Welcome.
                  Urutan 2+ = Berita.
                </p>

              </div>


              {/* ==============================================================
                  BERITA
              ============================================================== */}

              <div>

                <label className="mb-1 block font-label-md text-on-surface">
                  Pilih Berita
                </label>


                <select
                  value={
                    Number(
                      urutan
                    ) === 1
                      ? ''
                      : beritaId
                  }
                  onChange={(
                    event
                  ) =>
                    setBeritaId(
                      event.target.value
                    )
                  }
                  disabled={
                    Number(
                      urutan
                    ) === 1
                  }
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <option value="">

                    {Number(
                      urutan
                    ) === 1
                      ? 'Tidak diperlukan untuk Welcome'
                      : 'Pilih berita'}

                  </option>


                  {loadingBerita ? (

                    <option disabled>
                      Memuat berita...
                    </option>

                  ) : (

                    availableBerita.map(
                      (
                        berita
                      ) => (

                        <option
                          key={
                            berita.id
                          }
                          value={
                            berita.id
                          }
                        >
                          {
                            berita.judul
                          }
                        </option>

                      )
                    )

                  )}

                </select>


                <p className="mt-1 text-body-sm text-on-surface-variant">
                  Hanya berita published yang dapat dipilih.
                </p>

              </div>

            </div>


            {/* ================================================================
                STATUS
            ================================================================ */}

            <label
              className={`flex items-center gap-3 ${
                Number(
                  urutan
                ) === 1
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >

              <input
                type="checkbox"
                checked={
                  Number(
                    urutan
                  ) === 1
                    ? true
                    : isActive
                }
                disabled={
                  Number(
                    urutan
                  ) === 1
                }
                onChange={(
                  event
                ) =>
                  setIsActive(
                    event.target.checked
                  )
                }
                className="h-5 w-5 rounded"
              />


              <span className="font-label-md text-on-surface">

                {Number(
                  urutan
                ) === 1
                  ? 'Welcome selalu aktif'
                  : 'Tampilkan Hero di halaman utama'}

              </span>

            </label>


            {/* ================================================================
                ACTION
            ================================================================ */}

            <div className="flex justify-end gap-3 pt-2">

              <button
                type="button"
                onClick={
                  resetForm
                }
                disabled={
                  saving
                }
                className="rounded-xl border border-outline-variant px-5 py-2 text-on-surface-variant transition hover:bg-surface-container-low disabled:opacity-50"
              >
                Batal
              </button>


              <button
                type="submit"
                disabled={
                  saving
                }
                className="rounded-xl bg-primary px-5 py-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving
                  ? 'Menyimpan...'
                  : currentId
                    ? 'Simpan Perubahan'
                    : 'Tambah Hero'}

              </button>

            </div>

          </form>

        </motion.div>

      )}


      {/* ====================================================================
          TABLE
      ==================================================================== */}

      <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">

        {/* ==================================================================
            TABLE HEADER
        ================================================================== */}

        <div className="border-b border-outline-variant/20 bg-surface-container-low px-6 py-4">

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="font-title-lg text-on-surface">
                Daftar Hero
              </h2>


              <p className="mt-1 font-body-sm text-on-surface-variant">
                Slide pertama adalah sambutan.
                Slide berikutnya terhubung ke berita.
              </p>

            </div>


            <div className="rounded-full bg-primary/10 px-3 py-1 text-label-sm text-primary">
              Super Admin
            </div>

          </div>

        </div>


        {/* ==================================================================
            LOADING / EMPTY / TABLE
        ================================================================== */}

        {loading ? (

          <div className="px-6 py-12 text-center text-body-md text-on-surface-variant">
            Memuat data hero...
          </div>

        ) : heroList.length === 0 ? (

          <div className="px-6 py-12 text-center text-body-md text-on-surface-variant">
            Belum ada hero yang ditambahkan.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-225">

              <thead className="border-b border-outline-variant/20 bg-surface-container-low">

                <tr>

                  <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant">
                    #
                  </th>


                  <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant">
                    Gambar
                  </th>


                  <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant">
                    Konten
                  </th>


                  <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant">
                    Berita
                  </th>


                  <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant">
                    Status
                  </th>


                  <th className="px-6 py-4 text-right font-label-sm text-on-surface-variant">
                    Aksi
                  </th>

                </tr>

              </thead>


              <tbody>

                {heroList.map(
                  (
                    hero
                  ) => (

                    <HeroTableRow
                      key={
                        hero.id
                      }
                      hero={
                        hero
                      }
                      onEdit={
                        handleEdit
                      }
                      onDelete={
                        handleDelete
                      }
                      onToggleActive={
                        handleToggleActive
                      }
                      deletingId={
                        deletingId
                      }
                    />

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

};


// ============================================================================
// HERO TABLE ROW
// ============================================================================

const HeroTableRow = ({
  hero,
  onEdit,
  onDelete,
  onToggleActive,
  deletingId,
}) => {

  // ==========================================================================
  // STATE IMAGE
  // ==========================================================================

  const [
    imageUrl,
    setImageUrl,
  ] = useState(null);

  const [
    imageLoading,
    setImageLoading,
  ] = useState(true);


  // ==========================================================================
  // LOAD PRIVATE IMAGE
  // ==========================================================================

  useEffect(() => {

    let objectUrl = '';


    const loadImage =
      async () => {

        try {

          setImageLoading(
            true
          );


          const response =
            await api.get(
              `/admin/files/hero/${hero.id}`,
              {
                responseType:
                  'blob',
              }
            );


          objectUrl =
            URL.createObjectURL(
              response.data
            );


          setImageUrl(
            objectUrl
          );

        } catch (
          error
        ) {

          console.error(
            'Gagal memuat gambar hero:',
            error
          );


          setImageUrl(
            null
          );

        } finally {

          setImageLoading(
            false
          );

        }

      };


    loadImage();


    // ------------------------------------------------------------------------
    // Cleanup object URL
    // ------------------------------------------------------------------------

    return () => {

      if (
        objectUrl
      ) {

        URL.revokeObjectURL(
          objectUrl
        );

      }

    };

  }, [
    hero.id,
  ]);


  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (

    <tr className="border-b border-outline-variant/10 transition-colors hover:bg-primary/5">

      {/* ====================================================================
          URUTAN
      ==================================================================== */}

      <td className="px-6 py-4 align-top">

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-label-md text-primary">

          {
            hero.urutan
          }

        </div>

      </td>


      {/* ====================================================================
          GAMBAR
      ==================================================================== */}

      <td className="px-6 py-4 align-top">

        <div className="h-20 w-32 overflow-hidden rounded-lg bg-surface-container">

          {imageLoading ? (

            <div className="flex h-full items-center justify-center text-body-sm text-on-surface-variant">
              Memuat...
            </div>

          ) : imageUrl ? (

            <img
              src={
                imageUrl
              }
              alt={
                hero.title
              }
              className="h-full w-full object-cover"
            />

          ) : (

            <div className="flex h-full items-center justify-center text-body-sm text-on-surface-variant">
              Tidak ada gambar
            </div>

          )}

        </div>

      </td>


      {/* ====================================================================
          KONTEN
      ==================================================================== */}

      <td className="px-6 py-4 align-top">

        <div className="max-w-105">

          <p className="wrap-break-word font-label-md text-on-surface">
            {
              hero.title
            }
          </p>


          {hero.subtitle && (

            <p className="mt-1 wrap-break-word text-body-sm text-on-surface-variant">
              {
                hero.subtitle
              }
            </p>

          )}

        </div>

      </td>


      {/* ====================================================================
          BERITA
      ==================================================================== */}

      <td className="px-6 py-4 align-top">

        {hero.berita ? (

          <div className="max-w-105">

            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-label-sm text-primary">
              Berita
            </span>


            <p className="mt-2 wrap-break-word text-body-sm text-on-surface">
              {
                hero.berita.judul
              }
            </p>

          </div>

        ) : (

          <span className="inline-flex rounded-full bg-surface-container px-3 py-1 text-label-sm text-on-surface-variant">
            Welcome
          </span>

        )}

      </td>


      {/* ====================================================================
          STATUS
      ==================================================================== */}

      <td className="px-6 py-4 align-top">

        {Number(
          hero?.urutan
        ) === 1 ? (

          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-label-sm text-primary">
            Aktif
          </span>

        ) : (

          <button
            type="button"
            onClick={() =>
              onToggleActive(
                hero
              )
            }
            className={`rounded-full px-3 py-1 text-label-sm transition ${
              hero.is_active
                ? 'bg-primary/10 text-primary hover:bg-primary/15'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >

            {hero.is_active
              ? 'Aktif'
              : 'Nonaktif'}

          </button>

        )}

      </td>


      {/* ====================================================================
    AKSI
==================================================================== */}

<td className="px-6 py-4 text-right align-top">

<div className="flex justify-end gap-2">

  {/* ================================================================
      EDIT — Tombol Hijau
  ================================================================ */}

  <button
    type="button"
    onClick={() =>
      onEdit(
        hero
      )
    }
    className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700 active:bg-green-800"
  >

    <span className="material-symbols-outlined text-base">
      edit
    </span>

    Edit

  </button>


  {/* ================================================================
      HAPUS — Tombol Hijau (Welcome tidak boleh dihapus)
  ================================================================ */}

  {Number(
    hero?.urutan
  ) !== 1 && (

    <button
      type="button"
      onClick={() =>
        onDelete(
          hero.id
        )
      }
      disabled={
        deletingId ===
        hero.id
      }
      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700 active:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
    >

      <span className="material-symbols-outlined text-base">

        {deletingId ===
        hero.id
          ? 'progress_activity'
          : 'delete'}

      </span>

      {deletingId ===
      hero.id
        ? 'Menghapus...'
        : 'Hapus'}

    </button>

  )}

</div>

</td>

    </tr>

  );

};


// ============================================================================
// EXPORT
// ============================================================================

export default SuperAdminHero;
// src/components/KritikSaran.jsx

import React, {
  useState,
} from 'react';

import api from '../api/axios';

const EMPTY_FORM = {
  nama: '',
  email: '',
  pesan: '',
};

const KritikSaran = () => {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    form,
    setForm,
  ] = useState({
    ...EMPTY_FORM,
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    success,
    setSuccess,
  ] = useState('');

  const [
    error,
    setError,
  ] = useState('');

  const [
    validationErrors,
    setValidationErrors,
  ] = useState({});

  /*
  |--------------------------------------------------------------------------
  | FORM CHANGE
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
      (
        previous
      ) => ({
        ...previous,
        [name]: value,
      })
    );

    /*
    |----------------------------------------------------------------------
    | Hapus error field saat user mulai memperbaiki input
    |----------------------------------------------------------------------
    */

    setValidationErrors(
      (
        previous
      ) => {
        const next = {
          ...previous,
        };

        delete next[name];

        return next;
      }
    );

    setError('');
    setSuccess('');
  };

  /*
  |--------------------------------------------------------------------------
  | FIELD ERROR
  |--------------------------------------------------------------------------
  */

  const getFieldError = (
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

    return value || '';
  };

  /*
  |--------------------------------------------------------------------------
  | INPUT CLASS
  |--------------------------------------------------------------------------
  */

  const getInputClass = (
    field
  ) => {
    const hasError =
      Boolean(
        getFieldError(
          field
        )
      );

    return [
      'w-full',
      'px-4',
      'rounded-lg',
      'border',
      'bg-surface',
      'text-on-surface',
      'placeholder:text-on-surface-variant/60',
      'outline-none',
      'transition-all',
      'duration-200',

      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
        : 'border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10',
    ].join(' ');
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');
    setValidationErrors(
      {}
    );

    /*
    |----------------------------------------------------------------------
    | Validasi frontend sederhana
    |----------------------------------------------------------------------
    */

    const localErrors =
      {};

    if (
      !form.nama.trim()
    ) {
      localErrors.nama =
        'Nama lengkap wajib diisi.';
    }

    if (
      !form.email.trim()
    ) {
      localErrors.email =
        'Email wajib diisi.';
    }

    if (
      !form.pesan.trim()
    ) {
      localErrors.pesan =
        'Pesan atau saran wajib diisi.';
    }

    if (
      Object.keys(
        localErrors
      ).length > 0
    ) {
      setValidationErrors(
        localErrors
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await api.post(
          '/kritik-saran',
          {
            nama:
              form.nama.trim(),

            email:
              form.email.trim(),

            pesan:
              form.pesan.trim(),
          }
        );

      setSuccess(
        response.data?.message ||
          'Kritik dan saran berhasil dikirim. Terima kasih atas masukan Anda.'
      );

      setForm({
        ...EMPTY_FORM,
      });

      setValidationErrors({});
    } catch (
      err
    ) {
      console.error(
        'Gagal mengirim kritik dan saran:',
        err
      );

      const responseData =
        err.response?.data;

      /*
      |----------------------------------------------------------------------
      | Error validasi Laravel
      |----------------------------------------------------------------------
      */

      if (
        responseData?.errors
      ) {
        setValidationErrors(
          responseData.errors
        );
      }

      setError(
        responseData?.message ||
          'Kritik dan saran gagal dikirim. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section className="py-xl bg-surface">

      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">

        {/* =========================================================
            HEADER
        ========================================================== */}

        <div className="max-w-2xl mx-auto text-center mb-xl">

          <h2 className="font-headline-lg text-primary">
            Kritik dan Saran
          </h2>

          <div className="w-16 h-1 bg-primary rounded-full mx-auto mt-md mb-lg" />

          <p className="font-body-md text-on-surface-variant">
            Masukan Anda sangat berarti bagi kami untuk meningkatkan
            pelayanan desa menjadi lebih baik.
          </p>

        </div>

        {/* =========================================================
            SUCCESS
        ========================================================== */}

        {success && (
          <div className="max-w-2xl mx-auto mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-green-700">

            <div className="flex items-start gap-3">

              <span className="material-symbols-outlined shrink-0">
                check_circle
              </span>

              <p className="text-sm leading-relaxed">
                {success}
              </p>

            </div>

          </div>
        )}

        {/* =========================================================
            ERROR
        ========================================================== */}

        {error && (
          <div className="max-w-2xl mx-auto mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">

            <div className="flex items-start gap-3">

              <span className="material-symbols-outlined shrink-0">
                error
              </span>

              <p className="text-sm leading-relaxed">
                {error}
              </p>

            </div>

          </div>
        )}

        {/* =========================================================
            FORM
        ========================================================== */}

        <div className="max-w-2xl mx-auto">

          <form
            onSubmit={
              handleSubmit
            }
            className="
              bg-surface-container-lowest
              border border-outline-variant/20
              rounded-2xl
              shadow-sm
              p-6
              md:p-8
              flex
              flex-col
              gap-6
            "
          >

            {/* =====================================================
                NAMA
            ====================================================== */}

            <div className="flex flex-col gap-2">

              <label
                htmlFor="kritikNama"
                className="font-label-md text-on-surface font-semibold"
              >
                Nama Lengkap
              </label>

              <input
                id="kritikNama"
                name="nama"
                type="text"
                value={
                  form.nama
                }
                onChange={
                  handleChange
                }
                maxLength={150}
                disabled={
                  loading
                }
                placeholder="Masukkan nama Anda"
                className={`
                  ${getInputClass(
                    'nama'
                  )}
                  h-12
                `}
              />

              {getFieldError(
                'nama'
              ) && (
                <p className="text-xs text-red-600">
                  {
                    getFieldError(
                      'nama'
                    )
                  }
                </p>
              )}

            </div>

            {/* =====================================================
                EMAIL
            ====================================================== */}

            <div className="flex flex-col gap-2">

              <label
                htmlFor="kritikEmail"
                className="font-label-md text-on-surface font-semibold"
              >
                Email
              </label>

              <input
                id="kritikEmail"
                name="email"
                type="email"
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
                maxLength={150}
                disabled={
                  loading
                }
                placeholder="Masukkan alamat email"
                className={`
                  ${getInputClass(
                    'email'
                  )}
                  h-12
                `}
              />

              {getFieldError(
                'email'
              ) && (
                <p className="text-xs text-red-600">
                  {
                    getFieldError(
                      'email'
                    )
                  }
                </p>
              )}

            </div>

            {/* =====================================================
                PESAN
            ====================================================== */}

            <div className="flex flex-col gap-2">

              <label
                htmlFor="kritikPesan"
                className="font-label-md text-on-surface font-semibold"
              >
                Pesan / Saran
              </label>

              <textarea
                id="kritikPesan"
                name="pesan"
                value={
                  form.pesan
                }
                onChange={
                  handleChange
                }
                maxLength={5000}
                rows={5}
                disabled={
                  loading
                }
                placeholder="Tuliskan kritik atau saran Anda di sini..."
                className={`
                  ${getInputClass(
                    'pesan'
                  )}
                  min-h-32
                  py-3
                  resize-y
                `}
              />

              <div className="flex items-center justify-between gap-3">

                {getFieldError(
                  'pesan'
                ) ? (
                  <p className="text-xs text-red-600">
                    {
                      getFieldError(
                        'pesan'
                      )
                    }
                  </p>
                ) : (
                  <span />
                )}

                <span className="text-xs text-on-surface-variant shrink-0">
                  {
                    form.pesan.length
                  }
                  /5000
                </span>

              </div>

            </div>

            {/* =====================================================
                BUTTON
            ====================================================== */}

            <button
              type="submit"
              disabled={
                loading
              }
              className="
                w-full
                h-12
                mt-1
                bg-primary
                hover:bg-primary-container
                text-on-primary
                rounded-lg
                font-label-md
                font-semibold
                shadow-sm
                hover:shadow-md
                transition-all
                duration-200
                flex
                items-center
                justify-center
                gap-2
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
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

                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '20px',
                    }}
                  >
                    send
                  </span>

                  Kirim Pesan

                </>
              )}

            </button>

          </form>

        </div>

      </div>

    </section>
  );
};

export default KritikSaran;
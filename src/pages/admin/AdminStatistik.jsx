import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { motion } from 'framer-motion';

import api from '../../api/axios';

/*
|--------------------------------------------------------------------------
| EMPTY STATS
|--------------------------------------------------------------------------
*/

const getEmptyStats = (
  tahun
) => ({
  tahun:
    tahun ||
    new Date().getFullYear(),

  total_penduduk: '',
  total_kk: '',
  total_laki_laki: '',
  total_perempuan: '',

  total_pkh: '',
  total_blt_dd: '',
  total_bpnt: '',

  /*
  |--------------------------------------------------------------------------
  | KELOMPOK USIA
  |--------------------------------------------------------------------------
  |
  | Disimpan sebagai JUMLAH ORANG.
  |
  */

  usia_0_14: '',
  usia_15_64: '',
  usia_65_plus: '',

  /*
  |--------------------------------------------------------------------------
  | IDM
  |--------------------------------------------------------------------------
  */

  idm_nilai: '',
  idm_status: '',
});

/*
|--------------------------------------------------------------------------
| NORMALIZE STATS
|--------------------------------------------------------------------------
*/

const normalizeStats = (
  data,
  fallbackTahun
) => ({
  tahun:
    data?.tahun ??
    fallbackTahun,

  total_penduduk:
    data?.total_penduduk ??
    '',

  total_kk:
    data?.total_kk ??
    '',

  total_laki_laki:
    data?.total_laki_laki ??
    '',

  total_perempuan:
    data?.total_perempuan ??
    '',

  total_pkh:
    data?.total_pkh ??
    '',

  total_blt_dd:
    data?.total_blt_dd ??
    '',

  total_bpnt:
    data?.total_bpnt ??
    '',

  usia_0_14:
    data?.usia_0_14 ??
    '',

  usia_15_64:
    data?.usia_15_64 ??
    '',

  usia_65_plus:
    data?.usia_65_plus ??
    '',

  idm_nilai:
    data?.idm_nilai ??
    '',

  idm_status:
    data?.idm_status ??
    '',
});

/*
|--------------------------------------------------------------------------
| FORMAT NUMBER
|--------------------------------------------------------------------------
*/

const formatNumber = (
  value
) => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '-';
  }

  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
  ) {
    return '-';
  }

  return number.toLocaleString(
    'id-ID'
  );
};

/*
|--------------------------------------------------------------------------
| FIELD ERROR
|--------------------------------------------------------------------------
*/

const getFieldError = (
  validationErrors,
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
  error
) => {
  return [
    'w-full',
    'h-12',
    'px-4',
    'rounded-xl',
    'bg-surface',
    'border',
    'outline-none',
    'transition-colors',

    error
      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
      : 'border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10',
  ].join(' ');
};

/*
|--------------------------------------------------------------------------
| FIELD
|--------------------------------------------------------------------------
*/

const Field = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  min,
  max,
  step,
  error,
  placeholder,
}) => {
  return (
    <div>

      <label className="block text-sm font-semibold text-on-surface mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        required
        className={getInputClass(
          error
        )}
      />

      {error && (
        <p className="text-xs text-red-600 mt-1.5">
          {error}
        </p>
      )}

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| STAT ROW
|--------------------------------------------------------------------------
*/

const StatRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-outline-variant/10 last:border-b-0">

      <dt className="text-sm text-on-surface-variant">
        {label}
      </dt>

      <dd className="text-sm font-semibold text-on-surface text-right">
        {value}
      </dd>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| VALIDATION NOTICE
|--------------------------------------------------------------------------
*/

const ValidationNotice = ({
  children,
  variant = 'error',
}) => {
  const isSuccess =
    variant ===
    'success';

  return (
    <div
      className={[
        'mt-3',
        'rounded-xl',
        'px-4',
        'py-3',
        'text-sm',
        isSuccess
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-red-50 text-red-700 border border-red-200',
      ].join(' ')}
    >

      <div className="flex items-start gap-2">

        <span className="material-symbols-outlined text-base">
          {isSuccess
            ? 'check_circle'
            : 'error'}
        </span>

        <span>
          {children}
        </span>

      </div>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| AGE STAT CARD
|--------------------------------------------------------------------------
*/

const AgeStatCard = ({
  label,
  value,
  percentage,
}) => {
  const hasValue =
    value !== '' &&
    value !== null &&
    value !== undefined;

  return (
    <div className="rounded-xl bg-surface-container-low p-5">

      <p className="text-sm text-on-surface-variant">
        {label}
      </p>

      <p className="text-3xl font-bold text-primary mt-2">
        {hasValue
          ? formatNumber(value)
          : '-'}
      </p>

      <p className="text-sm text-on-surface-variant mt-1">
        {hasValue
          ? `${percentage}% dari total penduduk`
          : '-'}
      </p>

      {hasValue && (
        <p className="text-xs text-on-surface-variant mt-1">
          orang
        </p>
      )}

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| ADMIN STATISTIK
|--------------------------------------------------------------------------
*/

const AdminStatistik = () => {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    stats,
    setStats,
  ] = useState(
    getEmptyStats()
  );

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
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
  | FETCH STATISTIK
  |--------------------------------------------------------------------------
  */

  const fetchStatistik =
    async (
      tahun =
        new Date().getFullYear()
    ) => {
      setLoading(true);
      setError('');
      setValidationErrors({});

      try {
        const response =
          await api.get(
            '/admin/statistik',
            {
              params: {
                tahun,
              },
            }
          );

        const data =
          response.data?.data;

        /*
        |--------------------------------------------------------------------------
        | Data tersedia
        |--------------------------------------------------------------------------
        */

        if (data) {
          setStats(
            normalizeStats(
              data,
              tahun
            )
          );

          return;
        }

        /*
        |--------------------------------------------------------------------------
        | Tahun belum mempunyai data
        |--------------------------------------------------------------------------
        */

        setStats(
          getEmptyStats(
            tahun
          )
        );
      } catch (
        err
      ) {
        console.error(
          'Gagal mengambil statistik:',
          err
        );

        setError(
          err.response?.data
            ?.message ||
          'Gagal mengambil data statistik desa.'
        );
      } finally {
        setLoading(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | LOAD AWAL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchStatistik();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | HANDLE CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setStats(
      (
        previous
      ) => ({
        ...previous,
        [name]:
          value,
      })
    );

    setValidationErrors(
      (
        previous
      ) => {
        const next = {
          ...previous,
        };

        delete next[
          name
        ];

        /*
        |--------------------------------------------------------------------------
        | Error kelompok usia
        |--------------------------------------------------------------------------
        */

        if (
          name ===
            'usia_0_14' ||
          name ===
            'usia_15_64' ||
          name ===
            'usia_65_plus'
        ) {
          delete next.usia;
        }

        return next;
      }
    );

    setError('');
    setSuccess('');
  };

  /*
  |--------------------------------------------------------------------------
  | HANDLE EDIT
  |--------------------------------------------------------------------------
  */

  const handleEdit = () => {
    setError('');
    setSuccess('');
    setValidationErrors({});

    setIsEditing(true);
  };

  /*
  |--------------------------------------------------------------------------
  | HANDLE CANCEL
  |--------------------------------------------------------------------------
  */

  const handleCancel =
    async () => {
      setError('');
      setSuccess('');
      setValidationErrors({});
      setIsEditing(false);

      await fetchStatistik(
        Number(
          stats.tahun
        )
      );
    };

  /*
  |--------------------------------------------------------------------------
  | FRONTEND VALIDATION
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    const errors = {};

    const totalPenduduk =
      Number(
        stats.total_penduduk
      );

    const totalLaki =
      Number(
        stats.total_laki_laki
      );

    const totalPerempuan =
      Number(
        stats.total_perempuan
      );

    const usia014 =
      Number(
        stats.usia_0_14
      );

    const usia1564 =
      Number(
        stats.usia_15_64
      );

    const usia65 =
      Number(
        stats.usia_65_plus
      );

    /*
    |--------------------------------------------------------------------------
    | Validasi jenis kelamin
    |--------------------------------------------------------------------------
    */

    if (
      totalLaki +
        totalPerempuan !==
      totalPenduduk
    ) {
      errors.total_laki_laki = [
        'Laki-laki + perempuan harus sama dengan total penduduk.',
      ];

      errors.total_perempuan = [
        'Laki-laki + perempuan harus sama dengan total penduduk.',
      ];
    }

    /*
    |--------------------------------------------------------------------------
    | Validasi kelompok usia
    |--------------------------------------------------------------------------
    */

    if (
      usia014 +
        usia1564 +
        usia65 !==
      totalPenduduk
    ) {
      errors.usia_0_14 = [
        'Jumlah kelompok usia harus sama dengan total penduduk.',
      ];

      errors.usia_15_64 = [
        'Jumlah kelompok usia harus sama dengan total penduduk.',
      ];

      errors.usia_65_plus = [
        'Jumlah kelompok usia harus sama dengan total penduduk.',
      ];

      errors.usia = [
        'Usia 0-14 + usia 15-64 + usia 65+ harus sama dengan total penduduk.',
      ];
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
  | HANDLE SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    async (
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
        const payload = {
          tahun:
            Number(
              stats.tahun
            ),

          total_penduduk:
            Number(
              stats.total_penduduk
            ),

          total_kk:
            Number(
              stats.total_kk
            ),

          total_laki_laki:
            Number(
              stats.total_laki_laki
            ),

          total_perempuan:
            Number(
              stats.total_perempuan
            ),

          total_pkh:
            Number(
              stats.total_pkh
            ),

          total_blt_dd:
            Number(
              stats.total_blt_dd
            ),

          total_bpnt:
            Number(
              stats.total_bpnt
            ),

          /*
          |--------------------------------------------------------------------------
          | USIA = JUMLAH ORANG
          |--------------------------------------------------------------------------
          */

          usia_0_14:
            Number(
              stats.usia_0_14
            ),

          usia_15_64:
            Number(
              stats.usia_15_64
            ),

          usia_65_plus:
            Number(
              stats.usia_65_plus
            ),

          /*
          |--------------------------------------------------------------------------
          | IDM
          |--------------------------------------------------------------------------
          */

          idm_nilai:
            stats.idm_nilai ===
            ''
              ? null
              : Number(
                  stats.idm_nilai
                ),

          idm_status:
            stats.idm_status ||
            null,
        };

        const response =
          await api.post(
            '/admin/statistik',
            payload
          );

        const savedData =
          response.data?.data;

        if (savedData) {
          setStats(
            normalizeStats(
              savedData,
              payload.tahun
            )
          );
        }

        setSuccess(
          response.data?.message ||
            'Statistik desa berhasil disimpan.'
        );

        setIsEditing(false);
      } catch (
        err
      ) {
        console.error(
          'Gagal menyimpan statistik:',
          err
        );

        const responseData =
          err.response?.data;

        setError(
          responseData?.message ||
            'Statistik desa gagal disimpan.'
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
  | HANDLE TAHUN
  |--------------------------------------------------------------------------
  */

  const handleTahunChange =
    async (
      event
    ) => {
      const tahun =
        Number(
          event.target.value
        );

      setIsEditing(false);
      setError('');
      setSuccess('');
      setValidationErrors({});

      await fetchStatistik(
        tahun
      );
    };

  /*
  |--------------------------------------------------------------------------
  | PERCENTAGE CALCULATION
  |--------------------------------------------------------------------------
  */

  const getPercentage = (
    value,
    total
  ) => {
    const jumlah =
      Number(
        value
      );

    const totalPenduduk =
      Number(
        total
      );

    if (
      !totalPenduduk ||
      totalPenduduk <=
        0 ||
      !Number.isFinite(
        jumlah
      )
    ) {
      return '0.0';
    }

    return (
      (jumlah /
        totalPenduduk) *
      100
    ).toFixed(1);
  };

  /*
  |--------------------------------------------------------------------------
  | TOTAL USIA
  |--------------------------------------------------------------------------
  */

  const totalUsia =
    useMemo(() => {
      return (
        Number(
          stats.usia_0_14 ||
            0
        ) +
        Number(
          stats.usia_15_64 ||
            0
        ) +
        Number(
          stats.usia_65_plus ||
            0
        )
      );
    }, [
      stats.usia_0_14,
      stats.usia_15_64,
      stats.usia_65_plus,
    ]);

  /*
  |--------------------------------------------------------------------------
  | TOTAL GENDER
  |--------------------------------------------------------------------------
  */

  const totalGender =
    useMemo(() => {
      return (
        Number(
          stats.total_laki_laki ||
            0
        ) +
        Number(
          stats.total_perempuan ||
            0
        )
      );
    }, [
      stats.total_laki_laki,
      stats.total_perempuan,
    ]);

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

          <h1 className="font-headline-lg text-on-background">
            Statistik Desa
          </h1>

          <p className="font-body-md text-on-surface-variant mt-1">
            Kelola data statistik desa berdasarkan tahun.
          </p>

        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={
              handleEdit
            }
            disabled={
              loading
            }
            className="px-5 py-3 bg-primary text-white rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
          >

            <span className="material-symbols-outlined">
              edit
            </span>

            Edit Statistik

          </button>
        )}

      </div>

      {/* =========================================================
          ERROR
      ========================================================== */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <div className="flex items-start gap-2">

            <span className="material-symbols-outlined">
              error
            </span>

            <span className="whitespace-pre-line">
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

            <span className="material-symbols-outlined">
              check_circle
            </span>

            <span>
              {success}
            </span>

          </div>

        </div>
      )}

      {/* =========================================================
          YEAR
      ========================================================== */}

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 mb-6">

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

          <div className="flex-1">

            <p className="text-sm font-semibold text-on-surface">
              Tahun Statistik
            </p>

            <p className="text-xs text-on-surface-variant mt-1">
              Pilih tahun untuk melihat atau mengganti data statistik.
            </p>

          </div>

          <select
            value={
              stats.tahun
            }
            onChange={
              handleTahunChange
            }
            disabled={
              loading ||
              submitting ||
              isEditing
            }
            className="h-11 w-full sm:w-40 px-4 rounded-xl bg-surface border border-outline-variant/40 outline-none focus:border-primary"
          >

            {Array.from(
              {
                length: 11,
              },
              (
                _,
                index
              ) =>
                new Date().getFullYear() -
                index
            ).map(
              (
                year
              ) => (
                <option
                  key={
                    year
                  }
                  value={
                    year
                  }
                >
                  {year}
                </option>
              )
            )}

          </select>

        </div>

      </div>

      {/* =========================================================
          LOADING
      ========================================================== */}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {[1, 2].map(
            (
              item
            ) => (
              <div
                key={
                  item
                }
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6"
              >

                <div className="h-6 w-40 bg-surface-container-high rounded animate-pulse mb-5" />

                <div className="space-y-4">

                  {[1, 2, 3, 4, 5].map(
                    (
                      row
                    ) => (
                      <div
                        key={
                          row
                        }
                        className="h-5 w-full bg-surface-container-high rounded animate-pulse"
                      />
                    )
                  )}

                </div>

              </div>
            )
          )}

        </div>
      ) : (
        <>

          {/* =====================================================
              FORM
          ====================================================== */}

          {isEditing && (
            <motion.section
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 mb-6"
            >

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="font-headline-md text-xl text-on-surface">
                    Edit Statistik {stats.tahun}
                  </h2>

                  <p className="text-sm text-on-surface-variant mt-1">
                    Data tahun yang sama akan diperbarui,
                    bukan membuat data duplikat.
                  </p>

                </div>

              </div>

              <form
                onSubmit={
                  handleSubmit
                }
                className="space-y-6"
              >

                {/* =================================================
                    KEPENDUDUKAN
                ================================================== */}

                <div>

                  <h3 className="font-semibold text-primary mb-4">
                    Kependudukan
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <Field
                      label="Total Penduduk"
                      name="total_penduduk"
                      value={
                        stats.total_penduduk
                      }
                      onChange={
                        handleChange
                      }
                      type="number"
                      min="0"
                      error={
                        getFieldError(
                          validationErrors,
                          'total_penduduk'
                        )
                      }
                    />

                    <Field
                      label="Total KK"
                      name="total_kk"
                      value={
                        stats.total_kk
                      }
                      onChange={
                        handleChange
                      }
                      type="number"
                      min="0"
                      error={
                        getFieldError(
                          validationErrors,
                          'total_kk'
                        )
                      }
                    />

                    <Field
                      label="Total Laki-laki"
                      name="total_laki_laki"
                      value={
                        stats.total_laki_laki
                      }
                      onChange={
                        handleChange
                      }
                      type="number"
                      min="0"
                      error={
                        getFieldError(
                          validationErrors,
                          'total_laki_laki'
                        )
                      }
                    />

                    <Field
                      label="Total Perempuan"
                      name="total_perempuan"
                      value={
                        stats.total_perempuan
                      }
                      onChange={
                        handleChange
                      }
                      type="number"
                      min="0"
                      error={
                        getFieldError(
                          validationErrors,
                          'total_perempuan'
                        )
                      }
                    />

                  </div>

                  {totalGender !==
                    Number(
                      stats.total_penduduk ||
                        0
                    ) && (
                    <ValidationNotice>
                      Total laki-laki + perempuan
                      harus sama dengan total
                      penduduk.
                    </ValidationNotice>
                  )}

                </div>

                {/* =================================================
                    BANSOS
                ================================================== */}

                <div>

                  <h3 className="font-semibold text-primary mb-4">
                    Bantuan Sosial
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <Field
                      label="PKH"
                      name="total_pkh"
                      value={
                        stats.total_pkh
                      }
                      onChange={
                        handleChange
                      }
                      type="number"
                      min="0"
                      error={
                        getFieldError(
                          validationErrors,
                          'total_pkh'
                        )
                      }
                    />

                    <Field
                      label="BLT DD"
                      name="total_blt_dd"
                      value={
                        stats.total_blt_dd
                      }
                      onChange={
                        handleChange
                      }
                      type="number"
                      min="0"
                      error={
                        getFieldError(
                          validationErrors,
                          'total_blt_dd'
                        )
                      }
                    />

                    <Field
                      label="BPNT"
                      name="total_bpnt"
                      value={
                        stats.total_bpnt
                      }
                      onChange={
                        handleChange
                      }
                      type="number"
                      min="0"
                      error={
                        getFieldError(
                          validationErrors,
                          'total_bpnt'
                        )
                      }
                    />

                  </div>

                </div>

                {/* =================================================
                    KELOMPOK USIA
                ================================================== */}

                <div>

                  <h3 className="font-semibold text-primary mb-1">
                    Kelompok Usia
                  </h3>

                  <p className="text-xs text-on-surface-variant mb-4">
                    Masukkan jumlah penduduk pada
                    setiap kelompok usia. Persentase
                    dihitung otomatis berdasarkan
                    total penduduk.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <Field
                      label="Usia 0-14 Tahun (orang)"
                      name="usia_0_14"
                      value={
                        stats.usia_0_14
                      }
                      onChange={
                        handleChange
                      }
                      type="number"
                      min="0"
                      error={
                        getFieldError(
                          validationErrors,
                          'usia_0_14'
                        )
                      }
                    />

                    <Field
                      label="Usia 15-64 Tahun (orang)"
                      name="usia_15_64"
                      value={
                        stats.usia_15_64
                      }
                      onChange={
                        handleChange
                      }
                      type="number"
                      min="0"
                      error={
                        getFieldError(
                          validationErrors,
                          'usia_15_64'
                        )
                      }
                    />

                    <Field
                      label="Usia 65+ Tahun (orang)"
                      name="usia_65_plus"
                      value={
                        stats.usia_65_plus
                      }
                      onChange={
                        handleChange
                      }
                      type="number"
                      min="0"
                      error={
                        getFieldError(
                          validationErrors,
                          'usia_65_plus'
                        )
                      }
                    />

                  </div>

                  <ValidationNotice
                    variant={
                      totalUsia ===
                      Number(
                        stats.total_penduduk ||
                          0
                      )
                        ? 'success'
                        : 'error'
                    }
                  >
                    Total kelompok usia:{' '}

                    <strong>
                      {formatNumber(
                        totalUsia
                      )}
                    </strong>

                    {' '}dari{' '}

                    <strong>
                      {formatNumber(
                        stats.total_penduduk
                      )}
                    </strong>

                    {' '}penduduk
                    {' · '}

                    {getPercentage(
                      totalUsia,
                      stats.total_penduduk
                    )}
                    %
                  </ValidationNotice>

                  {getFieldError(
                    validationErrors,
                    'usia'
                  ) && (
                    <p className="text-xs text-red-600 mt-2">
                      {getFieldError(
                        validationErrors,
                        'usia'
                      )}
                    </p>
                  )}

                </div>

                {/* =================================================
                    IDM
                ================================================== */}

                <div>

                  <h3 className="font-semibold text-primary mb-4">
                    Indeks Desa Membangun
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <Field
                      label="Nilai IDM"
                      name="idm_nilai"
                      value={
                        stats.idm_nilai
                      }
                      onChange={
                        handleChange
                      }
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      error={
                        getFieldError(
                          validationErrors,
                          'idm_nilai'
                        )
                      }
                    />

                    <div>

                      <label className="block text-sm font-semibold text-on-surface mb-2">
                        Status IDM
                      </label>

                      <input
                        type="text"
                        name="idm_status"
                        value={
                          stats.idm_status
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Contoh: Maju"
                        className={getInputClass(
                          getFieldError(
                            validationErrors,
                            'idm_status'
                          )
                        )}
                      />

                      {getFieldError(
                        validationErrors,
                        'idm_status'
                      ) && (
                        <p className="text-xs text-red-600 mt-1.5">
                          {getFieldError(
                            validationErrors,
                            'idm_status'
                          )}
                        </p>
                      )}

                    </div>

                  </div>

                </div>

                {/* =================================================
                    BUTTON
                ================================================== */}

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-outline-variant/20">

                  <button
                    type="submit"
                    disabled={
                      submitting
                    }
                    className="flex-1 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
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

                        Simpan Statistik

                      </>
                    )}

                  </button>

                  <button
                    type="button"
                    onClick={
                      handleCancel
                    }
                    disabled={
                      submitting
                    }
                    className="flex-1 px-5 py-3 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>

                </div>

              </form>

            </motion.section>
          )}

          {/* =====================================================
              PREVIEW
          ====================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ===================================================
                DATA UMUM
            ==================================================== */}

            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">

              <div className="flex items-center justify-between mb-5">

                <h3 className="font-headline-md text-primary">
                  Data Umum
                </h3>

                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                  {stats.tahun}
                </span>

              </div>

              <dl className="space-y-3">

                <StatRow
                  label="Total Penduduk"
                  value={
                    formatNumber(
                      stats.total_penduduk
                    )
                  }
                />

                <StatRow
                  label="Total KK"
                  value={
                    formatNumber(
                      stats.total_kk
                    )
                  }
                />

                <StatRow
                  label="Laki-laki"
                  value={
                    formatNumber(
                      stats.total_laki_laki
                    )
                  }
                />

                <StatRow
                  label="Perempuan"
                  value={
                    formatNumber(
                      stats.total_perempuan
                    )
                  }
                />

                <StatRow
                  label="IDM"
                  value={
                    stats.idm_nilai !==
                    ''
                      ? `${stats.idm_nilai}${
                          stats.idm_status
                            ? ` (${stats.idm_status})`
                            : ''
                        }`
                      : '-'
                  }
                />

              </dl>

            </div>

            {/* ===================================================
                BANSOS
            ==================================================== */}

            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">

              <h3 className="font-headline-md text-primary mb-5">
                Bantuan Sosial
              </h3>

              <dl className="space-y-3">

                <StatRow
                  label="PKH"
                  value={
                    formatNumber(
                      stats.total_pkh
                    )
                  }
                />

                <StatRow
                  label="BLT DD"
                  value={
                    formatNumber(
                      stats.total_blt_dd
                    )
                  }
                />

                <StatRow
                  label="BPNT"
                  value={
                    formatNumber(
                      stats.total_bpnt
                    )
                  }
                />

              </dl>

            </div>

            {/* ===================================================
                KELOMPOK USIA
            ==================================================== */}

            <div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">

                <div>

                  <h3 className="font-headline-md text-primary">
                    Kelompok Usia
                  </h3>

                  <p className="text-xs text-on-surface-variant mt-1">
                    Jumlah penduduk dan persentase dari total penduduk.
                  </p>

                </div>

                <span className="text-sm text-on-surface-variant">

                  Total:{' '}

                  <strong className="text-on-surface">
                    {formatNumber(
                      totalUsia
                    )}
                  </strong>

                  {' '}dari{' '}

                  <strong className="text-on-surface">
                    {formatNumber(
                      stats.total_penduduk
                    )}
                  </strong>

                  {' '}penduduk

                </span>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <AgeStatCard
                  label="0-14 Tahun"
                  value={
                    stats.usia_0_14
                  }
                  percentage={
                    getPercentage(
                      stats.usia_0_14,
                      stats.total_penduduk
                    )
                  }
                />

                <AgeStatCard
                  label="15-64 Tahun"
                  value={
                    stats.usia_15_64
                  }
                  percentage={
                    getPercentage(
                      stats.usia_15_64,
                      stats.total_penduduk
                    )
                  }
                />

                <AgeStatCard
                  label="65+ Tahun"
                  value={
                    stats.usia_65_plus
                  }
                  percentage={
                    getPercentage(
                      stats.usia_65_plus,
                      stats.total_penduduk
                    )
                  }
                />

              </div>

            </div>

          </div>

        </>
      )}

    </div>
  );
};

export default AdminStatistik;
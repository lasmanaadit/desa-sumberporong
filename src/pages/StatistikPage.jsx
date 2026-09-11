// src/pages/StatistikPage.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import api from '../api/axios';

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

/**
 * Tahun berjalan.
 */
const getCurrentYear = () => {
  return new Date().getFullYear();
};

/**
 * Format angka Indonesia.
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
    !Number.isFinite(number)
  ) {
    return '-';
  }

  return number.toLocaleString(
    'id-ID'
  );
};

/**
 * Hitung persentase berdasarkan total penduduk.
 *
 * Contoh:
 * 1400 / 5600 * 100 = 25%
 */
const calculatePercentage = (
  value,
  total
) => {
  const number =
    Number(value);

  const totalNumber =
    Number(total);

  if (
    !Number.isFinite(number) ||
    !Number.isFinite(totalNumber) ||
    totalNumber <= 0
  ) {
    return 0;
  }

  return (
    (number / totalNumber) *
    100
  );
};

/**
 * Format persentase.
 */
const formatPercentage = (
  value
) => {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return '0%';
  }

  return `${number.toFixed(1)}%`;
};

/**
 * Normalisasi nilai IDM.
 *
 * Format ideal database:
 * 0.00 - 1.00
 *
 * Tetapi bila data lama tersimpan:
 * 80
 *
 * maka dianggap sebagai 80% -> 0.80.
 */
const normalizeIdm = (
  value
) => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return null;
  }

  if (
    number > 1
  ) {
    return Math.min(
      Math.max(
        number / 100,
        0
      ),
      1
    );
  }

  return Math.min(
    Math.max(
      number,
      0
    ),
    1
  );
};

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

const StatistikPage = () => {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    statistik,
    setStatistik,
  ] = useState(null);

  const [
    tahun,
    setTahun,
  ] = useState(
    getCurrentYear()
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  /*
  |--------------------------------------------------------------------------
  | FETCH STATISTIK
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    const fetchStatistik =
      async () => {
        setLoading(true);
        setError('');

        try {
          const response =
            await api.get(
              '/statistik',
              {
                params: {
                  tahun,
                },
              }
            );

          if (
            cancelled
          ) {
            return;
          }

          const responseData =
            response.data?.data;

          setStatistik(
            responseData || null
          );
        } catch (
          err
        ) {
          if (
            cancelled
          ) {
            return;
          }

          console.error(
            'Gagal mengambil statistik desa:',
            err
          );

          setStatistik(
            null
          );

          setError(
            err.response?.data
              ?.message ||
            'Gagal mengambil data statistik desa.'
          );
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false
            );
          }
        }
      };

    fetchStatistik();

    return () => {
      cancelled = true;
    };
  }, [
    tahun,
  ]);

  /*
  |--------------------------------------------------------------------------
  | AGE STATISTICS
  |--------------------------------------------------------------------------
  |
  | Database menyimpan JUMLAH:
  |
  | usia_0_14
  | usia_15_64
  | usia_65_plus
  |
  | Persentase dihitung otomatis di frontend.
  |
  */

  const ageStats =
    useMemo(() => {
      const total =
        Number(
          statistik?.total_penduduk ||
            0
        );

      const usia0_14 =
        Number(
          statistik?.usia_0_14 ||
            0
        );

      const usia15_64 =
        Number(
          statistik?.usia_15_64 ||
            0
        );

      const usia65Plus =
        Number(
          statistik?.usia_65_plus ||
            0
        );

      const totalUsia =
        usia0_14 +
        usia15_64 +
        usia65Plus;

      return {
        total,

        usia0_14,

        usia15_64,

        usia65Plus,

        totalUsia,

        percentage0_14:
          calculatePercentage(
            usia0_14,
            total
          ),

        percentage15_64:
          calculatePercentage(
            usia15_64,
            total
          ),

        percentage65Plus:
          calculatePercentage(
            usia65Plus,
            total
          ),

        difference:
          total -
          totalUsia,
      };
    }, [
      statistik,
    ]);

  /*
  |--------------------------------------------------------------------------
  | GENDER STATISTICS
  |--------------------------------------------------------------------------
  */

  const genderStats =
    useMemo(() => {
      const total =
        Number(
          statistik?.total_penduduk ||
            0
        );

      const laki =
        Number(
          statistik?.total_laki_laki ||
            0
        );

      const perempuan =
        Number(
          statistik?.total_perempuan ||
            0
        );

      return {
        total,

        laki,

        perempuan,

        percentageLaki:
          calculatePercentage(
            laki,
            total
          ),

        percentagePerempuan:
          calculatePercentage(
            perempuan,
            total
          ),

        totalGender:
          laki +
          perempuan,

        difference:
          total -
          (
            laki +
            perempuan
          ),
      };
    }, [
      statistik,
    ]);

  /*
  |--------------------------------------------------------------------------
  | IDM
  |--------------------------------------------------------------------------
  */

  const idmValue =
    useMemo(() => {
      return normalizeIdm(
        statistik?.idm_nilai
      );
    }, [
      statistik?.idm_nilai,
    ]);

  const idmPercentage =
    idmValue === null
      ? 0
      : idmValue * 100;

  /*
  |--------------------------------------------------------------------------
  | LAST UPDATED
  |--------------------------------------------------------------------------
  */

  const lastUpdated =
    statistik?.updated_at;

  const updatedBy =
    statistik?.updated_by?.name;

  const formattedUpdatedAt =
    useMemo(() => {
      if (
        !lastUpdated
      ) {
        return '-';
      }

      const date =
        new Date(
          lastUpdated
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return '-';
      }

      return date.toLocaleString(
        'id-ID',
        {
          dateStyle:
            'long',
          timeStyle:
            'short',
        }
      );
    }, [
      lastUpdated,
    ]);

  /*
  |--------------------------------------------------------------------------
  | AVAILABLE YEARS
  |--------------------------------------------------------------------------
  */

  const availableYears =
    useMemo(() => {
      const currentYear =
        getCurrentYear();

      return Array.from(
        {
          length: 11,
        },
        (
          _,
          index
        ) =>
          currentYear -
          index
      );
    }, []);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="bg-background text-on-surface antialiased flex flex-col min-h-screen">

      <div className="min-h-screen bg-surface flex flex-col">

        <Navbar />

        {/* =========================================================
            MAIN
        ========================================================== */}

        <main className="grow pt-26 pb-xl px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full">

          {/* =======================================================
              HEADER
          ======================================================== */}

          <header className="mb-xl">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

              {/* HEADER TEXT */}

              <div className="min-w-0 flex-1">

                <h1 className="font-display-lg text-display-lg text-on-surface mb-sm">
                  Statistik Desa Sumberporong
                </h1>

                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
                  Transparansi data kependudukan
                  dan sosial Desa Sumberporong
                  berdasarkan data terbaru
                  yang diperbarui oleh
                  pemerintah desa.
                </p>

                {!loading &&
                  statistik && (
                    <div className="mt-md font-label-sm text-label-sm text-outline flex flex-wrap items-center gap-2">

                      <span className="material-symbols-outlined text-[16px]">
                        update
                      </span>

                      <span>
                        Data tahun{' '}

                        <strong className="text-on-surface">
                          {statistik.tahun}
                        </strong>
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        Diperbarui{' '}
                        {formattedUpdatedAt}
                      </span>

                      {updatedBy && (
                        <>
                          <span>
                            •
                          </span>

                          <span>
                            oleh{' '}

                            <strong className="text-on-surface">
                              {updatedBy}
                            </strong>
                          </span>
                        </>
                      )}

                    </div>
                  )}

              </div>

              {/* YEAR SELECT */}

              <div className="w-full lg:w-44 shrink-0">

                <label
                  htmlFor="tahun"
                  className="block text-sm font-semibold text-on-surface mb-2"
                >
                  Tahun Statistik
                </label>

                <select
                  id="tahun"
                  value={tahun}
                  onChange={(
                    event
                  ) =>
                    setTahun(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  disabled={
                    loading
                  }
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 outline-none focus:border-primary"
                >

                  {availableYears.map(
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

          </header>

          {/* =======================================================
              ERROR
          ======================================================== */}

          {!loading &&
            error && (
              <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">

                <div className="flex items-start gap-3">

                  <span className="material-symbols-outlined shrink-0">
                    error
                  </span>

                  <div>

                    <p className="font-semibold">
                      Gagal memuat statistik
                    </p>

                    <p className="text-sm mt-1">
                      {error}
                    </p>

                  </div>

                </div>

              </div>
            )}

          {/* =======================================================
              LOADING
          ======================================================== */}

          {loading && (
            <div className="space-y-6">

              {/* IDM SKELETON */}

              <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant/30">

                <div className="grid grid-cols-1 md:grid-cols-[1fr_20rem] gap-8">

                  <div>

                    <div className="h-7 w-72 bg-surface-container-high rounded animate-pulse mb-4" />

                    <div className="h-4 w-full max-w-xl bg-surface-container-high rounded animate-pulse mb-2" />

                    <div className="h-4 w-5/6 max-w-xl bg-surface-container-high rounded animate-pulse" />

                  </div>

                  <div>

                    <div className="h-14 w-32 bg-surface-container-high rounded animate-pulse mb-4" />

                    <div className="h-10 w-28 bg-surface-container-high rounded-full animate-pulse mx-auto mb-5" />

                    <div className="h-3 w-full bg-surface-container-high rounded-full animate-pulse" />

                  </div>

                </div>

              </div>

              {/* METRICS */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                {Array.from({
                  length: 4,
                }).map(
                  (
                    _,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30"
                    >

                      <div className="w-10 h-10 rounded-xl bg-surface-container-high animate-pulse mb-4" />

                      <div className="h-4 w-28 bg-surface-container-high rounded animate-pulse mb-3" />

                      <div className="h-8 w-24 bg-surface-container-high rounded animate-pulse" />

                    </div>
                  )
                )}

              </div>

              {/* BANSOS */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {Array.from({
                  length: 3,
                }).map(
                  (
                    _,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30"
                    >

                      <div className="h-5 w-24 bg-surface-container-high rounded animate-pulse mb-5" />

                      <div className="h-10 w-24 bg-surface-container-high rounded animate-pulse mb-3" />

                      <div className="h-4 w-48 bg-surface-container-high rounded animate-pulse" />

                    </div>
                  )
                )}

              </div>

            </div>
          )}

          {/* =======================================================
              EMPTY
          ======================================================== */}

          {!loading &&
            !error &&
            !statistik && (
              <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-12 text-center">

                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                  <span className="material-symbols-outlined text-4xl">
                    monitoring
                  </span>

                </div>

                <h2 className="font-headline-md text-2xl font-bold text-on-surface mt-5">
                  Data statistik belum tersedia
                </h2>

                <p className="text-sm text-on-surface-variant mt-2">
                  Belum ada statistik desa
                  untuk tahun {tahun}.
                </p>

              </div>
            )}

          {/* =======================================================
              CONTENT
          ======================================================== */}

          {!loading &&
            !error &&
            statistik && (
              <div className="space-y-xl">

                {/* =================================================
                    IDM
                ================================================== */}

                <section>

                  <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30">

                    <div className="flex flex-col md:flex-row md:items-center gap-8">

                      {/* LEFT */}

                      <div className="flex-1 min-w-0">

                        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                          Indeks Desa Membangun (IDM)
                        </h2>

                        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                          Status pencapaian perkembangan
                          desa berdasarkan nilai
                          Indeks Desa Membangun.
                        </p>

                      </div>

                      {/* RIGHT */}

                      <div className="w-full md:w-80 shrink-0 flex flex-col items-center">

                        <div className="font-display-lg text-display-lg text-primary mb-2">
                          {idmValue !== null
                            ? idmValue.toFixed(
                                2
                              )
                            : '-'}
                        </div>

                        {statistik.idm_status && (
                          <div className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-label-md text-label-md mb-5">
                            Status:{' '}
                            {
                              statistik.idm_status
                            }
                          </div>
                        )}

                        {idmValue !== null && (
                          <>
                            <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">

                              <div
                                className="bg-primary h-3 rounded-full transition-all duration-500"
                                style={{
                                  width: `${idmPercentage}%`,
                                }}
                              />

                            </div>

                            <div className="w-full flex justify-between font-label-sm text-label-sm text-outline mt-2">

                              <span>
                                0.00
                              </span>

                              <span>
                                1.00
                              </span>

                            </div>
                          </>
                        )}

                      </div>

                    </div>

                  </div>

                </section>

                {/* =================================================
                    KEY METRICS
                ================================================== */}

                <section className="grid grid-cols-2 md:grid-cols-4 gap-6">

                  <MetricCard
                    icon="group"
                    label="Total Penduduk"
                    value={formatNumber(
                      statistik.total_penduduk
                    )}
                  />

                  <MetricCard
                    icon="home"
                    label="Kepala Keluarga"
                    value={formatNumber(
                      statistik.total_kk
                    )}
                  />

                  <MetricCard
                    icon="man"
                    label="Laki-laki"
                    value={formatNumber(
                      statistik.total_laki_laki
                    )}
                  />

                  <MetricCard
                    icon="woman"
                    label="Perempuan"
                    value={formatNumber(
                      statistik.total_perempuan
                    )}
                  />

                </section>

                {/* =================================================
                    BANSOS
                ================================================== */}

                <section>

                  <h2 className="font-headline-md text-headline-md text-on-surface mb-5">
                    Penerima Bansos
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <BansosCard
                      title="PKH"
                      icon="family_restroom"
                      value={formatNumber(
                        statistik.total_pkh
                      )}
                    />

                    <BansosCard
                      title="BLT DD"
                      icon="payments"
                      value={formatNumber(
                        statistik.total_blt_dd
                      )}
                    />

                    <BansosCard
                      title="BPNT"
                      icon="local_dining"
                      value={formatNumber(
                        statistik.total_bpnt
                      )}
                    />

                  </div>

                </section>

                {/* =================================================
                    AGE
                ================================================== */}

                <section>

                  <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30">

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">

                      <div className="min-w-0">

                        <h2 className="font-headline-md text-headline-md text-on-surface">
                          Penduduk Berdasarkan Usia
                        </h2>

                        <p className="text-sm text-on-surface-variant mt-1">
                          Persentase dihitung
                          otomatis berdasarkan
                          jumlah penduduk
                          tahun {statistik.tahun}.
                        </p>

                      </div>

                      <span className="text-sm font-semibold text-primary shrink-0">
                        Total:{' '}
                        {formatNumber(
                          ageStats.total
                        )}{' '}
                        jiwa
                      </span>

                    </div>

                    <div className="space-y-6">

                      <AgeBar
                        label="0-14 Tahun"
                        count={
                          ageStats.usia0_14
                        }
                        percentage={
                          ageStats.percentage0_14
                        }
                      />

                      <AgeBar
                        label="15-64 Tahun"
                        count={
                          ageStats.usia15_64
                        }
                        percentage={
                          ageStats.percentage15_64
                        }
                      />

                      <AgeBar
                        label="65+ Tahun"
                        count={
                          ageStats.usia65Plus
                        }
                        percentage={
                          ageStats.percentage65Plus
                        }
                      />

                    </div>

                    {/* AGE VALIDATION */}

                    <div className="mt-7 pt-5 border-t border-outline-variant/20">

                      {ageStats.difference ===
                        0 ? (
                        <div className="flex items-center gap-2 text-sm text-green-700">

                          <span className="material-symbols-outlined text-base">
                            check_circle
                          </span>

                          <span>
                            Jumlah kelompok usia
                            sudah sesuai dengan
                            total penduduk.
                          </span>

                        </div>
                      ) : (
                        <div className="flex items-start gap-2 text-sm text-amber-700">

                          <span className="material-symbols-outlined text-base shrink-0">
                            info
                          </span>

                          <span>
                            Total kelompok usia:{' '}
                            <strong>
                              {formatNumber(
                                ageStats.totalUsia
                              )}
                            </strong>{' '}
                            jiwa, sedangkan total
                            penduduk:{' '}
                            <strong>
                              {formatNumber(
                                ageStats.total
                              )}
                            </strong>{' '}
                            jiwa.
                            {ageStats.difference >
                            0
                              ? ` Masih ada ${formatNumber(
                                  ageStats.difference
                                )} jiwa yang belum masuk kelompok usia.`
                              : ` Jumlah kelompok usia melebihi total penduduk sebesar ${formatNumber(
                                  Math.abs(
                                    ageStats.difference
                                  )
                                )} jiwa.`}
                          </span>

                        </div>
                      )}

                    </div>

                  </div>

                </section>

                {/* =================================================
                    GENDER
                ================================================== */}

                <section>

                  <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30">

                    <div className="mb-6">

                      <h2 className="font-headline-md text-headline-md text-on-surface">
                        Penduduk Berdasarkan Jenis Kelamin
                      </h2>

                      <p className="text-sm text-on-surface-variant mt-1">
                        Komposisi penduduk berdasarkan
                        data kependudukan tahun{' '}
                        {statistik.tahun}.
                      </p>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <GenderCard
                        label="Laki-laki"
                        icon="man"
                        count={
                          genderStats.laki
                        }
                        percentage={
                          genderStats.percentageLaki
                        }
                      />

                      <GenderCard
                        label="Perempuan"
                        icon="woman"
                        count={
                          genderStats.perempuan
                        }
                        percentage={
                          genderStats.percentagePerempuan
                        }
                      />

                    </div>

                    <div className="mt-7 pt-5 border-t border-outline-variant/20">

                      {genderStats.difference ===
                        0 ? (
                        <div className="flex items-center gap-2 text-sm text-green-700">

                          <span className="material-symbols-outlined text-base">
                            check_circle
                          </span>

                          <span>
                            Jumlah laki-laki dan
                            perempuan sesuai dengan
                            total penduduk.
                          </span>

                        </div>
                      ) : (
                        <div className="flex items-start gap-2 text-sm text-amber-700">

                          <span className="material-symbols-outlined text-base shrink-0">
                            info
                          </span>

                          <span>
                            Jumlah laki-laki + perempuan:{' '}
                            <strong>
                              {formatNumber(
                                genderStats.totalGender
                              )}
                            </strong>{' '}
                            jiwa, sedangkan total
                            penduduk:{' '}
                            <strong>
                              {formatNumber(
                                genderStats.total
                              )}
                            </strong>{' '}
                            jiwa.
                            {genderStats.difference >
                            0
                              ? ` Masih ada ${formatNumber(
                                  genderStats.difference
                                )} jiwa yang belum terdata pada kategori jenis kelamin.`
                              : ` Jumlah jenis kelamin melebihi total penduduk sebesar ${formatNumber(
                                  Math.abs(
                                    genderStats.difference
                                  )
                                )} jiwa.`}
                          </span>

                        </div>
                      )}

                    </div>

                  </div>

                </section>

                {/* =================================================
                    TRANSPARENCY
                ================================================== */}

                <section>

                  <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-5 md:p-6">

                    <div className="flex items-start gap-3">

                      <span className="material-symbols-outlined text-primary shrink-0">
                        info
                      </span>

                      <div>

                        <h3 className="font-semibold text-on-surface">
                          Tentang data statistik
                        </h3>

                        <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                          Data yang ditampilkan
                          merupakan data statistik
                          yang dimasukkan dan
                          diperbarui oleh Pemerintah
                          Desa Sumberporong.
                          Jumlah kelompok usia dan
                          jenis kelamin disimpan sebagai
                          jumlah penduduk, kemudian
                          persentasenya dihitung otomatis
                          berdasarkan total penduduk
                          pada tahun yang dipilih.
                        </p>

                      </div>

                    </div>

                  </div>

                </section>

              </div>
            )}

        </main>

        <Footer />

      </div>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| METRIC CARD
|--------------------------------------------------------------------------
*/

const MetricCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-center items-center text-center">

      <span className="material-symbols-outlined text-primary text-[32px] mb-3">
        {icon}
      </span>

      <span className="font-body-md text-body-md text-on-surface-variant mb-1">
        {label}
      </span>

      <span className="font-headline-lg text-headline-lg text-on-surface">
        {value}
      </span>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| BANSOS CARD
|--------------------------------------------------------------------------
*/

const BansosCard = ({
  title,
  icon,
  value,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30">

      <div className="flex items-center justify-between mb-4">

        <span className="font-headline-md text-headline-md text-on-surface">
          {title}
        </span>

        <span className="material-symbols-outlined text-primary">
          {icon}
        </span>

      </div>

      <div className="font-display-lg text-display-lg text-on-surface mb-1">
        {value}
      </div>

      <p className="font-body-md text-body-md text-on-surface-variant">
        Keluarga Penerima Manfaat
      </p>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| AGE BAR
|--------------------------------------------------------------------------
*/

const AgeBar = ({
  label,
  count,
  percentage,
}) => {
  const safePercentage =
    Math.min(
      Math.max(
        Number(
          percentage
        ) || 0,
        0
      ),
      100
    );

  return (
    <div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">

        <span className="font-label-md text-label-md text-on-surface-variant">
          {label}
        </span>

        <span className="font-label-md text-label-md font-semibold text-on-surface">

          {formatPercentage(
            safePercentage
          )}

          {' '}

          <span className="font-normal text-on-surface-variant">
            (
            {formatNumber(
              count
            )}
            )
          </span>

        </span>

      </div>

      <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">

        <div
          className="bg-primary h-3 rounded-full transition-all duration-500"
          style={{
            width: `${safePercentage}%`,
          }}
        />

      </div>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| GENDER CARD
|--------------------------------------------------------------------------
*/

const GenderCard = ({
  label,
  icon,
  count,
  percentage,
}) => {
  const safePercentage =
    Math.min(
      Math.max(
        Number(
          percentage
        ) || 0,
        0
      ),
      100
    );

  return (
    <div className="rounded-2xl bg-surface-container-low p-6">

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">

        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">

          <span className="material-symbols-outlined text-2xl">
            {icon}
          </span>

        </div>

        <div className="min-w-0">

          <p className="text-sm text-on-surface-variant">
            {label}
          </p>

          <p className="text-2xl font-bold text-on-surface mt-1">
            {formatNumber(
              count
            )}
          </p>

        </div>

        <div className="sm:ml-auto text-left sm:text-right">

          <p className="text-2xl font-bold text-primary">
            {formatPercentage(
              safePercentage
            )}
          </p>

          <p className="text-xs text-on-surface-variant">
            dari penduduk
          </p>

        </div>

      </div>

      <div className="mt-5 w-full bg-surface-container rounded-full h-3 overflow-hidden">

        <div
          className="bg-primary h-3 rounded-full transition-all duration-500"
          style={{
            width: `${safePercentage}%`,
          }}
        />

      </div>

    </div>
  );
};

export default StatistikPage;
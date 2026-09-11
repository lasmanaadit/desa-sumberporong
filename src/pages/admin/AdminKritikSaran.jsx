// src/pages/admin/AdminKritikSaran.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import api from '../../api/axios';

/*
|--------------------------------------------------------------------------
| CONSTANT
|--------------------------------------------------------------------------
*/

const ITEMS_PER_PAGE = 5;

/*
|--------------------------------------------------------------------------
| HELPER
|--------------------------------------------------------------------------
*/

const formatTanggal = (value) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );
};

const formatTanggalLengkap = (value) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );
};

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

const AdminKritikSaran = () => {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    kritikList,
    setKritikList,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    success,
    setSuccess,
  ] = useState('');

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    selectedKritik,
    setSelectedKritik,
  ] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | FETCH DATA
  |--------------------------------------------------------------------------
  */

  const fetchKritikSaran = useCallback(
    async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(
          '/admin/kritik-saran'
        );

        const responseData =
          response.data?.data;

        setKritikList(
          Array.isArray(
            responseData
          )
            ? responseData
            : []
        );
      } catch (err) {
        console.error(
          'Gagal mengambil kritik dan saran:',
          err
        );

        setKritikList([]);

        setError(
          err.response?.data
            ?.message ||
            'Gagal mengambil daftar kritik dan saran.'
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | LOAD AWAL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchKritikSaran();
  }, [
    fetchKritikSaran,
  ]);

  /*
  |--------------------------------------------------------------------------
  | SORT
  |--------------------------------------------------------------------------
  */

  const sortedKritik =
    useMemo(() => {
      return [
        ...kritikList,
      ].sort(
        (
          a,
          b
        ) => {
          const dateA =
            new Date(
              a.created_at ||
                0
            ).getTime();

          const dateB =
            new Date(
              b.created_at ||
                0
            ).getTime();

          return (
            dateB -
            dateA
          );
        }
      );
    }, [
      kritikList,
    ]);

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const totalPages =
    Math.ceil(
      sortedKritik.length /
        ITEMS_PER_PAGE
    );

  const safeCurrentPage =
    Math.min(
      Math.max(
        currentPage,
        1
      ),
      Math.max(
        totalPages,
        1
      )
    );

  const startIndex =
    (
      safeCurrentPage -
      1
    ) *
    ITEMS_PER_PAGE;

  const currentItems =
    sortedKritik.slice(
      startIndex,
      startIndex +
        ITEMS_PER_PAGE
    );

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (
    item
  ) => {
    if (
      !item?.id ||
      deletingId
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Apakah Anda yakin ingin menghapus kritik dan saran dari "${item.nama}"?`
      );

    if (!confirmed) {
      return;
    }

    setError('');
    setSuccess('');
    setDeletingId(item.id);

    try {
      const response =
        await api.delete(
          `/admin/kritik-saran/${item.id}`
        );

      setSuccess(
        response.data
          ?.message ||
          'Kritik dan saran berhasil dihapus.'
      );

      setKritikList(
        (
          previous
        ) =>
          previous.filter(
            (
              data
            ) =>
              data.id !==
              item.id
          )
      );

      if (
        selectedKritik?.id ===
        item.id
      ) {
        setSelectedKritik(
          null
        );
      }
    } catch (err) {
      console.error(
        'Gagal menghapus kritik dan saran:',
        err
      );

      setError(
        err.response?.data
          ?.message ||
          'Kritik dan saran gagal dihapus.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PAGE CORRECTION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage >
        totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }

    if (
      totalPages === 0 &&
      currentPage !==
        1
    ) {
      setCurrentPage(1);
    }
  }, [
    totalPages,
    currentPage,
  ]);

  /*
  |--------------------------------------------------------------------------
  | PAGINATION BUTTONS
  |--------------------------------------------------------------------------
  */

  const paginationPages =
    useMemo(() => {
      if (
        totalPages <= 1
      ) {
        return [];
      }

      return Array.from(
        {
          length:
            totalPages,
        },
        (
          _,
          index
        ) =>
          index + 1
      );
    }, [
      totalPages,
    ]);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="w-full min-w-0">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div className="min-w-0">

          <h1 className="font-headline-lg text-on-background">
            Kritik & Saran
          </h1>

          <p className="font-body-md text-on-surface-variant mt-1">
            Kelola masukan, kritik, dan saran dari masyarakat.
          </p>

        </div>

        <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-primary">

          <span className="material-symbols-outlined">
            forum
          </span>

          <span className="text-sm font-semibold whitespace-nowrap">
            {kritikList.length} Masukan
          </span>

        </div>

      </div>

      {/* =========================================================
          ERROR
      ========================================================== */}

      {error && (
        <div className="w-full mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <div className="flex w-full items-start gap-3">

            <span className="material-symbols-outlined shrink-0">
              error
            </span>

            <span className="wrap-break-word">
              {error}
            </span>

          </div>

        </div>
      )}

      {/* =========================================================
          SUCCESS
      ========================================================== */}

      {success && (
        <div className="w-full mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

          <div className="flex w-full items-start gap-3">

            <span className="material-symbols-outlined shrink-0">
              check_circle
            </span>

            <span className="wrap-break-word">
              {success}
            </span>

          </div>

        </div>
      )}

      {/* =========================================================
          CONTENT CARD
      ========================================================== */}

      <div className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">

        {/* =======================================================
            LOADING
        ======================================================== */}

        {loading && (
          <div className="w-full p-6 space-y-4">

            {Array.from({
              length: 5,
            }).map(
              (
                _,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="w-full h-14 rounded-xl bg-surface-container-low animate-pulse"
                />
              )
            )}

          </div>
        )}

        {/* =======================================================
            EMPTY
        ======================================================== */}

        {!loading &&
          currentItems.length ===
            0 && (
            <div className="w-full px-6 py-20">

              <div className="w-full flex flex-col items-center justify-center text-center">

                <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                  <span className="material-symbols-outlined text-4xl">
                    forum
                  </span>

                </div>

                <h3 className="font-headline-md text-xl text-on-surface mt-5">
                  Belum ada kritik dan saran
                </h3>

                <p className="mt-3 w-full max-w-2xl text-center text-sm leading-6 text-on-surface-variant">
                  Masukan dari masyarakat akan muncul di halaman ini setelah dikirim melalui formulir publik.
                </p>

              </div>

            </div>
          )}

        {/* =======================================================
            TABLE
        ======================================================== */}

        {!loading &&
          currentItems.length >
            0 && (
            <div className="w-full overflow-x-auto">

              <table className="w-full min-w-225">

                <thead className="bg-surface-container-low border-b border-outline-variant/20">

                  <tr>

                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant w-16">
                      No
                    </th>

                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant min-w-40">
                      Nama Lengkap
                    </th>

                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant min-w-50">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant min-w-80">
                      Pesan / Saran
                    </th>

                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant min-w-40">
                      Tanggal
                    </th>

                    <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant min-w-50">
                      Aksi
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {currentItems.map(
                    (
                      item,
                      index
                    ) => (
                      <tr
                        key={
                          item.id
                        }
                        className="border-b border-outline-variant/10 hover:bg-primary/3 transition-colors"
                      >

                        {/* =================================================
                            NO
                        ================================================== */}

                        <td className="px-6 py-4 align-top">

                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container-low text-sm font-semibold text-on-surface">
                            {
                              startIndex +
                              index +
                              1
                            }
                          </span>

                        </td>

                        {/* =================================================
                            NAMA
                        ================================================== */}

                        <td className="px-6 py-4 align-top">

                          <p className="font-semibold text-on-surface wrap-break-word">
                            {
                              item.nama ||
                              '-'
                            }
                          </p>

                        </td>

                        {/* =================================================
                            EMAIL
                        ================================================== */}

                        <td className="px-6 py-4 align-top">

                          {item.email ? (
                            <a
                              href={`mailto:${item.email}`}
                              className="text-sm text-primary hover:underline wrap-break-word"
                            >
                              {
                                item.email
                              }
                            </a>
                          ) : (
                            <span className="text-sm text-on-surface-variant">
                              -
                            </span>
                          )}

                        </td>

                        {/* =================================================
                            PESAN
                        ================================================== */}

                        <td className="px-6 py-4 align-top">

                          <div className="w-full max-w-105">

                            <p className="text-sm leading-relaxed text-on-surface line-clamp-3 wrap-break-word">
                              {
                                item.pesan ||
                                '-'
                              }
                            </p>

                            {item.pesan &&
                              item.pesan.length >
                                120 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedKritik(
                                      item
                                    )
                                  }
                                  className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-primary hover:underline"
                                >

                                  Baca selengkapnya

                                  <span className="material-symbols-outlined text-sm">
                                    arrow_forward
                                  </span>

                                </button>
                              )}

                          </div>

                        </td>

                        {/* =================================================
                            TANGGAL
                        ================================================== */}

                        <td className="px-6 py-4 align-top">

                          <div className="flex flex-col">

                            <span className="text-sm font-medium text-on-surface whitespace-nowrap">
                              {
                                formatTanggal(
                                  item.created_at
                                )
                              }
                            </span>

                            {item.created_at && (
                              <span className="text-xs text-on-surface-variant mt-1 whitespace-nowrap">
                                {new Date(
                                  item.created_at
                                ).toLocaleTimeString(
                                  'id-ID',
                                  {
                                    hour: '2-digit',
                                    minute:
                                      '2-digit',
                                  }
                                )}
                              </span>
                            )}

                          </div>

                        </td>

                        {/* =================================================
                            AKSI
                        ================================================== */}

                        <td className="px-6 py-4 align-top">

                          <div className="flex items-center justify-end gap-2">

                            {/* LIHAT */}

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedKritik(
                                  item
                                )
                              }
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant/30 text-sm font-medium text-on-surface-variant hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors whitespace-nowrap"
                            >

                              <span className="material-symbols-outlined text-base">
                                visibility
                              </span>

                              Lihat

                            </button>

                            {/* HAPUS */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  item
                                )
                              }
                              disabled={
                                deletingId ===
                                item.id
                              }
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm font-medium hover:bg-red-100 hover:border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >

                              {deletingId ===
                              item.id ? (
                                <>
                                  <span className="material-symbols-outlined text-base animate-spin">
                                    progress_activity
                                  </span>

                                  Menghapus...
                                </>
                              ) : (
                                <>
                                  <span className="material-symbols-outlined text-base">
                                    delete
                                  </span>

                                  Hapus
                                </>
                              )}

                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

      </div>

      {/* =========================================================
          PAGINATION
      ========================================================== */}

      {!loading &&
        totalPages >
          1 && (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-5">

            <p className="text-sm text-on-surface-variant">

              Menampilkan{' '}

              <span className="font-semibold text-on-surface">
                {
                  startIndex +
                  1
                }
              </span>

              {' - '}

              <span className="font-semibold text-on-surface">
                {Math.min(
                  startIndex +
                    ITEMS_PER_PAGE,
                  sortedKritik.length
                )}
              </span>

              {' dari '}

              <span className="font-semibold text-on-surface">
                {
                  sortedKritik.length
                }
              </span>

              {' masukan'}

            </p>

            <div className="flex items-center gap-2">

              {/* PREVIOUS */}

              <button
                type="button"
                disabled={
                  safeCurrentPage ===
                  1
                }
                onClick={() =>
                  setCurrentPage(
                    (
                      page
                    ) =>
                      page -
                      1
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant/30 text-sm font-medium text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >

                <span className="material-symbols-outlined text-base">
                  chevron_left
                </span>

                Sebelumnya

              </button>

              {/* NUMBER */}

              <div className="hidden sm:flex items-center gap-1">

                {paginationPages.map(
                  (
                    page
                  ) => (
                    <button
                      key={
                        page
                      }
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                      className={[
                        'w-9',
                        'h-9',
                        'rounded-lg',
                        'text-sm',
                        'font-semibold',
                        'transition-colors',

                        safeCurrentPage ===
                        page
                          ? 'bg-primary text-on-primary'
                          : 'text-on-surface-variant hover:bg-primary/10 hover:text-primary',
                      ].join(
                        ' '
                      )}
                    >
                      {
                        page
                      }
                    </button>
                  )
                )}

              </div>

              {/* NEXT */}

              <button
                type="button"
                disabled={
                  safeCurrentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (
                      page
                    ) =>
                      page +
                      1
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant/30 text-sm font-medium text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >

                Berikutnya

                <span className="material-symbols-outlined text-base">
                  chevron_right
                </span>

              </button>

            </div>

          </div>
        )}

      {/* =========================================================
          DETAIL MODAL
      ========================================================== */}

      {selectedKritik && (
        <div
          className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() =>
            setSelectedKritik(
              null
            )
          }
        >

          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-container-lowest rounded-2xl shadow-2xl"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                HEADER MODAL
            ================================================== */}

            <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-outline-variant/20">

              <div className="min-w-0">

                <h2 className="font-headline-md text-xl text-on-surface">
                  Detail Kritik & Saran
                </h2>

                <p className="text-xs text-on-surface-variant mt-1">
                  Masukan dari masyarakat
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedKritik(
                    null
                  )
                }
                className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Tutup"
                title="Tutup"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </div>

            {/* =================================================
                ISI MODAL
            ================================================== */}

            <div className="p-6 space-y-5">

              {/* NAMA + EMAIL */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="rounded-xl bg-surface-container-low p-4 min-w-0">

                  <p className="text-xs text-on-surface-variant">
                    Nama Lengkap
                  </p>

                  <p className="text-sm font-semibold text-on-surface mt-1 wrap-break-word">
                    {
                      selectedKritik.nama ||
                      '-'
                    }
                  </p>

                </div>

                <div className="rounded-xl bg-surface-container-low p-4 min-w-0">

                  <p className="text-xs text-on-surface-variant">
                    Email
                  </p>

                  {selectedKritik.email ? (
                    <a
                      href={`mailto:${selectedKritik.email}`}
                      className="block text-sm font-semibold text-primary hover:underline mt-1 wrap-break-word"
                    >
                      {
                        selectedKritik.email
                      }
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-on-surface mt-1">
                      -
                    </p>
                  )}

                </div>

              </div>

              {/* TANGGAL */}

              <div className="rounded-xl bg-surface-container-low p-4">

                <p className="text-xs text-on-surface-variant">
                  Tanggal Dikirim
                </p>

                <p className="text-sm font-semibold text-on-surface mt-1">
                  {
                    formatTanggalLengkap(
                      selectedKritik.created_at
                    )
                  }
                </p>

              </div>

              {/* PESAN */}

              <div className="rounded-xl border border-outline-variant/20 bg-surface p-5">

                <div className="flex items-center gap-2 mb-3">

                  <span className="material-symbols-outlined text-primary">
                    format_quote
                  </span>

                  <p className="text-sm font-semibold text-on-surface">
                    Pesan / Saran
                  </p>

                </div>

                <p className="text-sm leading-7 text-on-surface-variant whitespace-pre-wrap wrap-break-word">
                  {
                    selectedKritik.pesan ||
                    '-'
                  }
                </p>

              </div>

            </div>

            {/* =================================================
                FOOTER MODAL
            ================================================== */}

            <div className="flex flex-col sm:flex-row justify-end gap-3 px-6 py-5 border-t border-outline-variant/20">

              {/* HAPUS */}

              <button
                type="button"
                onClick={() =>
                  handleDelete(
                    selectedKritik
                  )
                }
                disabled={
                  deletingId ===
                  selectedKritik.id
                }
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {deletingId ===
                selectedKritik.id ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">
                      progress_activity
                    </span>

                    Menghapus...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">
                      delete
                    </span>

                    Hapus
                  </>
                )}

              </button>

              {/* TUTUP */}

              <button
                type="button"
                onClick={() =>
                  setSelectedKritik(
                    null
                  )
                }
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant font-semibold hover:bg-surface-container-low transition-colors"
              >

                Tutup

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminKritikSaran;
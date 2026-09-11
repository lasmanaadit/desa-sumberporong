// src/pages/superadmin/SuperAdminAuditLogs.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createPortal,
} from 'react-dom';

import {
  motion,
} from 'framer-motion';

import api from '../../api/axios';

/*
|--------------------------------------------------------------------------
| CONSTANT - PER PAGE
|--------------------------------------------------------------------------
*/

const DEFAULT_PER_PAGE = 30;

/*
|--------------------------------------------------------------------------
| ACTION LABEL
|--------------------------------------------------------------------------
*/

const actionLabels = {
  login: 'Login',
  logout: 'Logout',

  create: 'Membuat',
  update: 'Memperbarui',
  delete: 'Menghapus',

  update_role: 'Ubah Role',
  update_status: 'Ubah Status',

  password_reset: 'Reset Password',

  approve: 'Menyetujui',
  reject: 'Menolak',

  publish: 'Menerbitkan',
  unpublish: 'Membatalkan Publikasi',

  activate: 'Mengaktifkan',
  deactivate: 'Menonaktifkan',

  upload: 'Mengunggah',
  download: 'Mengunduh',

  response: 'Memberikan Respon',
};

/*
|--------------------------------------------------------------------------
| MODULE LABEL
|--------------------------------------------------------------------------
*/

const moduleLabels = {
  authentication: 'Autentikasi',
  user_management: 'Manajemen User',

  pengajuan_ktp: 'Pengajuan KTP',
  pengajuan_sku: 'Pengajuan SKU',
  pengajuan_umkm: 'Pengajuan UMKM',

  pengaduan: 'Pengaduan',
};

/*
|--------------------------------------------------------------------------
| ACTION COLORS
|--------------------------------------------------------------------------
*/

const actionColors = {
  login:
    'bg-green-100 text-green-700',

  logout:
    'bg-surface-container text-on-surface-variant',

  create:
    'bg-green-100 text-green-700',

  update:
    'bg-amber-100 text-amber-700',

  delete:
    'bg-red-100 text-red-700',

  update_role:
    'bg-purple-100 text-purple-700',

  update_status:
    'bg-blue-100 text-blue-700',

  password_reset:
    'bg-indigo-100 text-indigo-700',

  approve:
    'bg-green-100 text-green-700',

  reject:
    'bg-red-100 text-red-700',

  publish:
    'bg-sky-100 text-sky-700',

  unpublish:
    'bg-slate-100 text-slate-700',

  activate:
    'bg-green-100 text-green-700',

  deactivate:
    'bg-red-100 text-red-700',

  upload:
    'bg-blue-100 text-blue-700',

  download:
    'bg-indigo-100 text-indigo-700',

  response:
    'bg-purple-100 text-purple-700',
};

/*
|--------------------------------------------------------------------------
| MODULE OPTIONS
|--------------------------------------------------------------------------
*/

const moduleOptions = [
  {
    value: 'authentication',
    label: 'Autentikasi',
  },
  {
    value: 'user_management',
    label: 'Manajemen User',
  },
  {
    value: 'pengajuan_ktp',
    label: 'Pengajuan KTP',
  },
  {
    value: 'pengajuan_sku',
    label: 'Pengajuan SKU',
  },
  {
    value: 'pengajuan_umkm',
    label: 'Pengajuan UMKM',
  },
  {
    value: 'pengaduan',
    label: 'Pengaduan',
  },
];

/*
|--------------------------------------------------------------------------
| ACTION OPTIONS
|--------------------------------------------------------------------------
*/

const actionOptions = [
  {
    value: 'login',
    label: 'Login',
  },
  {
    value: 'logout',
    label: 'Logout',
  },
  {
    value: 'create',
    label: 'Membuat',
  },
  {
    value: 'update',
    label: 'Memperbarui',
  },
  {
    value: 'delete',
    label: 'Menghapus',
  },
  {
    value: 'update_role',
    label: 'Ubah Role',
  },
  {
    value: 'update_status',
    label: 'Ubah Status',
  },
  {
    value: 'password_reset',
    label: 'Reset Password',
  },
  {
    value: 'approve',
    label: 'Menyetujui',
  },
  {
    value: 'reject',
    label: 'Menolak',
  },
  {
    value: 'publish',
    label: 'Menerbitkan',
  },
  {
    value: 'unpublish',
    label: 'Membatalkan Publikasi',
  },
  {
    value: 'activate',
    label: 'Mengaktifkan',
  },
  {
    value: 'deactivate',
    label: 'Menonaktifkan',
  },
  {
    value: 'upload',
    label: 'Mengunggah',
  },
  {
    value: 'download',
    label: 'Mengunduh',
  },
  {
    value: 'response',
    label: 'Memberikan Respon',
  },
];

/*
|--------------------------------------------------------------------------
| HELPER - FORMAT DATE
|--------------------------------------------------------------------------
*/

const formatDate = (
  value
) => {
  if (!value) {
    return '-';
  }

  const date =
    new Date(value);

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
        'medium',
      timeStyle:
        'short',
    }
  );
};

/*
|--------------------------------------------------------------------------
| HELPER - NORMALIZE OBJECT
|--------------------------------------------------------------------------
*/

const normalizeObject = (
  value
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return {};
  }

  if (
    typeof value === 'object'
  ) {
    return value;
  }

  if (
    typeof value === 'string'
  ) {
    try {
      const parsed =
        JSON.parse(value);

      if (
        parsed &&
        typeof parsed === 'object'
      ) {
        return parsed;
      }
    } catch {
      return {
        value,
      };
    }
  }

  return {
    value,
  };
};

/*
|--------------------------------------------------------------------------
| HELPER - FORMAT OBJECT VALUE
|--------------------------------------------------------------------------
*/

const formatObjectValue = (
  value
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return '-';
  }

  if (
    typeof value === 'object'
  ) {
    return JSON.stringify(
      value,
      null,
      2
    );
  }

  return String(value);
};

/*
|--------------------------------------------------------------------------
| HELPER - DOWNLOAD BLOB
|--------------------------------------------------------------------------
*/

const downloadBlob = (
  blob,
  filename
) => {
  const url =
    window.URL.createObjectURL(
      blob
    );

  const link =
    document.createElement('a');

  link.href =
    url;

  link.download =
    filename;

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  window.URL.revokeObjectURL(
    url
  );
};

/*
|--------------------------------------------------------------------------
| HELPER - BACKUP FILENAME
|--------------------------------------------------------------------------
*/

const createBackupFilename =
  () => {
    const now =
      new Date();

    const year =
      now.getFullYear();

    const month =
      String(
        now.getMonth() + 1
      ).padStart(
        2,
        '0'
      );

    const day =
      String(
        now.getDate()
      ).padStart(
        2,
        '0'
      );

    const hours =
      String(
        now.getHours()
      ).padStart(
        2,
        '0'
      );

    const minutes =
      String(
        now.getMinutes()
      ).padStart(
        2,
        '0'
      );

    const seconds =
      String(
        now.getSeconds()
      ).padStart(
        2,
        '0'
      );

    return `audit-log-backup-${year}-${month}-${day}-${hours}${minutes}${seconds}.xlsx`;
  };

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const SuperAdminAuditLogs = () => {
  /*
  |--------------------------------------------------------------------------
  | DATA
  |--------------------------------------------------------------------------
  */

  const [
    logs,
    setLogs,
  ] = useState([]);

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    detailLoading,
    setDetailLoading,
  ] = useState(false);

  const [
    backupLoading,
    setBackupLoading,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  const [
    error,
    setError,
  ] = useState('');

  const [
    detailError,
    setDetailError,
  ] = useState('');

  /*
  |--------------------------------------------------------------------------
  | SUCCESS
  |--------------------------------------------------------------------------
  */

  const [
    success,
    setSuccess,
  ] = useState('');

  /*
  |--------------------------------------------------------------------------
  | DETAIL
  |--------------------------------------------------------------------------
  */

  const [
    selectedLog,
    setSelectedLog,
  ] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | SELECTED LOGS
  |--------------------------------------------------------------------------
  */

  const [
    selectedIds,
    setSelectedIds,
  ] = useState([]);

  /*
  |--------------------------------------------------------------------------
  | MANAGEMENT MODAL
  |--------------------------------------------------------------------------
  */

  const [
    manageModalOpen,
    setManageModalOpen,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    moduleFilter,
    setModuleFilter,
  ] = useState('');

  const [
    actionFilter,
    setActionFilter,
  ] = useState('');

  const [
    userIdFilter,
    setUserIdFilter,
  ] = useState('');

  const [
    dateFrom,
    setDateFrom,
  ] = useState('');

  const [
    dateTo,
    setDateTo,
  ] = useState('');

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const [
    pagination,
    setPagination,
  ] = useState({
    current_page: 1,
    last_page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
  });

  /*
  |--------------------------------------------------------------------------
  | CURRENT FILTER PARAMS
  |--------------------------------------------------------------------------
  |
  | Semua request selain initial request menggunakan state filter
  | yang sedang aktif.
  |
  */

  const currentFilterParams =
    useMemo(
      () => ({
        search:
          search.trim() ||
          undefined,

        module:
          moduleFilter ||
          undefined,

        action:
          actionFilter ||
          undefined,

        user_id:
          userIdFilter.trim() ||
          undefined,

        date_from:
          dateFrom ||
          undefined,

        date_to:
          dateTo ||
          undefined,
      }),
      [
        search,
        moduleFilter,
        actionFilter,
        userIdFilter,
        dateFrom,
        dateTo,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | FETCH LOGS
  |--------------------------------------------------------------------------
  |
  | Fungsi ini dibuat stabil.
  | Perubahan input filter tidak langsung men-trigger request.
  | Request hanya dilakukan melalui:
  | - initial load
  | - Terapkan Filter
  | - Reset Filter
  | - pagination
  | - refresh
  |
  */

  const fetchLogs =
    useCallback(
      async (
        page = 1,
        customFilters = {}
      ) => {
        setLoading(true);

        setError('');

        try {
          const params = {
            page,

            per_page:
              pagination.per_page ||
              DEFAULT_PER_PAGE,

            ...customFilters,
          };

          const response =
            await api.get(
              '/superadmin/audit-logs',
              {
                params,
              }
            );

          const paginator =
            response.data?.data ||
            {};

          const data =
            Array.isArray(
              paginator.data
            )
              ? paginator.data
              : [];

          setLogs(data);

          setPagination({
            current_page:
              paginator.current_page ||
              page,

            last_page:
              paginator.last_page ||
              1,

            per_page:
              paginator.per_page ||
              DEFAULT_PER_PAGE,

            total:
              paginator.total ||
              0,
          });

          setSelectedIds([]);

          setManageModalOpen(
            false
          );
        } catch (
          err
        ) {
          console.error(
            'Gagal mengambil audit log:',
            err
          );

          setLogs([]);

          setError(
            err.response?.data?.message ||
            err.message ||
            'Gagal mengambil audit log.'
          );
        } finally {
          setLoading(false);
        }
      },
      [
        pagination.per_page,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchLogs(
      1,
      {
        search: undefined,
        module: undefined,
        action: undefined,
        user_id: undefined,
        date_from: undefined,
        date_to: undefined,
      }
    );
  }, [fetchLogs]);

  /*
  |--------------------------------------------------------------------------
  | SUCCESS AUTO CLEAR
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timer =
      window.setTimeout(
        () => {
          setSuccess('');
        },
        4000
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    success,
  ]);

  /*
  |--------------------------------------------------------------------------
  | BODY SCROLL LOCK
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const modalOpen =
      Boolean(
        manageModalOpen ||
        selectedLog ||
        detailLoading ||
        detailError
      );

    if (!modalOpen) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    manageModalOpen,
    selectedLog,
    detailLoading,
    detailError,
  ]);

  /*
  |--------------------------------------------------------------------------
  | ESC
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleKeyDown =
      (
        event
      ) => {
        if (
          event.key !==
          'Escape'
        ) {
          return;
        }

        if (
          backupLoading
        ) {
          return;
        }

        setSelectedLog(null);

        setDetailError('');

        setManageModalOpen(
          false
        );
      };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [
    backupLoading,
  ]);

  /*
  |--------------------------------------------------------------------------
  | APPLY FILTER
  |--------------------------------------------------------------------------
  */

  const handleApplyFilter =
    () => {
      fetchLogs(
        1,
        currentFilterParams
      );
    };

  /*
  |--------------------------------------------------------------------------
  | RESET FILTER
  |--------------------------------------------------------------------------
  */

  const handleResetFilter =
    () => {
      setSearch('');

      setModuleFilter('');

      setActionFilter('');

      setUserIdFilter('');

      setDateFrom('');

      setDateTo('');

      fetchLogs(
        1,
        {
          search: undefined,
          module: undefined,
          action: undefined,
          user_id: undefined,
          date_from: undefined,
          date_to: undefined,
        }
      );
    };

  /*
  |--------------------------------------------------------------------------
  | PAGE CHANGE
  |--------------------------------------------------------------------------
  */

  const handlePageChange =
    (
      page
    ) => {
      if (
        page < 1 ||
        page >
          pagination.last_page ||
        page ===
          pagination.current_page
      ) {
        return;
      }

      fetchLogs(
        page,
        currentFilterParams
      );
    };

  /*
  |--------------------------------------------------------------------------
  | PAGINATION PAGES
  |--------------------------------------------------------------------------
  */

  const paginationPages =
    useMemo(() => {
      const total =
        pagination.last_page;

      const current =
        pagination.current_page;

      if (
        total <= 1
      ) {
        return [];
      }

      const pages = [];

      const start =
        Math.max(
          1,
          current - 2
        );

      const end =
        Math.min(
          total,
          current + 2
        );

      if (
        start > 1
      ) {
        pages.push(1);
      }

      if (
        start > 2
      ) {
        pages.push(
          '...-start'
        );
      }

      for (
        let page = start;
        page <= end;
        page += 1
      ) {
        pages.push(page);
      }

      if (
        end <
        total - 1
      ) {
        pages.push(
          '...-end'
        );
      }

      if (
        end <
        total
      ) {
        pages.push(total);
      }

      return pages;
    }, [
      pagination.current_page,
      pagination.last_page,
    ]);

  /*
  |--------------------------------------------------------------------------
  | VIEW DETAIL
  |--------------------------------------------------------------------------
  */

  const handleViewDetail =
    async (
      auditLogId
    ) => {
      setDetailLoading(true);

      setDetailError('');

      setSelectedLog(null);

      try {
        const response =
          await api.get(
            `/superadmin/audit-logs/${auditLogId}`
          );

        setSelectedLog(
          response.data?.data ||
            null
        );
      } catch (
        err
      ) {
        console.error(
          'Detail audit log gagal diambil:',
          err
        );

        setDetailError(
          err.response?.data?.message ||
          err.message ||
          'Detail audit log gagal diambil.'
        );
      } finally {
        setDetailLoading(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | SELECTION
  |--------------------------------------------------------------------------
  */

  const toggleSelection =
    (
      logId
    ) => {
      setSelectedIds(
        (
          previous
        ) => {
          if (
            previous.includes(
              logId
            )
          ) {
            return previous.filter(
              (
                id
              ) =>
                id !==
                logId
            );
          }

          return [
            ...previous,
            logId,
          ];
        }
      );
    };

  /*
  |--------------------------------------------------------------------------
  | SELECT ALL CURRENT PAGE
  |--------------------------------------------------------------------------
  */

  const allCurrentPageSelected =
    logs.length >
      0 &&
    logs.every(
      (
        log
      ) =>
        selectedIds.includes(
          log.id
        )
    );

  const toggleSelectAll =
    () => {
      if (
        allCurrentPageSelected
      ) {
        setSelectedIds(
          (
            previous
          ) =>
            previous.filter(
              (
                id
              ) =>
                !logs.some(
                  (
                    log
                  ) =>
                    log.id ===
                    id
                )
            )
        );

        return;
      }

      setSelectedIds(
        (
          previous
        ) => {
          const next =
            new Set(
              previous
            );

          logs.forEach(
            (
              log
            ) => {
              next.add(
                log.id
              );
            }
          );

          return Array.from(
            next
          );
        }
      );
    };

  /*
  |--------------------------------------------------------------------------
  | OPEN MANAGEMENT
  |--------------------------------------------------------------------------
  */

  const openManageModal =
    () => {
      if (
        selectedIds.length ===
          0 ||
        backupLoading
      ) {
        return;
      }

      setManageModalOpen(
        true
      );
    };

  /*
  |--------------------------------------------------------------------------
  | BACKUP + DELETE
  |--------------------------------------------------------------------------
  */

  const handleBackupDelete =
    async () => {
      if (
        selectedIds.length ===
        0
      ) {
        return;
      }

      const count =
        selectedIds.length;

      const confirmation =
        window.confirm(
          count === 1
            ? 'Audit log yang dipilih akan dibackup ke Excel lalu dihapus. Lanjutkan?'
            : `${count} audit log yang dipilih akan dibackup ke Excel lalu dihapus. Lanjutkan?`
        );

      if (
        !confirmation
      ) {
        return;
      }

      setBackupLoading(true);

      setError('');

      setSuccess('');

      try {
        const response =
          await api.post(
            '/superadmin/audit-logs/backup-delete',
            {
              ids:
                selectedIds,
            },
            {
              responseType:
                'blob',
            }
          );

        const contentType =
          response.headers?.[
            'content-type'
          ];

        if (
          contentType?.includes(
            'application/json'
          )
        ) {
          const text =
            await response.data.text();

          let message =
            'Backup dan penghapusan gagal.';

          try {
            const parsed =
              JSON.parse(
                text
              );

            message =
              parsed?.message ||
              message;
          } catch {
            // Gunakan fallback.
          }

          throw new Error(
            message
          );
        }

        downloadBlob(
          response.data,
          createBackupFilename()
        );

        setSelectedIds([]);

        setSelectedLog(null);

        setManageModalOpen(
          false
        );

        setSuccess(
          count === 1
            ? 'Audit log berhasil dibackup dan dihapus.'
            : `${count} audit log berhasil dibackup dan dihapus.`
        );

        const nextPage =
          Math.min(
            pagination.current_page,
            Math.max(
              1,
              pagination.last_page
            )
          );

        await fetchLogs(
          nextPage,
          currentFilterParams
        );
      } catch (
        err
      ) {
        console.error(
          'Backup dan hapus audit log gagal:',
          err
        );

        let message =
          err.response?.data?.message ||
          err.message ||
          'Backup dan penghapusan audit log gagal.';

        if (
          err.response?.data instanceof
          Blob
        ) {
          try {
            const text =
              await err.response.data.text();

            const parsed =
              JSON.parse(
                text
              );

            message =
              parsed?.message ||
              message;
          } catch {
            // Gunakan fallback.
          }
        }

        setError(
          message
        );
      } finally {
        setBackupLoading(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | ACTION HELPERS
  |--------------------------------------------------------------------------
  */

  const getActionLabel =
    (
      action
    ) =>
      actionLabels[
        action
      ] ||
      action ||
      '-';

  const getModuleLabel =
    (
      module
    ) =>
      moduleLabels[
        module
      ] ||
      module ||
      '-';

  const getActionColor =
    (
      action
    ) =>
      actionColors[
        action
      ] ||
      'bg-surface-container text-on-surface-variant';

  /*
  |--------------------------------------------------------------------------
  | ACTOR HELPERS
  |--------------------------------------------------------------------------
  */

  const isPublicRegistrationLog =
    (
      log
    ) =>
      log?.module ===
        'authentication' &&
      log?.action ===
        'create' &&
      !log?.user;

  const isPasswordResetLog =
    (
      log
    ) =>
      log?.module ===
        'authentication' &&
      log?.action ===
        'password_reset';

  const getActorName =
    (
      log
    ) => {
      if (
        log?.user?.name
      ) {
        return log.user.name;
      }

      if (
        isPublicRegistrationLog(
          log
        )
      ) {
        return 'Pengunjung / Masyarakat';
      }

      if (
        isPasswordResetLog(
          log
        )
      ) {
        return (
          log?.auditable?.name ||
          'Pemilik Akun'
        );
      }

      return 'Sistem / Tidak teridentifikasi';
    };

  const getActorEmail =
    (
      log
    ) => {
      if (
        log?.user?.email
      ) {
        return log.user.email;
      }

      if (
        isPublicRegistrationLog(
          log
        )
      ) {
        return 'Tidak terautentikasi';
      }

      if (
        isPasswordResetLog(
          log
        )
      ) {
        return (
          log?.auditable?.email ||
          'Email pemilik akun'
        );
      }

      return '-';
    };

  /*
  |--------------------------------------------------------------------------
  | TARGET HELPER
  |--------------------------------------------------------------------------
  */

  const getTargetLabel =
    (
      log
    ) => {
      if (!log) {
        return '-';
      }

      if (
        log.auditable
      ) {
        const name =
          log.auditable.name ||
          log.auditable.email ||
          log.auditable.nama ||
          log.auditable.judul;

        if (
          name
        ) {
          return `${name} #${log.auditable_id}`;
        }
      }

      if (
        log.auditable_type &&
        log.auditable_id
      ) {
        const shortType =
          String(
            log.auditable_type
          ).split(
            '\\'
          ).pop();

        return `${shortType} #${log.auditable_id}`;
      }

      return '-';
    };

  /*
  |--------------------------------------------------------------------------
  | DETAIL VALUES
  |--------------------------------------------------------------------------
  */

  const selectedOldValues =
    useMemo(
      () =>
        normalizeObject(
          selectedLog?.old_values
        ),
      [
        selectedLog,
      ]
    );

  const selectedNewValues =
    useMemo(
      () =>
        normalizeObject(
          selectedLog?.new_values
        ),
      [
        selectedLog,
      ]
    );

  const changeKeys =
    useMemo(() => {
      const keys =
        new Set([
          ...Object.keys(
            selectedOldValues
          ),
          ...Object.keys(
            selectedNewValues
          ),
        ]);

      return Array.from(
        keys
      );
    }, [
      selectedOldValues,
      selectedNewValues,
    ]);

  /*
  |--------------------------------------------------------------------------
  | ACTIVE FILTER COUNT
  |--------------------------------------------------------------------------
  */

  const activeFilterCount =
    [
      search.trim(),
      moduleFilter,
      actionFilter,
      userIdFilter.trim(),
      dateFrom,
      dateTo,
    ].filter(
      Boolean
    ).length;

  /*
  |--------------------------------------------------------------------------
  | DISPLAY RANGE
  |--------------------------------------------------------------------------
  */

  const displayStart =
    pagination.total ===
      0
      ? 0
      : (
          (
            pagination.current_page -
            1
          ) *
          pagination.per_page
        ) + 1;

  const displayEnd =
    Math.min(
      pagination.current_page *
        pagination.per_page,
      pagination.total
    );

  /*
  |--------------------------------------------------------------------------
  | MANAGEMENT MODAL
  |--------------------------------------------------------------------------
  */

  const managementModal =
    manageModalOpen
      ? createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/55 p-4"
            onClick={() => {
              if (
                !backupLoading
              ) {
                setManageModalOpen(
                  false
                );
              }
            }}
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 16,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.18,
              }}
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
              style={{
                width:
                  'calc(100vw - 32px)',
                maxWidth:
                  '576px',
                maxHeight:
                  'calc(100vh - 32px)',
                boxSizing:
                  'border-box',
                flexShrink: 0,
              }}
              className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-2xl"
            >

              <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-6 py-5">

                <div className="flex min-w-0 items-start gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <span className="material-symbols-outlined">
                      manage_history
                    </span>

                  </div>

                  <div className="min-w-0">

                    <h2 className="font-headline-md text-xl text-on-surface">
                      Kelola Data Audit
                    </h2>

                    <p className="mt-1 text-sm text-on-surface-variant">
                      {selectedIds.length} audit log dipilih.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setManageModalOpen(
                      false
                    )
                  }
                  disabled={
                    backupLoading
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-on-surface-variant transition hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Tutup"
                >

                  <span className="material-symbols-outlined">
                    close
                  </span>

                </button>

              </div>

              <div className="overflow-y-auto p-6">

                <div className="space-y-4">

                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">

                        <span className="material-symbols-outlined">
                          warning
                        </span>

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="font-label-md font-semibold text-red-700">
                          Backup wajib dilakukan sebelum penghapusan
                        </p>

                        <p className="mt-1 text-sm leading-6 text-red-600">
                          Sistem akan membuat file Excel
                          terlebih dahulu. Audit log hanya
                          akan dihapus setelah backup berhasil.
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-low p-5">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest text-primary">

                        <span className="material-symbols-outlined text-2xl">
                          description
                        </span>

                      </div>

                      <div className="min-w-0">

                        <p className="text-sm text-on-surface-variant">
                          Data yang dipilih
                        </p>

                        <p className="mt-1 text-2xl font-bold text-on-surface">
                          {selectedIds.length} Audit Log
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="flex items-start gap-2 rounded-xl bg-primary/5 px-4 py-3 text-sm text-on-surface-variant">

                    <span className="material-symbols-outlined shrink-0 text-lg text-primary">
                      info
                    </span>

                    <p className="leading-6">
                      File Excel akan otomatis diunduh
                      setelah backup berhasil.
                    </p>

                  </div>

                </div>

              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-outline-variant/20 bg-surface-container-low px-6 py-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setManageModalOpen(
                      false
                    )
                  }
                  disabled={
                    backupLoading
                  }
                  className="inline-flex items-center justify-center rounded-xl border border-outline-variant/30 px-5 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-lowest disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={
                    handleBackupDelete
                  }
                  disabled={
                    backupLoading ||
                    selectedIds.length === 0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-error px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {backupLoading ? (
                    <>

                      <span className="material-symbols-outlined animate-spin text-base">
                        progress_activity
                      </span>

                      Membuat Backup...

                    </>
                  ) : (
                    <>

                      <span className="material-symbols-outlined text-base">
                        archive
                      </span>

                      Backup & Hapus

                    </>
                  )}

                </button>

              </div>

            </motion.div>

          </div>,
          document.body
        )
      : null;

  /*
  |--------------------------------------------------------------------------
  | DETAIL MODAL
  |--------------------------------------------------------------------------
  */

  const detailModal =
    (
      selectedLog ||
      detailLoading ||
      detailError
    )
      ? createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/55 p-4"
            onClick={() => {
              setSelectedLog(null);

              setDetailError('');
            }}
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 16,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.18,
              }}
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
              style={{
                width:
                  'calc(100vw - 32px)',
                maxWidth:
                  '1024px',
                maxHeight:
                  'calc(100vh - 32px)',
                boxSizing:
                  'border-box',
                flexShrink: 0,
              }}
              className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-2xl"
            >

              <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 bg-surface-container-lowest px-6 py-5">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <span className="material-symbols-outlined">
                      history
                    </span>

                  </div>

                  <div className="min-w-0">

                    <h2 className="font-headline-md text-xl text-on-surface">
                      Detail Audit Log
                    </h2>

                    <p className="mt-1 text-sm text-on-surface-variant">
                      Informasi lengkap aktivitas yang tercatat.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedLog(null);

                    setDetailError('');
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-on-surface-variant transition hover:bg-primary/10 hover:text-primary"
                  aria-label="Tutup"
                >

                  <span className="material-symbols-outlined">
                    close
                  </span>

                </button>

              </div>

              <div className="max-h-screen overflow-y-auto">

                {detailError && (
                  <div className="m-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    <span className="material-symbols-outlined shrink-0">
                      error
                    </span>

                    <span className="wrap-break-word">
                      {detailError}
                    </span>

                  </div>
                )}

                {detailLoading ? (

                  <div className="flex min-h-72 flex-col items-center justify-center gap-3 p-8">

                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">
                      progress_activity
                    </span>

                    <p className="text-sm text-on-surface-variant">
                      Memuat detail audit log...
                    </p>

                  </div>

                ) : selectedLog ? (

                  <div className="space-y-6 p-6">

                    {/* ==================================================
                        INFORMASI
                    ================================================== */}

                    <section>

                      <div className="mb-3 flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">

                          <span className="material-symbols-outlined text-lg">
                            info
                          </span>

                        </div>

                        <div>

                          <h3 className="font-label-md font-semibold text-on-surface">
                            Informasi Aktivitas
                          </h3>

                          <p className="text-xs text-on-surface-variant">
                            Detail dasar aktivitas.
                          </p>

                        </div>

                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <DetailRow
                          label="ID"
                          value={`#${selectedLog.id}`}
                        />

                        <DetailRow
                          label="Waktu"
                          value={formatDate(
                            selectedLog.created_at
                          )}
                        />

                        <DetailRow
                          label="Pelaku"
                          value={getActorName(
                            selectedLog
                          )}
                        />

                        <DetailRow
                          label="Email Pelaku"
                          value={getActorEmail(
                            selectedLog
                          )}
                        />

                        <DetailRow
                          label="Aksi"
                          value={getActionLabel(
                            selectedLog.action
                          )}
                        />

                        <DetailRow
                          label="Modul"
                          value={getModuleLabel(
                            selectedLog.module
                          )}
                        />

                        <DetailRow
                          label="Target"
                          value={getTargetLabel(
                            selectedLog
                          )}
                        />

                        <DetailRow
                          label="IP Address"
                          value={
                            selectedLog.ip_address ||
                            '-'
                          }
                        />

                        <div className="md:col-span-2">

                          <DetailRow
                            label="User Agent"
                            value={
                              selectedLog.user_agent ||
                              '-'
                            }
                          />

                        </div>

                      </div>

                    </section>

                    {/* ==================================================
                        DESKRIPSI
                    ================================================== */}

                    <section>

                      <h3 className="mb-3 font-label-md font-semibold text-on-surface">
                        Deskripsi
                      </h3>

                      <div className="rounded-xl bg-surface-container-low px-4 py-4">

                        <p className="wrap-break-word text-sm leading-6 text-on-surface">
                          {
                            selectedLog.description ||
                            '-'
                          }
                        </p>

                      </div>

                    </section>

                    {/* ==================================================
                        PERUBAHAN DATA
                    ================================================== */}

                    <section>

                      <div className="mb-3">

                        <h3 className="font-label-md font-semibold text-on-surface">
                          Perubahan Data
                        </h3>

                        <p className="mt-1 text-sm text-on-surface-variant">
                          Perbandingan nilai sebelum dan sesudah aktivitas.
                        </p>

                      </div>

                      {changeKeys.length ===
                      0 ? (

                        <div className="rounded-xl bg-surface-container-low px-4 py-8 text-center">

                          <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                            data_object
                          </span>

                          <p className="mt-2 text-sm text-on-surface-variant">
                            Tidak ada perubahan data yang tercatat.
                          </p>

                        </div>

                      ) : (

                        <div className="overflow-x-auto rounded-xl border border-outline-variant/20">

                          <table className="w-full min-w-175">

                            <thead className="bg-surface-container-low">

                              <tr>

                                <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">
                                  Field
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">
                                  Sebelum
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">
                                  Sesudah
                                </th>

                              </tr>

                            </thead>

                            <tbody>

                              {changeKeys.map(
                                (
                                  key
                                ) => {
                                  const oldValue =
                                    selectedOldValues[
                                      key
                                    ];

                                  const newValue =
                                    selectedNewValues[
                                      key
                                    ];

                                  const oldText =
                                    formatObjectValue(
                                      oldValue
                                    );

                                  const newText =
                                    formatObjectValue(
                                      newValue
                                    );

                                  const changed =
                                    oldText !==
                                    newText;

                                  return (
                                    <tr
                                      key={
                                        key
                                      }
                                      className="border-t border-outline-variant/10"
                                    >

                                      <td className="px-4 py-4 align-top">

                                        <span className="font-label-md font-semibold text-on-surface">
                                          {key}
                                        </span>

                                      </td>

                                      <td className="max-w-72 px-4 py-4 align-top">

                                        <div
                                          className={`rounded-lg px-3 py-2 text-sm ${
                                            changed
                                              ? 'bg-red-50 text-red-700'
                                              : 'bg-surface-container-low text-on-surface-variant'
                                          }`}
                                        >

                                          <pre className="whitespace-pre-wrap wrap-break-word font-sans">
                                            {
                                              oldText
                                            }
                                          </pre>

                                        </div>

                                      </td>

                                      <td className="max-w-72 px-4 py-4 align-top">

                                        <div
                                          className={`rounded-lg px-3 py-2 text-sm ${
                                            changed
                                              ? 'bg-green-50 text-green-700'
                                              : 'bg-surface-container-low text-on-surface-variant'
                                          }`}
                                        >

                                          <pre className="whitespace-pre-wrap wrap-break-word font-sans">
                                            {
                                              newText
                                            }
                                          </pre>

                                        </div>

                                      </td>

                                    </tr>
                                  );
                                }
                              )}

                            </tbody>

                          </table>

                        </div>

                      )}

                    </section>

                    {/* ==================================================
                        RAW JSON
                    ================================================== */}

                    <section>

                      <details className="group">

                        <summary className="cursor-pointer list-none rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">

                          <div className="flex items-center justify-between gap-3">

                            <div className="flex items-center gap-3">

                              <span className="material-symbols-outlined text-primary">
                                code
                              </span>

                              <div>

                                <p className="font-label-md font-semibold text-on-surface">
                                  Data Mentah
                                </p>

                                <p className="mt-1 text-xs text-on-surface-variant">
                                  JSON old_values dan new_values
                                </p>

                              </div>

                            </div>

                            <span className="material-symbols-outlined text-on-surface-variant transition-transform group-open:rotate-180">
                              expand_more
                            </span>

                          </div>

                        </summary>

                        <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">

                          <div>

                            <p className="mb-2 text-xs font-semibold text-on-surface-variant">
                              Nilai Sebelum
                            </p>

                            <pre className="max-h-72 overflow-auto rounded-xl bg-slate-950 px-4 py-4 text-sm text-slate-100">
                              {JSON.stringify(
                                selectedOldValues,
                                null,
                                2
                              )}
                            </pre>

                          </div>

                          <div>

                            <p className="mb-2 text-xs font-semibold text-on-surface-variant">
                              Nilai Sesudah
                            </p>

                            <pre className="max-h-72 overflow-auto rounded-xl bg-slate-950 px-4 py-4 text-sm text-slate-100">
                              {JSON.stringify(
                                selectedNewValues,
                                null,
                                2
                              )}
                            </pre>

                          </div>

                        </div>

                      </details>

                    </section>

                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <div className="flex flex-col gap-3 border-t border-outline-variant/20 pt-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-start gap-2 text-xs leading-5 text-on-surface-variant">

                        <span className="material-symbols-outlined text-sm">
                          lock
                        </span>

                        <span>
                          Detail audit log bersifat read-only.
                          Pengelolaan penghapusan tersedia
                          melalui Kelola Data Audit.
                        </span>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedLog(null)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/30 px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
                      >
                        Tutup
                      </button>

                    </div>

                  </div>

                ) : null}

              </div>

            </motion.div>

          </div>,
          document.body
        )
      : null;

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <div className="w-full min-w-0 max-w-full overflow-x-hidden">

        {/* ========================================================
            HEADER
        ======================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-6 flex min-w-0 max-w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="font-headline-lg text-on-background">
                Audit Log
              </h1>

              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">

                <span className="material-symbols-outlined text-sm">
                  admin_panel_settings
                </span>

                Super Admin

              </span>

            </div>

            <p className="mt-1 max-w-2xl font-body-md leading-6 text-on-surface-variant">
              Pantau aktivitas penting sistem dan telusuri
              perubahan data yang dilakukan pengguna.
            </p>

          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">

            <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-primary">

              <span className="material-symbols-outlined text-xl">
                history
              </span>

              <span className="font-label-md">
                {pagination.total} Aktivitas
              </span>

            </div>

            <button
              type="button"
              onClick={() =>
                fetchLogs(
                  pagination.current_page,
                  currentFilterParams
                )
              }
              disabled={
                loading ||
                backupLoading
              }
              className="inline-flex items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >

              <span
                className={`material-symbols-outlined ${
                  loading
                    ? 'animate-spin'
                    : ''
                }`}
              >
                refresh
              </span>

              Refresh

            </button>

          </div>

        </motion.div>

        {/* ========================================================
            INFORMATION
        ======================================================== */}

        <div className="mb-5 w-full max-w-full rounded-2xl border border-primary/15 bg-primary/5 p-5">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

              <span className="material-symbols-outlined">
                security
              </span>

            </div>

            <div className="min-w-0 flex-1">

              <h2 className="font-label-md font-semibold text-on-surface">
                Pusat Aktivitas Sistem
              </h2>

              <p className="mt-1 max-w-3xl wrap-break-word text-sm leading-6 text-on-surface-variant">
                Audit log bersifat read-only. Penghapusan data
                hanya tersedia melalui proses backup Excel terlebih
                dahulu agar rekam aktivitas tetap dapat disimpan.
              </p>

            </div>

          </div>

        </div>

        {/* ========================================================
            SUCCESS
        ======================================================== */}

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
            className="mb-5 flex w-full max-w-full items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >

            <span className="material-symbols-outlined shrink-0">
              check_circle
            </span>

            <span className="wrap-break-word">
              {success}
            </span>

          </motion.div>
        )}

        {/* ========================================================
            ERROR
        ======================================================== */}

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
            className="mb-5 flex w-full max-w-full items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >

            <span className="material-symbols-outlined shrink-0">
              error
            </span>

            <span className="wrap-break-word">
              {error}
            </span>

          </motion.div>
        )}

        {/* ========================================================
            FILTER
        ======================================================== */}

        <section className="mb-5 w-full max-w-full rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

                <span className="material-symbols-outlined">
                  filter_alt
                </span>

              </div>

              <div className="min-w-0">

                <h2 className="font-headline-md text-lg text-on-surface">
                  Filter Audit Log
                </h2>

                <p className="text-sm text-on-surface-variant">
                  Cari dan saring aktivitas berdasarkan kebutuhan.
                </p>

              </div>

            </div>

            {activeFilterCount > 0 && (
              <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                {activeFilterCount} filter aktif
              </span>
            )}

          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">

            <div className="min-w-0 xl:col-span-2">

              <label className="mb-1.5 block text-sm font-semibold text-on-surface">
                Pencarian
              </label>

              <div className="relative min-w-0">

                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  search
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      'Enter'
                    ) {
                      handleApplyFilter();
                    }
                  }}
                  placeholder="Nama, email, deskripsi, IP, modul..."
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface px-10 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
                />

              </div>

            </div>

            <div className="min-w-0">

              <label className="mb-1.5 block text-sm font-semibold text-on-surface">
                Modul
              </label>

              <select
                value={moduleFilter}
                onChange={(
                  event
                ) =>
                  setModuleFilter(
                    event.target.value
                  )
                }
                className="w-full min-w-0 rounded-xl border border-outline-variant/30 bg-surface px-3 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
              >

                <option value="">
                  Semua Modul
                </option>

                {moduleOptions.map(
                  (
                    item
                  ) => (
                    <option
                      key={
                        item.value
                      }
                      value={
                        item.value
                      }
                    >
                      {item.label}
                    </option>
                  )
                )}

              </select>

            </div>

            <div className="min-w-0">

              <label className="mb-1.5 block text-sm font-semibold text-on-surface">
                Aksi
              </label>

              <select
                value={actionFilter}
                onChange={(
                  event
                ) =>
                  setActionFilter(
                    event.target.value
                  )
                }
                className="w-full min-w-0 rounded-xl border border-outline-variant/30 bg-surface px-3 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
              >

                <option value="">
                  Semua Aksi
                </option>

                {actionOptions.map(
                  (
                    item
                  ) => (
                    <option
                      key={
                        item.value
                      }
                      value={
                        item.value
                      }
                    >
                      {item.label}
                    </option>
                  )
                )}

              </select>

            </div>

            <div className="min-w-0">

              <label className="mb-1.5 block text-sm font-semibold text-on-surface">
                ID Pelaku
              </label>

              <input
                type="number"
                min="1"
                value={userIdFilter}
                onChange={(
                  event
                ) =>
                  setUserIdFilter(
                    event.target.value
                  )
                }
                placeholder="Contoh: 12"
                className="w-full min-w-0 rounded-xl border border-outline-variant/30 bg-surface px-3 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
              />

            </div>

            <div className="min-w-0">

              <label className="mb-1.5 block text-sm font-semibold text-on-surface">
                Tanggal Dari
              </label>

              <input
                type="date"
                value={dateFrom}
                onChange={(
                  event
                ) =>
                  setDateFrom(
                    event.target.value
                  )
                }
                className="w-full min-w-0 rounded-xl border border-outline-variant/30 bg-surface px-3 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
              />

            </div>

            <div className="min-w-0">

              <label className="mb-1.5 block text-sm font-semibold text-on-surface">
                Tanggal Sampai
              </label>

              <input
                type="date"
                value={dateTo}
                onChange={(
                  event
                ) =>
                  setDateTo(
                    event.target.value
                  )
                }
                className="w-full min-w-0 rounded-xl border border-outline-variant/30 bg-surface px-3 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
              />

            </div>

          </div>

          <div className="mt-5 flex flex-col gap-2 border-t border-outline-variant/10 pt-4 sm:flex-row sm:items-center sm:justify-end">

            <button
              type="button"
              onClick={
                handleResetFilter
              }
              disabled={
                loading
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/30 px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
            >

              <span className="material-symbols-outlined text-base">
                restart_alt
              </span>

              Reset Filter

            </button>

            <button
              type="button"
              onClick={
                handleApplyFilter
              }
              disabled={
                loading
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <span className="material-symbols-outlined text-base">
                filter_alt
              </span>

              Terapkan Filter

            </button>

          </div>

        </section>

        {/* ========================================================
            SELECTION BAR
        ======================================================== */}

        <div className="mb-5 w-full max-w-full rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-sm">

          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex min-w-0 items-center gap-3">

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  selectedIds.length > 0
                    ? 'bg-primary/10 text-primary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >

                <span className="material-symbols-outlined">
                  check_box
                </span>

              </div>

              <div className="min-w-0">

                <p className="font-label-md font-semibold text-on-surface">

                  {selectedIds.length > 0
                    ? `${selectedIds.length} log dipilih`
                    : 'Pilih audit log'}

                </p>

                <p className="wrap-break-word text-sm text-on-surface-variant">

                  {selectedIds.length > 0
                    ? 'Gunakan Kelola Data Audit untuk backup sebelum penghapusan.'
                    : 'Centang log yang ingin kamu kelola.'}

                </p>

              </div>

            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">

              <button
                type="button"
                onClick={
                  toggleSelectAll
                }
                disabled={
                  loading ||
                  logs.length === 0 ||
                  backupLoading
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/30 px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >

                <span className="material-symbols-outlined text-base">
                  select_all
                </span>

                {allCurrentPageSelected
                  ? 'Batal Pilih Halaman'
                  : 'Pilih Semua Halaman'}

              </button>

              <button
                type="button"
                onClick={
                  openManageModal
                }
                disabled={
                  selectedIds.length === 0 ||
                  backupLoading
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <span className="material-symbols-outlined text-base">
                  manage_history
                </span>

                Kelola Data Audit

              </button>

            </div>

          </div>

        </div>

        {/* ========================================================
            DATA AREA
        ======================================================== */}

        <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">

          {/* ======================================================
              LOADING
          ====================================================== */}

          {loading ? (

            <div className="w-full min-w-0 p-6">

              <div className="space-y-3">

                {Array.from({
                  length: 6,
                }).map(
                  (
                    _,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="h-12 w-full animate-pulse rounded-xl bg-surface-container-low"
                    />
                  )
                )}

              </div>

            </div>

          ) : logs.length === 0 ? (

            /* ====================================================
               EMPTY STATE

               PENTING:
               Empty state tidak lagi berada di dalam <table>.
               Selain itu wrapper memakai inline width 100%
               agar tidak mungkin menyusut menjadi kolom sempit.
            ==================================================== */

            <div
              className="flex min-h-80 items-center justify-center text-center"
              style={{
                width:
                  '100%',
                maxWidth:
                  '100%',
                boxSizing:
                  'border-box',
              }}
            >

              <div
                className="flex flex-col items-center justify-center"
                style={{
                  width:
                    '100%',
                  maxWidth:
                    '640px',
                  boxSizing:
                    'border-box',
                  paddingLeft:
                    '24px',
                  paddingRight:
                    '24px',
                }}
              >

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">

                  <span className="material-symbols-outlined text-4xl">
                    history_toggle_off
                  </span>

                </div>

                <h3 className="mt-4 font-headline-md text-lg text-on-surface">
                  Tidak ada audit log
                </h3>

                <p
                  className="mt-2 text-sm leading-6 text-on-surface-variant"
                  style={{
                    width:
                      '100%',
                    maxWidth:
                      '560px',
                    minWidth:
                      '0',
                    whiteSpace:
                      'normal',
                    overflowWrap:
                      'break-word',
                    wordBreak:
                      'normal',
                  }}
                >
                  Tidak ada aktivitas yang sesuai
                  dengan filter yang digunakan.
                </p>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={
                      handleResetFilter
                    }
                    disabled={
                      loading
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-outline-variant/30 px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <span className="material-symbols-outlined text-base">
                      restart_alt
                    </span>

                    Bersihkan Filter

                  </button>
                )}

              </div>

            </div>

          ) : (

            /* ====================================================
               DATA TABLE
            ==================================================== */

            <>

              <div className="w-full min-w-0 max-w-full overflow-x-auto">

                <table className="w-full min-w-250">

                  <thead className="border-b border-outline-variant/20 bg-surface-container-low">

                    <tr>

                      <th className="w-14 whitespace-nowrap px-4 py-4 text-center">

                        <input
                          type="checkbox"
                          checked={
                            allCurrentPageSelected
                          }
                          onChange={
                            toggleSelectAll
                          }
                          disabled={
                            backupLoading
                          }
                          className="h-4 w-4 accent-primary"
                          aria-label="Pilih semua audit log halaman ini"
                        />

                      </th>

                      <th className="whitespace-nowrap px-6 py-4 text-left font-label-sm text-on-surface-variant">
                        ID
                      </th>

                      <th className="whitespace-nowrap px-6 py-4 text-left font-label-sm text-on-surface-variant">
                        Waktu
                      </th>

                      <th className="whitespace-nowrap px-6 py-4 text-left font-label-sm text-on-surface-variant">
                        Pelaku
                      </th>

                      <th className="whitespace-nowrap px-6 py-4 text-left font-label-sm text-on-surface-variant">
                        Aksi
                      </th>

                      <th className="whitespace-nowrap px-6 py-4 text-left font-label-sm text-on-surface-variant">
                        Modul
                      </th>

                      <th className="whitespace-nowrap px-6 py-4 text-left font-label-sm text-on-surface-variant">
                        Deskripsi
                      </th>

                      <th className="whitespace-nowrap px-6 py-4 text-right font-label-sm text-on-surface-variant">
                        Detail
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {logs.map(
                      (
                        log
                      ) => (
                        <tr
                          key={
                            log.id
                          }
                          className="border-b border-outline-variant/10 transition-colors hover:bg-primary/5"
                        >

                          <td className="px-4 py-4 text-center">

                            <input
                              type="checkbox"
                              checked={selectedIds.includes(
                                log.id
                              )}
                              onChange={() =>
                                toggleSelection(
                                  log.id
                                )
                              }
                              disabled={
                                backupLoading
                              }
                              className="h-4 w-4 accent-primary"
                              aria-label={`Pilih audit log #${log.id}`}
                            />

                          </td>

                          <td className="whitespace-nowrap px-6 py-4">

                            <span className="font-label-md font-semibold text-primary">
                              #{log.id}
                            </span>

                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-sm text-on-surface-variant">
                            {
                              formatDate(
                                log.created_at
                              )
                            }
                          </td>

                          <td className="px-6 py-4">

                            <div className="min-w-44">

                              <p className="wrap-break-word font-label-md font-semibold text-on-surface">
                                {
                                  getActorName(
                                    log
                                  )
                                }
                              </p>

                              <p className="mt-1 wrap-break-word font-label-sm text-on-surface-variant">
                                {
                                  getActorEmail(
                                    log
                                  )
                                }
                              </p>

                            </div>

                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 font-label-sm ${getActionColor(
                                log.action
                              )}`}
                            >
                              {
                                getActionLabel(
                                  log.action
                                )
                              }
                            </span>

                          </td>

                          <td className="px-6 py-4">

                            <span className="whitespace-nowrap font-label-sm text-on-surface">
                              {
                                getModuleLabel(
                                  log.module
                                )
                              }
                            </span>

                          </td>

                          <td className="max-w-105 px-6 py-4">

                            <p className="line-clamp-2 wrap-break-word font-label-sm leading-6 text-on-surface">
                              {
                                log.description ||
                                '-'
                              }
                            </p>

                          </td>

                          <td className="px-6 py-4">

                            <div className="flex justify-end">

                              <button
                                type="button"
                                onClick={() =>
                                  handleViewDetail(
                                    log.id
                                  )
                                }
                                disabled={
                                  backupLoading
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/30 px-3 py-2 text-sm font-semibold text-primary transition hover:border-primary/30 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                              >

                                <span className="material-symbols-outlined text-base">
                                  visibility
                                </span>

                                Detail

                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* ==================================================
                  PAGINATION
              ================================================== */}

              <div className="flex min-w-0 flex-col gap-4 border-t border-outline-variant/20 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">

                <p className="text-sm text-on-surface-variant">

                  Menampilkan{' '}

                  <span className="font-semibold text-on-surface">
                    {displayStart}
                  </span>

                  {' - '}

                  <span className="font-semibold text-on-surface">
                    {displayEnd}
                  </span>

                  {' dari '}

                  <span className="font-semibold text-on-surface">
                    {pagination.total}
                  </span>

                  {' aktivitas'}

                </p>

                <div className="flex flex-wrap items-center gap-1.5">

                  <button
                    type="button"
                    disabled={
                      pagination.current_page ===
                        1 ||
                      loading
                    }
                    onClick={() =>
                      handlePageChange(
                        pagination.current_page -
                          1
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/30 px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    <span className="material-symbols-outlined text-base">
                      chevron_left
                    </span>

                    Sebelumnya

                  </button>

                  {paginationPages.map(
                    (
                      page
                    ) =>
                      typeof page ===
                      'string' ? (
                        <span
                          key={
                            page
                          }
                          className="px-2 text-sm text-on-surface-variant"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={
                            page
                          }
                          type="button"
                          onClick={() =>
                            handlePageChange(
                              page
                            )
                          }
                          disabled={
                            loading
                          }
                          className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                            page ===
                            pagination.current_page
                              ? 'bg-primary text-white'
                              : 'text-on-surface-variant hover:bg-primary/10 hover:text-primary'
                          }`}
                        >
                          {page}
                        </button>
                      )
                  )}

                  <button
                    type="button"
                    disabled={
                      pagination.current_page ===
                        pagination.last_page ||
                      loading
                    }
                    onClick={() =>
                      handlePageChange(
                        pagination.current_page +
                          1
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/30 px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    Berikutnya

                    <span className="material-symbols-outlined text-base">
                      chevron_right
                    </span>

                  </button>

                </div>

              </div>

            </>

          )}

        </div>

      </div>

      {managementModal}

      {detailModal}
    </>
  );
};

/*
|--------------------------------------------------------------------------
| DETAIL ROW
|--------------------------------------------------------------------------
*/

const DetailRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-start justify-between gap-6 rounded-xl bg-surface-container-low px-4 py-3">

      <span className="shrink-0 font-label-sm text-on-surface-variant">
        {label}
      </span>

      <span className="max-w-70 wrap-break-word text-right font-label-md font-semibold text-on-surface">
        {value || '-'}
      </span>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default SuperAdminAuditLogs;
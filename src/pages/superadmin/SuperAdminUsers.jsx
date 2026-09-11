import React, {
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const IMMUTABLE_SUPER_ADMIN_ID = 1;

const roleColors = {
  superadmin: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  user: 'bg-gray-100 text-gray-700',
};

const roleLabels = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  user: 'Masyarakat',
};

const initialCreateForm = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'user',
  is_active: true,
};

const initialEditForm = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
};

const initialFilters = {
  search: '',
  role: '',
  status: '',
};

const DeleteUserModal = ({
  user,
  open,
  deleting,
  onClose,
  onConfirm,
  getRoleLabel,
}) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !deleting) {
        onClose();
      }
    };

    document.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [open, deleting, onClose]);

  if (!open || !user) {
    return null;
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2147483647,
      }}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup modal"
        onClick={() => {
          if (!deleting) {
            onClose();
          }
        }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 0,
          padding: 0,
          margin: 0,
          background:
            'rgba(0, 0, 0, 0.45)',
          cursor: deleting
            ? 'default'
            : 'pointer',
        }}
      />

      {/* Modal Wrapper */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          overflowY: 'auto',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 16,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.18,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-user-title"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '420px',
            maxHeight:
              'calc(100vh - 32px)',
            overflowY: 'auto',
            borderRadius: '16px',
            background: '#ffffff',
            boxShadow:
              '0 25px 60px rgba(0, 0, 0, 0.25)',
            pointerEvents: 'auto',
          }}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '24px',
                  }}
                >
                  delete
                </span>
              </div>

              <div>
                <h2
                  id="delete-user-title"
                  className="font-headline-md text-on-surface"
                >
                  Hapus User?
                </h2>

                <p className="font-label-sm text-on-surface-variant mt-1">
                  Konfirmasi penghapusan akun pengguna.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-4">
            <div className="rounded-xl bg-surface-container-low px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-label-md font-semibold text-on-surface">
                    {user.name}
                  </p>

                  <p className="font-label-sm text-on-surface-variant mt-1 break-all">
                    {user.email}
                  </p>
                </div>

                <span className="shrink-0 text-xs text-on-surface-variant">
                  #{user.id}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    roleColors[user.role?.name] ||
                    'bg-gray-100 text-gray-700'
                  }`}
                >
                  {getRoleLabel(
                    user.role?.name
                  )}
                </span>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {user.is_active
                    ? 'Aktif'
                    : 'Nonaktif'}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-amber-600 shrink-0"
                  style={{
                    fontSize: '20px',
                  }}
                >
                  info
                </span>

                <p className="font-label-sm text-amber-700 leading-relaxed">
                  User akan di-soft delete.
                  Data tidak langsung dihapus permanen
                  dari database dan tidak akan muncul
                  di daftar user aktif.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-outline-variant/20 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={deleting}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant font-label-md hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={deleting}
              onClick={onConfirm}
              className="px-4 py-2.5 rounded-xl bg-error text-white font-label-md flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '19px',
                }}
              >
                {deleting
                  ? 'progress_activity'
                  : 'delete'}
              </span>

              {deleting
                ? 'Menghapus...'
                : 'Hapus User'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
};

const SuperAdminUsers = () => {
  const [userList, setUserList] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingRoles, setLoadingRoles] =
    useState(true);

  const [creatingUser, setCreatingUser] =
    useState(false);

  const [updatingUser, setUpdatingUser] =
    useState(false);

  const [deletingUserId, setDeletingUserId] =
    useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [updatingRoleId, setUpdatingRoleId] =
    useState(null);

  const [updatingStatusId, setUpdatingStatusId] =
    useState(null);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [createForm, setCreateForm] = useState(
    initialCreateForm
  );

  const [editingUserId, setEditingUserId] =
    useState(null);

  const [showEditForm, setShowEditForm] =
    useState(false);

  const [editForm, setEditForm] =
    useState(initialEditForm);

  const [filters, setFilters] =
    useState(initialFilters);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [pagination, setPagination] =
    useState({
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0,
    });

  const currentUser = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  /*
  |--------------------------------------------------------------------------
  | Fetch Users
  |--------------------------------------------------------------------------
  */

  const fetchUsers = async (
    page = 1,
    activeFilters = filters
  ) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(
        '/superadmin/users',
        {
          params: {
            page,
            search:
              activeFilters.search?.trim() ||
              undefined,
            role:
              activeFilters.role || undefined,
            status:
              activeFilters.status ||
              undefined,
          },
        }
      );

      const paginator = response.data.data;

      setUserList(paginator.data || []);

      setPagination({
        current_page:
          paginator.current_page,
        last_page: paginator.last_page,
        per_page: paginator.per_page,
        total: paginator.total,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Gagal mengambil daftar user.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Fetch Roles
  |--------------------------------------------------------------------------
  */

  const fetchRoles = async () => {
    setLoadingRoles(true);

    try {
      const response = await api.get(
        '/superadmin/roles'
      );

      setRoles(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Gagal mengambil daftar role.'
      );
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, initialFilters);
    fetchRoles();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Messages
  |--------------------------------------------------------------------------
  */

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  /*
  |--------------------------------------------------------------------------
  | Filter
  |--------------------------------------------------------------------------
  */

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    const nextFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(nextFilters);

    if (name !== 'search') {
      fetchUsers(1, nextFilters);
    }
  };

  useEffect(() => {
    const search = filters.search.trim();

    const timeout = setTimeout(() => {
      fetchUsers(1, {
        ...filters,
        search,
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [filters.search]);

  const handleResetFilters = () => {
    const resetFilters = {
      ...initialFilters,
    };

    setFilters(resetFilters);
    fetchUsers(1, resetFilters);
  };

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.role !== '' ||
    filters.status !== '';

  /*
  |--------------------------------------------------------------------------
  | Create Form
  |--------------------------------------------------------------------------
  */

  const handleCreateFormChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Edit Form
  |--------------------------------------------------------------------------
  */

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Create User
  |--------------------------------------------------------------------------
  */

  const handleCreateUser = async (event) => {
    event.preventDefault();

    clearMessages();
    setCreatingUser(true);

    try {
      const response = await api.post(
        '/superadmin/users',
        createForm
      );

      setSuccess(response.data.message);

      setCreateForm(
        initialCreateForm
      );

      setShowCreateForm(false);

      await fetchUsers(1, filters);
    } catch (err) {
      const responseMessage =
        err.response?.data?.message;

      const validationErrors =
        err.response?.data?.errors;

      if (responseMessage) {
        setError(responseMessage);
      } else if (validationErrors) {
        const firstError = Object.values(
          validationErrors
        )
          .flat()
          .find(Boolean);

        setError(
          firstError ||
            'Data user tidak valid.'
        );
      } else {
        setError(
          'User gagal dibuat. Silakan coba lagi.'
        );
      }
    } finally {
      setCreatingUser(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Open Edit
  |--------------------------------------------------------------------------
  */

  const handleOpenEdit = (user) => {
    clearMessages();

    if (
      user.id ===
      IMMUTABLE_SUPER_ADMIN_ID
    ) {
      setError(
        'Data Super Admin utama tidak dapat diubah.'
      );

      return;
    }

    setEditingUserId(user.id);

    setEditForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      password_confirmation: '',
    });

    setShowEditForm(true);
    setShowCreateForm(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Close Edit
  |--------------------------------------------------------------------------
  */

  const handleCloseEdit = () => {
    if (updatingUser) {
      return;
    }

    setEditingUserId(null);
    setShowEditForm(false);
    setEditForm(initialEditForm);
  };

  /*
  |--------------------------------------------------------------------------
  | Update User
  |--------------------------------------------------------------------------
  */

  const handleUpdateUser = async (event) => {
    event.preventDefault();

    if (!editingUserId) {
      return;
    }

    if (
      editingUserId ===
      IMMUTABLE_SUPER_ADMIN_ID
    ) {
      setError(
        'Data Super Admin utama tidak dapat diubah.'
      );

      return;
    }

    clearMessages();
    setUpdatingUser(true);

    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
      };

      if (
        editForm.password.trim() !== ''
      ) {
        payload.password =
          editForm.password;

        payload.password_confirmation =
          editForm.password_confirmation;
      }

      const response = await api.patch(
        `/superadmin/users/${editingUserId}`,
        payload
      );

      const updatedUser =
        response.data.data;

      setUserList((prev) =>
        prev.map((user) =>
          user.id === editingUserId
            ? {
                ...user,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                is_active:
                  updatedUser.is_active,
              }
            : user
        )
      );

      setSelectedUser((prev) =>
        prev?.id === editingUserId
          ? {
              ...prev,
              name: updatedUser.name,
              email: updatedUser.email,
              role: updatedUser.role,
              is_active:
                updatedUser.is_active,
            }
          : prev
      );

      setSuccess(
        response.data.message
      );

      setEditForm(initialEditForm);
      setEditingUserId(null);
      setShowEditForm(false);
    } catch (err) {
      const responseMessage =
        err.response?.data?.message;

      const validationErrors =
        err.response?.data?.errors;

      if (responseMessage) {
        setError(responseMessage);
      } else if (validationErrors) {
        const firstError = Object.values(
          validationErrors
        )
          .flat()
          .find(Boolean);

        setError(
          firstError ||
            'Data user tidak valid.'
        );
      } else {
        setError(
          'Data user gagal diperbarui. Silakan coba lagi.'
        );
      }
    } finally {
      setUpdatingUser(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Role Change
  |--------------------------------------------------------------------------
  */

  const handleRoleChange = async (
    userId,
    role
  ) => {
    clearMessages();

    const targetUser = userList.find(
      (user) => user.id === userId
    );

    if (!targetUser) {
      return;
    }

    const isSelf =
      targetUser.id === currentUser?.id;

    const isImmutable =
      targetUser.id ===
      IMMUTABLE_SUPER_ADMIN_ID;

    if (isImmutable) {
      setError(
        'Role Super Admin utama tidak dapat diubah.'
      );

      return;
    }

    if (isSelf) {
      setError(
        'Super Admin tidak dapat mengubah role dirinya sendiri.'
      );

      return;
    }

    if (
      targetUser.role?.name === role
    ) {
      return;
    }

    setUpdatingRoleId(userId);

    try {
      const response = await api.patch(
        `/superadmin/users/${userId}/role`,
        {
          role,
        }
      );

      const updatedUser =
        response.data.data;

      setUserList((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                role: updatedUser.role,
                is_active:
                  updatedUser.is_active,
              }
            : user
        )
      );

      setSelectedUser((prev) =>
        prev?.id === userId
          ? {
              ...prev,
              role: updatedUser.role,
              is_active:
                updatedUser.is_active,
            }
          : prev
      );

      setSuccess(
        response.data.message
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Role user gagal diperbarui.'
      );
    } finally {
      setUpdatingRoleId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Status Change
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (
    userId,
    isActive
  ) => {
    clearMessages();

    const targetUser = userList.find(
      (user) => user.id === userId
    );

    if (!targetUser) {
      return;
    }

    const isSelf =
      targetUser.id === currentUser?.id;

    const isImmutable =
      targetUser.id ===
      IMMUTABLE_SUPER_ADMIN_ID;

    if (isImmutable) {
      setError(
        'Status Super Admin utama tidak dapat diubah.'
      );

      return;
    }

    if (isSelf) {
      setError(
        'Super Admin tidak dapat mengubah status dirinya sendiri.'
      );

      return;
    }

    if (
      Boolean(targetUser.is_active) ===
      Boolean(isActive)
    ) {
      return;
    }

    setUpdatingStatusId(userId);

    try {
      const response = await api.patch(
        `/superadmin/users/${userId}/status`,
        {
          is_active: isActive,
        }
      );

      const updatedUser =
        response.data.data;

      setUserList((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                is_active:
                  updatedUser.is_active,
              }
            : user
        )
      );

      setSelectedUser((prev) =>
        prev?.id === userId
          ? {
              ...prev,
              is_active:
                updatedUser.is_active,
            }
          : prev
      );

      setSuccess(
        response.data.message
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Status akun gagal diperbarui.'
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Open Delete Modal
  |--------------------------------------------------------------------------
  */

  const handleDeleteUser = (user) => {
    clearMessages();

    if (
      user.id ===
      IMMUTABLE_SUPER_ADMIN_ID
    ) {
      setError(
        'Super Admin utama tidak dapat dihapus.'
      );

      return;
    }

    if (
      user.id === currentUser?.id
    ) {
      setError(
        'Super Admin tidak dapat menghapus akunnya sendiri.'
      );

      return;
    }

    setDeleteTarget(user);
    setShowDeleteModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Close Delete Modal
  |--------------------------------------------------------------------------
  */

  const handleCloseDeleteModal = () => {
    if (deletingUserId !== null) {
      return;
    }

    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  /*
  |--------------------------------------------------------------------------
  | Confirm Delete
  |--------------------------------------------------------------------------
  */

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    clearMessages();

    setDeletingUserId(
      deleteTarget.id
    );

    try {
      const response =
        await api.delete(
          `/superadmin/users/${deleteTarget.id}`
        );

      setSuccess(
        response.data.message
      );

      if (
        selectedUser?.id ===
        deleteTarget.id
      ) {
        setSelectedUser(null);
      }

      if (
        editingUserId ===
        deleteTarget.id
      ) {
        setEditingUserId(null);
        setShowEditForm(false);
        setEditForm(initialEditForm);
      }

      setShowDeleteModal(false);
      setDeleteTarget(null);

      const targetPage =
        pagination.current_page;

      const nextPage =
        targetPage > 1 &&
        userList.length === 1
          ? targetPage - 1
          : targetPage;

      await fetchUsers(
        nextPage,
        filters
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'User gagal dihapus. Silakan coba lagi.'
      );
    } finally {
      setDeletingUserId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | View Detail
  |--------------------------------------------------------------------------
  */

  const handleViewDetail = async (
    userId
  ) => {
    clearMessages();
    setDetailLoading(true);
    setSelectedUser(null);

    try {
      const response =
        await api.get(
          `/superadmin/users/${userId}`
        );

      setSelectedUser(
        response.data.data
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Detail user gagal diambil.'
      );
    } finally {
      setDetailLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > pagination.last_page ||
      page ===
        pagination.current_page
    ) {
      return;
    }

    fetchUsers(
      page,
      filters
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Role Label
  |--------------------------------------------------------------------------
  */

  const getRoleLabel = (roleName) => {
    return (
      roleLabels[roleName] ||
      roleName ||
      '-'
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">
            Manajemen User
          </h1>

          <p className="font-body-md text-on-surface-variant mt-1">
            Kelola akun pengguna, role,
            dan status akun sistem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary">
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '20px',
              }}
            >
              people
            </span>

            <span className="font-label-md">
              {pagination.total} User
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              clearMessages();

              if (showEditForm) {
                handleCloseEdit();
              }

              setCreateForm(
                initialCreateForm
              );

              setShowCreateForm(
                (prev) => !prev
              );
            }}
            className="px-4 py-2.5 bg-primary text-white rounded-xl flex items-center gap-2 hover:bg-primary-container transition-colors"
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '20px',
              }}
            >
              {showCreateForm
                ? 'close'
                : 'add'}
            </span>

            {showCreateForm
              ? 'Tutup Form'
              : 'Tambah User'}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="filter-search"
              className="block font-label-sm text-on-surface-variant mb-2"
            >
              Cari User
            </label>

            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                style={{
                  fontSize: '20px',
                }}
              >
                search
              </span>

              <input
                id="filter-search"
                name="search"
                type="text"
                value={filters.search}
                onChange={
                  handleFilterChange
                }
                placeholder="Nama atau email..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="filter-role"
              className="block font-label-sm text-on-surface-variant mb-2"
            >
              Role
            </label>

            <select
              id="filter-role"
              name="role"
              value={filters.role}
              onChange={
                handleFilterChange
              }
              disabled={loadingRoles}
              className="w-full h-11 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none disabled:opacity-60"
            >
              <option value="">
                Semua Role
              </option>

              {roles.map((role) => (
                <option
                  key={role.id}
                  value={role.name}
                >
                  {getRoleLabel(
                    role.name
                  )}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-status"
              className="block font-label-sm text-on-surface-variant mb-2"
            >
              Status
            </label>

            <select
              id="filter-status"
              name="status"
              value={filters.status}
              onChange={
                handleFilterChange
              }
              className="w-full h-11 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
            >
              <option value="">
                Semua Status
              </option>

              <option value="active">
                Aktif
              </option>

              <option value="inactive">
                Nonaktif
              </option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-label-sm text-on-surface-variant">
              Filter sedang aktif
              {filters.search.trim() &&
                ` • "${filters.search.trim()}"`}
            </p>

            <button
              type="button"
              onClick={
                handleResetFilters
              }
              className="self-start sm:self-auto text-sm text-primary hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
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

      {/* Create User Form */}
      {showCreateForm && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm p-6 mb-6"
        >
          <div className="mb-5">
            <h2 className="font-headline-md text-on-surface">
              Tambah User
            </h2>

            <p className="font-label-sm text-on-surface-variant mt-1">
              Buat akun baru untuk masyarakat,
              admin, atau super admin.
            </p>
          </div>

          <form
            onSubmit={handleCreateUser}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <label
                htmlFor="create-name"
                className="block font-label-md text-on-surface mb-2"
              >
                Nama
              </label>

              <input
                id="create-name"
                name="name"
                type="text"
                value={createForm.name}
                onChange={
                  handleCreateFormChange
                }
                placeholder="Nama lengkap"
                required
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="create-email"
                className="block font-label-md text-on-surface mb-2"
              >
                Email
              </label>

              <input
                id="create-email"
                name="email"
                type="email"
                value={createForm.email}
                onChange={
                  handleCreateFormChange
                }
                placeholder="nama@email.com"
                required
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="create-password"
                className="block font-label-md text-on-surface mb-2"
              >
                Password
              </label>

              <input
                id="create-password"
                name="password"
                type="password"
                value={createForm.password}
                onChange={
                  handleCreateFormChange
                }
                placeholder="Masukkan password"
                required
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="create-password-confirmation"
                className="block font-label-md text-on-surface mb-2"
              >
                Konfirmasi Password
              </label>

              <input
                id="create-password-confirmation"
                name="password_confirmation"
                type="password"
                value={
                  createForm.password_confirmation
                }
                onChange={
                  handleCreateFormChange
                }
                placeholder="Ulangi password"
                required
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="create-role"
                className="block font-label-md text-on-surface mb-2"
              >
                Role
              </label>

              <select
                id="create-role"
                name="role"
                value={createForm.role}
                onChange={
                  handleCreateFormChange
                }
                disabled={loadingRoles}
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none disabled:opacity-60"
              >
                {roles.map((role) => (
                  <option
                    key={role.id}
                    value={role.name}
                  >
                    {getRoleLabel(
                      role.name
                    )}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="create-status"
                className="block font-label-md text-on-surface mb-2"
              >
                Status Akun
              </label>

              <select
                id="create-status"
                name="is_active"
                value={
                  createForm.is_active
                    ? 'true'
                    : 'false'
                }
                onChange={(event) =>
                  setCreateForm(
                    (prev) => ({
                      ...prev,
                      is_active:
                        event.target
                          .value ===
                        'true',
                    })
                  )
                }
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              >
                <option value="true">
                  Aktif
                </option>

                <option value="false">
                  Nonaktif
                </option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={
                  creatingUser ||
                  loadingRoles
                }
                className="px-5 py-2.5 bg-primary text-white rounded-xl font-label-md flex items-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '20px',
                  }}
                >
                  {creatingUser
                    ? 'progress_activity'
                    : 'person_add'}
                </span>

                {creatingUser
                  ? 'Membuat...'
                  : 'Buat User'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreateForm(
                    initialCreateForm
                  );

                  setShowCreateForm(
                    false
                  );

                  clearMessages();
                }}
                disabled={creatingUser}
                className="px-5 py-2.5 border border-outline-variant rounded-xl text-on-surface-variant font-label-md hover:bg-surface-container-low transition-colors disabled:opacity-60"
              >
                Batal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Edit User Form */}
      {showEditForm && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm p-6 mb-6"
        >
          <div className="mb-5">
            <h2 className="font-headline-md text-on-surface">
              Edit User
            </h2>

            <p className="font-label-sm text-on-surface-variant mt-1">
              Ubah nama, email, atau password user.
            </p>
          </div>

          <form
            onSubmit={
              handleUpdateUser
            }
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <label
                htmlFor="edit-name"
                className="block font-label-md text-on-surface mb-2"
              >
                Nama
              </label>

              <input
                id="edit-name"
                name="name"
                type="text"
                value={editForm.name}
                onChange={
                  handleEditFormChange
                }
                required
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="edit-email"
                className="block font-label-md text-on-surface mb-2"
              >
                Email
              </label>

              <input
                id="edit-email"
                name="email"
                type="email"
                value={editForm.email}
                onChange={
                  handleEditFormChange
                }
                required
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="edit-password"
                className="block font-label-md text-on-surface mb-2"
              >
                Password Baru
              </label>

              <input
                id="edit-password"
                name="password"
                type="password"
                value={editForm.password}
                onChange={
                  handleEditFormChange
                }
                placeholder="Kosongkan jika tidak diubah"
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              />

              <p className="font-label-sm text-on-surface-variant mt-1">
                Opsional. Password lama tetap digunakan jika kosong.
              </p>
            </div>

            <div>
              <label
                htmlFor="edit-password-confirmation"
                className="block font-label-md text-on-surface mb-2"
              >
                Konfirmasi Password Baru
              </label>

              <input
                id="edit-password-confirmation"
                name="password_confirmation"
                type="password"
                value={
                  editForm.password_confirmation
                }
                onChange={
                  handleEditFormChange
                }
                placeholder="Ulangi password baru"
                disabled={
                  !editForm.password
                }
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none disabled:opacity-60"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={updatingUser}
                className="px-5 py-2.5 bg-primary text-white rounded-xl font-label-md flex items-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '20px',
                  }}
                >
                  {updatingUser
                    ? 'progress_activity'
                    : 'save'}
                </span>

                {updatingUser
                  ? 'Menyimpan...'
                  : 'Simpan Perubahan'}
              </button>

              <button
                type="button"
                onClick={
                  handleCloseEdit
                }
                disabled={updatingUser}
                className="px-5 py-2.5 border border-outline-variant rounded-xl text-on-surface-variant font-label-md hover:bg-surface-container-low transition-colors disabled:opacity-60"
              >
                Batal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-300">
            <thead className="bg-surface-container-low border-b border-outline-variant/20">
              <tr>
                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                  ID
                </th>

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                  Nama
                </th>

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                  Email
                </th>

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                  Role
                </th>

                <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                  Status
                </th>

                <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-on-surface-variant"
                  >
                    Memuat data user...
                  </td>
                </tr>
              ) : userList.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-on-surface-variant"
                  >
                    {hasActiveFilters
                      ? 'Tidak ada user yang sesuai dengan filter.'
                      : 'Belum ada user.'}
                  </td>
                </tr>
              ) : (
                userList.map((user) => {
                  const isSelf =
                    user.id ===
                    currentUser?.id;

                  const isImmutableSuperAdmin =
                    user.id ===
                    IMMUTABLE_SUPER_ADMIN_ID;

                  const roleLocked =
                    isImmutableSuperAdmin ||
                    isSelf;

                  const statusLocked =
                    isImmutableSuperAdmin ||
                    isSelf;

                  const deleteLocked =
                    isImmutableSuperAdmin ||
                    isSelf;

                  const isDeleting =
                    deletingUserId ===
                    user.id;

                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-outline-variant/10 transition-colors ${
                        isImmutableSuperAdmin
                          ? 'bg-purple-50/40'
                          : 'hover:bg-primary/5'
                      }`}
                    >
                      <td className="px-6 py-4 font-label-md font-semibold text-primary">
                        <div className="flex items-center gap-2">
                          <span>
                            #{user.id}
                          </span>

                          {isImmutableSuperAdmin && (
                            <span
                              className="material-symbols-outlined text-purple-600"
                              style={{
                                fontSize:
                                  '17px',
                              }}
                              title="Super Admin utama"
                            >
                              lock
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-label-md font-semibold text-on-surface">
                              {user.name}
                            </p>

                            {isImmutableSuperAdmin && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                                Akun Utama
                              </span>
                            )}
                          </div>

                          {isSelf && (
                            <span className="text-xs text-primary">
                              Akun Anda
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-label-sm text-on-surface">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={
                              user.role
                                ?.name ||
                              'user'
                            }
                            disabled={
                              roleLocked ||
                              updatingRoleId ===
                                user.id ||
                              loadingRoles
                            }
                            onChange={(
                              event
                            ) =>
                              handleRoleChange(
                                user.id,
                                event.target
                                  .value
                              )
                            }
                            className={`
                              px-3
                              py-2
                              rounded-lg
                              border
                              border-outline-variant/40
                              text-sm
                              outline-none
                              focus:border-primary
                              disabled:opacity-60
                              disabled:cursor-not-allowed
                              ${
                                roleColors[
                                  user.role
                                    ?.name
                                ] ||
                                'bg-gray-100 text-gray-700'
                              }
                            `}
                          >
                            {roles.map(
                              (role) => (
                                <option
                                  key={
                                    role.id
                                  }
                                  value={
                                    role.name
                                  }
                                >
                                  {getRoleLabel(
                                    role.name
                                  )}
                                </option>
                              )
                            )}
                          </select>

                          {isImmutableSuperAdmin && (
                            <span
                              className="material-symbols-outlined text-purple-600"
                              style={{
                                fontSize:
                                  '18px',
                              }}
                              title="Role terkunci"
                            >
                              lock
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={
                              statusLocked ||
                              updatingStatusId ===
                                user.id
                            }
                            onClick={() =>
                              handleStatusChange(
                                user.id,
                                !user.is_active
                              )
                            }
                            className={`
                              px-3
                              py-1.5
                              rounded-full
                              font-label-sm
                              transition-all
                              disabled:opacity-60
                              disabled:cursor-not-allowed
                              ${
                                user.is_active
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }
                            `}
                          >
                            {updatingStatusId ===
                            user.id
                              ? 'Memproses...'
                              : user.is_active
                                ? 'Aktif'
                                : 'Nonaktif'}
                          </button>

                          {isImmutableSuperAdmin && (
                            <span
                              className="material-symbols-outlined text-purple-600"
                              style={{
                                fontSize:
                                  '18px',
                              }}
                              title="Status terkunci"
                            >
                              lock
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-3">
                          {isImmutableSuperAdmin ? (
                            <span
                              className="inline-flex items-center gap-1 text-on-surface-variant/60 font-label-sm cursor-not-allowed"
                              title="Data Super Admin utama tidak dapat diubah"
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{
                                  fontSize:
                                    '18px',
                                }}
                              >
                                lock
                              </span>

                              Edit
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenEdit(
                                  user
                                )
                              }
                              className="inline-flex items-center gap-1 text-primary hover:underline font-label-sm"
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{
                                  fontSize:
                                    '18px',
                                }}
                              >
                                edit
                              </span>

                              Edit
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleViewDetail(
                                user.id
                              )
                            }
                            className="inline-flex items-center gap-1 text-primary hover:underline font-label-sm"
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{
                                fontSize:
                                  '18px',
                              }}
                            >
                              visibility
                            </span>

                            Detail
                          </button>

                          {deleteLocked ? (
                            <span
                              className="inline-flex items-center gap-1 text-on-surface-variant/40 font-label-sm cursor-not-allowed"
                              title={
                                isImmutableSuperAdmin
                                  ? 'Super Admin utama tidak dapat dihapus'
                                  : 'Anda tidak dapat menghapus akun sendiri'
                              }
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{
                                  fontSize:
                                    '18px',
                                }}
                              >
                                lock
                              </span>

                              Hapus
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={
                                isDeleting
                              }
                              onClick={() =>
                                handleDeleteUser(
                                  user
                                )
                              }
                              className="inline-flex items-center gap-1 text-error hover:underline font-label-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{
                                  fontSize:
                                    '18px',
                                }}
                              >
                                {isDeleting
                                  ? 'progress_activity'
                                  : 'delete'}
                              </span>

                              {isDeleting
                                ? 'Menghapus...'
                                : 'Hapus'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading &&
          pagination.last_page > 1 && (
            <div className="px-6 py-4 border-t border-outline-variant/20 flex items-center justify-between gap-4">
              <p className="font-label-sm text-on-surface-variant">
                Halaman{' '}
                {pagination.current_page}{' '}
                dari{' '}
                {pagination.last_page}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={
                    pagination.current_page ===
                    1
                  }
                  onClick={() =>
                    handlePageChange(
                      pagination.current_page -
                        1
                    )
                  }
                  className="px-3 py-2 rounded-lg border border-outline-variant/40 text-sm disabled:opacity-50"
                >
                  Sebelumnya
                </button>

                <button
                  type="button"
                  disabled={
                    pagination.current_page ===
                    pagination.last_page
                  }
                  onClick={() =>
                    handlePageChange(
                      pagination.current_page +
                        1
                    )
                  }
                  className="px-3 py-2 rounded-lg border border-outline-variant/40 text-sm disabled:opacity-50"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
      </div>

      {/* Delete Modal - Portal */}
      <DeleteUserModal
        user={deleteTarget}
        open={showDeleteModal}
        deleting={
          deletingUserId !== null
        }
        onClose={
          handleCloseDeleteModal
        }
        onConfirm={
          handleConfirmDelete
        }
        getRoleLabel={
          getRoleLabel
        }
      />

      {/* Detail Modal */}
      {(selectedUser ||
        detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/20"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
              <div>
                <h2 className="font-headline-md text-on-surface">
                  Detail User
                </h2>

                <p className="font-label-sm text-on-surface-variant mt-1">
                  Informasi akun pengguna
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="w-10 h-10 rounded-xl hover:bg-primary/10 text-on-surface-variant flex items-center justify-center"
                aria-label="Tutup"
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '22px',
                  }}
                >
                  close
                </span>
              </button>
            </div>

            {detailLoading ? (
              <div className="p-8 text-center text-on-surface-variant">
                Memuat detail user...
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <DetailRow
                  label="ID"
                  value={`#${selectedUser?.id}`}
                />

                <DetailRow
                  label="Nama"
                  value={
                    selectedUser?.name
                  }
                />

                <DetailRow
                  label="Email"
                  value={
                    selectedUser?.email
                  }
                />

                <DetailRow
                  label="Role"
                  value={getRoleLabel(
                    selectedUser
                      ?.role?.name
                  )}
                />

                <DetailRow
                  label="Status"
                  value={
                    selectedUser?.is_active
                      ? 'Aktif'
                      : 'Nonaktif'
                  }
                />

                <DetailRow
                  label="Tanggal dibuat"
                  value={
                    selectedUser?.created_at
                      ? new Date(
                          selectedUser.created_at
                        ).toLocaleString(
                          'id-ID'
                        )
                      : '-'
                  }
                />

                <DetailRow
                  label="Terakhir diperbarui"
                  value={
                    selectedUser?.updated_at
                      ? new Date(
                          selectedUser.updated_at
                        ).toLocaleString(
                          'id-ID'
                        )
                      : '-'
                  }
                />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-start justify-between gap-6 rounded-xl bg-surface-container-low px-4 py-3">
      <span className="font-label-sm text-on-surface-variant">
        {label}
      </span>

      <span className="font-label-md font-semibold text-on-surface text-right">
        {value || '-'}
      </span>
    </div>
  );
};

export default SuperAdminUsers;
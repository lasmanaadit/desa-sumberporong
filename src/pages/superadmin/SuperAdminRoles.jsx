// src/pages/superadmin/SuperAdminRoles.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const roleConfig = {
  superadmin: {
    label: 'Super Admin',
    color: 'bg-purple-100 text-purple-700',
    icon: 'admin_panel_settings',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  admin: {
    label: 'Admin',
    color: 'bg-blue-100 text-blue-700',
    icon: 'shield_person',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  user: {
    label: 'Masyarakat',
    color: 'bg-gray-100 text-gray-700',
    icon: 'person',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
  },
};

const SuperAdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchRoles = async () => {
      try {
        const response = await api.get('/superadmin/roles');

        if (!cancelled) {
          setRoles(response.data.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              'Gagal mengambil daftar role.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRoles();

    return () => {
      cancelled = true;
    };
  }, []);

  const getConfig = (roleName) => {
    return (
      roleConfig[roleName] || {
        label: roleName,
        color: 'bg-gray-100 text-gray-700',
        icon: 'person',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
      }
    );
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="font-headline-lg text-on-background">
            Role Management
          </h1>

          <p className="font-body-md text-on-surface-variant mt-1">
            Daftar role yang digunakan dalam sistem desa.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '20px' }}
          >
            shield
          </span>

          <span className="font-label-md">
            {roles.length} Role
          </span>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </motion.div>
      )}

      {/* Content */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="px-6 py-14 text-center text-on-surface-variant">
            Memuat daftar role...
          </div>
        ) : roles.length === 0 ? (
          <div className="px-6 py-14 text-center text-on-surface-variant">
            Belum ada role.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-180">
              <thead className="bg-surface-container-low border-b border-outline-variant/20">
                <tr>
                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                    ID
                  </th>

                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                    Role
                  </th>

                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                    Deskripsi
                  </th>

                  <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">
                    Dipakai Untuk
                  </th>
                </tr>
              </thead>

              <tbody>
                {roles.map((role) => {
                  const config = getConfig(role.name);

                  return (
                    <tr
                      key={role.id}
                      className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-6 py-5 font-label-md font-semibold text-primary">
                        #{role.id}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.iconBg} ${config.iconColor}`}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: '21px' }}
                            >
                              {config.icon}
                            </span>
                          </div>

                          <div>
                            <p className="font-label-md font-semibold text-on-surface">
                              {config.label}
                            </p>

                            <span
                              className={`inline-flex mt-1 px-2.5 py-1 rounded-full font-label-sm ${config.color}`}
                            >
                              {role.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 font-label-sm text-on-surface-variant max-w-lg">
                        {role.description || '-'}
                      </td>

                      <td className="px-6 py-5">
                        <RoleUsage roleName={role.name} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 rounded-2xl border border-primary/10 bg-primary/5 p-5">
        <div className="flex gap-3">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: '22px' }}
          >
            info
          </span>

          <div>
            <p className="font-label-md font-semibold text-on-background">
              Tentang Role
            </p>

            <p className="font-label-sm text-on-surface-variant mt-1 leading-6">
              Role menentukan hak akses pengguna di sistem. Perubahan
              role dilakukan melalui halaman Manajemen User.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoleUsage = ({ roleName }) => {
  switch (roleName) {
    case 'superadmin':
      return (
        <div>
          <p className="font-label-md font-semibold text-on-surface">
            Akses penuh sistem
          </p>
          <p className="font-label-sm text-on-surface-variant mt-1">
            Admin + Super Admin
          </p>
        </div>
      );

    case 'admin':
      return (
        <div>
          <p className="font-label-md font-semibold text-on-surface">
            Operasional desa
          </p>
          <p className="font-label-sm text-on-surface-variant mt-1">
            Pengajuan, UMKM, Pengaduan
          </p>
        </div>
      );

    case 'user':
      return (
        <div>
          <p className="font-label-md font-semibold text-on-surface">
            Masyarakat
          </p>
          <p className="font-label-sm text-on-surface-variant mt-1">
            Layanan administrasi desa
          </p>
        </div>
      );

    default:
      return (
        <p className="font-label-sm text-on-surface-variant">
          -
        </p>
      );
  }
};

export default SuperAdminRoles;
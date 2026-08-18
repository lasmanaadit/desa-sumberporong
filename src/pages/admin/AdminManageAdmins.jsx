// src/pages/admin/AdminManageAdmins.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Dummy data user
const dummyUsers = [
  { id: 1, name: 'Super Admin', email: 'superadmin@desa.id', role: 'superadmin', description: 'Super Administrator' },
  { id: 2, name: 'Admin Desa', email: 'admin@desa.id', role: 'admin', description: 'Admin Desa Sumberporong' },
  { id: 3, name: 'Warga Biasa', email: 'user@desa.id', role: 'user', description: 'Masyarakat umum' },
];

const AdminManageAdmins = () => {
  const [userList, setUserList] = useState(dummyUsers);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'user',
    description: '',
  });

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setForm({ name: '', email: '', role: 'user', description: '' });
    // Tampilkan form (modal) – kita gunakan inline form di bawah
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role, description: user.description });
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus user ini?')) {
      setUserList(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && currentId) {
      setUserList(prev => prev.map(u => u.id === currentId ? { ...form, id: u.id } : u));
    } else {
      setUserList(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setIsEditing(false);
    setCurrentId(null);
    setForm({ name: '', email: '', role: 'user', description: '' });
  };

  const roleColors = {
    superadmin: 'bg-purple-100 text-purple-700',
    admin: 'bg-blue-100 text-blue-700',
    user: 'bg-gray-100 text-gray-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">Kelola Admin</h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Kelola pengguna dan role (Superadmin, Admin, User).
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Tambah User
        </button>
      </div>

      {/* Form Modal (Inline) */}
      {(isEditing || form.name !== '' || form.email !== '') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 mb-6"
        >
          <h2 className="font-headline-md text-on-surface mb-4">
            {isEditing ? 'Edit User' : 'Tambah User'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-label-md mb-1">Nama</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-label-md mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-label-md mb-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            <div>
              <label className="block font-label-md mb-1">Deskripsi</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none"
                placeholder="Contoh: Admin Desa"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl">
                {isEditing ? 'Simpan' : 'Tambah'}
              </button>
              <button
                type="button"
                onClick={() => { setIsEditing(false); setForm({ name: '', email: '', role: 'user', description: '' }); }}
                className="px-4 py-2 border border-outline-variant rounded-xl text-on-surface-variant"
              >
                Batal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tabel User */}
      <div className="overflow-x-auto w-full">
        <table className="w-full">
          <thead className="bg-surface-container-low border-b border-outline-variant/20">
            <tr>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">ID</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Nama</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Email</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Role</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Deskripsi</th>
              <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.id} className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 font-label-md font-semibold text-primary">#{user.id}</td>
                <td className="px-6 py-4 font-label-md">{user.name}</td>
                <td className="px-6 py-4 font-label-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 rounded-full font-label-sm ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>
                    {user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4 font-label-sm">{user.description || '-'}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(user)} className="text-primary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="text-error hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageAdmins;
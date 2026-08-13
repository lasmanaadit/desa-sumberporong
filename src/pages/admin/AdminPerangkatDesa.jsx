// src/pages/admin/AdminPerangkatDesa.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminPerangkatDesa = () => {
  const [perangkatList, setPerangkatList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ nama: '', jabatan: '', foto: null });
  const [fotoPreview, setFotoPreview] = useState(null);

  const handleAdd = () => {
    setIsEditing(true);
    setCurrentId(null);
    setForm({ nama: '', jabatan: '', foto: null });
    setFotoPreview(null);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setForm({ nama: item.nama, jabatan: item.jabatan, foto: null });
    setFotoPreview(item.foto);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus perangkat desa ini?')) {
      setPerangkatList(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, foto: file });
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fotoPreview) return alert('Upload foto');
    if (isEditing && currentId) {
      setPerangkatList(prev => prev.map(p => p.id === currentId ? { ...p, nama: form.nama, jabatan: form.jabatan, foto: fotoPreview } : p));
    } else {
      setPerangkatList(prev => [...prev, { id: Date.now(), nama: form.nama, jabatan: form.jabatan, foto: fotoPreview }]);
    }
    setIsEditing(false);
    setCurrentId(null);
    setForm({ nama: '', jabatan: '', foto: null });
    setFotoPreview(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">Perangkat Desa</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Kelola daftar perangkat desa.</p>
        </div>
        <button onClick={handleAdd} className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined">add</span>
          Tambah Perangkat
        </button>
      </div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 mb-6"
        >
          <h2 className="font-headline-md text-on-surface mb-4">
            {currentId ? 'Edit Perangkat' : 'Tambah Perangkat'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-label-md mb-1">Foto</label>
              <input
                id="perangkatFileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById('perangkatFileInput').click()}
                className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2"
              >
                <span className="material-symbols-outlined">upload</span>
                Pilih Foto
              </button>
              {fotoPreview && <img src={fotoPreview} alt="Preview" className="mt-3 h-24 w-auto object-contain rounded" />}
            </div>
            <div>
              <label className="block font-label-md mb-1">Nama</label>
              <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" required />
            </div>
            <div>
              <label className="block font-label-md mb-1">Jabatan</label>
              <input type="text" value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" required />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl">{currentId ? 'Simpan' : 'Tambah'}</button>
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-outline-variant rounded-xl text-on-surface-variant">Batal</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-container-low border-b border-outline-variant/20">
            <tr>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Foto</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Nama</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Jabatan</th>
              <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {perangkatList.map((item) => (
              <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4">
                  <img src={item.foto} alt={item.nama} className="w-10 h-10 rounded-full object-cover" />
                </td>
                <td className="px-6 py-4 font-label-md">{item.nama}</td>
                <td className="px-6 py-4 font-label-sm">{item.jabatan}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-primary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-error hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPerangkatDesa;
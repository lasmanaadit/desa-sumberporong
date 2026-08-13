// src/pages/admin/AdminSambutan.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminSambutan = () => {
  const [sambutan, setSambutan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ nama: '', jabatan: '', text: '', foto: null });
  const [fotoPreview, setFotoPreview] = useState(null);

  const handleAdd = () => {
    setIsEditing(true);
    setForm({ nama: '', jabatan: '', text: '', foto: null });
    setFotoPreview(null);
  };

  const handleEdit = () => {
    if (sambutan) {
      setIsEditing(true);
      setForm({ ...sambutan });
      setFotoPreview(sambutan.foto);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Hapus sambutan?')) {
      setSambutan(null);
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
    if (!fotoPreview) return alert('Upload foto kepala desa');
    const data = { nama: form.nama, jabatan: form.jabatan, text: form.text, foto: fotoPreview };
    setSambutan(data);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">Sambutan Kepala Desa</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Kelola sambutan kepala desa (maksimal 1).</p>
        </div>
        {!sambutan ? (
          <button onClick={handleAdd} className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Tambah Sambutan
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleEdit} className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined">edit</span>
              Edit
            </button>
            <button onClick={handleDelete} className="px-4 py-2 bg-error text-white rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined">delete</span>
              Hapus
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 mb-6"
        >
          <h2 className="font-headline-md text-on-surface mb-4">Form Sambutan</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-label-md mb-1">Foto Kepala Desa</label>
              <input
                id="sambutanFileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById('sambutanFileInput').click()}
                className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2"
              >
                <span className="material-symbols-outlined">upload</span>
                Pilih Foto
              </button>
              {fotoPreview && <img src={fotoPreview} alt="Preview" className="mt-3 h-32 w-auto object-contain rounded" />}
            </div>
            <div>
              <label className="block font-label-md mb-1">Nama Kepala Desa</label>
              <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" required />
            </div>
            <div>
              <label className="block font-label-md mb-1">Jabatan</label>
              <input type="text" value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" required />
            </div>
            <div>
              <label className="block font-label-md mb-1">Teks Sambutan</label>
              <textarea rows="4" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none resize-none" required />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl">Simpan</button>
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-outline-variant rounded-xl text-on-surface-variant">Batal</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Preview jika ada */}
      {sambutan && (
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img src={sambutan.foto} alt="Kepala Desa" className="w-full h-auto rounded-xl shadow-sm" />
            </div>
            <div className="md:w-2/3">
              <h3 className="font-headline-md text-primary mb-2">Sambutan Kepala Desa</h3>
              <p className="font-body-md text-on-surface-variant italic leading-relaxed">{sambutan.text}</p>
              <div className="mt-4">
                <p className="font-headline-md text-on-surface">{sambutan.nama}</p>
                <p className="font-label-md text-primary">{sambutan.jabatan}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSambutan;
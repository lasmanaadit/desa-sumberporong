// src/pages/admin/AdminBerita.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminBerita = () => {
  const [beritaList, setBeritaList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ judul: '', deskripsi: '', gambar: null });
  const [gambarPreview, setGambarPreview] = useState(null);

  const handleAdd = () => {
    setIsEditing(true);
    setCurrentId(null);
    setForm({ judul: '', deskripsi: '', gambar: null });
    setGambarPreview(null);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setForm({ judul: item.judul, deskripsi: item.deskripsi, gambar: null });
    setGambarPreview(item.gambar);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus berita ini?')) {
      setBeritaList(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, gambar: file });
      const reader = new FileReader();
      reader.onloadend = () => setGambarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gambarPreview) return alert('Upload gambar');
    const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if (isEditing && currentId) {
      setBeritaList(prev => prev.map(b => b.id === currentId ? { ...b, judul: form.judul, deskripsi: form.deskripsi, gambar: gambarPreview } : b));
    } else {
      setBeritaList(prev => [...prev, { id: Date.now(), tanggal, judul: form.judul, deskripsi: form.deskripsi, gambar: gambarPreview }]);
    }
    setIsEditing(false);
    setCurrentId(null);
    setForm({ judul: '', deskripsi: '', gambar: null });
    setGambarPreview(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">Berita Desa</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Kelola berita desa.</p>
        </div>
        <button onClick={handleAdd} className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined">add</span>
          Tambah Berita
        </button>
      </div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 mb-6"
        >
          <h2 className="font-headline-md text-on-surface mb-4">
            {currentId ? 'Edit Berita' : 'Tambah Berita'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-label-md mb-1">Gambar</label>
              <input
                id="beritaFileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById('beritaFileInput').click()}
                className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2"
              >
                <span className="material-symbols-outlined">upload</span>
                Pilih Gambar
              </button>
              {gambarPreview && <img src={gambarPreview} alt="Preview" className="mt-3 h-32 w-auto object-contain rounded" />}
            </div>
            <div>
              <label className="block font-label-md mb-1">Judul</label>
              <input type="text" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" required />
            </div>
            <div>
              <label className="block font-label-md mb-1">Deskripsi</label>
              <textarea rows="4" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none resize-none" required />
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
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Tanggal</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Judul</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Deskripsi</th>
              <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {beritaList.map((berita) => (
              <tr key={berita.id} className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 font-label-sm">{berita.tanggal}</td>
                <td className="px-6 py-4 font-label-md font-semibold">{berita.judul}</td>
                <td className="px-6 py-4 font-label-sm line-clamp-2">{berita.deskripsi}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(berita)} className="text-primary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(berita.id)} className="text-error hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBerita;
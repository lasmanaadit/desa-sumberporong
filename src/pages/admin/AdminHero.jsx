// src/pages/admin/AdminHero.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminHero = () => {
  const [heroList, setHeroList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleAdd = () => {
    if (heroList.length >= 3) return; // sudah dicek di button
    setIsEditing(true);
    setCurrentId(null);
    setImagePreview(null);
    setFile(null);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setImagePreview(item.image);
    setFile(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus gambar hero ini?')) {
      setHeroList(prev => prev.filter(h => h.id !== id));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imagePreview) return alert('Pilih gambar terlebih dahulu');
    if (!isEditing && heroList.length >= 3) {
      alert('Maksimal 3 gambar hero');
      return;
    }
    if (isEditing && currentId) {
      setHeroList(prev => prev.map(h => h.id === currentId ? { ...h, image: imagePreview } : h));
    } else {
      setHeroList(prev => [...prev, { id: Date.now(), image: imagePreview }]);
    }
    setIsEditing(false);
    setCurrentId(null);
    setImagePreview(null);
    setFile(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">Hero Slider</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Kelola gambar hero (maksimal 3).</p>
        </div>
        {heroList.length < 3 && (
          <button onClick={handleAdd} className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Tambah Gambar
          </button>
        )}
      </div>

      {/* Form Modal */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 mb-6"
        >
          <h2 className="font-headline-md text-on-surface mb-4">
            {currentId ? 'Edit Gambar' : 'Tambah Gambar'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-label-md mb-1">Upload Gambar</label>
              <input
                id="heroFileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById('heroFileInput').click()}
                className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2"
              >
                <span className="material-symbols-outlined">upload</span>
                Pilih Gambar
              </button>
              {imagePreview && (
                <div className="mt-3">
                  <img src={imagePreview} alt="Preview" className="h-32 w-auto object-contain rounded" />
                  <button type="submit" className="mt-3 px-4 py-2 bg-primary text-white rounded-xl">
                    {currentId ? 'Simpan' : 'Tambah'}
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setImagePreview(null); setFile(null); }}
                className="px-4 py-2 border border-outline-variant rounded-xl text-on-surface-variant"
              >
                Batal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tabel */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-container-low border-b border-outline-variant/20">
            <tr>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">#</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Gambar</th>
              <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {heroList.map((hero, index) => (
              <tr key={hero.id} className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 font-label-md">{index + 1}</td>
                <td className="px-6 py-4">
                  <img src={hero.image} alt="Hero" className="h-12 w-auto object-contain rounded" />
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(hero)} className="text-primary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(hero.id)} className="text-error hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHero;
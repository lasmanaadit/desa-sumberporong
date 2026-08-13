// src/pages/admin/AdminStrukturOrganisasi.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminStrukturOrganisasi = () => {
  const [struktur, setStruktur] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!imagePreview) return alert('Pilih gambar');
    setStruktur(imagePreview);
    setImagePreview(null);
    setFile(null);
  };

  const handleDelete = () => {
    if (window.confirm('Hapus gambar struktur organisasi?')) {
      setStruktur(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">Struktur Organisasi</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Upload gambar struktur organisasi desa.</p>
        </div>
        {!struktur && (
          <button onClick={() => document.getElementById('strukturFileInput').click()} className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined">upload</span>
            Upload Gambar
          </button>
        )}
      </div>

      {struktur ? (
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 relative">
          <img src={struktur} alt="Struktur Organisasi" className="w-full h-auto rounded-xl" />
          <button onClick={handleDelete} className="absolute top-4 right-4 bg-error text-white p-2 rounded-full">
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 text-center">
          <p className="font-body-md text-on-surface-variant">Belum ada gambar struktur organisasi.</p>
          <form onSubmit={handleUpload} className="mt-4 space-y-4">
            <input
              id="strukturFileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {imagePreview && (
              <div className="mt-3">
                <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded" />
                <button type="submit" className="mt-3 px-4 py-2 bg-primary text-white rounded-xl">Simpan Gambar</button>
              </div>
            )}
            {!imagePreview && (
              <button type="button" onClick={() => document.getElementById('strukturFileInput').click()} className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined">upload</span>
                Pilih Gambar
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminStrukturOrganisasi;
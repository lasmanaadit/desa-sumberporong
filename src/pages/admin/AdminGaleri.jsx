// src/pages/admin/AdminGaleri.jsx
import React, { useState } from 'react';

const AdminGaleri = () => {
  const [galeriList, setGaleriList] = useState([]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGaleriList(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (index) => {
    if (window.confirm('Hapus gambar ini?')) {
      setGaleriList(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">Galeri Desa</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Kelola gambar galeri desa.</p>
        </div>
        <div>
          <input
            id="galeriInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => document.getElementById('galeriInput').click()}
            className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined">upload</span>
            Upload Gambar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galeriList.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-outline-variant/20 group">
            <img src={url} alt={`Galeri ${index+1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => handleDelete(index)}
              className="absolute top-2 right-2 bg-error text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGaleri;
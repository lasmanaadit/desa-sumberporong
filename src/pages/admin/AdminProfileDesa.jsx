// src/pages/admin/AdminProfileDesa.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminProfileDesa = () => {
  // State untuk data yang sudah disimpan (akan ditampilkan di preview)
  const [savedVisi, setSavedVisi] = useState('Terwujudnya Desa Sumberporong yang Mandiri, Sejahtera, dan Berbudaya melalui Tata Kelola Pemerintahan yang Baik dan Transparan.');
  const [savedMisi, setSavedMisi] = useState([
    'Meningkatkan kualitas pelayanan publik secara transparan dan akuntabel.',
    'Mendorong pemberdayaan ekonomi masyarakat berbasis potensi lokal.',
    'Meningkatkan kualitas infrastruktur desa untuk mendukung aktivitas warga.',
    'Melestarikan nilai-nilai budaya dan gotong royong dalam kehidupan bermasyarakat.',
  ]);

  // State untuk form input (bisa diedit)
  const [visiForm, setVisiForm] = useState(savedVisi);
  const [misiForm, setMisiForm] = useState(savedMisi);
  const [misiInput, setMisiInput] = useState('');

  // Galeri Kolonial
  const [colonialImages, setColonialImages] = useState([]);

  // Simpan Visi saja
  const handleSaveVisi = () => {
    setSavedVisi(visiForm);
    // Di sini nanti panggil API untuk menyimpan Visi ke database
    // alert('Visi berhasil disimpan!');
  };

  // Simpan Misi saja
  const handleSaveMisi = () => {
    setSavedMisi(misiForm);
    // Di sini nanti panggil API untuk menyimpan Misi ke database
    // alert('Misi berhasil disimpan!');
  };

  const handleAddMisi = () => {
    if (!misiInput.trim()) return;
    setMisiForm([...misiForm, misiInput.trim()]);
    setMisiInput('');
  };

  const handleRemoveMisi = (index) => {
    setMisiForm(prev => prev.filter((_, i) => i !== index));
  };

  const handleGaleriUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setColonialImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGaleriDelete = (index) => {
    if (window.confirm('Hapus gambar ini?')) {
      setColonialImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <h1 className="font-headline-lg text-on-background mb-2">Profil Desa</h1>
      <p className="font-body-md text-on-surface-variant mb-6">Kelola visi misi dan galeri era kolonial.</p>

      {/* Visi Misi */}
      <div className="mb-10">
        <h2 className="font-headline-md text-on-surface mb-4">Visi & Misi</h2>
        
        {/* Form Visi */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 mb-4">
          <label className="block font-label-md mb-1">Visi</label>
          <textarea
            rows="2"
            value={visiForm}
            onChange={(e) => setVisiForm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none resize-none"
            placeholder="Masukkan visi desa"
          />
          <div className="flex justify-end mt-2">
            <button onClick={handleSaveVisi} className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined">save</span>
              Simpan Visi
            </button>
          </div>
        </div>

        {/* Form Misi */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 mb-4">
          <label className="block font-label-md mb-1">Daftar Misi</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={misiInput}
              onChange={(e) => setMisiInput(e.target.value)}
              className="flex-1 h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none"
              placeholder="Tulis misi baru"
            />
            <button onClick={handleAddMisi} className="px-4 py-2 bg-primary text-white rounded-xl">Tambah Misi</button>
          </div>
          <ul className="mt-3 space-y-2">
            {misiForm.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl">
                <span className="font-body-md">{item}</span>
                <button onClick={() => handleRemoveMisi(idx)} className="text-error">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-2">
            <button onClick={handleSaveMisi} className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined">save</span>
              Simpan Misi
            </button>
          </div>
        </div>

        {/* Preview Visi & Misi (menampilkan data yang sudah disimpan) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">
            <h3 className="font-headline-md text-primary mb-2">Visi (Tersimpan)</h3>
            <p className="font-body-md text-on-surface-variant">{savedVisi}</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">
            <h3 className="font-headline-md text-primary mb-2">Misi (Tersimpan)</h3>
            <ul className="list-disc list-inside space-y-2 font-body-md text-on-surface-variant">
              {savedMisi.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Galeri Kolonial */}
      <div>
        <h2 className="font-headline-md text-on-surface mb-4">Galeri Era Kolonial</h2>
        <div className="mb-4">
          <input
            id="galeriKolonialInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleGaleriUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => document.getElementById('galeriKolonialInput').click()}
            className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined">upload</span>
            Upload Gambar
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {colonialImages.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-outline-variant/20 group">
              <img src={url} alt={`Kolonial ${index+1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => handleGaleriDelete(index)}
                className="absolute top-2 right-2 bg-error text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProfileDesa;
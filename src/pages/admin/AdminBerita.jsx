// src/pages/admin/AdminBerita.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaFacebook, FaInstagram, FaTiktok, FaWhatsapp, FaLink } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminBerita = () => {
  const [beritaList, setBeritaList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ judul: '', deskripsi: '', gambar: null });
  const [gambarPreview, setGambarPreview] = useState(null);
  const [previewBerita, setPreviewBerita] = useState(null); // untuk modal preview

  const navigate = useNavigate();

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

  // Fungsi preview
  const handlePreview = (berita) => {
    setPreviewBerita(berita);
  };

  const closePreview = () => {
    setPreviewBerita(null);
  };

  // Fungsi copy link (untuk modal preview)
  const copyLink = (url) => {
    navigator.clipboard.writeText(url);
    alert('Link berita berhasil disalin!');
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

      {/* Tabel Berita */}
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
                  <button onClick={() => handlePreview(berita)} className="text-primary hover:underline">Preview</button>
                  <button onClick={() => handleEdit(berita)} className="text-primary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(berita.id)} className="text-error hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Preview Berita (mirip BeritaDetailPage) */}
      {previewBerita && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={closePreview}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
              <h2 className="font-headline-md text-on-surface">Preview Berita</h2>
              <button onClick={closePreview} className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Konten berita (scrollable) */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="rounded-xl overflow-hidden shadow-sm mb-6">
                <img src={previewBerita.gambar} alt={previewBerita.judul} className="w-full h-64 object-cover" />
              </div>
              <h1 className="font-display-lg text-3xl font-bold text-primary mb-3">
                {previewBerita.judul}
              </h1>
              <p className="text-sm text-on-surface-variant mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">calendar_today</span>
                {previewBerita.tanggal}
              </p>
              <div className="prose max-w-none font-body-md text-on-surface-variant leading-relaxed">
                <p>{previewBerita.deskripsi}</p>
              </div>

              {/* Share Section (seperti di BeritaDetailPage) */}
              <div className="mt-10 pt-6 border-t border-outline-variant/20">
                <p className="font-label-md font-semibold text-on-surface mb-3">Bagikan berita ini:</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(previewBerita.judul)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1DA1F2] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <FaTwitter className="text-lg" />
                    Twitter
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1877F2] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <FaFacebook className="text-lg" />
                    Facebook
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link berita disalin! Anda bisa membagikannya di Instagram.');
                    }}
                    className="bg-[#E4405F] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <FaInstagram className="text-lg" />
                    Instagram
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link berita disalin! Anda bisa membagikannya di TikTok.');
                    }}
                    className="bg-[#000000] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <FaTiktok className="text-lg" />
                    TikTok
                  </button>
                  <button
                    onClick={() => copyLink(window.location.href)}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors"
                  >
                    <FaWhatsapp className="text-lg" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => copyLink(window.location.href)}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors"
                  >
                    <FaLink className="text-lg" />
                    Salin Link
                  </button>
                </div>
              </div>
            </div>

            {/* Footer modal */}
            <div className="px-6 py-4 border-t border-outline-variant/20 flex justify-end">
              <button onClick={closePreview} className="px-4 py-2 bg-primary text-white rounded-xl">Tutup</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminBerita;
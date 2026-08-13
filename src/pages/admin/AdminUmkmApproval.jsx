// src/pages/admin/AdminUmkmApproval.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Dummy data dengan multiple images
const dummyUmkm = [
  {
    id: 1,
    nama: 'Warung Makan Sumber Rejeki',
    pemilik: 'Andi Saputra',
    kategori: 'Makanan',
    harga_min: 10000,
    harga_max: 50000,
    status: 'pending',
    tanggal: '2026-08-12',
    deskripsi: 'Menyediakan masakan khas desa dengan bahan segar dari kebun sendiri.',
    alamat: 'Jl. Pasar No. 12, Sumberporong',
    jam_buka: '07:00',
    jam_tutup: '18:00',
    whatsapp: '628123456789',
    ecommerce: 'https://tokopedia.com/...',
    foto_utama: 'https://picsum.photos/seed/warung/600/400',
    foto_lain: [
      'https://picsum.photos/seed/warung1/600/400',
      'https://picsum.photos/seed/warung2/600/400',
      'https://picsum.photos/seed/warung3/600/400',
      'https://picsum.photos/seed/warung4/600/400',
    ],
  },
  // tambahkan data lain...
];

const AdminUmkmApproval = () => {
  const [umkmList, setUmkmList] = useState(dummyUmkm);
  const [selected, setSelected] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleApprove = (id) => {
    setUmkmList(prev => prev.map(item => item.id === id ? { ...item, status: 'approved' } : item));
    setSelected(null);
  };

  const handleReject = (id) => {
    setUmkmList(prev => prev.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
    setSelected(null);
  };

  // Carousel helpers
  const allPhotos = selected ? [selected.foto_utama, ...(selected.foto_lain || [])].slice(0, 5) : [];
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % allPhotos.length);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  return (
    <div>
      <h1 className="font-headline-lg text-on-background mb-2">UMKM Approval</h1>
      <p className="font-body-md text-on-surface-variant mb-6">Setujui atau tolak pengajuan UMKM.</p>

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-container-low border-b border-outline-variant/20">
            <tr>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Nama UMKM</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Pemilik</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Kategori</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Harga</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Status</th>
              <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {umkmList.map((item) => (
              <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 font-label-md font-semibold">{item.nama}</td>
                <td className="px-6 py-4 font-label-md">{item.pemilik}</td>
                <td className="px-6 py-4 font-label-sm">{item.kategori}</td>
                <td className="px-6 py-4 font-label-sm">Rp{item.harga_min.toLocaleString()} - Rp{item.harga_max.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 rounded-full font-label-sm ${
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status === 'pending' ? 'Menunggu' : item.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => { setSelected(item); setCurrentSlide(0); }} className="text-primary hover:underline">Preview</button>
                  {item.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(item.id)} className="text-green-600 hover:underline">Setujui</button>
                      <button onClick={() => handleReject(item.id)} className="text-error hover:underline">Tolak</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Preview dengan Carousel */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between">
              <h2 className="font-headline-md text-on-surface">Detail UMKM</h2>
              <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Carousel Gambar */}
                <div className="md:w-1/2">
                  {allPhotos.length > 0 && (
                    <div className="relative rounded-xl overflow-hidden bg-surface-container-high">
                      <img
                        src={allPhotos[currentSlide]}
                        alt={`Foto ${currentSlide + 1}`}
                        className="w-full h-64 md:h-80 object-cover"
                      />
                      {allPhotos.length > 1 && (
                        <>
                          <button
                            onClick={prevSlide}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                          >
                            <span className="material-symbols-outlined">chevron_left</span>
                          </button>
                          <button
                            onClick={nextSlide}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                          >
                            <span className="material-symbols-outlined">chevron_right</span>
                          </button>
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {allPhotos.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-4' : 'bg-white/50'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {/* Informasi Detail */}
                <div className="md:w-1/2">
                  <h3 className="font-headline-lg text-primary">{selected.nama}</h3>
                  <p className="font-body-md text-on-surface-variant mt-2">{selected.deskripsi}</p>
                  <dl className="mt-4 space-y-2">
                    <div className="flex"><dt className="w-24 font-label-sm text-on-surface-variant">Pemilik</dt><dd className="font-label-md">{selected.pemilik}</dd></div>
                    <div className="flex"><dt className="w-24 font-label-sm text-on-surface-variant">Kategori</dt><dd className="font-label-md">{selected.kategori}</dd></div>
                    <div className="flex"><dt className="w-24 font-label-sm text-on-surface-variant">Harga</dt><dd className="font-label-md">Rp{selected.harga_min.toLocaleString()} - Rp{selected.harga_max.toLocaleString()}</dd></div>
                    <div className="flex"><dt className="w-24 font-label-sm text-on-surface-variant">Alamat</dt><dd className="font-label-md">{selected.alamat}</dd></div>
                    <div className="flex"><dt className="w-24 font-label-sm text-on-surface-variant">Jam</dt><dd className="font-label-md">{selected.jam_buka} - {selected.jam_tutup}</dd></div>
                    <div className="flex"><dt className="w-24 font-label-sm text-on-surface-variant">WhatsApp</dt><dd className="font-label-md">{selected.whatsapp}</dd></div>
                    {selected.ecommerce && <div className="flex"><dt className="w-24 font-label-sm text-on-surface-variant">E-Commerce</dt><dd className="font-label-md"><a href={selected.ecommerce} target="_blank" rel="noopener noreferrer" className="text-primary underline">Link</a></dd></div>}
                  </dl>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-outline-variant/20 flex gap-3 justify-end">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border border-outline-variant rounded-xl text-on-surface-variant">Tutup</button>
              {selected.status === 'pending' && (
                <>
                  <button onClick={() => handleApprove(selected.id)} className="px-4 py-2 bg-green-600 text-white rounded-xl">Setujui</button>
                  <button onClick={() => handleReject(selected.id)} className="px-4 py-2 bg-error text-white rounded-xl">Tolak</button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminUmkmApproval;
// src/pages/admin/AdminPengaduan.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const dummyPengaduan = [
  {
    id: 1,
    subjek: 'Jalan Rusak di RT 03',
    deskripsi: 'Jalan utama di RT 03 berlubang dan membahayakan pengendara.',
    lokasi: 'Jl. Raya Sumberporong RT 03',
    namaPelapor: 'Andi Saputra',
    noTelepon: '081234567890',
    email: 'andi@email.com',
    fotoBukti: 'https://picsum.photos/seed/road/400/300', // gunakan URL gambar dummy
    status: 'Diproses',
    tanggal: '2026-08-12',
  },
  {
    id: 2,
    subjek: 'Lampu Penerangan Jalan Mati',
    deskripsi: 'Lampu di depan balai desa mati sejak 3 hari yang lalu.',
    lokasi: 'Depan Balai Desa Sumberporong',
    namaPelapor: 'Budi Santoso',
    noTelepon: '081234567891',
    email: 'budi@email.com',
    fotoBukti: 'https://picsum.photos/seed/lamp/400/300',
    status: 'Selesai',
    tanggal: '2026-08-10',
  },
];

const AdminPengaduan = () => {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('Diproses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State untuk preview gambar bukti (lightbox)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const [pengaduanList, setPengaduanList] = useState(dummyPengaduan);

  const filteredData = pengaduanList.filter(item => {
    if (activeTab === 'Diproses') return item.status === 'Diproses';
    return item.status === 'Selesai';
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Action handlers
  const handleSelesaikan = (id) => {
    setPengaduanList(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'Selesai' } : item
    ));
    setSelected(null);
  };

  const handleTolak = (id) => {
    // Bisa juga diubah statusnya menjadi 'Ditolak' atau 'Tidak Diproses'
    setPengaduanList(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'Selesai' } : item
    ));
    setSelected(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">Pengaduan Masyarakat</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Daftar pengaduan dari warga.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-outline-variant/20 pb-2">
        {['Diproses', 'Selesai'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-xl font-label-md transition-all ${activeTab === tab ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-primary/10'}`}
          >
            {tab} ({filteredData.length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full">
          <thead className="bg-surface-container-low border-b border-outline-variant/20">
            <tr>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">ID</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Subjek</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Pelapor</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Tanggal</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Status</th>
              <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 font-label-md font-semibold text-primary">#{item.id}</td>
                <td className="px-6 py-4 font-label-md">{item.subjek}</td>
                <td className="px-6 py-4 font-label-md">{item.namaPelapor}</td>
                <td className="px-6 py-4 font-label-sm">{item.tanggal}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 rounded-full font-label-sm ${item.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => setSelected(item)} className="text-primary hover:underline">Preview</button>
                  {activeTab === 'Diproses' && (
                    <>
                      <button onClick={() => handleSelesaikan(item.id)} className="text-green-600 hover:underline">Selesaikan</button>
                      <button onClick={() => handleTolak(item.id)} className="text-error hover:underline">Tolak</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 rounded-lg border border-outline-variant/30 hover:bg-primary/10 disabled:opacity-40">Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setCurrentPage(p)} className={`px-4 py-2 rounded-lg ${currentPage === p ? 'bg-primary text-white' : 'border border-outline-variant/30 hover:bg-primary/10'}`}>{p}</button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 rounded-lg border border-outline-variant/30 hover:bg-primary/10 disabled:opacity-40">Next</button>
        </div>
      )}

      {/* Preview Modal Pengaduan (dengan tombol Lihat Bukti) */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between">
              <h2 className="font-headline-md text-on-surface">Detail Pengaduan #{selected.id}</h2>
              <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-label-md font-semibold text-primary mb-3">Data Pengaduan</h3>
                  <dl className="space-y-2">
                    <div><dt className="font-label-sm text-on-surface-variant">Subjek</dt><dd className="font-label-md">{selected.subjek}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">Deskripsi</dt><dd className="font-label-md">{selected.deskripsi}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">Lokasi</dt><dd className="font-label-md">{selected.lokasi}</dd></div>
                  </dl>
                </div>
                <div>
                  <h3 className="font-label-md font-semibold text-primary mb-3">Data Pelapor</h3>
                  <dl className="space-y-2">
                    <div><dt className="font-label-sm text-on-surface-variant">Nama</dt><dd className="font-label-md">{selected.namaPelapor}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">No Telepon</dt><dd className="font-label-md">{selected.noTelepon}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">Email</dt><dd className="font-label-md">{selected.email}</dd></div>
                    <div>
                      <dt className="font-label-sm text-on-surface-variant">Foto Bukti</dt>
                      <dd>
                        {selected.fotoBukti ? (
                          <button
                            onClick={() => setImagePreviewUrl(selected.fotoBukti)}
                            className="text-primary underline font-label-md flex items-center gap-1 mt-1"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>image</span>
                            Lihat Bukti
                          </button>
                        ) : (
                          '-'
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-outline-variant/20 flex gap-3 justify-end">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border border-outline-variant rounded-xl text-on-surface-variant">Tutup</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Lightbox Modal untuk Preview Gambar Bukti */}
      {imagePreviewUrl && (
        <div
          className="fixed inset-0 z-999 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setImagePreviewUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={imagePreviewUrl}
              alt="Bukti Pengaduan"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setImagePreviewUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPengaduan;
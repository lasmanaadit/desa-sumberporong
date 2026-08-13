// src/pages/admin/AdminPengajuanSku.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const dummySku = [
  {
    id: 1,
    namaLengkap: 'Andi Saputra',
    nik: '1234567890123456',
    nomorKK: '1234567890123456',
    alamat: 'Jl. Merdeka No. 10, Sumberporong',
    rt: '001',
    rw: '002',
    kodePos: '65176',
    namaUsaha: 'Warung Makan Sumber Rejeki',
    jenisUsaha: 'Makanan & Minuman',
    deskripsiUsaha: 'Menyediakan masakan khas desa dengan bahan segar.',
    alamatUsaha: 'Pasar Desa Sumberporong',
    rtUsaha: '001',
    rwUsaha: '002',
    dokumen: { ktp: 'ktp_andi.pdf', kk: 'kk_andi.pdf', fotoUsaha: 'foto_warung.jpg' },
    status: 'Diproses',
    tanggal: '2026-08-12',
  },
  {
    id: 2,
    namaLengkap: 'Budi Santoso',
    nik: '1234567890123457',
    nomorKK: '1234567890123457',
    alamat: 'Jl. Kenangan No. 5',
    rt: '003',
    rw: '001',
    kodePos: '65176',
    namaUsaha: 'Kedai Kopi Sumberporong',
    jenisUsaha: 'Minuman',
    deskripsiUsaha: 'Kedai kopi dengan biji pilihan.',
    alamatUsaha: 'Ruko Sumberporong Blok A',
    rtUsaha: '003',
    rwUsaha: '001',
    dokumen: { ktp: 'ktp_budi.pdf', kk: 'kk_budi.pdf', fotoUsaha: 'foto_kopi.jpg' },
    status: 'Diproses', // masih diproses
    tanggal: '2026-08-10',
  },
  // tambahkan lebih banyak
];

const AdminPengajuanSku = () => {
  const [skuList, setSkuList] = useState(dummySku);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('Diproses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter data berdasarkan tab
  const filteredData = skuList.filter(item => {
    if (activeTab === 'Diproses') return item.status === 'Diproses';
    return item.status === 'Disetujui' || item.status === 'Ditolak';
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Handle approve/decline
  const handleApprove = (id) => {
    setSkuList(prev => prev.map(item => item.id === id ? { ...item, status: 'Disetujui' } : item));
    alert('Pengajuan SKU disetujui');
  };

  const handleDecline = (id) => {
    setSkuList(prev => prev.map(item => item.id === id ? { ...item, status: 'Ditolak' } : item));
    alert('Pengajuan SKU ditolak');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">Pengajuan SKU</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Daftar pengajuan Surat Keterangan Usaha.</p>
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
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-container-low border-b border-outline-variant/20">
            <tr>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">ID</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Pemohon</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Nama Usaha</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Tanggal</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Status</th>
              <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 font-label-md font-semibold text-primary">#{item.id}</td>
                <td className="px-6 py-4 font-label-md">{item.namaLengkap}</td>
                <td className="px-6 py-4 font-label-md">{item.namaUsaha}</td>
                <td className="px-6 py-4 font-label-sm">{item.tanggal}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 rounded-full font-label-sm ${
                    item.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
                    item.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => setSelected(item)} className="text-primary hover:underline">Preview</button>
                  {activeTab === 'Diproses' && (
                    <>
                      <button onClick={() => handleApprove(item.id)} className="text-green-600 hover:underline">Approve</button>
                      <button onClick={() => handleDecline(item.id)} className="text-error hover:underline">Decline</button>
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

      {/* Preview Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between">
              <h2 className="font-headline-md text-on-surface">Detail SKU #{selected.id}</h2>
              <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-label-md font-semibold text-primary mb-3">Data Pemohon</h3>
                  <dl className="space-y-2">
                    <div><dt className="font-label-sm text-on-surface-variant">Nama</dt><dd className="font-label-md">{selected.namaLengkap}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">NIK</dt><dd className="font-label-md">{selected.nik}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">No KK</dt><dd className="font-label-md">{selected.nomorKK}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">Alamat</dt><dd className="font-label-md">{selected.alamat}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">RT / RW</dt><dd className="font-label-md">{selected.rt} / {selected.rw}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">Kode Pos</dt><dd className="font-label-md">{selected.kodePos}</dd></div>
                  </dl>
                </div>
                <div>
                  <h3 className="font-label-md font-semibold text-primary mb-3">Data Usaha</h3>
                  <dl className="space-y-2">
                    <div><dt className="font-label-sm text-on-surface-variant">Nama Usaha</dt><dd className="font-label-md">{selected.namaUsaha}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">Jenis Usaha</dt><dd className="font-label-md">{selected.jenisUsaha}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">Deskripsi</dt><dd className="font-label-md">{selected.deskripsiUsaha}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">Alamat Usaha</dt><dd className="font-label-md">{selected.alamatUsaha}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">RT / RW Usaha</dt><dd className="font-label-md">{selected.rtUsaha} / {selected.rwUsaha}</dd></div>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-label-md font-semibold text-primary mb-2">Dokumen Pendukung</h3>
                <ul className="space-y-1">
                  {Object.entries(selected.dokumen).map(([key, value]) => (
                    <li key={key} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">description</span>
                      <button
                        onClick={() => window.open(`https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`, '_blank')}
                        className="text-primary underline font-label-md hover:text-primary-container transition-colors"
                      >
                        {value}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-outline-variant/20 flex gap-3 justify-end">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border border-outline-variant rounded-xl text-on-surface-variant">Tutup</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPengajuanSku;
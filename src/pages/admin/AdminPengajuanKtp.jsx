// src/pages/admin/AdminPengajuanKtp.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const dummyKtp = [
  { id: 1, jenis: 'Baru', nama: 'Andi Saputra', nik: '1234567890123456', kk: '1234567890123456', alamat: 'Jl. Merdeka No. 10', rt: '001', rw: '002', kodePos: '65176', dokumen: { kk: 'kk_andia.pdf', akte: 'akte_andia.pdf', usia: 'pernyataan.pdf' }, status: 'Diproses', tanggal: '2026-08-12' },
  { id: 2, jenis: 'Perpanjangan', nama: 'Budi Santoso', nik: '1234567890123457', kk: '1234567890123457', alamat: 'Jl. Kenangan No. 5', rt: '003', rw: '001', kodePos: '65176', dokumen: { ktpLama: 'ktp_budi.pdf', kk: 'kk_budi.pdf', pengantarRt: 'pengantar_budi.pdf' }, status: 'Disetujui', tanggal: '2026-08-10' },
  { id: 3, jenis: 'Hilang', nama: 'Siti Rahma', nik: '1234567890123458', kk: '1234567890123458', alamat: 'Jl. Pasar No. 2', rt: '002', rw: '003', kodePos: '65176', dokumen: { kk: 'kk_siti.pdf', suratKehilangan: 'kehilangan_siti.pdf', pengantarRtRw: 'pengantar_siti.pdf' }, status: 'Menunggu', tanggal: '2026-08-08' },
  { id: 4, jenis: 'Baru', nama: 'Joko Widodo', nik: '1234567890123459', kk: '1234567890123459', alamat: 'Jl. Gotong Royong No. 1', rt: '004', rw: '004', kodePos: '65176', dokumen: { kk: 'kk_joko.pdf', akte: 'akte_joko.pdf', usia: 'pernyataan_joko.pdf' }, status: 'Ditolak', tanggal: '2026-08-05' },
  // tambahkan lebih banyak untuk pagination
];

const AdminPengajuanKtp = () => {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('Diproses'); // 'Diproses' or 'Selesai'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter data berdasarkan tab
  const filteredData = dummyKtp.filter(item => {
    if (activeTab === 'Diproses') return item.status === 'Diproses' || item.status === 'Menunggu';
    return item.status === 'Disetujui' || item.status === 'Ditolak';
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Handle approve/decline
  const handleApprove = (id) => { /* API call */ alert('Pengajuan disetujui'); };
  const handleDecline = (id) => { /* API call */ alert('Pengajuan ditolak'); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">Pengajuan KTP</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Daftar pengajuan surat pengantar KTP.</p>
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
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Nama</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Jenis</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Tanggal</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Status</th>
              <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 font-label-md font-semibold text-primary">#{item.id}</td>
                <td className="px-6 py-4 font-label-md">{item.nama}</td>
                <td className="px-6 py-4 font-label-sm">{item.jenis}</td>
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
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-4 py-2 rounded-lg border border-outline-variant/30 hover:bg-primary/10 disabled:opacity-40"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-4 py-2 rounded-lg ${currentPage === p ? 'bg-primary text-white' : 'border border-outline-variant/30 hover:bg-primary/10'}`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-2 rounded-lg border border-outline-variant/30 hover:bg-primary/10 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Preview Modal (sama seperti sebelumnya, disesuaikan field) */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between">
              <h2 className="font-headline-md text-on-surface">Detail KTP #{selected.id}</h2>
              <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-label-md font-semibold text-primary mb-3">Data Pemohon</h3>
                  <dl className="space-y-2">
                    <div><dt className="font-label-sm text-on-surface-variant">Nama</dt><dd className="font-label-md">{selected.nama}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">NIK</dt><dd className="font-label-md">{selected.nik}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">No KK</dt><dd className="font-label-md">{selected.kk}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">Alamat</dt><dd className="font-label-md">{selected.alamat}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">RT / RW</dt><dd className="font-label-md">{selected.rt} / {selected.rw}</dd></div>
                    <div><dt className="font-label-sm text-on-surface-variant">Kode Pos</dt><dd className="font-label-md">{selected.kodePos}</dd></div>
                  </dl>
                </div>
                <div>
                <h3 className="font-label-md font-semibold text-primary mb-3">Dokumen</h3>
                    <ul className="space-y-2">
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

export default AdminPengajuanKtp;
// src/pages/admin/AdminKritikSaran.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Dummy data kritik dan saran (sesuai form KritikSaran)
const dummyKritikSaran = [
  {
    id: 1,
    nama: 'Andi Saputra',
    email: 'andi@email.com',
    pesan: 'Pelayanan desa sudah sangat baik, tetapi perlu ditambah jam operasional di akhir pekan.',
    tanggal: '2026-08-15',
  },
  {
    id: 2,
    nama: 'Budi Santoso',
    email: 'budi@email.com',
    pesan: 'Mohon perbaikan jalan di RT 03 yang rusak parah.',
    tanggal: '2026-08-14',
  },
  {
    id: 3,
    nama: 'Siti Rahma',
    email: 'siti@email.com',
    pesan: 'Terima kasih atas pelayanan yang cepat dan ramah.',
    tanggal: '2026-08-12',
  },
];

const AdminKritikSaran = () => {
  const [kritikList, setKritikList] = useState(dummyKritikSaran);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination
  const totalPages = Math.ceil(kritikList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = kritikList.slice(startIndex, startIndex + itemsPerPage);

  // Hapus data (opsional)
  const handleDelete = (id) => {
    if (window.confirm('Hapus kritik dan saran ini?')) {
      setKritikList(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">Kritik & Saran</h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Daftar kritik dan saran dari masyarakat.
          </p>
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto w-full">
        <table className="w-full">
          <thead className="bg-surface-container-low border-b border-outline-variant/20">
            <tr>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">No</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Nama Lengkap</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Email</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Pesan / Saran</th>
              <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Tanggal</th>
              <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 font-label-md">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="px-6 py-4 font-label-md">{item.nama}</td>
                <td className="px-6 py-4 font-label-sm">{item.email}</td>
                <td className="px-6 py-4 font-label-sm line-clamp-2">{item.pesan}</td>
                <td className="px-6 py-4 font-label-sm">{item.tanggal}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(item.id)} className="text-error hover:underline">
                    Hapus
                  </button>
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

      {/* Jika tidak ada data */}
      {kritikList.length === 0 && (
        <div className="text-center py-10">
          <p className="font-body-md text-on-surface-variant">Belum ada kritik dan saran.</p>
        </div>
      )}
    </div>
  );
};

export default AdminKritikSaran;
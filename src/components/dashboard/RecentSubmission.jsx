// src/components/dashboard/RecentSubmission.jsx
import React from 'react';
import { motion } from 'framer-motion';

const RecentSubmission = () => {
  const submissions = [
    {
      id: 1,
      layanan: 'Surat Pengantar KTP',
      tanggal: '12 Agustus 2026',
      status: 'Diproses',
      statusClass: 'bg-blue-100 text-blue-700',
    },
    {
      id: 2,
      layanan: 'Surat Keterangan Usaha',
      tanggal: '10 Agustus 2026',
      status: 'Selesai',
      statusClass: 'bg-green-100 text-green-700',
    },
    {
      id: 3,
      layanan: 'Surat Keterangan Domisili',
      tanggal: '08 Agustus 2026',
      status: 'Menunggu',
      statusClass: 'bg-yellow-100 text-yellow-700',
    },
  ];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between">
        <div>
          <h2 className="font-headline-md text-on-surface text-lg">
            Pengajuan Terbaru
          </h2>

          <p className="font-label-sm text-on-surface-variant tracking-normal mt-1">
            Pantau status pengajuan administrasi Anda.
          </p>
        </div>

        <button className="text-primary font-label-md hover:underline">
          Lihat semua
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-outline-variant/20">
        {submissions.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ backgroundColor: 'rgba(0, 101, 44, 0.03)' }}
            className="px-6 py-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '21px' }}
                >
                  description
                </span>
              </div>

              <div>
                <p className="font-label-md font-semibold text-on-surface">
                  {item.layanan}
                </p>

                <p className="font-label-sm text-on-surface-variant tracking-normal mt-1">
                  {item.tanggal}
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1.5 rounded-full font-label-sm tracking-normal whitespace-nowrap ${item.statusClass}`}
            >
              {item.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentSubmission;
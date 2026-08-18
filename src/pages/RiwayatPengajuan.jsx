// src/pages/RiwayatPengajuan.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';

// Data dummy yang diperkaya dengan field lebih detail
const pengajuanData = [
  {
    id: 'ADM-001',
    jenis: 'Surat Pengantar KTP',
    tanggal: '12 Agustus 2026',
    status: 'Disetujui',
    keterangan: 'Pengajuan telah disetujui. Silakan datang ke Balai Desa.',
    namaPemohon: 'Andi Saputra',
    nik: '1234567890123456',
    alamat: 'Jl. Merdeka No. 10, Sumberporong',
    rt: '001',
    rw: '002',
    kodePos: '65176',
    jenisPermohonan: 'baru',
    tempatLahir: 'Malang',
    tanggalLahir: '12/08/2000',
    jenisKelamin: 'Laki-laki',
  },
  {
    id: 'ADM-002',
    jenis: 'Surat Keterangan Usaha',
    tanggal: '10 Agustus 2026',
    status: 'Diproses',
    keterangan: 'Pengajuan sedang diperiksa oleh perangkat desa.',
    namaPemohon: 'Budi Santoso',
    nik: '1234567890123457',
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
    tempatLahir: 'Surabaya',
    tanggalLahir: '05/11/1995',
    jenisKelamin: 'Laki-laki',
  },
  {
    id: 'ADM-003',
    jenis: 'Surat Keterangan Domisili',
    tanggal: '05 Agustus 2026',
    status: 'Menunggu',
    keterangan: 'Menunggu pemeriksaan pengajuan.',
    namaPemohon: 'Siti Rahma',
    nik: '1234567890123458',
    alamat: 'Jl. Pasar No. 2',
    rt: '002',
    rw: '003',
    kodePos: '65176',
    tempatLahir: 'Jakarta',
    tanggalLahir: '20/03/1998',
    jenisKelamin: 'Perempuan',
  },
  {
    id: 'ADM-004',
    jenis: 'Surat Keterangan Usaha',
    tanggal: '28 Juli 2026',
    status: 'Ditolak',
    keterangan: 'Data yang diberikan belum lengkap.',
    namaPemohon: 'Joko Widodo',
    nik: '1234567890123459',
    alamat: 'Jl. Gotong Royong No. 1',
    rt: '004',
    rw: '004',
    kodePos: '65176',
    namaUsaha: 'Warung Makan Sumber Rejeki',
    jenisUsaha: 'Makanan & Minuman',
    deskripsiUsaha: 'Menyediakan masakan khas desa.',
    alamatUsaha: 'Pasar Desa Sumberporong',
    rtUsaha: '004',
    rwUsaha: '004',
    tempatLahir: 'Yogyakarta',
    tanggalLahir: '10/01/2005',
    jenisKelamin: 'Laki-laki',
  },
  {
    id: 'ADM-005',
    jenis: 'Surat Pengantar KTP',
    tanggal: '20 Juli 2026',
    status: 'Disetujui',
    keterangan: 'Pengajuan telah disetujui.',
    namaPemohon: 'Dewi Lestari',
    nik: '1234567890123450',
    alamat: 'Jl. Indah No. 3',
    rt: '005',
    rw: '005',
    kodePos: '65176',
    jenisPermohonan: 'perpanjangan',
    tempatLahir: 'Bandung',
    tanggalLahir: '15/09/1990',
    jenisKelamin: 'Perempuan',
  },
];

const statusStyle = {
  Menunggu: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'schedule' },
  Diproses: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'sync' },
  Disetujui: { bg: 'bg-green-100', text: 'text-green-700', icon: 'check_circle' },
  Ditolak: { bg: 'bg-red-100', text: 'text-red-700', icon: 'cancel' },
};

const RiwayatPengajuan = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('Semua');
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);

  const filteredData =
    filter === 'Semua'
      ? pengajuanData
      : pengajuanData.filter((item) => item.status === filter);

  // Fungsi untuk menampilkan detail sesuai jenis pengajuan
  const renderDetailFields = (item) => {
    // Field umum
    const commonFields = [
      { label: 'Nama Pemohon', value: item.namaPemohon },
      { label: 'NIK', value: item.nik },
      { label: 'Alamat', value: item.alamat },
      { label: 'RT / RW', value: `${item.rt} / ${item.rw}` },
      { label: 'Kode Pos', value: item.kodePos },
      { label: 'Tempat Lahir', value: item.tempatLahir },
      { label: 'Tanggal Lahir', value: item.tanggalLahir },
      { label: 'Jenis Kelamin', value: item.jenisKelamin },
    ];

    if (item.jenis === 'Surat Pengantar KTP') {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonFields.map((field, idx) => (
              <div key={idx}>
                <dt className="font-label-sm text-on-surface-variant">{field.label}</dt>
                <dd className="font-label-md">{field.value}</dd>
              </div>
            ))}
            <div>
              <dt className="font-label-sm text-on-surface-variant">Jenis Permohonan</dt>
              <dd className="font-label-md capitalize">{item.jenisPermohonan || '-'}</dd>
            </div>
          </div>
        </>
      );
    } else if (item.jenis === 'Surat Keterangan Usaha') {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonFields.map((field, idx) => (
              <div key={idx}>
                <dt className="font-label-sm text-on-surface-variant">{field.label}</dt>
                <dd className="font-label-md">{field.value}</dd>
              </div>
            ))}
            <div>
              <dt className="font-label-sm text-on-surface-variant">Nama Usaha</dt>
              <dd className="font-label-md">{item.namaUsaha}</dd>
            </div>
            <div>
              <dt className="font-label-sm text-on-surface-variant">Jenis Usaha</dt>
              <dd className="font-label-md">{item.jenisUsaha}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="font-label-sm text-on-surface-variant">Deskripsi Usaha</dt>
              <dd className="font-label-md">{item.deskripsiUsaha}</dd>
            </div>
            <div>
              <dt className="font-label-sm text-on-surface-variant">Alamat Usaha</dt>
              <dd className="font-label-md">{item.alamatUsaha}</dd>
            </div>
            <div>
              <dt className="font-label-sm text-on-surface-variant">RT / RW Usaha</dt>
              <dd className="font-label-md">{item.rtUsaha} / {item.rwUsaha}</dd>
            </div>
          </div>
        </>
      );
    } else {
      // Surat Keterangan Domisili atau lainnya
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonFields.map((field, idx) => (
            <div key={idx}>
              <dt className="font-label-sm text-on-surface-variant">{field.label}</dt>
              <dd className="font-label-md">{field.value}</dd>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 min-w-0">
        <Topbar setIsOpen={setIsSidebarOpen} />
        <main className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header & Filter (sama seperti sebelumnya) */}
          <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-8">
            <h1 className="font-headline-lg text-on-background">Riwayat Pengajuan</h1>
            <p className="font-body-md text-on-surface-variant mt-2">Lihat status dan riwayat pengajuan administrasi yang telah Anda lakukan.</p>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-on-surface text-lg">Daftar Pengajuan</h2>
                <p className="font-label-sm text-on-surface-variant tracking-normal mt-1">{filteredData.length} pengajuan ditemukan</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Semua', 'Menunggu', 'Diproses', 'Disetujui', 'Ditolak'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`px-4 py-2 rounded-xl font-label-md transition-all duration-200 ${
                      filter === item ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Table - Desktop */}
          <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden">
            {/* ... kode tabel desktop dan mobile card sama seperti sebelumnya, tapi ubah kolom Aksi: hapus tombol Lihat Surat, hanya Detail */}
            {/* Detail: Kita hanya ubah bagian aksi */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20">
                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">ID Pengajuan</th>
                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Jenis Pengajuan</th>
                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Tanggal</th>
                    <th className="text-left px-6 py-4 font-label-sm text-on-surface-variant">Status</th>
                    <th className="text-right px-6 py-4 font-label-sm text-on-surface-variant">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => {
                    const status = statusStyle[item.status];
                    return (
                      <motion.tr key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-5"><span className="font-label-md font-semibold text-primary">{item.id}</span></td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                              <span className="material-symbols-outlined" style={{ fontSize: '21px' }}>description</span>
                            </div>
                            <div>
                              <p className="font-label-md font-semibold text-on-surface">{item.jenis}</p>
                              <p className="font-label-sm text-on-surface-variant tracking-normal mt-1">Administrasi Desa</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined" style={{ fontSize: '19px' }}>calendar_today</span>
                            <span className="font-label-md">{item.tanggal}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${status.bg} ${status.text} font-label-sm tracking-normal`}>
                            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>{status.icon}</span>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setSelectedPengajuan(item)} className="px-4 py-2 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all font-label-md">Detail</button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards - Hapus tombol Lihat Surat */}
            <div className="lg:hidden p-4 space-y-4">
              {filteredData.map((item, index) => {
                const status = statusStyle[item.status];
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="border border-outline-variant/20 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-label-sm text-primary tracking-normal">{item.id}</p>
                        <h3 className="font-label-md font-semibold text-on-surface mt-1">{item.jenis}</h3>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full ${status.bg} ${status.text} font-label-sm tracking-normal whitespace-nowrap`}>{item.status}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-on-surface-variant">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_today</span>
                      <span className="font-label-sm tracking-normal">{item.tanggal}</span>
                    </div>
                    <button onClick={() => setSelectedPengajuan(item)} className="w-full mt-4 py-2.5 rounded-xl border border-outline-variant/30 font-label-md text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all">Lihat Detail</button>
                  </motion.div>
                );
              })}
            </div>

            {filteredData.length === 0 && (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>inbox</span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface">Belum ada pengajuan</h3>
                <p className="font-body-md text-on-surface-variant mt-2">Tidak ada pengajuan dengan status tersebut.</p>
              </div>
            )}
          </motion.section>
        </main>
      </div>

      {/* DETAIL MODAL - Sekarang menampilkan field lengkap seperti preview KTP/SKU */}
      {selectedPengajuan && (
        <div className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedPengajuan(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-4xl bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between">
              <div>
                <p className="font-label-sm text-primary tracking-normal">{selectedPengajuan.id}</p>
                <h2 className="font-headline-md text-xl text-on-surface mt-1">Detail Pengajuan</h2>
              </div>
              <button onClick={() => setSelectedPengajuan(null)} className="w-9 h-9 rounded-full hover:bg-primary/10 text-on-surface-variant hover:text-primary flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Header status */}
              <div className="mb-4">
                <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${statusStyle[selectedPengajuan.status].bg} ${statusStyle[selectedPengajuan.status].text} font-label-sm tracking-normal`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>{statusStyle[selectedPengajuan.status].icon}</span>
                  {selectedPengajuan.status}
                </span>
                <p className="font-label-sm text-on-surface-variant mt-2">Tanggal pengajuan: {selectedPengajuan.tanggal}</p>
              </div>

              {/* Detail fields sesuai jenis */}
              <div className="mt-4">
                <h3 className="font-label-md font-semibold text-primary mb-3">Data Pengajuan</h3>
                <dl className="space-y-3">
                  {renderDetailFields(selectedPengajuan)}
                </dl>
              </div>

              {/* Keterangan */}
              <div className="mt-4 bg-primary/5 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>info</span>
                  <p className="font-body-md text-on-surface-variant">{selectedPengajuan.keterangan}</p>
                </div>
              </div>

              {/* Untuk pengajuan disetujui, info tambahan */}
              {selectedPengajuan.status === 'Disetujui' && (
                <div className="mt-4 border border-green-200 bg-green-50 rounded-xl p-4">
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-green-600" style={{ fontSize: '22px' }}>check_circle</span>
                    <div>
                      <p className="font-label-md font-semibold text-green-700">Pengajuan Disetujui</p>
                      <p className="font-label-sm text-green-700/80 tracking-normal mt-1">Silakan datang ke Balai Desa untuk mengambil surat pengantar yang telah disiapkan.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-outline-variant/20 flex justify-end">
              <button onClick={() => setSelectedPengajuan(null)} className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors">Tutup</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RiwayatPengajuan;
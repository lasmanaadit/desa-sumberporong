// src/pages/LayananDetailPage.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Data seluruh layanan (bisa dipindah ke file terpisah jika perlu)
const layananData = [
  {
    slug: 'surat-pengantar-nikah',
    title: 'Surat Pengantar Nikah',
    description: 'Surat keterangan dari desa untuk keperluan pernikahan di Kantor Urusan Agama (KUA).',
    steps: [
      'Datang ke kantor desa dengan membawa fotokopi KTP dan KK.',
      'Mengisi formulir permohonan surat pengantar nikah.',
      'Menyerahkan formulir dan dokumen pendukung ke petugas.',
      'Menunggu proses verifikasi data oleh perangkat desa.',
      'Surat dapat diambil setelah 1-2 hari kerja.',
    ],
    requirements: [
      'Fotokopi KTP kedua calon mempelai',
      'Fotokopi Kartu Keluarga (KK)',
      'Fotokopi Akta Kelahiran',
      'Pas foto 3x4 masing-masing 2 lembar',
    ],
    estimatedTime: '1-2 hari kerja',
    icon: 'favorite',
  },
  {
    slug: 'surat-kematian',
    title: 'Surat Kematian',
    description: 'Surat keterangan kematian yang dikeluarkan oleh desa untuk keperluan administrasi.',
    steps: [
      'Melapor ke ketua RT/RW setempat.',
      'Membawa surat keterangan kematian dari RT/RW ke kantor desa.',
      'Menyerahkan fotokopi KTP dan KK almarhum.',
      'Petugas desa menerbitkan surat kematian.',
      'Surat dapat diambil pada hari yang sama.',
    ],
    requirements: [
      'Surat keterangan kematian dari RT/RW',
      'Fotokopi KTP almarhum',
      'Fotokopi Kartu Keluarga (KK)',
      'Fotokopi KTP pelapor',
    ],
    estimatedTime: '1 hari',
    icon: 'description',
  },
  {
    slug: 'pindah-datang',
    title: 'Pindah Datang',
    description: 'Surat keterangan pindah datang dari desa asal untuk penduduk baru.',
    steps: [
      'Membawa surat pengantar pindah dari desa asal.',
      'Mendatangi kantor desa tujuan dengan membawa dokumen.',
      'Mengisi formulir pindah datang.',
      'Melampirkan fotokopi KTP dan KK.',
      'Proses penerbitan surat keterangan datang.',
    ],
    requirements: [
      'Surat pengantar pindah dari desa asal',
      'Fotokopi KTP semua anggota keluarga',
      'Fotokopi Kartu Keluarga (KK) lama',
      'Fotokopi Akta Kelahiran anak (jika ada)',
    ],
    estimatedTime: '2-3 hari kerja',
    icon: 'move_up',
  },
  {
    slug: 'kartu-keluarga',
    title: 'Kartu Keluarga (KK)',
    description: 'Pembuatan atau perubahan Kartu Keluarga untuk penduduk desa.',
    steps: [
      'Mengisi formulir permohonan KK baru/perubahan.',
      'Melampirkan fotokopi KTP seluruh anggota keluarga.',
      'Menyerahkan KK lama (jika perubahan).',
      'Petugas memverifikasi data.',
      'KK baru dapat diambil setelah 3-5 hari kerja.',
    ],
    requirements: [
      'Fotokopi KTP seluruh anggota keluarga',
      'KK lama (jika ada perubahan)',
      'Akta kelahiran/ nikah (jika ada penambahan anggota)',
    ],
    estimatedTime: '3-5 hari kerja',
    icon: 'family_restroom',
  },
  {
    slug: 'skck-pengantar',
    title: 'SKCK Pengantar',
    description: 'Surat keterangan dari desa sebagai syarat pembuatan SKCK di kepolisian.',
    steps: [
      'Mendatangi kantor desa dengan membawa KTP dan KK.',
      'Mengisi formulir permohonan surat pengantar SKCK.',
      'Menyerahkan pas foto dan dokumen pendukung.',
      'Verifikasi data oleh perangkat desa.',
      'Surat pengantar siap diambil dalam 1 hari.',
    ],
    requirements: [
      'Fotokopi KTP',
      'Fotokopi KK',
      'Pas foto 4x6 sebanyak 2 lembar',
      'Surat pengantar dari RT/RW',
    ],
    estimatedTime: '1 hari',
    icon: 'policy',
  },
  {
    slug: 'surat-tidak-mampu',
    title: 'Surat Keterangan Tidak Mampu (SKTM)',
    description: 'Surat keterangan tidak mampu untuk mengakses bantuan sosial atau beasiswa.',
    steps: [
      'Mendatangi kantor desa dengan membawa KTP dan KK.',
      'Mengisi formulir pernyataan tidak mampu.',
      'Melampirkan fotokopi dokumen pendukung.',
      'Petugas melakukan verifikasi data.',
      'SKTM dapat diambil setelah 1-2 hari kerja.',
    ],
    requirements: [
      'Fotokopi KTP',
      'Fotokopi KK',
      'Surat pengantar dari RT/RW',
      'Surat pernyataan tidak mampu bermaterai',
    ],
    estimatedTime: '1-2 hari kerja',
    icon: 'gavel',
  },
];

const LayananDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Cari data layanan berdasarkan slug
  const layanan = layananData.find((item) => item.slug === slug);

  // Jika tidak ditemukan, redirect ke halaman layanan
  if (!layanan) {
    navigate('/layanan');
    return null;
  }

  return (
    <div className="bg-background text-on-surface font-body-md antialiased pt-18 min-h-screen">
      <Navbar />

      <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        {/* Tombol Kembali */}
        <Link
          to="/layanan"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-container transition-colors font-label-md text-label-md mb-6"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Kembali ke Layanan
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {layanan.icon}
            </span>
          </div>
          <div>
            <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
              {layanan.title}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {layanan.description}
            </p>
          </div>
        </div>

        {/* Estimasi Waktu */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20 mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">schedule</span>
          <span className="font-label-md text-label-md text-on-surface">
            Estimasi waktu pengerjaan: <span className="font-bold text-primary">{layanan.estimatedTime}</span>
          </span>
        </div>

        {/* Grid 2 Kolom: Tata Cara & Persyaratan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tata Cara */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20">
            <h2 className="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">checklist</span>
              Tata Cara
            </h2>
            <ol className="space-y-4">
              {layanan.steps.map((step, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label-md text-label-md font-bold">
                    {index + 1}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Persyaratan */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20">
            <h2 className="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">assignment</span>
              Persyaratan
            </h2>
            <ul className="space-y-3">
              {layanan.requirements.map((req, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-10 flex flex-wrap gap-4">
          <button className="bg-primary hover:bg-primary-container text-on-primary px-8 py-3 rounded-lg font-label-md text-label-md transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">description</span>
            Ajukan Sekarang
          </button>
          <button className="border border-outline-variant hover:bg-surface-container text-on-surface px-8 py-3 rounded-lg font-label-md text-label-md transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Unduh Formulir
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LayananDetailPage;
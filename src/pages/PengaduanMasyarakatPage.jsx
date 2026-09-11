// src/pages/PengaduanMasyarakatPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PengaduanMasyarakatPage = () => {
  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex flex-col pt-18">
      <Navbar />
      <main className="grow max-w-4xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-xl">
        <section className="text-center mb-xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>
              report
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary mb-md">
            Pengaduan Masyarakat
          </h1>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-lg"></div>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Sampaikan keluhan, aspirasi, atau laporan Anda kepada Pemerintah Desa Sumberporong.
          </p>
        </section>

        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '24px' }}>
              info
            </span>
            <div>
              <p className="font-label-md font-semibold text-primary mb-1">
                Perhatian
              </p>
              <p className="font-body-md text-on-surface-variant">
                Untuk mengirim pengaduan, Anda <strong>harus memiliki akun</strong> terlebih dahulu. 
                Hal ini diperlukan agar petugas desa dapat menindaklanjuti laporan Anda dan 
                mengirimkan notifikasi status pengaduan.
              </p>
            </div>
          </div>
        </div>

        <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
            Syarat Mengirim Pengaduan
          </h2>
          <ul className="space-y-3">
            {[
              'Memiliki akun yang sudah terdaftar dan aktif.',
              'Data pelapor (nama dan nomor telepon) valid.',
              'Deskripsi masalah ditulis dengan jelas dan jujur.',
              'Menyertakan bukti pendukung (foto/dokumen) bila tersedia.',
              'Tidak mengandung unsur SARA, ujaran kebencian, atau fitnah.',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
                <span className="font-body-md text-on-surface-variant">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
            Alur Pengaduan
          </h2>
          <ol className="space-y-4">
            {[
              'Daftar akun atau login terlebih dahulu.',
              'Masuk ke dashboard pengguna, pilih menu Pengaduan.',
              'Isi formulir pengaduan: subjek, deskripsi, lokasi, RT/RW.',
              'Unggah foto bukti atau dokumen pendukung (opsional).',
              'Kirim pengaduan dan pantau status di halaman Riwayat Pengaduan.',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-7 h-7 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label-md font-bold">
                  {idx + 1}
                </span>
                <span className="font-body-md text-on-surface-variant">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-label-md font-semibold hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined">person_add</span>
            Daftar Akun
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-primary/30 text-primary font-label-md font-semibold hover:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined">login</span>
            Sudah Punya Akun? Login
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PengaduanMasyarakatPage;
// src/pages/SyaratKetentuanPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SyaratKetentuanPage = () => {
  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex flex-col pt-18">
      <Navbar />
      <main className="grow max-w-4xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-xl">
        <section className="mb-xl">
          <h1 className="font-display-lg text-display-lg text-primary mb-md">
            Syarat &amp; Ketentuan
          </h1>
          <div className="w-16 h-1 bg-primary rounded-full mb-lg"></div>
          <p className="font-body-md text-on-surface-variant">
            Terakhir diperbarui: 1 Januari 2026
          </p>
        </section>

        <article className="space-y-8 font-body-md text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">1. Penerimaan Syarat</h2>
            <p>
              Dengan mengakses dan menggunakan layanan Sistem Informasi Desa Sumberporong, Anda dianggap telah 
              membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">2. Penggunaan Layanan</h2>
            <p>Pengguna wajib:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Memberikan data yang benar, akurat, dan dapat dipertanggungjawabkan.</li>
              <li>Tidak menggunakan layanan untuk tujuan ilegal atau melanggar hukum.</li>
              <li>Tidak menyalahgunakan akun atau mengakses akun milik orang lain.</li>
              <li>Menjaga kerahasiaan password akun masing-masing.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">3. Akun Pengguna</h2>
            <p>
              Setiap pengguna bertanggung jawab penuh atas aktivitas yang terjadi pada akunnya. 
              Pemerintah Desa berhak menonaktifkan akun yang terbukti melanggar aturan atau melakukan kecurangan.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">4. Pengajuan Layanan</h2>
            <p>
              Semua pengajuan administrasi (KTP, SKU, UMKM, pengaduan) akan diverifikasi oleh petugas desa. 
              Pemerintah Desa berhak menolak pengajuan apabila data tidak valid atau dokumen tidak lengkap.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">5. Hak Kekayaan Intelektual</h2>
            <p>
              Seluruh konten dalam website ini (teks, gambar, logo) adalah milik Pemerintah Desa Sumberporong 
              dan dilindungi oleh undang-undang. Dilarang memperbanyak tanpa izin tertulis.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">6. Batasan Tanggung Jawab</h2>
            <p>
              Pemerintah Desa tidak bertanggung jawab atas kerugian yang timbul akibat penggunaan layanan 
              di luar ketentuan, gangguan teknis, atau force majeure.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">7. Perubahan Ketentuan</h2>
            <p>
              Syarat dan ketentuan dapat diubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu. 
              Pengguna disarankan memeriksa halaman ini secara berkala.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">8. Hukum yang Berlaku</h2>
            <p>
              Syarat dan ketentuan ini tunduk pada hukum yang berlaku di Negara Kesatuan Republik Indonesia.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default SyaratKetentuanPage;
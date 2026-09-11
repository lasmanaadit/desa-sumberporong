// src/pages/KebijakanPrivasiPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const KebijakanPrivasiPage = () => {
  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex flex-col pt-18">
      <Navbar />
      <main className="grow max-w-4xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-xl">
        <section className="mb-xl">
          <h1 className="font-display-lg text-display-lg text-primary mb-md">
            Kebijakan Privasi
          </h1>
          <div className="w-16 h-1 bg-primary rounded-full mb-lg"></div>
          <p className="font-body-md text-on-surface-variant">
            Terakhir diperbarui:  1 Oktober 2026
          </p>
        </section>

        <article className="space-y-8 font-body-md text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">1. Pendahuluan</h2>
            <p>
              Pemerintah Desa Sumberporong berkomitmen melindungi privasi setiap pengguna layanan digital desa. 
              Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda 
              saat menggunakan website dan layanan sistem informasi desa.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">2. Data yang Kami Kumpulkan</h2>
            <p>Kami dapat mengumpulkan data berikut:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Data identitas: nama, NIK, nomor KK, tempat & tanggal lahir, jenis kelamin.</li>
              <li>Data kontak: email, nomor telepon/WhatsApp, alamat.</li>
              <li>Data layanan: pengajuan KTP, SKU, UMKM, pengaduan, dan riwayat.</li>
              <li>Dokumen pendukung yang Anda unggah.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">3. Penggunaan Data</h2>
            <p>Data yang dikumpulkan digunakan untuk:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Memproses pengajuan administrasi dan verifikasi data.</li>
              <li>Menghubungi pengguna terkait status pengajuan.</li>
              <li>Meningkatkan kualitas layanan desa.</li>
              <li>Memenuhi kewajiban hukum dan administrasi pemerintahan.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">4. Perlindungan Data</h2>
            <p>
              Kami menggunakan langkah-langkah teknis dan organisasi yang wajar untuk melindungi data Anda, 
              termasuk enkripsi password dan pembatasan akses data hanya kepada petugas berwenang.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">5. Berbagi Data dengan Pihak Ketiga</h2>
            <p>
              Kami tidak menjual atau menyewakan data pribadi Anda. Data hanya dapat dibagikan kepada instansi 
              terkait (seperti Disdukcapil atau Kecamatan) jika diperlukan untuk pemrosesan layanan.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">6. Hak Pengguna</h2>
            <p>Anda berhak untuk:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Mengakses dan memperbarui data pribadi Anda melalui halaman Edit Profil.</li>
              <li>Meminta penghapusan akun dengan menghubungi petugas desa.</li>
              <li>Menolak memberikan data tertentu (dengan konsekuensi layanan mungkin tidak dapat diproses).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">7. Perubahan Kebijakan</h2>
            <p>
              Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan akan diumumkan melalui website resmi desa.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">8. Kontak</h2>
            <p>
              Jika Anda memiliki pertanyaan terkait kebijakan privasi ini, silakan hubungi kami melalui email 
              <span className="font-semibold text-primary"> info@sumberporong.desa.id</span> atau datang langsung 
              ke Balai Desa Sumberporong.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default KebijakanPrivasiPage;
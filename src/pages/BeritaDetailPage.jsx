// src/pages/BeritaDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaTwitter, FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

// Data dummy (harus sama dengan beritaData di komponen lain, sebaiknya di import dari file terpisah)
const beritaData = [
    {
        id: 1,
        tanggal: '12 Oktober 2023',
        judul: 'Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Tahap 4',
        deskripsi:
          'Pemerintah Desa Sumberporong telah menyalurkan BLT Dana Desa kepada 120 Keluarga Penerima Manfaat (KPM) untuk tahap 4 tahun 2023.',
        gambar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB__i96LNthXDgpEKeanFhhn3_0JSvPfpWbE7_gXbM60eRjl1u0zdYwQ5SVbEM4deCqLBne0B0MD7_l3RVcQQc5MGzgzSCUBpJMXlKRBtC9VbkEr6IXYrZd-OJQfSpqNdMNTnRfLVGFbsv9JCOE8PC0J6X7Ut47astIi0lUlp7tHDlh2h23rpznb2_fV8gfaUASjbvGAkCuTUZZcDtVpZ_WnWvHObFGmFjcUW1ko1i5CZyd4juWr1yu',
      },
    
      {
        id: 2,
        tanggal: '05 Oktober 2023',
        judul: 'Kerja Bakti Bersihkan Lingkungan Desa Menyambut Musim Hujan',
        deskripsi:
          'Warga Desa Sumberporong antusias mengikuti kegiatan kerja bakti membersihkan saluran air dan fasilitas umum untuk mencegah banjir.',
        gambar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBqwrjuI0YrE7BhqWMHd7HJx7wDnmJoRxTysfKLAqq2Yj1C34fbURWfJR3J4va4CA34DNSiqhFzbN94RB24qV3pga81WIQcoMMxKBxFKOSBAAkHisYd5a-VQ39CGTDtdrXD-zjnuQcSe9IrVE-wXjmZv9tkPsVlBd9uK1tBjandXXvoBBFyNKzYcRoInPWqZRlXGsrN2MsksqgNSR4kestjKTMDkVZ-T2YMXwNvZNp7_nJHBmy0r_gJ',
      },
      {
        id: 3,
        tanggal: '05 Oktober 2023',
        judul: 'Kerja Bakti Bersihkan Lingkungan Desa Menyambut Musim Hujan',
        deskripsi:
          'Warga Desa Sumberporong antusias mengikuti kegiatan kerja bakti membersihkan saluran air dan fasilitas umum untuk mencegah banjir.',
        gambar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBqwrjuI0YrE7BhqWMHd7HJx7wDnmJoRxTysfKLAqq2Yj1C34fbURWfJR3J4va4CA34DNSiqhFzbN94RB24qV3pga81WIQcoMMxKBxFKOSBAAkHisYd5a-VQ39CGTDtdrXD-zjnuQcSe9IrVE-wXjmZv9tkPsVlBd9uK1tBjandXXvoBBFyNKzYcRoInPWqZRlXGsrN2MsksqgNSR4kestjKTMDkVZ-T2YMXwNvZNp7_nJHBmy0r_gJ',
      },
      {
        id: 4,
        tanggal: '05 Oktober 2023',
        judul: 'Kerja Bakti Bersihkan Lingkungan Desa Menyambut Musim Hujan',
        deskripsi:
          'Warga Desa Sumberporong antusias mengikuti kegiatan kerja bakti membersihkan saluran air dan fasilitas umum untuk mencegah banjir.',
        gambar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBqwrjuI0YrE7BhqWMHd7HJx7wDnmJoRxTysfKLAqq2Yj1C34fbURWfJR3J4va4CA34DNSiqhFzbN94RB24qV3pga81WIQcoMMxKBxFKOSBAAkHisYd5a-VQ39CGTDtdrXD-zjnuQcSe9IrVE-wXjmZv9tkPsVlBd9uK1tBjandXXvoBBFyNKzYcRoInPWqZRlXGsrN2MsksqgNSR4kestjKTMDkVZ-T2YMXwNvZNp7_nJHBmy0r_gJ',
      },
      {
        id: 5,
        tanggal: '05 Oktober 2023',
        judul: 'Kerja Bakti Bersihkan Lingkungan Desa Menyambut Musim Hujan',
        deskripsi:
          'Warga Desa Sumberporong antusias mengikuti kegiatan kerja bakti membersihkan saluran air dan fasilitas umum untuk mencegah banjir.',
        gambar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBqwrjuI0YrE7BhqWMHd7HJx7wDnmJoRxTysfKLAqq2Yj1C34fbURWfJR3J4va4CA34DNSiqhFzbN94RB24qV3pga81WIQcoMMxKBxFKOSBAAkHisYd5a-VQ39CGTDtdrXD-zjnuQcSe9IrVE-wXjmZv9tkPsVlBd9uK1tBjandXXvoBBFyNKzYcRoInPWqZRlXGsrN2MsksqgNSR4kestjKTMDkVZ-T2YMXwNvZNp7_nJHBmy0r_gJ',
      },
      {
        id: 6,
        tanggal: '05 Oktober 2023',
        judul: 'Kerja Bakti Bersihkan Lingkungan Desa Menyambut Musim Hujan',
        deskripsi:
          'Warga Desa Sumberporong antusias mengikuti kegiatan kerja bakti membersihkan saluran air dan fasilitas umum untuk mencegah banjir.',
        gambar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBqwrjuI0YrE7BhqWMHd7HJx7wDnmJoRxTysfKLAqq2Yj1C34fbURWfJR3J4va4CA34DNSiqhFzbN94RB24qV3pga81WIQcoMMxKBxFKOSBAAkHisYd5a-VQ39CGTDtdrXD-zjnuQcSe9IrVE-wXjmZv9tkPsVlBd9uK1tBjandXXvoBBFyNKzYcRoInPWqZRlXGsrN2MsksqgNSR4kestjKTMDkVZ-T2YMXwNvZNp7_nJHBmy0r_gJ',
      },
      {
        id: 7,
        tanggal: '05 Oktober 2023',
        judul: 'Kerja Bakti Bersihkan Lingkungan Desa Menyambut Musim Hujan',
        deskripsi:
          'Warga Desa Sumberporong antusias mengikuti kegiatan kerja bakti membersihkan saluran air dan fasilitas umum untuk mencegah banjir.',
        gambar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBqwrjuI0YrE7BhqWMHd7HJx7wDnmJoRxTysfKLAqq2Yj1C34fbURWfJR3J4va4CA34DNSiqhFzbN94RB24qV3pga81WIQcoMMxKBxFKOSBAAkHisYd5a-VQ39CGTDtdrXD-zjnuQcSe9IrVE-wXjmZv9tkPsVlBd9uK1tBjandXXvoBBFyNKzYcRoInPWqZRlXGsrN2MsksqgNSR4kestjKTMDkVZ-T2YMXwNvZNp7_nJHBmy0r_gJ',
      },
      {
        id: 8,
        tanggal: '05 Oktober 2023',
        judul: 'Kerja Bakti Bersihkan Lingkungan Desa Menyambut Musim Hujan',
        deskripsi:
          'Warga Desa Sumberporong antusias mengikuti kegiatan kerja bakti membersihkan saluran air dan fasilitas umum untuk mencegah banjir.',
        gambar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBqwrjuI0YrE7BhqWMHd7HJx7wDnmJoRxTysfKLAqq2Yj1C34fbURWfJR3J4va4CA34DNSiqhFzbN94RB24qV3pga81WIQcoMMxKBxFKOSBAAkHisYd5a-VQ39CGTDtdrXD-zjnuQcSe9IrVE-wXjmZv9tkPsVlBd9uK1tBjandXXvoBBFyNKzYcRoInPWqZRlXGsrN2MsksqgNSR4kestjKTMDkVZ-T2YMXwNvZNp7_nJHBmy0r_gJ',
      },
      {
        id: 9,
        tanggal: '05 Oktober 2023',
        judul: 'Kerja Bakti Bersihkan Lingkungan Desa Menyambut Musim Hujan',
        deskripsi:
          'Warga Desa Sumberporong antusias mengikuti kegiatan kerja bakti membersihkan saluran air dan fasilitas umum untuk mencegah banjir.',
        gambar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBqwrjuI0YrE7BhqWMHd7HJx7wDnmJoRxTysfKLAqq2Yj1C34fbURWfJR3J4va4CA34DNSiqhFzbN94RB24qV3pga81WIQcoMMxKBxFKOSBAAkHisYd5a-VQ39CGTDtdrXD-zjnuQcSe9IrVE-wXjmZv9tkPsVlBd9uK1tBjandXXvoBBFyNKzYcRoInPWqZRlXGsrN2MsksqgNSR4kestjKTMDkVZ-T2YMXwNvZNp7_nJHBmy0r_gJ',
      },
];

const BeritaDetailPage = () => {
  const { id } = useParams();
  const berita = beritaData.find(item => item.id === parseInt(id));

  if (!berita) {
    return (
      <div className="min-h-screen pt-18 bg-background flex items-center justify-center">
        <p className="font-body-lg text-on-surface-variant">Berita tidak ditemukan</p>
      </div>
    );
  }

  // URL berita untuk share
  const currentUrl = window.location.href;

  // Fungsi copy link
  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('Link berita berhasil disalin!');
  };

  return (
    <div className="bg-background text-on-surface font-body-md antialiased pt-18 min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/berita" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <span className="material-symbols-outlined">arrow_back</span>
          Kembali ke Berita
        </Link>

        {/* Gambar */}
        <div className="rounded-xl overflow-hidden shadow-sm mb-6">
          <img
            src={berita.gambar}
            alt={berita.judul}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Judul & Tanggal */}
        <h1 className="font-display-lg text-4xl font-bold text-primary mb-3">
          {berita.judul}
        </h1>
        <p className="text-sm text-on-surface-variant mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">calendar_today</span>
          {berita.tanggal}
        </p>

        {/* Deskripsi (isi berita) */}
        <div className="prose max-w-none font-body-md text-on-surface-variant leading-relaxed">
          <p>{berita.deskripsi}</p>
          {/* Bisa ditambahkan paragraf lebih banyak jika ada */}
        </div>

        {/* Share Section */}
        <div className="mt-10 pt-6 border-t border-outline-variant/20">
          <p className="font-label-md font-semibold text-on-surface mb-3">Bagikan berita ini:</p>
          <div className="flex flex-wrap gap-3">
            {/* Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(berita.judul)}&url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1DA1F2] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
                <FaTwitter className="text-lg" />
              Twitter
            </a>
            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1877F2] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <FaFacebook className="text-lg" />
              Facebook
            </a>
            {/* Instagram (tidak punya share URL, jadi kita fallback ke copy link) */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentUrl);
                alert('Link berita disalin! Anda bisa membagikannya di Instagram.');
              }}
              className="bg-[#E4405F] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <FaInstagram className="text-lg" />
              Instagram
            </button>
            {/* TikTok (sama, copy link) */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentUrl);
                alert('Link berita disalin! Anda bisa membagikannya di TikTok.');
              }}
              className="bg-[#000000] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <FaTiktok className="text-lg" />
                Tiktok
            </button>
            <button
              onClick={copyLink}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors"
            >
              <FaWhatsapp className="text-lg" />
              WhatsApp
            </button>
            {/* Copy Link */}
            <button
              onClick={copyLink}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors"
            >
              <span className="material-symbols-outlined">link</span>
              Salin Link
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BeritaDetailPage;
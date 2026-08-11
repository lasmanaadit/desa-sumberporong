import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


      
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


  // Tambahkan berita lainnya di sini...
];

const BeritaPage = () => {
  // Halaman aktif
  const [currentPage, setCurrentPage] = useState(1);

  // Jumlah berita per halaman
  const beritaPerPage = 8;

  // Hitung index berita
  const indexBeritaTerakhir = currentPage * beritaPerPage;
  const indexBeritaPertama = indexBeritaTerakhir - beritaPerPage;

  // Ambil berita sesuai halaman
  const beritaSekarang = beritaData.slice(
    indexBeritaPertama,
    indexBeritaTerakhir
  );

  // Hitung jumlah halaman
  const totalPages = Math.ceil(
    beritaData.length / beritaPerPage
  );

  return (
    <div className="bg-background text-on-surface font-body-md antialiased pt-18">
      <Navbar />
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">

            {/* Header */}
            <div className="mb-10">
              <h1 className="font-headline-md text-3xl font-bold text-primary">
                Berita Terkini
              </h1>

              <p className="mt-2 text-on-surface-variant">
                Informasi dan kegiatan terbaru Desa Sumberporong
              </p>
            </div>

            {/* GRID BERITA */}
            <div className="grid grid-cols-4 gap-6">

              {beritaSekarang.map((berita) => (
                <article
                  key={berita.id}
                  className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >

                  {/* Gambar */}
                  <div className="aspect-16/10 overflow-hidden">
                    <img
                      src={berita.gambar}
                      alt={berita.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Isi */}
                  <div className="p-5">

                    {/* Tanggal */}
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-3">
                      <span className="material-symbols-outlined text-base">
                        calendar_today
                      </span>

                      <span>
                        {berita.tanggal}
                      </span>
                    </div>

                    {/* Judul */}
                    <h2 className="font-headline-md text-lg font-bold text-primary line-clamp-2 mb-3">
                      {berita.judul}
                    </h2>

                    {/* Deskripsi */}
                    <p className="text-sm text-on-surface-variant line-clamp-3 mb-5">
                      {berita.deskripsi}
                    </p>

                    {/* Baca */}
                    <button className="flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                      Baca Selengkapnya

                      <span className="material-symbols-outlined text-base">
                        arrow_forward
                      </span>
                    </button>

                  </div>
                </article>
              ))}

            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">

                {/* Previous */}
                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.max(page - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/30 text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                >
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>

                {/* Nomor halaman */}
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'border border-outline-variant/30 text-primary hover:bg-primary/10'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/30 text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 transition"
                >
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>

              </div>
              
            )}

          </div>
          
        </section>
      <Footer/>
    </div>
  );
};

export default BeritaPage;
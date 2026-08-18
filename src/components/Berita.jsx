import React from 'react';

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

const Berita = () => {
  return (
    <section className="py-xl bg-surface-container-low">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-xl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Berita Terkini</h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
        </div>

        {/* Grid responsif */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {beritaData.slice(0, 4).map((berita) => (
            <div
              key={berita.id}
              className="bg-surface rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 transition-all hover:shadow-md hover:-translate-y-1 duration-300 flex flex-col h-full"
            >
              <div className="h-56 overflow-hidden">
                <img
                  alt={berita.judul}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  src={berita.gambar}
                />
              </div>
              <div className="p-md flex flex-col flex-1">
                <div className="flex items-center gap-sm text-label-sm text-label-sm text-primary mb-xs">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  {berita.tanggal}
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">
                  {berita.judul}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant flex-1">
                  {berita.deskripsi}
                </p>
                <a
                  href={`/berita/${berita.id}`}
                  className="font-label-md text-label-md text-primary hover:text-primary-container mt-sm inline-flex items-center gap-xs transition-colors"
                >
                  Baca Selengkapnya{' '}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-right mt-lg">
          <a
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-lg transition-colors inline-block"
            href="/berita"
          >
            Lihat Semua Berita
          </a>
        </div>
      </div>
    </section>
  );
};

export default Berita;
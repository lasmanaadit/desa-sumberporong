import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const produkData = [
  {
    id: 1,
    kategori: 'Kerajinan Tangan',
    nama: 'Anyaman Bambu Khas',
    deskripsi:
      'Tas dan keranjang anyaman bambu berkualitas tinggi, dibuat oleh pengrajin lokal dengan motif tradisional.',
    harga: 'Rp 75.000',
    gambar: 'https://picsum.photos/seed/anyaman/400/300',
  },
  {
    id: 2,
    kategori: 'Minuman',
    nama: 'Kopi Sumberporong',
    deskripsi:
      'Kopi arabika khas pegunungan dengan cita rasa khas, diproses secara tradisional oleh petani desa.',
    harga: 'Rp 45.000',
    gambar: 'https://picsum.photos/seed/kopi/400/300',
  },
  {
    id: 3,
    kategori: 'Makanan Ringan',
    nama: 'Keripik Singkong Pedas',
    deskripsi:
      'Keripik singkong renyah dengan bumbu pedas manis khas, camilan favorit warga dan wisatawan.',
    harga: 'Rp 20.000',
    gambar: 'https://picsum.photos/seed/keripik/400/300',
  },
  {
    id: 4,
    kategori: 'Fashion',
    nama: 'Batik Sumberporong',
    deskripsi:
      'Kain batik dengan motif khas desa, dibuat dengan teknik cap dan tulis oleh perajin batik setempat.',
    harga: 'Rp 150.000',
    gambar: 'https://picsum.photos/seed/batik/400/300',
  },
  {
    id: 5,
    kategori: 'Makanan',
    nama: 'Keripik Tempe Sumberporong',
    deskripsi:
      'Keripik tempe renyah dengan berbagai pilihan rasa yang dibuat oleh pelaku UMKM lokal.',
    harga: 'Rp 25.000',
    gambar: 'https://picsum.photos/seed/tempe/400/300',
  },
  {
    id: 6,
    kategori: 'Minuman',
    nama: 'Wedang Herbal',
    deskripsi:
      'Minuman herbal tradisional yang dibuat dari bahan-bahan alami pilihan warga desa.',
    harga: 'Rp 15.000',
    gambar: 'https://picsum.photos/seed/herbal/400/300',
  },
  {
    id: 7,
    kategori: 'Makanan',
    nama: 'Olahan Singkong',
    deskripsi:
      'Berbagai produk olahan singkong khas desa yang dibuat menggunakan bahan lokal berkualitas.',
    harga: 'Rp 18.000',
    gambar: 'https://picsum.photos/seed/singkong/400/300',
  },
  {
    id: 8,
    kategori: 'Kerajinan',
    nama: 'Kerajinan Kayu',
    deskripsi:
      'Produk kerajinan berbahan kayu yang dibuat secara manual oleh pengrajin lokal.',
    harga: 'Rp 85.000',
    gambar: 'https://picsum.photos/seed/kayu/400/300',
  },
  {
    id: 9,
    kategori: 'Fashion',
    nama: 'Kaos Khas Desa',
    deskripsi:
      'Kaos dengan desain khas Desa Sumberporong yang cocok digunakan sebagai oleh-oleh.',
    harga: 'Rp 65.000',
    gambar: 'https://picsum.photos/seed/kaos/400/300',
  },
  {
    id: 10,
    kategori: 'Makanan',
    nama: 'Sambal Khas Desa',
    deskripsi:
      'Sambal khas dengan cita rasa pedas dan gurih yang dibuat menggunakan bahan pilihan.',
    harga: 'Rp 20.000',
    gambar: 'https://picsum.photos/seed/sambal/400/300',
  },
  {
    id: 11,
    kategori: 'Makanan',
    nama: 'Sambal Khas Desa',
    deskripsi:
      'Sambal khas dengan cita rasa pedas dan gurih yang dibuat menggunakan bahan pilihan.',
    harga: 'Rp 20.000',
    gambar: 'https://picsum.photos/seed/sambal/400/300',
  },
];

const UmkmPage = () => {
  // ==========================================
  // PAGINATION
  // ==========================================

  const [currentPage, setCurrentPage] = useState(1);

  // Maksimal 5 produk setiap halaman
  const produkPerPage = 10;

  // Index produk
  const indexProdukTerakhir = currentPage * produkPerPage;
  const indexProdukPertama =
    indexProdukTerakhir - produkPerPage;

  // Produk yang ditampilkan
  const produkSekarang = produkData.slice(
    indexProdukPertama,
    indexProdukTerakhir
  );

  // Total halaman
  const totalPages = Math.ceil(
    produkData.length / produkPerPage
  );

  return (
    <div className="min-h-screen bg-surface">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <Navbar />


      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <main>

        {/* ==========================================
            HEADER
        ========================================== */}

        <section className="pt-32 pb-12 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-7xl mx-auto">

            <h1 className="font-headline-md text-3xl md:text-4xl font-bold text-primary">
              Produk UMKM Unggulan
            </h1>

            <p className="mt-4 max-w-2xl text-on-surface-variant">
              Produk-produk berkualitas dari warga Desa
              Sumberporong yang siap mendukung perekonomian
              lokal dan kebanggaan desa.
            </p>

          </div>
        </section>


        {/* ==========================================
            DAFTAR PRODUK
        ========================================== */}

        <section className="pb-20 px-margin-mobile md:px-margin-desktop">

          <div className="max-w-7xl mx-auto">

            {/* 
              5 CARD DALAM 1 BARIS
            */}

            <div className="grid grid-cols-5 gap-5">

              {produkSekarang.map((produk) => (

                <article
                  key={produk.id}
                  className="
                    bg-surface-container-lowest
                    rounded-xl
                    overflow-hidden
                    border
                    border-outline-variant/20
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-300
                    hover:-translate-y-1
                  "
                >

                  {/* ==================================
                      GAMBAR
                  ================================== */}

                  <div className="aspect-4/3 overflow-hidden">

                    <img
                      src={produk.gambar}
                      alt={produk.nama}
                      className="
                        w-full
                        h-full
                        object-cover
                        transition-transform
                        duration-500
                        hover:scale-105
                      "
                    />

                  </div>


                  {/* ==================================
                      INFORMASI PRODUK
                  ================================== */}

                  <div className="p-4">

                    {/* Kategori */}

                    <span
                      className="
                        inline-block
                        text-xs
                        font-semibold
                        text-primary
                        bg-primary/10
                        px-3
                        py-1
                        rounded-full
                        mb-3
                      "
                    >
                      {produk.kategori}
                    </span>


                    {/* Nama Produk */}

                    <h2
                      className="
                        font-headline-md
                        text-lg
                        font-bold
                        text-primary
                        mb-2
                        line-clamp-2
                      "
                    >
                      {produk.nama}
                    </h2>


                    {/* Deskripsi */}

                    <p
                      className="
                        text-sm
                        text-on-surface-variant
                        leading-relaxed
                        line-clamp-3
                        min-h-15.75
                      "
                    >
                      {produk.deskripsi}
                    </p>


                    {/* ==================================
                        HARGA
                    ================================== */}

                    <div
                      className="
                        mt-4
                        pt-4
                        border-t
                        border-outline-variant/20
                      "
                    >

                      <span
                        className="
                          text-xs
                          text-on-surface-variant
                          block
                        "
                      >
                        Harga
                      </span>

                      <span
                        className="
                          text-lg
                          font-bold
                          text-primary
                        "
                      >
                        {produk.harga}
                      </span>

                    </div>


                    {/* ==================================
                        TOMBOL PESAN
                    ================================== */}

                    <button
                      className="
                        mt-4
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        px-4
                        py-2
                        rounded-lg
                        bg-primary
                        text-white
                        text-sm
                        font-semibold
                        hover:opacity-90
                        transition
                      "
                    >

                      <span className="material-symbols-outlined text-base">
                        shopping_cart
                      </span>

                      Pesan

                    </button>

                  </div>

                </article>

              ))}

            </div>


            {/* ==========================================
                PAGINATION
            ========================================== */}

            {totalPages > 1 && (

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  mt-12
                "
              >

                {/* ==================================
                    PREVIOUS
                ================================== */}

                <button
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(page - 1, 1)
                    )
                  }
                  disabled={currentPage === 1}
                  className="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-outline-variant/30
                    text-primary
                    hover:bg-primary/10
                    transition
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                >

                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>

                </button>


                {/* ==================================
                    NOMOR HALAMAN
                ================================== */}

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (

                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`
                      w-10
                      h-10
                      rounded-lg
                      font-semibold
                      transition

                      ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'border border-outline-variant/30 text-primary hover:bg-primary/10'
                      }
                    `}
                  >
                    {page}
                  </button>

                ))}


                {/* ==================================
                    NEXT
                ================================== */}

                <button
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-outline-variant/30
                    text-primary
                    hover:bg-primary/10
                    transition
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                >

                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>

                </button>

              </div>

            )}

          </div>

        </section>

      </main>


      {/* ==========================================
          FOOTER
      ========================================== */}

      <Footer />

    </div>
  );
};

export default UmkmPage;
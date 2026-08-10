import React from 'react';

const produkData = [
  {
    id: 1,
    kategori: 'Kerajinan Tangan',
    nama: 'Anyaman Bambu Khas',
    deskripsi: 'Tas dan keranjang anyaman bambu berkualitas tinggi, dibuat oleh pengrajin lokal dengan motif tradisional.',
    harga: 'Rp 75.000',
    gambar: 'https://picsum.photos/seed/anyaman/400/300',
  },
  {
    id: 2,
    kategori: 'Minuman',
    nama: 'Kopi Sumberporong',
    deskripsi: 'Kopi arabika khas pegunungan dengan cita rasa khas, diproses secara tradisional oleh petani desa.',
    harga: 'Rp 45.000',
    gambar: 'https://picsum.photos/seed/kopi/400/300',
  },
  {
    id: 3,
    kategori: 'Makanan Ringan',
    nama: 'Keripik Singkong Pedas',
    deskripsi: 'Keripik singkong renyah dengan bumbu pedas manis khas, camilan favorit warga dan wisatawan.',
    harga: 'Rp 20.000',
    gambar: 'https://picsum.photos/seed/keripik/400/300',
  },
  {
    id: 4,
    kategori: 'Fashion',
    nama: 'Batik Sumberporong',
    deskripsi: 'Kain batik dengan motif khas desa, dibuat dengan teknik cap dan tulis oleh perajin batik setempat.',
    harga: 'Rp 150.000',
    gambar: 'https://picsum.photos/seed/batik/400/300',
  },
];

const ProdukUMKM = () => {
  return (
    <section className="py-xl bg-surface">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-xl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Produk UMKM Unggulan</h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-md max-w-2xl mx-auto">
            Produk-produk berkualitas dari warga Desa Sumberporong yang siap mendukung perekonomian lokal dan kebanggaan desa.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
          {produkData.map((produk) => (
            <div
              key={produk.id}
              className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 transition-all hover:shadow-md hover:-translate-y-1 duration-300 flex flex-col"
            >
              <div className="h-48 overflow-hidden bg-surface-container-high">
                <img
                  alt={produk.nama}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  src={produk.gambar}
                />
              </div>
              <div className="p-md flex flex-col flex-1">
                <span className="text-label-sm text-label-sm text-primary mb-xs">{produk.kategori}</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-sm text-lg">
                  {produk.nama}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm flex-1">
                  {produk.deskripsi}
                </p>
                <div className="flex items-center justify-between mt-sm">
                  <span className="font-headline-md text-headline-md text-primary">{produk.harga}</span>
                  <a
                    className="bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm py-xs px-sm rounded-lg transition-colors inline-flex items-center gap-xs"
                    href="#"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_cart</span> Pesan
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-lg">
          <a
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-lg transition-colors inline-block"
            href="#"
          >
            Lihat Semua Produk UMKM
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProdukUMKM;
// src/components/ProdukUMKM.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import dummyUmkmList from '../data/umkmDummy';

const ProdukUMKM = () => {
  // Ambil 4 data pertama sebagai unggulan
  const unggulan = dummyUmkmList.filter(item => item.status === 'active').slice(0, 4);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

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
          {unggulan.map((umkm) => (
            <Link
              key={umkm.id}
              to={`/umkm/${umkm.id}`}
              className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 transition-all hover:shadow-md hover:-translate-y-1 duration-300 flex flex-col group"
            >
              <div className="h-48 overflow-hidden bg-surface-container-high">
                <img
                  alt={umkm.nama}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={umkm.foto_utama}
                />
              </div>
              <div className="p-md flex flex-col flex-1">
                <span className="text-label-sm text-label-sm text-primary mb-xs">{umkm.kategori}</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-sm text-lg line-clamp-1">
                  {umkm.nama}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm flex-1 line-clamp-2">
                  {umkm.deskripsi}
                </p>
                <div className="flex items-center justify-between mt-sm">
                  <span className="font-headline-md text-headline-md text-primary">
                    {formatRupiah(umkm.harga_min)} - {formatRupiah(umkm.harga_max)}
                  </span>
                  <span className="bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm py-xs px-sm rounded-lg transition-colors inline-flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">shopping_cart</span> Beli
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-lg">
          <Link
            to="/umkm"
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-lg transition-colors inline-block"
          >
            Lihat Semua Produk UMKM
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProdukUMKM;
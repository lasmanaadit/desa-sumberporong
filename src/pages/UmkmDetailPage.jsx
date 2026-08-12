// src/pages/UmkmDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { dummyUmkmList } from '../data/umkmDummy';

const UmkmDetailPage = () => {
  const { id } = useParams();
  const [umkm, setUmkm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const found = dummyUmkmList.find(item => item.id === parseInt(id));
    setTimeout(() => {
      setUmkm(found);
      setLoading(false);
    }, 300);
  }, [id]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const allPhotos = umkm ? [umkm.foto_utama, ...(umkm.foto_lain || [])] : [];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % allPhotos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (!umkm) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="font-body-lg text-on-surface-variant">UMKM tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-4xl mx-auto">
          <Link to="/umkm" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali
          </Link>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
            {/* ===== CAROUSEL GAMBAR ===== */}
            <div className="relative h-80 md:h-96 bg-surface-container-high">
              {allPhotos.length > 0 && (
                <>
                  <img
                    src={allPhotos[currentSlide]}
                    alt={`${umkm.nama} - Foto ${currentSlide + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  {allPhotos.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {allPhotos.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-4' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <p className="text-sm font-semibold text-primary bg-primary/10 inline-block px-3 py-1 rounded-full">{umkm.kategori}</p>
              <h1 className="font-headline-lg text-3xl md:text-4xl text-primary">{umkm.nama}</h1>
              <p className="font-body-md text-on-surface-variant">{umkm.deskripsi}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20">
                <div><span className="font-label-sm text-on-surface-variant">Tempat</span><p className="font-body-md text-on-surface">{umkm.tempat}</p></div>
                <div><span className="font-label-sm text-on-surface-variant">Harga</span><p className="font-body-md text-on-surface font-bold text-primary">{formatRupiah(umkm.harga_min)} - {formatRupiah(umkm.harga_max)}</p></div>
                <div><span className="font-label-sm text-on-surface-variant">Alamat</span><p className="font-body-md text-on-surface">{umkm.alamat}</p></div>
                <div><span className="font-label-sm text-on-surface-variant">Jam Operasional</span><p className="font-body-md text-on-surface">{umkm.jam_buka} - {umkm.jam_tutup}</p></div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-outline-variant/20">
                {umkm.whatsapp && (
                  <a href={`https://wa.me/${umkm.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
                    <span className="material-symbols-outlined">whatsapp</span>
                    WhatsApp
                  </a>
                )}
                {umkm.ecommerce && (
                  <a href={umkm.ecommerce} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                    <span className="material-symbols-outlined">shopping_bag</span>
                    E-Commerce
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UmkmDetailPage;
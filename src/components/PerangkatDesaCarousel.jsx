// src/components/PerangkatDesaCarousel.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Data perangkat desa (ganti dengan data asli dan foto)
const perangkatDesa = [
  {
    id: 1,
    nama: 'Bpk. H. Sukamto, S.E.',
    jabatan: 'Kepala Desa',
    foto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWitW2I9R40M63d2OJtYQldUTJPDRbHYY-Iv3t5Ze-0TPL7bomUOhAJE9jIrNPZYNhROuhtTu5UV_3mbY-swfLSY9nbDpknm_xunm2fjSfk63SDvWTY9yfnGwTpUsRQf3DYTcgC6zOE5Xe1RrNFlw7ICAR9IvaGyRGLGzNPT_KK6mHLy6M1NB90vz6_cQb0rtJoO2ArY7I14qh6-dRqagLmMzAIeuoOBoc-v1_gMT_vtEdnfHGE41r',
  },
  {
    id: 2,
    nama: 'Bpk. Drs. Ahmad Muzaki',
    jabatan: 'Sekretaris Desa',
    foto: 'https://picsum.photos/seed/sekdes/400/400',
  },
  {
    id: 3,
    nama: 'Ibu Siti Rahayu, S.Sos.',
    jabatan: 'Kaur Keuangan',
    foto: 'https://picsum.photos/seed/kaurkeu/400/400',
  },
  {
    id: 4,
    nama: 'Bpk. M. Rofiqi, S.Pd.',
    jabatan: 'Kaur Perencanaan',
    foto: 'https://picsum.photos/seed/kaurren/400/400',
  },
  {
    id: 5,
    nama: 'Ibu Dewi Lestari, A.Md.',
    jabatan: 'Kasi Pemerintahan',
    foto: 'https://picsum.photos/seed/kasipem/400/400',
  },
  {
    id: 6,
    nama: 'Bpk. Joko Purwanto',
    jabatan: 'Kasi Pelayanan',
    foto: 'https://picsum.photos/seed/kasipel/400/400',
  },
  {
    id: 7,
    nama: 'Ibu Nurul Hidayati',
    jabatan: 'Kasi Kesejahteraan',
    foto: 'https://picsum.photos/seed/kasikes/400/400',
  },
];

const PerangkatDesaCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto slide setiap 4 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % perangkatDesa.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    }),
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % perangkatDesa.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + perangkatDesa.length) % perangkatDesa.length);
  };

  // Ambil 3 data untuk ditampilkan (current, prev, next)
  const getVisibleItems = () => {
    const items = [];
    const total = perangkatDesa.length;
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + total) % total;
      items.push({
        ...perangkatDesa[index],
        position: i,
        index: index,
      });
    }
    return items;
  };

  const visibleItems = getVisibleItems();

  return (
    <section className="py-xl bg-surface">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-xl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
            Perangkat Desa Sumberporong
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-md max-w-2xl mx-auto">
            Berikut adalah jajaran perangkat desa yang siap melayani masyarakat dengan sepenuh hati.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden px-4 md:px-8">
          <div className="flex justify-center items-center min-h-80p">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-4xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {visibleItems.map((item) => (
                    <div
                      key={`${item.id}-${item.position}`}
                      className={`bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 transition-all duration-300 ${
                        item.position === 0
                          ? 'scale-100 ring-2 ring-primary/20'
                          : 'scale-90 opacity-60'
                      }`}
                    >
                      <div className="aspect-square overflow-hidden bg-surface-container">
                        <img
                          src={item.foto}
                          alt={item.nama}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-headline-md text-headline-md text-on-surface text-base">
                          {item.nama}
                        </h3>
                        <p className="font-label-md text-label-md text-primary mt-1">
                          {item.jabatan}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Tombol Navigasi */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-2 rounded-full shadow-md border border-outline-variant/20 transition-all z-10"
            aria-label="Previous"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-2 rounded-full shadow-md border border-outline-variant/20 transition-all z-10"
            aria-label="Next"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Indikator Dot */}
          <div className="flex justify-center gap-2 mt-6">
            {perangkatDesa.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-6'
                    : 'bg-outline-variant/50 hover:bg-outline-variant'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerangkatDesaCarousel;
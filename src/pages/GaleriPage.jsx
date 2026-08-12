// src/pages/GaleriPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Data galeri dengan rasio gambar berbeda (seperti App Store)
const galeriData = [
  {
    id: 1,
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuU7y5aA4z47q34iv7V_NM3igt1eFXj2uucAoHLb3L5fmhO34gADtryeDoalEK81TeyAA8PsiFzWKYIHvgPMIaDzdzdHLQHyKXXVf3cUYL-bhMgcu6eUDjh3WY1GXX1PyWVwWAp-kNfcKEiUuyxPD0sw13YYcqP_uaw-QgTWrrL74ADxAroiUoR4xSS3Jj2W0Byq4BPqIkzDGu8Mj_AoWNHvzd4yyZ3N6Eu7w6VllsZl6i_BfAlOGY',
    title: 'Kegiatan Gotong Royong',
    category: 'Kegiatan Desa',
    span: 'col-span-2 row-span-2', // gambar besar
    aspect: 'aspect-[4/3]',
  },
  {
    id: 2,
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI6HDnZAGl2sJmoZnnZMxsnD_tgympf0QrdGgQARmrWW0UlZ9P2iKtneByyLHCKYjtGyE5zp7wilHDMUSFxgyY3opEDRMbGpZ8gwkoLf8skNJq2PqApMeG7F5xdjBSmtu4puGPDbD_dhneuuJ7dFwLDxr0ZfD7c3fohUMVr7vmbXbPF61Ch8QUwxlMvonqnYWyy2zMvJsbgFXVfHxRrwRNb0Jx3TgvpXHNPD9XJ8Dcky9DZg3z6RQ_',
    title: 'Panen Raya',
    category: 'Pertanian',
    span: 'col-span-1 row-span-1',
    aspect: 'aspect-square',
  },
  {
    id: 3,
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV7RkZyV3IUnrtnbfHsK56QVvw48Y4gF2Z8poqOWoV7xKm9fY_VkwFCM-jQCRRNQ7S0YLpD7J_nLKVhP4OCIEDdCZt67Jbwe-tV5oUM7h9BSiULRAolO4SYIPSDSW50gf_OKEEkamSVBrqUx16SpqW_OqGoKYSu5RTd1ny6ENA6OTU2PJQ3tH10Wj6w0-oPLG-oSSiUWxUpP74yQsJPxzLdnSKGU6gTQDAmYQLRphbg-BALKKuPPzX',
    title: 'Pengajian Akbar',
    category: 'Kegiatan Keagamaan',
    span: 'col-span-1 row-span-2',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 4,
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxf7Tu8mWHw1jYO7jcyGy9hXtHeiO2ZM92SqrYjaNe83Ih2fQr75Mrdn12ZBTsSYwrctqy58s7CAUBKUTp9HMlatB5b8qEHZptRbxN1_Mt_Qrku1ZTWBbab_RZaNt69CE1KSpk_9aSNUhVbK0M1dLpgYrS0KJ8Br30VbUS1KhPYHbck3ofpqFpt2Tahz8rM1jKEbaH3dTzVCm3BFFEmFyXDAvEJ3hOOFW1q7YKkVpmHs27dmPcAy65',
    title: 'Pelatihan UMKM',
    category: 'Pemberdayaan',
    span: 'col-span-1 row-span-1',
    aspect: 'aspect-square',
  },
  {
    id: 5,
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB__i96LNthXDgpEKeanFhhn3_0JSvPfpWbE7_gXbM60eRjl1u0zdYwQ5SVbEM4deCqLBne0B0MD7_l3RVcQQc5MGzgzSCUBpJMXlKRBtC9VbkEr6IXYrZd-OJQfSpqNdMNTnRfLVGFbsv9JCOE8PC0J6X7Ut47astIi0lUlp7tHDlh2h23rpznb2_fV8gfaUASjbvGAkCuTUZZcDtVpZ_WnWvHObFGmFjcUW1ko1i5CZyd4juWr1yu',
    title: 'Pembagian BLT',
    category: 'Bantuan Sosial',
    span: 'col-span-2 row-span-2',
    aspect: 'aspect-[16/9]',
  },
  {
    id: 6,
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqwrjuI0YrE7BhqWMHd7HJx7wDnmJoRxTysfKLAqq2Yj1C34fbURWfJR3J4va4CA34DNSiqhFzbN94RB24qV3pga81WIQcoMMxKBxFKOSBAAkHisYd5a-VQ39CGTDtdrXD-zjnuQcSe9IrVE-wXjmZv9tkPsVlBd9uK1tBjandXXvoBBFyNKzYcRoInPWqZRlXGsrN2MsksqgNSR4kestjKTMDkVZ-T2YMXwNvZNp7_nJHBmy0r_gJ',
    title: 'Kesenian Wayang Kulit',
    category: 'Budaya',
    span: 'col-span-1 row-span-1',
    aspect: 'aspect-square',
  },
  {
    id: 7,
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWitW2I9R40M63d2OJtYQldUTJPDRbHYY-Iv3t5Ze-0TPL7bomUOhAJE9jIrNPZYNhROuhtTu5UV_3mbY-swfLSY9nbDpknm_xunm2fjSfk63SDvWTY9yfnGwTpUsRQf3DYTcgC6zOE5Xe1RrNFlw7ICAR9IvaGyRGLGzNPT_KK6mHLy6M1NB90vz6_cQb0rtJoO2ArY7I14qh6-dRqagLmMzAIeuoOBoc-v1_gMT_vtEdnfHGE41r',
    title: 'Sambutan Kepala Desa',
    category: 'Kegiatan Desa',
    span: 'col-span-1 row-span-1',
    aspect: 'aspect-square',
  },
  {
    id: 8,
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHIhSY-cdXMypCCUf85dHlznqiHMI6AlScoECPWa6VxfWVKq390z48n_HQ2vW8Ih0XekeES1PAeXc1ew8npqxcWyFvm1AHyMWyWma4KxV34IMN1iRUT9GW9PrJ6RY9x3yUY67-3qrTB0B7N1P0yudA5APzoffVeNnh6GcZZnRhw_GWXqV__PhkOfJlG87N_AWFeQviMXf8h5Q2sulNAxK-2bV1yAcUY7yzepIxg-tQI8Uxrex65Rwl',
    title: 'Struktur Organisasi Desa',
    category: 'Administrasi',
    span: 'col-span-1 row-span-2',
    aspect: 'aspect-[3/4]',
  },
];

const GaleriPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('Semua');

  // Filter kategori unik
  const categories = ['Semua', ...new Set(galeriData.map(item => item.category))];

  // Filter data berdasarkan kategori
  const filteredData = filter === 'Semua' 
    ? galeriData 
    : galeriData.filter(item => item.category === filter);

  // Variants untuk animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.6,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Modal variants (App Store style)
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.7,
      y: 30,
      transition: {
        duration: 0.25,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="bg-background text-on-surface font-body-md antialiased pt-18 min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* ====== HERO GALERI ====== */}
      <section className="relative py-xl bg-primary/5">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display-lg text-display-lg text-primary mb-md"
          >
            Galeri Desa Sumberporong
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto"
          >
            Dokumentasi kegiatan dan potensi desa dalam bingkai gambar yang bercerita.
          </motion.p>
        </div>
      </section>


      {/* ====== GALERI APP STORE STYLE (Masonry Grid) ====== */}
      <section className="py-xl bg-surface-container-low">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-2 md:grid-cols-4 auto-rows-50 gap-3 md:gap-4"
            >
              {filteredData.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layoutId={`card-${item.id}`}
                  onClick={() => setSelectedImage(item)}
                  className={`${item.span} cursor-pointer group overflow-hidden rounded-2xl bg-surface shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className={`relative w-full h-full ${item.aspect} md:${item.aspect}`}>
                    <motion.img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                    {/* Gradient overlay seperti App Store */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredData.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-xl"
            >
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Tidak ada gambar untuk kategori ini.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ====== MODAL APP STORE STYLE ====== */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-surface rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gambar Modal */}
              <div className="relative bg-black/5">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GaleriPage;
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VisiMisi from '../components/VisiMisi';
import PetaDesa from '../components/PetaDesa';

const ProfilePage = () => {
  // Data gambar era kolonial (6 gambar)
  const colonialImages = [
    'src/assets/gmbr1.jpg',
    'src/assets/gmbr2.jpg',
    'src/assets/gmbr3.jpg',
    'src/assets/gmbr4.jpg',
    'src/assets/gmbr5.jpg',
    'src/assets/gmbr6.jpg',
  ];

  return (
    <div className="bg-background text-on-surface font-body-md antialiased pt-18">
      {/* Navbar */}
      <Navbar />

      {/* ====== BAGIAN 1: VISI & MISI (komponen yang sama) ====== */}
      <VisiMisi />

      {/* ====== BAGIAN 2: SEJARAH DESA ====== */}
      <section className="py-xl bg-surface-container-low">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
              Sejarah Desa Sumberporong
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-lg"></div>
          </div>

          {/* Teks Sejarah (center) */}
          <div className="max-w-4xl mx-auto text-center mb-xl">
            
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Desa Sumberporong awalnya bernama Sumberparang. Nama tersebut berasal dari kisah perselisihan 
            dua demang, yaitu Demang Kentol dan Demang Lengket, yang bertarung menggunakan parang demi memperebutkan seorang putri. Pertikaian itu akhirnya 
            dihentikan oleh Mbah Pati (Mbah Kaliam), seorang tokoh penyebar agama Islam yang membawa kedamaian dan berperan penting dalam perkembangan desa. 
            Sejak saat itu, wilayah tersebut dikenal sebagai Desa Sumberparang.
            </p>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mt-md">
            Pada abad ke-19, Pemerintah Hindia Belanda membeli sebagian besar tanah di Sumberparang 
            untuk membangun rumah sakit yang kemudian berdiri pada tahun 1902, yaitu RSJ Dr. Radjiman Wediodiningrat. Pada masa pemerintahan Belanda, 
            nama desa diubah dari Sumberparang menjadi Sumberporong, nama yang digunakan hingga sekarang. Perkembangan rumah sakit dan perubahan nama tersebut menjadi bagian 
            penting dalam sejarah berdirinya Desa Sumberporong.
            </p>
          </div>
          <div className='text-center'>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
              Galeri Era Kolonial
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-lg"></div>
            </div> 
          {/* Galeri 6 Gambar Era Kolonial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
            {colonialImages.map((url, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={url}
                  alt={`Gambar era kolonial ${index + 1}`}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== BAGIAN 3: POTENSI DESA ====== */}
      <section className="py-xl bg-surface">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
              Potensi Desa Sumberporong
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-lg"></div>
          </div>

          {/* Deskripsi Potensi Desa */}
          <div className="max-w-4xl mx-auto text-center mb-xl">
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Desa Sumberporong memiliki beragam potensi yang dapat dikembangkan untuk 
              meningkatkan kesejahteraan masyarakat. Potensi-potensi tersebut meliputi 
              sektor pertanian, perkebunan, pariwisata, kerajinan tangan, dan budaya lokal 
              yang kaya akan nilai-nilai luhur.
            </p>
          </div>

          {/* Grid Potensi Desa (opsional: bisa ditampilkan dalam card) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/20 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-md">
                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                  agriculture
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-sm">
                Pertanian & Perkebunan
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Lahan subur menghasilkan padi, jagung, kopi, dan berbagai komoditas perkebunan unggulan.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/20 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-md">
                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                  comedy_mask
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-sm">
                Pariwisata & Budaya
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Keindahan alam, situs sejarah, dan tradisi budaya yang menjadi daya tarik wisata.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/20 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-md">
                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                Draw_Collage
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-sm">
                Kerajinan & UMKM
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Produk anyaman, batik, dan makanan olahan khas desa yang telah mendunia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== BAGIAN 4: PETA DESA (embed dari Maps) ====== */}
      <section className="py-xl bg-surface-container-low">
        <PetaDesa/>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;
import React from 'react';

const VisiMisi = () => {
  return (
    <section className="py-xl bg-surface-container-low">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-xl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Visi &amp; Misi</h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {/* Card Visi */}
          <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 p-xl flex flex-col items-start transition-all hover:shadow-md hover:-translate-y-1 duration-300">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-md">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                visibility
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-sm">Visi</h3>
            <div className="w-12 h-1 bg-primary rounded-full mb-md"></div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Terwujudnya Desa Sumberporong yang Mandiri, Sejahtera, dan Berbudaya melalui Tata Kelola Pemerintahan yang Baik dan Transparan.
            </p>
          </div>
          {/* Card Misi */}
          <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 p-xl flex flex-col items-start transition-all hover:shadow-md hover:-translate-y-1 duration-300">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-md">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                flag
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-sm">Misi</h3>
            <div className="w-12 h-1 bg-primary rounded-full mb-md"></div>
            <ul className="font-body-md text-body-md text-on-surface-variant space-y-2 list-disc list-inside leading-relaxed">
              <li>Meningkatkan kualitas pelayanan publik secara transparan dan akuntabel.</li>
              <li>Mendorong pemberdayaan ekonomi masyarakat berbasis potensi lokal.</li>
              <li>Meningkatkan kualitas infrastruktur desa untuk mendukung aktivitas warga.</li>
              <li>Melestarikan nilai-nilai budaya dan gotong royong dalam kehidupan bermasyarakat.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisiMisi;
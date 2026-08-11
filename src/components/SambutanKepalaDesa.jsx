import React from 'react';

const SambutanKepalaDesa = () => {
  return (
    <section className="py-xl bg-surface">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-xl bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/20">
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative rounded-full overflow-hidden w-64 h-64 md:w-80 md:h-80 shadow-md border-4 border-surface">
              <img
                className="w-full h-full object-cover"
                src="/src/assets/kepaladesa.jpg"
                alt="Logo Desa Sumberporong"
              />
            </div>
          </div>
          <div className="md:col-span-8 flex flex-col justify-center">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
              Sambutan Kepala Desa
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mb-lg"></div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg leading-relaxed italic">
              "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di Website Resmi Pemerintah Desa Sumberporong. Melalui website ini, kami berkomitmen untuk memberikan informasi yang transparan, akurat, dan pelayanan yang lebih mudah bagi seluruh warga desa serta masyarakat luas. Mari bersama membangun Desa Sumberporong yang lebih maju dan sejahtera."
            </p>
            <div className="mb-xl">
              <div className="font-headline-md text-headline-md text-on-surface">
                Ibu. Hj. Idhinningrum S.Sos.,SH.,MM.
              </div>
              <div className="font-label-md text-label-md text-primary mt-xs">
                Kepala Desa Sumberporong
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SambutanKepalaDesa;
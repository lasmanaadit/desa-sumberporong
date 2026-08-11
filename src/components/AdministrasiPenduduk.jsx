import React from 'react';

const AdministrasiPenduduk = () => {
  return (
    <section className="py-xl bg-surface-container-low">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
          Administrasi Penduduk
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-xl rounded-xl flex flex-col items-center justify-center gap-md shadow-sm">
            <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                group
              </span>
            </div>
            <div className="text-center">
              <div className="font-display-lg text-display-lg text-primary mb-xs">5,420</div>
              <div className="font-headline-md text-headline-md text-on-surface-variant">
                Total Penduduk
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-xl rounded-xl flex flex-col items-center justify-center gap-md shadow-sm">
            <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                home_work
              </span>
            </div>
            <div className="text-center">
              <div className="font-display-lg text-display-lg text-primary mb-xs">1,250</div>
              <div className="font-headline-md text-headline-md text-on-surface-variant">
                Kepala Keluarga (KK)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdministrasiPenduduk;
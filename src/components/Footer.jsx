import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-on-background dark:bg-surface-container-lowest w-full rounded-t-xl pt-xl pb-md border-t border-outline-variant/10">
      <div className="w-full py-xl px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-max-width mx-auto mb-lg">
        <div className="col-span-1 md:col-span-1 flex flex-col gap-md">
          <div className="flex items-center gap-sm">
            <span
              className="material-symbols-outlined text-primary-fixed dark:text-primary"
              style={{ fontSize: '32px' }}
            >
              account_balance
            </span>
            <span className="font-headline-md text-headline-md text-primary-fixed dark:text-primary font-bold">
              Sumberporong
            </span>
          </div>
          <p className="font-body-md text-body-md text-surface-variant dark:text-on-surface-variant opacity-90">
            Pusat informasi dan layanan digital resmi Pemerintah Desa Sumberporong.
          </p>
        </div>
        <div className="col-span-1">
          <h3 className="font-label-md text-label-md text-primary-fixed dark:text-primary mb-md uppercase tracking-wider font-bold">
            Layanan
          </h3>
          <ul className="flex flex-col gap-sm">
            <li>
              <a
                className="font-body-md text-body-md text-surface-variant dark:text-on-surface-variant hover:text-primary-fixed-dim dark:hover:text-primary-container transition-colors opacity-90 hover:opacity-100"
                href="#"
              >
                Surat Keterangan
              </a>
            </li>
            <li>
              <a
                className="font-body-md text-body-md text-surface-variant dark:text-on-surface-variant hover:text-primary-fixed-dim dark:hover:text-primary-container transition-colors opacity-90 hover:opacity-100"
                href="#"
              >
                Administrasi Kependudukan
              </a>
            </li>
            <li>
              <a
                className="font-body-md text-body-md text-surface-variant dark:text-on-surface-variant hover:text-primary-fixed-dim dark:hover:text-primary-container transition-colors opacity-90 hover:opacity-100"
                href="#"
              >
                Pengaduan Masyarakat
              </a>
            </li>
          </ul>
        </div>
        <div className="col-span-1">
          <h3 className="font-label-md text-label-md text-primary-fixed dark:text-primary mb-md uppercase tracking-wider font-bold">
            Pintasan
          </h3>
          <ul className="flex flex-col gap-sm">
            <li>
              <a
                className="font-body-md text-body-md text-surface-variant dark:text-on-surface-variant hover:text-primary-fixed-dim dark:hover:text-primary-container transition-colors opacity-90 hover:opacity-100"
                href="#"
              >
                Kebijakan Privasi
              </a>
            </li>
            <li>
              <a
                className="font-body-md text-body-md text-surface-variant dark:text-on-surface-variant hover:text-primary-fixed-dim dark:hover:text-primary-container transition-colors opacity-90 hover:opacity-100"
                href="#"
              >
                Syarat &amp; Ketentuan
              </a>
            </li>
            <li>
              <a
                className="font-body-md text-body-md text-surface-variant dark:text-on-surface-variant hover:text-primary-fixed-dim dark:hover:text-primary-container transition-colors opacity-90 hover:opacity-100"
                href="#"
              >
                Peta Situs
              </a>
            </li>
            <li>
              <a
                className="font-body-md text-body-md text-surface-variant dark:text-on-surface-variant hover:text-primary-fixed-dim dark:hover:text-primary-container transition-colors opacity-90 hover:opacity-100"
                href="#"
              >
                Bantuan
              </a>
            </li>
          </ul>
        </div>
        <div className="col-span-1">
          <h3 className="font-label-md text-label-md text-primary-fixed dark:text-primary mb-md uppercase tracking-wider font-bold">
            Kontak
          </h3>
          <ul className="flex flex-col gap-sm font-body-md text-body-md text-surface-variant dark:text-on-surface-variant opacity-90">
            <li className="flex items-start gap-xs">
              <span className="material-symbols-outlined text-[20px] text-primary-fixed">location_on</span>
              <span>Jl. Balai Desa No. 1, Sumberporong</span>
            </li>
            <li className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[20px] text-primary-fixed">mail</span>
              <span>info@sumberporong.desa.id</span>
            </li>
            <li className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[20px] text-primary-fixed">call</span>
              <span>(0341) 123456</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-surface-variant/20 dark:border-on-surface-variant/20 pt-md px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto text-center font-body-md text-body-md text-surface-variant dark:text-on-surface-variant opacity-70">
        © 2024 Balai Desa Sumberporong. Seluruh Hak Cipta Dilindungi.
      </div>
    </footer>
  );
};

export default Footer;
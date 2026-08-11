import React from 'react';

const KritikSaran = () => {
  return (
    <section className="py-xl bg-surface">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Kritik dan Saran</h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-lg"></div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
            Masukan Anda sangat berarti bagi kami untuk meningkatkan pelayanan desa menjadi lebih baik.
          </p>
          <form className="bg-surface-container-lowest p-lg md:p-xl rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-md text-left">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="name">
                Nama Lengkap
              </label>
              <input
                className="w-full rounded-md border-outline-variant/50 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                id="name"
                name="name"
                placeholder="Masukkan nama Anda"
                type="text"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="email">
                Email
              </label>
              <input
                className="w-full rounded-md border-outline-variant/50 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                id="email"
                name="email"
                placeholder="Masukkan alamat email"
                type="email"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="message">
                Pesan / Saran
              </label>
              <textarea
                className="w-full rounded-md border-outline-variant/50 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                id="message"
                name="message"
                placeholder="Tuliskan kritik atau saran Anda di sini..."
                rows="4"
              ></textarea>
            </div>
            <button
              className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-md px-lg rounded-lg transition-colors shadow-sm w-full mt-sm"
              type="submit"
            >
              Kirim Pesan
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default KritikSaran;
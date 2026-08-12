import React from 'react';

const KritikSaran = () => {
  return (
    <section className="py-xl bg-surface">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">

        {/* ================= HEADER ================= */}
        <div className="max-w-2xl mx-auto text-center mb-xl">

          <h2 className="font-headline-lg text-primary">
            Kritik dan Saran
          </h2>

          <div className="w-16 h-1 bg-primary rounded-full mx-auto mt-md mb-lg"></div>

          <p className="font-body-md text-on-surface-variant">
            Masukan Anda sangat berarti bagi kami untuk meningkatkan
            pelayanan desa menjadi lebih baik.
          </p>

        </div>

        {/* ================= FORM ================= */}
        <div className="max-w-2xl mx-auto">

          <form
            className="
              bg-surface-container-lowest
              border border-outline-variant/20
              rounded-2xl
              shadow-sm
              p-6
              md:p-8
              flex
              flex-col
              gap-6
            "
          >

            {/* ================= NAMA ================= */}
            <div className="flex flex-col gap-2">

              <label
                htmlFor="name"
                className="font-label-md text-on-surface font-semibold"
              >
                Nama Lengkap
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Masukkan nama Anda"
                className="
                  w-full
                  h-12
                  px-4
                  rounded-lg
                  border
                  border-outline-variant/40
                  bg-surface
                  text-on-surface
                  placeholder:text-on-surface-variant/60
                  outline-none
                  transition-all
                  duration-200
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                "
              />

            </div>

            {/* ================= EMAIL ================= */}
            <div className="flex flex-col gap-2">

              <label
                htmlFor="email"
                className="font-label-md text-on-surface font-semibold"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Masukkan alamat email"
                className="
                  w-full
                  h-12
                  px-4
                  rounded-lg
                  border
                  border-outline-variant/40
                  bg-surface
                  text-on-surface
                  placeholder:text-on-surface-variant/60
                  outline-none
                  transition-all
                  duration-200
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                "
              />

            </div>

            {/* ================= PESAN ================= */}
            <div className="flex flex-col gap-2">

              <label
                htmlFor="message"
                className="font-label-md text-on-surface font-semibold"
              >
                Pesan / Saran
              </label>

              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Tuliskan kritik atau saran Anda di sini..."
                className="
                  w-full
                  min-h-32
                  px-4
                  py-3
                  rounded-lg
                  border
                  border-outline-variant/40
                  bg-surface
                  text-on-surface
                  placeholder:text-on-surface-variant/60
                  outline-none
                  resize-y
                  transition-all
                  duration-200
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                "
              />

            </div>

            {/* ================= BUTTON ================= */}
            <button
              type="submit"
              className="
                w-full
                h-12
                mt-1
                bg-primary
                hover:bg-primary-container
                text-on-primary
                rounded-lg
                font-label-md
                font-semibold
                shadow-sm
                hover:shadow-md
                transition-all
                duration-200
                flex
                items-center
                justify-center
                gap-2
              "
            >

              <span
                className="material-symbols-outlined"
                style={{ fontSize: '20px' }}
              >
                send
              </span>

              Kirim Pesan

            </button>

          </form>

        </div>

      </div>
    </section>
  );
};

export default KritikSaran;
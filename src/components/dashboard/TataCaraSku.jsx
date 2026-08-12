import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TataCaraSku = ({ jenisSurat = 'pengajuan surat' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      nomor: '01',
      icon: 'edit_document',
      judul: 'Isi Formulir Pengajuan',
      deskripsi: `Lengkapi seluruh data ${jenisSurat} melalui formulir yang tersedia. Pastikan seluruh data yang dimasukkan sudah benar.`,
    },
    {
      nomor: '02',
      icon: 'upload_file',
      judul: 'Upload Dokumen Persyaratan',
      deskripsi:
        'Upload dokumen persyaratan yang diperlukan sesuai dengan jenis pengajuan.',
    },
    {
      nomor: '03',
      icon: 'send',
      judul: 'Kirim Pengajuan',
      deskripsi:
        'Periksa kembali data dan dokumen sebelum mengirim pengajuan kepada Pemerintah Desa.',
    },
    {
      nomor: '04',
      icon: 'pending_actions',
      judul: 'Menunggu Verifikasi',
      deskripsi:
        'Petugas desa akan memeriksa data dan dokumen yang telah dikirim. Status pengajuan dapat dipantau melalui dashboard.',
    },
    {
      nomor: '05',
      icon: 'check_circle',
      judul: 'Pengajuan Disetujui',
      deskripsi:
        'Jika data dan dokumen telah sesuai, pengajuan akan disetujui oleh petugas desa.',
    },
    {
      nomor: '06',
      icon: 'location_on',
      judul: 'Datang ke Balai Desa',
      deskripsi:
        'Setelah pengajuan disetujui, pemohon datang ke Balai Desa Sumberporong untuk mengambil surat pengantar yang telah dicetak oleh petugas.',
    },
    {
      nomor: '07',
      icon: 'draw',
      judul: 'Tanda Tangan Pemohon',
      deskripsi:
        'Pemohon melakukan tanda tangan secara langsung pada surat pengantar di Balai Desa.',
    },
  ];

  return (
    <section className="mb-6">

      {/* =====================================================
          HEADER / TOMBOL ACCORDION
      ====================================================== */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full
          bg-surface-container-lowest
          border border-outline-variant/20
          rounded-2xl
          p-5
          flex items-center justify-between
          text-left
          hover:border-primary/30
          hover:shadow-sm
          transition-all duration-200
        "
      >
        {/* KIRI */}
        <div className="flex items-center gap-4">

          {/* ICON */}
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '24px' }}
            >
              info
            </span>
          </div>

          {/* TEXT */}
          <div>
            <h2 className="font-headline-md text-on-background text-lg">
              Tata Cara Mengurus Online
            </h2>

            <p className="font-label-sm text-on-surface-variant tracking-normal mt-1">
              Panduan pengajuan {jenisSurat}
            </p>
          </div>

        </div>

        {/* ARROW */}
        <motion.span
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className="material-symbols-outlined text-on-surface-variant"
          style={{ fontSize: '24px' }}
        >
          expand_more
        </motion.span>

      </button>


      {/* =====================================================
          ISI TATA CARA
      ====================================================== */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            className="overflow-hidden"
          >

            <div className="
              bg-surface-container-lowest
              border-x
              border-b
              border-outline-variant/20
              rounded-b-2xl
              px-5
              py-6
            ">

              {/* =================================================
                  STEPS
              ================================================== */}
              <div className="space-y-0">

                {steps.map((step, index) => (
                  <div
                    key={step.nomor}
                    className="flex gap-4"
                  >

                    {/* NOMOR */}
                    <div className="flex flex-col items-center">

                      <div className="
                        w-9
                        h-9
                        rounded-full
                        bg-primary/10
                        text-primary
                        flex
                        items-center
                        justify-center
                        shrink-0
                      ">
                        <span className="font-label-sm font-bold">
                          {step.nomor}
                        </span>
                      </div>

                      {/* GARIS */}
                      {index !== steps.length - 1 && (
                        <div className="
                          w-px
                          flex-1
                          bg-outline-variant/40
                          min-h-12
                        " />
                      )}

                    </div>


                    {/* ISI */}
                    <div className="pb-6 pt-1">

                      {/* JUDUL */}
                      <div className="flex items-center gap-2">

                        <span
                          className="material-symbols-outlined text-primary"
                          style={{ fontSize: '20px' }}
                        >
                          {step.icon}
                        </span>

                        <h3 className="
                          font-label-md
                          font-semibold
                          text-on-surface
                        ">
                          {step.judul}
                        </h3>

                      </div>

                      {/* DESKRIPSI */}
                      <p className="
                        font-body-md
                        text-on-surface-variant
                        mt-2
                        max-w-3xl
                      ">
                        {step.deskripsi}
                      </p>

                    </div>

                  </div>
                ))}

              </div>


              {/* =================================================
                  CATATAN
              ================================================== */}
              <div className="
                mt-2
                bg-primary/5
                border
                border-primary/10
                rounded-xl
                p-4
              ">

                <div className="flex items-start gap-3">

                  <span
                    className="
                      material-symbols-outlined
                      text-primary
                      shrink-0
                    "
                    style={{ fontSize: '21px' }}
                  >
                    info
                  </span>

                  <div>

                    <p className="
                      font-label-md
                      font-semibold
                      text-primary
                    ">
                      Penting untuk diperhatikan
                    </p>

                    <p className="
                      font-label-sm
                      text-on-surface-variant
                      tracking-normal
                      mt-1
                    ">
                      Pengajuan dilakukan secara online. Setelah pengajuan
                      disetujui, pemohon tetap harus datang ke Balai Desa
                      untuk mengambil surat pengantar dan melakukan tanda
                      tangan secara langsung.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default TataCaraSku;
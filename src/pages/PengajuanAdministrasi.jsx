import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';

const PengajuanAdministrasi = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navigate = useNavigate();

  const jenisPengajuan = [
    {
      title: 'Pengajuan KTP',
      description:
        'Pengajuan surat pengantar untuk keperluan pembuatan, perpanjangan, atau penggantian KTP.',
      icon: 'badge',
      path: '/dashboard/pengajuan/ktp',
    },
    {
      title: 'Surat Keterangan Usaha',
      description:
        'Ajukan surat keterangan yang menerangkan bahwa Anda memiliki usaha di Desa Sumberporong.',
      icon: 'storefront',
      path: '/dashboard/pengajuan/sku',
    },
    {
      title: 'Surat Keterangan Domisili',
      description:
        'Ajukan surat keterangan domisili sebagai bukti tempat tinggal.',
      icon: 'home_pin',
      path: '/dashboard/pengajuan/domisili',
    },
    {
      title: 'Surat Keterangan Lainnya',
      description:
        'Ajukan berbagai surat keterangan desa sesuai kebutuhan Anda.',
      icon: 'description',
      path: '/dashboard/pengajuan/lainnya',
    },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* ================= SIDEBAR ================= */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* ================= MAIN ================= */}
      <div className="lg:ml-72 min-h-screen">

        {/* ================= TOPBAR ================= */}
        <Topbar setIsOpen={setIsSidebarOpen} />

        {/* ================= CONTENT ================= */}
        <main className="p-6 lg:p-8">

          <div className="max-w-7xl mx-auto">

            {/* HEADER */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <h1 className="font-headline-lg text-on-background">
                Pengajuan Administrasi
              </h1>

              <p className="font-body-md text-on-surface-variant mt-2">
                Pilih jenis administrasi yang ingin Anda ajukan.
              </p>
            </motion.section>

            {/* INFORMATION */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="w-full bg-primary/5 border border-primary/10 rounded-xl p-4 mb-8"
            >
              <div className="flex items-start gap-3">

                <span
                  className="material-symbols-outlined text-primary shrink-0"
                  style={{ fontSize: '22px' }}
                >
                  info
                </span>

                <div>
                  <p className="font-label-md font-semibold text-primary">
                    Informasi Pengajuan
                  </p>

                  <p className="font-body-md text-on-surface-variant mt-1">
                    Pilih jenis surat sesuai kebutuhan Anda. Setiap jenis
                    pengajuan memiliki formulir dan persyaratan yang berbeda.
                  </p>
                </div>

              </div>
            </motion.div>

            {/* CARD PENGAJUAN */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {jenisPengajuan.map((item, index) => (
                <motion.button
                  key={item.path}
                  type="button"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                  className="text-left bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all"
                >

                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">

                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '25px' }}
                      >
                        {item.icon}
                      </span>

                    </div>

                    <div className="flex-1">

                      <h2 className="font-headline-md text-lg text-on-surface">
                        {item.title}
                      </h2>

                      <p className="font-body-md text-on-surface-variant mt-2">
                        {item.description}
                      </p>

                      <div className="mt-4 flex items-center gap-1 text-primary font-label-md font-semibold">

                        Ajukan sekarang

                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: '18px' }}
                        >
                          arrow_forward
                        </span>

                      </div>

                    </div>

                  </div>

                </motion.button>
              ))}

            </section>

          </div>

        </main>

      </div>

    </div>
  );
};

export default PengajuanAdministrasi;
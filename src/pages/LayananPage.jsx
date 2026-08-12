// src/pages/LayananPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // <-- perbaiki import
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LayananPage = () => {

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  const navigate = useNavigate();

  const faqData = [
    {
      question: 'Berapa lama proses pembuatan KTP Online?',
      answer: 'Normalnya, proses verifikasi di tingkat desa membutuhkan waktu 1-2 hari kerja. Setelah itu, berkas akan diteruskan ke kecamatan/disdukcapil untuk pencetakan.'
    },
    {
      question: 'Apakah layanan online ini berbayar?',
      answer: 'Tidak. Semua layanan administrasi desa yang disediakan melalui portal ini adalah gratis (tanpa dipungut biaya).'
    }
  ];

  // Data layanan lainnya (digunakan untuk grid di bawah)
  const otherServices = [
    { slug: 'surat-pengantar-nikah', title: 'Surat Pengantar Nikah', icon: 'favorite' },
    { slug: 'surat-kematian', title: 'Surat Kematian', icon: 'description' },
    { slug: 'pindah-datang', title: 'Pindah Datang', icon: 'move_up' },
    { slug: 'kartu-keluarga', title: 'Kartu Keluarga', icon: 'family_restroom' },
    { slug: 'skck-pengantar', title: 'SKCK Pengantar', icon: 'policy' },
    { slug: 'surat-tidak-mampu', title: 'Surat Keterangan Tidak Mampu', icon: 'gavel' },
  ];

  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex flex-col pt-18">
      <Navbar />

      <main className="grow flex flex-col gap-xl pb-xl">
        {/* Hero Section */}
        <section className="relative pt-xl px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-md">
            <h1 className="font-display-lg text-display-lg text-on-background md:hidden font-headline-lg-mobile text-headline-lg-mobile">
              Layanan Digital Desa
            </h1>
            <h1 className="font-display-lg text-display-lg text-on-background hidden md:block">
              Layanan Digital Desa
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Kemudahan administrasi dalam genggaman Anda. Akses layanan desa Sumberporong secara efisien, transparan, dan cepat kapan saja, di mana saja.
            </p>
          </div>
        </section>

        {/* Primary Services (Bento Grid Style) */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1)] border border-[#E2E8F0] hover:shadow-[0_10px_15px_-3px_rgb(0,0,0,0.1)] transition-shadow duration-300 flex flex-col gap-md relative overflow-hidden group">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-surface-container rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="w-12 h-12 rounded-lg bg-[#Eefbf0] text-primary flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>id_card</span>
              </div>
              <div className="flex flex-col gap-sm relative z-10">
                <h3 className="font-headline-md text-headline-md text-on-surface">Pengurusan KTP Online</h3>
                <p className="font-body-md text-body-md text-on-surface-variant grow">
                  Ajukan permohonan Kartu Tanda Penduduk baru atau perbaikan data dengan mudah tanpa perlu antre di balai desa.
                </p>
              </div>
              
              <button onClick={() => navigate('/dashboard/pengajuan/ktp')} className="mt-auto bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-lg hover:bg-surface-tint transition-colors w-max relative z-10 flex items-center gap-2">
                Mulai Urus Sekarang
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1)] border border-[#E2E8F0] hover:shadow-[0_10px_15px_-3px_rgb(0,0,0,0.1)] transition-shadow duration-300 flex flex-col gap-md relative overflow-hidden group">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-surface-container rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="w-12 h-12 rounded-lg bg-[#Eefbf0] text-primary flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
              </div>
              <div className="flex flex-col gap-sm relative z-10">
                <h3 className="font-headline-md text-headline-md text-on-surface">Keterangan Usaha Online</h3>
                <p className="font-body-md text-body-md text-on-surface-variant grow">
                  Dapatkan Surat Keterangan Usaha (SKU) resmi untuk keperluan perbankan atau legalitas usaha Anda dengan cepat.
                </p>
              </div>
              <button onClick={() => navigate('/dashboard/pengajuan/sku')}className="mt-auto bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-lg hover:bg-surface-tint transition-colors w-max relative z-10 flex items-center gap-2">
                Mulai Urus Sekarang
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Procedure Guide */}
        <section className="bg-surface-container-low py-xl">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full flex flex-col gap-lg">
            <div className="text-center flex flex-col gap-sm">
              <h2 className="font-headline-lg text-headline-lg text-on-background md:hidden font-headline-lg-mobile text-headline-lg-mobile">
                Panduan Tata Cara
              </h2>
              <h2 className="font-headline-lg text-headline-lg text-on-background hidden md:block">
                Panduan Tata Cara
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Langkah mudah untuk mengurus layanan secara online.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center gap-sm p-md bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)] border border-[#E2E8F0]">
                <div className="w-16 h-16 rounded-full bg-[#Eefbf0] text-primary flex items-center justify-center font-headline-md text-headline-md">
                  1
                </div>
                <h4 className="font-label-md text-label-md text-on-surface font-semibold">Isi Formulir</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Lengkapi data diri sesuai kebutuhan layanan.</p>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center gap-sm p-md bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)] border border-[#E2E8F0]">
                <div className="w-16 h-16 rounded-full bg-[#Eefbf0] text-primary flex items-center justify-center font-headline-md text-headline-md">
                  2
                </div>
                <h4 className="font-label-md text-label-md text-on-surface font-semibold">Unggah Dokumen</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Siapkan dan unggah foto dokumen persyaratan.</p>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center gap-sm p-md bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)] border border-[#E2E8F0]">
                <div className="w-16 h-16 rounded-full bg-[#Eefbf0] text-primary flex items-center justify-center font-headline-md text-headline-md">
                  3
                </div>
                <h4 className="font-label-md text-label-md text-on-surface font-semibold">Verifikasi</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Tunggu proses verifikasi oleh petugas desa.</p>
              </div>
              {/* Step 4 */}
              <div className="flex flex-col items-center text-center gap-sm p-md bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)] border border-[#E2E8F0]">
                <div className="w-16 h-16 rounded-full bg-[#Eefbf0] text-primary flex items-center justify-center font-headline-md text-headline-md">
                  4
                </div>
                <h4 className="font-label-md text-label-md text-on-surface font-semibold">Selesai / Ambil</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Dokumen digital siap diunduh atau fisik diambil.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Other Services Grid */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full flex flex-col gap-lg">
          <div className="flex justify-between items-end border-b border-[#F1F5F9] pb-4">
            <h2 className="font-headline-md text-headline-md text-on-background">Layanan Lainnya</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
            {otherServices.map((service) => (
              <Link
                key={service.slug}
                to={`/layanan/${service.slug}`}
                className="flex items-center gap-4 p-md bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)] border border-[#E2E8F0] hover:border-primary/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#Eefbf0] text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{service.icon}</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">{service.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full flex flex-col gap-lg">
          <div className="flex flex-col gap-sm">
            <h2 className="font-headline-md text-headline-md text-on-background">Bantuan (FAQ)</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Pertanyaan yang sering diajukan terkait layanan desa.</p>
          </div>
          <div className="flex flex-col gap-4">
            {faqData.map((item, index) => (
              <div key={index} className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)] border border-[#E2E8F0] overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-md text-left focus:outline-none"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <span className="font-label-md text-label-md text-on-surface font-semibold">{item.question}</span>
                  <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                <div className={`px-md pb-md overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LayananPage;
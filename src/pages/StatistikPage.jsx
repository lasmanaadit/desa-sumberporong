// src/pages/StatistikPage.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const StatistikPage = () => {
  return (
    <div className="bg-background text-on-surface antialiased flex flex-col min-h-screen">

        <div className="min-h-screen bg-surface">
            <Navbar />

      

            {/* ====== MAIN CONTENT ====== */}
            <main className="grow pt-26 pb-xl px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full">
                
                {/* Header */}
                <header className="mb-xl text-center md:text-left">
                <h1 className="font-display-lg text-display-lg text-on-surface mb-sm">
                    Statistik Desa Sumberporong
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                    Transparansi data kependudukan dan sosial untuk mewujudkan tata kelola desa yang lebih baik dan terukur.
                </p>
                <div className="mt-md font-label-sm text-label-sm text-outline flex items-center justify-center md:justify-start gap-xs">
                    <span className="material-symbols-outlined text-[16px]">update</span>
                    Terakhir diperbarui pada: 12 Oktober 2024
                </div>
                </header>

                {/* IDM Section */}
                <section className="mb-xl">
                <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-lg">
                    <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">
                        Indeks Desa Membangun (IDM)
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                        Status pencapaian perkembangan desa berdasarkan data Kemendesa.
                    </p>
                    </div>
                    <div className="flex flex-col items-center min-w-50">
                    <div className="font-display-lg text-display-lg text-primary mb-xs">0.825</div>
                    <div className="bg-primary-container text-on-primary-container px-md py-xs rounded-full font-label-md text-label-md mb-md">
                        Status: Mandiri
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-3">
                        <div className="bg-primary h-3 rounded-full" style={{ width: '82.5%' }}></div>
                    </div>
                    <div className="w-full flex justify-between font-label-sm text-label-sm text-outline mt-xs">
                        <span>0.000</span>
                        <span>1.000</span>
                    </div>
                    </div>
                </div>
                </section>

                {/* Key Metrics Bento */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
                <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/30 flex flex-col justify-center items-center text-center">
                    <span className="material-symbols-outlined text-primary text-[32px] mb-sm">group</span>
                    <span className="font-body-md text-body-md text-on-surface-variant mb-xs">Total Penduduk</span>
                    <span className="font-headline-lg text-headline-lg text-on-surface">5.420</span>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/30 flex flex-col justify-center items-center text-center">
                    <span className="material-symbols-outlined text-primary text-[32px] mb-sm">home</span>
                    <span className="font-body-md text-body-md text-on-surface-variant mb-xs">Kepala Keluarga</span>
                    <span className="font-headline-lg text-headline-lg text-on-surface">1.250</span>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/30 flex flex-col justify-center items-center text-center">
                    <span className="material-symbols-outlined text-secondary text-[32px] mb-sm">man</span>
                    <span className="font-body-md text-body-md text-on-surface-variant mb-xs">Laki-laki</span>
                    <span className="font-headline-lg text-headline-lg text-on-surface">2.680</span>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/30 flex flex-col justify-center items-center text-center">
                    <span className="material-symbols-outlined text-tertiary text-[32px] mb-sm">woman</span>
                    <span className="font-body-md text-body-md text-on-surface-variant mb-xs">Perempuan</span>
                    <span className="font-headline-lg text-headline-lg text-on-surface">2.740</span>
                </div>
                </section>

                {/* Bansos Section */}
                <section className="mb-xl">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-md">
                    Penerima Bansos (Bantuan Sosial)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                    <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/30">
                    <div className="flex items-center justify-between mb-md">
                        <span className="font-headline-md text-headline-md text-on-surface">PKH</span>
                        <span className="material-symbols-outlined text-primary">family_restroom</span>
                    </div>
                    <div className="font-display-lg text-display-lg text-on-surface mb-xs">320</div>
                    <p className="font-body-md text-body-md text-on-surface-variant">Keluarga Penerima Manfaat</p>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/30">
                    <div className="flex items-center justify-between mb-md">
                        <span className="font-headline-md text-headline-md text-on-surface">BLT DD</span>
                        <span className="material-symbols-outlined text-primary">payments</span>
                    </div>
                    <div className="font-display-lg text-display-lg text-on-surface mb-xs">150</div>
                    <p className="font-body-md text-body-md text-on-surface-variant">Keluarga Penerima Manfaat</p>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/30">
                    <div className="flex items-center justify-between mb-md">
                        <span className="font-headline-md text-headline-md text-on-surface">BPNT</span>
                        <span className="material-symbols-outlined text-primary">local_dining</span>
                    </div>
                    <div className="font-display-lg text-display-lg text-on-surface mb-xs">410</div>
                    <p className="font-body-md text-body-md text-on-surface-variant">Keluarga Penerima Manfaat</p>
                    </div>
                </div>
                </section>

                {/* Charts Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-md mb-xl">
                {/* Usia */}
                <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/30">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-md">
                    Penduduk Berdasarkan Usia
                    </h3>
                    <div className="space-y-md">
                    <div>
                        <div className="flex justify-between font-label-md text-label-md text-on-surface-variant mb-xs">
                        <span>0-14 Tahun</span>
                        <span>25% (1.355)</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between font-label-md text-label-md text-on-surface-variant mb-xs">
                        <span>15-64 Tahun</span>
                        <span>65% (3.523)</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between font-label-md text-label-md text-on-surface-variant mb-xs">
                        <span>65+ Tahun</span>
                        <span>10% (542)</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Pekerjaan */}
                <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/30">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-md">
                    Berdasarkan Pekerjaan
                    </h3>
                    <div className="space-y-sm">
                    <div className="flex items-center gap-sm">
                        <span className="font-label-md text-label-md text-on-surface-variant w-24">Petani</span>
                        <div className="grow bg-surface-container rounded-full h-3">
                        <div className="bg-primary-container h-3 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface w-12 text-right">40%</span>
                    </div>
                    <div className="flex items-center gap-sm">
                        <span className="font-label-md text-label-md text-on-surface-variant w-24">Wiraswasta</span>
                        <div className="grow bg-surface-container rounded-full h-3">
                        <div className="bg-primary-container h-3 rounded-full opacity-80" style={{ width: '25%' }}></div>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface w-12 text-right">25%</span>
                    </div>
                    <div className="flex items-center gap-sm">
                        <span className="font-label-md text-label-md text-on-surface-variant w-24">Buruh</span>
                        <div className="grow bg-surface-container rounded-full h-3">
                        <div className="bg-primary-container h-3 rounded-full opacity-60" style={{ width: '15%' }}></div>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface w-12 text-right">15%</span>
                    </div>
                    <div className="flex items-center gap-sm">
                        <span className="font-label-md text-label-md text-on-surface-variant w-24">PNS</span>
                        <div className="grow bg-surface-container rounded-full h-3">
                        <div className="bg-primary-container h-3 rounded-full opacity-40" style={{ width: '10%' }}></div>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface w-12 text-right">10%</span>
                    </div>
                    <div className="flex items-center gap-sm">
                        <span className="font-label-md text-label-md text-on-surface-variant w-24">Lainnya</span>
                        <div className="grow bg-surface-container rounded-full h-3">
                        <div className="bg-primary-container h-3 rounded-full opacity-20" style={{ width: '10%' }}></div>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface w-12 text-right">10%</span>
                    </div>
                    </div>
                </div>
                </section>
            </main>
        
             <Footer/>
        </div>
        
    </div>
  );
};

export default StatistikPage;
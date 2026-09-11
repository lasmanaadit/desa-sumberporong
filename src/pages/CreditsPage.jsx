// src/pages/CreditsPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import dev1 from '../assets/credits/dev1.jpg';
import dev1 from '../assets/credits/dev2.jpg';
import dev1 from '../assets/credits/dev3.jpg';

// Ganti data ini sesuai developer sebenarnya
const developers = [
  {
    name: 'Lasmana Adiyatma Prafia',
    role: 'Front End Developer,UI/UX',
    image: dev1,
    bio: 'Bertanggung jawab pada pengembangan frontend .',
  },
  {
    name: 'Rayhan Bagas Makarim',
    role: 'Back End Developer',
    image: dev2,
    bio: 'Merancang Pembuatan restfullAPI dan integrasi API',
  },
  {
    name: 'Alfin Dahlin',
    role: 'UI/UX',
    image: dev3,
    bio: 'Merancang tampilan antarmuka dan pengalaman pengguna.',
  },
];

const CreditsPage = () => {
  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex flex-col pt-18">
      <Navbar />
      <main className="grow max-w-5xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-xl">
        <section className="text-center mb-xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>
              groups
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary mb-md">Credits</h1>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-lg"></div>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Terima kasih kepada tim yang telah berkontribusi dalam pengembangan Sistem Informasi Desa Sumberporong.
          </p>
        </section>

        <section className="mb-xl">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 text-center">
            Tim Pengembang
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((dev, idx) => (
              <div
                key={idx}
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-primary/10 mb-4">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="font-headline-md text-lg text-on-surface">{dev.name}</h3>
                <p className="font-label-md text-primary mt-1">{dev.role}</p>
                <p className="font-body-md text-on-surface-variant text-sm mt-3">{dev.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 md:p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
            Teknologi yang Digunakan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'React', icon: 'code' },
              { name: 'Tailwind CSS', icon: 'palette' },
              { name: 'Laravel', icon: 'dns' },
              { name: 'MySQL', icon: 'database' },
            ].map((tech, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>
                  {tech.icon}
                </span>
                <span className="font-label-md text-on-surface">{tech.name}</span>
              </div>
            ))}
          </div>
        </section>

        <p className="text-center font-body-md text-on-surface-variant mt-xl">
          © 2026 Pemerintah Desa Sumberporong. Dibuat dengan ❤️ untuk warga desa.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default CreditsPage;
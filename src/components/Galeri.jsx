import React from 'react';

const galeriData = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAuU7y5aA4z47q34iv7V_NM3igt1eFXj2uucAoHLb3L5fmhO34gADtryeDoalEK81TeyAA8PsiFzWKYIHvgPMIaDzdzdHLQHyKXXVf3cUYL-bhMgcu6eUDjh3WY1GXX1PyWVwWAp-kNfcKEiUuyxPD0sw13YYcqP_uaw-QgTWrrL74ADxAroiUoR4xSS3Jj2W0Byq4BPqIkzDGu8Mj_AoWNHvzd4yyZ3N6Eu7w6VllsZl6i_BfAlOGY',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCI6HDnZAGl2sJmoZnnZMxsnD_tgympf0QrdGgQARmrWW0UlZ9P2iKtneByyLHCKYjtGyE5zp7wilHDMUSFxgyY3opEDRMbGpZ8gwkoLf8skNJq2PqApMeG7F5xdjBSmtu4puGPDbD_dhneuuJ7dFwLDxr0ZfD7c3fohUMVr7vmbXbPF61Ch8QUwxlMvonqnYWyy2zMvJsbgFXVfHxRrwRNb0Jx3TgvpXHNPD9XJ8Dcky9DZg3z6RQ_',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDV7RkZyV3IUnrtnbfHsK56QVvw48Y4gF2Z8poqOWoV7xKm9fY_VkwFCM-jQCRRNQ7S0YLpD7J_nLKVhP4OCIEDdCZt67Jbwe-tV5oUM7h9BSiULRAolO4SYIPSDSW50gf_OKEEkamSVBrqUx16SpqW_OqGoKYSu5RTd1ny6ENA6OTU2PJQ3tH10Wj6w0-oPLG-oSSiUWxUpP74yQsJPxzLdnSKGU6gTQDAmYQLRphbg-BALKKuPPzX',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAxf7Tu8mWHw1jYO7jcyGy9hXtHeiO2ZM92SqrYjaNe83Ih2fQr75Mrdn12ZBTsSYwrctqy58s7CAUBKUTp9HMlatB5b8qEHZptRbxN1_Mt_Qrku1ZTWBbab_RZaNt69CE1KSpk_9aSNUhVbK0M1dLpgYrS0KJ8Br30VbUS1KhPYHbck3ofpqFpt2Tahz8rM1jKEbaH3dTzVCm3BFFEmFyXDAvEJ3hOOFW1q7YKkVpmHs27dmPcAy65',
];

const Galeri = () => {
  return (
    <section className="py-xl bg-surface-container-low">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Galeri Desa</h2>
        <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-xl"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md">
          {galeriData.map((url, index) => (
            <div key={index} className="aspect-square rounded-lg overflow-hidden">
              <img
                alt={`Galeri ${index + 1}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                src={url}
              />
            </div>
          ))}
        </div>
        <div className="mt-lg">
          <a
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-lg transition-colors inline-block"
            href="#"
          >
            Lihat Semua Galeri
          </a>
        </div>
      </div>
    </section>
  );
};

export default Galeri;
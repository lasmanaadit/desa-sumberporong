import React from 'react';

const Hero = () => {
  return (
    <section className="relative h-217.5 min-h-150 flex items-center w-full">
      <div
        className="bg-cover bg-center absolute inset-0"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDK8F5dTb377yMTz5F2CylRx32ml7jcNPY-4gbAsoUdnTGeUELzdDFC_Ee8zgi3QPGWzIvhY7upPpyc73UFznvrMCSPoM7Twk77fYO7hPoQVtdGn24ihoehvJhuaGBhBG6l5avtJMULyprSZLCzJ_o0qMfRyI6pZmdbBFtds6_2VhdVlNPGOlgwTeG9IfH5Wm5oUHjjBoc1MQ0PG7tewxNNHptNS7TP-IkJjha5NhrPIdqsFN9srN7C')",
        }}
      >
        <div className="absolute inset-0 bg-on-background/60"></div>
      </div>
      <div className="relative z-10 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop w-full text-center md:text-left flex flex-col md:flex-row gap-xl items-center">
        <div className="flex-1 text-on-primary">
          <span className="inline-block bg-primary-fixed/20 text-primary-fixed font-label-sm text-label-sm py-xs px-sm rounded-full mb-md backdrop-blur-sm border border-primary-fixed/30">
            Selamat Datang
          </span>
          <h1 className="font-display-lg text-display-lg text-on-primary mb-md">
            Website Resmi<br />
            <span className="text-primary-fixed">Balai Desa Sumberporong</span>
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-high mb-lg max-w-2xl opacity-90">
            Mewujudkan pelayanan prima, transparan, dan inovatif untuk kesejahteraan masyarakat Desa Sumberporong melalui platform digital terintegrasi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
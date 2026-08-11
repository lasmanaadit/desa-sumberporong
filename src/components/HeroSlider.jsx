// src/components/HeroSlider.jsx
import React, { useState, useEffect } from 'react';

const slides = [
  {
    image:
      'src/assets/hero1.jpg',
    title: 'Website Resmi Balai Desa Sumberporong',
    subtitle: 'Mewujudkan pelayanan prima, transparan, dan inovatif untuk kesejahteraan masyarakat.',
  },
  {
    image:
      'src/assets/hero2.jpeg',
    title: 'Potensi Desa Sumberporong',
    subtitle: 'Kekayaan alam dan budaya yang siap dikembangkan untuk kesejahteraan bersama.',
  },
  {
    image:
      'src/assets/hero3.jpg',
    title: 'Gotong Royong Desa',
    subtitle: 'Semangat kebersamaan warga dalam membangun desa yang lebih maju.',
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); // ganti setiap 5 detik
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative h-217.5 min-h-150 flex items-center w-full overflow-hidden">
      {/* Slide Background */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-on-background/60"></div>
          </div>
          <div className="relative z-10 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop w-full h-full flex items-center">
            <div className="text-on-primary max-w-2xl">
              <span className="inline-block bg-primary-fixed/20 text-primary-fixed font-label-sm text-label-sm py-xs px-sm rounded-full mb-md backdrop-blur-sm border border-primary-fixed/30">
                Selamat Datang
              </span>
              <h1 className="font-display-lg text-display-lg text-on-primary mb-md">
                {slide.title}
              </h1>
              <p className="font-body-lg text-body-lg text-surface-container-high opacity-90">
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Indikator Dot */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current
                ? 'bg-primary-fixed w-6'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
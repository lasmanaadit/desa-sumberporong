// src/components/HeroSlider.jsx

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import api from '../api/axios';

const HeroSlider = () => {
  // ============================================================
  // STATE
  // ============================================================

  const [
    slides,
    setSlides,
  ] = useState([]);

  const [
    current,
    setCurrent,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  // ============================================================
  // FETCH HERO PUBLIC
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const fetchHero = async () => {
      setLoading(true);
      setError('');

      try {
        const response =
          await api.get(
            '/hero'
          );

        if (cancelled) {
          return;
        }

        const responseData =
          response.data?.data;

        let data = [];

        // --------------------------------------------------------
        // Support:
        // 1. data langsung array
        // 2. Laravel pagination
        // --------------------------------------------------------

        if (
          Array.isArray(
            responseData
          )
        ) {
          data =
            responseData;
        } else {
          data =
            Array.isArray(
              responseData?.data
            )
              ? responseData.data
              : [];
        }

        // --------------------------------------------------------
        // Pastikan urutan hero benar
        // --------------------------------------------------------

        data.sort(
          (a, b) =>
            Number(
              a?.urutan ?? 0
            ) -
            Number(
              b?.urutan ?? 0
            )
        );

        setSlides(data);

        setCurrent(0);
      } catch (
        err
      ) {
        if (cancelled) {
          return;
        }

        console.error(
          'Gagal mengambil hero public:',
          err
        );

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          'Gagal mengambil hero.'
        );

        setSlides([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchHero();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // AUTO SLIDE
  // ============================================================

  useEffect(() => {
    if (
      slides.length <= 1
    ) {
      return;
    }

    const interval =
      setInterval(() => {
        setCurrent(
          (prev) =>
            (
              prev + 1
            ) %
            slides.length
        );
      }, 5000);

    return () => {
      clearInterval(
        interval
      );
    };
  }, [
    slides.length,
  ]);

  // ============================================================
  // PREVIOUS SLIDE
  // ============================================================

  const prevSlide = () => {
    if (
      slides.length === 0
    ) {
      return;
    }

    setCurrent(
      (prev) =>
        (
          prev -
          1 +
          slides.length
        ) %
        slides.length
    );
  };

  // ============================================================
  // NEXT SLIDE
  // ============================================================

  const nextSlide = () => {
    if (
      slides.length === 0
    ) {
      return;
    }

    setCurrent(
      (prev) =>
        (
          prev + 1
        ) %
        slides.length
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <section className="relative flex h-217.5 min-h-150 w-full items-center justify-center overflow-hidden bg-on-background">
        <div className="h-full w-full animate-pulse bg-surface-container-high" />
      </section>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (
    !loading &&
    error
  ) {
    return (
      <section className="relative flex h-217.5 min-h-150 w-full items-center justify-center overflow-hidden bg-surface-container-low">
        <div className="px-margin-mobile text-center md:px-margin-desktop">

          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
            image
          </span>

          <p className="mt-md text-body-md text-on-surface-variant">
            {error}
          </p>

        </div>
      </section>
    );
  }

  // ============================================================
  // EMPTY
  // ============================================================

  if (
    !loading &&
    !error &&
    slides.length === 0
  ) {
    return null;
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="relative flex h-217.5 min-h-150 w-full items-center overflow-hidden">

      {/* ========================================================
          SLIDE
      ======================================================== */}

      {slides.map(
        (
          slide,
          index
        ) => {

          // ======================================================
          // ACTIVE SLIDE
          // ======================================================

          const isActive =
            index === current;

          // ======================================================
          // SLIDE 1 = WELCOME
          // ======================================================

          const isWelcome =
            Number(
              slide?.urutan
            ) === 1;

          // ======================================================
          // SLIDE 2+ = BERITA
          // ======================================================

          const isBerita =
            Number(
              slide?.urutan
            ) >= 2 &&
            Boolean(
              slide?.berita?.slug
            );

          // ======================================================
          // CONTENT SLIDE
          // ======================================================

          const slideContent = (
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive
                  ? 'opacity-100'
                  : 'pointer-events-none opacity-0'
              }`}
            >

              {/* ==================================================
                  BACKGROUND
              ================================================== */}

              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    `url(${slide?.image_url || ''})`,
                }}
              >

                {/* ------------------------------------------------
                    OVERLAY
                ------------------------------------------------ */}

                <div className="absolute inset-0 bg-on-background/60" />

                {/* ------------------------------------------------
                    GRADIENT
                ------------------------------------------------ */}

                <div className="absolute inset-0 bg-linear-to-r from-on-background/80 via-on-background/40 to-transparent" />

              </div>

              {/* ==================================================
                  CONTENT
              ================================================== */}

              <div className="relative z-10 mx-auto flex h-full w-full max-w-max-width items-center px-margin-mobile md:px-margin-desktop">

                <div className="max-w-2xl text-on-primary">

                  {/* ==============================================
                      LABEL
                  ============================================== */}

                  <span className="mb-md inline-block rounded-full border border-primary-fixed/30 bg-primary-fixed/20 px-sm py-xs font-label-sm text-label-sm text-primary-fixed backdrop-blur-sm">
                    {isWelcome
                      ? 'Selamat Datang'
                      : 'Berita Desa'}
                  </span>

                  {/* ==============================================
                      TITLE
                  ============================================== */}

                  <h1 className="mb-md font-display-lg text-display-lg text-on-primary">
                    {slide?.title}
                  </h1>

                  {/* ==============================================
                      SUBTITLE
                  ============================================== */}

                  {slide?.subtitle && (
                    <p className="font-body-lg text-body-lg text-surface-container-high opacity-90">
                      {slide.subtitle}
                    </p>
                  )}

                  {/* ==============================================
                      CTA BERITA
                  ============================================== */}

                  {isBerita && (
                    <div className="mt-xl">

                      <span className="inline-flex items-center gap-sm rounded-full bg-primary px-lg py-sm font-label-lg text-label-lg text-on-primary transition-colors hover:bg-primary-container">
                        Baca Berita

                        <span aria-hidden="true">
                          →
                        </span>
                      </span>

                    </div>
                  )}

                </div>

              </div>

            </div>
          );

          // ======================================================
          // SLIDE BERITA
          // ======================================================
          //
          // Slide 2 dan seterusnya clickable.
          //
          // ======================================================

          if (isBerita) {
            return (
              <Link
                key={
                  slide.id
                }
                to={
                  `/berita/${slide.berita.slug}`
                }
                className="absolute inset-0 block"
                aria-label={
                  `Baca berita ${
                    slide.berita.judul ||
                    slide.title ||
                    'berita'
                  }`
                }
              >
                {slideContent}
              </Link>
            );
          }

          // ======================================================
          // SLIDE WELCOME
          // ======================================================
          //
          // Slide pertama tidak clickable.
          //
          // ======================================================

          return (
            <React.Fragment
              key={
                slide.id
              }
            >
              {slideContent}
            </React.Fragment>
          );
        }
      )}

      {/* ========================================================
          PREVIOUS BUTTON
      ======================================================== */}

      {slides.length > 1 && (
        <button
          type="button"
          onClick={
            prevSlide
          }
          aria-label="Slide sebelumnya"
          className="absolute left-lg top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-black/40"
        >
          ‹
        </button>
      )}

      {/* ========================================================
          NEXT BUTTON
      ======================================================== */}

      {slides.length > 1 && (
        <button
          type="button"
          onClick={
            nextSlide
          }
          aria-label="Slide berikutnya"
          className="absolute right-lg top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-black/40"
        >
          ›
        </button>
      )}

      {/* ========================================================
          INDICATOR DOT
      ======================================================== */}

      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-2">

          {slides.map(
            (
              slide,
              index
            ) => (
              <button
                key={
                  slide.id
                }
                type="button"
                onClick={() =>
                  setCurrent(
                    index
                  )
                }
                aria-label={
                  `Pilih slide ${
                    index + 1
                  }`
                }
                className={`h-3 rounded-full transition-all ${
                  index === current
                    ? 'w-6 bg-primary-fixed'
                    : 'w-3 bg-white/50 hover:bg-white/80'
                }`}
              />
            )
          )}

        </div>
      )}

    </section>
  );
};

export default HeroSlider;
// src/pages/BeritaDetailPage.jsx

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useParams,
} from 'react-router-dom';

import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from 'react-icons/fa';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import api from '../api/axios';

const BeritaDetailPage = () => {
  /*
  |--------------------------------------------------------------------------
  | PARAMETER
  |--------------------------------------------------------------------------
  |
  | Backend:
  |
  | GET /api/berita/{slug}
  |
  */

  const {
    slug,
  } = useParams();

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    berita,
    setBerita,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    imageError,
    setImageError,
  ] = useState(false);

  const [
    copied,
    setCopied,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | FETCH DETAIL BERITA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    const fetchBeritaDetail =
      async () => {
        if (!slug) {
          setError(
            'Slug berita tidak ditemukan.'
          );

          setLoading(
            false
          );

          return;
        }

        setLoading(
          true
        );

        setError('');

        setBerita(
          null
        );

        setImageError(
          false
        );

        try {
          const response =
            await api.get(
              `/berita/${encodeURIComponent(
                slug
              )}`
            );

          if (
            cancelled
          ) {
            return;
          }

          const responseData =
            response.data?.data;

          if (!responseData) {
            throw new Error(
              'Data berita tidak ditemukan.'
            );
          }

          setBerita(
            responseData
          );
        } catch (
          err
        ) {
          if (
            cancelled
          ) {
            return;
          }

          console.error(
            'Gagal mengambil detail berita:',
            err
          );

          setError(
            err.response?.data
              ?.message ||
              err.message ||
              'Berita tidak ditemukan.'
          );
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false
            );
          }
        }
      };

    fetchBeritaDetail();

    return () => {
      cancelled = true;
    };
  }, [
    slug,
  ]);

  /*
  |--------------------------------------------------------------------------
  | FORMAT TANGGAL
  |--------------------------------------------------------------------------
  */

  const formatDate =
    (
      value
    ) => {
      if (!value) {
        return '-';
      }

      const date =
        new Date(
          value
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return value;
      }

      return date.toLocaleDateString(
        'id-ID',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      );
    };

  /*
  |--------------------------------------------------------------------------
  | CURRENT URL
  |--------------------------------------------------------------------------
  */

  const currentUrl =
    typeof window !==
    'undefined'
      ? window.location.href
      : '';

  /*
  |--------------------------------------------------------------------------
  | COPY LINK
  |--------------------------------------------------------------------------
  */

  const copyLink =
    async (
      message = 'Link berita berhasil disalin!'
    ) => {
      if (
        !currentUrl
      ) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          currentUrl
        );

        setCopied(
          true
        );

        window.setTimeout(
          () => {
            setCopied(
              false
            );
          },
          2000
        );
      } catch (
        err
      ) {
        console.error(
          'Gagal menyalin link:',
          err
        );

        alert(
          'Link berita gagal disalin.'
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | SHARE WHATSAPP
  |--------------------------------------------------------------------------
  */

  const whatsappUrl =
    berita
      ? `https://wa.me/?text=${encodeURIComponent(
          `${berita.judul} ${currentUrl}`
        )}`
      : '#';

  /*
  |--------------------------------------------------------------------------
  | IMAGE ERROR
  |--------------------------------------------------------------------------
  */

  const handleImageError =
    () => {
      setImageError(
        true
      );
    };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (
    loading
  ) {
    return (
      <div className="bg-background text-on-surface min-h-screen pt-18">

        <Navbar />

        <main className="max-w-4xl mx-auto px-6 py-16">

          <div className="h-10 w-3/4 bg-surface-container-high rounded-lg animate-pulse mb-4" />

          <div className="h-5 w-40 bg-surface-container-high rounded animate-pulse mb-8" />

          <div className="aspect-video rounded-xl bg-surface-container-high animate-pulse mb-8" />

          <div className="space-y-3">

            <div className="h-4 w-full bg-surface-container-high rounded animate-pulse" />

            <div className="h-4 w-full bg-surface-container-high rounded animate-pulse" />

            <div className="h-4 w-5/6 bg-surface-container-high rounded animate-pulse" />

            <div className="h-4 w-4/5 bg-surface-container-high rounded animate-pulse" />

          </div>

        </main>

        <Footer />

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR / NOT FOUND
  |--------------------------------------------------------------------------
  */

  if (
    error ||
    !berita
  ) {
    return (
      <div className="bg-background text-on-surface min-h-screen pt-18 flex flex-col">

        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-20">

          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-10 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">

              <span className="material-symbols-outlined text-4xl">
                newspaper
              </span>

            </div>

            <h1 className="font-headline-md text-2xl font-bold text-on-surface mt-5">
              Berita Tidak Ditemukan
            </h1>

            <p className="text-on-surface-variant mt-2">

              {
                error ||
                'Berita yang Anda cari tidak tersedia.'
              }

            </p>

            <Link
              to="/berita"
              className="inline-flex items-center gap-2 mt-6 bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary-container transition-colors"
            >

              <span className="material-symbols-outlined">
                arrow_back
              </span>

              Kembali ke Berita

            </Link>

          </div>

        </main>

        <Footer />

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER DETAIL
  |--------------------------------------------------------------------------
  */

  return (
    <div className="bg-background text-on-surface font-body-md antialiased pt-18 min-h-screen">

      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* =========================================================
            BACK
        ========================================================== */}

        <Link
          to="/berita"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >

          <span className="material-symbols-outlined">
            arrow_back
          </span>

          Kembali ke Berita

        </Link>

        {/* =========================================================
            CATEGORY / STATUS
        ========================================================== */}

        <div className="flex items-center gap-3 mb-4">

          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">

            <span className="material-symbols-outlined text-sm">
              check_circle
            </span>

            Published

          </span>

          <span className="text-sm text-on-surface-variant">
            {formatDate(
              berita.published_at ||
              berita.created_at
            )}
          </span>

        </div>

        {/* =========================================================
            TITLE
        ========================================================== */}

        <h1 className="font-display-lg text-4xl md:text-5xl font-bold text-primary mb-4 wrap-break-word">
          {
            berita.judul
          }
        </h1>

        {/* =========================================================
            AUTHOR
        ========================================================== */}

        {berita.created_by?.name && (
          <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">

            <span className="material-symbols-outlined text-base">
              person
            </span>

            <span>
              Dibuat oleh{' '}
              <span className="font-semibold text-on-surface">
                {
                  berita.created_by.name
                }
              </span>
            </span>

          </div>
        )}

        {/* =========================================================
            THUMBNAIL
        ========================================================== */}

        {berita.thumbnail && !imageError ? (
          <div className="rounded-2xl overflow-hidden shadow-sm mb-8 bg-surface-container-high">

            <img
              src={
                berita.thumbnail
              }
              alt={
                berita.judul
              }
              className="w-full max-h-550px object-cover"
              onError={
                handleImageError
              }
            />

          </div>
        ) : (
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low h-72 flex flex-col items-center justify-center mb-8">

            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">
              broken_image
            </span>

            <p className="text-sm text-on-surface-variant mt-3">
              Thumbnail tidak tersedia.
            </p>

          </div>
        )}

        {/* =========================================================
            CONTENT
        ========================================================== */}

        <article className="prose prose-lg max-w-none text-on-surface leading-relaxed">

          <div className="whitespace-pre-line wrap-break-word">
            {
              berita.isi ||
              '-'
            }
          </div>

        </article>

        {/* =========================================================
            SHARE
        ========================================================== */}

        <div className="mt-10 pt-6 border-t border-outline-variant/20">

          <p className="font-label-md font-semibold text-on-surface mb-4">
            Bagikan berita ini
          </p>

          <div className="flex flex-wrap gap-3">

            {/* TWITTER */}

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                berita.judul
              )}&url=${encodeURIComponent(
                currentUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1DA1F2] text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
            >

              <FaTwitter className="text-lg" />

              Twitter

            </a>

            {/* FACEBOOK */}

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                currentUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1877F2] text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
            >

              <FaFacebook className="text-lg" />

              Facebook

            </a>

            {/* WHATSAPP */}

            <a
              href={
                whatsappUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >

              <FaWhatsapp className="text-lg" />

              WhatsApp

            </a>

            {/* INSTAGRAM */}

            <button
              type="button"
              onClick={() =>
                copyLink(
                  'Link Instagram'
                )
              }
              className="bg-[#E4405F] text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
            >

              <FaInstagram className="text-lg" />

              Instagram

            </button>

            {/* TIKTOK */}

            <button
              type="button"
              onClick={() =>
                copyLink(
                  'Link TikTok'
                )
              }
              className="bg-black text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
            >

              <FaTiktok className="text-lg" />

              TikTok

            </button>

            {/* COPY */}

            <button
              type="button"
              onClick={() =>
                copyLink()
              }
              className="bg-primary text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors"
            >

              <span className="material-symbols-outlined text-lg">
                link
              </span>

              {
                copied
                  ? 'Tersalin'
                  : 'Salin Link'
              }

            </button>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
};

export default BeritaDetailPage;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '/src/assets/logo.webp';
import api from '../api/axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError('Email wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        '/forgot-password',
        {
          email: normalizedEmail,
        }
      );

      setSuccess(
        response.data?.message ||
          'Jika email terdaftar, link reset password akan dikirim.'
      );
    } catch (err) {
      const responseMessage =
        err.response?.data?.message;

      const validationErrors =
        err.response?.data?.errors;

      if (validationErrors) {
        const firstError = Object.values(
          validationErrors
        )
          .flat()
          .find(Boolean);

        setError(
          firstError ||
            responseMessage ||
            'Email tidak valid.'
        );
      } else if (responseMessage) {
        setError(responseMessage);
      } else {
        setError(
          'Tidak dapat terhubung ke server. Silakan coba lagi.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-8 md:px-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
        className="
          w-full
          max-w-295
          min-h-170
          bg-surface-container-lowest
          rounded-2xl
          overflow-hidden
          shadow-xl
          border
          border-outline-variant/30
          grid
          grid-cols-1
          lg:grid-cols-[45%_55%]
        "
      >
        {/* =====================================================
            PANEL KIRI
        ====================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            x: -30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
            ease: 'easeOut',
          }}
          className="
            relative
            overflow-hidden
            bg-primary
            text-white
            px-8
            py-10
            md:px-10
            lg:px-12
            flex
            flex-col
            justify-between
            min-h-130
            lg:min-h-full
          "
        >
          {/* Dekorasi */}
          <div
            className="
              absolute
              -top-32
              -right-32
              w-80
              h-80
              rounded-full
              bg-primary-container/40
            "
          />

          <div
            className="
              absolute
              -bottom-36
              -left-28
              w-72
              h-72
              rounded-full
              border
              border-primary-fixed/20
            "
          />

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div
                className="
                  w-16
                  h-16
                  rounded-xl
                  bg-white
                  flex
                  items-center
                  justify-center
                  p-2
                  shadow-md
                  shrink-0
                "
              >
                <img
                  src={logo}
                  alt="Logo Desa Sumberporong"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight">
                  Desa Sumberporong
                </h1>

                <p className="text-primary-fixed text-sm mt-1">
                  Pemerintah Desa
                </p>
              </div>
            </div>

            {/* Badge */}
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10">
              <span className="material-symbols-outlined text-lg">
                account_balance
              </span>

              <span className="text-xs font-semibold leading-tight">
                Sistem Informasi
                <br />
                Desa
              </span>
            </div>
          </div>

          {/* Konten */}
          <div className="relative z-10 my-auto py-12 max-w-90">
            <motion.h2
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
                duration: 0.5,
              }}
              className="
                text-white
                text-4xl
                md:text-5xl
                font-bold
                leading-[1.1]
                mb-6
              "
            >
              Lupa
              <br />
              Password?
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.5,
                duration: 0.6,
              }}
              className="
                text-primary-fixed
                text-base
                md:text-lg
                leading-7
                max-w-80
              "
            >
              Jangan khawatir. Masukkan email Anda
              dan kami akan membantu mengatur ulang
              password akun Anda.
            </motion.p>
          </div>

          {/* Copyright */}
          <div className="relative z-10">
            <p className="text-primary-fixed text-xs">
              © 2026 Pemerintah Desa Sumberporong
            </p>
          </div>
        </motion.section>

        {/* =====================================================
            PANEL KANAN
        ====================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            x: 30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.1,
            ease: 'easeOut',
          }}
          className="
            bg-surface-container-lowest
            flex
            items-center
            justify-center
            px-8
            py-12
            md:px-12
            lg:px-16
            xl:px-20
          "
        >
          <div className="w-full max-w-120">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-on-background leading-tight">
                Reset Password
              </h2>

              <p className="text-on-surface-variant mt-2 text-base md:text-lg">
                Masukkan email yang terdaftar pada
                akun Anda.
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  mb-6
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                "
              >
                <div className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined shrink-0"
                    style={{
                      fontSize: '20px',
                    }}
                  >
                    error
                  </span>

                  <span>
                    {error}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Success */}
            {success && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  mb-6
                  rounded-xl
                  border
                  border-green-200
                  bg-green-50
                  px-4
                  py-3
                  text-sm
                  text-green-700
                "
              >
                <div className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined shrink-0"
                    style={{
                      fontSize: '20px',
                    }}
                  >
                    check_circle
                  </span>

                  <span>
                    {success}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="forgot-email"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-on-background
                    mb-2
                  "
                >
                  Email
                </label>

                <div className="relative">
                  <span
                    className="
                      material-symbols-outlined
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-on-surface-variant
                    "
                  >
                    mail
                  </span>

                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);

                      if (error) {
                        setError('');
                      }
                    }}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    autoFocus
                    disabled={loading}
                    required
                    className="
                      w-full
                      h-13
                      pl-12
                      pr-4
                      rounded-lg
                      bg-surface-container-low
                      border
                      border-outline-variant
                      text-on-background
                      placeholder:text-on-surface-variant/60
                      outline-none
                      transition-all
                      duration-200
                      focus:border-primary
                      focus:ring-2
                      focus:ring-primary/20
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  />
                </div>
              </div>

              {/* Tombol */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={
                  !loading
                    ? { scale: 1.01 }
                    : undefined
                }
                whileTap={
                  !loading
                    ? { scale: 0.98 }
                    : undefined
                }
                className="
                  w-full
                  h-13
                  rounded-lg
                  bg-primary
                  text-on-primary
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  shadow-sm
                  hover:bg-primary-container
                  transition-colors
                  duration-200
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                <span className="material-symbols-outlined">
                  {loading
                    ? 'progress_activity'
                    : 'mail'}
                </span>

                <span>
                  {loading
                    ? 'Mengirim...'
                    : 'Kirim Link Reset'}
                </span>
              </motion.button>
            </form>

            {/* Login */}
            <div className="text-center mt-7">
              <p className="text-base text-on-surface">
                Ingat password Anda?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Kembali ke login
                </Link>
              </p>
            </div>

            {/* Home */}
            <div className="flex justify-center mt-5">
              <Link
                to="/"
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  text-on-surface-variant
                  hover:text-primary
                  transition-colors
                "
              >
                <span className="material-symbols-outlined text-xl">
                  arrow_back
                </span>

                <span>
                  Kembali ke beranda
                </span>
              </Link>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
};

export default ForgotPasswordPage;
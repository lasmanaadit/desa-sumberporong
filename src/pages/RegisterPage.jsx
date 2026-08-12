import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "/src/assets/logo.webp";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-8 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
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
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
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
          {/* Lingkaran dekorasi atas */}
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

          {/* Lingkaran dekorasi bawah */}
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
            <div
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-white/10
                border
                border-white/10
              "
            >
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

          {/* Sambutan */}
          <div className="relative z-10 my-auto py-12 max-w-90">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="
                text-white
                text-4xl
                md:text-5xl
                font-bold
                leading-[1.1]
                mb-6
              "
            >
              Bergabung
              <br />
              Bersama
              <br />
              Kami
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="
                text-primary-fixed
                text-base
                md:text-lg
                leading-7
                max-w-80
              "
            >
              Buat akun untuk mengakses layanan administrasi dan informasi
              Desa Sumberporong secara lebih mudah.
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
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="
            bg-surface-container-lowest
            flex
            items-center
            justify-center
            px-8
            py-10
            md:px-12
            lg:px-16
            xl:px-20
          "
        >
          <div className="w-full max-w-120">
            {/* Heading */}
            <div className="mb-7">
              <h2
                className="
                  text-3xl
                  md:text-4xl
                  font-bold
                  text-on-background
                  leading-tight
                "
              >
                Buat Akun
              </h2>

              <p className="text-on-surface-variant mt-2 text-base md:text-lg">
                Daftarkan akun Anda untuk menggunakan layanan desa.
              </p>
            </div>

            {/* FORM */}
            <form className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label
                  htmlFor="name"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-on-background
                    mb-2
                  "
                >
                  Nama Lengkap
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
                    person
                  </span>

                  <input
                    id="name"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    className="
                      w-full
                      h-12
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
                    "
                  />
                </div>
              </div>

              {/* NIK */}
              <div>
                <label
                  htmlFor="nik"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-on-background
                    mb-2
                  "
                >
                  NIK
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
                    badge
                  </span>

                  <input
                    id="nik"
                    type="text"
                    inputMode="numeric"
                    maxLength="16"
                    placeholder="Masukkan NIK"
                    className="
                      w-full
                      h-12
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
                    "
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
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
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    className="
                      w-full
                      h-12
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
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-on-background
                    mb-2
                  "
                >
                  Password
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
                    lock
                  </span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    className="
                      w-full
                      h-12
                      pl-12
                      pr-12
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
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-on-surface-variant
                      hover:text-primary
                      transition-colors
                    "
                  >
                    <span className="material-symbols-outlined">
                      {showPassword
                        ? "visibility_off"
                        : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-on-background
                    mb-2
                  "
                >
                  Konfirmasi Password
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
                    lock_reset
                  </span>

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Ulangi password"
                    className="
                      w-full
                      h-12
                      pl-12
                      pr-12
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
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-on-surface-variant
                      hover:text-primary
                      transition-colors
                    "
                  >
                    <span className="material-symbols-outlined">
                      {showConfirmPassword
                        ? "visibility_off"
                        : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Tombol Daftar */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="
                  w-full
                  h-12
                  mt-2
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
                "
              >
                <span className="material-symbols-outlined">
                  person_add
                </span>

                <span>Daftar</span>
              </motion.button>
            </form>

            {/* Sudah punya akun */}
            <div className="text-center mt-6">
              <p className="text-base text-on-surface">
                Sudah memiliki akun?{" "}
                <Link
                  to="/login"
                  className="
                    font-semibold
                    text-primary
                    hover:underline
                  "
                >
                  Masuk sekarang
                </Link>
              </p>
            </div>

            {/* Kembali */}
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

                <span>Kembali ke beranda</span>
              </Link>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
};

export default RegisterPage;

import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import logo from "/src/assets/logo.webp";
import { useAuth } from "../auth/AuthContext";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const leftVariants = {
    hidden: {
      opacity: 0,
      x: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        delay: 0.1,
        ease: "easeOut",
      },
    },
  };

  const rightVariants = {
    hidden: {
      opacity: 0,
      x: 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  /*
  |--------------------------------------------------------------------------
  | Redirect Berdasarkan Role
  |--------------------------------------------------------------------------
  |
  | requestedPath hanya digunakan jika memang sesuai dengan role user.
  | Ini mencegah user diarahkan ke halaman yang bukan hak aksesnya.
  |
  */

  const getRedirectPath = (
    user,
    requestedPath = null
  ) => {
    const role = user?.role?.name;

    if (role === "superadmin") {
      if (
        requestedPath?.startsWith("/superadmin") ||
        requestedPath?.startsWith("/admin")
      ) {
        return requestedPath;
      }

      return "/superadmin";
    }

    if (role === "admin") {
      if (
        requestedPath?.startsWith("/admin")
      ) {
        return requestedPath;
      }

      return "/admin";
    }

    if (role === "user") {
      if (
        requestedPath?.startsWith("/dashboard")
      ) {
        return requestedPath;
      }

      return "/dashboard";
    }

    return "/";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Email wajib diisi.");
      return;
    }

    if (!password) {
      setError("Password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const data = await login({
        email: normalizedEmail,
        password,
      });

      /*
      |--------------------------------------------------------------------------
      | Requested Path
      |--------------------------------------------------------------------------
      |
      | Jika user sebelumnya mencoba membuka route protected,
      | React Router menyimpannya pada location.state.from.
      |
      */

      const requestedPath =
        location.state?.from?.pathname || null;

      /*
      |--------------------------------------------------------------------------
      | Tentukan Redirect
      |--------------------------------------------------------------------------
      */

      const targetPath = getRedirectPath(
        data.user,
        requestedPath
      );

      navigate(targetPath, {
        replace: true,
      });
    } catch (err) {
      const responseMessage =
        err.response?.data?.message;

      const validationErrors =
        err.response?.data?.errors;

      if (responseMessage) {
        setError(responseMessage);
      } else if (validationErrors) {
        const firstError = Object.values(
          validationErrors
        )
          .flat()
          .find(Boolean);

        setError(
          firstError ||
            "Data login tidak valid."
        );
      } else {
        setError(
          "Tidak dapat terhubung ke server. Silakan coba lagi."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-8 md:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
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
          variants={leftVariants}
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

          {/* Logo dan identitas desa */}
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

          {/* Konten sambutan */}
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
                delay: 0.4,
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
              Selamat
              <br />
              Datang
              <br />
              Kembali
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.6,
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
              Masuk untuk mengakses layanan
              administrasi dan informasi Desa
              Sumberporong dengan lebih mudah.
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
          variants={rightVariants}
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
              <h2
                className="
                  text-3xl
                  md:text-4xl
                  font-bold
                  text-on-background
                  leading-tight
                "
              >
                Masuk ke Akun
              </h2>

              <p className="text-on-surface-variant mt-2 text-base md:text-lg">
                Silakan masukkan akun Anda untuk
                melanjutkan.
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
                  rounded-lg
                  border
                  border-red-300
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
                      fontSize: "20px",
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

            {/* Form */}
            <form
              className="space-y-6"
              onSubmit={handleSubmit}
            >
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
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    placeholder="nama@email.com"
                    autoComplete="email"
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

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="
                      text-sm
                      font-semibold
                      text-on-background
                    "
                  >
                    Password
                  </label>
                </div>

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
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    disabled={loading}
                    required
                    className="
                      w-full
                      h-13
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
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    disabled={loading}
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-on-surface-variant
                      hover:text-primary
                      transition-colors
                      disabled:opacity-50
                    "
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    <span className="material-symbols-outlined">
                      {showPassword
                        ? "visibility_off"
                        : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Lupa Password */}
              <div className="flex justify-end -mt-2">
                <Link
                  to="/forgot-password"
                  className="
                    text-sm
                    font-semibold
                    text-primary
                    hover:underline
                  "
                >
                  Lupa password?
                </Link>
              </div>

              {/* Tombol Login */}
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
                    ? "progress_activity"
                    : "login"}
                </span>

                <span>
                  {loading
                    ? "Memproses..."
                    : "Masuk"}
                </span>
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-outline-variant/50" />

              <span className="text-xs text-on-surface-variant">
                atau
              </span>

              <div className="flex-1 h-px bg-outline-variant/50" />
            </div>

            {/* Register */}
            <div className="text-center">
              <p className="text-base text-on-surface">
                Belum memiliki akun?{" "}
                <Link
                  to="/register"
                  className="
                    font-semibold
                    text-primary
                    hover:underline
                  "
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>

            {/* Kembali */}
            <div className="flex justify-center mt-7">
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

export default LoginPage;

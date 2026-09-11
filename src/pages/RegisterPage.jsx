
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '/src/assets/logo.webp';
import { useAuth } from '../auth/AuthContext';

const initialForm = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState(initialForm);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [fieldTouched, setFieldTouched] = useState({
    password: false,
    password_confirmation: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    if (
      name === 'password' ||
      name === 'password_confirmation'
    ) {
      setFieldTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    }
  };

  const passwordStrength = useMemo(() => {
    const password = form.password;

    if (!password) {
      return {
        level: 0,
        label: '',
        width: '0%',
        className: '',
      };
    }

    let score = 0;

    if (password.length >= 8) {
      score += 1;
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    }

    if (/\d/.test(password)) {
      score += 1;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    }

    if (score <= 2) {
      return {
        level: 1,
        label: 'Lemah',
        width: '33%',
        className: 'bg-red-500',
      };
    }

    if (score <= 4) {
      return {
        level: 2,
        label: 'Sedang',
        width: '66%',
        className: 'bg-amber-500',
      };
    }

    return {
      level: 3,
      label: 'Kuat',
      width: '100%',
      className: 'bg-green-500',
    };
  }, [form.password]);

  const passwordRequirements = useMemo(() => {
    const password = form.password;

    return [
      {
        label: 'Minimal 8 karakter',
        valid: password.length >= 8,
      },
      {
        label: 'Huruf kecil',
        valid: /[a-z]/.test(password),
      },
      {
        label: 'Huruf besar',
        valid: /[A-Z]/.test(password),
      },
      {
        label: 'Angka',
        valid: /\d/.test(password),
      },
    ];
  }, [form.password]);

  const passwordMatch =
    form.password_confirmation !== '' &&
    form.password === form.password_confirmation;

  const passwordMismatch =
    fieldTouched.password_confirmation &&
    form.password_confirmation !== '' &&
    form.password !== form.password_confirmation;

  const isFormReady =
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.password !== '' &&
    form.password_confirmation !== '' &&
    passwordMatch;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      setError('Nama lengkap wajib diisi.');
      return;
    }

    if (!email) {
      setError('Email wajib diisi.');
      return;
    }

    if (!form.password) {
      setError('Password wajib diisi.');
      setFieldTouched((prev) => ({
        ...prev,
        password: true,
      }));
      return;
    }

    if (form.password.length < 8) {
      setError(
        'Password harus memiliki minimal 8 karakter.'
      );
      setFieldTouched((prev) => ({
        ...prev,
        password: true,
      }));
      return;
    }

    if (!form.password_confirmation) {
      setError(
        'Konfirmasi password wajib diisi.'
      );
      setFieldTouched((prev) => ({
        ...prev,
        password_confirmation: true,
      }));
      return;
    }

    if (form.password !== form.password_confirmation) {
      setError(
        'Password dan konfirmasi password tidak sama.'
      );
      setFieldTouched((prev) => ({
        ...prev,
        password_confirmation: true,
      }));
      return;
    }

    setLoading(true);

    try {
      await register({
        name,
        email,
        password: form.password,
        password_confirmation:
          form.password_confirmation,
      });

      navigate('/dashboard', {
        replace: true,
      });
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
            'Data registrasi tidak valid.'
        );
      } else if (responseMessage) {
        setError(responseMessage);
      } else {
        setError(
          'Registrasi gagal. Silakan coba lagi.'
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
              Bergabung
              <br />
              Bersama
              <br />
              Kami
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
              Buat akun untuk mengakses layanan
              administrasi dan informasi Desa
              Sumberporong secara lebih mudah.
            </motion.p>
          </div>

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
                Daftarkan akun Anda untuk
                menggunakan layanan desa.
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
                  mb-5
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

                  <p>{error}</p>
                </div>
              </motion.div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Nama */}
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
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    autoComplete="name"
                    disabled={loading}
                    required
                    autoFocus
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
                      disabled:opacity-60
                      disabled:cursor-not-allowed
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
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    disabled={loading}
                    required
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
                      disabled:opacity-60
                      disabled:cursor-not-allowed
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
                    name="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Masukkan password"
                    autoComplete="new-password"
                    disabled={loading}
                    required
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
                        ? 'Sembunyikan password'
                        : 'Tampilkan password'
                    }
                  >
                    <span className="material-symbols-outlined">
                      {showPassword
                        ? 'visibility_off'
                        : 'visibility'}
                    </span>
                  </button>
                </div>

                {form.password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-on-surface-variant">
                        Kekuatan password
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          passwordStrength.level === 1
                            ? 'text-red-600'
                            : passwordStrength.level === 2
                              ? 'text-amber-600'
                              : 'text-green-600'
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width:
                            passwordStrength.width,
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                        className={`h-full rounded-full ${passwordStrength.className}`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                      {passwordRequirements.map(
                        (requirement) => (
                          <div
                            key={requirement.label}
                            className="flex items-center gap-1.5"
                          >
                            <span
                              className={`material-symbols-outlined ${
                                requirement.valid
                                  ? 'text-green-600'
                                  : 'text-on-surface-variant/50'
                              }`}
                              style={{
                                fontSize: '16px',
                              }}
                            >
                              {requirement.valid
                                ? 'check_circle'
                                : 'radio_button_unchecked'}
                            </span>

                            <span
                              className={`text-xs ${
                                requirement.valid
                                  ? 'text-green-700'
                                  : 'text-on-surface-variant'
                              }`}
                            >
                              {requirement.label}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {fieldTouched.password &&
                  form.password &&
                  form.password.length < 8 && (
                    <p className="text-xs text-red-600 mt-2">
                      Password minimal 8 karakter.
                    </p>
                  )}
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label
                  htmlFor="password_confirmation"
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
                    id="password_confirmation"
                    name="password_confirmation"
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    value={
                      form.password_confirmation
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ulangi password"
                    autoComplete="new-password"
                    disabled={loading}
                    required
                    className={`
                      w-full
                      h-12
                      pl-12
                      pr-12
                      rounded-lg
                      bg-surface-container-low
                      border
                      text-on-background
                      placeholder:text-on-surface-variant/60
                      outline-none
                      transition-all
                      duration-200
                      focus:ring-2
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      ${
                        passwordMismatch
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                          : passwordMatch
                            ? 'border-green-400 focus:border-green-500 focus:ring-green-500/20'
                            : 'border-outline-variant focus:border-primary focus:ring-primary/20'
                      }
                    `}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
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
                      showConfirmPassword
                        ? 'Sembunyikan konfirmasi password'
                        : 'Tampilkan konfirmasi password'
                    }
                  >
                    <span className="material-symbols-outlined">
                      {showConfirmPassword
                        ? 'visibility_off'
                        : 'visibility'}
                    </span>
                  </button>
                </div>

                {passwordMismatch && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600">
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '16px',
                      }}
                    >
                      error
                    </span>

                    <span>
                      Password belum sama.
                    </span>
                  </div>
                )}

                {passwordMatch && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-green-600">
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '16px',
                      }}
                    >
                      check_circle
                    </span>

                    <span>
                      Password sudah cocok.
                    </span>
                  </div>
                )}
              </div>

              {/* Tombol Daftar */}
              <motion.button
                type="submit"
                whileHover={
                  loading || !isFormReady
                    ? undefined
                    : { scale: 1.01 }
                }
                whileTap={
                  loading || !isFormReady
                    ? undefined
                    : { scale: 0.98 }
                }
                disabled={loading}
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
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                <span className="material-symbols-outlined">
                  {loading
                    ? 'progress_activity'
                    : 'person_add'}
                </span>

                <span>
                  {loading
                    ? 'Mendaftarkan...'
                    : 'Daftar'}
                </span>
              </motion.button>
            </form>

            {/* Sudah punya akun */}
            <div className="text-center mt-6">
              <p className="text-base text-on-surface">
                Sudah memiliki akun?{' '}
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

export default RegisterPage;

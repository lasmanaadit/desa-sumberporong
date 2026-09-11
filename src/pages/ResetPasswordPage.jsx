import React, { useMemo, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '/src/assets/logo.webp';
import api from '../api/axios';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [searchParams] = useSearchParams();

  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] =
    useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [
    showPasswordConfirmation,
    setShowPasswordConfirmation,
  ] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const passwordRequirements = useMemo(() => {
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
  }, [password]);

  const passwordStrength = useMemo(() => {
    const score =
      passwordRequirements.filter(
        (requirement) => requirement.valid
      ).length;

    if (!password) {
      return {
        label: '',
        width: '0%',
        barClass: '',
        textClass: '',
      };
    }

    if (score <= 1) {
      return {
        label: 'Lemah',
        width: '25%',
        barClass: 'bg-red-500',
        textClass: 'text-red-600',
      };
    }

    if (score === 2) {
      return {
        label: 'Kurang kuat',
        width: '50%',
        barClass: 'bg-orange-500',
        textClass: 'text-orange-600',
      };
    }

    if (score === 3) {
      return {
        label: 'Sedang',
        width: '75%',
        barClass: 'bg-amber-500',
        textClass: 'text-amber-600',
      };
    }

    return {
      label: 'Kuat',
      width: '100%',
      barClass: 'bg-green-500',
      textClass: 'text-green-600',
    };
  }, [password, passwordRequirements]);

  const passwordMatch =
    passwordConfirmation !== '' &&
    password === passwordConfirmation;

  const passwordMismatch =
    passwordConfirmation !== '' &&
    password !== passwordConfirmation;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!token) {
      setError(
        'Token reset password tidak ditemukan atau tidak valid.'
      );
      return;
    }

    if (!email) {
      setError(
        'Email reset password tidak ditemukan.'
      );
      return;
    }

    if (!password) {
      setError('Password baru wajib diisi.');
      return;
    }

    if (password.length < 8) {
      setError(
        'Password baru harus memiliki minimal 8 karakter.'
      );
      return;
    }

    if (!passwordConfirmation) {
      setError(
        'Konfirmasi password wajib diisi.'
      );
      return;
    }

    if (password !== passwordConfirmation) {
      setError(
        'Password dan konfirmasi password tidak sama.'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        '/reset-password',
        {
          token,
          email,
          password,
          password_confirmation:
            passwordConfirmation,
        }
      );

      setSuccess(
        response.data?.message ||
          'Password berhasil diubah.'
      );

      setPassword('');
      setPasswordConfirmation('');

      window.setTimeout(() => {
        navigate('/login', {
          replace: true,
        });
      }, 1500);
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
            'Data reset password tidak valid.'
        );
      } else if (responseMessage) {
        setError(responseMessage);
      } else {
        setError(
          'Password gagal diubah. Link reset mungkin sudah kedaluwarsa atau tidak valid.'
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
              Buat
              <br />
              Password
              <br />
              Baru
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
              Gunakan password baru yang kuat
              untuk menjaga keamanan akun Anda.
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
                Password Baru
              </h2>

              <p className="text-on-surface-variant mt-2 text-base md:text-lg break-all">
                {email
                  ? `Akun: ${email}`
                  : 'Masukkan password baru untuk akun Anda.'}
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
              {/* Password */}
              <div>
                <label
                  htmlFor="reset-password"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-on-background
                    mb-2
                  "
                >
                  Password Baru
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
                    id="reset-password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value
                      );

                      if (error) {
                        setError('');
                      }
                    }}
                    placeholder="Masukkan password baru"
                    autoComplete="new-password"
                    autoFocus
                    disabled={
                      loading || Boolean(success)
                    }
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
                    disabled={
                      loading || Boolean(success)
                    }
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

                {/* Password strength */}
                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-on-surface-variant">
                        Kekuatan password
                      </span>

                      <span
                        className={`text-xs font-semibold ${passwordStrength.textClass}`}
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
                        className={`h-full rounded-full ${passwordStrength.barClass}`}
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
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label
                  htmlFor="reset-password-confirmation"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-on-background
                    mb-2
                  "
                >
                  Konfirmasi Password Baru
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
                    id="reset-password-confirmation"
                    type={
                      showPasswordConfirmation
                        ? 'text'
                        : 'password'
                    }
                    value={
                      passwordConfirmation
                    }
                    onChange={(event) => {
                      setPasswordConfirmation(
                        event.target.value
                      );

                      if (error) {
                        setError('');
                      }
                    }}
                    placeholder="Ulangi password baru"
                    autoComplete="new-password"
                    disabled={
                      loading || Boolean(success)
                    }
                    required
                    className={`
                      w-full
                      h-13
                      pl-12
                      pr-12
                      rounded-lg
                      bg-surface-container-low
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
                      setShowPasswordConfirmation(
                        (prev) => !prev
                      )
                    }
                    disabled={
                      loading || Boolean(success)
                    }
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
                      showPasswordConfirmation
                        ? 'Sembunyikan konfirmasi password'
                        : 'Tampilkan konfirmasi password'
                    }
                  >
                    <span className="material-symbols-outlined">
                      {showPasswordConfirmation
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

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={
                  loading || Boolean(success)
                }
                whileHover={
                  !loading && !success
                    ? { scale: 1.01 }
                    : undefined
                }
                whileTap={
                  !loading && !success
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
                    : 'lock_reset'}
                </span>

                <span>
                  {loading
                    ? 'Menyimpan...'
                    : 'Ubah Password'}
                </span>
              </motion.button>
            </form>

            {/* Kembali */}
            <div className="flex justify-center mt-7">
              <Link
                to="/login"
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
                  Kembali ke login
                </span>
              </Link>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
};

export default ResetPasswordPage;
// src/components/EditProfileForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

const EditProfileForm = ({ dashboardPath }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /*
  |--------------------------------------------------------------------------
  | State Visibility Password
  |--------------------------------------------------------------------------
  |
  | Masing-masing password memiliki state sendiri sehingga user dapat
  | menampilkan atau menyembunyikan password secara individual.
  |
  */

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Ambil Data User
  |--------------------------------------------------------------------------
  |
  | LocalStorage digunakan sebagai data awal agar form dapat langsung
  | terisi tanpa harus menunggu response API.
  |
  | Setelah itu data terbaru diambil dari backend melalui:
  |
  | GET /api/user
  |
  */

  useEffect(() => {
    const stored = localStorage.getItem('user');

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        setUser(parsed);

        setForm((prev) => ({
          ...prev,
          name: parsed.name || '',
          email: parsed.email || '',
        }));
      } catch {
        setUser(null);
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Ambil User Terbaru dari Backend
    |--------------------------------------------------------------------------
    */

    api.get('/user')
      .then((response) => {
        const data =
          response.data?.data ||
          response.data?.user ||
          null;

        if (data) {
          setUser(data);

          setForm((prev) => ({
            ...prev,
            name: data.name || '',
            email: data.email || '',
          }));

          /*
          |--------------------------------------------------------------------------
          | Sinkronkan LocalStorage
          |--------------------------------------------------------------------------
          */

          localStorage.setItem(
            'user',
            JSON.stringify(data)
          );
        }
      })
      .catch(() => {
        /*
        |--------------------------------------------------------------------------
        | Jangan Ganggu Tampilan Jika API Gagal
        |--------------------------------------------------------------------------
        |
        | Jika data localStorage tersedia, form tetap dapat digunakan.
        |
        */
      });
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Handle Perubahan Input
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
    setSuccess('');
  };

  /*
  |--------------------------------------------------------------------------
  | Validasi Form
  |--------------------------------------------------------------------------
  */

  const validate = () => {
    /*
    |--------------------------------------------------------------------------
    | Validasi Nama
    |--------------------------------------------------------------------------
    */

    if (!form.name.trim()) {
      return 'Nama tidak boleh kosong.';
    }

    /*
    |--------------------------------------------------------------------------
    | Validasi Email
    |--------------------------------------------------------------------------
    */

    if (!form.email.trim()) {
      return 'Email tidak boleh kosong.';
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      return 'Email tidak valid.';
    }

    /*
    |--------------------------------------------------------------------------
    | Validasi Password
    |--------------------------------------------------------------------------
    |
    | Password hanya divalidasi apabila user ingin menggantinya.
    |
    */

    if (
      form.new_password &&
      form.new_password.length < 6
    ) {
      return 'Password baru minimal 6 karakter.';
    }

    if (
      form.new_password !==
      form.confirm_password
    ) {
      return 'Konfirmasi password tidak cocok.';
    }

    /*
    |--------------------------------------------------------------------------
    | Password Saat Ini
    |--------------------------------------------------------------------------
    |
    | Jika password baru diisi, password saat ini juga wajib diisi.
    |
    */

    if (
      form.new_password &&
      !form.current_password
    ) {
      return 'Password saat ini wajib diisi.';
    }

    return null;
  };

  /*
  |--------------------------------------------------------------------------
  | Submit Form
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
    |--------------------------------------------------------------------------
    | Validasi Frontend
    |--------------------------------------------------------------------------
    */

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    setLoading(true);
    setError('');
    setSuccess('');

    /*
    |--------------------------------------------------------------------------
    | Payload
    |--------------------------------------------------------------------------
    |
    | Data profil selalu dikirim.
    |
    | Data password hanya dikirim apabila user mengisi
    | password baru.
    |
    */

    const payload = {
      name: form.name,
      email: form.email,
    };

    if (form.new_password) {
      payload.current_password =
        form.current_password;

      payload.new_password =
        form.new_password;

      payload.new_password_confirmation =
        form.confirm_password;
    }

    try {
      /*
      |--------------------------------------------------------------------------
      | Update Profile
      |--------------------------------------------------------------------------
      |
      | Backend:
      |
      | PATCH /api/profile
      |
      */

      const response = await api.patch(
        '/profile',
        payload
      );

      /*
      |--------------------------------------------------------------------------
      | Ambil User Terbaru dari Response
      |--------------------------------------------------------------------------
      */

      const updated =
        response.data?.data ||
        response.data?.user ||
        null;

      if (updated) {
        /*
        |--------------------------------------------------------------------------
        | Update State
        |--------------------------------------------------------------------------
        */

        setUser(updated);

        /*
        |--------------------------------------------------------------------------
        | Update LocalStorage
        |--------------------------------------------------------------------------
        |
        | Agar nama/email terbaru langsung digunakan oleh
        | komponen lain yang membaca data user dari localStorage.
        |
        */

        localStorage.setItem(
          'user',
          JSON.stringify(updated)
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Pesan Berhasil
      |--------------------------------------------------------------------------
      */

      setSuccess(
        response.data?.message ||
          'Profil berhasil diperbarui.'
      );

      /*
      |--------------------------------------------------------------------------
      | Kosongkan Field Password
      |--------------------------------------------------------------------------
      |
      | Untuk keamanan, field password tidak dipertahankan
      | setelah proses berhasil.
      |
      */

      setForm((prev) => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: '',
      }));

      /*
      |--------------------------------------------------------------------------
      | Reset Visibility Password
      |--------------------------------------------------------------------------
      */

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      /*
      |--------------------------------------------------------------------------
      | Error Response
      |--------------------------------------------------------------------------
      */

      const validationErrors =
        err.response?.data?.errors;

      /*
      |--------------------------------------------------------------------------
      | Ambil Error Validasi Laravel
      |--------------------------------------------------------------------------
      |
      | Laravel biasanya mengembalikan:
      |
      | errors: {
      |   email: [...],
      |   name: [...]
      | }
      |
      | Kita tampilkan pesan pertama jika tersedia.
      |
      */

      if (validationErrors) {
        const firstError = Object.values(
          validationErrors
        )
          .flat()
          .find(Boolean);

        if (firstError) {
          setError(firstError);
        } else {
          setError(
            err.response?.data?.message ||
              'Gagal memperbarui profil.'
          );
        }
      } else {
        setError(
          err.response?.data?.message ||
            'Gagal memperbarui profil.'
        );
      }
    } finally {
      /*
      |--------------------------------------------------------------------------
      | Selesai Loading
      |--------------------------------------------------------------------------
      */

      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="w-full">
      {/*
      |--------------------------------------------------------------------------
      | Header
      |--------------------------------------------------------------------------
      */}

      <motion.section
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="mb-8"
      >
        <h1 className="font-headline-lg text-on-background">
          Edit Profil
        </h1>

        <p className="font-body-md text-on-surface-variant mt-2">
          Perbarui informasi akun Anda.
        </p>
      </motion.section>

      {/*
      |--------------------------------------------------------------------------
      | Error Message
      |--------------------------------------------------------------------------
      */}

      {error && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </motion.div>
      )}

      {/*
      |--------------------------------------------------------------------------
      | Success Message
      |--------------------------------------------------------------------------
      */}

      {success && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {success}
        </motion.div>
      )}

      {/*
      |--------------------------------------------------------------------------
      | Form
      |--------------------------------------------------------------------------
      */}

      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 sm:p-8 space-y-6"
      >
        {/*
        |--------------------------------------------------------------------------
        | Nama
        |--------------------------------------------------------------------------
        */}

        <div>
          <label className="block font-label-md font-semibold mb-2">
            Nama / Username
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            disabled={loading}
          />
        </div>

        {/*
        |--------------------------------------------------------------------------
        | Email
        |--------------------------------------------------------------------------
        */}

        <div>
          <label className="block font-label-md font-semibold mb-2">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            disabled={loading}
          />
        </div>

        {/*
        |--------------------------------------------------------------------------
        | Ganti Password
        |--------------------------------------------------------------------------
        */}

        <div className="border-t border-outline-variant/20 pt-6">
          <h3 className="font-headline-md text-lg text-on-surface mb-4">
            Ganti Password
          </h3>

          <p className="font-body-md text-on-surface-variant mb-4">
            Kosongkan jika tidak ingin mengubah password.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/*
            |--------------------------------------------------------------------------
            | Password Saat Ini
            |--------------------------------------------------------------------------
            */}

            <div>
              <label className="block font-label-md font-semibold mb-2">
                Password Saat Ini
              </label>

              <div className="relative">
                <input
                  type={
                    showCurrentPassword
                      ? 'text'
                      : 'password'
                  }
                  name="current_password"
                  value={form.current_password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  disabled={loading}
                  placeholder="Masukkan password lama"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showCurrentPassword
                      ? 'Sembunyikan password saat ini'
                      : 'Tampilkan password saat ini'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">
                    {showCurrentPassword
                      ? 'visibility_off'
                      : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/*
            |--------------------------------------------------------------------------
            | Password Baru
            |--------------------------------------------------------------------------
            */}

            <div>
              <label className="block font-label-md font-semibold mb-2">
                Password Baru
              </label>

              <div className="relative">
                <input
                  type={
                    showNewPassword
                      ? 'text'
                      : 'password'
                  }
                  name="new_password"
                  value={form.new_password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  disabled={loading}
                  placeholder="Minimal 6 karakter"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showNewPassword
                      ? 'Sembunyikan password baru'
                      : 'Tampilkan password baru'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">
                    {showNewPassword
                      ? 'visibility_off'
                      : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/*
            |--------------------------------------------------------------------------
            | Konfirmasi Password Baru
            |--------------------------------------------------------------------------
            */}

            <div className="sm:col-span-2">
              <label className="block font-label-md font-semibold mb-2">
                Konfirmasi Password Baru
              </label>

              <div className="relative">
                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  disabled={loading}
                  placeholder="Ulangi password baru"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showConfirmPassword
                      ? 'Sembunyikan konfirmasi password'
                      : 'Tampilkan konfirmasi password'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword
                      ? 'visibility_off'
                      : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/*
        |--------------------------------------------------------------------------
        | Action Button
        |--------------------------------------------------------------------------
        */}

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-outline-variant/20">
          {/*
          |--------------------------------------------------------------------------
          | Simpan
          |--------------------------------------------------------------------------
          */}

          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">
                  progress_activity
                </span>

                Menyimpan...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">
                  save
                </span>

                Simpan Perubahan
              </>
            )}
          </button>

          {/*
          |--------------------------------------------------------------------------
          | Batal
          |--------------------------------------------------------------------------
          */}

          <button
            type="button"
            onClick={() => navigate(dashboardPath)}
            className="flex-1 px-5 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
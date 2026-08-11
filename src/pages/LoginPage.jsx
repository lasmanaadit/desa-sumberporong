// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulasi login
    setTimeout(() => {
      if (email === 'admin@desa.id' && password === 'password') {
        setIsLoading(false);
        navigate('/');
      } else {
        setError('Email atau password salah. Silakan coba lagi.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <NavLink to="/" className="flex items-center justify-center gap-sm">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '40px' }}>
            account_balance
          </span>
          <span className="font-headline-lg text-headline-lg font-bold text-primary">
            Desa Sumberporong
          </span>
        </NavLink>
        <h2 className="mt-6 text-center font-headline-lg text-headline-lg text-on-surface">
          Masuk ke Akun Anda
        </h2>
        <p className="mt-2 text-center font-body-md text-body-md text-on-surface-variant">
          Atau{' '}
          <NavLink to="/register" className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors">
            buat akun baru
          </NavLink>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-surface-container-lowest py-8 px-4 shadow-sm rounded-xl border border-outline-variant/20 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-error-container text-on-error-container p-3 rounded-lg font-body-md text-body-md flex items-center gap-sm"
              >
                <span className="material-symbols-outlined text-[20px]">error</span>
                {error}
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-label-md text-label-md text-on-surface mb-xs">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">email</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-outline-variant/50 rounded-lg shadow-sm placeholder:text-outline/50 focus:border-primary focus:ring focus:ring-primary/20 focus:outline-none bg-surface font-body-md text-body-md text-on-surface transition-all"
                  placeholder="admin@desa.id"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-xs">
                <label htmlFor="password" className="block font-label-md text-label-md text-on-surface">
                  Password
                </label>
                <NavLink to="/lupa-password" className="font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors">
                  Lupa password?
                </NavLink>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-outline-variant/50 rounded-lg shadow-sm placeholder:text-outline/50 focus:border-primary focus:ring focus:ring-primary/20 focus:outline-none bg-surface font-body-md text-body-md text-on-surface transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-outline-variant/50 text-primary focus:ring-primary/20 focus:ring-offset-0 transition-colors cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block font-body-md text-body-md text-on-surface-variant cursor-pointer">
                  Ingat saya
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`w-full flex justify-center items-center gap-sm py-2.5 px-4 rounded-lg font-label-md text-label-md text-on-primary transition-all ${
                  isLoading 
                    ? 'bg-primary/70 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary-container hover:shadow-lg active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface-container-lowest text-on-surface-variant font-body-md text-body-md">
                  Atau lanjutkan dengan
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-sm px-4 py-2 border border-outline-variant/50 rounded-lg shadow-sm bg-surface hover:bg-surface-container transition-colors font-label-md text-label-md text-on-surface"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-sm px-4 py-2 border border-outline-variant/50 rounded-lg shadow-sm bg-surface hover:bg-surface-container transition-colors font-label-md text-label-md text-on-surface"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22,12c0-5.523-4.477-10-10-10S2,6.477,2,12c0,4.991,3.657,9.128,8.438,9.879V14.89h-2.54V12h2.54V9.797c0-2.506,1.492-3.89,3.777-3.89c1.094,0,2.238,0.195,2.238,0.195v2.46h-1.26c-1.243,0-1.63,0.771-1.63,1.562V12h2.773l-0.443,2.89h-2.33v6.989C18.343,21.129,22,16.99,22,12z"/>
                </svg>
                Facebook
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="font-body-md text-body-md text-on-surface-variant/60">
          © 2024 Desa Sumberporong. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
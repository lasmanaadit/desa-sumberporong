// src/pages/dashboard/UmkmSayaPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';
import dummyUmkmList from '../../data/umkmDummy';

const UmkmSayaPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [umkmList, setUmkmList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil UMKM milik user dengan userId = 1 (contoh)
    // Di sini kita filter dari dummy
    const userUmkm = dummyUmkmList.filter(item => item.userId === 1);

    setTimeout(() => {
      setUmkmList(userUmkm);
      setLoading(false);
    }, 300);
  }, []);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus UMKM ini?')) {
      setUmkmList(prev => prev.filter(item => item.id !== id));
      alert('UMKM berhasil dihapus!');
    }
  };

  const toggleStatus = (id) => {
    setUmkmList(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newStatus =
            item.status === 'active' ? 'inactive' : 'active';

          alert(
            `UMKM ${
              newStatus === 'active'
                ? 'diaktifkan'
                : 'dinonaktifkan'
            }`
          );

          return {
            ...item,
            status: newStatus,
          };
        }

        return item;
      })
    );
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <div className="lg:ml-72 min-h-screen flex-1 flex flex-col">
          <Topbar setIsOpen={setIsSidebarOpen} />

          <main className="flex-1 flex items-center justify-center p-6 lg:p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>

              <p className="mt-4 font-body-md text-on-surface-variant">
                Memuat data...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================
  return (
    <div className="min-h-screen bg-background">

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* CONTENT */}
      <div className="lg:ml-72 min-h-screen">

        {/* TOPBAR */}
        <Topbar setIsOpen={setIsSidebarOpen} />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-headline-lg text-primary">
                  UMKM Saya
                </h1>

                <p className="font-body-md text-on-surface-variant mt-2">
                  Kelola UMKM yang Anda miliki.
                </p>
              </div>

              <Link
                to="/dashboard/umkm/tambah"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-label-md hover:bg-primary-container transition-colors"
              >
                <span className="material-symbols-outlined">
                  add
                </span>

                Ajukan UMKM
              </Link>
            </div>

            {/* EMPTY STATE / LIST */}
            {umkmList.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">
                  storefront
                </span>

                <p className="font-body-lg text-on-surface-variant mt-4">
                  Anda belum memiliki UMKM.
                </p>

                <Link
                  to="/dashboard/umkm/tambah"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-3 rounded-xl bg-primary text-white font-label-md hover:bg-primary-container transition-colors"
                >
                  <span className="material-symbols-outlined">
                    add
                  </span>

                  Ajukan UMKM
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {umkmList.map((umkm) => (
                  <div
                    key={umkm.id}
                    className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                  >

                    {/* FOTO */}
                    <div className="relative h-48">
                      <img
                        src={umkm.foto_utama}
                        alt={umkm.nama}
                        className="w-full h-full object-cover"
                      />

                      <span
                        className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          umkm.status === 'active'
                            ? 'bg-primary text-white'
                            : 'bg-error text-white'
                        }`}
                      >
                        {umkm.status === 'active'
                          ? 'Aktif'
                          : 'Nonaktif'}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 flex flex-col flex-1">

                      <p className="font-label-sm text-primary tracking-normal">
                        {umkm.kategori}
                      </p>

                      <h2 className="font-headline-md text-lg text-on-surface mt-1 line-clamp-1">
                        {umkm.nama}
                      </h2>

                      <p className="text-sm text-on-surface-variant line-clamp-2 mt-1 flex-1">
                        {umkm.deskripsi}
                      </p>

                      <p className="text-lg font-bold text-primary mt-3">
                        {formatRupiah(umkm.harga_min)} -{' '}
                        {formatRupiah(umkm.harga_max)}
                      </p>

                      {/* ACTION BUTTON */}
                      <div className="flex flex-wrap gap-2 mt-4">

                        {/* DETAIL */}
                        <Link
                          to={`/dashboard/umkm/detail/${umkm.id}`}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container transition-colors text-sm"
                        >
                          <span className="material-symbols-outlined text-lg">
                            visibility
                          </span>

                          Detail
                        </Link>

                        {/* TOGGLE STATUS */}
                        <button
                          onClick={() => toggleStatus(umkm.id)}
                          className={`flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                            umkm.status === 'active'
                              ? 'border-tertiary/30 text-tertiary hover:bg-tertiary/10'
                              : 'border-primary/30 text-primary hover:bg-primary/10'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {umkm.status === 'active'
                              ? 'pause'
                              : 'play_arrow'}
                          </span>

                          {umkm.status === 'active'
                            ? 'Nonaktifkan'
                            : 'Aktifkan'}
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(umkm.id)}
                          className="flex items-center justify-center w-11 h-11 rounded-xl border border-error/30 text-error hover:bg-error-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </button>

                      </div>
                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default UmkmSayaPage;
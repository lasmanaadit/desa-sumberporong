// src/pages/dashboard/DetailUmkmPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';
import { dummyProduk } from '../../data/umkmDummy';
import { FaWhatsapp } from 'react-icons/fa';

const DetailUmkmPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = dummyProduk.find(p => p.id === parseInt(id));
    setTimeout(() => {
      if (found) {
        setProduk(found);
      } else {
        navigate('/dashboard/umkm');
      }
      setLoading(false);
    }, 500);
  }, [id, navigate]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const formatTanggal = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const statusColor = {
    'Disetujui': 'bg-primary text-white',
    'Menunggu Verifikasi': 'bg-tertiary text-white',
    'Ditolak': 'bg-error text-white',
  };

  const handleDelete = () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${produk?.nama}"?`)) {
      alert('Produk berhasil dihapus!');
      navigate('/dashboard/umkm');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="lg:ml-72 min-h-screen flex-1 flex flex-col">
          <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 flex items-center justify-center p-6 lg:p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 font-body-md text-on-surface-variant">Memuat data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!produk) return null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="lg:ml-72 min-h-screen">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <Link to="/dashboard/umkm" className="inline-flex items-center gap-2 text-primary hover:text-primary-container transition-colors mb-6">
              <span className="material-symbols-outlined">arrow_back</span>
              Kembali ke UMKM Saya
            </Link>

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
              <div className="relative h-72 md:h-96 bg-surface-container-high">
                <img src={produk.gambar} alt={produk.nama} className="w-full h-full object-cover" />
                <span className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold ${statusColor[produk.status] || 'bg-gray-500 text-white'}`}>
                  {produk.status}
                </span>
              </div>

              <div className="p-6 md:p-8">
                <p className="font-label-sm text-primary tracking-normal">{produk.kategori}</p>
                <h1 className="font-headline-lg text-on-surface mt-2">{produk.nama}</h1>
                <div className="flex items-baseline gap-4 mt-4">
                  <p className="text-3xl font-bold text-primary">{formatRupiah(produk.harga)}</p>
                  {produk.berat && <p className="font-body-md text-on-surface-variant">/ {produk.berat}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-4 bg-surface-container-low rounded-xl">
                  <div>
                    <p className="font-label-sm text-on-surface-variant">
                      Tanggal Upload
                    </p>
                    <p className="font-headline-md text-on-surface">
                      {formatTanggal(produk.tanggalUpload)}
                    </p>
                  </div>

                  {produk.updatedAt && (
                    <div>
                      <p className="font-label-sm text-on-surface-variant">
                        Terakhir Diperbarui
                      </p>
                      <p className="font-headline-md text-on-surface">
                        {formatTanggal(produk.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-6"><h3 className="font-headline-md text-on-surface text-lg">Deskripsi</h3><p className="font-body-md text-on-surface-variant mt-2 leading-relaxed">{produk.deskripsi}</p></div>

                {(produk.whatsapp || produk.ecommerce) && (
                  <div className="mt-6">
                    <h3 className="font-headline-md text-on-surface text-lg">Kontak & Link</h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {produk.ecommerce && <a href={produk.ecommerce} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"><span className="material-symbols-outlined text-base">shopping_bag</span>E-Commerce</a>}
                      {produk.whatsapp && <a href={`https://wa.me/${produk.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600 transition-colors"><FaWhatsapp className="text-lg" />
                    WhatsApp</a>}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-outline-variant/20">
                  <Link to={`/dashboard/umkm/edit/${produk.id}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-label-md hover:bg-primary-container transition-colors">
                    <span className="material-symbols-outlined">edit</span>Edit Produk
                  </Link>
                  <button onClick={handleDelete} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-error/30 text-error hover:bg-error-container transition-colors">
                    <span className="material-symbols-outlined">delete</span>Hapus Produk
                  </button>
                  <Link to={`/umkm/${produk.id}`} target="_blank" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-colors ml-auto">
                    <span className="material-symbols-outlined">open_in_new</span>Lihat di Publik
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailUmkmPage;
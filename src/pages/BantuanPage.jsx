// src/pages/BantuanPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const bantuanData = [
  {
    id: 1,
    title: 'Cara Mengurus KTP Online',
    icon: 'badge',
    image: '/src/assets/bantuan/ktp-online.png',
    steps: [
      'Login ke akun Anda, atau daftar terlebih dahulu jika belum punya akun.',
      'Masuk ke menu Pengajuan Administrasi di sidebar dashboard.',
      'Pilih Pengajuan KTP.',
      'Pilih jenis permohonan: Baru, Perpanjangan, atau Hilang.',
      'Lengkapi data pemohon: nama, NIK, KK, tempat & tanggal lahir, jenis kelamin, alamat, RT/RW, kode pos.',
      'Upload dokumen persyaratan sesuai jenis permohonan.',
      'Klik "Kirim Pengajuan" dan tunggu verifikasi petugas desa.',
    ],
  },
  {
    id: 2,
    title: 'Cara Mengurus SKU Online',
    icon: 'storefront',
    image: '/src/assets/bantuan/sku-online.png',
    steps: [
      'Login ke akun Anda.',
      'Masuk ke menu Pengajuan Administrasi.',
      'Pilih Surat Keterangan Usaha (SKU).',
      'Isi data pemohon (nama, NIK, KK, tempat & tanggal lahir, agama, jenis kelamin).',
      'Isi data usaha: nama, jenis, deskripsi, alamat, jam operasional, penghasilan.',
      'Upload dokumen: KTP, KK, foto tempat usaha.',
      'Klik "Kirim Pengajuan" untuk dikirim ke petugas desa.',
    ],
  },
  {
    id: 3,
    title: 'Cara Mendaftarkan UMKM',
    icon: 'add_business',
    image: '/src/assets/bantuan/daftar-umkm.png',
    steps: [
      'Login ke akun Anda.',
      'Buka menu UMKM > Ajukan Produk UMKM.',
      'Isi form: nama UMKM, kategori, deskripsi, harga min/max, alamat, jam operasional, WhatsApp, link e-commerce (opsional).',
      'Upload hingga 5 foto produk (JPG/PNG, maks 5MB per foto).',
      'Klik "Ajukan UMKM" dan tunggu persetujuan admin.',
    ],
  },
  {
    id: 4,
    title: 'Cara Melihat UMKM yang Sudah Ada',
    icon: 'visibility',
    image: '/src/assets/bantuan/lihat-umkm.png',
    steps: [
      'Buka halaman UMKM dari navbar utama.',
      'Gunakan filter kategori untuk menyaring produk.',
      'Klik salah satu kartu UMKM untuk melihat detail.',
      'Hubungi pemilik UMKM melalui WhatsApp atau e-commerce jika tersedia.',
    ],
  },
  {
    id: 5,
    title: 'Cara Menutup / Menghapus UMKM',
    icon: 'delete',
    image: '/src/assets/bantuan/hapus-umkm.png',
    steps: [
      'Login dan masuk ke menu UMKM > UMKM Saya.',
      'Cari UMKM yang ingin ditutup.',
      'Klik tombol "Hapus" di bawah kartu UMKM.',
      'Konfirmasi penghapusan pada dialog yang muncul.',
      'UMKM akan dihapus dari daftar Anda.',
    ],
  },
  {
    id: 6,
    title: 'Cara Melihat Riwayat Pengajuan',
    icon: 'history',
    image: '/src/assets/bantuan/riwayat-pengajuan.png',
    steps: [
      'Login dan buka menu Riwayat Pengajuan di sidebar dashboard.',
      'Gunakan filter jenis layanan (KTP/SKU) dan status (Diproses/Disetujui/Ditolak).',
      'Klik "Detail" pada baris pengajuan untuk melihat informasi lengkap.',
      'Jika disetujui, nomor antrean akan tampil di detail pengajuan.',
    ],
  },
  {
    id: 7,
    title: 'Cara Edit Profil',
    icon: 'edit',
    image: '/src/assets/bantuan/edit-profil.png',
    steps: [
      'Klik avatar profil di kanan atas topbar.',
      'Pilih "Edit Profil" dari dropdown.',
      'Ubah nama atau email sesuai kebutuhan.',
      'Klik "Simpan Perubahan".',
    ],
  },
  {
    id: 8,
    title: 'Cara Ganti Password',
    icon: 'lock',
    image: '/src/assets/bantuan/ganti-password.png',
    steps: [
      'Buka halaman Edit Profil.',
      'Isi kolom Password Saat Ini.',
      'Isi Password Baru dan Konfirmasi Password Baru.',
      'Klik "Simpan Perubahan" untuk menerapkan password baru.',
    ],
  },
  {
    id: 9,
    title: 'Cara Lupa Password',
    icon: 'lock_reset',
    image: '/src/assets/bantuan/lupa-password.png',
    steps: [
      'Buka halaman Login.',
      'Klik tautan "Lupa password?".',
      'Masukkan email yang terdaftar.',
      'Cek email untuk tautan reset password.',
      'Ikuti tautan, buat password baru, lalu login kembali.',
    ],
  },
  {
    id: 10,
    title: 'Cara Melapor di Pengaduan',
    icon: 'report',
    image: '/src/assets/bantuan/pengaduan.png',
    steps: [
      'Login ke akun Anda (wajib memiliki akun).',
      'Masuk ke menu Pengaduan.',
      'Isi subjek, deskripsi masalah, lokasi, RT/RW.',
      'Isi data pelapor: nama dan nomor telepon.',
      'Upload foto bukti atau dokumen pendukung (opsional).',
      'Klik "Kirim Pengaduan" dan pantau di Riwayat Pengaduan.',
    ],
  },
];

const BantuanPage = () => {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex flex-col pt-18">
      <Navbar />
      <main className="grow max-w-5xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-xl">
        <section className="text-center mb-xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>
              help
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary mb-md">Pusat Bantuan</h1>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-lg"></div>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Panduan langkah demi langkah untuk menggunakan layanan digital Desa Sumberporong.
          </p>
        </section>

        <div className="space-y-3">
          {bantuanData.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <h2 className="font-headline-md text-lg text-on-surface truncate">
                    {item.title}
                  </h2>
                </div>
                <span
                  className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${
                    openId === item.id ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {openId === item.id && (
                <div className="px-5 pb-6 border-t border-outline-variant/20">
                  <div className="rounded-xl overflow-hidden mt-4 mb-5 bg-surface-container-low">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <ol className="space-y-3">
                    {item.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-7 h-7 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label-md font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-body-md text-on-surface-variant">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BantuanPage;
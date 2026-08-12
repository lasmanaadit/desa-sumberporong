// src/pages/dashboard/PengaduanPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';

const PengaduanPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subjek: '',
    deskripsi: '',
    lokasi: '',
    rt: '',
    rw: '',
    namaPelapor: '',
    noTelepon: '',
    email: '',
  });

  const [files, setFiles] = useState({
    foto: null,
    dokumenPendukung: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList[0]) {
      setFiles((prev) => ({ ...prev, [name]: fileList[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi minimal
    if (!form.deskripsi || !form.lokasi || !form.namaPelapor || !form.noTelepon) {
      alert('Deskripsi, lokasi, nama, dan nomor telepon wajib diisi.');
      return;
    }

    console.log('Data pengaduan:', form);
    console.log('File:', files);
    alert('Pengaduan berhasil dikirim!');
    // Reset form atau redirect
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="lg:ml-72 min-h-screen">
        <Topbar setIsOpen={setIsSidebarOpen} />

        <main className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* HEADER */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 rounded-xl border border-outline-variant/30 hover:bg-primary/10 flex items-center justify-center text-on-surface-variant"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                    arrow_back
                  </span>
                </button>
                <div>
                  <h1 className="font-headline-lg text-on-background">Pengaduan Masyarakat</h1>
                  <p className="font-body-md text-on-surface-variant mt-1">
                    Laporkan masalah atau keluhan untuk ditindaklanjuti oleh pemerintah desa.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Informasi */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '22px' }}>
                  info
                </span>
                <div>
                  <p className="font-label-md font-semibold text-primary">Perhatian</p>
                  <p className="font-body-md text-on-surface-variant mt-1">
                    Setiap laporan akan diproses maksimal 3x24 jam. Pastikan data yang Anda masukkan valid.
                  </p>
                </div>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 lg:p-8 space-y-8"
              >
                {/* Data Pengaduan */}
                <div>
                  <h2 className="font-headline-md text-xl text-on-background">Data Pengaduan</h2>
                  <p className="font-body-md text-on-surface-variant mt-1 mb-5">
                    Isi detail pengaduan dengan jelas.
                  </p>

                  <div className="grid grid-cols-1 gap-5">
                    {/* Subjek */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">Subjek Pengaduan</label>
                      <input
                        type="text"
                        name="subjek"
                        value={form.subjek}
                        onChange={handleChange}
                        placeholder="Contoh: Jalan rusak di RT 03"
                        className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>

                    {/* Deskripsi */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">Deskripsi Masalah</label>
                      <textarea
                        name="deskripsi"
                        value={form.deskripsi}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Jelaskan secara detail masalah yang terjadi..."
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none"
                        required
                      />
                    </div>

                    {/* Lokasi */}
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">Lokasi</label>
                      <input
                        type="text"
                        name="lokasi"
                        value={form.lokasi}
                        onChange={handleChange}
                        placeholder="Contoh: Jalan Raya Sumberporong No. 25"
                        className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                        required
                      />
                    </div>

                    {/* RT & RW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="font-label-md text-on-surface block mb-2">RT</label>
                        <input
                          type="text"
                          name="rt"
                          value={form.rt}
                          onChange={handleChange}
                          placeholder="Contoh: 003"
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-label-md text-on-surface block mb-2">RW</label>
                        <input
                          type="text"
                          name="rw"
                          value={form.rw}
                          onChange={handleChange}
                          placeholder="Contoh: 002"
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Pelapor */}
                <div className="border-t border-outline-variant/20 pt-8">
                  <h2 className="font-headline-md text-xl text-on-background">Data Pelapor</h2>
                  <p className="font-body-md text-on-surface-variant mt-1 mb-5">
                    Data diri pelapor untuk memudahkan tindak lanjut.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">Nama Lengkap</label>
                      <input
                        type="text"
                        name="namaPelapor"
                        value={form.namaPelapor}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">Nomor Telepon</label>
                      <input
                        type="tel"
                        name="noTelepon"
                        value={form.noTelepon}
                        onChange={handleChange}
                        placeholder="08xxxxxxxxxx"
                        className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-label-md text-on-surface block mb-2">Email <span className="text-on-surface-variant text-xs">(opsional)</span></label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="nama@email.com"
                        className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Bukti (Opsional) */}
                <div className="border-t border-outline-variant/20 pt-8">
                  <h2 className="font-headline-md text-xl text-on-background">Upload Bukti Pendukung <span className="text-on-surface-variant text-sm">(opsional)</span></h2>
                  <p className="font-body-md text-on-surface-variant mt-1 mb-5">
                    Upload foto atau dokumen pendukung pengaduan jika ada (maksimal 5MB).
                  </p>

                  <div className="space-y-4">
                    {/* Foto */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-outline-variant/20 rounded-xl bg-surface/50">
                      <span className="font-label-md text-on-surface flex-1">Foto Bukti</span>
                      <input
                        type="file"
                        name="foto"
                        accept=".jpg,.jpeg,.png,.heic"
                        onChange={handleFileChange}
                        className="text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                      {files.foto && (
                        <span className="text-xs text-primary font-medium">✓ Terupload</span>
                      )}
                    </div>

                    {/* Dokumen Pendukung */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-outline-variant/20 rounded-xl bg-surface/50">
                      <span className="font-label-md text-on-surface flex-1">Dokumen Pendukung <span className="text-on-surface-variant text-xs">(opsional)</span></span>
                      <input
                        type="file"
                        name="dokumenPendukung"
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                      {files.dokumenPendukung && (
                        <span className="text-xs text-primary font-medium">✓ Terupload</span>
                      )}
                    </div>
                  </div>

                  <p className="font-label-sm text-on-surface-variant mt-3">
                    Format yang didukung: JPG, PNG, PDF, DOC, DOCX. Maksimal 5MB per file.
                  </p>
                </div>

                {/* Submit */}
                <div className="border-t border-outline-variant/20 pt-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-primary text-white font-label-md font-semibold hover:bg-primary-container transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      send
                    </span>
                    Kirim Pengaduan
                  </button>
                </div>
              </motion.div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PengaduanPage;
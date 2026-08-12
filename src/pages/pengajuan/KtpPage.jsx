// src/pages/dashboard/KtpPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';
import TataCara from '../../components/dashboard/TataCaraKtp';

const KtpPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // State form
  const [form, setForm] = useState({
    jenisPermohonan: '', // 'baru', 'perpanjangan', 'hilang'
    namaLengkap: '',
    nomorKK: '',
    nik: '',
    alamat: '',
    rt: '',
    rw: '',
    kodePos: '',
  });

  // State untuk file upload (dynamic)
  const [files, setFiles] = useState({});

  // Syarat dokumen berdasarkan jenis permohonan
  const syaratDokumen = {
    baru: [
      { id: 'kk', label: 'Fotokopi Kartu Keluarga (KK)' },
      { id: 'akte', label: 'Fotokopi Akta Kelahiran atau Ijazah (jika ada)' },
      { id: 'usia', label: 'Telah berusia minimal 17 tahun (pernyataan)' },
    ],
    perpanjangan: [
      { id: 'ktpLama', label: 'Fotokopi KTP-el pemohon' },
      { id: 'kk', label: 'Fotokopi Kartu Keluarga (KK)' },
      { id: 'pengantarRt', label: 'Surat pengantar asli dari ketua RT dan RW setempat' },
    ],
    hilang: [
      { id: 'kk', label: 'Fotokopi Kartu Keluarga (KK)' },
      { id: 'suratKehilangan', label: 'Surat Keterangan Kehilangan dari kantor kepolisian (Polsek terdekat)' },
      { id: 'pengantarRtRw', label: 'Pengantar dari RT/RW setempat' },
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Reset file upload jika jenis permohonan berubah
    if (name === 'jenisPermohonan') {
      setFiles({});
    }
  };

  const handleFileChange = (e, docId) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [docId]: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi jenis permohonan
    if (!form.jenisPermohonan) {
      alert('Pilih jenis permohonan terlebih dahulu.');
      return;
    }
    // Cek apakah semua dokumen sudah diupload
    const requiredDocs = syaratDokumen[form.jenisPermohonan] || [];
    const missing = requiredDocs.filter(doc => !files[doc.id]);
    if (missing.length > 0) {
      alert(`Harap upload semua dokumen yang diperlukan: ${missing.map(d => d.label).join(', ')}`);
      return;
    }
    console.log('Data pengajuan KTP:', form);
    console.log('File dokumen:', files);
    alert('Pengajuan berhasil dikirim!');
    // Nanti redirect atau reset form
  };

  const getDokumenList = () => {
    if (!form.jenisPermohonan) return [];
    return syaratDokumen[form.jenisPermohonan] || [];
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="lg:ml-72 min-h-screen">
        <Topbar setIsOpen={setIsSidebarOpen} />
        <main className="p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
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
                  <h1 className="font-headline-lg text-on-background">Pengajuan KTP</h1>
                  <p className="font-body-md text-on-surface-variant mt-1">
                    Formulir pengajuan surat pengantar KTP.
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
                    Pastikan data yang Anda masukkan sesuai dengan dokumen kependudukan yang dimiliki.
                  </p>
                </div>
              </div>
            </div>

            {/* Tata Cara (komponen terpisah) */}
            <TataCara jenisSurat="surat pengantar KTP" />

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 lg:p-8"
              >
                {/* Jenis Permohonan */}
                <div className="mb-8">
                  <h2 className="font-headline-md text-xl text-on-background">Jenis Permohonan</h2>
                  <p className="font-body-md text-on-surface-variant mt-1 mb-5">
                    Pilih jenis permohonan KTP yang akan diajukan.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'baru', label: 'A. Baru' },
                      { value: 'perpanjangan', label: 'B. Perpanjangan' },
                      { value: 'hilang', label: 'C. Hilang' },
                    ].map((item) => (
                      <label
                        key={item.value}
                        className={`cursor-pointer border rounded-xl p-4 transition-all ${
                          form.jenisPermohonan === item.value
                            ? 'border-primary bg-primary/5'
                            : 'border-outline-variant/30 hover:border-primary/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="jenisPermohonan"
                          value={item.value}
                          checked={form.jenisPermohonan === item.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              form.jenisPermohonan === item.value ? 'border-primary' : 'border-outline'
                            }`}
                          >
                            {form.jenisPermohonan === item.value && (
                              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="font-label-md">{item.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Data Pemohon */}
                <div className="border-t border-outline-variant/20 pt-8">
                  <h2 className="font-headline-md text-xl text-on-background">Data Pemohon</h2>
                  <p className="font-body-md text-on-surface-variant mt-1 mb-5">
                    Masukkan data sesuai dokumen kependudukan.
                  </p>
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">Nama Lengkap</label>
                      <input
                        type="text"
                        name="namaLengkap"
                        value={form.namaLengkap}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="font-label-md text-on-surface block mb-2">Nomor Kartu Keluarga</label>
                        <input
                          type="text"
                          name="nomorKK"
                          value={form.nomorKK}
                          onChange={handleChange}
                          placeholder="Masukkan nomor KK"
                          maxLength="16"
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-label-md text-on-surface block mb-2">NIK</label>
                        <input
                          type="text"
                          name="nik"
                          value={form.nik}
                          onChange={handleChange}
                          placeholder="Masukkan NIK"
                          maxLength="16"
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-label-md text-on-surface block mb-2">Alamat</label>
                      <textarea
                        name="alamat"
                        value={form.alamat}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Masukkan alamat lengkap"
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="font-label-md text-on-surface block mb-2">RT</label>
                        <input
                          type="text"
                          name="rt"
                          value={form.rt}
                          onChange={handleChange}
                          placeholder="001"
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-label-md text-on-surface block mb-2">RW</label>
                        <input
                          type="text"
                          name="rw"
                          value={form.rw}
                          onChange={handleChange}
                          placeholder="002"
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-label-md text-on-surface block mb-2">Kode Pos</label>
                        <input
                          type="text"
                          name="kodePos"
                          value={form.kodePos}
                          onChange={handleChange}
                          placeholder="65176"
                          maxLength="5"
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Dokumen */}
                {form.jenisPermohonan && (
                  <div className="border-t border-outline-variant/20 pt-8 mt-8">
                    <h2 className="font-headline-md text-xl text-on-background">Upload Dokumen</h2>
                    <p className="font-body-md text-on-surface-variant mt-1 mb-5">
                      Upload dokumen yang diperlukan sesuai jenis permohonan.
                    </p>
                    <div className="space-y-4">
                      {getDokumenList().map((doc) => (
                        <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-outline-variant/20 rounded-xl bg-surface/50">
                          <span className="font-label-md text-on-surface flex-1">{doc.label}</span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => handleFileChange(e, doc.id)}
                            className="text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            required
                          />
                          {files[doc.id] && (
                            <span className="text-xs text-primary font-medium">✓ Terupload</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="border-t border-outline-variant/20 mt-8 pt-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-primary text-white font-label-md font-semibold hover:bg-primary-container transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      send
                    </span>
                    Kirim Pengajuan
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

export default KtpPage;
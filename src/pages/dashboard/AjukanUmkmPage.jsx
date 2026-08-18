// src/pages/dashboard/AjukanUmkmPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';

const AjukanUmkmPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: '',
    tempat: '',
    kategori: '',
    deskripsi: '',
    harga_min: '',
    harga_max: '',
    alamat: '',
    jam_buka: '',
    jam_tutup: '',
    whatsapp: '',
    ecommerce: '',
  });

  // 5 slot foto
  const [fotoSlots, setFotoSlots] = useState(
    Array.from({ length: 5 }, () => ({ file: null, preview: null }))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlotUpload = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoSlots((prev) => {
        const newSlots = [...prev];
        newSlots[index] = { file, preview: reader.result };
        return newSlots;
      });
    };
    reader.readAsDataURL(file);
  };

  const removeSlot = (index) => {
    setFotoSlots((prev) => {
      const newSlots = [...prev];
      newSlots[index] = { file: null, preview: null };
      return newSlots;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const uploadedFiles = fotoSlots
      .filter(slot => slot.file !== null)
      .map(slot => slot.file);
    if (uploadedFiles.length === 0) {
      alert('Upload minimal 1 foto produk');
      return;
    }
    console.log('Data UMKM:', form);
    console.log('Foto:', uploadedFiles);
    alert('UMKM berhasil diajukan!');
    navigate('/dashboard/umkm');
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="lg:ml-72 min-h-screen">
        <Topbar setIsOpen={setIsSidebarOpen} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link
                to="/dashboard/umkm"
                className="inline-flex items-center gap-2 text-primary font-label-md hover:underline mb-5"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Kembali ke UMKM Saya
              </Link>
              <h1 className="font-headline-lg text-primary">Ajukan UMKM</h1>
              <p className="font-body-md text-on-surface-variant mt-2">
                Lengkapi data UMKM Anda untuk ditampilkan di website Desa Sumberporong.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <label className="block font-label-md font-semibold mb-2">Nama UMKM</label>
                <input type="text" name="nama" value={form.nama} onChange={handleChange} placeholder="Contoh: Warung Makan Sumber Rejeki" required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>

              <div>
                <label className="block font-label-md font-semibold mb-2">Tempat UMKM</label>
                <input type="text" name="tempat" value={form.tempat} onChange={handleChange} placeholder="Contoh: Pasar Desa Sumberporong" required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block font-label-md font-semibold mb-2">Kategori</label>
                <select name="kategori" value={form.kategori} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary">
                  <option value="">Pilih kategori</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Kerajinan">Kerajinan</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Jasa">Jasa</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-label-md font-semibold mb-2">Deskripsi UMKM</label>
                <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} rows="4" placeholder="Jelaskan usaha Anda..." required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface resize-none outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md font-semibold mb-2">Harga Minimum</label>
                  <input type="number" name="harga_min" value={form.harga_min} onChange={handleChange} placeholder="10000" required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block font-label-md font-semibold mb-2">Harga Maksimum</label>
                  <input type="number" name="harga_max" value={form.harga_max} onChange={handleChange} placeholder="50000" required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
                </div>
              </div>

              <div>
                <label className="block font-label-md font-semibold mb-2">Alamat</label>
                <input type="text" name="alamat" value={form.alamat} onChange={handleChange} placeholder="Jl. Pasar No. 12, Sumberporong" required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md font-semibold mb-2">Jam Buka</label>
                  <input type="time" name="jam_buka" value={form.jam_buka} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block font-label-md font-semibold mb-2">Jam Tutup</label>
                  <input type="time" name="jam_tutup" value={form.jam_tutup} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
                </div>
              </div>

              <div>
                <label className="block font-label-md font-semibold mb-2">Nomor WhatsApp</label>
                <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="08xxxxxxxxxx" required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
                <p className="text-xs text-on-surface-variant mt-2">Nomor ini akan digunakan pembeli untuk menghubungi Anda.</p>
              </div>

              <div>
                <label className="block font-label-md font-semibold mb-2">Link E-Commerce <span className="font-normal text-on-surface-variant ml-2">(Opsional)</span></label>
                <input type="url" name="ecommerce" value={form.ecommerce} onChange={handleChange} placeholder="https://tokopedia.com/..." className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
              </div>

              {/* --- BAGIAN FOTO PRODUK DENGAN 5 SLOT --- */}
              <div>
                <label className="block font-label-md font-semibold mb-2">
                  Foto Produk
                  <span className="font-normal text-on-surface-variant">
                    {' '}
                    (Maksimal 5)
                  </span>
                </label>

                <div className="grid grid-cols-5 gap-3">
                  {fotoSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg border-2 border-dashed border-outline-variant/40 hover:border-primary/50 transition-colors flex items-center justify-center overflow-hidden bg-surface/20"
                    >
                      {slot.preview ? (
                        <>
                          <img
                            src={slot.preview}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeSlot(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center text-xs hover:bg-error/80 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                          <span className="material-symbols-outlined text-on-surface-variant/50 text-3xl">
                            add_photo_alternate
                          </span>
                          <span className="text-xs text-on-surface-variant/50 mt-1">
                            Tambah
                          </span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) handleSlotUpload(index, file);
                              e.target.value = ''; // reset agar bisa pilih file yang sama lagi
                            }}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-on-surface-variant mt-2">
                  Upload minimal 1 foto produk (JPG/PNG). Klik kotak kosong untuk menambah foto.
                </p>
              </div>

              {/* --- BUTTON --- */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-outline-variant/20">
                <Link to="/dashboard/umkm" className="flex-1 flex items-center justify-center px-5 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors">
                  Batal
                </Link>
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined">send</span>
                  Ajukan UMKM
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AjukanUmkmPage;
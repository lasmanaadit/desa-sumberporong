// src/pages/dashboard/AjukanUmkm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';

const AjukanUmkm = () => {
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

  const [fotoFiles, setFotoFiles] = useState([]);
  const [fotoPreviews, setFotoPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + fotoPreviews.length > 5) {
      alert('Maksimal 5 foto');
      return;
    }
    setFotoFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFotoPreviews((prev) => [...prev, ...previews]);
  };

  const removeFoto = (index) => {
    setFotoFiles((prev) => prev.filter((_, i) => i !== index));
    setFotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fotoFiles.length === 0) {
      alert('Upload minimal 1 foto produk');
      return;
    }
    console.log('Data UMKM:', form);
    console.log('Foto:', fotoFiles);
    alert('UMKM berhasil diajukan!');
    navigate('/dashboard/umkm');
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="lg:ml-72 min-h-screen">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link to="/dashboard/umkm" className="inline-flex items-center gap-2 text-primary font-label-md hover:underline mb-5">
                <span className="material-symbols-outlined">arrow_back</span>
                Kembali ke UMKM Saya
              </Link>
              <h1 className="font-headline-lg text-primary">Ajukan UMKM</h1>
              <p className="font-body-md text-on-surface-variant mt-2">
                Lengkapi data UMKM Anda untuk ditampilkan di website Desa Sumberporong.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 sm:p-8 space-y-6">
              {/* Field form (sama seperti sebelumnya) */}
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

              {/* Upload Foto (max 5) dengan preview grid */}
              <div>
                <label className="block font-label-md font-semibold mb-2">Foto Produk <span className="font-normal text-on-surface-variant">(Maksimal 5)</span></label>
                <input type="file" accept="image/png,image/jpeg" multiple onChange={handleFotoChange} className="w-full p-3 rounded-xl border border-outline-variant/50 bg-surface" />
                {fotoPreviews.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {fotoPreviews.map((src, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-outline-variant/30">
                        <img src={src} alt={`Foto ${idx+1}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeFoto(idx)} className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center text-xs hover:bg-error/80 transition-colors">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-on-surface-variant mt-2">Upload minimal 1 foto produk (JPG/PNG).</p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-outline-variant/20">
                <Link to="/dashboard/umkm" className="flex-1 flex items-center justify-center px-5 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors">Batal</Link>
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

export default AjukanUmkm;
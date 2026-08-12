// src/pages/dashboard/EditUmkmPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';
import { dummyUmkmList } from '../../data/umkmDummy';

const EditUmkmPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const [existingFoto, setExistingFoto] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const found = dummyUmkmList.find(item => item.id === parseInt(id));
        if (found) {
          setForm({
            nama: found.nama || '',
            tempat: found.tempat || '',
            kategori: found.kategori || '',
            deskripsi: found.deskripsi || '',
            harga_min: found.harga_min || '',
            harga_max: found.harga_max || '',
            alamat: found.alamat || '',
            jam_buka: found.jam_buka || '',
            jam_tutup: found.jam_tutup || '',
            whatsapp: found.whatsapp || '',
            ecommerce: found.ecommerce || '',
          });
          setExistingFoto(found.foto_lain || []);
        } else {
          setError('UMKM tidak ditemukan');
        }
      } catch (err) {
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + fotoPreviews.length + existingFoto.length > 5) {
      alert('Maksimal 5 foto');
      e.target.value = '';
      return;
    }
    setFotoFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFotoPreviews((prev) => [...prev, ...previews]);
  };

  const removeExistingFoto = (index) => {
    setExistingFoto((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewFoto = (index) => {
    URL.revokeObjectURL(fotoPreviews[index]);
    setFotoFiles((prev) => prev.filter((_, i) => i !== index));
    setFotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingFoto.length === 0 && fotoFiles.length === 0) {
      alert('Upload minimal 1 foto produk');
      return;
    }
    console.log('Update UMKM:', form);
    console.log('Foto baru:', fotoFiles);
    alert('UMKM berhasil diperbarui!');
    navigate('/dashboard/umkm');
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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="lg:ml-72 min-h-screen flex-1 flex flex-col">
          <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 flex items-center justify-center p-6 lg:p-8">
            <div className="text-center text-error">
              <span className="material-symbols-outlined text-4xl">error</span>
              <p className="font-body-lg mt-2">{error}</p>
              <button
                onClick={() => navigate('/dashboard/umkm')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
              >
                Kembali ke UMKM Saya
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
              <h1 className="font-headline-lg text-primary">Edit UMKM</h1>
              <p className="font-body-md text-on-surface-variant mt-2">Perbarui data UMKM Anda.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <label className="block font-label-md font-semibold mb-2">Nama UMKM</label>
                <input type="text" name="nama" value={form.nama} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
              <div>
                <label className="block font-label-md font-semibold mb-2">Tempat UMKM</label>
                <input type="text" name="tempat" value={form.tempat} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-label-md font-semibold mb-2">Kategori</label>
                <select name="kategori" value={form.kategori} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary">
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Kerajinan">Kerajinan</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Jasa">Jasa</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block font-label-md font-semibold mb-2">Deskripsi</label>
                <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} rows="4" required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface resize-none outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md font-semibold mb-2">Harga Minimum</label>
                  <input type="number" name="harga_min" value={form.harga_min} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block font-label-md font-semibold mb-2">Harga Maksimum</label>
                  <input type="number" name="harga_max" value={form.harga_max} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block font-label-md font-semibold mb-2">Alamat</label>
                <input type="text" name="alamat" value={form.alamat} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
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
                <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
                <p className="text-xs text-on-surface-variant mt-2">Nomor ini akan digunakan pembeli untuk menghubungi Anda.</p>
              </div>
              <div>
                <label className="block font-label-md font-semibold mb-2">Link E-Commerce <span className="font-normal text-on-surface-variant ml-2">(Opsional)</span></label>
                <input type="url" name="ecommerce" value={form.ecommerce} onChange={handleChange} placeholder="https://tokopedia.com/..." className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block font-label-md font-semibold mb-2">Foto Produk <span className="font-normal text-on-surface-variant">(Maksimal 5)</span></label>
                <input type="file" accept="image/png,image/jpeg" multiple onChange={handleFotoChange} className="w-full p-3 rounded-xl border border-outline-variant/50 bg-surface" />
                <div className="flex flex-wrap gap-3 mt-3">
                  {existingFoto.map((src, idx) => (
                    <div key={`existing-${idx}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-outline-variant/30">
                      <img src={src} alt={`Foto ${idx+1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingFoto(idx)} className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center text-xs hover:bg-error/80 transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                  {fotoPreviews.map((src, idx) => (
                    <div key={`new-${idx}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-outline-variant/30">
                      <img src={src} alt={`Foto baru ${idx+1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeNewFoto(idx)} className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center text-xs hover:bg-error/80 transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-on-surface-variant mt-2">Upload minimal 1 foto produk (JPG/PNG).</p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-outline-variant/20">
                <Link to="/dashboard/umkm" className="flex-1 flex items-center justify-center px-5 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors">Batal</Link>
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined">save</span>
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditUmkmPage;
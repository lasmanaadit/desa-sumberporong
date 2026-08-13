// src/pages/admin/AdminVisiMisi.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminVisiMisi = () => {
  const [data, setData] = useState({
    visi: 'Terwujudnya Desa Sumberporong yang Mandiri, Sejahtera, dan Berbudaya melalui Tata Kelola Pemerintahan yang Baik dan Transparan.',
    misi: [
      'Meningkatkan kualitas pelayanan publik secara transparan dan akuntabel.',
      'Mendorong pemberdayaan ekonomi masyarakat berbasis potensi lokal.',
      'Meningkatkan kualitas infrastruktur desa untuk mendukung aktivitas warga.',
      'Melestarikan nilai-nilai budaya dan gotong royong dalam kehidupan bermasyarakat.',
    ],
  });

  const [form, setForm] = useState({ visi: data.visi, misi: data.misi.join('\n') });
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setForm({ visi: data.visi, misi: data.misi.join('\n') });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setData({
      visi: form.visi,
      misi: form.misi.split('\n').filter(line => line.trim() !== ''),
    });
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">Visi & Misi</h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Edit visi dan misi desa.
          </p>
        </div>
        <button onClick={handleEdit} className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined">edit</span>
          Edit
        </button>
      </div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 mb-6"
        >
          <h2 className="font-headline-md text-on-surface mb-4">Edit Visi & Misi</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-label-md mb-1">Visi</label>
              <textarea
                rows="2"
                value={form.visi}
                onChange={(e) => setForm({ ...form, visi: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none resize-none"
                required
              />
            </div>
            <div>
              <label className="block font-label-md mb-1">Misi (satu baris per poin)</label>
              <textarea
                rows="5"
                value={form.misi}
                onChange={(e) => setForm({ ...form, misi: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none resize-none"
                placeholder="Tulis setiap poin misi di baris baru"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl">Simpan</button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-outline-variant rounded-xl text-on-surface-variant"
              >
                Batal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">
          <h3 className="font-headline-md text-primary mb-2">Visi</h3>
          <p className="font-body-md text-on-surface-variant">{data.visi}</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">
          <h3 className="font-headline-md text-primary mb-2">Misi</h3>
          <ul className="list-disc list-inside space-y-2 font-body-md text-on-surface-variant">
            {data.misi.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminVisiMisi;
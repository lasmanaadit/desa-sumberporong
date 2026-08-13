// src/pages/admin/AdminStatistik.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminStatistik = () => {
  const [stats, setStats] = useState({
    idm: '',
    totalPenduduk: '',
    totalKK: '',
    totalLaki: '',
    totalPerempuan: '',
    pkh: '',
    bltDD: '',
    bpnt: '',
    usia0_14: '',
    usia15_64: '',
    usia65plus: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStats(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simpan statistik
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-on-background">Statistik Desa</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Kelola data statistik desa.</p>
        </div>
        <button onClick={handleEdit} className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined">edit</span>
          Edit Statistik
        </button>
      </div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 mb-6"
        >
          <h2 className="font-headline-md text-on-surface mb-4">Edit Statistik</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md mb-1">IDM</label>
                <input type="text" name="idm" value={stats.idm} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block font-label-md mb-1">Total Penduduk</label>
                <input type="text" name="totalPenduduk" value={stats.totalPenduduk} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block font-label-md mb-1">Total KK</label>
                <input type="text" name="totalKK" value={stats.totalKK} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block font-label-md mb-1">Total Laki-laki</label>
                <input type="text" name="totalLaki" value={stats.totalLaki} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block font-label-md mb-1">Total Perempuan</label>
                <input type="text" name="totalPerempuan" value={stats.totalPerempuan} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block font-label-md mb-1">PKH</label>
                <input type="text" name="pkh" value={stats.pkh} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block font-label-md mb-1">BLT DD</label>
                <input type="text" name="bltDD" value={stats.bltDD} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block font-label-md mb-1">BPNT</label>
                <input type="text" name="bpnt" value={stats.bpnt} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block font-label-md mb-1">Usia 0-14 Tahun (%)</label>
                <input type="text" name="usia0_14" value={stats.usia0_14} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block font-label-md mb-1">Usia 15-64 Tahun (%)</label>
                <input type="text" name="usia15_64" value={stats.usia15_64} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block font-label-md mb-1">Usia 65+ Tahun (%)</label>
                <input type="text" name="usia65plus" value={stats.usia65plus} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary outline-none" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl">Simpan</button>
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-outline-variant rounded-xl text-on-surface-variant">Batal</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Preview Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">
          <h3 className="font-headline-md text-primary mb-4">Data Umum</h3>
          <dl className="space-y-2">
            <div className="flex justify-between"><dt>IDM</dt><dd>{stats.idm || '-'}</dd></div>
            <div className="flex justify-between"><dt>Total Penduduk</dt><dd>{stats.totalPenduduk || '-'}</dd></div>
            <div className="flex justify-between"><dt>Total KK</dt><dd>{stats.totalKK || '-'}</dd></div>
            <div className="flex justify-between"><dt>Laki-laki</dt><dd>{stats.totalLaki || '-'}</dd></div>
            <div className="flex justify-between"><dt>Perempuan</dt><dd>{stats.totalPerempuan || '-'}</dd></div>
          </dl>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">
          <h3 className="font-headline-md text-primary mb-4">Bansos & Usia</h3>
          <dl className="space-y-2">
            <div className="flex justify-between"><dt>PKH</dt><dd>{stats.pkh || '-'}</dd></div>
            <div className="flex justify-between"><dt>BLT DD</dt><dd>{stats.bltDD || '-'}</dd></div>
            <div className="flex justify-between"><dt>BPNT</dt><dd>{stats.bpnt || '-'}</dd></div>
            <div className="flex justify-between"><dt>Usia 0-14</dt><dd>{stats.usia0_14 || '-'}%</dd></div>
            <div className="flex justify-between"><dt>Usia 15-64</dt><dd>{stats.usia15_64 || '-'}%</dd></div>
            <div className="flex justify-between"><dt>Usia 65+</dt><dd>{stats.usia65plus || '-'}%</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistik;
import React from 'react';
import { motion } from 'framer-motion';

import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';
import TataCara from '../../components/dashboard/TataCaraSku';


const SkuPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const [form, setForm] = React.useState({
    // DATA PEMOHON
    namaLengkap: '',
    nik: '',
    nomorKK: '',
    alamat: '',
    rt: '',
    rw: '',
    kodePos: '',

    // DATA USAHA
    namaUsaha: '',
    jenisUsaha: '',
    deskripsiUsaha: '',
    alamatUsaha: '',
    rtUsaha: '',
    rwUsaha: '',
    lamaUsaha: '',
    penghasilan: '',

    // DOKUMEN
    dokumenKtp: null,
    dokumenKK: null,
    fotoUsaha: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Data pengajuan SKU:', form);

    // Nanti data dikirim ke Laravel API
  };

  return (
    <div className="min-h-screen bg-background">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <div className="lg:ml-72 min-h-screen">

        {/* ===================================================
            TOPBAR
        =================================================== */}
        <Topbar setIsOpen={setIsSidebarOpen} />

        {/* ===================================================
            CONTENT
        =================================================== */}
        <main className="p-6 lg:p-8">

          <div className="max-w-5xl mx-auto">

            {/* =================================================
                HEADER
            ================================================= */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >

              <div className="flex items-center gap-3">

                {/* BACK */}
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="w-10 h-10 shrink-0 rounded-xl border border-outline-variant/30 hover:bg-primary/10 flex items-center justify-center text-on-surface-variant transition-colors"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '22px' }}
                  >
                    arrow_back
                  </span>
                </button>

                <div>
                  <h1 className="font-headline-lg text-on-background">
                    Surat Keterangan Usaha
                  </h1>

                  <p className="font-body-md text-on-surface-variant mt-1">
                    Isi formulir berikut untuk mengajukan Surat Keterangan Usaha.
                  </p>
                </div>

              </div>

            </motion.section>


            {/* =================================================
                INFORMATION
            ================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="w-full bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6"
            >

              <div className="flex items-start gap-3">

                <span
                  className="material-symbols-outlined text-primary shrink-0"
                  style={{ fontSize: '22px' }}
                >
                  info
                </span>

                <div>

                  <p className="font-label-md font-semibold text-primary">
                    Perhatian
                  </p>

                  <p className="font-body-md text-on-surface-variant mt-1">
                    Pastikan data pemohon dan data usaha yang dimasukkan
                    sudah benar dan sesuai dengan kondisi sebenarnya.
                  </p>

                </div>

              </div>
              

            </motion.div>

            <TataCara
            jenisSurat="surat pengantar Sku"
            />
            {/* =================================================
                FORM
            ================================================= */}
            <form onSubmit={handleSubmit}>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 lg:p-8"
              >


                {/* =================================================
                    DATA PEMOHON
                ================================================= */}
                <section>

                  <div className="flex items-center gap-3 mb-1">

                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">

                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '22px' }}
                      >
                        person
                      </span>

                    </div>

                    <div>

                      <h2 className="font-headline-md text-xl text-on-background">
                        Data Pemohon
                      </h2>

                      <p className="font-label-sm text-on-surface-variant tracking-normal">
                        Data diri pemohon surat keterangan usaha.
                      </p>

                    </div>

                  </div>


                  <div className="mt-6 space-y-5">

                    {/* NAMA */}
                    <div>

                      <label className="font-label-md text-on-surface block mb-2">
                        Nama Lengkap
                      </label>

                      <input
                        type="text"
                        name="namaLengkap"
                        value={form.namaLengkap}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        required
                        className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                      />

                    </div>


                    {/* NIK + KK */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                      <div>

                        <label className="font-label-md text-on-surface block mb-2">
                          NIK
                        </label>

                        <input
                          type="text"
                          name="nik"
                          value={form.nik}
                          onChange={handleChange}
                          placeholder="Masukkan NIK"
                          maxLength="16"
                          required
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                        />

                      </div>


                      <div>

                        <label className="font-label-md text-on-surface block mb-2">
                          Nomor Kartu Keluarga
                        </label>

                        <input
                          type="text"
                          name="nomorKK"
                          value={form.nomorKK}
                          onChange={handleChange}
                          placeholder="Masukkan nomor KK"
                          maxLength="16"
                          required
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                        />

                      </div>

                    </div>


                    {/* ALAMAT */}
                    <div>

                      <label className="font-label-md text-on-surface block mb-2">
                        Alamat Tempat Tinggal
                      </label>

                      <textarea
                        name="alamat"
                        value={form.alamat}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Masukkan alamat lengkap"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none"
                      />

                    </div>


                    {/* RT RW KODE POS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                      <div>

                        <label className="font-label-md text-on-surface block mb-2">
                          RT
                        </label>

                        <input
                          type="text"
                          name="rt"
                          value={form.rt}
                          onChange={handleChange}
                          placeholder="001"
                          required
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                        />

                      </div>


                      <div>

                        <label className="font-label-md text-on-surface block mb-2">
                          RW
                        </label>

                        <input
                          type="text"
                          name="rw"
                          value={form.rw}
                          onChange={handleChange}
                          placeholder="002"
                          required
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                        />

                      </div>


                      <div>

                        <label className="font-label-md text-on-surface block mb-2">
                          Kode Pos
                        </label>

                        <input
                          type="text"
                          name="kodePos"
                          value={form.kodePos}
                          onChange={handleChange}
                          placeholder="65176"
                          maxLength="5"
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                        />

                      </div>

                    </div>

                  </div>

                </section>


                {/* =================================================
                    DATA USAHA
                ================================================= */}
                <section className="border-t border-outline-variant/20 pt-8 mt-8">

                  <div className="flex items-center gap-3 mb-1">

                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">

                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '22px' }}
                      >
                        storefront
                      </span>

                    </div>

                    <div>

                      <h2 className="font-headline-md text-xl text-on-background">
                        Data Usaha
                      </h2>

                      <p className="font-label-sm text-on-surface-variant tracking-normal">
                        Informasi mengenai usaha yang dimiliki.
                      </p>

                    </div>

                  </div>


                  <div className="mt-6 space-y-5">

                    {/* NAMA USAHA */}
                    <div>

                      <label className="font-label-md text-on-surface block mb-2">
                        Nama Usaha
                      </label>

                      <input
                        type="text"
                        name="namaUsaha"
                        value={form.namaUsaha}
                        onChange={handleChange}
                        placeholder="Contoh: Warung Sumber Rejeki"
                        required
                        className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                      />

                    </div>


                    {/* JENIS USAHA */}
                    <div>

                      <label className="font-label-md text-on-surface block mb-2">
                        Jenis Usaha
                      </label>

                      <select
                        name="jenisUsaha"
                        value={form.jenisUsaha}
                        onChange={handleChange}
                        required
                        className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                      >

                        <option value="">
                          Pilih jenis usaha
                        </option>

                        <option value="perdagangan">
                          Perdagangan
                        </option>

                        <option value="makanan_minuman">
                          Makanan & Minuman
                        </option>

                        <option value="jasa">
                          Jasa
                        </option>

                        <option value="kerajinan">
                          Kerajinan
                        </option>

                        <option value="pertanian">
                          Pertanian
                        </option>

                        <option value="peternakan">
                          Peternakan
                        </option>

                        <option value="lainnya">
                          Lainnya
                        </option>

                      </select>

                    </div>


                    {/* DESKRIPSI */}
                    <div>

                      <label className="font-label-md text-on-surface block mb-2">
                        Deskripsi Usaha
                      </label>

                      <textarea
                        name="deskripsiUsaha"
                        value={form.deskripsiUsaha}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Jelaskan secara singkat usaha yang dijalankan..."
                        required
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none"
                      />

                    </div>


                    {/* ALAMAT USAHA */}
                    <div>

                      <label className="font-label-md text-on-surface block mb-2">
                        Alamat Usaha
                      </label>

                      <textarea
                        name="alamatUsaha"
                        value={form.alamatUsaha}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Masukkan alamat tempat usaha"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none"
                      />

                    </div>


                    {/* RT RW USAHA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                      <div>

                        <label className="font-label-md text-on-surface block mb-2">
                          RT Tempat Usaha
                        </label>

                        <input
                          type="text"
                          name="rtUsaha"
                          value={form.rtUsaha}
                          onChange={handleChange}
                          placeholder="001"
                          required
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                        />

                      </div>


                      <div>

                        <label className="font-label-md text-on-surface block mb-2">
                          RW Tempat Usaha
                        </label>

                        <input
                          type="text"
                          name="rwUsaha"
                          value={form.rwUsaha}
                          onChange={handleChange}
                          placeholder="002"
                          required
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                        />

                      </div>

                    </div>


                    {/* LAMA USAHA + PENGHASILAN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                      <div>

                        <label className="font-label-md text-on-surface block mb-2">
                          Lama Menjalankan Usaha
                        </label>

                        <div className="flex gap-3">

                          <input
                            type="number"
                            name="lamaUsaha"
                            value={form.lamaUsaha}
                            onChange={handleChange}
                            min="0"
                            placeholder="Contoh: 3"
                            required
                            className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                          />

                          <div className="h-12 px-4 rounded-xl bg-surface-container flex items-center text-on-surface-variant font-label-md">
                            Tahun
                          </div>

                        </div>

                      </div>


                      <div>

                        <label className="font-label-md text-on-surface block mb-2">
                          Perkiraan Penghasilan per Bulan
                        </label>

                        <select
                          name="penghasilan"
                          value={form.penghasilan}
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                        >

                          <option value="">
                            Pilih kisaran penghasilan
                          </option>

                          <option value="dibawah-1-juta">
                            Di bawah Rp1.000.000
                          </option>

                          <option value="1-5-juta">
                            Rp1.000.000 - Rp5.000.000
                          </option>

                          <option value="5-10-juta">
                            Rp5.000.000 - Rp10.000.000
                          </option>

                          <option value="diatas-10-juta">
                            Di atas Rp10.000.000
                          </option>

                        </select>

                      </div>

                    </div>

                  </div>

                </section>


                {/* =================================================
                    DOKUMEN
                ================================================= */}
                <section className="border-t border-outline-variant/20 pt-8 mt-8">

                  <div className="flex items-center gap-3 mb-1">

                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '22px' }}
                      >
                        upload_file
                      </span>

                    </div>

                    <div>

                      <h2 className="font-headline-md text-xl text-on-background">
                        Dokumen Pendukung
                      </h2>

                      <p className="font-label-sm text-on-surface-variant tracking-normal">
                        Upload dokumen untuk melengkapi pengajuan.
                      </p>

                    </div>

                  </div>


                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* KTP */}
                    <div>

                      <label className="font-label-md text-on-surface block mb-2">
                        Kartu Tanda Penduduk (KTP)
                      </label>

                      <input
                        type="file"
                        name="dokumenKtp"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf"
                        required
                        className="w-full p-3 rounded-xl border border-outline-variant/40 bg-surface"
                      />

                      <p className="font-label-sm text-on-surface-variant mt-2 tracking-normal">
                        JPG, PNG atau PDF
                      </p>

                    </div>


                    {/* KK */}
                    <div>

                      <label className="font-label-md text-on-surface block mb-2">
                        Kartu Keluarga (KK)
                      </label>

                      <input
                        type="file"
                        name="dokumenKK"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf"
                        required
                        className="w-full p-3 rounded-xl border border-outline-variant/40 bg-surface"
                      />

                      <p className="font-label-sm text-on-surface-variant mt-2 tracking-normal">
                        JPG, PNG atau PDF
                      </p>

                    </div>


                    {/* FOTO USAHA */}
                    <div className="md:col-span-2">

                      <label className="font-label-md text-on-surface block mb-2">
                        Foto Tempat / Kegiatan Usaha
                      </label>

                      <input
                        type="file"
                        name="fotoUsaha"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png"
                        className="w-full p-3 rounded-xl border border-outline-variant/40 bg-surface"
                      />

                      <p className="font-label-sm text-on-surface-variant mt-2 tracking-normal">
                        Upload foto tempat atau kegiatan usaha. Format JPG atau PNG.
                      </p>

                    </div>

                  </div>

                </section>


                {/* =================================================
                    SUBMIT
                ================================================= */}
                <div className="border-t border-outline-variant/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">

                  <p className="font-label-sm text-on-surface-variant tracking-normal">
                    Pastikan seluruh data yang diisi sudah benar.
                  </p>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-white font-label-md font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-2"
                  >

                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '20px' }}
                    >
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

export default SkuPage;
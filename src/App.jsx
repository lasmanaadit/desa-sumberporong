import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Berita from './pages/BeritaPage';
import UmkmPage from './pages/UmkmPage' 
import StatistikPage from './pages/StatistikPage';
import GaleriPage from './pages/GaleriPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AjukanUmkmPage from './pages/dashboard/AjukanUmkmPage';
import UmkmSayaPage from './pages/dashboard/UmkmSayaPage';
import PengajuanAdministrasi from './pages/PengajuanAdministrasi';
import KtpPage from './pages/pengajuan/KtpPage';
import SkuPage from './pages/pengajuan/SkuPage';
import RiwayatPengajuan from './pages/RiwayatPengajuan';
import LayananPage from './pages/LayananPage';
import LayananDetailPage from './pages/LayananDetailPage';
import DetailUmkmPage from './pages/dashboard/DetailUmkmPage';
import EditUmkmPage from './pages/dashboard/EditUmkmPage';
import UmkmDetailPage from './pages/UmkmDetailPage';
import PengaduanPage from './pages/dashboard/PengaduanPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/umkm" element={<UmkmPage />} />
        <Route path="/statistik" element={<StatistikPage />} />
        <Route path="/galeri" element={<GaleriPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/dashboard" element={<UserDashboard/>} />
        <Route path="/dashboard/umkm" element={<UmkmSayaPage/>} />
        <Route path="/dashboard/umkm/tambah" element={<AjukanUmkmPage/>} />
        <Route path="/dashboard/pengajuan" element={<PengajuanAdministrasi/>} />
        <Route path="/dashboard/pengajuan/ktp" element={<KtpPage/>} />
        <Route path="/dashboard/pengajuan/sku" element={<SkuPage/>} />
        <Route path="/dashboard/riwayat" element={<RiwayatPengajuan/>} />
        <Route path="/layanan" element={<LayananPage/>} />
        <Route path="/layanan/:slug" element={<LayananDetailPage/>}/>
        <Route path="/dashboard/umkm/detail/:id" element={<DetailUmkmPage />} />
        <Route path="/dashboard/umkm/edit/:id" element={<EditUmkmPage />} />
        <Route path="/umkm/:id" element={<UmkmDetailPage />} />
        <Route path="/dashboard/pengaduan" element={<PengaduanPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
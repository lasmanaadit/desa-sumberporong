import React from 'react';

import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import { useAuth } from './auth/AuthContext';

/*
|--------------------------------------------------------------------------
| Public / User
|--------------------------------------------------------------------------
*/

import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Berita from './pages/BeritaPage';
import UmkmPage from './pages/UmkmPage';
import StatistikPage from './pages/StatistikPage';
import GaleriPage from './pages/GaleriPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

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
import RiwayatPengaduan from './pages/dashboard/RiwayatPengaduan';

import BeritaDetailPage from './pages/BeritaDetailPage';
import DashboardLayout from './layouts/DashboardLayout';

// Edit Profil User
import UserEditProfilePage from './pages/dashboard/EditProfilePage';

// Halaman Statis / Informasi
import PengaduanMasyarakatPage from './pages/PengaduanMasyarakatPage';
import KebijakanPrivasiPage from './pages/KebijakanPrivasiPage';
import SyaratKetentuanPage from './pages/SyaratKetentuanPage';
import BantuanPage from './pages/BantuanPage';
import CreditsPage from './pages/CreditsPage';

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHero from './pages/admin/AdminHero';
import AdminSambutan from './pages/admin/AdminSambutan';
import AdminStrukturOrganisasi from './pages/admin/AdminStrukturOrganisasi';
import AdminPerangkatDesa from './pages/admin/AdminPerangkatDesa';
import AdminBerita from './pages/admin/AdminBerita';
import AdminProfileDesa from './pages/admin/AdminProfileDesa';
import AdminStatistik from './pages/admin/AdminStatistik';
import AdminGaleri from './pages/admin/AdminGaleri';

import AdminPengajuanKtp from './pages/admin/AdminPengajuanKtp';
import AdminPengajuanSku from './pages/admin/AdminPengajuanSku';
import AdminPengaduan from './pages/admin/AdminPengaduan';
import AdminUmkmApproval from './pages/admin/AdminUmkmApproval';
import AdminManageAdmins from './pages/admin/AdminManageAdmins';
import AdminKritikSaran from './pages/admin/AdminKritikSaran';

import AdminLayout from './layouts/AdminLayout';

// Edit Profil Admin
import AdminEditProfilePage from './pages/admin/EditProfilePage';

/*
|--------------------------------------------------------------------------
| Super Admin
|--------------------------------------------------------------------------
*/

import SuperAdminLayout from './layouts/SuperAdminLayout';

import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import SuperAdminHero from './pages/superadmin/SuperAdminHero';
import SuperAdminSambutan from './pages/superadmin/SuperAdminSambutan';
import SuperAdminPerangkatDesa from './pages/superadmin/SuperAdminPerangkatDesa';
import SuperAdminBerita from './pages/superadmin/SuperAdminBerita';
import SuperAdminStatistik from './pages/superadmin/SuperAdminStatistik';
import SuperAdminGaleri from './pages/superadmin/SuperAdminGaleri';
import SuperAdminKritikSaran from './pages/superadmin/SuperAdminKritikSaran';

import SuperAdminPengajuanKtp from './pages/superadmin/SuperAdminPengajuanKtp';
import SuperAdminPengajuanSku from './pages/superadmin/SuperAdminPengajuanSku';
import SuperAdminPengaduan from './pages/superadmin/SuperAdminPengaduan';
import SuperAdminUmkmApproval from './pages/superadmin/SuperAdminUmkmApproval';

import SuperAdminUsers from './pages/superadmin/SuperAdminUsers';
import SuperAdminRoles from './pages/superadmin/SuperAdminRoles';
import SuperAdminAuditLogs from './pages/superadmin/SuperAdminAuditLogs';

// Edit Profil Superadmin
import SuperAdminEditProfilePage from './pages/superadmin/EditProfilePage';

/*
|--------------------------------------------------------------------------
| Auth Loading Screen
|--------------------------------------------------------------------------
*/

const AuthLoadingScreen = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span
          className="material-symbols-outlined animate-spin text-primary"
          style={{ fontSize: '36px' }}
        >
          progress_activity
        </span>

        <p className="font-body-md text-on-surface-variant">
          Memeriksa sesi...
        </p>
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Protected Route
|--------------------------------------------------------------------------
*/

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

/*
|--------------------------------------------------------------------------
| Role Route
|--------------------------------------------------------------------------
*/

const RoleRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const roleName = user?.role?.name;

  if (!allowedRoles.includes(roleName)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

/*
|--------------------------------------------------------------------------
| Root Redirect Berdasarkan Role
|--------------------------------------------------------------------------
*/

const RoleHomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const roleName = user?.role?.name;

  if (roleName === 'superadmin') {
    return <Navigate to="/superadmin" replace />;
  }

  if (roleName === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/

function App() {
  return (
    <Routes>
      {/*
        ==========================
        PUBLIC ROUTES
        ==========================
      */}

      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/berita" element={<Berita />} />
      <Route path="/berita/:slug" element={<BeritaDetailPage />} />

      <Route path="/umkm" element={<UmkmPage />} />
      <Route path="/umkm/:id" element={<UmkmDetailPage />} />

      <Route path="/statistik" element={<StatistikPage />} />
      <Route path="/galeri" element={<GaleriPage />} />

      {/* AUTHENTICATION */}

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* PUBLIC SERVICE */}

      <Route path="/layanan" element={<LayananPage />} />
      <Route path="/layanan/:slug" element={<LayananDetailPage />} />

      {/* HALAMAN INFORMASI / STATIS */}

      <Route path="/pengaduan-masyarakat" element={<PengaduanMasyarakatPage />} />
      <Route path="/kebijakan-privasi" element={<KebijakanPrivasiPage />} />
      <Route path="/syarat-ketentuan" element={<SyaratKetentuanPage />} />
      <Route path="/bantuan" element={<BantuanPage />} />
      <Route path="/credits" element={<CreditsPage />} />

      {/*
        ==========================
        AUTHENTICATED USER
        ==========================
      */}

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* UMKM */}
          <Route path="/dashboard/umkm" element={<UmkmSayaPage />} />
          <Route path="/dashboard/umkm/tambah" element={<AjukanUmkmPage />} />
          <Route path="/dashboard/umkm/detail/:id" element={<DetailUmkmPage />} />
          <Route path="/dashboard/umkm/edit/:id" element={<EditUmkmPage />} />

          {/* Pengajuan */}
          <Route path="/dashboard/pengajuan" element={<PengajuanAdministrasi />} />
          <Route path="/dashboard/pengajuan/ktp" element={<KtpPage />} />
          <Route path="/dashboard/pengajuan/sku" element={<SkuPage />} />
          <Route path="/dashboard/riwayat" element={<RiwayatPengajuan />} />

          {/* Pengaduan */}
          <Route path="/dashboard/pengaduan" element={<PengaduanPage />} />
          <Route path="/dashboard/pengaduan/riwayat" element={<RiwayatPengaduan />} />

          {/* Edit Profil */}
          <Route path="edit-profile" element={<UserEditProfilePage />} />
        </Route>
      </Route>

      {/*
        ==========================
        ADMIN ROUTES (Admin + Super Admin)
        ==========================
      */}

      <Route
        element={
          <RoleRoute allowedRoles={['admin', 'superadmin']} />
        }
      >
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          {/* HOMEPAGE MANAGEMENT */}
          <Route path="hero" element={<AdminHero />} />
          <Route path="sambutan" element={<AdminSambutan />} />
          <Route path="struktur-organisasi" element={<AdminStrukturOrganisasi />} />
          <Route path="perangkat-desa" element={<AdminPerangkatDesa />} />

          {/* BERITA */}
          <Route path="berita" element={<AdminBerita />} />

          {/* DESA */}
          <Route path="profil-desa" element={<AdminProfileDesa />} />
          <Route path="statistik" element={<AdminStatistik />} />
          <Route path="galeri" element={<AdminGaleri />} />

          {/* PENGAJUAN */}
          <Route path="pengajuan/ktp" element={<AdminPengajuanKtp />} />
          <Route path="pengajuan/sku" element={<AdminPengajuanSku />} />

          {/* UMKM */}
          <Route path="umkm" element={<AdminUmkmApproval />} />

          {/* PENGADUAN */}
          <Route path="pengaduan" element={<AdminPengaduan />} />

          {/* ADMIN MANAGEMENT */}
          <Route path="manage-admins" element={<AdminManageAdmins />} />

          {/* KRITIK & SARAN */}
          <Route path="kritik-saran" element={<AdminKritikSaran />} />

          {/* EDIT PROFIL */}
          <Route path="edit-profile" element={<AdminEditProfilePage />} />
        </Route>
      </Route>

      {/*
        ==========================
        SUPERADMIN ROUTES
        ==========================
      */}

      <Route
        element={
          <RoleRoute allowedRoles={['superadmin']} />
        }
      >
        <Route path="/superadmin" element={<SuperAdminLayout />}>
          <Route index element={<SuperAdminDashboard />} />

          {/* HOMEPAGE MANAGEMENT */}
          <Route path="hero" element={<SuperAdminHero />} />
          <Route path="sambutan" element={<SuperAdminSambutan />} />
          <Route path="perangkat-desa" element={<SuperAdminPerangkatDesa />} />

          {/* BERITA */}
          <Route path="berita" element={<SuperAdminBerita />} />

          {/* STATISTIK */}
          <Route path="statistik" element={<SuperAdminStatistik />} />

          {/* GALERI */}
          <Route path="galeri" element={<SuperAdminGaleri />} />

          {/* KRITIK & SARAN */}
          <Route path="kritik-saran" element={<SuperAdminKritikSaran />} />

          {/* PENGAJUAN */}
          <Route path="pengajuan/ktp" element={<SuperAdminPengajuanKtp />} />
          <Route path="pengajuan/sku" element={<SuperAdminPengajuanSku />} />
          <Route path="pengajuan/pengaduan" element={<SuperAdminPengaduan />} />
          <Route path="pengajuan/umkm" element={<SuperAdminUmkmApproval />} />

          {/* SUPER ADMIN SYSTEM */}
          <Route path="users" element={<SuperAdminUsers />} />
          <Route path="roles" element={<SuperAdminRoles />} />
          <Route path="audit-logs" element={<SuperAdminAuditLogs />} />

          {/* EDIT PROFIL */}
          <Route path="edit-profile" element={<SuperAdminEditProfilePage />} />
        </Route>
      </Route>

      {/* FALLBACK */}

      <Route path="*" element={<RoleHomeRedirect />} />
    </Routes>
  );
}

export default App;
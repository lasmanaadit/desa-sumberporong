import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Berita from './pages/BeritaPage';
import UmkmPage from './pages/UmkmPage' 
import StatistikPage from './pages/StatistikPage';
import GaleriPage from './pages/GaleriPage';
import LoginPage from './pages/LoginPage';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
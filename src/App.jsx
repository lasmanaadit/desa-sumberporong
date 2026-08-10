import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Berita from './pages/BeritaPage';
import UmkmPage from './pages/UmkmPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/umkm" element={<UmkmPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
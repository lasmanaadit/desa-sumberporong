import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SambutanKepalaDesa from '../components/SambutanKepalaDesa';
import VisiMisi from '../components/VisiMisi';
import StrukturOrganisasi from '../components/StrukturOrganisasi';
import AdministrasiPenduduk from '../components/AdministrasiPenduduk';
import PetaDesa from '../components/PetaDesa';
import Berita from '../components/Berita';
import ProdukUMKM from '../components/ProdukUMKM';
import Galeri from '../components/Galeri';
import KritikSaran from '../components/KritikSaran';
import Footer from '../components/Footer';
import HeroSlider from '../components/HeroSlider';

function HomePage() {
  return (
    <div className="bg-background text-on-surface font-body-md antialiased pt-18">
      <Navbar />
      <HeroSlider /> 
      <SambutanKepalaDesa />
      <VisiMisi />
      <StrukturOrganisasi />
      <AdministrasiPenduduk />
      <PetaDesa />
      <Berita />
      <ProdukUMKM />
      <Galeri />
      <KritikSaran />
      <Footer />
    </div>
  );
}

export default HomePage;
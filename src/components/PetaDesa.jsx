import React from 'react';

const PetaDesa = () => {
  return (
    <section className="py-xl bg-surface">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Peta Desa</h2>
        <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-xl"></div>
        <div className="rounded-xl overflow-hidden shadow-sm h-100 bg-surface border border-outline-variant/20">
          <iframe
            title="Peta Desa Sumberporong"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16359.272430573976!2d112.70952703598562!3d-7.8243766998092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7d3565cbee90b%3A0xc3846cde21b082ab!2sSumber%20Porong%2C%20Kec.%20Lawang%2C%20Kabupaten%20Malang%2C%20Jawa%20Timur!5e1!3m2!1sid!2sid!4v1786359905719!5m2!1sid!2sid"
            style={{ border: 0, width: '100%', height: '100%' }}
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default PetaDesa;
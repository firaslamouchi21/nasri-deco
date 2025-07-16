import { useEffect, useState, useRef } from 'react';
import { fetchGallery } from '../services/api';

const PLACEHOLDER_IMAGES = [
  { id: 1, before_img: '/test-avant.jpg', after_img: '/test-apres.jpg', title: 'Projet Exemple', category: 'Salon' },
];

export default function GalleryCarousel() {
  const [gallery, setGallery] = useState([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    fetchGallery()
      .then(data => setGallery(data.length ? data : PLACEHOLDER_IMAGES))
      .catch(() => setGallery(PLACEHOLDER_IMAGES));
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent(c => (gallery.length ? (c + 1) % gallery.length : 0));
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, [gallery]);

  if (!gallery.length) return null;

  const item = gallery[current];

  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Avant / Après</h2>
        <p className="text-gray-600">Découvrez nos réalisations en staff et plâtre.</p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
        <div className="w-full md:w-1/2 transition-all duration-700">
          <img src={item.before_img} alt="Avant" className="rounded-xl shadow-lg w-full h-64 object-cover mb-2" />
          <div className="text-center text-gray-500 text-sm">Avant</div>
        </div>
        <div className="w-full md:w-1/2 transition-all duration-700">
          <img src={item.after_img} alt="Après" className="rounded-xl shadow-lg w-full h-64 object-cover mb-2" />
          <div className="text-center text-gray-500 text-sm">Après</div>
        </div>
      </div>
      <div className="flex justify-center mt-6 gap-2">
        {gallery.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-primary' : 'bg-gray-300'} transition`}
            onClick={() => setCurrent(idx)}
            aria-label={`Voir projet ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
} 
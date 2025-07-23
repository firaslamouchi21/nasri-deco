import HeroSection from '../components/HeroSection';
import GalleryCarousel from '../components/GalleryCarousel';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import { useState } from 'react';
import api from '../services/api';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-white">
      <HeroSection />
      <ServicesSection />
      <GalleryCarousel />
      <TestimonialsSection />
      {/* Contact Section as Footer */}
      <section className="bg-white mt-12 border-t pt-12 pb-8 px-4 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-primary">Contact</h2>
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1 space-y-4">
            <div>
              <span className="font-semibold text-gray-700">Téléphone: </span>
              <a href="tel:27211847" className="text-primary font-bold hover:underline">27211847</a>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Email: </span>
              <a href="mailto:firas.lamou@gmail.com" className="text-primary font-bold hover:underline">firas.lamou@gmail.com</a>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Adresse: </span>
              <span className="text-gray-800">Lafayette, Tunis</span>
            </div>
          </div>
          <div className="flex-1 w-full aspect-video">
            <iframe
              title="Google Maps - Lafayette Tunis"
              className="w-full h-64 md:h-full rounded-xl border"
              src="https://www.google.com/maps?q=36.8635,10.1881&z=15&output=embed"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
        <div className="w-full max-w-2xl bg-gray-50 rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4 text-primary">Envoyez-nous un message</h3>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ full_name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.full_name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Tous les champs sont obligatoires.');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Email invalide.');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSuccess('Message envoyé avec succès!');
      setForm({ full_name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'envoi du message.");
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        name="full_name"
        value={form.full_name}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        placeholder="Nom complet"
        required
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        placeholder="Email"
        type="email"
        required
      />
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        placeholder="Message"
        rows={4}
        required
      />
      <button
        type="submit"
        className="px-6 py-2 bg-primary text-white rounded disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </form>
  );
} 
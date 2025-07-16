import { useState } from 'react';
import api from '../services/api';

export default function Order() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', details: '', image: null });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const res = await api.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(res.data.message);
      setForm({ name: '', email: '', phone: '', details: '', image: null });
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la soumission.');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-4">Demande de Projet</h2>
      <form className="space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Nom" required />
        <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Email" required />
        <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Téléphone" required />
        <textarea name="details" value={form.details} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Détails du projet" required />
        <input name="image" type="file" accept="image/*" onChange={handleChange} className="w-full" required />
        <button className="px-6 py-2 bg-primary text-white rounded">Envoyer</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </form>
    </div>
  );
} 
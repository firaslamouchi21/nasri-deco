import { Link } from 'react-router-dom';

export default function ServicesSection() {
  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">Nos Services</h2>
        <div className="grid gap-8 md:grid-cols-4 sm:grid-cols-2">
          <div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-semibold text-lg mb-2 text-primary">Décoration Int&Ext</h3>
            <p className="text-gray-600 text-center">Création de moulures, corniches, colonnes et ornements en plâtre sur mesure.</p>
          </div>
          <div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">🏛️</div>
            <h3 className="font-semibold text-lg mb-2 text-primary">Placo Plâtre</h3>
            <p className="text-gray-600 text-center">Installation de plafonds artistiques et faux plafonds pour tous types d'espaces.</p>
          </div>
          <div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">🖼️</div>
            <h3 className="font-semibold text-lg mb-2 text-primary">Faux Plafonds</h3>
            <p className="text-gray-600 text-center">Rénovation de décors anciens et restauration de staff abîmé ou fissuré.</p>
          </div>
          <div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">🏠</div>
            <h3 className="font-semibold text-lg mb-2 text-primary">Peinture</h3>
            <p className="text-gray-600 text-center">Accompagnement personnalisé pour sublimer votre intérieur selon vos envies.</p>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <Link to="/order" className="px-8 py-4 text-lg bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition border-2 border-primary">
            Demander un devis
          </Link>
        </div>
      </div>
    </section>
  );
} 